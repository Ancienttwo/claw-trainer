import { useCallback, useEffect, useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { apiFetch, isApiConfigured } from "../lib/api"

export interface BroadcastMessage {
  id: string
  text: string
  type: "mint" | "quest" | "level_up" | "system"
  timestamp: number
}

interface ApiActivity {
  id: number
  type: string
  wallet: string | null
  token_id: string | null
  metadata: string | null
  block_number: string | null
  tx_hash: string | null
  created_at: string
}

interface ApiQuest {
  id: number
  title: string
  description: string
  required_capabilities: string
  reward_points: number
  status: string
}

const MAX_BUFFER = 20
const DISPLAY_COUNT = 6
const POLL_INTERVAL = 30_000
const IDLE_INTERVAL = 60_000

function parseMetadata(raw: string | null): Record<string, string> {
  if (!raw) return {}
  try {
    return JSON.parse(raw) as Record<string, string>
  } catch {
    return {}
  }
}

function activityToMessage(a: ApiActivity): BroadcastMessage | null {
  const meta = parseMetadata(a.metadata)

  if (a.type === "mint" || a.type === "nfa_minted") {
    const name = meta.name ?? meta.agentName ?? `#${a.token_id ?? "?"}`
    return {
      id: `activity-${a.id}`,
      text: `New agent "${name}" registered on-chain`,
      type: "mint",
      timestamp: new Date(a.created_at).getTime(),
    }
  }

  if (a.type === "level_up") {
    const level = meta.level ?? meta.newLevel ?? "?"
    return {
      id: `activity-${a.id}`,
      text: `Agent #${a.token_id ?? "?"} evolved to Lv.${level}`,
      type: "level_up",
      timestamp: new Date(a.created_at).getTime(),
    }
  }

  return null
}

function questToMessages(q: ApiQuest): BroadcastMessage[] {
  const msgs: BroadcastMessage[] = []
  msgs.push({
    id: `quest-${q.id}`,
    text: `Quest available: "${q.title}" — ${q.reward_points} pts`,
    type: "quest",
    timestamp: Date.now(),
  })

  const caps = q.required_capabilities
  if (caps && caps.length > 0) {
    msgs.push({
      id: `quest-tip-${q.id}`,
      text: `Tip: "${q.title}" needs ${caps} skills`,
      type: "quest",
      timestamp: Date.now(),
    })
  }

  return msgs
}

function makeSystemMessage(text: string): BroadcastMessage {
  return {
    id: `system-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    text,
    type: "system",
    timestamp: Date.now(),
  }
}

export function useMoltWorker() {
  const [messages, setMessages] = useState<BroadcastMessage[]>([])
  const seenIds = useRef(new Set<string>())
  const lastIdleRef = useRef(0)
  const startedRef = useRef(false)

  const pushMessages = useCallback((newMsgs: BroadcastMessage[]) => {
    const unseen = newMsgs.filter((m) => !seenIds.current.has(m.id))
    if (unseen.length === 0) return

    for (const m of unseen) seenIds.current.add(m.id)

    setMessages((prev) => [...prev, ...unseen].slice(-MAX_BUFFER))
  }, [])

  // Startup message
  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    pushMessages([makeSystemMessage("MoltWorker online. Monitoring the chain.")])
  }, [pushMessages])

  const configured = isApiConfigured()

  const activitiesQuery = useQuery({
    queryKey: ["molt-worker-activities"],
    queryFn: () => apiFetch<{ activities: ApiActivity[] }>("/activities/recent?limit=10"),
    refetchInterval: POLL_INTERVAL,
    enabled: configured,
  })

  const questsQuery = useQuery({
    queryKey: ["molt-worker-quests"],
    queryFn: () => apiFetch<{ quests: ApiQuest[] }>("/quests?status=open&limit=3"),
    refetchInterval: POLL_INTERVAL,
    enabled: configured,
  })

  // Process activities
  useEffect(() => {
    if (!activitiesQuery.data) return
    const newMsgs = activitiesQuery.data.activities
      .map(activityToMessage)
      .filter((m): m is BroadcastMessage => m !== null)
    if (newMsgs.length > 0) pushMessages(newMsgs)
  }, [activitiesQuery.data, pushMessages])

  // Process quests
  useEffect(() => {
    if (!questsQuery.data) return
    const newMsgs = questsQuery.data.quests.flatMap(questToMessages)
    if (newMsgs.length > 0) pushMessages(newMsgs)
  }, [questsQuery.data, pushMessages])

  // Idle message when both empty
  useEffect(() => {
    const hasActivities = (activitiesQuery.data?.activities.length ?? 0) > 0
    const hasQuests = (questsQuery.data?.quests.length ?? 0) > 0

    if (hasActivities || hasQuests) return

    const interval = setInterval(() => {
      const now = Date.now()
      if (now - lastIdleRef.current < IDLE_INTERVAL) return
      lastIdleRef.current = now
      pushMessages([makeSystemMessage("Scanning BNB Chain...")])
    }, IDLE_INTERVAL)

    return () => clearInterval(interval)
  }, [activitiesQuery.data, questsQuery.data, pushMessages])

  const displayMessages = messages.slice(-DISPLAY_COUNT)

  return {
    messages: displayMessages,
    totalCount: messages.length,
    isPolling: activitiesQuery.isFetching || questsQuery.isFetching,
  }
}
