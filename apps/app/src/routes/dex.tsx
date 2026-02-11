import { createFileRoute } from "@tanstack/react-router"
import { GridBackground } from "../components/ui/grid-background"
import { TerminalText } from "../components/ui/terminal-text"
import { TerminalLoader } from "../components/ui/terminal-loader"
import { Badge } from "../components/ui/badge"
import { AgentGrid } from "../components/claw/agent-grid"
import { useAgents } from "../hooks/use-agents"
import { useI18n } from "../i18n"

function DexHeader() {
  const { agents, isLoading } = useAgents()
  const { t } = useI18n()

  return (
    <div className="mb-10 space-y-2">
      <div className="flex items-center gap-2">
        <h1 className="font-pixel text-xl text-cyan">{t.dex.title}</h1>
        {!isLoading && (
          <Badge variant="cyan">{agents.length} {t.dex.registered}</Badge>
        )}
      </div>
      {isLoading ? (
        <TerminalLoader text={t.dex.fetching} />
      ) : (
        <TerminalText color="green">
          &gt; {t.dex.browsing}
        </TerminalText>
      )}
    </div>
  )
}

function DexPage() {
  return (
    <GridBackground>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <DexHeader />
        <AgentGrid />
      </div>
    </GridBackground>
  )
}

export const Route = createFileRoute("/dex")({
  component: DexPage,
})
