import { forwardRef, type HTMLAttributes } from "react"
import { cn } from "../../lib/cn"

interface TerminalTextProps extends HTMLAttributes<HTMLDivElement> {
  scanlines?: boolean
  color?: "green" | "amber" | "cyan"
}

const colorMap = {
  green: "text-terminal-green",
  amber: "text-amber",
  cyan: "text-cyan",
} as const

export const TerminalText = forwardRef<HTMLDivElement, TerminalTextProps>(
  ({ className, scanlines = false, color = "green", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "font-mono text-[13px] leading-relaxed",
          colorMap[color],
          scanlines && "crt-overlay",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)

TerminalText.displayName = "TerminalText"

interface TerminalLineProps extends HTMLAttributes<HTMLSpanElement> {
  prefix?: string
  blink?: boolean
}

export const TerminalLine = forwardRef<HTMLSpanElement, TerminalLineProps>(
  ({ className, prefix = ">", blink = false, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn("block font-mono text-terminal-green", className)}
        {...props}
      >
        <span className="text-text-muted mr-1">{prefix}</span>
        {children}
        {blink && (
          <span className="ml-1 inline-block w-[8px] h-[14px] bg-terminal-green animate-terminal-blink" />
        )}
      </span>
    )
  },
)

TerminalLine.displayName = "TerminalLine"
