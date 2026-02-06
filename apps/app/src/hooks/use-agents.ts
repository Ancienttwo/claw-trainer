/**
 * Hook to query all minted NFA agents.
 * Strategy: API-first with on-chain fallback.
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
import { apiFetch } from "../lib/api"

const MINT_EVENT = parseAbiItem(
  "event NFAMinted(uint256 indexed tokenId, address indexed owner, address indexed agentWallet, string tokenURI)",
)

const CONTRACT_DEPLOY_BLOCK = 88_823_136n
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

interface ApiAgent {
  token_id: string
  name: string
  owner: string
  agent_wallet: string
  level: number
  stage: string
  capabilities: string
  version: string
}

function apiToAgent(a: ApiAgent): AgentListItem {
  return {
    tokenId: BigInt(a.token_id),
    name: a.name,
    owner: a.owner as Address,
    agentWallet: a.agent_wallet as Address,
    level: a.level,
    stage: a.stage,
    capabilities: a.capabilities ? a.capabilities.split(",").map((s) => s.trim()) : [],
    version: a.version,
  }
}

async function fetchFromApi(): Promise<AgentListItem[]> {
  const data = await apiFetch<{ agents: ApiAgent[] }>("/agents?limit=100")
  return data.agents.map(apiToAgent)
}

interface MintLog {
  args: {
    tokenId: bigint
    owner: Address
    agentWallet: Address
    tokenURI: string
  }
}

function parseMintLog(log: MintLog): AgentListItem | null {
  const { tokenId, owner, agentWallet, tokenURI } = log.args
  const metadata = decodeTokenUri(tokenURI)
  if (!metadata) return null
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

async function fetchFromChain(client: PublicClient): Promise<AgentListItem[]> {
  const logs = await client.getLogs({
    address: IDENTITY_REGISTRY_ADDRESS,
    event: MINT_EVENT,
    fromBlock: CONTRACT_DEPLOY_BLOCK,
    toBlock: "latest",
  })
  const agents = logs
    .map((log) => parseMintLog(log as unknown as MintLog))
    .filter((a): a is AgentListItem => a !== null)
  return fetchAgentLevels(client, agents)
}

export function useAgents() {
  const publicClient = usePublicClient()

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      try {
        return await fetchFromApi()
      } catch {
        if (!publicClient) throw new Error("No public client available")
        return fetchFromChain(publicClient)
      }
    },
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
