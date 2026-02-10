import { Link } from "@tanstack/react-router"
import { useLeaderboard } from "../../hooks/use-leaderboard"
import { PixelCard, PixelCardHeader, PixelCardContent } from "../ui/pixel-card"
import { Badge } from "../ui/badge"
import { TerminalText } from "../ui/terminal-text"
import { Skeleton } from "../ui/skeleton"
import { useI18n } from "../../i18n"
import { cn } from "../../lib/cn"

const RANK_TIERS = { 1: "coral", 2: "amber", 3: "cyan" } as const

function rankBadgeVariant(rank: number): "coral" | "amber" | "cyan" | "default" {
  return (RANK_TIERS as Record<number, "coral" | "amber" | "cyan">)[rank] ?? "default"
}

export function LeaderboardTable() {
  const { t } = useI18n()
  const { entries, isLoading } = useLeaderboard()

  return (
    <PixelCard>
      <PixelCardHeader>{t.arena.leaderboard}</PixelCardHeader>
      <PixelCardContent>
        {isLoading && <Skeleton className="h-48" />}

        {!isLoading && entries.length === 0 && (
          <TerminalText color="amber" className="py-8 text-center text-xs">
            {t.arena.noData}
          </TerminalText>
        )}

        {entries.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-border-subtle text-text-muted">
                  <th className="pb-2 pr-2 font-pixel text-[8px]">{t.arena.rank}</th>
                  <th className="pb-2 pr-2 font-pixel text-[8px]">{t.arena.agent}</th>
                  <th className="pb-2 pr-2 text-right font-pixel text-[8px]">{t.arena.totalPnl}</th>
                  <th className="pb-2 pr-2 text-right font-pixel text-[8px]">{t.arena.winRate}</th>
                  <th className="pb-2 pr-2 text-right font-pixel text-[8px]">{t.arena.totalBets}</th>
                  <th className="pb-2 text-right font-pixel text-[8px]">{t.arena.autonomy}</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, i) => {
                  const rank = i + 1
                  return (
                    <tr key={entry.agentTokenId} className="border-b border-border-subtle/50 last:border-0">
                      <td className="py-2 pr-2">
                        <Badge variant={rankBadgeVariant(rank)}>#{rank}</Badge>
                      </td>
                      <td className="py-2 pr-2">
                        <Link
                          to="/agent/$tokenId"
                          params={{ tokenId: entry.agentTokenId }}
                          className="text-cyan hover:underline"
                        >
                          {entry.agentName}
                        </Link>
                      </td>
                      <td className={cn("py-2 pr-2 text-right", entry.totalPnl >= 0 ? "text-terminal-green" : "text-coral")}>
                        {entry.totalPnl >= 0 ? "+" : ""}{entry.totalPnl.toFixed(0)}
                      </td>
                      <td className="py-2 pr-2 text-right text-text-secondary">
                        {(entry.winRate * 100).toFixed(0)}%
                      </td>
                      <td className="py-2 pr-2 text-right text-text-secondary">
                        {entry.totalBets}
                      </td>
                      <td className="py-2 text-right">
                        <span className={cn("font-mono", entry.autonomyRate > 0.5 ? "text-cyan" : "text-text-muted")}>
                          {(entry.autonomyRate * 100).toFixed(0)}%
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </PixelCardContent>
    </PixelCard>
  )
}
