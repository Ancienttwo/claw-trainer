import { useViewMode } from "../hooks/use-view-mode"
import { useMyAgents } from "../hooks/use-my-agents"
import { useI18n } from "../i18n"
import { cn } from "../lib/cn"

export function ModeSwitcher() {
  const { viewMode, setViewMode } = useViewMode()
  const { isTrainer } = useMyAgents()
  const { t } = useI18n()

  if (!isTrainer) return null

  const isAgent = viewMode === "agent"

  return (
    <button
      type="button"
      onClick={() => setViewMode(isAgent ? "trainer" : "agent")}
      className={cn(
        "font-mono text-xs px-2 py-1 rounded border transition-colors duration-150",
        isAgent
          ? "border-cyan/60 text-cyan bg-cyan/10 shadow-[0_0_6px_rgba(0,229,204,0.3)]"
          : "border-border-subtle text-text-secondary hover:text-text-primary hover:border-coral/40",
      )}
      aria-label={isAgent ? t.mode.train : t.mode.watch}
    >
      {isAgent ? t.mode.watch : t.mode.train}
    </button>
  )
}
