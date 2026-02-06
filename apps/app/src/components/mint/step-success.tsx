import { Link } from "@tanstack/react-router"
import { PixelButton } from "../ui/pixel-button"
import { AsciiLobster } from "../ui/ascii-lobster"
import { useMintFlowStore } from "../../stores/mint-flow-store"
import { bscscanTxUrl, truncateTxHash } from "../../lib/address"

export function StepSuccess() {
  const { agentConfig, tokenId, txHash, reset } = useMintFlowStore()

  if (!agentConfig) return null

  return (
    <div className="space-y-6">
      {/* Terminal prompt */}
      <div className="font-mono text-sm text-terminal-green">
        <span className="font-bold">$</span> Agent minted successfully!
      </div>

      {/* Success card */}
      <div className="overflow-hidden rounded-lg border border-cyan/40 bg-surface-raised shadow-glow-cyan">
        {/* Header */}
        <div className="border-b border-border-subtle bg-surface-base px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[10px] text-cyan">NFA MINTED</span>
            <span className="rounded-full bg-terminal-green/10 px-2 py-0.5 font-pixel text-[8px] text-terminal-green">
              ROOKIE
            </span>
            <span className="rounded-full bg-amber/10 px-2 py-0.5 font-pixel text-[8px] text-amber">
              Lv.1
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* ASCII Lobster */}
          <div className="mb-6 flex justify-center rounded-md bg-surface-deep py-6">
            <AsciiLobster stage="rookie" size="lg" className="animate-float" />
          </div>

          {/* Agent info */}
          <div className="space-y-4">
            <div>
              <p className="font-pixel text-[8px] uppercase text-text-muted">
                Agent Name
              </p>
              <p className="font-mono text-sm font-semibold text-text-primary">
                {agentConfig.name}
              </p>
            </div>

            {tokenId !== null && (
              <div>
                <p className="font-pixel text-[8px] uppercase text-text-muted">
                  Token ID
                </p>
                <p className="font-mono text-sm text-amber">
                  #{tokenId.toString()}
                </p>
              </div>
            )}

            {txHash && (
              <div>
                <p className="font-pixel text-[8px] uppercase text-text-muted">
                  Transaction
                </p>
                <a
                  href={bscscanTxUrl(txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-cyan underline decoration-cyan/30 hover:text-cyan-mid hover:decoration-cyan"
                >
                  {truncateTxHash(txHash)}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link to="/dex">
          <PixelButton variant="terminal" size="md">
            View in Molt-Dex
          </PixelButton>
        </Link>
        <PixelButton variant="outline" size="md" onClick={reset}>
          Mint Another
        </PixelButton>
      </div>
    </div>
  )
}
