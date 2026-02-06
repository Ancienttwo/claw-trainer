# Frontend Architecture - ClawTrainer.ai DApp (apps/web)

> **Version**: 1.0.0
> **Stack**: Vite 7.x + React 19 + TanStack Router 1.x + TanStack Query 5.x + Zustand 5.x + Wagmi 2.x + RainbowKit 2.x

---

## 1. Route Structure (TanStack Router File-Based Routing)

### Route Map

| Path | Route File | Page | Description |
|------|-----------|------|-------------|
| `/` | `index.tsx` | MoltDex | Agent gallery grid (Pokedex-style) |
| `/molt/$id` | `molt/$id.tsx` | MoltCard | Agent resume trading card |
| `/mint` | `mint.tsx` | MintFlow | Step wizard for NFA minting |

### Layout Hierarchy

```
__root.tsx (AppShell)
├── index.tsx           (MoltDex - Agent Gallery)
├── molt/
│   └── $id.tsx         (MoltCard - Agent Resume)
└── mint.tsx            (MintFlow - Mint Wizard)
```

### Root Route Setup

The root route uses `createRootRouteWithContext` to inject `QueryClient` into the router context. All routes access on-chain data through this shared context.

```
__root.tsx
  -> Providers (RainbowKit + Wagmi + QueryClient)
    -> AppShell (Navbar + Outlet + Footer)
```

---

## 2. Directory Structure

```
apps/web/src/
├── routes/                  # TanStack Router file routes
│   ├── __root.tsx           # Root layout: providers + AppShell
│   ├── index.tsx            # MoltDex page
│   ├── mint.tsx             # MintFlow page
│   └── molt/
│       └── $id.tsx          # MoltCard page (dynamic)
├── components/
│   ├── layout/              # Shell, Navbar, Footer
│   │   ├── app-shell.tsx    # Main layout wrapper
│   │   ├── navbar.tsx       # Top nav with logo + wallet
│   │   └── footer.tsx       # Footer links
│   ├── molt/                # Agent-related components
│   │   ├── agent-card.tsx   # Grid card for MoltDex
│   │   ├── molt-card.tsx    # Full trading card view
│   │   ├── agent-grid.tsx   # Grid container with filters
│   │   ├── stat-bar.tsx     # HP/EXP stat display
│   │   └── evolution-badge.tsx  # Rookie/Pro/Cyber indicator
│   ├── mint/                # Mint flow components
│   │   ├── mint-wizard.tsx  # Multi-step orchestrator
│   │   ├── step-upload.tsx  # Step 1: Upload agent.json
│   │   ├── step-preview.tsx # Step 2: Preview config
│   │   ├── step-fund.tsx    # Step 3: Inject BNB
│   │   └── step-success.tsx # Step 4: Mint result
│   └── ui/                  # shadcn/ui primitives
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── badge.tsx
│       └── skeleton.tsx
├── hooks/                   # Custom hooks
│   ├── use-agents.ts        # Query: fetch all agents
│   ├── use-agent.ts         # Query: fetch single agent
│   ├── use-mint-nfa.ts      # Mutation: mint NFA tx
│   └── use-agent-balance.ts # Query: agent BNB balance
├── stores/                  # Zustand stores
│   ├── mint-flow-store.ts   # Mint wizard state machine
│   └── ui-store.ts          # UI preferences (theme, filters)
├── lib/                     # Utilities + config
│   ├── wagmi.ts             # Wagmi + RainbowKit config
│   ├── contracts.ts         # Contract addresses + ABIs
│   ├── constants.ts         # Chain IDs, URLs, limits
│   ├── cn.ts                # clsx + tailwind-merge helper
│   └── parse-agent.ts       # agent.json parser/validator
├── types/                   # TypeScript types
│   ├── agent.ts             # Agent, AgentConfig, NFA types
│   └── contract.ts          # Contract event/return types
├── main.tsx                 # App entry point
├── app.css                  # Global styles (Tailwind v4)
└── routeTree.gen.ts         # Auto-generated route tree
```

### Directory Rules

- Max 8 files per folder (per CLAUDE.md)
- `components/ui/` may exceed 8 if shadcn primitives require it -- split into `ui/form/` and `ui/display/` if needed
- All exports are named (no default exports)

---

## 3. State Management

### Layer Separation

| Layer | Tool | Scope | Examples |
|-------|------|-------|---------|
| Server/Chain State | TanStack Query | On-chain reads, cached | Agent list, agent details, balances |
| Client State | Zustand | UI-local, ephemeral | Mint wizard step, filter selections |
| Wallet State | Wagmi hooks | Connection, signing | Account, chainId, write results |
| URL State | TanStack Router | Shareable, navigable | `/molt/$id`, search params |

### Zustand Stores

#### `mint-flow-store.ts`

```typescript
type MintStep = 'upload' | 'preview' | 'fund' | 'success'

interface MintFlowState {
  step: MintStep
  agentConfig: AgentConfig | null
  txHash: string | null
  setStep: (step: MintStep) => void
  setAgentConfig: (config: AgentConfig) => void
  setTxHash: (hash: string) => void
  reset: () => void
}
```

#### `ui-store.ts`

```typescript
interface UiState {
  gridFilter: AgentType | 'all'
  sortBy: 'newest' | 'level' | 'reputation'
  setGridFilter: (filter: AgentType | 'all') => void
  setSortBy: (sort: UiState['sortBy']) => void
}
```

### TanStack Query Keys

```typescript
const queryKeys = {
  agents: {
    all: ['agents'] as const,
    detail: (id: string) => ['agents', id] as const,
    balance: (id: string) => ['agents', id, 'balance'] as const,
  },
} as const
```

### Query Hooks (in `hooks/`)

| Hook | Query Key | Data Source | Stale Time |
|------|-----------|-------------|------------|
| `useAgents` | `agents.all` | `contract.getAllAgents()` | 30s |
| `useAgent(id)` | `agents.detail(id)` | `contract.getAgent(id)` | 30s |
| `useAgentBalance(id)` | `agents.balance(id)` | `viem.getBalance()` | 15s |
| `useMintNfa` | mutation | `contract.mint()` | N/A |

---

## 4. Wagmi + RainbowKit Setup

### Chain Configuration (`lib/wagmi.ts`)

```typescript
import { bsc, bscTestnet } from 'wagmi/chains'

const chains = [bscTestnet, bsc] as const

// RainbowKit + Wagmi config
// - defaultChain: bscTestnet (development)
// - transports: HTTP (public RPC)
// - connectors: injected, walletConnect, coinbaseWallet
```

**Note**: The project uses `@rainbow-me/rainbowkit` (not ConnectKit) per `package.json`. RainbowKit provides `<ConnectButton>` for wallet UI and `RainbowKitProvider` wrapping the app.

### Contract Configuration (`lib/contracts.ts`)

```typescript
const CONTRACTS = {
  identityRegistry: {
    address: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
    abi: identityRegistryAbi,
  },
  reputationRegistry: {
    address: '0x8004BAa17C55a88189AE136b182e5fdA19dE9b63',
    abi: reputationRegistryAbi,
  },
} as const
```

### Key Wagmi Hooks Mapping

| Operation | Wagmi Hook | Usage |
|-----------|-----------|-------|
| Read agent list | `useReadContract` | MoltDex gallery data |
| Read agent detail | `useReadContract` | MoltCard page data |
| Read balance | `useBalance` | Agent wallet balance |
| Mint NFA | `useWriteContract` | MintFlow transaction |
| Wait for tx | `useWaitForTransactionReceipt` | MintFlow confirmation |
| Current account | `useAccount` | Navbar wallet status |
| Chain ID | `useChainId` | Network validation |
| Switch chain | `useSwitchChain` | Wrong network prompt |

---

## 5. Data Flow Diagrams

### Mint Flow

```
User Journey:
  Upload agent.json
    -> Parse & validate (lib/parse-agent.ts)
    -> Store in mintFlowStore (Zustand)
    -> Preview config + ASCII art
    -> Check wallet connected (useAccount)
    -> Check correct chain (useChainId -> useSwitchChain)
    -> useWriteContract(identityRegistry.mint, args)
    -> useWaitForTransactionReceipt(txHash)
    -> Success screen with NFA ID + tx link

State Machine:
  upload -> preview -> fund -> success
    |         |         |
    v         v         v
  [parse]  [review]  [sign tx]
```

```
Sequence:

  User          MintWizard        Wagmi           BSC
   |                |               |               |
   |-- drop file -->|               |               |
   |                |-- parse ----->|               |
   |<-- preview ----|               |               |
   |-- confirm ---->|               |               |
   |                |-- write ----->|               |
   |                |               |-- mint tx --->|
   |                |               |<-- receipt ---|
   |<-- success ----|               |               |
```

### Gallery Flow (MoltDex)

```
Page Load:
  useAgents() -> useReadContract(getAllAgents)
    -> TanStack Query cache (staleTime: 30s)
    -> AgentGrid renders AgentCard[]
    -> Click AgentCard -> navigate('/molt/$id')

Agent Detail:
  Route params: { id: string }
  useAgent(id) -> useReadContract(getAgent, [id])
    -> MoltCard renders full trading card
    -> Shows: ASCII art, stats, skills, ERC-8004 binding
```

```
Sequence:

  User          MoltDex          TQ Cache        BSC
   |                |               |               |
   |-- visit / --->|               |               |
   |                |-- query ----->|               |
   |                |               |-- read ------>|
   |                |               |<-- agents ----|
   |                |<-- cached ----|               |
   |<-- grid -------|               |               |
   |                |               |               |
   |-- click card ->|               |               |
   |-- /molt/42 --->|               |               |
   |                |-- query(42) ->|               |
   |                |               |-- read(42) -->|
   |                |               |<-- agent -----|
   |<-- molt card --|               |               |
```

---

## 6. Key Component Specs

### AgentCard

```
File: components/molt/agent-card.tsx
Purpose: Grid item in MoltDex gallery

Props:
  agent: Agent (NFA ID, name, type, level, evolution)

Renders:
  - Pixel-art ASCII avatar (based on evolution stage)
  - NFA ID badge (#001, #002...)
  - Agent name + type tag (Alpha/Dev/Social)
  - Level indicator bar
  - Evolution badge (Rookie/Pro/Cyber)

Behavior:
  - Click -> navigate to /molt/$id
  - Hover -> subtle glow effect (Pokedex Red border)

Size: ~15 lines JSX
```

### MoltCard

```
File: components/molt/molt-card.tsx
Purpose: Full trading card view on /molt/$id

Props:
  agent: Agent (full on-chain data)

Layout (Trading Card Style):
  ┌─────────────────────────┐
  │  [ASCII Lobster Art]    │  <- Top section
  │                         │
  ├─────────────────────────┤
  │  HP ████████░░  80/100  │  <- Stat bars
  │  EXP ██████░░░░ 60/100  │
  │  Type: Dev  |  Lv. 12   │
  │  Owner: 0xAbc...123     │
  │  ERC-8004: bound        │
  ├─────────────────────────┤
  │  Skills:                │  <- Bottom section
  │  ⚔ discord-management  │
  │  ⚔ market-analysis     │
  │  Badges: [BAP-578]     │
  └─────────────────────────┘

Behavior:
  - Displays all on-chain metadata
  - Links to BSCScan for contract/tx
  - "Hire" button (v2.0, disabled in MVP)
```

### MintWizard

```
File: components/mint/mint-wizard.tsx
Purpose: Multi-step NFA minting orchestrator

State: mintFlowStore (Zustand)
  step: 'upload' | 'preview' | 'fund' | 'success'

Steps:
  1. StepUpload: File drop zone for agent.json
     - Validates JSON schema (lib/parse-agent.ts)
     - Error display for invalid configs
     - Sets agentConfig in store

  2. StepPreview: Shows parsed agent config
     - ASCII preview of agent appearance
     - Capability list, name, version
     - "Back" and "Continue" buttons

  3. StepFund: Wallet interaction
     - ConnectButton if not connected
     - Chain check (must be BSC)
     - Calls useWriteContract for mint
     - Shows tx pending spinner
     - useWaitForTransactionReceipt for confirmation

  4. StepSuccess: Result display
     - NFA ID from tx receipt
     - ASCII "MINT SUCCESSFUL" animation
     - Link to MoltCard (/molt/$id)
     - "Mint Another" button (reset store)

Behavior:
  - Linear progression (no skip)
  - Back button on steps 2-3
  - Store resets on unmount or "Mint Another"
```

### AppShell

```
File: components/layout/app-shell.tsx
Purpose: Root layout wrapper

Structure:
  ┌─────────────────────────────┐
  │  Navbar                     │
  │  [Logo] [Dex] [Mint] [🔗]  │
  ├─────────────────────────────┤
  │                             │
  │  <Outlet />                 │
  │  (Route content)            │
  │                             │
  ├─────────────────────────────┤
  │  Footer                     │
  │  [BSC] [GitHub] [Docs]      │
  └─────────────────────────────┘

Navbar contains:
  - ClawTrainer logo (ASCII lobster claw)
  - Nav links: Molt-Dex (/), Mint (/mint)
  - RainbowKit <ConnectButton /> (wallet)
  - Chain indicator (BSC Mainnet/Testnet)
```

---

## 7. Provider Stack

The root route (`__root.tsx`) wraps the app with providers in this order:

```
<WagmiProvider config={wagmiConfig}>
  <QueryClientProvider client={queryClient}>
    <RainbowKitProvider>
      <AppShell>
        <Outlet />
      </AppShell>
      <TanStackRouterDevtools />  {/* dev only */}
      <ReactQueryDevtools />       {/* dev only */}
    </RainbowKitProvider>
  </QueryClientProvider>
</WagmiProvider>
```

The router is created with `createRootRouteWithContext<RouterContext>()` where:

```typescript
interface RouterContext {
  queryClient: QueryClient
}
```

---

## 8. Entry Point (`main.tsx`)

```
1. Import routeTree from './routeTree.gen'
2. Create QueryClient
3. Create router with routeTree + context { queryClient }
4. Register router type (declare module '@tanstack/react-router')
5. ReactDOM.createRoot(document.getElementById('app'))
6. Render <RouterProvider router={router} />
```

Note: The HTML entry (`index.html`) mounts to `<div id="app">` and the entry script is `/src/main.tsx` (changed from `main.ts` to support JSX).

---

## 9. Styling Strategy

### Tailwind CSS v4

- Uses `@tailwindcss/vite` plugin (already in devDependencies)
- Import via `@import "tailwindcss"` in `app.css`
- Custom theme tokens defined via CSS custom properties

### Design Tokens (Molt-Mon Theme)

```css
/* Pokedex Red */        --color-primary: #dc2626;
/* Terminal Amber */     --color-terminal: #f59e0b;
/* Terminal Green */     --color-terminal-alt: #22c55e;
/* Dark BG */            --color-surface: #1a1a2e;
/* Card BG */            --color-card: #16213e;
/* Pixel Border */       --color-border: #0f3460;
```

### Component Styling

- All components use Tailwind utility classes
- `cn()` helper (clsx + tailwind-merge) for conditional classes
- shadcn/ui components customized with Molt-Mon theme
- Pixel/monospace font for ASCII art sections
- No inline styles (per CLAUDE.md)

---

## 10. Build & Dev Configuration

### Vite Config (`vite.config.ts`)

```typescript
// Plugins (order matters):
// 1. tanstackRouter({ target: 'react', autoCodeSplitting: true })
// 2. react()
// 3. tailwindcss()  -- via @tailwindcss/vite
```

### TypeScript Config

- `target`: ES2022
- `strict`: true
- `verbatimModuleSyntax`: true
- Path alias: `@/` -> `src/` (add to tsconfig `paths`)

### Code Quality

- Biome for linting + formatting
- Named exports only
- No `any` type (use `unknown` + type guard)
- Functions <= 20 lines
- Max 3 nesting levels

---

## 11. Error Handling Strategy

| Scenario | Handling |
|----------|---------|
| Wrong chain | `useSwitchChain` prompt in MintFlow |
| Wallet not connected | RainbowKit `<ConnectButton>` inline |
| Contract revert | Toast notification with error message |
| Invalid agent.json | Inline validation error in StepUpload |
| Network error | TanStack Query retry (3x default) |
| Route not found | TanStack Router `notFoundComponent` |

---

## 12. Performance Considerations

- **Code splitting**: TanStack Router `autoCodeSplitting: true` splits per route
- **Query dedup**: TanStack Query deduplicates identical on-chain reads
- **Stale-while-revalidate**: Cached data shown immediately, refreshed in background
- **Lazy components**: Route components auto-lazy via file-based routing plugin
- **Image optimization**: ASCII art is text-based, minimal asset weight

---

*Architecture Version: 1.0.0*
*Stack: Vite 7.x + React 19 + TanStack Router 1.x + Wagmi 2.x + RainbowKit 2.x*
*Generated: 2026-02-06*
