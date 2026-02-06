import { Link, createFileRoute } from "@tanstack/react-router"
import { GridBackground } from "../components/ui/grid-background"
import { PixelButton } from "../components/ui/pixel-button"
import { PixelCard, PixelCardContent } from "../components/ui/pixel-card"
import { TerminalText } from "../components/ui/terminal-text"
import { TerminalLoader } from "../components/ui/terminal-loader"
import { AsciiLobster } from "../components/ui/ascii-lobster"
import { useClaimCode, useRedeemClaim } from "../hooks/use-claim"
import { useTwitterAuth } from "../hooks/use-twitter-auth"
import { useI18n } from "../i18n"

function ClaimLoading() {
  const { t } = useI18n()

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <TerminalLoader text={t.claim.verifying} />
    </div>
  )
}

function ClaimError() {
  const { t } = useI18n()

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-center">
      <TerminalText color="amber" className="font-pixel text-sm">
        {t.claim.codeNotFound}
      </TerminalText>
      <p className="mt-4 font-mono text-xs text-text-muted">
        {t.claim.codeNotFoundDesc}
      </p>
      <Link to="/mint" className="mt-6 inline-block">
        <PixelButton variant="terminal">{t.common.back}</PixelButton>
      </Link>
    </div>
  )
}

function ClaimExpired() {
  const { t } = useI18n()

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-center">
      <TerminalText color="amber" className="font-pixel text-sm">
        {t.claim.codeExpired}
      </TerminalText>
      <p className="mt-4 font-mono text-xs text-text-muted">
        {t.claim.codeExpiredDesc}
      </p>
      <Link to="/mint" className="mt-6 inline-block">
        <PixelButton variant="terminal">{t.common.back}</PixelButton>
      </Link>
    </div>
  )
}

function ClaimAlreadyClaimed() {
  const { t } = useI18n()

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-center">
      <TerminalText color="amber" className="font-pixel text-sm">
        {t.claim.alreadyClaimed}
      </TerminalText>
      <p className="mt-4 font-mono text-xs text-text-muted">
        {t.claim.alreadyClaimedDesc}
      </p>
      <Link to="/" className="mt-6 inline-block">
        <PixelButton variant="terminal">{t.common.home}</PixelButton>
      </Link>
    </div>
  )
}

function ClaimSuccess() {
  const { t } = useI18n()

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-center">
      <AsciiLobster stage="cyber" size="lg" className="mx-auto" />
      <TerminalText color="green" className="mt-6 font-pixel text-sm">
        {t.claim.success}
      </TerminalText>
      <p className="mt-4 font-mono text-xs text-text-muted">
        {t.claim.successDesc}
      </p>
      <Link to="/" className="mt-6 inline-block">
        <PixelButton variant="primary" size="lg">
          {t.common.viewDashboard}
        </PixelButton>
      </Link>
    </div>
  )
}

interface AgentPreviewProps {
  agent: { name: string; level: number; stage: string; capabilities: string }
}

function AgentPreview({ agent }: AgentPreviewProps) {
  const capabilities = agent.capabilities
    ? agent.capabilities.split(",").map((s) => s.trim())
    : []

  return (
    <PixelCard glow="cyan" className="mx-auto max-w-sm">
      <PixelCardContent>
        <div className="flex flex-col items-center gap-3 text-center">
          <AsciiLobster stage={agent.stage === "cyber" ? "cyber" : "rookie"} size="md" />
          <h3 className="font-pixel text-xs text-coral">{agent.name}</h3>
          <p className="font-mono text-[11px] text-text-muted">
            Level {agent.level} / {agent.stage}
          </p>
          {capabilities.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1">
              {capabilities.map((c) => (
                <span key={c} className="rounded bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-cyan">
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
      </PixelCardContent>
    </PixelCard>
  )
}

function ClaimValid({ agent, code }: AgentPreviewProps & { code: string }) {
  const { twitterSession, login, isLoading: loginLoading } = useTwitterAuth()
  const redeem = useRedeemClaim()
  const { t } = useI18n()

  function handleClaim() {
    redeem.mutate({ code })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-12 text-center">
      <TerminalText color="green" className="font-pixel text-sm">
        {t.claim.codeValid}
      </TerminalText>
      <AgentPreview agent={agent} />
      {twitterSession ? (
        <div className="space-y-2">
          <p className="font-mono text-xs text-text-muted">
            {t.claim.claimingAs.replace("{handle}", twitterSession.twitterHandle)}
          </p>
          <PixelButton
            variant="primary"
            size="lg"
            onClick={handleClaim}
            disabled={redeem.isPending}
          >
            {redeem.isPending ? t.claim.claiming : t.claim.claimThisAgent}
          </PixelButton>
          {redeem.isError && (
            <TerminalText color="amber" className="text-xs">
              {t.claim.claimFailed}
            </TerminalText>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <p className="font-mono text-xs text-text-muted">
            {t.claim.signInTwitter}
          </p>
          <PixelButton
            variant="primary"
            size="lg"
            onClick={() => login()}
            disabled={loginLoading}
          >
            {loginLoading ? t.claim.signingIn : t.claim.signInButton}
          </PixelButton>
        </div>
      )}
    </div>
  )
}

function ClaimPage() {
  const { code } = Route.useParams()
  const { data, isLoading, isError } = useClaimCode(code)
  const redeem = useRedeemClaim()

  if (redeem.isSuccess) return <ClaimSuccess />
  if (isLoading) return <ClaimLoading />
  if (isError || !data) return <ClaimError />
  if (data.status === "expired") return <ClaimExpired />
  if (data.status === "claimed") return <ClaimAlreadyClaimed />
  if (data.status === "valid" && data.agent) {
    return <ClaimValid agent={data.agent} code={code} />
  }

  return <ClaimError />
}

function ClaimRoute() {
  return (
    <GridBackground>
      <ClaimPage />
    </GridBackground>
  )
}

export const Route = createFileRoute("/claim/$code")({
  component: ClaimRoute,
})
