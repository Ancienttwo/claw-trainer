/**
 * Stage evolution indicator showing progression: Rookie -> Pro -> Cyber.
 */

import { PixelBadge } from "../ui/pixel-badge"
import { cn } from "../../lib/cn"

const STAGES = ["Rookie", "Pro", "Cyber"] as const
type Stage = (typeof STAGES)[number]

interface EvolutionBadgeProps {
  currentStage: string
}

function stageToKind(stage: Stage): "rookie" | "pro" | "cyber" {
  return stage.toLowerCase() as "rookie" | "pro" | "cyber"
}

export function EvolutionBadge({ currentStage }: EvolutionBadgeProps) {
  const activeIndex = STAGES.findIndex(
    (s) => s.toLowerCase() === currentStage.toLowerCase(),
  )

  return (
    <div className="flex items-center gap-1">
      {STAGES.map((stage, index) => (
        <div key={stage} className="flex items-center gap-1">
          <PixelBadge
            kind="stage"
            value={stageToKind(stage)}
            className={cn(index > activeIndex && "opacity-30")}
          />
          {index < STAGES.length - 1 && (
            <span
              className={cn(
                "font-pixel text-[8px]",
                index < activeIndex ? "text-text-secondary" : "text-text-muted",
              )}
            >
              &raquo;
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
