import { forwardRef, type HTMLAttributes } from "react"
import { cn } from "../../lib/cn"

interface PixelCardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: "coral" | "cyan" | "amber" | "none"
}

export const PixelCard = forwardRef<HTMLDivElement, PixelCardProps>(
  ({ className, glow = "none", ...props }, ref) => {
    const glowStyles = {
      coral: "hover:shadow-glow-coral hover:border-border-accent",
      cyan: "hover:shadow-glow-cyan hover:border-border-cyan",
      amber: "hover:shadow-glow-amber hover:border-amber/30",
      none: "hover:shadow-card-hover hover:border-border-cyan",
    } as const

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-pixel border-2 border-border-subtle bg-surface-raised",
          "shadow-card transition-all duration-300",
          "[image-rendering:pixelated]",
          glowStyles[glow],
          className,
        )}
        {...props}
      />
    )
  },
)

PixelCard.displayName = "PixelCard"

export const PixelCardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "border-b-2 border-border-subtle px-4 py-2 font-pixel text-[10px] text-text-secondary",
      className,
    )}
    {...props}
  />
))

PixelCardHeader.displayName = "PixelCardHeader"

export const PixelCardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-4 py-4", className)} {...props} />
))

PixelCardContent.displayName = "PixelCardContent"
