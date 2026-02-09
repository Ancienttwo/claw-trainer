import { useMarkets } from "../../hooks/use-markets"
import { Skeleton } from "../ui/skeleton"
import { PixelButton } from "../ui/pixel-button"
import { TerminalText } from "../ui/terminal-text"
import { MarketCard } from "./market-card"
import { useI18n } from "../../i18n"

const SKELETON_COUNT = 6

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: SKELETON_COUNT }, (_, i) => (
        <Skeleton key={i} className="h-52 rounded-pixel" />
      ))}
    </div>
  )
}

function EmptyState() {
  const { t } = useI18n()
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <TerminalText color="amber">{t.arena.noMarkets}</TerminalText>
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  const { t } = useI18n()
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <TerminalText color="amber">Failed to load markets.</TerminalText>
      <PixelButton variant="terminal" size="sm" onClick={onRetry}>
        {t.common.retry}
      </PixelButton>
    </div>
  )
}

export function MarketGrid() {
  const { markets, isLoading, isError, refetch } = useMarkets()

  if (isLoading) return <LoadingSkeleton />
  if (isError) return <ErrorState onRetry={() => refetch()} />
  if (markets.length === 0) return <EmptyState />

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {markets.map((market) => (
        <MarketCard key={market.slug} market={market} />
      ))}
    </div>
  )
}
