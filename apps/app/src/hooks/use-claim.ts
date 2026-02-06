import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "../lib/api"
import { useAuthStore } from "../stores/auth-store"

interface ClaimAgent {
  name: string
  level: number
  stage: string
  capabilities: string
}

interface ClaimCodeResponse {
  status: "valid" | "claimed" | "expired"
  agent: ClaimAgent | null
  expiresAt: string
}

interface RedeemResponse {
  ok: boolean
  agent: Record<string, unknown>
}

export function useClaimCode(code: string) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["claim-code", code],
    queryFn: () => apiFetch<ClaimCodeResponse>(`/claim/codes/${code}`),
    enabled: code.length > 0,
  })

  return { data, isLoading, isError }
}

export function useRedeemClaim() {
  const queryClient = useQueryClient()
  const { twitterSession } = useAuthStore()

  return useMutation({
    mutationFn: (variables: { code: string }) =>
      apiFetch<RedeemResponse>("/claim/redeem", {
        method: "POST",
        body: { code: variables.code },
        sessionToken: twitterSession?.sessionToken,
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["claim-code", variables.code] })
      queryClient.invalidateQueries({ queryKey: ["claimed-agents"] })
    },
  })
}
