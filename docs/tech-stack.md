# ClawTrainer.ai - Tech Stack

## Architecture Overview (Monorepo)

| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| Monorepo | Turborepo + Bun Workspaces | 2.x / 1.x | Fast builds, module isolation, shared deps |
| Landing Page | Astro + Starwind UI | 5.x / 1.x | Zero JS by default, SEO-friendly, fast static site |
| DApp Frontend | Vite + React + TypeScript | 7.x / 19 / 5.9 | Type-safe SPA, best DX for Web3 |
| Routing | TanStack Router | 1.x | Type-safe routing, search params |
| Server State | TanStack Query | 5.x | Auto caching, dedup, revalidation |
| Client State | Zustand | 5.x | Minimal, hooks-based |
| UI Components | shadcn/ui + Tailwind CSS | latest / 4.x | Composable, customizable, copy-paste |
| Web3 Connection | Wagmi + Viem | 2.x / 2.x | Type-safe Ethereum interactions |
| Wallet UI | RainbowKit | 2.x | Beautiful wallet connection UI |
| Smart Contracts | Hardhat + OpenZeppelin | 2.x / 5.x | Standard tooling, battle-tested contracts |
| Target Chain | BNB Smart Chain | - | Hackathon requirement |
| Testing | Vitest + Playwright | 4.x / 1.x | Fast unit/integration + E2E |
| Linting | Biome | 2.x | Replaces ESLint + Prettier, 30x faster |
| Package Manager | Bun | 1.x | Fastest install + runtime |

## Monorepo Structure

```
claw-trainer/
├── apps/
│   ├── landing/          # Astro 5.x — marketing & SEO
│   └── web/              # Vite + React 19 — DApp
├── packages/
│   ├── contracts/        # Hardhat — Solidity smart contracts
│   ├── ui/               # Shared React components (shadcn/ui)
│   ├── config/           # Shared configs (tsconfig, biome, tailwind)
│   └── types/            # Shared TypeScript types & ABIs
├── turbo.json
├── package.json
└── biome.json
```

## Key Dependencies

### Core Framework
- `react` / `react-dom` — v19
- `@tanstack/react-router` — Type-safe routing
- `@tanstack/react-query` — Server state management
- `zustand` — Client state

### Web3 Stack
- `wagmi` — React hooks for Ethereum
- `viem` — Low-level Ethereum client
- `connectkit` — Wallet connection UI
- `hardhat` — Smart contract development
- `@openzeppelin/contracts` — Secure contract primitives

### UI & Styling
- `tailwindcss` v4 — Utility-first CSS
- `shadcn/ui` — Component library
- `lucide-react` — Icons
- `framer-motion` — Animations

## Deployment Plan

| App | Platform | URL Pattern |
|-----|----------|-------------|
| Landing | Vercel / Cloudflare Pages | clawtrainer.ai |
| DApp | Vercel / Cloudflare Pages | app.clawtrainer.ai |
| Contracts | BNB Chain (BSC Testnet -> Mainnet) | - |

## Cost Estimation

| Service | Free Tier | Monthly (1K MAU) | Monthly (10K MAU) |
|---------|-----------|-------------------|---------------------|
| Vercel | 100GB bandwidth | $0 | $20 |
| BNB Chain | N/A | ~$5 (gas) | ~$50 (gas) |
| IPFS (Pinata) | 1GB | $0 | $20 |
| Domain | N/A | ~$1 | ~$1 |

---

*Generated: 2026-02-06*
*Plan: I + D (Web3 DApp + Astro Landing + Monorepo)*
