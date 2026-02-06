/**
 * Hook to track trainer wallet connection and profile.
 */

import { useEffect, useRef } from "react"
import { useAccount, useSignMessage } from "wagmi"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "../lib/api"

interface Trainer {
  wallet: string
  agent_count: number
  first_seen: string
  last_seen: string
  total_mints: number
}

const TRAINER_STALE_TIME = 60_000

export function useTrainer() {
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const queryClient = useQueryClient()
  const abortRef = useRef<AbortController | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ["trainer", address],
    queryFn: () =>
      apiFetch<{ trainer: Trainer }>(`/trainers/${address}`).then(
        (r) => r.trainer,
      ),
    enabled: !!address,
    staleTime: TRAINER_STALE_TIME,
    retry: false,
  })

  useEffect(() => {
    if (!isConnected || !address) return

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    apiFetch("/trainers/connect", {
      method: "POST",
      wallet: address,
      signMessage: (msg) => signMessageAsync({ message: msg }),
    })
      .then(() => {
        if (!controller.signal.aborted) {
          queryClient.invalidateQueries({ queryKey: ["trainer", address] })
        }
      })
      .catch(() => {})

    return () => controller.abort()
  }, [isConnected, address, signMessageAsync, queryClient])

  return {
    trainer: data ?? null,
    isLoading,
    isConnected,
    wallet: address,
  }
}
