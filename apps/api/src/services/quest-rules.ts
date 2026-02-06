import { notifications } from "../db/schema"
import type { Database } from "../db/client"
import type { AuthContext, UserRole } from "../types"

interface QuestRow {
  publisherRole: string
  acceptableBy: string
}

/**
 * Quest acceptance rules:
 *   Human → Quest → Agent accepts  ✅
 *   Agent → Quest → Agent accepts  ✅
 *   Agent → Task  → Human accepts  ✅
 *   Human → Quest → Human accepts  ❌
 */
export function validateAcceptance(
  quest: QuestRow,
  acceptor: AuthContext,
): { valid: boolean; reason?: string } {
  if (quest.acceptableBy === "agent" && acceptor.role !== "agent") {
    return { valid: false, reason: "Only agents can accept this quest" }
  }

  if (quest.acceptableBy === "human" && acceptor.role !== "trainer") {
    return { valid: false, reason: "Only trainers can accept this quest" }
  }

  if (quest.publisherRole === "trainer" && acceptor.role === "trainer") {
    return { valid: false, reason: "Trainers cannot accept quests published by other trainers" }
  }

  return { valid: true }
}

export async function createNotification(
  db: Database,
  params: {
    recipientRole: string
    recipientId: string
    type: string
    questId: number
    message: string
  },
): Promise<void> {
  await db.insert(notifications).values({
    recipientRole: params.recipientRole,
    recipientId: params.recipientId,
    type: params.type,
    questId: params.questId,
    message: params.message,
  })
}
