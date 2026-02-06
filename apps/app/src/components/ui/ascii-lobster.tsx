/**
 * ASCII art lobster component with 3 evolution stages.
 * Used throughout the UI for visual identity (Pokemon-style creature art).
 */

import { cn } from "../../lib/cn"

type Stage = "rookie" | "pro" | "cyber"
type Size = "sm" | "md" | "lg"

interface AsciiLobsterProps {
  stage: Stage
  size?: Size
  className?: string
}

const ROOKIE_ART = `    /\\
   (o )>
    ||
   /  \\`

const PRO_ART = `    /\\/\\
   {o  o}>
   |####|
   /|  |\\
  / |  | \\`

const CYBER_ART = `   ╔══╗
  ║@  @║>
  ╠════╣
  ║~~~~║
  ╚╦══╦╝
   ╩  ╩`

const artMap: Record<Stage, string> = {
  rookie: ROOKIE_ART,
  pro: PRO_ART,
  cyber: CYBER_ART,
}

const colorMap: Record<Stage, string> = {
  rookie: "text-coral",
  pro: "text-coral-mid",
  cyber: "text-cyan",
}

const glowMap: Record<Stage, string> = {
  rookie: "",
  pro: "",
  cyber: "animate-glow-pulse",
}

const sizeMap: Record<Size, string> = {
  sm: "text-[8px] leading-[10px]",
  md: "text-[12px] leading-[14px]",
  lg: "text-[16px] leading-[19px]",
}

export function AsciiLobster({ stage, size = "md", className }: AsciiLobsterProps) {
  return (
    <pre
      className={cn(
        "select-none whitespace-pre font-mono",
        colorMap[stage],
        sizeMap[size],
        glowMap[stage],
        className,
      )}
      aria-hidden="true"
    >
      {artMap[stage]}
    </pre>
  )
}
