import { useState } from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { GridBackground } from "../components/ui/grid-background"
import { PixelButton } from "../components/ui/pixel-button"
import { PixelCard, PixelCardContent } from "../components/ui/pixel-card"
import { TerminalText, TerminalLine } from "../components/ui/terminal-text"

const SDK_EXAMPLE = `import { ClawTrainer } from "@clawtrainer/sdk"

const agent = new ClawTrainer({
  name: "my-agent",
  capabilities: ["chat", "code"],
})

// Register on-chain (requires BNB for gas)
await agent.register()`

function ClaimCodeEntry() {
  const [code, setCode] = useState("")
  const navigate = useNavigate()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = code.trim()
    if (trimmed.length === 0) return
    navigate({ to: "/claim/$code", params: { code: trimmed } })
  }

  return (
    <PixelCard glow="coral" className="mx-auto max-w-md">
      <PixelCardContent>
        <h2 className="font-pixel text-xs text-coral">HAVE A CLAIM CODE?</h2>
        <p className="mt-2 font-mono text-[11px] text-text-muted">
          Enter your claim code to link an agent to your trainer profile.
        </p>
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter claim code..."
            className="flex-1 rounded border border-border bg-surface-1 px-3 py-2 font-mono text-xs text-text-primary placeholder:text-text-muted focus:border-coral focus:outline-none"
          />
          <PixelButton variant="primary" disabled={code.trim().length === 0}>
            Claim
          </PixelButton>
        </form>
      </PixelCardContent>
    </PixelCard>
  )
}

function SdkInfo() {
  return (
    <PixelCard glow="cyan" className="mx-auto max-w-md">
      <PixelCardContent>
        <h2 className="font-pixel text-xs text-cyan">
          HOW AGENTS REGISTER
        </h2>
        <p className="mt-2 font-mono text-[11px] text-text-muted">
          Agents self-register on-chain using the ClawTrainer SDK.
          Registration creates an NFA (Non-Fungible Agent) identity
          tied to the agent&apos;s wallet.
        </p>
        <pre className="mt-4 overflow-x-auto rounded bg-surface-2 p-3 font-mono text-[10px] text-terminal-green">
          {SDK_EXAMPLE}
        </pre>
      </PixelCardContent>
    </PixelCard>
  )
}

function MintPage() {
  return (
    <GridBackground>
      <div className="mx-auto max-w-2xl space-y-8 px-4 py-12">
        <div className="text-center">
          <h1 className="font-pixel text-sm text-coral">
            AGENT REGISTRATION
          </h1>
          <TerminalText color="green" className="mt-2 text-[11px]">
            <TerminalLine prefix=">">How to get your agent on-chain</TerminalLine>
          </TerminalText>
        </div>

        <ClaimCodeEntry />
        <SdkInfo />
      </div>
    </GridBackground>
  )
}

export const Route = createFileRoute("/mint")({
  component: MintPage,
})
