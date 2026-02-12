import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "../lib/api"

export type BetSource = "agent" | "human"

export interface Bet {
  id: number
  agentTokenId: string
  marketSlug: string
  marketQuestion: string
  clobTokenId: string
  direction: "yes" | "no"
  amount: number
  entryPrice: number
  source: BetSource
  status: "open" | "won" | "lost" | "cancelled"
  payout: number | null
  createdAt: string
  settledAt: string | null
}

interface ApiBet {
  id: number
  agent_token_id: string
  market_slug: string
  market_question: string
  clob_token_id: string
  direction: string
  amount: number
  entry_price: number
  source: string
  status: string
  payout: number | null
  created_at: string
  settled_at: string | null
}

function apiToBet(a: ApiBet): Bet {
  return {
    id: a.id,
    agentTokenId: a.agent_token_id,
    marketSlug: a.market_slug,
    marketQuestion: a.market_question,
    clobTokenId: a.clob_token_id,
    direction: a.direction as Bet["direction"],
    amount: a.amount,
    entryPrice: a.entry_price,
    source: (a.source ?? "human") as BetSource,
    status: a.status as Bet["status"],
    payout: a.payout,
    createdAt: a.created_at,
    settledAt: a.settled_at,
  }
}

export function useBets(agentTokenId: string) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["arena-bets", agentTokenId],
    queryFn: async () => {
      const d = await apiFetch<{ bets: ApiBet[] }>(`/arena/bets/${agentTokenId}`)
      return d.bets.map(apiToBet)
    },
    enabled: agentTokenId.length > 0,
    staleTime: 10_000,
  })

  return { bets: data ?? [], isLoading, isError, error, refetch }
}
