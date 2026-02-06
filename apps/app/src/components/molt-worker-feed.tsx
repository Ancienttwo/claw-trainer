import { useEffect, useRef, useState } from "react"
import { cn } from "../lib/cn"
import { useMoltWorker, type BroadcastMessage } from "../hooks/use-molt-worker"
import { AsciiLobster } from "./ui/ascii-lobster"
import { useI18n } from "../i18n"

const STORAGE_KEY = "molt_worker_open"

const typeColorMap: Record<BroadcastMessage["type"], string> = {
  mint: "text-coral",
  quest: "text-cyan",
  level_up: "text-amber",
  system: "text-terminal-green",
}

function getDefaultOpen(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) return stored === "true"
  } catch {
    // localStorage unavailable
  }
  return window.matchMedia("(min-width: 768px)").matches
}

export function MoltWorkerFeed() {
  const [open, setOpen] = useState(getDefaultOpen)
  const [hasUnread, setHasUnread] = useState(false)
  const { messages, totalCount } = useMoltWorker()
  const prevCountRef = useRef(totalCount)
  const feedEndRef = useRef<HTMLDivElement>(null)
  const { t } = useI18n()

  // Persist open state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(open))
    } catch {
      // localStorage unavailable
    }
  }, [open])

  // Track unread when collapsed
  useEffect(() => {
    if (totalCount > prevCountRef.current && !open) {
      setHasUnread(true)
    }
    prevCountRef.current = totalCount
  }, [totalCount, open])

  // Clear unread on expand
  useEffect(() => {
    if (open) setHasUnread(false)
  }, [open])

  // Auto-scroll to bottom
  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="fixed bottom-4 left-4 z-40 hidden sm:block">
      {open && (
        <div className="mb-2 w-72 max-h-[300px] overflow-y-auto rounded border border-border-subtle bg-surface-base/95 backdrop-blur-sm">
          {/* Gradient fade at top */}
          <div className="pointer-events-none sticky top-0 h-6 bg-gradient-to-b from-surface-base to-transparent" />

          <div className="px-3 pb-3 pt-1 space-y-1">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "animate-feed-slide-in font-mono text-[11px] leading-relaxed",
                  typeColorMap[msg.type],
                )}
              >
                <span className="mr-1 text-text-muted">&gt;</span>
                {msg.text}
              </div>
            ))}
            <div ref={feedEndRef} />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="group relative flex items-center gap-2 rounded border border-border-subtle bg-surface-base/90 px-2 py-1.5 backdrop-blur-sm transition-colors hover:border-cyan/30"
      >
        <AsciiLobster stage="cyber" size="sm" className="transition-transform group-hover:scale-110" />
        <span className="font-pixel text-[8px] text-terminal-green">{t.common.moltWorker}</span>

        {hasUnread && (
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-coral animate-glow-pulse-amber" />
        )}
      </button>
    </div>
  )
}
