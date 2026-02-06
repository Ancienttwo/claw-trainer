import { PixelButton } from "../ui/pixel-button"
import { useMintFlowStore } from "../../stores/mint-flow-store"
import { truncateAddress } from "../../lib/address"

const MAX_SNIPPET = 120

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 font-pixel text-[8px] uppercase tracking-wider text-text-muted">
        {label}
      </p>
      {children}
    </div>
  )
}

export function StepPreview() {
  const { agentConfig, setStep } = useMintFlowStore()

  if (!agentConfig) return null

  const personality = agentConfig.personality.length > MAX_SNIPPET
    ? `${agentConfig.personality.slice(0, MAX_SNIPPET)}...`
    : agentConfig.personality

  return (
    <div className="space-y-6">
      <div className="font-mono text-sm text-text-secondary">
        <span className="text-terminal-green">$</span> Review your agent details
      </div>

      <div className="overflow-hidden rounded-lg border border-border-cyan bg-surface-raised">
        <div className="flex items-center justify-between border-b border-border-subtle bg-surface-base px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-cyan/10">
              <span className="font-pixel text-[8px] text-cyan">NFA</span>
            </div>
            <div>
              <p className="font-mono text-sm font-semibold text-text-primary">
                {agentConfig.name}
              </p>
              <p className="font-mono text-xs text-text-muted">
                v{agentConfig.version}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-terminal-green/10 px-3 py-1 font-pixel text-[8px] text-terminal-green">
            ROOKIE
          </span>
        </div>

        <div className="space-y-5 p-5">
          <Field label="Capabilities">
            <div className="flex flex-wrap gap-2">
              {agentConfig.capabilities.map((cap) => (
                <span
                  key={cap}
                  className="rounded-sm border border-cyan/20 bg-cyan/5 px-2 py-1 font-mono text-xs text-cyan"
                >
                  {cap}
                </span>
              ))}
            </div>
          </Field>

          <Field label="Personality">
            <p className="font-mono text-xs leading-relaxed text-text-secondary">
              {personality}
            </p>
          </Field>

          <Field label="Agent Wallet (self-mint)">
            <p className="font-mono text-sm text-cyan">
              {truncateAddress(agentConfig.walletMapping)}
            </p>
          </Field>
        </div>
      </div>

      <div className="flex gap-3">
        <PixelButton
          variant="outline"
          size="md"
          onClick={() => setStep("configure")}
        >
          Back
        </PixelButton>
        <PixelButton
          variant="primary"
          size="md"
          onClick={() => setStep("mint")}
        >
          Continue
        </PixelButton>
      </div>
    </div>
  )
}
