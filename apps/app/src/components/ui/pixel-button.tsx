import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cn } from "../../lib/cn"

const variants = {
  primary:
    "bg-coral-mid text-white hover:bg-coral hover:shadow-glow-coral",
  terminal:
    "bg-surface-base border-2 border-terminal-green-dim text-terminal-green hover:bg-terminal-green-dim/20 hover:border-terminal-green",
  outline:
    "bg-transparent border-2 border-border-accent text-coral hover:bg-coral hover:text-white",
} as const

const sizes = {
  sm: "h-8 px-2 py-1 text-[8px]",
  md: "h-10 px-4 py-2 text-[10px]",
  lg: "h-12 px-6 py-2 text-[10px]",
} as const

type PixelButtonVariant = keyof typeof variants
type PixelButtonSize = keyof typeof sizes

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: PixelButtonVariant
  size?: PixelButtonSize
}

export const PixelButton = forwardRef<HTMLButtonElement, PixelButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-pixel",
          "rounded-pixel border-2 border-transparent",
          "transition-all duration-150 ease-out",
          "active:scale-[0.95] active:translate-y-[2px]",
          "disabled:pointer-events-none disabled:opacity-50",
          "[image-rendering:pixelated]",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      />
    )
  },
)

PixelButton.displayName = "PixelButton"
