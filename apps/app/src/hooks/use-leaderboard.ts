import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "../lib/api"

export interface LeaderboardEntry {
  agentTokenId: string
  agentName: string
  totalPnl: number
  winRate: number
  totalBets: number
}

interface ApiLeaderboardEntry {
  agent_token_id: string
  agent_name: string
  total_pnl: number
  win_rate: number
  total_bets: number
}

function apiToEntry(a: ApiLeaderboardEntry): LeaderboardEntry {
  return {
    agentTokenId: a.agent_token_id,
    agentName: a.agent_name,
    totalPnl: a.total_pnl,
    winRate: a.win_rate,
    totalBets: a.total_bets,
  }
}

export function useLeaderboard() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["arena-leaderboard"],
    queryFn: async () => {
      const d = await apiFetch<{ leaderboard: ApiLeaderboardEntry[] }>("/arena/leaderboard")
      return d.leaderboard.map(apiToEntry)
    },
    staleTime: 60_000,
  })

  return { entries: data ?? [], isLoading, isError, error, refetch }
}
