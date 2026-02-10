/**
 * Visual stat bar (like Pokemon HP bar) for agent detail view.
 */

import { cn } from "../../lib/cn"

const PERCENTAGE_MAX = 100

const colorStyles = {
  coral: "from-coral-dark to-coral",
  cyan: "from-cyan-mid to-cyan",
  amber: "from-amber-dark to-amber",
  terminal: "from-terminal-green-dark to-terminal-green",
} as const

interface StatBarProps {
  label: string
  value: number
  max: number
  color: keyof typeof colorStyles
}

export function StatBar({ label, value, max, color }: StatBarProps) {
  const percentage = Math.min((value / max) * PERCENTAGE_MAX, PERCENTAGE_MAX)

  return (
    <div className="flex items-center gap-2">
      <span className="w-16 shrink-0 font-pixel text-[8px] text-text-secondary">
        {label}
      </span>
      <div className="relative h-3 flex-1 overflow-hidden rounded-sm bg-surface-overlay">
        <div
          className={cn(
            "h-full rounded-sm bg-gradient-to-r transition-all duration-500",
            colorStyles[color],
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-8 shrink-0 text-right font-mono text-xs text-text-secondary">
        {value}
      </span>
    </div>
  )
}
