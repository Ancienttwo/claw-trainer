import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "../lib/api"

export interface Participant {
  agentTokenId: string
  agentName: string | null
  betCount: number
  totalAmount: number
  pnl: number
  lastBetAt: string
  tradeType: "paper" | "real"
}

export function useMarketParticipants(marketSlug: string) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["arena-participants", marketSlug],
    queryFn: () =>
      apiFetch<{ participants: Participant[] }>(
        `/arena/markets/${encodeURIComponent(marketSlug)}/participants`,
      ).then((d) => d.participants),
    enabled: marketSlug.length > 0,
    refetchInterval: 30_000,
    staleTime: 10_000,
  })

  return { participants: data ?? [], isLoading, isError }
}
