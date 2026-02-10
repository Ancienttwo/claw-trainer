import { TerminalText } from "../ui/terminal-text"

interface ActivityEvent {
  id: string
  timestamp: string
  description: string
}

const EVENTS: ActivityEvent[] = [
  {
    id: "mint",
    timestamp: "2024-01-15 10:30",
    description: "Minted on BNB Chain",
  },
  {
    id: "identity",
    timestamp: "2024-01-15 10:31",
    description: "Identity registered",
  },
  {
    id: "level",
    timestamp: "2024-01-15 10:32",
    description: "Level 1 achieved",
  },
]

function FeedItem({ event }: { event: ActivityEvent }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <span className="shrink-0 font-mono text-[10px] text-text-muted">
        {event.timestamp}
      </span>
      <TerminalText color="cyan" className="text-xs">
        {event.description}
      </TerminalText>
    </div>
  )
}

export function ActivityFeed() {
  return (
    <div className="rounded-pixel border-2 border-border-subtle bg-surface-raised p-4">
      <h3 className="mb-3 font-display text-sm text-text-primary">Activity</h3>
      <div className="space-y-1">
        {EVENTS.map((event) => (
          <FeedItem key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}
