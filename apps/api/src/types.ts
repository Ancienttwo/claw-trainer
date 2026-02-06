import type { Database } from "./db/client"

export interface Bindings {
  DB: D1Database
  IDENTITY_REGISTRY_ADDRESS: string
  BSC_RPC_URL: string
  CONTRACT_DEPLOY_BLOCK: string
  CORS_ORIGINS: string
}

export interface Variables {
  db: Database
}

export type AppEnv = {
  Bindings: Bindings
  Variables: Variables
}
