/**
 * Hook to read BAP-578 learning metrics from ClawTrainerNFA.
 */

import { useQuery } from "@tanstack/react-query"
import { usePublicClient } from "wagmi"
import {
  CLAWTRAINER_NFA_ADDRESS,
  CLAWTRAINER_NFA_ABI,
} from "../lib/contract"

export interface LearningData {
  totalInteractions: number
  learningEvents: number
  lastUpdateTimestamp: number
  learningVelocity: number
  confidenceScore: number
  learningRoot: string
  isEnabled: boolean
}

export function useLearning(nfaTokenId: bigint | null) {
  const client = usePublicClient()

  return useQuery({
    queryKey: ["learning", nfaTokenId?.toString()],
    enabled: nfaTokenId !== null && client !== undefined,
    staleTime: 30_000,
    queryFn: async (): Promise<LearningData | null> => {
      if (!client || nfaTokenId === null) return null

      const [metrics, root, enabled] = await Promise.all([
        client.readContract({
          address: CLAWTRAINER_NFA_ADDRESS,
          abi: CLAWTRAINER_NFA_ABI,
          functionName: "getLearningMetrics",
          args: [nfaTokenId],
        }),
        client.readContract({
          address: CLAWTRAINER_NFA_ADDRESS,
          abi: CLAWTRAINER_NFA_ABI,
          functionName: "getLearningRoot",
          args: [nfaTokenId],
        }),
        client.readContract({
          address: CLAWTRAINER_NFA_ADDRESS,
          abi: CLAWTRAINER_NFA_ABI,
          functionName: "isLearningEnabled",
          args: [nfaTokenId],
        }),
      ])

      const m = metrics as {
        totalInteractions: bigint
        learningEvents: bigint
        lastUpdateTimestamp: bigint
        learningVelocity: bigint
        confidenceScore: bigint
      }

      return {
        totalInteractions: Number(m.totalInteractions),
        learningEvents: Number(m.learningEvents),
        lastUpdateTimestamp: Number(m.lastUpdateTimestamp),
        learningVelocity: Number(m.learningVelocity),
        confidenceScore: Number(m.confidenceScore),
        learningRoot: root as string,
        isEnabled: enabled as boolean,
      }
    },
  })
}
