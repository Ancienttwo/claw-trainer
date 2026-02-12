/**
 * BAP-578 Learning Module panel.
 * Shows Merkle root, confidence score, interaction count.
 */

import type { LearningData } from "../../hooks/use-learning"
import { StatBar } from "./stat-bar"
import { cn } from "../../lib/cn"

const CONFIDENCE_MAX = 10_000

function truncateHash(hash: string): string {
  if (hash === "0x0000000000000000000000000000000000000000000000000000000000000000") {
    return "none"
  }
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`
}

interface LearningPanelProps {
  learning: LearningData
  className?: string
}

export function LearningPanel({ learning, className }: LearningPanelProps) {
  const confidencePercent = Math.round((learning.confidenceScore / CONFIDENCE_MAX) * 100)

  return (
    <div className={cn("space-y-3", className)}>
      <h4 className="font-pixel text-[8px] text-text-muted">LEARNING MODULE</h4>

      <StatBar
        label="CONFIDENCE"
        value={confidencePercent}
        max={100}
        color="cyan"
      />

      <div className="space-y-1 rounded border border-border-subtle bg-surface-base p-2">
        <div className="flex items-center justify-between">
          <span className="font-pixel text-[7px] text-text-muted">INTERACTIONS</span>
          <span className="font-mono text-xs text-text-secondary">
            {learning.totalInteractions}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-pixel text-[7px] text-text-muted">LEARNING EVENTS</span>
          <span className="font-mono text-xs text-text-secondary">
            {learning.learningEvents}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-pixel text-[7px] text-text-muted">MERKLE ROOT</span>
          <span className="font-mono text-[10px] text-terminal-green">
            {truncateHash(learning.learningRoot)}
          </span>
        </div>
      </div>

      {!learning.isEnabled && (
        <span className="font-pixel text-[7px] text-amber">LEARNING DISABLED</span>
      )}
    </div>
  )
}
