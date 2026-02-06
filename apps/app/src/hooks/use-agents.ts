/**
 * Hook to query all minted NFA agents from on-chain events.
 */

import { useQuery } from "@tanstack/react-query"
import { usePublicClient } from "wagmi"
import type { Address, PublicClient } from "viem"
import { parseAbiItem } from "viem"
import {
  IDENTITY_REGISTRY_ADDRESS,
  IDENTITY_REGISTRY_ABI,
} from "../lib/contract"
import {
  decodeTokenUri,
  getAgentName,
  getCapabilities,
  getLevel,
  getStage,
  getVersion,
} from "../lib/decode-token-uri"

const MINT_EVENT = parseAbiItem(
  "event NFAMinted(uint256 indexed tokenId, address indexed owner, address indexed agentWallet, string tokenURI)",
)

const GENESIS_BLOCK = 0n
const QUERY_KEY = "agents-list"

export interface AgentListItem {
  tokenId: bigint
  name: string
  owner: Address
  agentWallet: Address
  level: number
  stage: string
  capabilities: string[]
  version: string
}

interface MintLog {
  args: {
    tokenId: bigint
    owner: Address
    agentWallet: Address
    tokenURI: string
  }
}

function parseMintLog(log: MintLog): AgentListItem {
  const { tokenId, owner, agentWallet, tokenURI } = log.args
  const metadata = decodeTokenUri(tokenURI)
  return {
    tokenId,
    name: getAgentName(metadata),
    owner,
    agentWallet,
    level: getLevel(metadata),
    stage: getStage(metadata),
    capabilities: getCapabilities(metadata),
    version: getVersion(metadata),
  }
}

async function fetchAgentLevels(
  client: PublicClient,
  agents: AgentListItem[],
): Promise<AgentListItem[]> {
  if (agents.length === 0) return agents

  const calls = agents.map((agent) => ({
    address: IDENTITY_REGISTRY_ADDRESS,
    abi: IDENTITY_REGISTRY_ABI,
    functionName: "agentLevels" as const,
    args: [agent.tokenId] as const,
  }))

  const results = await client.multicall({ contracts: calls })

  return agents.map((agent, i) => {
    const result = results[i]
    if (result?.status === "success" && typeof result.result === "number") {
      return { ...agent, level: result.result }
    }
    return agent
  })
}

async function fetchAllAgents(
  client: PublicClient,
): Promise<AgentListItem[]> {
  const logs = await client.getLogs({
    address: IDENTITY_REGISTRY_ADDRESS,
    event: MINT_EVENT,
    fromBlock: GENESIS_BLOCK,
    toBlock: "latest",
  })

  const agents = logs.map((log) => parseMintLog(log as unknown as MintLog))
  return fetchAgentLevels(client, agents)
}

export function useAgents() {
  const publicClient = usePublicClient()

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => {
      if (!publicClient) throw new Error("No public client available")
      return fetchAllAgents(publicClient)
    },
    enabled: !!publicClient,
    staleTime: 30_000,
  })

  return {
    agents: data ?? [],
    isLoading,
    isError,
    error,
    refetch,
  }
}
