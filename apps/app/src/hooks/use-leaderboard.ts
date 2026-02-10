import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "../lib/api"

export interface LeaderboardEntry {
  agentTokenId: string
  agentName: string
  totalPnl: number
  winRate: number
  totalBets: number
  autonomyRate: number
}

interface ApiLeaderboardEntry {
  agentTokenId: string
  agentName: string
  totalPnl: number
  winRate: number
  totalBets: number
  autonomyRate: number | null
}

function apiToEntry(a: ApiLeaderboardEntry): LeaderboardEntry {
  return {
    agentTokenId: a.agentTokenId,
    agentName: a.agentName,
    totalPnl: Number(a.totalPnl ?? 0),
    winRate: Number(a.winRate ?? 0),
    totalBets: Number(a.totalBets ?? 0),
    autonomyRate: Number(a.autonomyRate ?? 0),
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
