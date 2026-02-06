# ClawTrainer.ai - Hackathon Project Execution Plan

> **Start**: 2026-02-06 | **Deadline**: 2026-02-19 | **Days**: 13
> **Developer**: Solo (Victor / Flash)
> **MVP Scope**: NFA Mint Flow + Molt-Dex (Gallery) + Molt Card (Resume)

---

## Current State Assessment

### Done
- Monorepo scaffolded (Turborepo + Bun workspaces)
- `apps/landing` - Astro default template (not customized)
- `apps/web` - Vite template with deps installed (React 19, Wagmi, TanStack, Zustand, Tailwind v4)
- `packages/contracts` - Hardhat + OpenZeppelin, IdentityRegistry.sol written (mint, levelUp, agentWallets)
- All docs written (PRD, MVP Definition, Design Spec, Tech Stack, Decisions)
- Pixel art assets ready (logo.png, banner.png, style.png, image.png)

### Not Done
- React app is bare Vite template (no React entry, no routing, no components)
- No Wagmi/ConnectKit provider setup
- No TanStack Router setup
- No pages or UI components
- Smart contract has no tests, not deployed
- Landing page not customized
- No agent.json parser
- No test infrastructure

---

## Phase 1: Foundation (Feb 06-08, 3 days)

### Goals
- React app fully scaffolded with routing and providers
- Smart contract tested and deployment-ready
- Design system tokens defined (colors, typography, spacing)

### Tasks

#### 1.1 React App Scaffolding
- [ ] Replace Vite vanilla template with React 19 entry point (main.tsx, App.tsx)
- [ ] Configure TanStack Router (file-based routing, route tree)
- [ ] Set up Wagmi + RainbowKit provider with BSC chain config
- [ ] Set up TanStack Query provider
- [ ] Create root layout with navigation shell
- [ ] Configure Tailwind v4 with design tokens (Pokedex Red, Terminal Amber/Green)
- [ ] Add global CSS (pixel font, ASCII aesthetic)

#### 1.2 Smart Contract Tests
- [ ] Write unit tests for IdentityRegistry: mint, levelUp, agentWallets, tokenURI
- [ ] Test access control (ownerOf checks)
- [ ] Test edge cases (max level, invalid tokenId)
- [ ] Add deployment script for BSC Testnet
- [ ] Configure hardhat for BSC Testnet network

#### 1.3 Design System
- [ ] Define color palette constants (Pokedex Red #DC0A2D, Terminal Green #33FF33, Terminal Amber #FFB000)
- [ ] Choose and integrate pixel/mono font (Press Start 2P or similar)
- [ ] Create base component patterns: Card, Button, Badge, Container

### Definition of Done
- `bun run dev:web` shows React app with working routes (/, /molt-dex, /molt/:id, /mint)
- `bun run test` passes all contract unit tests
- Design tokens applied, pixel font loaded

---

## Phase 2: Core Features (Feb 09-12, 4 days)

### Goals
- NFA Mint wizard fully functional (UI only, mock data)
- Molt-Dex gallery renders grid of agent cards
- Molt Card detail page shows agent resume
- agent.json parser working

### Tasks

#### 2.1 agent.json Parser
- [ ] Define agent.json TypeScript schema/types
- [ ] Write parser: validate, extract name, personality, skills, wallet
- [ ] Write unit tests for parser (valid, invalid, edge cases)
- [ ] Create sample agent.json fixtures for testing

#### 2.2 NFA Mint Flow (Multi-Step Wizard)
- [ ] Step 1: Upload/paste agent.json config
- [ ] Step 2: Preview parsed agent data (name, skills, personality)
- [ ] Step 3: Configure mint options (agent wallet address)
- [ ] Step 4: Confirm & submit transaction
- [ ] Step 5: Success state with NFA card preview
- [ ] Progress indicator component (step tracker)
- [ ] Form validation at each step

#### 2.3 Molt-Dex (Agent Gallery)
- [ ] Grid layout component (responsive, Pokemon Pokedex style)
- [ ] Agent card thumbnail component (ASCII art avatar, name, level, skills)
- [ ] Filter/search bar (by name, skill tags)
- [ ] Empty state for no agents
- [ ] Loading skeleton states

#### 2.4 Molt Card (Agent Resume)
- [ ] Full-page trading card layout
- [ ] Header section: agent name, level badge, evolution stage art
- [ ] Stats section: skills list, personality traits
- [ ] Chain data section: owner address, agent wallet, tokenId
- [ ] Action buttons: "Hire" (disabled for MVP), "View on BSCScan"

#### 2.5 Contract Deployment
- [ ] Deploy IdentityRegistry to BSC Testnet
- [ ] Verify contract on BSCScan
- [ ] Save deployed address to config

### Definition of Done
- Mint wizard walks through all 5 steps with form validation
- Molt-Dex renders grid of sample agents
- Molt Card shows complete agent profile
- Contract deployed and verified on BSC Testnet

---

## Phase 3: Integration & Polish (Feb 13-16, 4 days)

### Goals
- End-to-end mint flow working (UI -> blockchain -> verify)
- Wallet connection seamless
- ASCII art and animations polished
- Landing page built

### Tasks

#### 3.1 End-to-End Mint Integration
- [ ] Connect mint wizard to IdentityRegistry contract via Wagmi
- [ ] Upload agent metadata to IPFS (Pinata) for tokenURI
- [ ] Handle transaction states: pending, confirming, success, error
- [ ] Display minted NFA on success with link to Molt Card
- [ ] Read minted NFAs from contract for Molt-Dex display

#### 3.2 Wallet Connection
- [ ] RainbowKit connect button in navigation
- [ ] Chain switching to BSC (prompt if on wrong chain)
- [ ] Wallet-aware UI states (connected vs. disconnected)
- [ ] Transaction confirmation toasts/modals

#### 3.3 On-Chain Data Reading
- [ ] Query all minted NFAs from contract events (NFAMinted)
- [ ] Fetch tokenURI metadata for each NFA
- [ ] Display real on-chain data in Molt-Dex and Molt Card
- [ ] Cache with TanStack Query (auto-refresh)

#### 3.4 Visual Polish
- [ ] ASCII art lobster avatars for 3 evolution stages
- [ ] Pixel art borders and UI chrome
- [ ] Loading animations (terminal-style)
- [ ] Responsive design pass (mobile-friendly)

#### 3.5 Landing Page
- [ ] Customize Astro template with project branding
- [ ] Hero section: tagline + pixel art banner
- [ ] Features section: NFA Mint, Molt-Dex, Molt Card
- [ ] CTA: "Launch App" button linking to DApp
- [ ] Footer with hackathon info

### Definition of Done
- User can connect wallet, paste agent.json, mint NFA on BSC Testnet in < 2 minutes
- Minted NFA appears in Molt-Dex automatically
- Molt Card shows real on-chain data
- Landing page deployed with app link

---

## Phase 4: Demo & Ship (Feb 17-19, 3 days)

### Goals
- All bugs fixed
- Demo flow polished and recorded
- Both apps deployed

### Tasks

#### 4.1 Bug Fixes & Edge Cases
- [ ] Test full flow on BSC Testnet with fresh wallet
- [ ] Fix any UI/UX issues found in testing
- [ ] Handle network errors gracefully
- [ ] Handle empty states and loading states

#### 4.2 Demo Preparation
- [ ] Write demo script (step-by-step walkthrough)
- [ ] Record demo video showing: connect wallet -> upload agent.json -> mint NFA -> view in Molt-Dex -> view Molt Card
- [ ] Prepare presentation slides (if needed)
- [ ] Write project description for hackathon submission

#### 4.3 Deployment
- [ ] Deploy DApp to Vercel/Cloudflare Pages
- [ ] Deploy landing page to Vercel/Cloudflare Pages
- [ ] Verify all links and routes work in production
- [ ] Final smoke test on deployed apps

### Definition of Done
- Demo video recorded (2-3 minutes)
- Both apps deployed and accessible
- Hackathon submission complete

---

## Task Dependency Graph

```
Phase 1 (Foundation)
  1.1 React Scaffolding ─────────────────────┐
  1.2 Contract Tests ────────────────────┐    │
  1.3 Design System ──────────────────┐  │    │
                                      │  │    │
Phase 2 (Core Features)               ▼  ▼    ▼
  2.1 agent.json Parser ──────► 2.2 Mint Wizard
  1.3 Design System ──────────► 2.3 Molt-Dex ──► 2.4 Molt Card
  1.2 Contract Tests ─────────► 2.5 Contract Deploy
                                      │    │    │
Phase 3 (Integration)                 ▼    ▼    ▼
  2.2 + 2.5 ──────────────────► 3.1 E2E Mint Integration
  1.1 ────────────────────────► 3.2 Wallet Connection
  2.5 + 2.3 ──────────────────► 3.3 On-Chain Data Reading
  1.3 ────────────────────────► 3.4 Visual Polish
  1.3 ────────────────────────► 3.5 Landing Page
                                      │
Phase 4 (Ship)                        ▼
  3.* ────────────────────────► 4.1 Bug Fixes
  4.1 ────────────────────────► 4.2 Demo
  4.1 ────────────────────────► 4.3 Deploy
```

### Critical Path
1. React Scaffolding -> Mint Wizard -> E2E Mint Integration -> Bug Fixes -> Demo
2. Contract Tests -> Contract Deploy -> E2E Mint Integration (merge point)
3. agent.json Parser -> Mint Wizard (merge point)

---

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| BSC Testnet downtime | High | Low | Keep local Hardhat node as fallback for demo |
| IPFS upload issues (Pinata) | Medium | Low | Fallback: store metadata as base64 data URI |
| Wagmi/RainbowKit version conflicts | Medium | Medium | Pin exact versions, test early |
| Scope creep (adding features beyond MVP) | High | High | Strict MVP: only Mint + Molt-Dex + Molt Card |
| Solo developer burnout | High | Medium | Time-box each phase, cut scope before cutting sleep |
| Smart contract bugs found late | High | Low | Write thorough tests in Phase 1 before any UI work |

### Scope Cut Priorities (if running behind)
1. Cut: Landing page (can be minimal or skipped)
2. Cut: Filter/search in Molt-Dex (just show grid)
3. Cut: ASCII art polish (use placeholder art)
4. Cut: Responsive design (desktop-only for demo)
5. Never cut: Mint flow, Molt-Dex display, Molt Card display (these ARE the MVP)

---

## Demo Script Outline

1. **Open Landing Page** (10s) - Show project branding, click "Launch App"
2. **Connect Wallet** (15s) - RainbowKit modal, select MetaMask, switch to BSC Testnet
3. **Show Empty Molt-Dex** (5s) - "No agents yet" state
4. **Start Mint Flow** (60s)
   - Upload sample agent.json
   - Preview parsed agent data (name, skills, personality)
   - Confirm agent wallet address
   - Submit mint transaction
   - Wait for confirmation
   - See success with NFA card
5. **View Molt-Dex** (15s) - Show newly minted NFA in gallery grid
6. **View Molt Card** (20s) - Click into agent detail, show full resume card with on-chain data
7. **Closing** (10s) - Back to landing, show vision statement

**Total**: ~2.5 minutes

---

*Plan Version: 1.0*
*Created: 2026-02-06*
*Last Updated: 2026-02-06*
