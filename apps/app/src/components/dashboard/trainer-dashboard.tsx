import { Link } from "@tanstack/react-router"
import { PixelButton } from "../ui/pixel-button"
import { TerminalText } from "../ui/terminal-text"
import { TrainerStats } from "./trainer-stats"
import { MyAgentList } from "./my-agent-list"
import { EmptyTrainer } from "./empty-trainer"
import type { AgentListItem } from "../../hooks/use-agents"
import { useI18n } from "../../i18n"

interface TrainerDashboardProps {
  agents: AgentListItem[]
}

export function TrainerDashboard({ agents }: TrainerDashboardProps) {
  const hasAgents = agents.length > 0
  const { t } = useI18n()

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-pixel text-sm text-terminal-green">
          {t.dashboard.title}
        </h1>
        <TerminalText color="green">&gt; {t.dashboard.welcome}</TerminalText>
      </div>

      <TrainerStats agents={agents} />

      {hasAgents ? <MyAgentList agents={agents} /> : <EmptyTrainer />}

      {hasAgents && (
        <div className="flex justify-center pt-4">
          <Link to="/mint">
            <PixelButton variant="primary">{t.dashboard.claimAnother}</PixelButton>
          </Link>
        </div>
      )}
    </div>
  )
}
