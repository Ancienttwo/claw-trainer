import { useState } from "react"
import { PixelCard, PixelCardContent } from "../ui/pixel-card"
import { Badge } from "../ui/badge"
import { TerminalText } from "../ui/terminal-text"
import { Skeleton } from "../ui/skeleton"
import { MyBets } from "../arena/my-bets"
import { useFaucetBalance } from "../../hooks/use-faucet"
import { useBets } from "../../hooks/use-bets"
import type { AgentListItem } from "../../hooks/use-agents"
import { useI18n } from "../../i18n"
import { cn } from "../../lib/cn"

const IDLE_THRESHOLD_MS = 30 * 60 * 1000

export function AgentDashboard({ agents }: { agents: AgentListItem[] }) {
  const { t } = useI18n()
  const [selectedAgent, setSelectedAgent] = useState(
    agents.length > 0 ? agents[0].tokenId.toString() : "",
  )

  const { data: faucetData } = useFaucetBalance(selectedAgent)
  const { bets, isLoading } = useBets(selectedAgent)

  const balance = faucetData?.balance ?? 0
  const agentBets = bets.filter((b) => b.source === "agent")
  const totalBets = agentBets.length
  const wonBets = agentBets.filter((b) => b.status === "won").length
  const winRate = totalBets > 0 ? wonBets / totalBets : 0
  const totalPnl = agentBets.reduce((sum, b) => sum + (b.payout != null ? b.payout - b.amount : 0), 0)

  const lastBetTime = agentBets.length > 0 ? new Date(agentBets[0].createdAt) : null
  const isActive = lastBetTime ? Date.now() - lastBetTime.getTime() < IDLE_THRESHOLD_MS : false

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="font-pixel text-sm text-cyan">{t.mode.observing}</h1>
          <Badge variant={isActive ? "terminal" : "amber"}>
            {isActive ? t.mode.agentActive : t.mode.agentIdle}
          </Badge>
        </div>
        <TerminalText color="cyan">&gt; {t.mode.watching}</TerminalText>
      </div>

      {/* Agent Selector */}
      <div>
        <label className="mb-1 block font-pixel text-[8px] text-text-secondary">
          {t.arena.selectAgent}
        </label>
        <select
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
          className="w-full rounded-sm border border-border-subtle bg-surface-base px-2 py-1 font-mono text-xs text-text-primary"
        >
          {agents.map((a) => (
            <option key={a.tokenId.toString()} value={a.tokenId.toString()}>
              {a.name} (#{a.tokenId.toString()})
            </option>
          ))}
        </select>
      </div>

      {/* Stats Grid */}
      <PixelCard glow="cyan">
        <PixelCardContent>
          {isLoading ? (
            <Skeleton className="h-20" />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatBlock label={t.arena.balance} value={balance.toFixed(0)} className="text-terminal-green" />
              <StatBlock label={t.mode.autonomousBets} value={String(totalBets)} />
              <StatBlock label={t.arena.winRate} value={`${(winRate * 100).toFixed(0)}%`} />
              <StatBlock
                label={t.arena.totalPnl}
                value={`${totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(0)}`}
                className={totalPnl >= 0 ? "text-terminal-green" : "text-coral"}
              />
            </div>
          )}
        </PixelCardContent>
      </PixelCard>

      {/* Recent Agent Bets */}
      {selectedAgent && <MyBets agentTokenId={selectedAgent} />}
    </div>
  )
}

function StatBlock({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-pixel text-[8px] text-text-muted uppercase">{label}</span>
      <span className={cn("font-display text-lg text-text-primary", className)}>{value}</span>
    </div>
  )
}
