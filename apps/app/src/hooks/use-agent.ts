/**
 * Hook to query a single NFA agent by tokenId.
 * Strategy: API-first with on-chain fallback.
 */

import { useQuery } from "@tanstack/react-query"
import { usePublicClient } from "wagmi"
import { type Address, zeroAddress } from "viem"
import {
  ERC8004_IDENTITY_ADDRESS,
  ERC8004_IDENTITY_ABI,
  CLAWTRAINER_NFA_ADDRESS,
  CLAWTRAINER_NFA_ABI,
} from "../lib/contract"
import {
  type NfaMetadata,
  decodeTokenUri,
  getAgentName,
  getCapabilities,
  getLevel,
  getStage,
  getVersion,
} from "../lib/decode-token-uri"
import { apiFetch } from "../lib/api"
import type { AgentListItem } from "./use-agents"

export interface AgentDetail extends AgentListItem {
  description: string
  rawMetadata: NfaMetadata
  erc8004AgentId: bigint | undefined
  persona: string | undefined
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
  description: string
  token_uri: string
  erc8004_agent_id?: string
  persona?: string
  status?: string
}

function apiToDetail(a: ApiAgent): AgentDetail | null {
  const metadata = decodeTokenUri(a.token_uri)
  if (!metadata) return null
  return {
    tokenId: BigInt(a.token_id),
    name: a.name,
    owner: a.owner as Address,
    agentWallet: a.agent_wallet as Address,
    level: a.level,
    stage: a.stage,
    capabilities: a.capabilities ? a.capabilities.split(",").map((s) => s.trim()) : [],
    version: a.version,
    description: a.description,
    rawMetadata: metadata,
    erc8004AgentId: a.erc8004_agent_id ? BigInt(a.erc8004_agent_id) : undefined,
    persona: a.persona,
    status: a.status,
  }
}

export function useAgent(tokenId: bigint) {
  const client = usePublicClient()

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["agent-detail", tokenId.toString()],
    queryFn: async (): Promise<AgentDetail | null> => {
      try {
        const resp = await apiFetch<{ agent: ApiAgent }>(`/agents/${tokenId}`)
        return apiToDetail(resp.agent)
      } catch {
        // on-chain fallback
      }

      if (!client) return null

      try {
        const [erc8004Id, owner, wallet] = await Promise.all([
          client.readContract({
            address: CLAWTRAINER_NFA_ADDRESS,
            abi: CLAWTRAINER_NFA_ABI,
            functionName: "erc8004AgentId",
            args: [tokenId],
          }) as Promise<bigint>,
          client.readContract({
            address: CLAWTRAINER_NFA_ADDRESS,
            abi: CLAWTRAINER_NFA_ABI,
            functionName: "ownerOf",
            args: [tokenId],
          }) as Promise<Address>,
          client.readContract({
            address: CLAWTRAINER_NFA_ADDRESS,
            abi: CLAWTRAINER_NFA_ABI,
            functionName: "agentWallets",
            args: [tokenId],
          }) as Promise<Address>,
        ])

        const uri = (await client.readContract({
          address: ERC8004_IDENTITY_ADDRESS,
          abi: ERC8004_IDENTITY_ABI,
          functionName: "tokenURI",
          args: [erc8004Id],
        })) as string

        const metadata = decodeTokenUri(uri)
        if (!metadata) return null

        return {
          tokenId,
          name: getAgentName(metadata),
          owner: owner ?? (zeroAddress as Address),
          agentWallet: wallet ?? (zeroAddress as Address),
          level: getLevel(metadata),
          stage: getStage(metadata),
          capabilities: getCapabilities(metadata),
          version: getVersion(metadata),
          description: metadata.description,
          rawMetadata: metadata,
          erc8004AgentId: erc8004Id,
          persona: undefined,
          status: undefined,
        }
      } catch {
        return null
      }
    },
    staleTime: 15_000,
  })

  return {
    agent: data ?? null,
    isLoading,
    isError,
    error,
    refetch,
  }
}
