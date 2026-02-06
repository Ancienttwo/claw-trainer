import { describe, it, expect, vi, beforeEach } from "vitest"
import type { AgentListItem } from "./use-agents"

const OWNER_A = "0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaa" as const
const OWNER_B = "0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBbb" as const
function makeAgent(overrides: Partial<AgentListItem> = {}): AgentListItem {
  return {
    tokenId: 1n,
    name: "TestBot",
    owner: OWNER_A,
    agentWallet: OWNER_A,
    level: 1,
    stage: "Rookie",
    capabilities: ["dev"],
    version: "1.0.0",
    ...overrides,
  }
}

let mockAddress: string | undefined = undefined
let mockIsConnected = false
let mockAgents: AgentListItem[] = []
let mockIsLoading = false
let mockIsError = false

vi.mock("wagmi", () => ({
  useAccount: () => ({ address: mockAddress, isConnected: mockIsConnected }),
}))

vi.mock("./use-agents", () => ({
  useAgents: () => ({
    agents: mockAgents,
    isLoading: mockIsLoading,
    isError: mockIsError,
  }),
}))

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
let useMyAgents: typeof import("./use-my-agents").useMyAgents

beforeEach(async () => {
  mockAddress = undefined
  mockIsConnected = false
  mockAgents = []
  mockIsLoading = false
  mockIsError = false
  vi.resetModules()
  const mod = await import("./use-my-agents")
  useMyAgents = mod.useMyAgents
})

// BDD: Given-When-Then for useMyAgents hook
// Uses renderHook pattern via direct function call (pure filter logic)

describe("useMyAgents", () => {
  it("should_return_empty_when_wallet_not_connected", async () => {
    // Given: wallet is NOT connected
    mockIsConnected = false
    mockAddress = undefined
    mockAgents = [makeAgent({ owner: OWNER_A })]

    // When: hook is invoked
    const { renderHook } = await import("@testing-library/react")
    const { result } = renderHook(() => useMyAgents())

    // Then: no agents returned, not a trainer
    expect(result.current.myAgents).toEqual([])
    expect(result.current.totalCount).toBe(0)
    expect(result.current.isTrainer).toBe(false)
    expect(result.current.isConnected).toBe(false)
  })

  it("should_return_owned_agents_when_wallet_connected", async () => {
    // Given: wallet 0xAA connected, owns 2 of 3 agents
    mockIsConnected = true
    mockAddress = OWNER_A
    mockAgents = [
      makeAgent({ tokenId: 1n, owner: OWNER_A }),
      makeAgent({ tokenId: 2n, owner: OWNER_B }),
      makeAgent({ tokenId: 3n, owner: OWNER_A }),
    ]

    // When: hook is invoked
    const { renderHook } = await import("@testing-library/react")
    const { result } = renderHook(() => useMyAgents())

    // Then: only owned agents returned
    expect(result.current.myAgents).toHaveLength(2)
    expect(result.current.myAgents[0].tokenId).toBe(1n)
    expect(result.current.myAgents[1].tokenId).toBe(3n)
    expect(result.current.totalCount).toBe(2)
    expect(result.current.isTrainer).toBe(true)
  })

  it("should_return_empty_when_connected_but_owns_zero", async () => {
    // Given: wallet connected but owns no agents
    mockIsConnected = true
    mockAddress = OWNER_B
    mockAgents = [makeAgent({ owner: OWNER_A })]

    // When: hook is invoked
    const { renderHook } = await import("@testing-library/react")
    const { result } = renderHook(() => useMyAgents())

    // Then: empty list, connected but not a trainer
    expect(result.current.myAgents).toEqual([])
    expect(result.current.isTrainer).toBe(false)
    expect(result.current.isConnected).toBe(true)
  })

  it("should_match_case_insensitively", async () => {
    // Given: address casing differs between wallet and on-chain
    mockIsConnected = true
    mockAddress = OWNER_A.toUpperCase()
    mockAgents = [makeAgent({ owner: OWNER_A.toLowerCase() as typeof OWNER_A })]

    // When: hook is invoked
    const { renderHook } = await import("@testing-library/react")
    const { result } = renderHook(() => useMyAgents())

    // Then: still matches
    expect(result.current.myAgents).toHaveLength(1)
    expect(result.current.isTrainer).toBe(true)
  })
})
