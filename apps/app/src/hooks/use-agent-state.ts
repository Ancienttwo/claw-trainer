/**
 * Hook to read/write BAP-578 agent state from ClawTrainerNFA.
 */

import { useQuery } from "@tanstack/react-query"
import { usePublicClient, useWriteContract, useAccount } from "wagmi"
import {
  CLAWTRAINER_NFA_ADDRESS,
  CLAWTRAINER_NFA_ABI,
} from "../lib/contract"

export type AgentStatus = "Active" | "Paused" | "Terminated"

const STATUS_MAP: Record<number, AgentStatus> = {
  0: "Active",
  1: "Paused",
  2: "Terminated",
}

export interface AgentState {
  balance: bigint
  status: AgentStatus
  owner: string
  logicAddress: string
  lastActionTimestamp: number
}

export function useAgentState(nfaTokenId: bigint | null) {
  const client = usePublicClient()
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()

  const query = useQuery({
    queryKey: ["agent-state", nfaTokenId?.toString()],
    enabled: nfaTokenId !== null && client !== undefined,
    staleTime: 15_000,
    queryFn: async (): Promise<AgentState | null> => {
      if (!client || nfaTokenId === null) return null

      const state = (await client.readContract({
        address: CLAWTRAINER_NFA_ADDRESS,
        abi: CLAWTRAINER_NFA_ABI,
        functionName: "getState",
        args: [nfaTokenId],
      })) as {
        balance: bigint
        status: number
        owner: string
        logicAddress: string
        lastActionTimestamp: bigint
      }

      return {
        balance: state.balance,
        status: STATUS_MAP[state.status] ?? "Active",
        owner: state.owner,
        logicAddress: state.logicAddress,
        lastActionTimestamp: Number(state.lastActionTimestamp),
      }
    },
  })

  const isOwner = query.data?.owner?.toLowerCase() === address?.toLowerCase()

  async function pauseAgent() {
    if (!nfaTokenId) return
    await writeContractAsync({
      address: CLAWTRAINER_NFA_ADDRESS,
      abi: CLAWTRAINER_NFA_ABI,
      functionName: "pauseAgent",
      args: [nfaTokenId],
    })
    query.refetch()
  }

  async function unpauseAgent() {
    if (!nfaTokenId) return
    await writeContractAsync({
      address: CLAWTRAINER_NFA_ADDRESS,
      abi: CLAWTRAINER_NFA_ABI,
      functionName: "unpauseAgent",
      args: [nfaTokenId],
    })
    query.refetch()
  }

  async function terminateAgent() {
    if (!nfaTokenId) return
    await writeContractAsync({
      address: CLAWTRAINER_NFA_ADDRESS,
      abi: CLAWTRAINER_NFA_ABI,
      functionName: "terminate",
      args: [nfaTokenId],
    })
    query.refetch()
  }

  async function fundAgent(amount: bigint) {
    if (!nfaTokenId) return
    await writeContractAsync({
      address: CLAWTRAINER_NFA_ADDRESS,
      abi: CLAWTRAINER_NFA_ABI,
      functionName: "fundAgent",
      args: [nfaTokenId],
      value: amount,
    })
    query.refetch()
  }

  return {
    state: query.data ?? null,
    isLoading: query.isLoading,
    isOwner,
    pauseAgent,
    unpauseAgent,
    terminateAgent,
    fundAgent,
    refetch: query.refetch,
  }
}
