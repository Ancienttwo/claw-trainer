# Pending Tasks

## Phase 1: Foundation (Feb 06-08) ✅

### 1.1 React App Scaffolding ✅
- [x] Replace Vite vanilla template with React 19 entry (main.tsx, App.tsx)
- [x] Configure TanStack Router (file-based routing, route tree)
- [x] Set up Wagmi + RainbowKit provider with BSC chain config
- [x] Set up TanStack Query provider
- [x] Create root layout with navigation shell
- [x] Configure Tailwind v4 with design tokens
- [x] Add global CSS (pixel font, ASCII aesthetic)

### 1.2 Smart Contract Tests ✅
- [x] Unit tests: mint, levelUp, agentWallets, tokenURI
- [x] Test access control (ownerOf checks)
- [x] Test edge cases (max level, invalid tokenId)
- [x] Add BSC Testnet deployment script
- [x] Configure hardhat BSC Testnet network

### 1.3 Design System ✅
- [x] Define color palette constants (Pokedex Red, Terminal Green, Terminal Amber)
- [x] Integrate pixel/mono font (Press Start 2P or similar)
- [x] Create base components: Card, Button, Badge, Container

## Phase 2: Core Features (Feb 09-12) ✅

### 2.1 agent.json Parser ✅
- [x] Define agent.json TypeScript schema/types
- [x] Write parser with validation
- [x] Unit tests for parser
- [x] Create sample agent.json fixtures

### 2.2 NFA Mint Flow ✅
- [x] Step 1: Upload/paste agent.json
- [x] Step 2: Preview parsed agent data
- [x] Step 3: Configure mint options
- [x] Step 4: Confirm & submit tx
- [x] Step 5: Success state with NFA preview
- [x] Progress indicator component
- [x] Form validation per step

### 2.3 Molt-Dex (Gallery) ✅
- [x] Responsive grid layout (Pokedex style)
- [x] Agent card thumbnail component
- [x] Filter/search bar
- [x] Empty state and loading skeletons

### 2.4 Molt Card (Resume) ✅
- [x] Full-page trading card layout
- [x] Header: name, level badge, evolution art
- [x] Stats: skills, personality traits
- [x] Chain data: owner, wallet, tokenId
- [x] Action buttons (View on BSCScan)

### 2.5 Contract Deployment
- [ ] Deploy IdentityRegistry to BSC Testnet
- [ ] Verify on BSCScan
- [ ] Save deployed address to config

## Phase 3: Integration & Polish (Feb 13-16) ✅

### 3.1 E2E Mint Integration ✅ (done in Phase 2)
- [x] Connect mint wizard to contract via Wagmi
- [x] On-chain base64 data URI (no IPFS needed — Nouns DAO pattern)
- [x] Handle tx states: pending, confirming, success, error
- [x] Display minted NFA on success

### 3.2 Wallet Connection ✅ (done in Phase 2)
- [x] RainbowKit connect button in nav
- [x] Chain switching to BSC
- [x] Wallet-aware UI states
- [ ] Transaction confirmation toasts (nice-to-have)

### 3.3 On-Chain Data Reading ✅ (done in Phase 2)
- [x] Query NFAs from contract events
- [x] Fetch tokenURI metadata
- [x] Display real on-chain data in Molt-Dex/Card
- [x] Cache with TanStack Query

### 3.4 Visual Polish ✅
- [x] ASCII art lobster avatars (3 evolution stages)
- [x] Pixel art borders and UI chrome
- [x] Loading animations (terminal-style)
- [x] Responsive design pass

### 3.5 Landing Page ✅
- [x] Customize Astro template with branding
- [x] Hero section with pixel art banner
- [x] Features section
- [ ] CTA button to DApp

## Phase 4: Demo & Ship (Feb 17-19)

### 4.1 Bug Fixes
- [ ] Full flow test on BSC Testnet
- [ ] Fix UI/UX issues
- [ ] Handle network errors gracefully

### 4.2 Demo
- [ ] Write demo script
- [ ] Record demo video (2-3 min)
- [ ] Prepare submission materials

### 4.3 Deployment
- [ ] Deploy DApp to Vercel/Cloudflare Pages
- [ ] Deploy landing page
- [ ] Final smoke test

## Backlog (Post-Hackathon)
- [ ] Discord Command Center integration
- [ ] Moltbook API reputation sync
- [ ] On-chain hiring flow with payment
- [ ] Agent-to-Agent interoperability (BAP-578)
- [ ] Evolution animation (ASCII particle effect)
