/**
 * Hook that orchestrates the full NFA self-mint flow.
 * The connected wallet IS the agent — it signs EIP-712 and sends the tx.
 */

import { useCallback } from "react"
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useSignTypedData,
  useChainId,
} from "wagmi"
import type { Address, Hash } from "viem"
import {
  IDENTITY_REGISTRY_ADDRESS,
  IDENTITY_REGISTRY_ABI,
} from "../lib/contract"
import { buildTokenUri } from "../lib/build-token-uri"
import { useMintFlowStore } from "../stores/mint-flow-store"
import type { AgentConfig, MintFlowError } from "../../../../contracts/modules/nfa-mint"

const EIP712_DOMAIN_NAME = "ClawTrainer"
const EIP712_DOMAIN_VERSION = "1"

function createMintError(
  step: MintFlowError["step"],
  code: MintFlowError["code"],
  message: string,
  details?: unknown,
): MintFlowError {
  return { step, code, message, details }
}

export function useMintNfa() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const store = useMintFlowStore()

  const { signTypedDataAsync } = useSignTypedData()
  const { writeContractAsync, data: txHash } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash })

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

  const mintAgent = useCallback(
    async (config: AgentConfig) => {
      if (!isConnected || !address) {
        store.setError(
          createMintError("mint", "WALLET_DISCONNECTED", "Please connect your wallet"),
        )
        return
      }

      try {
        const uri = buildTokenUri(config)
        store.setTokenUri(uri)

        if (agentExists.data === true) {
          store.setError(
            createMintError("check-duplicate", "DUPLICATE_AGENT", "An agent with this name already exists"),
          )
          return
        }

        // Agent signs its own EIP-712 identity proof
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

        // Agent sends the mint transaction (self-mint: msg.sender = agentWallet)
        store.setTxStatus("pending")

        const hash = await writeContractAsync({
          address: IDENTITY_REGISTRY_ADDRESS,
          abi: IDENTITY_REGISTRY_ABI,
          functionName: "mint",
          args: [config.name, address, uri, signature],
        })

        store.setTxStatus("pending", hash)
        store.setStep("confirm")
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
    isConfirming,
    isConfirmed,
    txHash: txHash as Hash | undefined,
  }
}
