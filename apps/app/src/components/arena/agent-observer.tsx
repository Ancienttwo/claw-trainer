import { useFaucetBalance, useClaimFaucet } from "../../hooks/use-faucet"
import { useBets } from "../../hooks/use-bets"
import { useAgents, type AgentListItem } from "../../hooks/use-agents"
import { PixelCard, PixelCardHeader, PixelCardContent } from "../ui/pixel-card"
import { PixelButton } from "../ui/pixel-button"
import { Badge } from "../ui/badge"
import { TerminalText } from "../ui/terminal-text"
import { useI18n } from "../../i18n"
import { cn } from "../../lib/cn"

const IDLE_THRESHOLD_MS = 30 * 60 * 1000

function AgentRow({ agent }: { agent: AgentListItem }) {
  const { t } = useI18n()
  const tokenId = agent.tokenId.toString()

  const { data: faucetData } = useFaucetBalance(tokenId)
  const claimFaucet = useClaimFaucet()
  const { bets } = useBets(tokenId)

  const balance = faucetData?.balance ?? 0
  const totalBets = bets.length
  const wonBets = bets.filter((b) => b.status === "won").length
  const winRate = totalBets > 0 ? wonBets / totalBets : 0
  const totalPnl = bets.reduce((sum, b) => sum + (b.payout != null ? b.payout - b.amount : 0), 0)
  const lastBetTime = bets.length > 0 ? new Date(bets[0].createdAt) : null
  const isActive = lastBetTime ? Date.now() - lastBetTime.getTime() < IDLE_THRESHOLD_MS : false

  return (
    <div className="space-y-2 border-b border-border-subtle pb-3 last:border-0 last:pb-0">
      {/* Name + status */}
      <div className="flex items-center justify-between">
        <span className="truncate font-body text-xs text-text-primary">{agent.name}</span>
        <Badge variant={isActive ? "terminal" : "amber"}>
          {isActive ? t.mode.agentActive : t.mode.agentIdle}
        </Badge>
      </div>

      {/* Balance + Fund */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] text-text-secondary">
          {t.arena.balance}: <span className="text-terminal-green">{balance.toFixed(0)}</span>
        </span>
        <PixelButton
          variant="terminal"
          size="sm"
          onClick={() => claimFaucet.mutate(tokenId)}
          disabled={claimFaucet.isPending}
        >
          {claimFaucet.isPending ? t.arena.claiming : "FUND"}
        </PixelButton>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-1">
        <MiniStat label={t.arena.totalBets} value={String(totalBets)} />
        <MiniStat label={t.arena.winRate} value={`${(winRate * 100).toFixed(0)}%`} />
        <MiniStat
          label="PnL"
          value={`${totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(0)}`}
          className={totalPnl >= 0 ? "text-terminal-green" : "text-coral"}
        />
        <MiniStat label={t.mode.lastBet} value={lastBetTime ? timeAgo(lastBetTime) : "—"} />
      </div>
    </div>
  )
}

function MiniStat({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="text-center">
      <p className="font-pixel text-[6px] text-text-muted">{label}</p>
      <p className={cn("font-mono text-[10px] text-text-primary", className)}>{value}</p>
    </div>
  )
}

export function AgentObserver() {
  const { t } = useI18n()
  const { agents } = useAgents()

  return (
    <PixelCard glow="cyan">
      <PixelCardHeader>MY AGENTS</PixelCardHeader>
      <PixelCardContent className="space-y-3">
        {agents.length === 0 && (
          <TerminalText color="amber" className="py-4 text-center text-xs">
            {t.dashboard.noAgents}
          </TerminalText>
        )}
        {agents.map((agent) => (
          <AgentRow key={agent.tokenId.toString()} agent={agent} />
        ))}
      </PixelCardContent>
    </PixelCard>
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
