import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAccount, useSignMessage } from "wagmi"
import { apiFetch } from "../lib/api"

export interface Skill {
  id: number
  slug: string
  name: string
  description: string
  authorAddress: string
  price: number
  fileSize: number
  downloadCount: number
  rating: number
  version: string
  tags: string[]
  status: string
  createdAt: string
}

interface ApiSkill {
  id: number
  slug: string
  name: string
  description: string
  author_address: string
  price: number
  file_size: number
  download_count: number
  rating: number
  version: string
  tags: string
  status: string
  created_at: string
}

function apiToSkill(a: ApiSkill): Skill {
  return {
    id: a.id,
    slug: a.slug,
    name: a.name,
    description: a.description,
    authorAddress: a.author_address,
    price: a.price,
    fileSize: a.file_size,
    downloadCount: a.download_count,
    rating: a.rating,
    version: a.version,
    tags: a.tags ? a.tags.split(",").filter(Boolean) : [],
    status: a.status,
    createdAt: a.created_at,
  }
}

export function useSkills(options: { tag?: string; author?: string } = {}) {
  const { tag, author } = options
  return useQuery({
    queryKey: ["skills", { tag, author }],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (tag) params.set("tag", tag)
      if (author) params.set("author", author)
      const d = await apiFetch<{ skills: ApiSkill[] }>(`/skills?${params}`)
      return d.skills.map(apiToSkill)
    },
    staleTime: 30_000,
  })
}

export function useSkillDetail(slug: string) {
  return useQuery({
    queryKey: ["skill", slug],
    queryFn: () => apiFetch<{ skill: ApiSkill }>(`/skills/${slug}`).then((d) => apiToSkill(d.skill)),
    enabled: slug.length > 0,
    staleTime: 30_000,
  })
}

export function useMySkills() {
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()

  return useQuery({
    queryKey: ["my-skills", address],
    queryFn: async () => {
      if (!address) return []
      const d = await apiFetch<{ skills: ApiSkill[] }>("/skills/my", {
        wallet: address,
        signMessage: (msg: string) => signMessageAsync({ message: msg }),
      })
      return d.skills.map(apiToSkill)
    },
    enabled: !!address,
    staleTime: 30_000,
  })
}

export function useMyPurchases() {
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()

  return useQuery({
    queryKey: ["my-purchases", address],
    queryFn: async () => {
      if (!address) return []
      const d = await apiFetch<{ skills: ApiSkill[] }>("/skills/purchased", {
        wallet: address,
        signMessage: (msg: string) => signMessageAsync({ message: msg }),
      })
      return d.skills.map(apiToSkill)
    },
    enabled: !!address,
    staleTime: 30_000,
  })
}

export function useSkillPurchase() {
  const queryClient = useQueryClient()
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()

  return useMutation({
    mutationFn: async ({ skillId, agentTokenId }: { skillId: number; agentTokenId?: string }) => {
      if (!address) throw new Error("Wallet not connected")
      return apiFetch("/skills/" + skillId + "/purchase", {
        method: "POST",
        body: { agentTokenId },
        wallet: address,
        signMessage: (msg: string) => signMessageAsync({ message: msg }),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-purchases"] })
      queryClient.invalidateQueries({ queryKey: ["skills"] })
    },
  })
}

export function useSkillUpload() {
  const queryClient = useQueryClient()
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()

  return useMutation({
    mutationFn: async (formData: FormData) => {
      if (!address) throw new Error("Wallet not connected")
      const timestamp = Date.now()
      const message = `clawtrainer:${address}:${timestamp}`
      const signature = await signMessageAsync({ message })
      const API_BASE = import.meta.env.VITE_API_URL ?? ""
      const response = await fetch(`${API_BASE}/skills/upload`, {
        method: "POST",
        headers: {
          "x-wallet-address": address,
          "x-wallet-signature": signature,
          "x-wallet-message": message,
        },
        body: formData,
      })
      if (!response.ok) {
        const text = await response.text().catch(() => "")
        throw new Error(`Upload failed: ${response.status} ${text}`)
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] })
      queryClient.invalidateQueries({ queryKey: ["my-skills"] })
    },
  })
}
