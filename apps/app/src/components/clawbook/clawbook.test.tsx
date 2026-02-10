import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import type { AgentDetail } from "../../hooks/use-agent"
import { AgentResume } from "./agent-resume"
import { ActivityFeed } from "./activity-feed"
import { HireSection } from "./hire-section"
import { AgentProfile } from "./agent-profile"

const OWNER_ADDRESS = "0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaa" as const
const AGENT_WALLET = "0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBbb" as const

function makeAgentDetail(overrides: Partial<AgentDetail> = {}): AgentDetail {
  return {
    tokenId: 1n,
    name: "AlphaBot",
    owner: OWNER_ADDRESS,
    agentWallet: AGENT_WALLET,
    level: 3,
    stage: "Rookie",
    capabilities: ["dev", "social"],
    version: "1.0.0",
    description: "An agent for testing",
    rawMetadata: {
      name: "AlphaBot",
      description: "An agent for testing",
      attributes: [],
    },
    ...overrides,
  }
}

vi.mock("wagmi", () => ({
  useAccount: () => ({ address: undefined, isConnected: false }),
}))

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, ...props }: { children: React.ReactNode }) => (
    <a {...props}>{children}</a>
  ),
}))

describe("AgentResume", () => {
  it("should_render_agent_name_level_and_stage_when_rendered", () => {
    // Given: an AgentDetail with name "AlphaBot", level 3, stage "Rookie"
    const agent = makeAgentDetail({ name: "AlphaBot", level: 3, stage: "Rookie" })

    // When: AgentResume is rendered
    render(<AgentResume agent={agent} />)

    // Then: the user sees agent name "AlphaBot" in heading
    expect(screen.getByRole("heading", { name: /AlphaBot/ })).toBeInTheDocument()
    // And: Level indicator is visible
    expect(screen.getByText(/Lv\./)).toBeInTheDocument()
    // And: Stage badge "Rookie" is visible
    expect(screen.getByText(/rookie/i)).toBeInTheDocument()
  })

  it("should_display_ascii_art_for_agent_stage", () => {
    // Given: an agent at "Rookie" stage
    const agent = makeAgentDetail({ stage: "Rookie" })

    // When: AgentResume is rendered
    render(<AgentResume agent={agent} />)

    // Then: ASCII art container is present (pre element with whitespace preserved)
    expect(screen.getByText(/\(o\.o\)/)).toBeInTheDocument()
  })

  it("should_show_stat_bars_for_level_and_capabilities", () => {
    // Given: an agent with level 5 and 3 capabilities
    const agent = makeAgentDetail({ level: 5, capabilities: ["dev", "social", "alpha"] })

    // When: AgentResume is rendered
    render(<AgentResume agent={agent} />)

    // Then: stat labels are visible
    expect(screen.getByText("LEVEL")).toBeInTheDocument()
    expect(screen.getByText("CAPS")).toBeInTheDocument()
  })

  it("should_display_metadata_with_truncated_addresses", () => {
    // Given: an agent with owner and wallet addresses
    const agent = makeAgentDetail({ owner: OWNER_ADDRESS, agentWallet: AGENT_WALLET })

    // When: AgentResume is rendered
    render(<AgentResume agent={agent} />)

    // Then: metadata labels are present
    expect(screen.getByText("OWNER")).toBeInTheDocument()
    expect(screen.getByText("AGENT WALLET")).toBeInTheDocument()
    expect(screen.getByText("TOKEN ID")).toBeInTheDocument()
    expect(screen.getByText("VERSION")).toBeInTheDocument()
    // And: truncated address is shown
    expect(screen.getByText(/0xAAAA/)).toBeInTheDocument()
  })
})

describe("ActivityFeed", () => {
  it("should_show_activity_heading_and_placeholder_events_when_rendered", () => {
    // Given: ActivityFeed is rendered
    render(<ActivityFeed />)

    // When: the user views the feed
    // Then: they see "Activity" heading
    expect(screen.getByRole("heading", { name: /Activity/i })).toBeInTheDocument()
    // And: placeholder events are visible
    expect(screen.getByText(/minted on bnb chain/i)).toBeInTheDocument()
    expect(screen.getByText(/identity registered/i)).toBeInTheDocument()
    expect(screen.getByText(/level 1 achieved/i)).toBeInTheDocument()
  })
})

describe("HireSection", () => {
  it("should_render_disabled_hire_button_with_coming_soon_when_rendered", () => {
    // Given: HireSection is rendered
    render(<HireSection />)

    // When: the user sees the hire area
    // Then: the "HIRE" button is disabled
    const hireButton = screen.getByRole("button", { name: /hire/i })
    expect(hireButton).toBeDisabled()
    // And: "Coming Soon" text is visible
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument()
  })
})

describe("AgentProfile", () => {
  it("should_render_resume_feed_and_hire_sections_when_rendered", () => {
    // Given: an AgentDetail with name "AlphaBot", level 3, stage "Rookie"
    const agent = makeAgentDetail({ name: "AlphaBot", level: 3, stage: "Rookie" })

    // When: AgentProfile is rendered
    render(<AgentProfile agent={agent} />)

    // Then: the user sees agent name in heading
    expect(screen.getByRole("heading", { name: /AlphaBot/i })).toBeInTheDocument()
    // And: Activity feed section with "Activity" heading
    expect(screen.getByRole("heading", { name: /Activity/i })).toBeInTheDocument()
    // And: Hire section with disabled button showing "Coming Soon"
    const hireButton = screen.getByRole("button", { name: /hire/i })
    expect(hireButton).toBeDisabled()
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument()
  })
})
