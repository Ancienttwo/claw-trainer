/**
 * Hook to query a single NFA agent by tokenId.
 * Strategy: API-first with on-chain fallback.
 */

import { useQuery } from "@tanstack/react-query"
import { useReadContracts } from "wagmi"
import { type Address, zeroAddress } from "viem"
import {
  IDENTITY_REGISTRY_ADDRESS,
  IDENTITY_REGISTRY_ABI,
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
  }
}

const CONTRACT_CONFIG = {
  address: IDENTITY_REGISTRY_ADDRESS,
  abi: IDENTITY_REGISTRY_ABI,
} as const

function buildContractCalls(tokenId: bigint) {
  return [
    { ...CONTRACT_CONFIG, functionName: "ownerOf", args: [tokenId] },
    { ...CONTRACT_CONFIG, functionName: "agentWallets", args: [tokenId] },
    { ...CONTRACT_CONFIG, functionName: "agentLevels", args: [tokenId] },
    { ...CONTRACT_CONFIG, functionName: "tokenURI", args: [tokenId] },
  ] as const
}

const OWNER_INDEX = 0
const WALLET_INDEX = 1
const LEVEL_INDEX = 2
const URI_INDEX = 3

interface ContractResult {
  status: string
  result?: unknown
}

function getSuccessResult(result: ContractResult | undefined): unknown {
  if (result?.status === "success") return result.result
  return undefined
}

function buildAgentDetail(
  tokenId: bigint,
  results: ReadonlyArray<ContractResult>,
): AgentDetail | null {
  const uriValue = getSuccessResult(results[URI_INDEX])
  if (typeof uriValue !== "string") return null
  const metadata = decodeTokenUri(uriValue)
  if (!metadata) return null
  const levelValue = getSuccessResult(results[LEVEL_INDEX])
  const onChainLevel =
    typeof levelValue === "number" ? levelValue : getLevel(metadata)

  return {
    tokenId,
    name: getAgentName(metadata),
    owner: (getSuccessResult(results[OWNER_INDEX]) as Address) ?? (zeroAddress as Address),
    agentWallet: (getSuccessResult(results[WALLET_INDEX]) as Address) ?? (zeroAddress as Address),
    level: onChainLevel,
    stage: getStage(metadata),
    capabilities: getCapabilities(metadata),
    version: getVersion(metadata),
    description: metadata.description,
    rawMetadata: metadata,
  }
}

export function useAgent(tokenId: bigint) {
  const contractQuery = useReadContracts({
    contracts: buildContractCalls(tokenId),
    query: { staleTime: 15_000, enabled: false },
  })

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["agent-detail", tokenId.toString()],
    queryFn: async () => {
      try {
        const resp = await apiFetch<{ agent: ApiAgent }>(`/agents/${tokenId}`)
        const detail = apiToDetail(resp.agent)
        if (detail) return detail
      } catch {
        // fallback to on-chain
      }
      const result = await contractQuery.refetch()
      if (!result.data) return null
      return buildAgentDetail(tokenId, result.data as ReadonlyArray<ContractResult>)
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
