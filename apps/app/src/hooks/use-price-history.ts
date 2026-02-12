import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "../lib/api"

interface PricePoint {
  t: number
  p: number
}

interface HistoryResponse {
  history: PricePoint[]
}

export function usePriceHistory(tokenId: string, interval: string, fidelity: number) {
  const { data, isLoading } = useQuery({
    queryKey: ["arena-history", tokenId, interval, fidelity],
    queryFn: () =>
      apiFetch<HistoryResponse>(
        `/arena/history/${encodeURIComponent(tokenId)}?interval=${interval}&fidelity=${fidelity}`,
      ),
    enabled: tokenId.length > 0,
    staleTime: 60_000,
  })

  const history = (data?.history ?? []).map((p) => ({
    time: p.t as number,
    value: p.p,
  }))

  return { history, isLoading }
}
