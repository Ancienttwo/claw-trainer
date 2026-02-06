/**
 * Hook to query a single NFA agent by tokenId from on-chain reads.
 */

import { useReadContracts } from "wagmi"
import type { Address } from "viem"
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
import type { AgentListItem } from "./use-agents"

export interface AgentDetail extends AgentListItem {
  description: string
  rawMetadata: NfaMetadata
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
  error?: unknown
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
  const levelValue = getSuccessResult(results[LEVEL_INDEX])
  const onChainLevel =
    typeof levelValue === "number" ? levelValue : getLevel(metadata)

  return {
    tokenId,
    name: getAgentName(metadata),
    owner: (getSuccessResult(results[OWNER_INDEX]) as Address) ?? ("0x0" as Address),
    agentWallet: (getSuccessResult(results[WALLET_INDEX]) as Address) ?? ("0x0" as Address),
    level: onChainLevel,
    stage: getStage(metadata),
    capabilities: getCapabilities(metadata),
    version: getVersion(metadata),
    description: metadata.description,
    rawMetadata: metadata,
  }
}

export function useAgent(tokenId: bigint) {
  const { data, isLoading, isError, error, refetch } = useReadContracts({
    contracts: buildContractCalls(tokenId),
    query: { staleTime: 15_000 },
  })

  const agent = data
    ? buildAgentDetail(tokenId, data as ReadonlyArray<ContractResult>)
    : null

  return {
    agent,
    isLoading,
    isError,
    error,
    refetch,
  }
}
