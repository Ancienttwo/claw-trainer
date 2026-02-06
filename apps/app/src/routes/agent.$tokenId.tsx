import { createFileRoute, Link } from "@tanstack/react-router"
import { GridBackground } from "../components/ui/grid-background"
import { TerminalText } from "../components/ui/terminal-text"
import { TerminalLoader } from "../components/ui/terminal-loader"
import { PixelButton } from "../components/ui/pixel-button"
import { AgentProfile } from "../components/moltbook/agent-profile"
import { useAgent } from "../hooks/use-agent"

function AgentLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-6">
      <TerminalLoader text="Loading agent data from chain..." />
    </div>
  )
}

function AgentNotFound({ tokenId }: { tokenId: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <TerminalText color="amber" className="font-pixel text-sm">
        ERROR 404: Agent #{tokenId} not found on-chain
      </TerminalText>
      <TerminalText color="green" className="text-xs">
        &gt; The requested NFA does not exist or has not been minted.
      </TerminalText>
      <Link to="/dex">
        <PixelButton variant="terminal" size="md">
          Back to Dex
        </PixelButton>
      </Link>
    </div>
  )
}

function AgentError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <TerminalText color="amber">
        Failed to load agent data from chain.
      </TerminalText>
      <PixelButton variant="terminal" size="sm" onClick={onRetry}>
        Retry
      </PixelButton>
    </div>
  )
}

function AgentPage() {
  const { tokenId } = Route.useParams()
  const tokenIdBigInt = BigInt(tokenId)
  const { agent, isLoading, isError, refetch } = useAgent(tokenIdBigInt)

  return (
    <GridBackground>
      <div className="mx-auto max-w-6xl px-4 py-6">
        {isLoading && <AgentLoading />}
        {isError && <AgentError onRetry={() => refetch()} />}
        {!isLoading && !isError && !agent && (
          <AgentNotFound tokenId={tokenId} />
        )}
        {agent && <AgentProfile agent={agent} />}
      </div>
    </GridBackground>
  )
}

export const Route = createFileRoute("/agent/$tokenId")({
  component: AgentPage,
})
