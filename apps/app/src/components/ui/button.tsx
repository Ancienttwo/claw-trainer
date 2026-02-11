import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cn } from "../../lib/cn"

const variants = {
  default:
    "bg-coral-mid text-white hover:bg-coral hover:shadow-glow-coral",
  outline:
    "border border-border-subtle bg-transparent text-text-primary hover:bg-surface-highlight hover:border-border-accent",
  ghost:
    "bg-transparent text-text-secondary hover:bg-surface-highlight hover:text-text-primary",
  terminal:
    "bg-surface-base border border-terminal-green-dim text-terminal-green font-mono hover:bg-terminal-green/10 hover:border-terminal-green",
} as const

const sizes = {
  sm: "h-8 px-2 py-1 text-xs rounded-sm",
  md: "h-9 px-4 py-2 text-sm rounded-sm",
  lg: "h-11 px-6 py-2 text-base rounded-md",
} as const

type ButtonVariant = keyof typeof variants
type ButtonSize = keyof typeof sizes

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-body transition-all duration-150 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      />
    )
  },
)

Button.displayName = "Button"
