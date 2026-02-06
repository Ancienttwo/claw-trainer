import { useMemo } from "react"
import { useAccount } from "wagmi"
import { useAgents, type AgentListItem } from "./use-agents"

function filterByOwner(agents: AgentListItem[], address: string): AgentListItem[] {
  const lower = address.toLowerCase()
  return agents.filter((a) => a.owner.toLowerCase() === lower)
}

export function useMyAgents() {
  const { address, isConnected } = useAccount()
  const { agents, isLoading, isError } = useAgents()

  const myAgents = useMemo(() => {
    if (!address) return []
    return filterByOwner(agents, address)
  }, [agents, address])

  return {
    myAgents,
    totalCount: myAgents.length,
    isLoading,
    isError,
    isTrainer: isConnected && myAgents.length > 0,
    isConnected,
  }
}
