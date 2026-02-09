import { Link } from "@tanstack/react-router"
import type { Market } from "../../hooks/use-markets"
import { PixelCard, PixelCardContent, PixelCardHeader } from "../ui/pixel-card"
import { Badge } from "../ui/badge"
import { StatBar } from "../molt/stat-bar"
import { useI18n } from "../../i18n"

const PERCENTAGE_SCALE = 100

function formatVolume(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`
  return `$${v.toFixed(0)}`
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function MarketCard({ market }: { market: Market }) {
  const { t } = useI18n()
  const yesPrice = market.outcomePrices[0] ?? 0
  const noPrice = market.outcomePrices[1] ?? 0

  return (
    <Link to="/arena/$slug" params={{ slug: market.slug }}>
      <PixelCard glow="cyan" className="cursor-pointer">
        <PixelCardHeader>
          <div className="flex items-center justify-between">
            <span className="truncate">{t.arena.marketDetail}</span>
            <Badge variant="cyan">{formatDate(market.endDate)}</Badge>
          </div>
        </PixelCardHeader>
        <PixelCardContent className="space-y-3">
          <p className="line-clamp-2 font-body text-sm text-text-primary">
            {market.question}
          </p>

          <StatBar
            label={t.arena.yes}
            value={Math.round(yesPrice * PERCENTAGE_SCALE)}
            max={PERCENTAGE_SCALE}
            color="terminal"
          />
          <StatBar
            label={t.arena.no}
            value={Math.round(noPrice * PERCENTAGE_SCALE)}
            max={PERCENTAGE_SCALE}
            color="coral"
          />

          <div className="flex items-center gap-2">
            <Badge variant="amber">{t.arena.volume}: {formatVolume(market.volume24hr)}</Badge>
            <Badge variant="default">{t.arena.liquidity}: {formatVolume(market.liquidity)}</Badge>
          </div>
        </PixelCardContent>
      </PixelCard>
    </Link>
  )
}
