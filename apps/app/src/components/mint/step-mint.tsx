import { PixelButton } from "../ui/pixel-button"
import { useMintFlowStore } from "../../stores/mint-flow-store"
import { useMintNfa } from "../../hooks/use-mint-nfa"
import { cn } from "../../lib/cn"

function TxStatusIndicator() {
  const { txStatus, error } = useMintFlowStore()

  if (txStatus === "signing") {
    return (
      <StatusBar color="amber" pulse>
        Awaiting wallet signature...
      </StatusBar>
    )
  }

  if (txStatus === "pending") {
    return (
      <StatusBar color="cyan" pulse>
        Transaction pending on BNB Chain...
      </StatusBar>
    )
  }

  if (txStatus === "error" && error) {
    return (
      <StatusBar color="coral">
        <span className="font-bold">Error:</span> {error.message}
      </StatusBar>
    )
  }

  return null
}

function StatusBar({ color, pulse, children }: {
  color: "amber" | "cyan" | "coral"
  pulse?: boolean
  children: React.ReactNode
}) {
  return (
    <div className={cn(
      "flex items-center gap-3 rounded-lg border px-4 py-3",
      color === "amber" && "border-amber/30 bg-amber/5",
      color === "cyan" && "border-cyan/30 bg-cyan/5",
      color === "coral" && "border-coral/30 bg-coral/5",
    )}>
      {pulse && (
        <div className={cn(
          "h-2 w-2 animate-pulse rounded-full",
          color === "amber" && "bg-amber",
          color === "cyan" && "bg-cyan",
        )} />
      )}
      <p className={cn(
        "font-mono text-sm",
        color === "amber" && "text-amber",
        color === "cyan" && "text-cyan",
        color === "coral" && "text-coral",
      )}>
        {children}
      </p>
    </div>
  )
}

export function StepMint() {
  const { agentConfig, txStatus, setStep } = useMintFlowStore()
  const { mintAgent } = useMintNfa()

  if (!agentConfig) return null

  const isProcessing = txStatus === "signing" || txStatus === "pending"

  return (
    <div className="space-y-6">
      <div className="font-mono text-sm text-text-secondary">
        <span className="text-terminal-green">$</span> Mint your agent on-chain
      </div>

      <div className="overflow-hidden rounded-lg border border-cyan/20 bg-surface-raised">
        <div className="border-b border-border-subtle bg-surface-base px-5 py-3">
          <p className="font-pixel text-[10px] text-cyan">SELF-MINT</p>
        </div>
        <div className="space-y-3 p-5">
          <p className="font-mono text-xs leading-relaxed text-text-secondary">
            Your agent wallet will sign an EIP-712 identity proof
            and submit the mint transaction in one step.
          </p>
          <div className="rounded-md bg-surface-deep p-3 font-mono text-xs leading-relaxed">
            <p className="text-text-muted">
              <span className="text-terminal-green">&gt;</span> agent:{" "}
              <span className="text-text-primary">{agentConfig.name}</span>
            </p>
            <p className="text-text-muted">
              <span className="text-terminal-green">&gt;</span> wallet:{" "}
              <span className="text-cyan">{agentConfig.walletMapping}</span>
            </p>
            <p className="text-text-muted">
              <span className="text-terminal-green">&gt;</span> action:{" "}
              <span className="text-amber">EIP-712 sign + mint()</span>
            </p>
          </div>
        </div>
      </div>

      <TxStatusIndicator />

      <div className="flex gap-3">
        <PixelButton
          variant="outline"
          size="md"
          disabled={isProcessing}
          onClick={() => setStep("preview")}
        >
          Back
        </PixelButton>
        <PixelButton
          variant="primary"
          size="lg"
          disabled={isProcessing}
          onClick={() => mintAgent(agentConfig)}
          className={cn(isProcessing && "animate-pulse")}
        >
          {isProcessing ? "Processing..." : "Mint Agent"}
        </PixelButton>
      </div>
    </div>
  )
}
