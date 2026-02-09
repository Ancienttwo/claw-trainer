import { useState } from "react"
import type { Market } from "../../hooks/use-markets"
import { useFaucetBalance, useClaimFaucet } from "../../hooks/use-faucet"
import { usePlaceBet } from "../../hooks/use-bets"
import { useAgents } from "../../hooks/use-agents"
import { PixelCard, PixelCardHeader, PixelCardContent } from "../ui/pixel-card"
import { PixelButton } from "../ui/pixel-button"
import { Badge } from "../ui/badge"
import { useI18n } from "../../i18n"
import { useAccount } from "wagmi"

const MIN_BET = 1
const DEFAULT_BET = 100

export function BetPanel({ market }: { market: Market }) {
  const { t } = useI18n()
  const { isConnected } = useAccount()
  const { agents } = useAgents()
  const [selectedAgent, setSelectedAgent] = useState("")
  const [direction, setDirection] = useState<"yes" | "no">("yes")
  const [amount, setAmount] = useState(DEFAULT_BET)

  const { data: faucetData } = useFaucetBalance(selectedAgent)
  const claimFaucet = useClaimFaucet()
  const placeBet = usePlaceBet()

  const balance = faucetData?.balance ?? 0
  const yesPrice = market.outcomePrices[0] ?? 0
  const noPrice = market.outcomePrices[1] ?? 0
  const currentPrice = direction === "yes" ? yesPrice : noPrice

  function handleBet() {
    if (!selectedAgent || amount < MIN_BET) return
    placeBet.mutate({
      agentTokenId: selectedAgent,
      marketSlug: market.slug,
      marketQuestion: market.question,
      clobTokenId: market.clobTokenIds[direction === "yes" ? 0 : 1] ?? "",
      direction,
      amount,
    })
  }

  if (!isConnected) {
    return (
      <PixelCard>
        <PixelCardContent className="py-8 text-center">
          <p className="font-body text-sm text-text-secondary">{t.common.connect}</p>
        </PixelCardContent>
      </PixelCard>
    )
  }

  return (
    <PixelCard glow="coral">
      <PixelCardHeader>{t.arena.placeBet}</PixelCardHeader>
      <PixelCardContent className="space-y-4">
        {/* Agent Selector */}
        <div>
          <label className="mb-1 block font-pixel text-[8px] text-text-secondary">{t.arena.selectAgent}</label>
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

        {/* Balance + Faucet */}
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
              {claimFaucet.isPending ? t.arena.claiming : t.arena.claimFaucet}
            </PixelButton>
          </div>
        )}

        {/* Direction Toggle */}
        <div className="flex gap-2">
          <PixelButton
            variant={direction === "yes" ? "primary" : "outline"}
            size="sm"
            onClick={() => setDirection("yes")}
            className="flex-1"
          >
            {t.arena.yes} ({(yesPrice * 100).toFixed(0)}%)
          </PixelButton>
          <PixelButton
            variant={direction === "no" ? "primary" : "outline"}
            size="sm"
            onClick={() => setDirection("no")}
            className="flex-1"
          >
            {t.arena.no} ({(noPrice * 100).toFixed(0)}%)
          </PixelButton>
        </div>

        {/* Amount Input */}
        <div>
          <label className="mb-1 block font-pixel text-[8px] text-text-secondary">{t.arena.amount}</label>
          <input
            type="number"
            min={MIN_BET}
            max={balance}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full rounded-sm border border-border-subtle bg-surface-base px-2 py-1 font-mono text-xs text-text-primary"
          />
          <p className="mt-1 font-mono text-[10px] text-text-muted">
            {t.arena.entryPrice}: {currentPrice.toFixed(4)}
          </p>
        </div>

        {/* Place Bet Button */}
        <PixelButton
          variant="primary"
          size="md"
          className="w-full"
          onClick={handleBet}
          disabled={!selectedAgent || amount < MIN_BET || amount > balance || placeBet.isPending}
        >
          {placeBet.isPending ? t.arena.placing : t.arena.placeBet}
        </PixelButton>

        {placeBet.isSuccess && (
          <Badge variant="terminal" className="w-full justify-center">{t.arena.betSuccess}</Badge>
        )}
        {amount > balance && selectedAgent && (
          <Badge variant="coral" className="w-full justify-center">{t.arena.insufficientBalance}</Badge>
        )}
      </PixelCardContent>
    </PixelCard>
  )
}
