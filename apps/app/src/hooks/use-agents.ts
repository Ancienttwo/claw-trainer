/**
 * Hook to query all minted NFA agents.
 * Strategy: API-first with on-chain fallback.
 */

import { useQuery } from "@tanstack/react-query"
import { usePublicClient } from "wagmi"
import type { Address, PublicClient } from "viem"
import { parseAbiItem } from "viem"
import {
  ERC8004_IDENTITY_ADDRESS,
  ERC8004_IDENTITY_ABI,
  CLAWTRAINER_NFA_ADDRESS,
  CLAWTRAINER_NFA_ABI,
  CLAWTRAINER_NFA_DEPLOY_BLOCK,
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

const NFA_ACTIVATED_EVENT = parseAbiItem(
  "event NFAActivated(uint256 indexed tokenId, uint256 indexed erc8004AgentId, address indexed owner)",
)

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
  status?: string
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
  status?: string
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
    status: a.status,
  }
}

async function fetchFromApi(): Promise<AgentListItem[]> {
  const data = await apiFetch<{ agents: ApiAgent[] }>("/agents?limit=100")
  return data.agents.map(apiToAgent)
}

async function fetchFromChain(client: PublicClient): Promise<AgentListItem[]> {
  const logs = await client.getLogs({
    address: CLAWTRAINER_NFA_ADDRESS,
    event: NFA_ACTIVATED_EVENT,
    fromBlock: CLAWTRAINER_NFA_DEPLOY_BLOCK,
    toBlock: "latest",
  })

  const agents: AgentListItem[] = []

  for (const log of logs) {
    const tokenId = log.args.tokenId
    const erc8004Id = log.args.erc8004AgentId
    const owner = log.args.owner
    if (tokenId === undefined || erc8004Id === undefined || !owner) continue

    try {
      const [uri, wallet] = await Promise.all([
        client.readContract({
          address: ERC8004_IDENTITY_ADDRESS,
          abi: ERC8004_IDENTITY_ABI,
          functionName: "tokenURI",
          args: [erc8004Id],
        }) as Promise<string>,
        client.readContract({
          address: CLAWTRAINER_NFA_ADDRESS,
          abi: CLAWTRAINER_NFA_ABI,
          functionName: "agentWallets",
          args: [tokenId],
        }) as Promise<Address>,
      ])

      const metadata = decodeTokenUri(uri)
      if (!metadata) continue

      agents.push({
        tokenId,
        name: getAgentName(metadata),
        owner,
        agentWallet: wallet,
        level: getLevel(metadata),
        stage: getStage(metadata),
        capabilities: getCapabilities(metadata),
        version: getVersion(metadata),
      })
    } catch {
      continue
    }
  }

  return agents
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
