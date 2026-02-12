/**
 * Display ERC-8004 standardized reputation tags.
 * Tags: starred (stars), uptime (%), successRate (%), responseTime (ms)
 */

import type { ReputationSummary } from "../../hooks/use-reputation"
import { cn } from "../../lib/cn"

const TAG_DISPLAY: Record<string, { label: string; unit: string; color: string }> = {
  starred: { label: "RATING", unit: "/100", color: "text-amber" },
  uptime: { label: "UPTIME", unit: "%", color: "text-terminal-green" },
  successRate: { label: "SUCCESS", unit: "%", color: "text-cyan" },
  responseTime: { label: "RESP", unit: "ms", color: "text-text-muted" },
}

function formatValue(tag: string, value: number, decimals: number): string {
  const scaled = value / 10 ** decimals
  if (tag === "uptime") return (scaled / 100).toFixed(2)
  if (tag === "responseTime") return Math.round(scaled).toString()
  return Math.round(scaled).toString()
}

interface ReputationTagsProps {
  summaries: ReputationSummary[]
  className?: string
}

export function ReputationTags({ summaries, className }: ReputationTagsProps) {
  if (summaries.length === 0) {
    return (
      <div className={cn("text-center font-mono text-[10px] text-text-muted", className)}>
        No reputation data yet
      </div>
    )
  }

  return (
    <div className={cn("grid grid-cols-2 gap-2", className)}>
      {summaries.map((s) => {
        const display = TAG_DISPLAY[s.tag] ?? { label: s.tag, unit: "", color: "text-text-secondary" }
        return (
          <div
            key={s.tag}
            className="flex items-center justify-between rounded border border-border-subtle bg-surface-base px-2 py-1"
          >
            <span className="font-pixel text-[7px] text-text-muted">
              {display.label}
            </span>
            <span className={cn("font-mono text-xs", display.color)}>
              {formatValue(s.tag, s.value, s.decimals)}
              <span className="text-[8px] text-text-muted">{display.unit}</span>
            </span>
          </div>
        )
      })}
    </div>
  )
}
