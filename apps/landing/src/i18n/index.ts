import { en } from "./locales/en"
import { zh } from "./locales/zh"
import type { Messages } from "./types"

export type { Messages }
export type Locale = "en" | "zh"

const locales: Record<Locale, Messages> = { en, zh }

export function getT(locale: Locale): Messages {
  return locales[locale]
}

export function getLocale(astro: {
  cookies: { get: (name: string) => { value: string } | undefined }
}): Locale {
  const cookie = astro.cookies.get("claw_locale")
  if (cookie?.value === "zh") return "zh"
  return "en"
}
