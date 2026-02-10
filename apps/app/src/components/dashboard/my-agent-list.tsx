import { AgentCard } from "../claw/agent-card"
import type { AgentListItem } from "../../hooks/use-agents"
import { useI18n } from "../../i18n"

interface MyAgentListProps {
  agents: AgentListItem[]
}

export function MyAgentList({ agents }: MyAgentListProps) {
  const { t } = useI18n()

  return (
    <div className="space-y-4">
      <h2 className="font-pixel text-sm text-cyan">{t.dashboard.myAgents}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <AgentCard key={agent.tokenId.toString()} agent={agent} />
        ))}
      </div>
    </div>
  )
}
