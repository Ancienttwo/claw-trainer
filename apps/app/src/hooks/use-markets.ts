import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "../lib/api"

export interface Market {
  question: string
  slug: string
  image: string
  outcomePrices: number[]
  volume24hr: number
  liquidity: number
  endDate: string
  clobTokenIds: string[]
  active: boolean
}

export function useMarkets() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["arena-markets"],
    queryFn: () => apiFetch<{ markets: Market[] }>("/arena/markets").then((d) => d.markets),
    staleTime: 30_000,
  })

  return { markets: data ?? [], isLoading, isError, error, refetch }
}
