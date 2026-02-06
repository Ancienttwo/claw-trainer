import { PixelCard, PixelCardContent } from "../ui/pixel-card"
import { PixelBadge } from "../ui/pixel-badge"
import type { AgentListItem } from "../../hooks/use-agents"

interface TrainerStatsProps {
  agents: AgentListItem[]
}

const STAGE_RANK: Record<string, number> = {
  rookie: 1,
  pro: 2,
  cyber: 3,
}

function getHighestStage(agents: AgentListItem[]): string {
  if (agents.length === 0) return "-"
  return agents.reduce((highest, agent) => {
    const currentRank = STAGE_RANK[agent.stage.toLowerCase()] ?? 0
    const highestRank = STAGE_RANK[highest.toLowerCase()] ?? 0
    return currentRank > highestRank ? agent.stage : highest
  }, agents[0].stage)
}

function getAverageLevel(agents: AgentListItem[]): string {
  if (agents.length === 0) return "0"
  const total = agents.reduce((sum, agent) => sum + agent.level, 0)
  return Math.round(total / agents.length).toString()
}

export function TrainerStats({ agents }: TrainerStatsProps) {
  const totalAgents = agents.length
  const highestStage = getHighestStage(agents)
  const avgLevel = getAverageLevel(agents)

  return (
    <PixelCard glow="cyan" className="w-full">
      <PixelCardContent>
        <div className="flex flex-row gap-4 justify-between">
          <StatBlock label="Agents" value={totalAgents.toString()} />
          <StatBlock label="Highest Stage">
            {totalAgents > 0 ? (
              <PixelBadge
                kind="stage"
                value={highestStage.toLowerCase() as "rookie" | "pro" | "cyber"}
              />
            ) : (
              <span className="font-display text-lg text-text-primary">-</span>
            )}
          </StatBlock>
          <StatBlock label="Avg Level" value={avgLevel} />
        </div>
      </PixelCardContent>
    </PixelCard>
  )
}

interface StatBlockProps {
  label: string
  value?: string
  children?: React.ReactNode
}

function StatBlock({ label, value, children }: StatBlockProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-pixel text-[8px] text-text-muted uppercase">
        {label}
      </span>
      {children || (
        <span className="font-display text-lg text-text-primary">{value}</span>
      )}
    </div>
  )
}
