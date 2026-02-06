import { createPublicClient, http, parseAbiItem, type Address, type Log, type PublicClient } from "viem"
import { bscTestnet } from "viem/chains"
import { eq, sql } from "drizzle-orm"
import { agents, trainers, activities, syncState } from "../db/schema"
import type { Database } from "../db/client"
import type { Bindings } from "../types"

const MINT_EVENT = parseAbiItem(
  "event NFAMinted(uint256 indexed tokenId, address indexed owner, address indexed agentWallet, string tokenURI)",
)
const LEVEL_UP_EVENT = parseAbiItem(
  "event AgentLevelUp(uint256 indexed tokenId, uint8 newLevel)",
)

const INITIAL_BLOCK_RANGE = 1000n
const MIN_BLOCK_RANGE = 50n
const DATA_URI_PREFIX = "data:application/json;base64,"

interface NfaAttribute {
  trait_type: string
  value: string | number
}

interface NfaMetadata {
  name: string
  description: string
  attributes: NfaAttribute[]
}

function decodeTokenUri(dataUri: string): NfaMetadata | null {
  try {
    const base64 = dataUri.replace(DATA_URI_PREFIX, "")
    const binary = atob(base64)
    const bytes = Uint8Array.from(binary, (c) => c.codePointAt(0) ?? 0)
    return JSON.parse(new TextDecoder().decode(bytes)) as NfaMetadata
  } catch {
    return null
  }
}

function findAttr(m: NfaMetadata, trait: string): string | number | undefined {
  return m.attributes.find((a) => a.trait_type === trait)?.value
}

function getAgentName(m: NfaMetadata): string {
  return m.name.startsWith("NFA: ") ? m.name.slice(5) : m.name
}

async function getLastSyncedBlock(db: Database): Promise<bigint | null> {
  const [row] = await db
    .select()
    .from(syncState)
    .where(eq(syncState.key, "last_synced_block"))
    .limit(1)
  return row ? BigInt(row.value) : null
}

async function updateLastSyncedBlock(db: Database, block: bigint) {
  await db
    .insert(syncState)
    .values({ key: "last_synced_block", value: block.toString() })
    .onConflictDoUpdate({
      target: syncState.key,
      set: { value: block.toString() },
    })
}

function parseMintRow(log: Log<bigint, number, false, typeof MINT_EVENT>) {
  const { tokenId, owner, agentWallet, tokenURI } = log.args
  if (!tokenId || !owner || !agentWallet || !tokenURI) return null

  const metadata = decodeTokenUri(tokenURI)
  const name = metadata ? getAgentName(metadata) : `Agent-${tokenId}`
  const now = new Date().toISOString()

  return {
    agent: {
      tokenId: tokenId.toString(),
      name,
      owner: owner.toLowerCase(),
      agentWallet: agentWallet.toLowerCase(),
      level: Number(metadata ? (findAttr(metadata, "Level") ?? 1) : 1),
      stage: String(metadata ? (findAttr(metadata, "Stage") ?? "Rookie") : "Rookie"),
      capabilities: String(metadata ? (findAttr(metadata, "Capabilities") ?? "") : ""),
      version: String(metadata ? (findAttr(metadata, "Version") ?? "1.0.0") : "1.0.0"),
      description: metadata?.description ?? "",
      tokenUri: tokenURI,
      mintedAt: now,
      blockNumber: (log.blockNumber ?? 0n).toString(),
      txHash: log.transactionHash ?? "",
    },
    ownerWallet: owner.toLowerCase(),
    activity: {
      type: "mint" as const,
      wallet: owner.toLowerCase(),
      tokenId: tokenId.toString(),
      blockNumber: (log.blockNumber ?? 0n).toString(),
      txHash: log.transactionHash ?? "",
    },
  }
}

async function processMintLogs(db: Database, logs: ReadonlyArray<Log<bigint, number, false, typeof MINT_EVENT>>) {
  const parsed = logs.map(parseMintRow).filter((r) => r !== null)
  if (parsed.length === 0) return 0

  const now = new Date().toISOString()

  await db.insert(agents).values(parsed.map((p) => p.agent)).onConflictDoNothing()
  await db.insert(activities).values(parsed.map((p) => p.activity))

  const uniqueOwners = [...new Set(parsed.map((p) => p.ownerWallet))]
  for (const wallet of uniqueOwners) {
    await db
      .insert(trainers)
      .values({ wallet, agentCount: 1, totalMints: 1, firstSeen: now, lastSeen: now })
      .onConflictDoUpdate({
        target: trainers.wallet,
        set: {
          agentCount: sql`${trainers.agentCount} + 1`,
          totalMints: sql`${trainers.totalMints} + 1`,
          lastSeen: now,
        },
      })
  }

  return parsed.length
}

async function processLevelUpLogs(db: Database, logs: ReadonlyArray<Log<bigint, number, false, typeof LEVEL_UP_EVENT>>) {
  let count = 0
  for (const log of logs) {
    const { tokenId, newLevel } = log.args
    if (!tokenId || newLevel === undefined) continue

    await db
      .update(agents)
      .set({ level: newLevel, updatedAt: new Date().toISOString() })
      .where(eq(agents.tokenId, tokenId.toString()))

    await db.insert(activities).values({
      type: "level_up",
      tokenId: tokenId.toString(),
      metadata: JSON.stringify({ newLevel }),
      blockNumber: (log.blockNumber ?? 0n).toString(),
      txHash: log.transactionHash ?? "",
    })
    count++
  }
  return count
}

async function findMaxRange(
  client: PublicClient,
  address: Address,
  fromBlock: bigint,
  maxToBlock: bigint,
): Promise<bigint> {
  let range = maxToBlock - fromBlock
  while (range >= MIN_BLOCK_RANGE) {
    try {
      await client.getLogs({ address, fromBlock, toBlock: fromBlock + range })
      return fromBlock + range
    } catch (err: unknown) {
      const isRateLimit = err instanceof Error && err.message.includes("limit")
      if (!isRateLimit) throw err
      range = range / 2n
    }
  }
  return fromBlock
}

export async function syncEvents(
  db: Database,
  env: Bindings,
): Promise<{ synced: number; fromBlock: string; toBlock: string }> {
  const client = createPublicClient({
    chain: bscTestnet,
    transport: http(env.BSC_RPC_URL),
  })

  const contractAddress = env.IDENTITY_REGISTRY_ADDRESS as Address
  const deployBlock = BigInt(env.CONTRACT_DEPLOY_BLOCK)
  const lastSynced = await getLastSyncedBlock(db)
  const fromBlock = lastSynced ? lastSynced + 1n : deployBlock
  const latestBlock = await client.getBlockNumber()

  if (fromBlock > latestBlock) {
    return { synced: 0, fromBlock: fromBlock.toString(), toBlock: latestBlock.toString() }
  }

  const maxToBlock = latestBlock - fromBlock > INITIAL_BLOCK_RANGE
    ? fromBlock + INITIAL_BLOCK_RANGE
    : latestBlock

  const toBlock = await findMaxRange(client, contractAddress, fromBlock, maxToBlock)

  if (toBlock <= fromBlock) {
    return { synced: 0, fromBlock: fromBlock.toString(), toBlock: fromBlock.toString() }
  }

  const [mintLogs, levelUpLogs] = await Promise.all([
    client.getLogs({ address: contractAddress, event: MINT_EVENT, fromBlock, toBlock }),
    client.getLogs({ address: contractAddress, event: LEVEL_UP_EVENT, fromBlock, toBlock }),
  ])

  const mintCount = await processMintLogs(db, mintLogs)
  const levelUpCount = await processLevelUpLogs(db, levelUpLogs)
  await updateLastSyncedBlock(db, toBlock)

  return {
    synced: mintCount + levelUpCount,
    fromBlock: fromBlock.toString(),
    toBlock: toBlock.toString(),
  }
}
