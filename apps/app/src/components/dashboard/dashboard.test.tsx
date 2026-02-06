import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import type { AgentListItem } from "../../hooks/use-agents"
import { TrainerStats } from "./trainer-stats"
import { MyAgentList } from "./my-agent-list"
import { EmptyTrainer } from "./empty-trainer"
import { TrainerDashboard } from "./trainer-dashboard"

// Mock tanstack-router Link
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}))

describe("TrainerStats", () => {
  it("should display total agents count when agents are provided", () => {
    const agents: AgentListItem[] = [
      {
        tokenId: 1n,
        name: "Agent1",
        owner: "0x123",
        agentWallet: "0x456",
        level: 1,
        stage: "Rookie",
        capabilities: [],
        version: "1.0",
      },
      {
        tokenId: 2n,
        name: "Agent2",
        owner: "0x789",
        agentWallet: "0xabc",
        level: 5,
        stage: "Pro",
        capabilities: [],
        version: "1.0",
      },
      {
        tokenId: 3n,
        name: "Agent3",
        owner: "0xdef",
        agentWallet: "0xghi",
        level: 3,
        stage: "Rookie",
        capabilities: [],
        version: "1.0",
      },
    ]

    render(<TrainerStats agents={agents} />)

    expect(screen.getByText("Agents")).toBeInTheDocument()
    expect(screen.getByText("pro")).toBeInTheDocument()
    expect(screen.getByText("Avg Level")).toBeInTheDocument()
    expect(screen.getByText("Highest Stage")).toBeInTheDocument()
  })

  it("should display default values when no agents provided", () => {
    render(<TrainerStats agents={[]} />)

    expect(screen.getByText("Agents")).toBeInTheDocument()
    expect(screen.getAllByText("0")).toHaveLength(2)
    expect(screen.getByText("-")).toBeInTheDocument()
    expect(screen.getByText("Highest Stage")).toBeInTheDocument()
  })
})

describe("MyAgentList", () => {
  it("should render agent names in grid when agents provided", () => {
    const agents: AgentListItem[] = [
      {
        tokenId: 1n,
        name: "AlphaAgent",
        owner: "0x123",
        agentWallet: "0x456",
        level: 3,
        stage: "Rookie",
        capabilities: [],
        version: "1.0",
      },
      {
        tokenId: 2n,
        name: "BetaAgent",
        owner: "0x789",
        agentWallet: "0xabc",
        level: 5,
        stage: "Pro",
        capabilities: [],
        version: "1.0",
      },
    ]

    render(<MyAgentList agents={agents} />)

    expect(screen.getByText("AlphaAgent")).toBeInTheDocument()
    expect(screen.getByText("BetaAgent")).toBeInTheDocument()
    expect(screen.getByText("My Agents")).toBeInTheDocument()
  })

  it("should show empty state when no agents provided", () => {
    render(<MyAgentList agents={[]} />)

    expect(screen.getByText("My Agents")).toBeInTheDocument()
  })
})

describe("EmptyTrainer", () => {
  it("should prompt user to mint first agent with CTA link", () => {
    render(<EmptyTrainer />)

    expect(screen.getByText("No agents yet")).toBeInTheDocument()
    expect(
      screen.getByText("Mint your first agent to start training"),
    ).toBeInTheDocument()
    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("href", "/mint")
    expect(link).toHaveTextContent("Mint Your First Agent")
  })
})

describe("TrainerDashboard", () => {
  it("should compose stats and agent list for non-empty state", () => {
    const agents: AgentListItem[] = [
      {
        tokenId: 1n,
        name: "Agent1",
        owner: "0x123",
        agentWallet: "0x456",
        level: 2,
        stage: "Rookie",
        capabilities: [],
        version: "1.0",
      },
      {
        tokenId: 2n,
        name: "Agent2",
        owner: "0x789",
        agentWallet: "0xabc",
        level: 4,
        stage: "Pro",
        capabilities: [],
        version: "1.0",
      },
    ]

    render(<TrainerDashboard agents={agents} />)

    expect(screen.getByText("Agent1")).toBeInTheDocument()
    expect(screen.getByText("Agent2")).toBeInTheDocument()
    expect(screen.getByText("Trainer Dashboard")).toBeInTheDocument()
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument()
    const mintLink = screen.getAllByRole("link").find((link) =>
      link.textContent?.includes("Mint Another Agent")
    )
    expect(mintLink).toBeDefined()
    expect(mintLink).toHaveAttribute("href", "/mint")
  })

  it("should show empty state when no agents provided", () => {
    render(<TrainerDashboard agents={[]} />)

    expect(screen.getByText("No agents yet")).toBeInTheDocument()
    expect(screen.getByText("Trainer Dashboard")).toBeInTheDocument()
  })
})
