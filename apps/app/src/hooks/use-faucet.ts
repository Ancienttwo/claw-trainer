import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAccount, useSignMessage } from "wagmi"
import { apiFetch } from "../lib/api"

interface FaucetBalance {
  agentTokenId: string
  balance: number
  lastClaimAt: string | null
}

export function useFaucetBalance(agentTokenId: string) {
  return useQuery({
    queryKey: ["faucet-balance", agentTokenId],
    queryFn: () =>
      apiFetch<{ balance: FaucetBalance }>(`/arena/faucet/${agentTokenId}`).then((d) => d.balance),
    enabled: agentTokenId.length > 0,
    staleTime: 10_000,
  })
}

export function useClaimFaucet() {
  const queryClient = useQueryClient()
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()

  return useMutation({
    mutationFn: async (agentTokenId: string) => {
      if (!address) throw new Error("Wallet not connected")
      return apiFetch<{ balance: FaucetBalance }>("/arena/faucet/claim", {
        method: "POST",
        body: { agentTokenId },
        wallet: address,
        signMessage: (msg: string) => signMessageAsync({ message: msg }),
      })
    },
    onSuccess: (_, agentTokenId) => {
      queryClient.invalidateQueries({ queryKey: ["faucet-balance", agentTokenId] })
    },
  })
}
