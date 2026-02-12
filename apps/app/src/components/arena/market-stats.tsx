import { Badge } from "../ui/badge"
import { cn } from "../../lib/cn"
import type { Market } from "../../hooks/use-markets"

interface MarketStatsProps {
  market: Market
}

export function MarketStats({ market }: MarketStatsProps) {
  const yesPrice = market.outcomePrices[0] ?? 0
  const noPrice = market.outcomePrices[1] ?? 0
  const endDate = new Date(market.endDate)
  const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - Date.now()) / 86_400_000))

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <StatCell label="YES" value={`${(yesPrice * 100).toFixed(1)}¢`} className="text-terminal-green" />
      <StatCell label="NO" value={`${(noPrice * 100).toFixed(1)}¢`} className="text-coral" />
      <StatCell
        label="24H VOL"
        value={formatCompact(market.volume24hr)}
      />
      <StatCell
        label="LIQUIDITY"
        value={formatCompact(market.liquidity)}
      />
      <StatCell label="ENDS" value={daysLeft > 0 ? `${daysLeft}d` : "ENDED"}>
        <Badge variant={daysLeft > 7 ? "terminal" : daysLeft > 0 ? "amber" : "coral"} className="ml-1">
          {market.active ? "ACTIVE" : "CLOSED"}
        </Badge>
      </StatCell>
    </div>
  )
}

function StatCell({
  label,
  value,
  className,
  children,
}: {
  label: string
  value: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div className="rounded border border-border-subtle bg-surface-base/50 p-2">
      <p className="font-pixel text-[7px] text-text-muted">{label}</p>
      <div className="flex items-center">
        <p className={cn("font-mono text-sm text-text-primary", className)}>{value}</p>
        {children}
      </div>
    </div>
  )
}

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
  return `$${n.toFixed(0)}`
}
