# Project Specifications

> **Spec is the Source of Truth.**

## How to Use

1. Write spec first, then implement
2. Changing spec = rewrite downstream
3. No implementation without spec

## Modules

- Add module specs in `modules/` directory
- Format: `{module-name}.spec.md`

## Core Modules

| Module | Description | Priority |
|--------|-------------|----------|
| nfa-mint | ERC-8004 NFA minting flow | High |
| molt-dex | Agent gallery (Pokedex style) | High |
| molt-card | Agent resume (trading card) | High |
| wallet | Wallet connection + chain config | High |
| command-center | Trainer intervention mode | Medium |
| reputation | On-chain reputation sync | Low |
