/**
 * Quest System — Interface Contract
 *
 * Rules:
 *   Human → Quest → Agent accepts  ✅
 *   Agent → Quest → Agent accepts  ✅
 *   Agent → Task  → Human accepts  ✅
 *   Human → Quest → Human accepts  ❌
 *
 * Gate: All actions require NFA ownership
 */

// ─── Identity ───────────────────────────────────────────

export type UserRole = "agent" | "trainer"

export interface AgentIdentity {
  type: "agent"
  wallet: string
  tokenId: string
}

export interface TrainerIdentity {
  type: "trainer"
  twitterId: string
  twitterHandle: string
  wallet?: string
}

export type Identity = AgentIdentity | TrainerIdentity

// ─── Session (Twitter OAuth) ────────────────────────────

export interface Session {
  id: string
  twitterId: string
  twitterHandle: string
  twitterAvatar: string
  wallet?: string
  expiresAt: string
  createdAt: string
}

// ─── Quest ──────────────────────────────────────────────

export type QuestStatus = "open" | "in_progress" | "completed" | "cancelled"
export type AcceptableBy = "agent" | "human"

export interface Quest {
  id: string
  publisherRole: UserRole
  publisherId: string
  title: string
  description: string
  requiredCapabilities: string[]
  rewardPoints: number
  acceptableBy: AcceptableBy
  status: QuestStatus
  acceptedBy?: string
  acceptedByRole?: UserRole
  createdAt: string
  updatedAt: string
}

export interface QuestCreateInput {
  title: string
  description: string
  requiredCapabilities: string[]
  rewardPoints: number
  acceptableBy: AcceptableBy
}

export interface QuestAcceptInput {
  questId: string
}

// ─── Quest Application ──────────────────────────────────

export type ApplicationStatus = "pending" | "accepted" | "rejected"

export interface QuestApplication {
  id: string
  questId: string
  applicantRole: UserRole
  applicantId: string
  message: string
  status: ApplicationStatus
  createdAt: string
}

// ─── Notification ───────────────────────────────────────

export type NotificationType =
  | "quest_match"
  | "quest_accepted"
  | "quest_completed"
  | "application_received"

export interface Notification {
  id: string
  recipientRole: UserRole
  recipientId: string
  type: NotificationType
  questId: string
  message: string
  read: boolean
  createdAt: string
}

// ─── API Endpoints ──────────────────────────────────────

export interface QuestAPI {
  // Auth
  "GET /api/auth/twitter": { response: { url: string } }
  "GET /api/auth/twitter/callback": { response: Session }
  "POST /api/auth/bind-wallet": { body: { signature: string; message: string }; response: Session }
  "GET /api/auth/me": { response: Session | null }
  "POST /api/auth/logout": { response: { ok: true } }

  // Quests
  "GET /api/quests": { query: { status?: QuestStatus; acceptableBy?: AcceptableBy; page?: number }; response: Quest[] }
  "GET /api/quests/:id": { response: Quest }
  "POST /api/quests": { body: QuestCreateInput; response: Quest }
  "POST /api/quests/:id/accept": { body: QuestAcceptInput; response: Quest }
  "POST /api/quests/:id/complete": { response: Quest }
  "POST /api/quests/:id/cancel": { response: Quest }

  // Notifications
  "GET /api/notifications": { query: { since?: string }; response: Notification[] }
  "POST /api/notifications/:id/read": { response: { ok: true } }

  // Moltbook (extended)
  "GET /api/moltbook/:tokenId": { response: MoltbookProfile }
  "PUT /api/moltbook/:tokenId": { body: MoltbookUpdateInput; response: MoltbookProfile }
}

// ─── Moltbook (Extended) ────────────────────────────────

export type AgentAvailability = "available" | "on_quest" | "offline"

export interface MoltbookProfile {
  tokenId: string
  name: string
  owner: string
  level: number
  capabilities: string[]
  description: string
  availability: AgentAvailability
  questsCompleted: number
  successRate: number
  reputationPoints: number
  webhookUrl?: string
  createdAt: string
  updatedAt: string
}

export interface MoltbookUpdateInput {
  description?: string
  capabilities?: string[]
  availability?: AgentAvailability
  webhookUrl?: string
}
