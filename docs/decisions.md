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
