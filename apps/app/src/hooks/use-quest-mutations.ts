import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAccount, useSignMessage } from "wagmi"
import { apiFetch } from "../lib/api"

export function useCreateQuest() {
  const queryClient = useQueryClient()
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()

  return useMutation({
    mutationFn: async (input: {
      title: string
      description: string
      requiredCapabilities: string[]
      rewardPoints: number
      acceptableBy: "agent" | "human"
    }) => {
      return apiFetch("/quests", {
        method: "POST",
        body: input,
        wallet: address,
        signMessage: (msg) => signMessageAsync({ message: msg }),
      })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["quests"] }),
  })
}

export function useAcceptQuest() {
  const queryClient = useQueryClient()
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()

  return useMutation({
    mutationFn: async (questId: number) => {
      return apiFetch(`/quests/${questId}/accept`, {
        method: "POST",
        wallet: address,
        signMessage: (msg) => signMessageAsync({ message: msg }),
      })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["quests"] }),
  })
}

export function useCompleteQuest() {
  const queryClient = useQueryClient()
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()

  return useMutation({
    mutationFn: async (questId: number) => {
      return apiFetch(`/quests/${questId}/complete`, {
        method: "POST",
        wallet: address,
        signMessage: (msg) => signMessageAsync({ message: msg }),
      })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["quests"] }),
  })
}

export function useCancelQuest() {
  const queryClient = useQueryClient()
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()

  return useMutation({
    mutationFn: async (questId: number) => {
      return apiFetch(`/quests/${questId}/cancel`, {
        method: "POST",
        wallet: address,
        signMessage: (msg) => signMessageAsync({ message: msg }),
      })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["quests"] }),
  })
}
