import { createFileRoute, Link } from "@tanstack/react-router"
import { GridBackground } from "../components/ui/grid-background"
import { TerminalLoader } from "../components/ui/terminal-loader"
import { TerminalText } from "../components/ui/terminal-text"
import { PixelButton } from "../components/ui/pixel-button"
import { MarketStats } from "../components/arena/market-stats"
import { PriceChart } from "../components/arena/price-chart"
import { Orderbook } from "../components/arena/orderbook"
import { MarketParticipants } from "../components/arena/market-participants"
import { AgentObserver } from "../components/arena/agent-observer"
import { useMarketDetail } from "../hooks/use-market-detail"
import { useI18n } from "../i18n"

function MarketDetailPage() {
  const { slug } = Route.useParams()
  const { t } = useI18n()
  const { market, isLoading, isError, refetch } = useMarketDetail(slug)

  const yesTokenId = market?.clobTokenIds[0] ?? ""

  return (
    <GridBackground>
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Back link */}
        <div className="mb-4">
          <Link to="/arena">
            <PixelButton variant="terminal" size="sm">
              &larr; {t.common.back}
            </PixelButton>
          </Link>
        </div>

        {isLoading && <TerminalLoader text={t.arena.fetching} />}
        {isError && (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <TerminalText color="amber">Failed to load market.</TerminalText>
            <PixelButton variant="terminal" size="sm" onClick={() => refetch()}>
              {t.common.retry}
            </PixelButton>
          </div>
        )}

        {market && (
          <>
            <h1 className="mb-4 font-body text-lg text-text-primary">{market.question}</h1>

            {/* Stats row */}
            <div className="mb-4">
              <MarketStats market={market} />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Left: Chart + Orderbook */}
              <div className="space-y-4 lg:col-span-2">
                <PriceChart tokenId={yesTokenId} />
                <Orderbook tokenId={yesTokenId} />
              </div>
              {/* Right: Participants + My Agent */}
              <div className="space-y-4">
                <MarketParticipants marketSlug={slug} />
                <AgentObserver />
              </div>
            </div>
          </>
        )}
      </div>
    </GridBackground>
  )
}

export const Route = createFileRoute("/arena/$slug")({
  component: MarketDetailPage,
})
