import type { HTMLAttributes } from "react"
import { cn } from "../../lib/cn"

const variants = {
  default:
    "bg-surface-highlight text-text-primary border-border-subtle",
  coral:
    "bg-coral/10 text-coral border-coral/20",
  cyan:
    "bg-cyan/10 text-cyan border-cyan/20",
  amber:
    "bg-amber/10 text-amber border-amber/20",
  terminal:
    "bg-terminal-green/10 text-terminal-green border-terminal-green/20",
} as const

type BadgeVariant = keyof typeof variants

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-1 font-pixel text-[8px] leading-none",
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
