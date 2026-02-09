# ClawTrainer.ai Development Guide

> **Developer**: Victor (Flash)
> **Service Target**: BNB Hackathon Dev Team
> **Interaction Style**: Technical, concise (Chinese casual OK)
> **Thinking Mode**: ultrathink - Three-layer traversal (Phenomenon -> Essence -> Philosophy -> Output)

---

## Iron Rules

### 1. Good Taste
- Eliminate special cases instead of adding if/else
- More than 3 branches -> Stop, refactor data structure
- More than 3 levels of nesting -> Design error, must refactor
- More than 20 lines per function -> Ask if you're doing it wrong

### 2. Pragmatism
- Solve real problems, not hypothetical threats
- Write the simplest working implementation first, then optimize

### 3. Stand on Giants' Shoulders

**New feature development flow:**
1. **Search for mature solutions** - Use Context7 / GitHub / npm for best practices
2. **Analyze project constraints** - Evaluate against existing codebase and tech stack
3. **Propose integration plan** - Don't reinvent wheels, but don't blindly copy either

### 4. Zero Compatibility Debt

```yaml
FORBIDDEN:
  - Writing special branches for backward compatibility
  - Keeping deprecated APIs or functions
  - Feature detection to support multiple implementations
  - "for compatibility" or "legacy support" comments
  - Backward-compatible shims or polyfills
  - Renaming unused _vars variables
  - Adding "// removed" comments for history

REQUIRED:
  - Delete unused code directly
  - Upgrade dependencies or refactor, never write compatibility layers
  - If breaking old formats, let it break
  - Keep codebase clean, no historical baggage
```

### 5. Code Quality Red Lines

| Metric | Limit |
|--------|-------|
| File lines | <= 800 |
| Files per folder | <= 8 (create subdirectories if more) |
| Function lines | <= 20 |
| Nesting levels | <= 3 |
| Branch count | <= 3 |

### 6. Prohibitions

```yaml
ABSOLUTE_BAN:
  - "any" type in TypeScript (use unknown + type guard)
  - console.log in production code (use structured logger)
  - Hardcoded secrets, API keys, or wallet private keys
  - Direct DOM manipulation in React components
  - Inline styles (use Tailwind classes)
  - Default exports (use named exports only)
  - var keyword (use const/let)
  - Magic numbers (extract to constants)
  - Nested ternaries
  - Non-null assertion (!) without validation
```

### 7. Development Protocol (Multi-Agent Philosophy)

> **Core Philosophy**: Token unlimited = Manpower unlimited = Code is toilet paper = Rewrite over patch

#### The Layered Truth

```
+-----------------------------------------------------+
|                 IMMUTABLE LAYER (Assets)            |
|  +-----------+  +-----------+  +-----------+        |
|  |   Spec    |  | Contract  |  |   Tests   |        |
|  |  (What)   |  |(Interface)|  |  (Truth)  |        |
|  +-----------+  +-----------+  +-----------+        |
|----------------------------------------------------|
|                 MUTABLE LAYER (Toilet Paper)        |
|  +-------------------------------------------+      |
|  |              Implementation               |      |
|  |        (Code that can be deleted anytime) |      |
|  +-------------------------------------------+      |
+-----------------------------------------------------+
```

#### Response Protocol

```yaml
NEW_FEATURE_FLOW:
  trigger: When user says "new feature" or "new function"
  steps:
    # BDD Layer — Define WHAT (Human + LLM collaborate)
    1. Define acceptance criteria in Given-When-Then format:
       - Minimum 3 scenarios (happy path, edge case, error path)
       - Format: |
           Feature: [Name]
             Scenario: [Happy path]
               Given [precondition]
               When [action]
               Then [expected outcome]
             Scenario: [Edge case]
               Given [precondition]
               When [boundary action]
               Then [expected handling]
             Scenario: [Error path]
               Given [precondition]
               When [invalid action]
               Then [error response]
    2. Output Spec first (functionality, boundary conditions, exceptions)
    3. STOP and wait for confirmation
    4. Output Interface Contract (types, function signatures)
    5. STOP and wait for confirmation
    # TDD Layer — Define HOW (LLM generates, Human reviews)
    6. Write failing tests from acceptance scenarios (Red)
    7. Write minimal implementation to pass tests (Green)
    8. Refactor only after all tests pass (Refactor)
  rule: Test code quantity >= Implementation quantity

MODIFICATION_FLOW:
  trigger: When user says "change" or "modify"
  steps:
    1. Ask: "Change Spec or just Implementation?"
    2. If Spec changes -> Regenerate everything from Spec
    3. If only Impl changes -> Delete and rewrite module, keep interface

BUG_FIX_FLOW:
  trigger: When user says "bug"
  steps:
    1. Write a test that reproduces the bug FIRST
    2. Verify the test FAILS (confirms bug exists)
    3. Delete the affected module entirely
    4. Rewrite from scratch (never patch)
    5. Verify all tests pass
    6. FORBIDDEN: "I think it's fixed" without test proof
```

#### Module Boundary (Deletion Scope Definition)

```yaml
MODULE_DEFINITION:
  UNIT: Single function/class -> Delete that function/class file
  INTEGRATION: Multiple functions collaborating -> Delete entire src/modules/{name}/ directory
  E2E: Cross-module flow -> Only delete modules involved in failed path

DELETION_SCOPE:
  tests/unit/auth.test.ts fails:
    -> Only delete src/modules/auth/
    -> Keep contracts/modules/auth.contract.ts

  tests/integration/checkout.test.ts fails:
    -> Delete src/modules/checkout/
    -> If contract itself has issues -> First change spec, then delete all downstream

  tests/e2e/user-flow.test.ts fails:
    -> Locate the specific failing module (check stack trace)
    -> Only delete that module, not the entire chain

ESCALATION_RULE:
  Multiple modules rewritten but still failing -> Problem is in Contract -> Go back to Spec layer
  Contract changes -> All modules depending on that Contract must be rewritten
```

#### TDD vs BDD Selection Guide

```yaml
# Select test strategy by module nature, NOT by frontend/backend

TDD_TARGETS:  # Clear input/output, pure logic
  - API endpoints (request -> response)
  - Business logic / algorithms / utils
  - React Hooks / state logic (useXxx -> returns data)
  - Smart Contracts (mint() -> balanceOf === 1)
  - Data transformations / parsers
  - Database queries / ORM operations
  tool: Vitest (unit) + Hardhat (contracts)
  pattern: Red -> Green -> Refactor

BDD_TARGETS:  # User behavior driven, scenario level
  - User flows / acceptance criteria
  - UI component interactions (click -> see result)
  - E2E tests (full page scenarios)
  - Feature acceptance (Given-When-Then)
  - Cross-module integration from user perspective
  tool: Playwright (E2E) + Testing Library (component)
  pattern: Given -> When -> Then

HYBRID_EXAMPLE:
  AgentCard:
    BDD: "renders agent skills and hire button"           # Behavior
    TDD: "calculates reputation score from history data"  # Logic

  MintNFA:
    TDD: "contract mints token with correct URI"          # Contract logic
    BDD: "user uploads config, clicks mint, sees success" # User flow
```

#### Test Quality Standards

```yaml
TEST_STANDARDS:
  NAMING: should_[expected]_when_[condition]
  STRUCTURE: Arrange-Act-Assert (AAA)
  ISOLATION: Each test independent, no shared mutable state
  DETERMINISM: No Math.random(), no Date.now(), no network calls in unit tests
  COVERAGE_TARGET: 80%+ for business logic, 100% for algorithms
  PREFERENCE: Property-based tests over example-based for algorithms

  FORBIDDEN_PATTERNS:
    - Tests that only check implementation details (spy counts, call order)
    - Tests that duplicate source code logic
    - Tests with no assertions
    - Tests that always pass regardless of implementation
    - Writing implementation before its test exists

  EXCEPTIONS (skip TDD for):
    - Config files, type definitions, constants
    - CSS/style-only changes
    - Documentation-only changes
    - Prototype/spike exploration (must be marked as such)
```

#### Forbidden Actions (Development Protocol)

- No patching code to fix bugs (must rewrite)
- No changing interface without Spec update
- No writing code without corresponding tests
- No modifying tests to make buggy code pass
- No deleting code beyond the scope of failing tests
- No implementing features not covered by acceptance criteria

---

## Project Structure

```
claw-trainer/
├── apps/
│   ├── api/              # Hono 4.x + Bun (Backend API)
│   ├── landing/          # Astro 5.x + Starwind UI (Landing Page) + Starlight (Docs) + Remotion 4.x (Hero Animation)
│   └── app/              # Vite 7.x + React 19 (DApp Frontend)
├── packages/
│   └── contracts/        # Solidity smart contracts (Hardhat)
├── specs/                # Feature specifications (IMMUTABLE)
│   ├── overview.md
│   └── modules/
├── contracts/            # Interface contracts / types (IMMUTABLE)
│   ├── types.ts
│   └── modules/
├── tests/                # Tests are the truth (IMMUTABLE)
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── src/                  # Shared implementation (MUTABLE)
│   └── modules/
├── docs/                 # Documentation
│   ├── architecture/
│   ├── api/
│   ├── guides/
│   ├── archives/
│   ├── PROGRESS.md
│   ├── TODO.md
│   └── CHANGELOG.md
├── scripts/              # Automation scripts
├── _ops/                 # Sensitive configs (DO NOT commit)
├── artifacts/            # Build outputs (DO NOT commit)
├── CLAUDE.md
└── package.json
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| Backend API | Hono 4.x + Bun + Zod |
| Landing + Docs | Astro 5.x + Starwind UI + Starlight + Tailwind CSS v4 |
| DApp Frontend | Vite 6.x + React 19 + TypeScript 5.x |
| Routing | TanStack Router 1.x |
| Data | TanStack Query 5.x + Zustand 5.x |
| UI Components | shadcn/ui + Tailwind CSS v4 |
| Web3 | Wagmi 2.x + Viem 2.x + RainbowKit 2.x |
| Smart Contracts | Hardhat 2.x + OpenZeppelin 5.x |
| Target Chain | BNB Chain (BSC) |
| Testing | Vitest 4.x + Playwright 1.x |
| Linting | Biome 2.x |
| Package Manager | bun 1.x |
| Bundler | Vite 7.x |

---

## Workflow Rules

### File Management

```yaml
MODIFY FIRST PRINCIPLE:
  1. Check existing file structure first
  2. Prefer modifying/extending over creating new files
  3. Get permission before creating files
  4. Delete temporary files immediately after use

DIRECTORY STRUCTURE:
  # ===== IMMUTABLE LAYER (Asset Layer) =====
  /specs/:
    PURPOSE: Feature specifications (IMMUTABLE)
    RULES: Modifying Spec = Rewrite all downstream

  /contracts/:
    PURPOSE: Interface contracts (IMMUTABLE)
    RULES: Changing interface must first change Spec

  /tests/:
    PURPOSE: Tests are the truth (IMMUTABLE)
    RULES: Test failure = Delete module and rewrite

  # ===== MUTABLE LAYER (Toilet Paper Layer) =====
  /src/, /apps/:
    PURPOSE: Implementation (MUTABLE)
    RULES: Can be deleted and rewritten anytime
```

### Progress Tracking

```yaml
docs/PROGRESS.md:
  PURPOSE: AI development log
  MAX_LINES: 2000
  ARCHIVE_TRIGGER: When exceeding 2000 lines
  FORMAT: |
    ## YYYY-MM-DD Session
    ### Completed
    - [x] Task description
    ### In Progress
    - [ ] Current work

docs/TODO.md:
  PURPOSE: Pending tasks
  RULES:
    - Only keep UNSTARTED tasks
    - Delete completed tasks immediately
```

### Git Strategy

```yaml
COMMIT_FORMAT: "{type}({scope}): {description}"
TYPES: feat | fix | docs | style | refactor | perf | test | chore
EXAMPLES:
  - "feat(nfa): add ERC-8004 mint flow"
  - "fix(wallet): resolve ConnectKit connection issue"
  - "chore(deps): upgrade wagmi to 2.x"

BRANCH_STRATEGY:
  main: Production-ready
  develop: Integration branch
  feature/*: feature/{short-description}
  hotfix/*: hotfix/{description}
```

---

## Web3 Specific Rules

```yaml
SMART_CONTRACT_RULES:
  - Always verify contract addresses from official sources
  - Never store private keys in code or .env committed to git
  - Use OpenZeppelin for standard implementations
  - All contract interactions must handle reverts gracefully
  - Test on BSC Testnet before mainnet

WALLET_INTEGRATION:
  - Use RainbowKit for wallet connection UI
  - Wagmi hooks for all contract reads/writes
  - Viem for low-level operations
  - Always show tx confirmation states to users

CHAIN_CONFIG:
  - Primary: BNB Smart Chain (BSC) - chainId: 56
  - Testnet: BSC Testnet - chainId: 97
  - RPC: Use public or Ankr endpoints
```

---

## Core Documentation Index

| Document | Path | Description |
|----------|------|-------------|
| Product Brief | `docs/brief.md` | Product positioning & MVP scope |
| Tech Stack | `docs/tech-stack.md` | Technology choices |
| Decisions | `docs/decisions.md` | Architecture Decision Records |
| Progress | `docs/PROGRESS.md` | Development progress |
| Changelog | `docs/CHANGELOG.md` | Version history |
| Todo | `docs/TODO.md` | Pending tasks |

---

## Philosophy Reminder

```text
Three-layer traversal:
  Phenomenon -> Collect symptoms, quick fixes
  Essence -> Root cause analysis, system diagnosis
  Philosophy -> Design principles, architectural aesthetics

Ultimate goal:
  From "How to fix" -> "Why it breaks" -> "How to design it right"

Remember:
  Simplification is the highest form of complexity
  A branch that can disappear is always more elegant than one written correctly
  True good taste is when someone looks at your code and says: "Damn, this is beautiful"
```

---

*Template Version: 2.0.0*
*Plan: I + D (Web3 DApp + Astro Landing + Monorepo)*
*Generated by project-initializer skill on 2026-02-06*
