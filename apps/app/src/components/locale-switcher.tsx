import { useI18n } from "../i18n"
import { cn } from "../lib/cn"

export function LocaleSwitcher() {
  const { locale, setLocale } = useI18n()
  return (
    <button
      type="button"
      onClick={() => setLocale(locale === "en" ? "zh" : "en")}
      className={cn(
        "font-mono text-xs px-2 py-1 rounded border border-border-subtle",
        "text-text-secondary hover:text-text-primary hover:border-cyan/40",
        "transition-colors duration-150",
      )}
      aria-label="Switch language"
    >
      {locale === "en" ? "中" : "EN"}
    </button>
  )
}
