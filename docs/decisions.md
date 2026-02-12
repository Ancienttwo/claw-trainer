# ClawTrainer.ai - Architecture Decision Records

Key technical decisions and their rationale.

---

## ADR-001: Tech Stack Selection

- **Date**: 2026-02-06
- **Status**: Accepted
- **Decider**: Victor (Flash)

### Context

ClawTrainer.ai is a Web3 DApp for the BNB Hackathon. Needs: landing page (SEO), DApp frontend (wallet integration), smart contracts (ERC-8004 NFA).

### Decision

**Plan I + D**: Monorepo (Turborepo) with Astro landing + Vite React DApp + Hardhat contracts.

### Rationale

- Astro for landing: Zero JS overhead, perfect for SEO marketing page
- Vite + React for DApp: Best ecosystem for Web3 (Wagmi, ConnectKit)
- Monorepo: Share types/ABIs between contracts and frontend, single CI/CD
- Bun: Fastest package manager, reduces iteration time during hackathon

### Trade-offs

| Alternative | Pros | Cons | Decision |
|-------------|------|------|----------|
| Next.js (monolith) | SSR, simpler setup | Heavy runtime, overkill for DApp | Rejected |
| Separate repos | Independent deploy | ABI sync pain, duplicate configs | Rejected |
| Remix | SSR + nested routes | Less Web3 ecosystem support | Rejected |

### Consequences

- **Positive**: Fast landing page, type-safe DApp, shared contract ABIs
- **Negative**: Monorepo complexity, Turborepo learning curve
- **Risks**: Bun compatibility with some npm packages

---

## ADR-002: Team Size & Architecture

- **Date**: 2026-02-06
- **Status**: Accepted
- **Team Size**: Solo (Hackathon)

### Decision

Solo developer, monorepo with clear module boundaries. Prioritize shipping MVP over architecture perfection.

### Rationale

- Monorepo simplifies solo workflow (single git, single CI)
- Clear package boundaries prevent spaghetti code
- Turborepo caching speeds up rebuilds during rapid iteration

---

## ADR-003: BNB Chain + ERC-8004

- **Date**: 2026-02-06
- **Status**: Accepted

### Decision

Build on BNB Smart Chain using ERC-8004 standard for agent identity NFTs.

### Rationale

- BNB Hackathon requirement
- Low gas fees enable frequent NFA minting during testing
- ERC-8004 provides standardized agent identity anchoring

---

## ADR-004: ERC-8004 Custom Profile vs Official Registry

- **Date**: 2026-02-13
- **Status**: Accepted
- **Decider**: Victor (Flash)

### Context

BNB Chain officially announced ERC-8004 support on 2026-02-04 with deployed registries on BSC Mainnet and Testnet. ClawTrainer already has a custom IdentityRegistry (`0x93EdC70...`) with ERC-8004-aligned features (ERC-721 + EIP-712 Agent Wallet). The question: migrate to the official registry or keep the custom contract?

### Decision

**Keep custom IdentityRegistry** as a "custom ERC-8004 profile". Do NOT migrate to the official `0x8004A818...` registry. Instead, label ERC-8004 compatibility in documentation and pitch narrative.

### Rationale

| Factor | Custom Contract | Official Registry |
|--------|----------------|-------------------|
| Soul-bound NFA | ✅ Built-in | ❌ Not supported |
| Dual EIP-712 signatures | ✅ Trainer + Agent | ❌ Single signer only |
| On-chain metadata | ✅ Base64 data URI | ❌ External URL |
| Agent levels | ✅ Built-in | ❌ Not supported |
| Deterministic tokenId | ✅ keccak256(name+owner) | ❌ Sequential |
| 30 passing tests | ✅ Full coverage | Would need rewrite |
| Hackathon timeline | ✅ Already deployed | ❌ Migration risk |

ClawTrainer's enhancements (soul-bound, dual signature, on-chain metadata, levels) are core differentiators that the official registry does not support. Migrating would lose these features.

### Consequences

- **Positive**: Keep all custom features, zero migration risk, strong differentiation narrative
- **Negative**: Not listed in official ERC-8004 registry (agents not discoverable cross-platform)
- **Mitigation**: Document ERC-8004 compliance clearly; post-hackathon can bridge to official registry

### Future Consideration

Post-hackathon, can optionally register ClawTrainer agents in the official ERC-8004 IdentityRegistry as a secondary listing (dual registration) for cross-platform discoverability.

---

## ADR-005: ReputationRegistry Integration Strategy

- **Date**: 2026-02-13
- **Status**: Proposed (Nice-to-have for Hackathon)

### Context

ERC-8004 defines a ReputationRegistry (`0x8004B663...` on BSC Testnet) with standardized feedback tags (starred, uptime, successRate, responseTime, reachable). ClawTrainer currently has no reputation system.

### Decision

**DEFER to post-hackathon.** If time permits before DDL, integrate read-only reputation display on Agent Cards using the official BSC Testnet ReputationRegistry.

### Rationale

- Reputation requires external callers to submit feedback (chicken-and-egg for demo)
- MVP core (Mint + Dex + Card) is higher priority
- Can display mock-compatible UI labels that later connect to real data

---

## ADR Template

```markdown
## ADR-XXX: [Title]

- **Date**: YYYY-MM-DD
- **Status**: Proposed / Accepted / Deprecated / Superseded
- **Decider**: [Name]

### Context
[Background and problem]

### Decision
[The decision made]

### Rationale
[Why this decision was made]

### Consequences
[Impact of this decision]
```

---

*Generated: 2026-02-06*
