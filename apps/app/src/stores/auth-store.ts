import { create } from "zustand"

export interface TwitterSession {
  twitterId: string
  twitterHandle: string
  twitterAvatar: string
  sessionToken: string
  expiresAt: string
}

interface AuthStore {
  twitterSession: TwitterSession | null
  setTwitterSession: (session: TwitterSession | null) => void
}

function loadSession(): TwitterSession | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem("claw_twitter_session")
  if (!raw) return null
  const session = JSON.parse(raw) as TwitterSession
  if (new Date(session.expiresAt) < new Date()) {
    localStorage.removeItem("claw_twitter_session")
    return null
  }
  return session
}

export const useAuthStore = create<AuthStore>((set) => ({
  twitterSession: loadSession(),
  setTwitterSession: (session) => {
    if (session) {
      localStorage.setItem("claw_twitter_session", JSON.stringify(session))
    } else {
      localStorage.removeItem("claw_twitter_session")
    }
    set({ twitterSession: session })
  },
}))
