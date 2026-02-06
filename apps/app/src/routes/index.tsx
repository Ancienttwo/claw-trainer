import { Link, createFileRoute } from "@tanstack/react-router"
import { GridBackground } from "../components/ui/grid-background"
import { PixelButton } from "../components/ui/pixel-button"
import { TerminalText, TerminalLine } from "../components/ui/terminal-text"
import { TerminalLoader } from "../components/ui/terminal-loader"
import { AsciiLobster } from "../components/ui/ascii-lobster"
import { AgentCard } from "../components/molt/agent-card"
import { TrainerDashboard } from "../components/dashboard/trainer-dashboard"
import { EmptyTrainer } from "../components/dashboard/empty-trainer"
import { useMyAgents } from "../hooks/use-my-agents"
import { useAgents } from "../hooks/use-agents"

const RECENT_COUNT = 3

function RecentMints() {
  const { agents, isLoading } = useAgents()

  if (isLoading || agents.length === 0) return null

  const recent = agents.slice(-RECENT_COUNT).reverse()

  return (
    <section className="space-y-4">
      <h2 className="font-pixel text-[10px] text-text-secondary">
        RECENT MINTS
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recent.map((agent) => (
          <AgentCard key={agent.tokenId.toString()} agent={agent} />
        ))}
      </div>
    </section>
  )
}

function HeroLanding() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <section className="flex flex-col items-center gap-6 py-12 text-center">
        <AsciiLobster stage="cyber" size="lg" className="animate-float" />

        <h1 className="font-pixel text-xl text-coral sm:text-2xl">
          ClawTrainer.ai
        </h1>

        <p className="max-w-md font-display text-lg text-text-secondary">
          Train your Molt. Own your Mind.
        </p>

        <TerminalText color="green" scanlines className="text-[11px]">
          <TerminalLine prefix=">" blink>
            SYSTEM ONLINE. CLAWTRAINER v1.0
          </TerminalLine>
        </TerminalText>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <Link to="/dex">
            <PixelButton variant="terminal" size="lg">
              Explore Molt-Dex
            </PixelButton>
          </Link>
          <Link to="/mint">
            <PixelButton variant="primary" size="lg">
              Mint NFA
            </PixelButton>
          </Link>
        </div>
      </section>

      <RecentMints />
    </div>
  )
}

function ConnectedHome() {
  const { myAgents, isLoading, isTrainer } = useMyAgents()

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <TerminalLoader text="Loading your agents..." />
      </div>
    )
  }

  if (!isTrainer) return <EmptyTrainer />

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <TrainerDashboard agents={myAgents} />
    </div>
  )
}

function HomePage() {
  const { isConnected } = useMyAgents()

  return (
    <GridBackground gridOpacity="subtle">
      {isConnected ? <ConnectedHome /> : <HeroLanding />}
    </GridBackground>
  )
}

export const Route = createFileRoute("/")({
  component: HomePage,
})
