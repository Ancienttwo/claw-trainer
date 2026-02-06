import { createFileRoute } from "@tanstack/react-router"
import { GridBackground } from "../components/ui/grid-background"
import { TerminalText } from "../components/ui/terminal-text"
import { TerminalLoader } from "../components/ui/terminal-loader"
import { Badge } from "../components/ui/badge"
import { AgentGrid } from "../components/molt/agent-grid"
import { useAgents } from "../hooks/use-agents"

function DexHeader() {
  const { agents, isLoading } = useAgents()

  return (
    <div className="mb-6 space-y-2">
      <div className="flex items-center gap-2">
        <h1 className="font-pixel text-xl text-cyan">Molt-Dex</h1>
        {!isLoading && (
          <Badge variant="cyan">{agents.length} registered</Badge>
        )}
      </div>
      {isLoading ? (
        <TerminalLoader text="Fetching agents from BNB Chain..." />
      ) : (
        <TerminalText color="green">
          &gt; Browsing all registered Non-Fungible Agents on BNB Chain...
        </TerminalText>
      )}
    </div>
  )
}

function DexPage() {
  return (
    <GridBackground>
      <div className="mx-auto max-w-6xl px-4 py-6">
        <DexHeader />
        <AgentGrid />
      </div>
    </GridBackground>
  )
}

export const Route = createFileRoute("/dex")({
  component: DexPage,
})
