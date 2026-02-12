/**
 * BAP-578 state machine visual badge.
 * Active (green pulse) / Paused (amber) / Terminated (red strikethrough)
 */

import type { AgentStatus } from "../../hooks/use-agent-state"
import { cn } from "../../lib/cn"

const STATUS_CONFIG = {
  Active: {
    dot: "bg-terminal-green",
    text: "text-terminal-green",
    label: "ACTIVE",
    pulse: true,
  },
  Paused: {
    dot: "bg-amber",
    text: "text-amber",
    label: "PAUSED",
    pulse: false,
  },
  Terminated: {
    dot: "bg-coral",
    text: "text-coral line-through",
    label: "TERMINATED",
    pulse: false,
  },
} as const

interface AgentStateBadgeProps {
  status: AgentStatus
  size?: "sm" | "md"
}

export function AgentStateBadge({ status, size = "md" }: AgentStateBadgeProps) {
  const config = STATUS_CONFIG[status]

  return (
    <div className={cn("flex items-center gap-1.5", size === "sm" ? "gap-1" : "gap-1.5")}>
      <span
        className={cn(
          "inline-block rounded-full",
          config.dot,
          size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2",
          config.pulse && "animate-pulse",
        )}
      />
      <span
        className={cn(
          "font-pixel uppercase",
          config.text,
          size === "sm" ? "text-[6px]" : "text-[8px]",
        )}
      >
        {config.label}
      </span>
    </div>
  )
}
