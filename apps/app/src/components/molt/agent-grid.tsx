/**
 * Responsive grid layout for agent cards with loading/empty/error states.
 */

import { Link } from "@tanstack/react-router"
import { useAgents } from "../../hooks/use-agents"
import { Skeleton } from "../ui/skeleton"
import { PixelButton } from "../ui/pixel-button"
import { TerminalText } from "../ui/terminal-text"
import { AgentCard } from "./agent-card"

const SKELETON_COUNT = 6

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: SKELETON_COUNT }, (_, i) => (
        <Skeleton key={i} className="h-48 rounded-pixel" />
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <TerminalText color="amber">
        No Molts registered yet.
      </TerminalText>
      <Link to="/mint">
        <PixelButton variant="primary" size="md">
          Mint your first NFA
        </PixelButton>
      </Link>
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <TerminalText color="amber">
        Failed to load agents from chain.
      </TerminalText>
      <PixelButton variant="terminal" size="sm" onClick={onRetry}>
        Retry
      </PixelButton>
    </div>
  )
}

export function AgentGrid() {
  const { agents, isLoading, isError, refetch } = useAgents()

  if (isLoading) return <LoadingSkeleton />
  if (isError) return <ErrorState onRetry={() => refetch()} />
  if (agents.length === 0) return <EmptyState />

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent) => (
        <AgentCard key={agent.tokenId.toString()} agent={agent} />
      ))}
    </div>
  )
}
