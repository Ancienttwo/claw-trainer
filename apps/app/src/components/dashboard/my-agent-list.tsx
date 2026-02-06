import { AgentCard } from "../molt/agent-card"
import type { AgentListItem } from "../../hooks/use-agents"

interface MyAgentListProps {
  agents: AgentListItem[]
}

export function MyAgentList({ agents }: MyAgentListProps) {
  return (
    <div className="space-y-4">
      <h2 className="font-pixel text-sm text-cyan">My Agents</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <AgentCard key={agent.tokenId.toString()} agent={agent} />
        ))}
      </div>
    </div>
  )
}
