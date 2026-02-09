import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAccount, useSignMessage } from "wagmi"
import { apiFetch } from "../lib/api"

export interface Bet {
  id: number
  agentTokenId: string
  marketSlug: string
  marketQuestion: string
  clobTokenId: string
  direction: "yes" | "no"
  amount: number
  entryPrice: number
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

interface PlaceBetInput {
  agentTokenId: string
  marketSlug: string
  marketQuestion: string
  clobTokenId: string
  direction: "yes" | "no"
  amount: number
}

export function usePlaceBet() {
  const queryClient = useQueryClient()
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()

  return useMutation({
    mutationFn: async (input: PlaceBetInput) => {
      if (!address) throw new Error("Wallet not connected")
      return apiFetch<{ bet: ApiBet }>("/arena/bet", {
        method: "POST",
        body: input,
        wallet: address,
        signMessage: (msg: string) => signMessageAsync({ message: msg }),
      })
    },
    onSuccess: (_, input) => {
      queryClient.invalidateQueries({ queryKey: ["arena-bets", input.agentTokenId] })
      queryClient.invalidateQueries({ queryKey: ["faucet-balance", input.agentTokenId] })
    },
  })
}
