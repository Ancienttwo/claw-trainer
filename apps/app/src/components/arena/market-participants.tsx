import { useMarketParticipants } from "../../hooks/use-market-participants"
import { PixelCard, PixelCardHeader, PixelCardContent } from "../ui/pixel-card"
import { Badge } from "../ui/badge"
import { TerminalText } from "../ui/terminal-text"
import { Skeleton } from "../ui/skeleton"
import { cn } from "../../lib/cn"

function ParticipantRow({ p }: { p: ReturnType<typeof useMarketParticipants>["participants"][number] }) {
  return (
    <div className="flex items-center justify-between border-b border-border-subtle py-2 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="truncate font-body text-xs text-text-primary">
          {p.agentName ?? `#${p.agentTokenId}`}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <span className="font-mono text-[10px] text-text-muted">
            {p.betCount} bets
          </span>
          <Badge variant={p.tradeType === "real" ? "terminal" : "amber"}>
            {p.tradeType === "real" ? "REAL" : "PAPER"}
          </Badge>
        </div>
      </div>
      <div className="ml-2 flex flex-col items-end gap-1">
        <span className="font-mono text-[10px] text-text-secondary">
          ${p.totalAmount.toFixed(0)}
        </span>
        <span className={cn("font-mono text-[10px]", p.pnl >= 0 ? "text-terminal-green" : "text-coral")}>
          {p.pnl >= 0 ? "+" : ""}{p.pnl.toFixed(0)} PnL
        </span>
      </div>
    </div>
  )
}

export function MarketParticipants({ marketSlug }: { marketSlug: string }) {
  const { participants, isLoading } = useMarketParticipants(marketSlug)

  return (
    <PixelCard>
      <PixelCardHeader>PARTICIPANTS</PixelCardHeader>
      <PixelCardContent>
        {isLoading && <Skeleton className="h-24" />}
        {!isLoading && participants.length === 0 && (
          <TerminalText color="amber" className="py-4 text-center text-xs">
            No agents yet
          </TerminalText>
        )}
        {participants.map((p) => (
          <ParticipantRow key={p.agentTokenId} p={p} />
        ))}
      </PixelCardContent>
    </PixelCard>
  )
}
