import type { HTMLAttributes } from "react"
import { cn } from "../../lib/cn"

const typeVariants = {
  dev: "bg-terminal-green/10 text-terminal-green border-terminal-green/20",
  social: "bg-cyan/10 text-cyan border-cyan/20",
  alpha: "bg-amber/10 text-amber border-amber/20",
  ops: "bg-coral/10 text-coral border-coral/20",
} as const

const statusVariants = {
  verified: "bg-terminal-green/10 text-terminal-green border-terminal-green/20",
  active: "bg-cyan/10 text-cyan border-cyan/20",
  idle: "bg-surface-highlight text-text-muted border-border-subtle",
  minting: "bg-amber/10 text-amber border-amber/20 animate-glow-pulse-amber",
} as const

const stageVariants = {
  rookie: "bg-coral/10 text-coral border-coral/20",
  pro: "bg-coral-mid/10 text-coral-mid border-coral-mid/20",
  cyber: "bg-cyan/10 text-cyan border-cyan/20",
} as const

type BadgeKind =
  | { kind: "type"; value: keyof typeof typeVariants }
  | { kind: "status"; value: keyof typeof statusVariants }
  | { kind: "stage"; value: keyof typeof stageVariants }
  | { kind: "level"; value: number }

type PixelBadgeProps = HTMLAttributes<HTMLSpanElement> & BadgeKind

export function PixelBadge({ className, ...props }: PixelBadgeProps) {
  const { kind, value, ...rest } = props

  if (kind === "level") {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-sm border px-2 py-1",
          "font-pixel text-[8px] leading-none",
          "bg-amber/10 text-amber border-amber/20",
          className,
        )}
        {...rest}
      >
        Lv.{value}
      </span>
    )
  }

  const variantMap = {
    type: typeVariants,
    status: statusVariants,
    stage: stageVariants,
  } as const

  const variant = variantMap[kind][value as keyof (typeof variantMap)[typeof kind]]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-1",
        "font-pixel text-[8px] leading-none uppercase",
        variant,
        className,
      )}
      {...rest}
    >
      {value}
    </span>
  )
}
