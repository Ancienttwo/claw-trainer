import { forwardRef, type HTMLAttributes } from "react"
import { cn } from "../../lib/cn"

interface GridBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  gridSize?: number
  gridOpacity?: "subtle" | "medium" | "strong"
}

const opacityMap = {
  subtle: "0.03",
  medium: "0.06",
  strong: "0.1",
} as const

export const GridBackground = forwardRef<HTMLDivElement, GridBackgroundProps>(
  ({ className, gridSize = 32, gridOpacity = "subtle", children, ...props }, ref) => {
    const opacity = opacityMap[gridOpacity]

    return (
      <div
        ref={ref}
        className={cn(
          "min-h-screen bg-surface-deep",
          className,
        )}
        style={{
          backgroundImage: [
            `linear-gradient(rgba(0, 229, 204, ${opacity}) 1px, transparent 1px)`,
            `linear-gradient(90deg, rgba(0, 229, 204, ${opacity}) 1px, transparent 1px)`,
          ].join(", "),
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
        {...props}
      >
        {children}
      </div>
    )
  },
)

GridBackground.displayName = "GridBackground"
