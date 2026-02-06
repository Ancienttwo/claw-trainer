import { createFileRoute, Link } from "@tanstack/react-router"
import { GridBackground } from "../components/ui/grid-background"
import { Skeleton } from "../components/ui/skeleton"
import { TerminalText } from "../components/ui/terminal-text"
import { TerminalLoader } from "../components/ui/terminal-loader"
import { PixelButton } from "../components/ui/pixel-button"
import { MoltCard } from "../components/molt/molt-card"
import { useAgent } from "../hooks/use-agent"

function CardLoading() {
  return (
    <div className="mx-auto max-w-md space-y-4">
      <TerminalLoader text="Loading agent data from chain..." />
      <Skeleton className="h-10 w-48 rounded-pixel" />
      <Skeleton className="h-96 rounded-pixel" />
    </div>
  )
}

function CardNotFound({ tokenId }: { tokenId: string }) {
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

function CardError({ onRetry }: { onRetry: () => void }) {
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

function CardPage() {
  const { tokenId } = Route.useParams()
  const tokenIdBigInt = BigInt(tokenId)
  const { agent, isLoading, isError, refetch } = useAgent(tokenIdBigInt)

  return (
    <GridBackground>
      <div className="mx-auto max-w-6xl px-4 py-6">
        {isLoading && <CardLoading />}
        {isError && <CardError onRetry={() => refetch()} />}
        {!isLoading && !isError && !agent && (
          <CardNotFound tokenId={tokenId} />
        )}
        {agent && <MoltCard agent={agent} />}
      </div>
    </GridBackground>
  )
}

export const Route = createFileRoute("/card/$tokenId")({
  component: CardPage,
})
