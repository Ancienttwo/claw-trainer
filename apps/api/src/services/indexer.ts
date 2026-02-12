import { createPublicClient, http, parseAbiItem, type Address, type Log, type PublicClient } from "viem"
import { bscTestnet } from "viem/chains"
import { eq, and, sql } from "drizzle-orm"
import { agents, trainers, activities, syncState, reputationFeedback } from "../db/schema"
import type { Database } from "../db/client"
import type { Bindings } from "../types"

// ─── Legacy IdentityRegistry Events ─────────────────────
const MINT_EVENT = parseAbiItem(
  "event NFAMinted(uint256 indexed tokenId, address indexed owner, address indexed agentWallet, string tokenURI)",
)
const LEVEL_UP_EVENT = parseAbiItem(
  "event AgentLevelUp(uint256 indexed tokenId, uint8 newLevel)",
)

// ─── ClawTrainerNFA (BAP-578) Events ────────────────────
const NFA_ACTIVATED_EVENT = parseAbiItem(
  "event NFAActivated(uint256 indexed tokenId, uint256 indexed erc8004AgentId, address indexed owner)",
)
const STATUS_CHANGED_EVENT = parseAbiItem(
  "event StatusChanged(uint256 indexed tokenId, uint8 newStatus)",
)
const METADATA_UPDATED_EVENT = parseAbiItem(
  "event MetadataUpdated(uint256 indexed tokenId)",
)
const LEARNING_UPDATED_EVENT = parseAbiItem(
  "event LearningUpdated(uint256 indexed tokenId, bytes32 newRoot)",
)
const INTERACTION_RECORDED_EVENT = parseAbiItem(
  "event InteractionRecorded(uint256 indexed tokenId, string interactionType, bool success)",
)
const AGENT_FUNDED_EVENT = parseAbiItem(
  "event AgentFunded(uint256 indexed tokenId, uint256 amount)",
)

// ─── ERC-8004 ReputationRegistry Events ─────────────────
const NEW_FEEDBACK_EVENT = parseAbiItem(
  "event NewFeedback(uint256 indexed agentId, address indexed client, uint256 feedbackIndex, int128 value, uint8 valueDecimals, bytes32 tag1, bytes32 tag2)",
)
const FEEDBACK_REVOKED_EVENT = parseAbiItem(
  "event FeedbackRevoked(uint256 indexed agentId, uint256 indexed feedbackIndex)",
)

const STATUS_MAP: Record<number, string> = { 0: "Active", 1: "Paused", 2: "Terminated" }

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

// ─── BAP-578 Event Processors ───────────────────────────

async function processNfaActivatedLogs(
  db: Database,
  logs: ReadonlyArray<Log<bigint, number, false, typeof NFA_ACTIVATED_EVENT>>,
) {
  let count = 0
  for (const log of logs) {
    const { tokenId, erc8004AgentId, owner } = log.args
    if (tokenId === undefined || erc8004AgentId === undefined || !owner) continue

    await db
      .update(agents)
      .set({
        erc8004AgentId: erc8004AgentId.toString(),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(agents.tokenId, tokenId.toString()))

    await db.insert(activities).values({
      type: "nfa_activated",
      wallet: owner.toLowerCase(),
      tokenId: tokenId.toString(),
      metadata: JSON.stringify({ erc8004AgentId: erc8004AgentId.toString() }),
      blockNumber: (log.blockNumber ?? 0n).toString(),
      txHash: log.transactionHash ?? "",
    })
    count++
  }
  return count
}

async function processStatusChangedLogs(
  db: Database,
  logs: ReadonlyArray<Log<bigint, number, false, typeof STATUS_CHANGED_EVENT>>,
) {
  let count = 0
  for (const log of logs) {
    const { tokenId, newStatus } = log.args
    if (tokenId === undefined || newStatus === undefined) continue

    const statusStr = STATUS_MAP[newStatus] ?? "Active"
    await db
      .update(agents)
      .set({ status: statusStr, updatedAt: new Date().toISOString() })
      .where(eq(agents.tokenId, tokenId.toString()))

    await db.insert(activities).values({
      type: "status_changed",
      tokenId: tokenId.toString(),
      metadata: JSON.stringify({ status: statusStr }),
      blockNumber: (log.blockNumber ?? 0n).toString(),
      txHash: log.transactionHash ?? "",
    })
    count++
  }
  return count
}

async function processLearningUpdatedLogs(
  db: Database,
  logs: ReadonlyArray<Log<bigint, number, false, typeof LEARNING_UPDATED_EVENT>>,
) {
  let count = 0
  for (const log of logs) {
    const { tokenId, newRoot } = log.args
    if (tokenId === undefined || !newRoot) continue

    await db
      .update(agents)
      .set({
        learningRoot: newRoot,
        learningEvents: sql`${agents.learningEvents} + 1`,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(agents.tokenId, tokenId.toString()))
    count++
  }
  return count
}

async function processInteractionRecordedLogs(
  db: Database,
  logs: ReadonlyArray<Log<bigint, number, false, typeof INTERACTION_RECORDED_EVENT>>,
) {
  let count = 0
  for (const log of logs) {
    const { tokenId, interactionType, success } = log.args
    if (tokenId === undefined) continue

    await db
      .update(agents)
      .set({
        totalInteractions: sql`${agents.totalInteractions} + 1`,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(agents.tokenId, tokenId.toString()))

    await db.insert(activities).values({
      type: "interaction",
      tokenId: tokenId.toString(),
      metadata: JSON.stringify({ interactionType, success }),
      blockNumber: (log.blockNumber ?? 0n).toString(),
      txHash: log.transactionHash ?? "",
    })
    count++
  }
  return count
}

async function processAgentFundedLogs(
  db: Database,
  logs: ReadonlyArray<Log<bigint, number, false, typeof AGENT_FUNDED_EVENT>>,
) {
  let count = 0
  for (const log of logs) {
    const { tokenId, amount } = log.args
    if (tokenId === undefined || amount === undefined) continue

    await db
      .update(agents)
      .set({
        agentBalance: sql`CAST(COALESCE(CAST(${agents.agentBalance} AS INTEGER), 0) + ${amount.toString()} AS TEXT)`,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(agents.tokenId, tokenId.toString()))

    await db.insert(activities).values({
      type: "agent_funded",
      tokenId: tokenId.toString(),
      metadata: JSON.stringify({ amount: amount.toString() }),
      blockNumber: (log.blockNumber ?? 0n).toString(),
      txHash: log.transactionHash ?? "",
    })
    count++
  }
  return count
}

// ─── Reputation Event Processors ────────────────────────

async function processNewFeedbackLogs(
  db: Database,
  logs: ReadonlyArray<Log<bigint, number, false, typeof NEW_FEEDBACK_EVENT>>,
) {
  let count = 0
  for (const log of logs) {
    const { agentId, client, feedbackIndex, value, valueDecimals, tag1, tag2 } = log.args
    if (agentId === undefined || !client || feedbackIndex === undefined) continue

    await db.insert(reputationFeedback).values({
      agentId: agentId.toString(),
      clientAddress: client.toLowerCase(),
      feedbackIndex: Number(feedbackIndex),
      value: Number(value ?? 0),
      valueDecimals: Number(valueDecimals ?? 0),
      tag1: tag1 ?? null,
      tag2: tag2 ?? null,
      createdAt: new Date().toISOString(),
    }).onConflictDoNothing()
    count++
  }
  return count
}

async function processFeedbackRevokedLogs(
  db: Database,
  logs: ReadonlyArray<Log<bigint, number, false, typeof FEEDBACK_REVOKED_EVENT>>,
) {
  let count = 0
  for (const log of logs) {
    const { agentId, feedbackIndex } = log.args
    if (agentId === undefined || feedbackIndex === undefined) continue

    await db
      .update(reputationFeedback)
      .set({ isRevoked: 1 })
      .where(
        and(
          eq(reputationFeedback.agentId, agentId.toString()),
          eq(reputationFeedback.feedbackIndex, Number(feedbackIndex)),
        ),
      )
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

  const identityRegistry = env.IDENTITY_REGISTRY_ADDRESS as Address
  const nfaAddress = env.CLAWTRAINER_NFA_ADDRESS as Address
  const reputationAddress = env.ERC8004_REPUTATION_ADDRESS as Address
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

  const toBlock = await findMaxRange(client, identityRegistry, fromBlock, maxToBlock)

  if (toBlock <= fromBlock) {
    return { synced: 0, fromBlock: fromBlock.toString(), toBlock: fromBlock.toString() }
  }

  // Legacy IdentityRegistry events
  const [mintLogs, levelUpLogs] = await Promise.all([
    client.getLogs({ address: identityRegistry, event: MINT_EVENT, fromBlock, toBlock }),
    client.getLogs({ address: identityRegistry, event: LEVEL_UP_EVENT, fromBlock, toBlock }),
  ])

  const mintCount = await processMintLogs(db, mintLogs)
  const levelUpCount = await processLevelUpLogs(db, levelUpLogs)

  // BAP-578 ClawTrainerNFA events (skip if placeholder)
  let nfaCount = 0
  if (nfaAddress && !nfaAddress.startsWith("PLACEHOLDER")) {
    const [activatedLogs, statusLogs, learningLogs, interactionLogs, fundedLogs] = await Promise.all([
      client.getLogs({ address: nfaAddress, event: NFA_ACTIVATED_EVENT, fromBlock, toBlock }),
      client.getLogs({ address: nfaAddress, event: STATUS_CHANGED_EVENT, fromBlock, toBlock }),
      client.getLogs({ address: nfaAddress, event: LEARNING_UPDATED_EVENT, fromBlock, toBlock }),
      client.getLogs({ address: nfaAddress, event: INTERACTION_RECORDED_EVENT, fromBlock, toBlock }),
      client.getLogs({ address: nfaAddress, event: AGENT_FUNDED_EVENT, fromBlock, toBlock }),
    ])

    nfaCount += await processNfaActivatedLogs(db, activatedLogs)
    nfaCount += await processStatusChangedLogs(db, statusLogs)
    nfaCount += await processLearningUpdatedLogs(db, learningLogs)
    nfaCount += await processInteractionRecordedLogs(db, interactionLogs)
    nfaCount += await processAgentFundedLogs(db, fundedLogs)
  }

  // ERC-8004 Reputation events
  let repCount = 0
  if (reputationAddress) {
    const [feedbackLogs, revokedLogs] = await Promise.all([
      client.getLogs({ address: reputationAddress, event: NEW_FEEDBACK_EVENT, fromBlock, toBlock }),
      client.getLogs({ address: reputationAddress, event: FEEDBACK_REVOKED_EVENT, fromBlock, toBlock }),
    ])

    repCount += await processNewFeedbackLogs(db, feedbackLogs)
    repCount += await processFeedbackRevokedLogs(db, revokedLogs)
  }

  await updateLastSyncedBlock(db, toBlock)

  return {
    synced: mintCount + levelUpCount + nfaCount + repCount,
    fromBlock: fromBlock.toString(),
    toBlock: toBlock.toString(),
  }
}
