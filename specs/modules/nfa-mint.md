# NFA Minting Specification

> **Module**: nfa-mint
> **Priority**: High
> **Status**: Active
> **Dependencies**: Wallet connection, IdentityRegistry contract
> **ERC-8004 Compliance**: Custom profile — ERC-721 + EIP-712 Agent Wallet + on-chain metadata

## Overview

Mint an AI Agent as an on-chain NFA (Non-Fungible Agent) on BNB Chain using ERC-8004.
The flow: parse agent config -> build on-chain base64 data URI -> dual EIP-712 sign (trainer + agent) -> send mint transaction -> verify on-chain.

## Domain Rules

- `agentId` (tokenId) = `keccak256(agent_name + owner_address)` -- deterministic, no duplicates
- `tokenURI` is an on-chain base64 data URI (Nouns DAO pattern) — zero IPFS dependency
- Every NFA binds exactly one `agentWallet` address (EIP-712 verified)
- Minting requires dual EIP-712 signatures: trainer (owner) + agent wallet
- NFA is soul-bound (non-transferable) — enforced via `_update()` override

## Contract Addresses

| Contract | Address | Chain |
|----------|---------|-------|
| IdentityRegistry (ClawTrainer) | `0x93EdC70ADEF0aBde3906D774bEe95D90a959012a` | BSC Testnet (97) |
| IdentityRegistry (Official ERC-8004) | `0x8004A818BFB912233c491871b3d84c89A494BD9e` | BSC Testnet (97) |
| ReputationRegistry (Official ERC-8004) | `0x8004B663056A597Dffe9eCcC1965A193B7388713` | BSC Testnet (97) |

## ERC-8004 Compatibility Notes

ClawTrainer uses a **custom ERC-8004 profile** rather than the official registry:
- Identity: custom `mint()` with dual EIP-712 (vs standard `register()`)
- Metadata: on-chain base64 data URI (vs external URL in standard)
- Enhancements: soul-bound, agent levels, deterministic tokenId
- See: `docs/architecture/erc8004-research.md` for full gap analysis

---

## Feature: NFA Minting

### Scenario: Happy path -- valid agent config mints NFA successfully

```gherkin
Given the trainer has a connected wallet with sufficient BNB
  And the trainer provides a valid agent config with:
    | field             | value                                    |
    | name              | "Flash"                                  |
    | version           | "1.0.0"                                  |
    | capabilities      | ["discord-management", "market-analysis"]|
    | personality       | "analytical, concise"                    |
    | domain_knowledge  | "DeFi, BNB Chain ecosystem"              |
    | wallet_mapping    | a valid agent wallet address             |
When the trainer initiates the mint flow
Then the system parses the agent config and validates all required fields
  And the system generates agentId = keccak256(name + ownerAddress)
  And the system builds a base64 data URI with EIP-712 dual signatures
  And the system sends a mint transaction to IdentityRegistry
  And the transaction succeeds with an NFAMinted event
  And the result contains tokenId, txHash, tokenURI (on-chain data URI), and agentWallet
```

### Scenario: Duplicate agent ID -- same name + owner already minted

```gherkin
Given the trainer has a connected wallet
  And an NFA with name "Flash" already exists for this owner address
When the trainer attempts to mint another NFA with name "Flash"
Then the system computes agentId = keccak256("Flash" + ownerAddress)
  And the system detects that this agentId is already registered on-chain
  And the mint is rejected before sending a transaction
  And the user sees an error: "Agent 'Flash' is already minted for this wallet"
```

### Scenario: Invalid agent config -- missing required fields

```gherkin
Given the trainer has a connected wallet
When the trainer provides an agent config missing the "name" field
Then the system rejects the config at the parse step
  And the user sees a validation error listing the missing fields
  And no transaction is sent

Given the trainer has a connected wallet
When the trainer provides an agent config with an empty capabilities array
Then the system rejects the config at the parse step
  And the user sees: "Agent must have at least one capability"
```

### Scenario: Insufficient gas -- not enough BNB for transaction

```gherkin
Given the trainer has a connected wallet with 0 BNB balance
  And the trainer provides a valid agent config
When the trainer initiates the mint flow
Then the system estimates gas cost before sending the transaction
  And the system detects insufficient funds
  And the mint is rejected before sending a transaction
  And the user sees: "Insufficient BNB. Need at least {estimated} BNB for gas"
```

### Scenario: Contract revert -- on-chain mint fails

```gherkin
Given the trainer has a connected wallet with sufficient BNB
  And the trainer provides a valid agent config
  And the IdentityRegistry contract will revert (e.g., paused, invalid state)
When the system sends the mint transaction
Then the transaction reverts on-chain
  And the system captures the revert reason from the receipt
  And the user sees: "Mint failed: {revertReason}"
  And no NFA is created
```

### Scenario: Wallet disconnected mid-flow

```gherkin
Given the trainer has a connected wallet
  And the trainer has initiated the mint flow
  And the system has built the on-chain data URI
When the wallet disconnects before the mint transaction is signed
Then the system detects the wallet disconnection
  And the mint flow is aborted
  And the user sees: "Wallet disconnected. Please reconnect and retry."
```

---

## Acceptance Criteria Summary

| # | Criteria | Testable |
|---|----------|----------|
| 1 | Valid config parses without error | Unit test |
| 2 | agentId is deterministic: keccak256(name + owner) | Unit test |
| 3 | Service manifest matches expected schema | Unit test |
| 4 | EIP-712 dual signatures (trainer + agent) are valid and verifiable | Unit test |
| 5 | On-chain base64 data URI encodes valid JSON metadata | Unit test |
| 6 | Mint transaction emits NFAMinted event | Contract test |
| 7 | Duplicate agentId is caught before tx | Unit test |
| 8 | Missing fields produce clear validation errors | Unit test |
| 9 | Gas estimation prevents insufficient-fund tx | Integration test |
| 10 | Contract reverts surface readable errors | Integration test |
| 11 | Wallet disconnect aborts flow cleanly | E2E test |
