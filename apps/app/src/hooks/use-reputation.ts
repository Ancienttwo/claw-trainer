/**
 * Hook to read ERC-8004 reputation data from ReputationRegistry.
 */

import { useQuery } from "@tanstack/react-query"
import { usePublicClient } from "wagmi"
import {
  ERC8004_REPUTATION_ADDRESS,
  ERC8004_REPUTATION_ABI,
} from "../lib/contract"

export interface ReputationSummary {
  tag: string
  count: number
  value: number
  decimals: number
}

const STANDARD_TAGS = ["starred", "uptime", "successRate", "responseTime"] as const

export function useReputation(erc8004AgentId: bigint | null) {
  const client = usePublicClient()

  return useQuery({
    queryKey: ["reputation", erc8004AgentId?.toString()],
    enabled: erc8004AgentId !== null && client !== undefined,
    staleTime: 60_000,
    queryFn: async (): Promise<ReputationSummary[]> => {
      if (!client || erc8004AgentId === null) return []

      const results = await Promise.allSettled(
        STANDARD_TAGS.map((tag) =>
          client.readContract({
            address: ERC8004_REPUTATION_ADDRESS,
            abi: ERC8004_REPUTATION_ABI,
            functionName: "getSummary",
            args: [erc8004AgentId, [], tag, ""],
          }),
        ),
      )

      return STANDARD_TAGS.map((tag, i) => {
        const result = results[i]
        if (result.status === "fulfilled") {
          const [count, summaryValue, decimals] = result.value as [bigint, bigint, number]
          return {
            tag,
            count: Number(count),
            value: Number(summaryValue),
            decimals,
          }
        }
        return { tag, count: 0, value: 0, decimals: 0 }
      }).filter((r) => r.count > 0)
    },
  })
}
