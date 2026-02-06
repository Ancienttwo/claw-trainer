import { useState, useCallback, type KeyboardEvent } from "react"
import { useAccount } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { PixelButton } from "../ui/pixel-button"
import { useMintFlowStore } from "../../stores/mint-flow-store"
import { parseAgentConfig } from "../../lib/parse-agent"
import { cn } from "../../lib/cn"
import type { Address } from "viem"
import type { ConfigValidationError } from "@contracts/modules/nfa-mint"

const PRESET_CAPS = [
  "code-review",
  "debugging",
  "deployment",
  "trading",
  "analytics",
  "social-media",
  "security",
  "research",
] as const

const INPUT_CLASS =
  "w-full rounded-md border border-border-subtle bg-surface-deep px-3 py-2 font-mono text-sm text-text-primary placeholder:text-text-muted focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan/40 transition-colors"

function FormField({ label, error, children }: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1.5 block font-pixel text-[8px] uppercase tracking-wider text-text-muted">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 font-mono text-xs text-coral">{error}</p>
      )}
    </div>
  )
}

function TagInput({ tags, onAdd, onRemove }: {
  tags: string[]
  onAdd: (tag: string) => void
  onRemove: (tag: string) => void
}) {
  const [input, setInput] = useState("")

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") return
      e.preventDefault()
      const trimmed = input.trim().toLowerCase()
      if (trimmed && !tags.includes(trimmed)) {
        onAdd(trimmed)
        setInput("")
      }
    },
    [input, tags, onAdd],
  )

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {PRESET_CAPS.map((cap) => {
          const active = tags.includes(cap)
          return (
            <button
              key={cap}
              type="button"
              onClick={() => (active ? onRemove(cap) : onAdd(cap))}
              className={cn(
                "rounded-sm border px-2 py-0.5 font-mono text-xs transition-all",
                active
                  ? "border-cyan/40 bg-cyan/10 text-cyan"
                  : "border-border-subtle bg-surface-overlay text-text-muted hover:border-cyan/20 hover:text-text-secondary",
              )}
            >
              {cap}
            </button>
          )
        })}
      </div>
      <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-border-subtle bg-surface-deep px-2 py-1.5">
        {tags.filter((t) => !PRESET_CAPS.includes(t as typeof PRESET_CAPS[number])).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-sm border border-cyan/30 bg-cyan/10 px-1.5 py-0.5 font-mono text-xs text-cyan"
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemove(tag)}
              className="text-cyan/60 hover:text-coral"
            >
              x
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? "Select above or type custom..." : "Add more..."}
          className="min-w-[120px] flex-1 bg-transparent py-0.5 font-mono text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
        />
      </div>
    </div>
  )
}

function WalletGuard() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-amber/30 bg-amber/5 py-12">
      <p className="font-mono text-sm text-amber">
        Connect your agent wallet to begin
      </p>
      <ConnectButton />
    </div>
  )
}

export function StepConfigure() {
  const { address, isConnected } = useAccount()
  const { setAgentConfig, setStep } = useMintFlowStore()

  const [name, setName] = useState("")
  const [version, setVersion] = useState("1.0.0")
  const [capabilities, setCapabilities] = useState<string[]>([])
  const [personality, setPersonality] = useState("")
  const [domainKnowledge, setDomainKnowledge] = useState("")
  const [errors, setErrors] = useState<ConfigValidationError[]>([])

  const fieldError = useCallback(
    (field: string) => errors.find((e) => e.field === field)?.message,
    [errors],
  )

  const handleContinue = useCallback(() => {
    if (!address) return
    const result = parseAgentConfig({
      name,
      version,
      capabilities,
      personality,
      domainKnowledge,
      walletMapping: address as Address,
    })
    if (result.success) {
      setErrors([])
      setAgentConfig(result.data)
      setStep("preview")
    } else {
      setErrors(result.errors)
    }
  }, [address, name, version, capabilities, personality, domainKnowledge, setAgentConfig, setStep])

  if (!isConnected) return <WalletGuard />

  return (
    <div className="space-y-5">
      <div className="font-mono text-sm text-text-secondary">
        <span className="text-terminal-green">$</span> Configure your agent identity
      </div>

      <div className="space-y-4 rounded-lg border border-border-subtle bg-surface-raised p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Agent Name" error={fieldError("name")}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="my-agent"
              maxLength={32}
              className={INPUT_CLASS}
            />
          </FormField>
          <FormField label="Version" error={fieldError("version")}>
            <input
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="1.0.0"
              className={INPUT_CLASS}
            />
          </FormField>
        </div>

        <FormField label="Capabilities" error={fieldError("capabilities")}>
          <TagInput
            tags={capabilities}
            onAdd={(tag) => setCapabilities((prev) => [...prev, tag])}
            onRemove={(tag) => setCapabilities((prev) => prev.filter((t) => t !== tag))}
          />
        </FormField>

        <FormField label="Personality" error={fieldError("personality")}>
          <textarea
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            placeholder="Describe how your agent behaves and communicates..."
            maxLength={500}
            rows={3}
            className={cn(INPUT_CLASS, "resize-none")}
          />
          <p className="mt-1 text-right font-mono text-[10px] text-text-muted">
            {personality.length}/500
          </p>
        </FormField>

        <FormField label="Domain Knowledge" error={fieldError("domainKnowledge")}>
          <textarea
            value={domainKnowledge}
            onChange={(e) => setDomainKnowledge(e.target.value)}
            placeholder="What does your agent specialize in?"
            maxLength={2000}
            rows={3}
            className={cn(INPUT_CLASS, "resize-none")}
          />
          <p className="mt-1 text-right font-mono text-[10px] text-text-muted">
            {domainKnowledge.length}/2000
          </p>
        </FormField>

        <div className="rounded-md bg-surface-deep px-3 py-2">
          <p className="font-pixel text-[8px] text-text-muted">AGENT WALLET</p>
          <p className="font-mono text-xs text-cyan">{address}</p>
        </div>
      </div>

      <PixelButton variant="primary" size="lg" onClick={handleContinue}>
        Continue
      </PixelButton>
    </div>
  )
}
