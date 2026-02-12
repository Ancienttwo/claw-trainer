/**
 * Contract ABIs and addresses for:
 * 1. Official ERC-8004 IdentityRegistry
 * 2. Official ERC-8004 ReputationRegistry
 * 3. ClawTrainerNFA (BAP-578 compliant)
 */

// ═══════════════════════════════════════════════
// ADDRESSES (BSC Testnet — chainId: 97)
// ═══════════════════════════════════════════════

export const ERC8004_IDENTITY_ADDRESS =
  "0x8004A818BFB912233c491871b3d84c89A494BD9e" as const

export const ERC8004_REPUTATION_ADDRESS =
  "0x8004B663056A597Dffe9eCcC1965A193B7388713" as const

export const CLAWTRAINER_NFA_ADDRESS =
  "0x0000000000000000000000000000000000000000" as const // TODO: update after deploy

/** @deprecated Use ERC8004_IDENTITY_ADDRESS for new code */
export const IDENTITY_REGISTRY_ADDRESS = ERC8004_IDENTITY_ADDRESS

export const CLAWTRAINER_NFA_DEPLOY_BLOCK = 0n // TODO: update after deploy

// ═══════════════════════════════════════════════
// ERC-8004 IdentityRegistry ABI
// ═══════════════════════════════════════════════

export const ERC8004_IDENTITY_ABI = [
  {
    inputs: [{ internalType: "string", name: "agentURI", type: "string" }],
    name: "register",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "agentURI", type: "string" },
      {
        components: [
          { internalType: "string", name: "metadataKey", type: "string" },
          { internalType: "bytes", name: "metadataValue", type: "bytes" },
        ],
        internalType: "struct IdentityRegistryUpgradeable.MetadataEntry[]",
        name: "metadata",
        type: "tuple[]",
      },
    ],
    name: "register",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "agentId", type: "uint256" },
      { internalType: "address", name: "newWallet", type: "address" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
      { internalType: "bytes", name: "signature", type: "bytes" },
    ],
    name: "setAgentWallet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "agentId", type: "uint256" },
      { internalType: "string", name: "newURI", type: "string" },
    ],
    name: "setAgentURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "agentId", type: "uint256" },
      { internalType: "string", name: "metadataKey", type: "string" },
      { internalType: "bytes", name: "metadataValue", type: "bytes" },
    ],
    name: "setMetadata",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "agentId", type: "uint256" },
      { internalType: "string", name: "metadataKey", type: "string" },
    ],
    name: "getMetadata",
    outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "agentId", type: "uint256" }],
    name: "getAgentWallet",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "agentId", type: "uint256" }],
    name: "unsetAgentWallet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "agentId", type: "uint256" },
    ],
    name: "isAuthorizedOrOwner",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "agentId", type: "uint256" },
      { indexed: false, internalType: "string", name: "agentURI", type: "string" },
      { indexed: true, internalType: "address", name: "owner", type: "address" },
    ],
    name: "Registered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "agentId", type: "uint256" },
      { indexed: false, internalType: "string", name: "newURI", type: "string" },
      { indexed: true, internalType: "address", name: "updatedBy", type: "address" },
    ],
    name: "URIUpdated",
    type: "event",
  },
] as const

// ═══════════════════════════════════════════════
// ERC-8004 ReputationRegistry ABI
// ═══════════════════════════════════════════════

export const ERC8004_REPUTATION_ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "agentId", type: "uint256" },
      { internalType: "int128", name: "value", type: "int128" },
      { internalType: "uint8", name: "valueDecimals", type: "uint8" },
      { internalType: "string", name: "tag1", type: "string" },
      { internalType: "string", name: "tag2", type: "string" },
      { internalType: "string", name: "endpoint", type: "string" },
      { internalType: "string", name: "feedbackURI", type: "string" },
      { internalType: "bytes32", name: "feedbackHash", type: "bytes32" },
    ],
    name: "giveFeedback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "agentId", type: "uint256" },
      { internalType: "uint64", name: "feedbackIndex", type: "uint64" },
    ],
    name: "revokeFeedback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "agentId", type: "uint256" },
      { internalType: "address[]", name: "clientAddresses", type: "address[]" },
      { internalType: "string", name: "tag1", type: "string" },
      { internalType: "string", name: "tag2", type: "string" },
    ],
    name: "getSummary",
    outputs: [
      { internalType: "uint64", name: "count", type: "uint64" },
      { internalType: "int128", name: "summaryValue", type: "int128" },
      { internalType: "uint8", name: "summaryValueDecimals", type: "uint8" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "agentId", type: "uint256" },
      { internalType: "address", name: "clientAddress", type: "address" },
      { internalType: "uint64", name: "feedbackIndex", type: "uint64" },
    ],
    name: "readFeedback",
    outputs: [
      { internalType: "int128", name: "value", type: "int128" },
      { internalType: "uint8", name: "valueDecimals", type: "uint8" },
      { internalType: "string", name: "tag1", type: "string" },
      { internalType: "string", name: "tag2", type: "string" },
      { internalType: "bool", name: "isRevoked", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "agentId", type: "uint256" }],
    name: "getClients",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "agentId", type: "uint256" },
      { internalType: "address", name: "clientAddress", type: "address" },
    ],
    name: "getLastIndex",
    outputs: [{ internalType: "uint64", name: "", type: "uint64" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "agentId", type: "uint256" },
      { indexed: true, internalType: "address", name: "clientAddress", type: "address" },
      { indexed: false, internalType: "uint64", name: "feedbackIndex", type: "uint64" },
      { indexed: false, internalType: "int128", name: "value", type: "int128" },
      { indexed: false, internalType: "uint8", name: "valueDecimals", type: "uint8" },
      { indexed: true, internalType: "string", name: "indexedTag1", type: "string" },
      { indexed: false, internalType: "string", name: "tag1", type: "string" },
      { indexed: false, internalType: "string", name: "tag2", type: "string" },
      { indexed: false, internalType: "string", name: "endpoint", type: "string" },
      { indexed: false, internalType: "string", name: "feedbackURI", type: "string" },
      { indexed: false, internalType: "bytes32", name: "feedbackHash", type: "bytes32" },
    ],
    name: "NewFeedback",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "agentId", type: "uint256" },
      { indexed: true, internalType: "address", name: "clientAddress", type: "address" },
      { indexed: true, internalType: "uint64", name: "feedbackIndex", type: "uint64" },
    ],
    name: "FeedbackRevoked",
    type: "event",
  },
] as const

// ═══════════════════════════════════════════════
// ClawTrainerNFA ABI (BAP-578)
// ═══════════════════════════════════════════════

export const CLAWTRAINER_NFA_ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "_erc8004AgentId", type: "uint256" },
      {
        components: [
          { internalType: "string", name: "persona", type: "string" },
          { internalType: "string", name: "experience", type: "string" },
          { internalType: "string", name: "voiceHash", type: "string" },
          { internalType: "string", name: "animationURI", type: "string" },
          { internalType: "string", name: "vaultURI", type: "string" },
          { internalType: "bytes32", name: "vaultHash", type: "bytes32" },
        ],
        internalType: "struct IBAP578.AgentMetadata",
        name: "meta",
        type: "tuple",
      },
      { internalType: "bytes", name: "agentSig", type: "bytes" },
    ],
    name: "activate",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "pauseAgent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "unpauseAgent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "terminate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "fundAgent",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "executeAction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "address", name: "newLogic", type: "address" },
    ],
    name: "setLogicAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getState",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "balance", type: "uint256" },
          { internalType: "uint8", name: "status", type: "uint8" },
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "address", name: "logicAddress", type: "address" },
          { internalType: "uint256", name: "lastActionTimestamp", type: "uint256" },
        ],
        internalType: "struct IBAP578.State",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getAgentMetadata",
    outputs: [
      {
        components: [
          { internalType: "string", name: "persona", type: "string" },
          { internalType: "string", name: "experience", type: "string" },
          { internalType: "string", name: "voiceHash", type: "string" },
          { internalType: "string", name: "animationURI", type: "string" },
          { internalType: "string", name: "vaultURI", type: "string" },
          { internalType: "bytes32", name: "vaultHash", type: "bytes32" },
        ],
        internalType: "struct IBAP578.AgentMetadata",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      {
        components: [
          { internalType: "string", name: "persona", type: "string" },
          { internalType: "string", name: "experience", type: "string" },
          { internalType: "string", name: "voiceHash", type: "string" },
          { internalType: "string", name: "animationURI", type: "string" },
          { internalType: "string", name: "vaultURI", type: "string" },
          { internalType: "bytes32", name: "vaultHash", type: "bytes32" },
        ],
        internalType: "struct IBAP578.AgentMetadata",
        name: "metadata",
        type: "tuple",
      },
    ],
    name: "updateAgentMetadata",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      {
        components: [
          { internalType: "bytes32", name: "previousRoot", type: "bytes32" },
          { internalType: "bytes32", name: "newRoot", type: "bytes32" },
          { internalType: "bytes32", name: "proof", type: "bytes32" },
          { internalType: "bytes32", name: "metadata", type: "bytes32" },
        ],
        internalType: "struct ILearningModule.LearningUpdate",
        name: "update",
        type: "tuple",
      },
    ],
    name: "updateLearning",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "string", name: "interactionType", type: "string" },
      { internalType: "bool", name: "success", type: "bool" },
    ],
    name: "recordInteraction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getLearningMetrics",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "totalInteractions", type: "uint256" },
          { internalType: "uint256", name: "learningEvents", type: "uint256" },
          { internalType: "uint256", name: "lastUpdateTimestamp", type: "uint256" },
          { internalType: "uint256", name: "learningVelocity", type: "uint256" },
          { internalType: "uint256", name: "confidenceScore", type: "uint256" },
        ],
        internalType: "struct ILearningModule.LearningMetrics",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getLearningRoot",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "bytes32", name: "claim", type: "bytes32" },
      { internalType: "bytes32[]", name: "proof", type: "bytes32[]" },
    ],
    name: "verifyLearning",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "isLearningEnabled",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "erc8004AgentId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "agentWallets",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getDomainSeparator",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "withdrawAgentFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
      { indexed: true, internalType: "uint256", name: "erc8004AgentId", type: "uint256" },
      { indexed: true, internalType: "address", name: "owner", type: "address" },
    ],
    name: "NFAActivated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
      { indexed: false, internalType: "uint8", name: "newStatus", type: "uint8" },
    ],
    name: "StatusChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "MetadataUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "AgentFunded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
      { indexed: false, internalType: "bytes32", name: "newRoot", type: "bytes32" },
    ],
    name: "LearningUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
      { indexed: false, internalType: "string", name: "interactionType", type: "string" },
      { indexed: false, internalType: "bool", name: "success", type: "bool" },
    ],
    name: "InteractionRecorded",
    type: "event",
  },
] as const

// ═══════════════════════════════════════════════
// Legacy ABI (backward compat for existing hooks)
// ═══════════════════════════════════════════════

/** @deprecated Use ERC8004_IDENTITY_ABI for new code */
export const IDENTITY_REGISTRY_ABI = ERC8004_IDENTITY_ABI
