import { createFileRoute, Link } from "@tanstack/react-router"
import { GridBackground } from "../components/ui/grid-background"
import { TerminalText } from "../components/ui/terminal-text"
import { TerminalLoader } from "../components/ui/terminal-loader"
import { PixelButton } from "../components/ui/pixel-button"
import { AgentProfile } from "../components/clawbook/agent-profile"
import { useAgent } from "../hooks/use-agent"
import { useI18n } from "../i18n"

function AgentLoading() {
  const { t } = useI18n()

  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-6">
      <TerminalLoader text={t.agent.loading} />
    </div>
  )
}

function AgentNotFound({ tokenId }: { tokenId: string }) {
  const { t } = useI18n()

  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <TerminalText color="amber" className="font-pixel text-sm">
        {t.agent.notFound.replace("{tokenId}", tokenId)}
      </TerminalText>
      <TerminalText color="green" className="text-xs">
        &gt; {t.agent.notFoundDesc}
      </TerminalText>
      <Link to="/dex">
        <PixelButton variant="terminal" size="md">
          {t.common.backToDex}
        </PixelButton>
      </Link>
    </div>
  )
}

function AgentError({ onRetry }: { onRetry: () => void }) {
  const { t } = useI18n()

  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <TerminalText color="amber">
        {t.agent.failedLoad}
      </TerminalText>
      <PixelButton variant="terminal" size="sm" onClick={onRetry}>
        {t.common.retry}
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
