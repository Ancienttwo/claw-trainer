import { useCallback, useEffect } from "react"
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useSignTypedData,
  useChainId,
} from "wagmi"
import { decodeEventLog, type Address, type Hash } from "viem"
import {
  IDENTITY_REGISTRY_ADDRESS,
  IDENTITY_REGISTRY_ABI,
} from "../lib/contract"
import { buildTokenUri } from "../lib/build-token-uri"
import { useMintFlowStore } from "../stores/mint-flow-store"
import type { AgentConfig, MintFlowError } from "@contracts/modules/nfa-mint"

const EIP712_DOMAIN_NAME = "ClawTrainer"
const EIP712_DOMAIN_VERSION = "1"
const NFA_MINTED_EVENT_NAME = "NFAMinted"

function createMintError(
  step: MintFlowError["step"],
  code: MintFlowError["code"],
  message: string,
  details?: unknown,
): MintFlowError {
  return { step, code, message, details }
}

function extractTokenId(
  logs: ReadonlyArray<{ topics: readonly string[]; data: string }>,
): bigint | null {
  for (const log of logs) {
    try {
      const decoded = decodeEventLog({
        abi: IDENTITY_REGISTRY_ABI,
        eventName: NFA_MINTED_EVENT_NAME,
        topics: log.topics as [`0x${string}`, ...`0x${string}`[]],
        data: log.data as `0x${string}`,
      })
      return decoded.args.tokenId as bigint
    } catch {
      continue
    }
  }
  return null
}

export function useMintNfa() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const store = useMintFlowStore()

  const { signTypedDataAsync } = useSignTypedData()
  const { writeContractAsync, data: txHash } = useWriteContract()

  const receipt = useWaitForTransactionReceipt({ hash: txHash })

  const agentId = useReadContract({
    address: IDENTITY_REGISTRY_ADDRESS,
    abi: IDENTITY_REGISTRY_ABI,
    functionName: "computeAgentId",
    args: store.agentConfig
      ? [store.agentConfig.name, address as Address]
      : undefined,
    query: { enabled: !!store.agentConfig && !!address },
  })

  const agentExists = useReadContract({
    address: IDENTITY_REGISTRY_ADDRESS,
    abi: IDENTITY_REGISTRY_ABI,
    functionName: "agentExists",
    args: agentId.data ? [agentId.data] : undefined,
    query: { enabled: !!agentId.data },
  })

  useEffect(() => {
    if (!receipt.isSuccess || !receipt.data) return
    const tokenId = extractTokenId(receipt.data.logs)
    store.setTxStatus("success", txHash, tokenId ?? undefined)
    store.setStep("confirm")
  }, [receipt.isSuccess, receipt.data, txHash, store])

  const mintAgent = useCallback(
    async (config: AgentConfig) => {
      if (!isConnected || !address) {
        store.setError(
          createMintError("mint", "WALLET_DISCONNECTED", "Please connect your wallet"),
        )
        return
      }

      const freshExists = await agentExists.refetch()
      if (freshExists.data === true) {
        store.setError(
          createMintError("check-duplicate", "DUPLICATE_AGENT", "An agent with this name already exists"),
        )
        return
      }

      try {
        const uri = buildTokenUri(config)
        store.setTokenUri(uri)
        store.setTxStatus("signing")

        const signature = await signTypedDataAsync({
          domain: {
            name: EIP712_DOMAIN_NAME,
            version: EIP712_DOMAIN_VERSION,
            chainId: BigInt(chainId),
            verifyingContract: IDENTITY_REGISTRY_ADDRESS,
          },
          types: {
            MintAgent: [
              { name: "agentName", type: "string" },
              { name: "trainer", type: "address" },
              { name: "agentWallet", type: "address" },
              { name: "uri", type: "string" },
            ],
          },
          primaryType: "MintAgent",
          message: {
            agentName: config.name,
            trainer: address,
            agentWallet: address,
            uri,
          },
        })

        store.setTxStatus("pending")

        const hash = await writeContractAsync({
          address: IDENTITY_REGISTRY_ADDRESS,
          abi: IDENTITY_REGISTRY_ABI,
          functionName: "mint",
          args: [config.name, address, uri, signature],
        })

        store.setTxStatus("pending", hash)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Transaction failed"
        store.setError(
          createMintError("mint", "CONTRACT_REVERT", message, err),
        )
      }
    },
    [isConnected, address, chainId, agentExists.data, signTypedDataAsync, writeContractAsync, store],
  )

  return {
    mintAgent,
    agentId: agentId.data,
    isDuplicate: agentExists.data === true,
    isConfirming: receipt.isLoading,
    isConfirmed: receipt.isSuccess,
    txHash: txHash as Hash | undefined,
  }
}
