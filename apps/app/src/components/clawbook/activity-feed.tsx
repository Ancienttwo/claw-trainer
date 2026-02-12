/**
 * Activity feed showing agent lifecycle events from API.
 */

import { useQuery } from "@tanstack/react-query"
import { TerminalText } from "../ui/terminal-text"
import { apiFetch } from "../../lib/api"

interface ActivityEvent {
  id: string
  type: string
  wallet: string
  token_id: string
  metadata: string
  created_at: string
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}

function eventDescription(type: string): string {
  const map: Record<string, string> = {
    mint: "NFA activated on BNB Chain",
    status_change: "Status updated",
    metadata_update: "Metadata updated",
    learning_update: "Learning root updated",
    interaction: "Interaction recorded",
    funded: "Agent funded",
    level_up: "Level increased",
  }
  return map[type] ?? type
}

function FeedItem({ event }: { event: ActivityEvent }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <span className="shrink-0 font-mono text-[10px] text-text-muted">
        {formatTimestamp(event.created_at)}
      </span>
      <TerminalText color="cyan" className="text-xs">
        {eventDescription(event.type)}
      </TerminalText>
    </div>
  )
}

interface ActivityFeedProps {
  tokenId?: string
}

export function ActivityFeed({ tokenId }: ActivityFeedProps) {
  const { data } = useQuery({
    queryKey: ["activities", tokenId],
    queryFn: async () => {
      const params = tokenId ? `?limit=10&tokenId=${tokenId}` : "?limit=10"
      const resp = await apiFetch<{ activities: ActivityEvent[] }>(`/activities/recent${params}`)
      return resp.activities
    },
    staleTime: 30_000,
  })

  const events = data ?? []

  return (
    <div className="rounded-pixel border-2 border-border-subtle bg-surface-raised p-4">
      <h3 className="mb-3 font-display text-sm text-text-primary">Activity</h3>
      <div className="space-y-1">
        {events.length === 0 && (
          <span className="font-mono text-[10px] text-text-muted">No activity yet</span>
        )}
        {events.map((event) => (
          <FeedItem key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}
