import { useBets, type Bet } from "../../hooks/use-bets"
import { PixelCard, PixelCardHeader, PixelCardContent } from "../ui/pixel-card"
import { Badge } from "../ui/badge"
import { TerminalText } from "../ui/terminal-text"
import { Skeleton } from "../ui/skeleton"
import { useI18n } from "../../i18n"
import { cn } from "../../lib/cn"

const statusVariant: Record<Bet["status"], "default" | "coral" | "cyan" | "amber" | "terminal"> = {
  open: "cyan",
  won: "terminal",
  lost: "coral",
  cancelled: "amber",
}

function BetRow({ bet }: { bet: Bet }) {
  const { t } = useI18n()
  const pnl = bet.payout != null ? bet.payout - bet.amount : 0

  return (
    <div className="flex items-center justify-between border-b border-border-subtle py-2 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="truncate font-body text-xs text-text-primary">{bet.marketQuestion}</p>
        <div className="mt-1 flex items-center gap-2">
          <Badge variant={bet.direction === "yes" ? "terminal" : "coral"}>
            {bet.direction.toUpperCase()}
          </Badge>
          <Badge variant={bet.source === "agent" ? "cyan" : "amber"}>
            {bet.source === "agent" ? "BOT" : "YOU"}
          </Badge>
          <span className="font-mono text-[10px] text-text-muted">
            {bet.amount.toFixed(0)} @ {bet.entryPrice.toFixed(3)}
          </span>
        </div>
      </div>
      <div className="ml-2 flex flex-col items-end gap-1">
        <Badge variant={statusVariant[bet.status]}>{bet.status}</Badge>
        {bet.status !== "open" && (
          <span className={cn("font-mono text-[10px]", pnl >= 0 ? "text-terminal-green" : "text-coral")}>
            {pnl >= 0 ? "+" : ""}{pnl.toFixed(0)} {t.arena.pnl}
          </span>
        )}
      </div>
    </div>
  )
}

export function MyBets({ agentTokenId }: { agentTokenId: string }) {
  const { t } = useI18n()
  const { bets, isLoading } = useBets(agentTokenId)

  return (
    <PixelCard>
      <PixelCardHeader>{t.arena.myBets}</PixelCardHeader>
      <PixelCardContent>
        {isLoading && <Skeleton className="h-24" />}
        {!isLoading && bets.length === 0 && (
          <TerminalText color="amber" className="py-4 text-center text-xs">
            {t.arena.noBets}
          </TerminalText>
        )}
        {bets.map((bet) => (
          <BetRow key={bet.id} bet={bet} />
        ))}
      </PixelCardContent>
    </PixelCard>
  )
}
