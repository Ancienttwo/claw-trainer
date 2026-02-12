import { useState } from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { GridBackground } from "../components/ui/grid-background"
import { PixelButton } from "../components/ui/pixel-button"
import { PixelCard, PixelCardContent } from "../components/ui/pixel-card"
import { TerminalText, TerminalLine } from "../components/ui/terminal-text"
import { useI18n } from "../i18n"

const STEP_REGISTER = `// 1. Register agent in official ERC-8004 IdentityRegistry
const agentId = await identityRegistry.register(agentURI)
// → agentId: unique ERC-721 NFT ID`

const STEP_WALLET = `// 2. Bind agent wallet with EIP-712 signature
await identityRegistry.setAgentWallet(
  agentId, agentWallet, deadline, agentSig
)  // wallet bound ✓`

const STEP_ACTIVATE = `// 3. Activate BAP-578 NFA on ClawTrainerNFA
const nfaId = await clawTrainerNFA.activate(
  agentId, { persona, experience, ... }, agentSig
)  // status: Active | learning: enabled`

function ClaimCodeEntry() {
  const [code, setCode] = useState("")
  const navigate = useNavigate()
  const { t } = useI18n()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = code.trim()
    if (trimmed.length === 0) return
    navigate({ to: "/claim/$code", params: { code: trimmed } })
  }

  return (
    <PixelCard glow="coral" className="mx-auto max-w-lg">
      <PixelCardContent>
        <h2 className="font-pixel text-xs text-coral">{t.mint.claimTitle}</h2>
        <p className="mt-2 font-mono text-[11px] text-text-muted">
          {t.mint.claimDesc}
        </p>
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={t.mint.claimPlaceholder}
            className="flex-1 rounded border border-border-subtle bg-surface-base px-3 py-2 font-mono text-xs text-text-primary placeholder:text-text-muted focus:border-coral focus:outline-none"
          />
          <PixelButton variant="primary" disabled={code.trim().length === 0}>
            {t.mint.claimButton}
          </PixelButton>
        </form>
      </PixelCardContent>
    </PixelCard>
  )
}

function StepCard({ step, title, code }: { step: string; title: string; code: string }) {
  return (
    <div className="space-y-2">
      <h3 className="font-pixel text-[10px] text-cyan">{step}. {title}</h3>
      <pre className="overflow-x-auto rounded bg-code-bg p-3 font-mono text-[10px] leading-relaxed text-code-green">
        {code}
      </pre>
    </div>
  )
}

function HowItWorks() {
  const { t } = useI18n()

  return (
    <PixelCard glow="cyan" className="mx-auto max-w-lg">
      <PixelCardContent>
        <h2 className="font-pixel text-xs text-cyan">
          {t.mint.howItWorks}
        </h2>
        <p className="mt-2 font-mono text-[11px] text-text-muted">
          ERC-8004 Identity + BAP-578 Lifecycle: 3-step registration flow
        </p>
        <div className="mt-4 space-y-4">
          <StepCard step="1" title="Register in ERC-8004" code={STEP_REGISTER} />
          <StepCard step="2" title="Bind Agent Wallet" code={STEP_WALLET} />
          <StepCard step="3" title="Activate BAP-578 NFA" code={STEP_ACTIVATE} />
        </div>
      </PixelCardContent>
    </PixelCard>
  )
}

function MintPage() {
  const { t } = useI18n()

  return (
    <GridBackground>
      <div className="mx-auto max-w-2xl space-y-8 px-4 py-12">
        <div className="text-center">
          <h1 className="font-pixel text-sm text-coral">
            {t.mint.title}
          </h1>
          <TerminalText color="green" className="mt-2 text-[11px]">
            <TerminalLine prefix=">">{t.mint.subtitle}</TerminalLine>
          </TerminalText>
        </div>

        <ClaimCodeEntry />
        <HowItWorks />
      </div>
    </GridBackground>
  )
}

export const Route = createFileRoute("/mint")({
  component: MintPage,
})
