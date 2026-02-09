import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "../lib/api"
import type { Market } from "./use-markets"

export function useMarketDetail(slug: string) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["arena-market", slug],
    queryFn: () => apiFetch<{ market: Market }>(`/arena/markets/${slug}`).then((d) => d.market),
    enabled: slug.length > 0,
    staleTime: 30_000,
  })

  return { market: data ?? null, isLoading, isError, error, refetch }
}
