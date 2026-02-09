import { createFileRoute, Link } from "@tanstack/react-router"
import { GridBackground } from "../components/ui/grid-background"
import { TerminalLoader } from "../components/ui/terminal-loader"
import { TerminalText } from "../components/ui/terminal-text"
import { PixelButton } from "../components/ui/pixel-button"
import { PolymarketEmbed } from "../components/arena/polymarket-embed"
import { BetPanel } from "../components/arena/bet-panel"
import { MyBets } from "../components/arena/my-bets"
import { useMarketDetail } from "../hooks/use-market-detail"
import { useAgents } from "../hooks/use-agents"
import { useI18n } from "../i18n"
import { useState } from "react"

function MarketDetailPage() {
  const { slug } = Route.useParams()
  const { t } = useI18n()
  const { market, isLoading, isError, refetch } = useMarketDetail(slug)
  const { agents } = useAgents()
  const [selectedAgent, setSelectedAgent] = useState("")

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
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Left: Embed */}
              <div className="lg:col-span-2">
                <PolymarketEmbed slug={slug} />
              </div>
              {/* Right: Bet Panel + My Bets */}
              <div className="space-y-4">
                <BetPanel market={market} />
                {selectedAgent ? (
                  <MyBets agentTokenId={selectedAgent} />
                ) : agents.length > 0 ? (
                  <div className="space-y-2">
                    <label className="block font-pixel text-[8px] text-text-secondary">
                      {t.arena.selectAgent} to view bets:
                    </label>
                    <select
                      value={selectedAgent}
                      onChange={(e) => setSelectedAgent(e.target.value)}
                      className="w-full rounded-sm border border-border-subtle bg-surface-base px-2 py-1 font-mono text-xs text-text-primary"
                    >
                      <option value="">-- {t.arena.selectAgent} --</option>
                      {agents.map((a) => (
                        <option key={a.tokenId.toString()} value={a.tokenId.toString()}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}
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
