/**
 * Terminal-style loading indicator with blinking cursor
 * and character-by-character text reveal animation.
 */

import { useState, useEffect, useRef } from "react"
import { cn } from "../../lib/cn"

interface TerminalLoaderProps {
  text?: string
  className?: string
}

const CHAR_INTERVAL_MS = 40

export function TerminalLoader({
  text = "Loading...",
  className,
}: TerminalLoaderProps) {
  const [revealed, setRevealed] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null)

  useEffect(() => {
    setRevealed(0)
    intervalRef.current = setInterval(() => {
      setRevealed((prev) => {
        if (prev >= text.length) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          return prev
        }
        return prev + 1
      })
    }, CHAR_INTERVAL_MS)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [text])

  return (
    <div
      className={cn(
        "font-mono text-[13px] text-terminal-green",
        className,
      )}
    >
      <span className="text-text-muted mr-1">&gt;</span>
      <span>{text.slice(0, revealed)}</span>
      <span className="ml-px inline-block h-[14px] w-[8px] bg-terminal-green animate-terminal-blink align-middle" />
    </div>
  )
}
