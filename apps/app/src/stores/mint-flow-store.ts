/**
 * Zustand store for the NFA mint wizard flow.
 * Tracks wizard step, agent config, tx status, and errors.
 */

import { create } from "zustand"
import type { AgentConfig, MintFlowError } from "@contracts/modules/nfa-mint"

type WizardStep = "configure" | "preview" | "mint" | "confirm"
type TxStatus = "idle" | "signing" | "pending" | "success" | "error"

interface MintFlowState {
  step: WizardStep
  agentConfig: AgentConfig | null
  tokenUri: string | null
  txStatus: TxStatus
  txHash: string | null
  tokenId: bigint | null
  error: MintFlowError | null
}

interface MintFlowActions {
  setAgentConfig: (config: AgentConfig) => void
  setStep: (step: WizardStep) => void
  setTokenUri: (uri: string) => void
  setTxStatus: (status: TxStatus, hash?: string, tokenId?: bigint) => void
  setError: (error: MintFlowError | null) => void
  reset: () => void
}

const INITIAL_STATE: MintFlowState = {
  step: "configure",
  agentConfig: null,
  tokenUri: null,
  txStatus: "idle",
  txHash: null,
  tokenId: null,
  error: null,
}

export const useMintFlowStore = create<MintFlowState & MintFlowActions>(
  (set) => ({
    ...INITIAL_STATE,

    setAgentConfig: (config) => set({ agentConfig: config, error: null }),

    setStep: (step) => set({ step, error: null }),

    setTokenUri: (uri) => set({ tokenUri: uri }),

    setTxStatus: (status, hash, tokenId) =>
      set((state) => ({
        txStatus: status,
        txHash: hash ?? state.txHash,
        tokenId: tokenId ?? state.tokenId,
        error: null,
      })),

    setError: (error) => set({ error, txStatus: error ? "error" : "idle" }),

    reset: () => set(INITIAL_STATE),
  }),
)
