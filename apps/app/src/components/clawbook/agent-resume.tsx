import { useState, useCallback } from "react"
import { PixelCard, PixelCardContent } from "../ui/pixel-card"
import { PixelBadge } from "../ui/pixel-badge"
import { TerminalText } from "../ui/terminal-text"
import { AsciiLobster } from "../ui/ascii-lobster"
import { AgentStateBadge } from "../claw/agent-state-badge"
import { ReputationTags } from "../claw/reputation-tags"
import { LearningPanel } from "../claw/learning-panel"
import { PixelButton } from "../ui/pixel-button"
import type { AgentDetail } from "../../hooks/use-agent"
import type { AgentStatus } from "../../hooks/use-agent-state"
import type { ReputationSummary } from "../../hooks/use-reputation"
import type { LearningData } from "../../hooks/use-learning"
import { truncateAddress } from "../../lib/address"
import { StatBar } from "../claw/stat-bar"
import { EvolutionBadge } from "../claw/evolution-badge"

const MAX_LEVEL = 255
const COPY_FEEDBACK_MS = 1500

const stageGlow = {
  rookie: "coral",
  pro: "amber",
  cyber: "cyan",
} as const

type GlowKey = keyof typeof stageGlow

function resolveGlow(stage: string): "coral" | "amber" | "cyan" {
  const key = stage.toLowerCase() as GlowKey
  return stageGlow[key] ?? "coral"
}

function CopyableAddress({ label, address }: { label: string; address: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), COPY_FEEDBACK_MS)
  }, [address])

  return (
    <div className="flex items-center justify-between">
      <span className="font-pixel text-[8px] text-text-muted">{label}</span>
      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center gap-1 font-mono text-xs text-text-secondary transition-colors hover:text-cyan"
      >
        {truncateAddress(address)}
        <span className="font-pixel text-[7px]">
          {copied ? "[ok]" : "[cp]"}
        </span>
      </button>
    </div>
  )
}

function ArtArea({ name, stage }: { name: string; stage: string }) {
  const lobsterStage = (
    stage.toLowerCase() === "cyber"
      ? "cyber"
      : stage.toLowerCase() === "pro"
        ? "pro"
        : "rookie"
  ) as "rookie" | "pro" | "cyber"

  return (
    <div className="crt-overlay flex h-48 flex-col items-center justify-center gap-2 rounded-sm bg-code-bg">
      <AsciiLobster stage={lobsterStage} size="lg" className="animate-float" />
      <span className="font-pixel text-[8px] text-text-muted">{name}</span>
    </div>
  )
}

function StatsSection({ agent }: { agent: AgentDetail }) {
  return (
    <div className="space-y-1">
      <StatBar
        label="LEVEL"
        value={agent.level}
        max={MAX_LEVEL}
        color="amber"
      />
      <StatBar
        label="CAPS"
        value={agent.capabilities.length}
        max={10}
        color="cyan"
      />
    </div>
  )
}

function CapabilitiesSection({
  capabilities,
}: {
  capabilities: string[]
}) {
  return (
    <div className="space-y-1">
      <span className="font-pixel text-[8px] text-text-muted">
        CAPABILITIES
      </span>
      <div className="flex flex-wrap gap-1">
        {capabilities.map((cap) => (
          <PixelBadge key={cap} kind="type" value="dev">
            {cap}
          </PixelBadge>
        ))}
      </div>
    </div>
  )
}

function MetadataSection({ agent }: { agent: AgentDetail }) {
  return (
    <div className="space-y-1 rounded-sm border border-border-subtle bg-surface-base p-2">
      <CopyableAddress label="OWNER" address={agent.owner} />
      <CopyableAddress label="AGENT WALLET" address={agent.agentWallet} />
      <div className="flex items-center justify-between">
        <span className="font-pixel text-[8px] text-text-muted">TOKEN ID</span>
        <span className="font-mono text-xs text-text-secondary">
          #{agent.tokenId.toString()}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-pixel text-[8px] text-text-muted">VERSION</span>
        <span className="font-mono text-xs text-text-secondary">
          v{agent.version}
        </span>
      </div>
    </div>
  )
}

interface AgentResumeProps {
  agent: AgentDetail
  status?: AgentStatus
  reputation?: ReputationSummary[]
  learning?: LearningData | null
  persona?: string
  isOwner?: boolean
  onPause?: () => void
  onResume?: () => void
  onFund?: () => void
}

export function AgentResume({
  agent,
  status,
  reputation,
  learning,
  persona,
  isOwner,
  onPause,
  onResume,
  onFund,
}: AgentResumeProps) {
  const glow = resolveGlow(agent.stage)

  return (
    <PixelCard glow={glow} className="w-full">
      <div className="border-b-2 border-border-subtle px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl text-text-primary">
              {agent.name}
            </h2>
            {status && <AgentStateBadge status={status} />}
          </div>
          <PixelBadge kind="level" value={agent.level} />
        </div>
        <EvolutionBadge currentStage={agent.stage} />
      </div>

      <PixelCardContent className="space-y-4">
        <ArtArea name={agent.name} stage={agent.stage} />
        <StatsSection agent={agent} />

        {persona && (
          <div className="space-y-1">
            <span className="font-pixel text-[8px] text-text-muted">PERSONA</span>
            <TerminalText color="cyan" className="text-[10px]">
              {persona}
            </TerminalText>
          </div>
        )}

        <CapabilitiesSection capabilities={agent.capabilities} />

        {reputation && reputation.length > 0 && (
          <div className="space-y-1">
            <span className="font-pixel text-[8px] text-text-muted">REPUTATION</span>
            <ReputationTags summaries={reputation} />
          </div>
        )}

        {learning && <LearningPanel learning={learning} />}

        <MetadataSection agent={agent} />

        <TerminalText color="green" className="text-[10px]">
          {agent.description}
        </TerminalText>

        {isOwner && status && status !== "Terminated" && (
          <div className="flex gap-2 border-t border-border-subtle pt-3">
            {status === "Active" && onPause && (
              <PixelButton variant="outline" size="sm" onClick={onPause}>
                Pause
              </PixelButton>
            )}
            {status === "Paused" && onResume && (
              <PixelButton variant="terminal" size="sm" onClick={onResume}>
                Resume
              </PixelButton>
            )}
            {onFund && (
              <PixelButton variant="primary" size="sm" onClick={onFund}>
                Fund Agent
              </PixelButton>
            )}
          </div>
        )}
      </PixelCardContent>
    </PixelCard>
  )
}
