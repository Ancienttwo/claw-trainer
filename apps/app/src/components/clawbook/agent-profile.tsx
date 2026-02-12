/**
 * Full agent profile view with BAP-578 state, reputation, and learning.
 */

import { useState } from "react"
import type { AgentDetail } from "../../hooks/use-agent"
import { useAgentState } from "../../hooks/use-agent-state"
import { useReputation } from "../../hooks/use-reputation"
import { useLearning } from "../../hooks/use-learning"
import { AgentResume } from "./agent-resume"
import { ActivityFeed } from "./activity-feed"
import { HireSection } from "./hire-section"
import { PixelButton } from "../ui/pixel-button"
import { parseEther } from "viem"

interface AgentProfileProps {
  agent: AgentDetail
}

export function AgentProfile({ agent }: AgentProfileProps) {
  const [fundAmount, setFundAmount] = useState("")
  const [funding, setFunding] = useState(false)

  const nfaTokenId = agent.tokenId
  const erc8004Id = agent.erc8004AgentId ?? null
  const erc8004IdBigint = erc8004Id !== null ? erc8004Id : null

  const {
    state,
    isOwner,
    pauseAgent,
    unpauseAgent,
    fundAgent,
  } = useAgentState(nfaTokenId)

  const { data: reputation } = useReputation(erc8004IdBigint)
  const { data: learning } = useLearning(nfaTokenId)

  async function handleFund() {
    const amount = fundAmount.trim()
    if (!amount || Number.isNaN(Number(amount))) return
    setFunding(true)
    try {
      await fundAgent(parseEther(amount))
      setFundAmount("")
    } finally {
      setFunding(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <AgentResume
          agent={agent}
          status={state?.status}
          reputation={reputation}
          learning={learning}
          persona={agent.persona}
          isOwner={isOwner}
          onPause={pauseAgent}
          onResume={unpauseAgent}
          onFund={handleFund}
        />
      </div>
      <div className="space-y-4">
        {isOwner && state?.status !== "Terminated" && (
          <div className="rounded-pixel border-2 border-border-subtle bg-surface-raised p-4">
            <h3 className="mb-3 font-display text-sm text-text-primary">Fund Agent</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                placeholder="BNB amount"
                className="flex-1 rounded border border-border-subtle bg-surface-base px-3 py-2 font-mono text-xs text-text-primary placeholder:text-text-muted focus:border-cyan focus:outline-none"
              />
              <PixelButton
                variant="primary"
                size="sm"
                disabled={funding || !fundAmount.trim()}
                onClick={handleFund}
              >
                {funding ? "..." : "Fund"}
              </PixelButton>
            </div>
            {state && (
              <p className="mt-2 font-mono text-[10px] text-text-muted">
                Balance: {(Number(state.balance) / 1e18).toFixed(6)} BNB
              </p>
            )}
          </div>
        )}

        {erc8004Id !== null && (
          <div className="rounded-pixel border-2 border-border-subtle bg-surface-raised p-4">
            <h3 className="mb-3 font-display text-sm text-text-primary">ERC-8004 Identity</h3>
            <p className="font-mono text-[10px] text-terminal-green">
              eip155:97:{agent.owner}:{erc8004Id.toString()}
            </p>
          </div>
        )}

        <ActivityFeed tokenId={agent.tokenId.toString()} />
        <HireSection />
      </div>
    </div>
  )
}
