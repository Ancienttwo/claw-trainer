import { useMintFlowStore } from "../../stores/mint-flow-store"
import { StepConfigure } from "./step-configure"
import { StepPreview } from "./step-preview"
import { StepMint } from "./step-mint"
import { StepSuccess } from "./step-success"
import { cn } from "../../lib/cn"

const STEPS = [
  { key: "configure", label: "Configure", num: "01" },
  { key: "preview", label: "Preview", num: "02" },
  { key: "mint", label: "Mint", num: "03" },
  { key: "confirm", label: "Done", num: "04" },
] as const

type StepKey = (typeof STEPS)[number]["key"]

const STEP_COMPONENTS: Record<StepKey, React.FC> = {
  configure: StepConfigure,
  preview: StepPreview,
  mint: StepMint,
  confirm: StepSuccess,
}

function StepIndicator({ currentStep }: { currentStep: StepKey }) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep)

  return (
    <div className="flex items-center justify-between">
      {STEPS.map((step, index) => {
        const isActive = index === currentIndex
        const isDone = index < currentIndex

        return (
          <div key={step.key} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs font-bold transition-all duration-300",
                  isActive && "bg-cyan text-surface-deep shadow-glow-cyan",
                  isDone && "bg-terminal-green/20 text-terminal-green",
                  !isActive && !isDone && "bg-surface-overlay text-text-muted",
                )}
              >
                {isDone ? "\u2713" : step.num}
              </div>
              <span
                className={cn(
                  "hidden font-mono text-xs sm:inline",
                  isActive && "text-cyan",
                  isDone && "text-terminal-green",
                  !isActive && !isDone && "text-text-muted",
                )}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-3 hidden h-px w-12 sm:block md:w-20",
                  isDone ? "bg-terminal-green/40" : "bg-surface-highlight",
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export function MintWizard() {
  const { step } = useMintFlowStore()
  const ActiveStep = STEP_COMPONENTS[step]

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-2 font-pixel text-lg text-cyan sm:text-xl">
          Mint NFA
        </h1>
        <p className="font-mono text-sm text-text-secondary">
          Register your AI Agent on BNB Chain
        </p>
      </div>

      <div className="mb-10 rounded-lg border border-border-subtle bg-surface-base/60 px-4 py-4 backdrop-blur-sm sm:px-6">
        <StepIndicator currentStep={step} />
      </div>

      <div className="animate-pixel-fade-in">
        <ActiveStep />
      </div>
    </div>
  )
}
