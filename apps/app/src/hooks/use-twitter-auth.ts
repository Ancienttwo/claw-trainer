import { useCallback, useState } from "react"
import { useAuthStore, type TwitterSession } from "../stores/auth-store"
import { apiFetch, isApiConfigured } from "../lib/api"

interface CallbackResponse {
  sessionToken: string
  expiresAt: string
  user: { twitterId: string; twitterHandle: string; twitterAvatar: string }
}

export function useTwitterAuth() {
  const { twitterSession, setTwitterSession } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (handle?: string) => {
    setIsLoading(true)
    try {
      const mockHandle = handle ?? `trainer_${Date.now().toString(36)}`
      const data = await apiFetch<CallbackResponse>(
        `/auth/twitter/callback?handle=${mockHandle}&twitter_id=mock_${mockHandle}`,
      )
      const session: TwitterSession = {
        twitterId: data.user.twitterId,
        twitterHandle: data.user.twitterHandle,
        twitterAvatar: data.user.twitterAvatar,
        sessionToken: data.sessionToken,
        expiresAt: data.expiresAt,
      }
      setTwitterSession(session)
      return session
    } finally {
      setIsLoading(false)
    }
  }, [setTwitterSession])

  const logout = useCallback(async () => {
    if (twitterSession && isApiConfigured()) {
      await apiFetch("/auth/logout", { method: "POST" }).catch(() => {})
    }
    setTwitterSession(null)
  }, [twitterSession, setTwitterSession])

  return { twitterSession, login, logout, isLoading }
}
