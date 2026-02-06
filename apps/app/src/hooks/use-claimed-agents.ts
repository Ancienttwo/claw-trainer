import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "../lib/api"
import { useAuthStore } from "../stores/auth-store"
import type { AgentListItem } from "./use-agents"

interface ApiClaimedAgent {
  tokenId: string
  name: string
  owner: string
  agentWallet: string
  level: number
  stage: string
  capabilities: string
  version: string
}

function toAgentListItem(a: ApiClaimedAgent): AgentListItem {
  return {
    tokenId: BigInt(a.tokenId),
    name: a.name,
    owner: a.owner as `0x${string}`,
    agentWallet: a.agentWallet as `0x${string}`,
    level: a.level,
    stage: a.stage,
    capabilities: a.capabilities ? a.capabilities.split(",").map((s) => s.trim()) : [],
    version: a.version,
  }
}

export function useClaimedAgents() {
  const { twitterSession } = useAuthStore()

  const { data, isLoading } = useQuery({
    queryKey: ["claimed-agents"],
    queryFn: () =>
      apiFetch<{ agents: ApiClaimedAgent[] }>("/claim/my-agents", {
        sessionToken: twitterSession?.sessionToken,
      }),
    enabled: !!twitterSession,
  })

  return {
    claimedAgents: data?.agents.map(toAgentListItem) ?? [],
    isLoading,
  }
}
