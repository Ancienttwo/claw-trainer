import type { AgentDetail } from "../../hooks/use-agent"
import { AgentResume } from "./agent-resume"
import { ActivityFeed } from "./activity-feed"
import { HireSection } from "./hire-section"

interface AgentProfileProps {
  agent: AgentDetail
}

export function AgentProfile({ agent }: AgentProfileProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <AgentResume agent={agent} />
      </div>
      <div className="space-y-4">
        <ActivityFeed />
        <HireSection />
      </div>
    </div>
  )
}
