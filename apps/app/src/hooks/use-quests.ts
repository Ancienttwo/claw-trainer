import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "../lib/api"

interface ApiQuest {
  id: number
  publisher_role: string
  publisher_id: string
  title: string
  description: string
  required_capabilities: string
  reward_points: number
  acceptable_by: string
  status: string
  accepted_by: string | null
  accepted_by_role: string | null
  created_at: string
  updated_at: string
}

export interface Quest {
  id: number
  publisherRole: "agent" | "trainer"
  publisherId: string
  title: string
  description: string
  requiredCapabilities: string[]
  rewardPoints: number
  acceptableBy: "agent" | "human"
  status: "open" | "in_progress" | "completed" | "cancelled"
  acceptedBy: string | null
  acceptedByRole: string | null
  createdAt: string
  updatedAt: string
}

function apiToQuest(a: ApiQuest): Quest {
  return {
    id: a.id,
    publisherRole: a.publisher_role as Quest["publisherRole"],
    publisherId: a.publisher_id,
    title: a.title,
    description: a.description,
    requiredCapabilities: a.required_capabilities ? a.required_capabilities.split(",").filter(Boolean) : [],
    rewardPoints: a.reward_points,
    acceptableBy: a.acceptable_by as Quest["acceptableBy"],
    status: a.status as Quest["status"],
    acceptedBy: a.accepted_by,
    acceptedByRole: a.accepted_by_role,
    createdAt: a.created_at,
    updatedAt: a.updated_at,
  }
}

interface UseQuestsOptions {
  status?: string
  acceptableBy?: string
}

export function useQuests(options: UseQuestsOptions = {}) {
  const { status, acceptableBy } = options
  return useQuery({
    queryKey: ["quests", { status, acceptableBy }],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (status) params.set("status", status)
      if (acceptableBy) params.set("acceptableBy", acceptableBy)
      const data = await apiFetch<{ quests: ApiQuest[] }>(`/quests?${params}`)
      return data.quests.map(apiToQuest)
    },
    staleTime: 30_000,
  })
}
