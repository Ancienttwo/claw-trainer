import type { Database } from "./db/client"

export type UserRole = "agent" | "trainer"
export type AcceptableBy = "agent" | "human"
export type QuestStatus = "open" | "in_progress" | "completed" | "cancelled"

export interface AuthContext {
  role: UserRole
  id: string
  wallet?: string
  sessionId?: number
}

export type BetStatus = "open" | "won" | "lost" | "cancelled"
export type SkillStatus = "active" | "archived"

export interface Bindings {
  DB: D1Database
  SKILLS_BUCKET: R2Bucket
  IDENTITY_REGISTRY_ADDRESS: string
  BSC_RPC_URL: string
  CONTRACT_DEPLOY_BLOCK: string
  CORS_ORIGINS: string
  POLYMARKET_GAMMA_URL: string
  POLYMARKET_CLOB_URL: string
}

export interface Variables {
  db: Database
  auth?: AuthContext
}

export type AppEnv = {
  Bindings: Bindings
  Variables: Variables
}
