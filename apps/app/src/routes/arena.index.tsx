import { createFileRoute } from "@tanstack/react-router"
import { GridBackground } from "../components/ui/grid-background"
import { TerminalText } from "../components/ui/terminal-text"
import { TerminalLoader } from "../components/ui/terminal-loader"
import { Badge } from "../components/ui/badge"
import { MarketGrid } from "../components/arena/market-grid"
import { useMarkets } from "../hooks/use-markets"
import { useI18n } from "../i18n"
import { Link } from "@tanstack/react-router"
import { PixelButton } from "../components/ui/pixel-button"

function ArenaHeader() {
  const { markets, isLoading } = useMarkets()
  const { t } = useI18n()

  return (
    <div className="mb-6 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="font-pixel text-xl text-coral">{t.arena.title}</h1>
          {!isLoading && (
            <Badge variant="coral">{markets.length} markets</Badge>
          )}
        </div>
        <Link to="/arena/leaderboard">
          <PixelButton variant="terminal" size="sm">
            {t.arena.leaderboard}
          </PixelButton>
        </Link>
      </div>
      {isLoading ? (
        <TerminalLoader text={t.arena.fetching} />
      ) : (
        <TerminalText color="green">
          &gt; {t.arena.subtitle}
        </TerminalText>
      )}
    </div>
  )
}

function ArenaPage() {
  return (
    <GridBackground>
      <div className="mx-auto max-w-6xl px-4 py-6">
        <ArenaHeader />
        <MarketGrid />
      </div>
    </GridBackground>
  )
}

export const Route = createFileRoute("/arena/")({
  component: ArenaPage,
})
