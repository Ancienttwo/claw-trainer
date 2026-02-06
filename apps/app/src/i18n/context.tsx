import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { en, type Messages } from "./locales/en"
import { zh } from "./locales/zh"

type Locale = "en" | "zh"

const locales: Record<Locale, Messages> = { en, zh }

const STORAGE_KEY = "claw_locale"

function detectLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === "en" || stored === "zh") return stored
  } catch {
    // localStorage unavailable
  }
  const lang = navigator.language
  if (lang.startsWith("zh")) return "zh"
  return "en"
}

interface I18nContextValue {
  locale: Locale
  setLocale: (l: Locale) => void
  t: Messages
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale)

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    try { localStorage.setItem(STORAGE_KEY, l) } catch {}
    document.documentElement.lang = l
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return (
    <I18nContext value={{ locale, setLocale, t: locales[locale] }}>
      {children}
    </I18nContext>
  )
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within I18nProvider")
  return ctx
}
