import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "../lib/api"

interface OrderLevel {
  price: string
  size: string
}

interface OrderbookData {
  bids: OrderLevel[]
  asks: OrderLevel[]
}

export function useOrderbook(tokenId: string) {
  const { data, isLoading } = useQuery({
    queryKey: ["arena-book", tokenId],
    queryFn: () => apiFetch<OrderbookData>(`/arena/book/${encodeURIComponent(tokenId)}`),
    enabled: tokenId.length > 0,
    refetchInterval: 10_000,
  })

  return {
    bids: data?.bids ?? [],
    asks: data?.asks ?? [],
    isLoading,
  }
}
