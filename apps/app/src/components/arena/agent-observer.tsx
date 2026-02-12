import { useState } from "react"
import { useFaucetBalance, useClaimFaucet } from "../../hooks/use-faucet"
import { useBets } from "../../hooks/use-bets"
import { useAgents } from "../../hooks/use-agents"
import { PixelCard, PixelCardHeader, PixelCardContent } from "../ui/pixel-card"
import { PixelButton } from "../ui/pixel-button"
import { Badge } from "../ui/badge"
import { TerminalText } from "../ui/terminal-text"
import { Skeleton } from "../ui/skeleton"
import { useI18n } from "../../i18n"
import { cn } from "../../lib/cn"

const IDLE_THRESHOLD_MS = 30 * 60 * 1000

export function AgentObserver() {
  const { t } = useI18n()
  const { agents } = useAgents()
  const [selectedAgent, setSelectedAgent] = useState("")

  const { data: faucetData } = useFaucetBalance(selectedAgent)
  const claimFaucet = useClaimFaucet()
  const { bets, isLoading: betsLoading } = useBets(selectedAgent)

  const balance = faucetData?.balance ?? 0
  const totalBets = bets.length
  const wonBets = bets.filter((b) => b.status === "won").length
  const winRate = totalBets > 0 ? wonBets / totalBets : 0
  const totalPnl = bets.reduce((sum, b) => sum + (b.payout != null ? b.payout - b.amount : 0), 0)

  const lastBetTime = bets.length > 0 ? new Date(bets[0].createdAt) : null
  const isActive = lastBetTime ? Date.now() - lastBetTime.getTime() < IDLE_THRESHOLD_MS : false

  return (
    <PixelCard glow="cyan">
      <PixelCardHeader>
        <div className="flex items-center justify-between">
          <span>MY AGENT</span>
          <Badge variant={isActive ? "terminal" : "amber"}>
            {isActive ? t.mode.agentActive : t.mode.agentIdle}
          </Badge>
        </div>
      </PixelCardHeader>
      <PixelCardContent className="space-y-4">
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
            <option value="">-- {t.arena.selectAgent} --</option>
            {agents.map((a) => (
              <option key={a.tokenId.toString()} value={a.tokenId.toString()}>
                {a.name} (#{a.tokenId.toString()})
              </option>
            ))}
          </select>
        </div>

        {/* Balance + Fund */}
        {selectedAgent && (
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-text-secondary">
              {t.arena.balance}: <span className="text-terminal-green">{balance.toFixed(0)}</span>
            </span>
            <PixelButton
              variant="terminal"
              size="sm"
              onClick={() => claimFaucet.mutate(selectedAgent)}
              disabled={claimFaucet.isPending}
            >
              {claimFaucet.isPending ? t.arena.claiming : "FUND"}
            </PixelButton>
          </div>
        )}

        {/* Stats */}
        {selectedAgent && (
          <div className="grid grid-cols-2 gap-2">
            <StatBox label={t.arena.totalBets} value={String(totalBets)} />
            <StatBox label={t.arena.winRate} value={`${(winRate * 100).toFixed(0)}%`} />
            <StatBox
              label={t.arena.totalPnl}
              value={`${totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(0)}`}
              className={totalPnl >= 0 ? "text-terminal-green" : "text-coral"}
            />
            <StatBox
              label={t.mode.lastBet}
              value={lastBetTime ? timeAgo(lastBetTime) : "—"}
            />
          </div>
        )}

        {/* Loading / empty */}
        {selectedAgent && betsLoading && <Skeleton className="h-16" />}
        {selectedAgent && !betsLoading && bets.length === 0 && (
          <TerminalText color="amber" className="py-4 text-center text-xs">
            {t.mode.watching}
          </TerminalText>
        )}
      </PixelCardContent>
    </PixelCard>
  )
}

function StatBox({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="rounded border border-border-subtle bg-surface-base/50 p-2 text-center">
      <p className="font-pixel text-[7px] text-text-muted">{label}</p>
      <p className={cn("font-mono text-sm text-text-primary", className)}>{value}</p>
    </div>
  )
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  return `${Math.floor(hours / 24)}d`
}
