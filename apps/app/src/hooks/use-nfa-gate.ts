import { useMemo } from "react"
import { useMyAgents } from "./use-my-agents"

export function useNFAGate(tokenId?: string) {
  const { myAgents, isLoading } = useMyAgents()

  const hasNFA = useMemo(() => {
    if (!myAgents.length) return false
    if (tokenId) return myAgents.some((a) => a.tokenId.toString() === tokenId)
    return true
  }, [myAgents, tokenId])

  return { hasNFA, isLoading, agentCount: myAgents.length }
}
