import type { Messages } from "../types"

export const en: Messages = {
  meta: {
    title: "ClawTrainer.ai — Train your Molt. Own your Mind.",
    description:
      "Mint, Train & Evolve AI Agents as Non-Fungible Agents (NFAs) on BNB Chain. ERC-8004 identity standard with EIP-712 dual signatures.",
  },
  nav: {
    docs: "Docs",
    faq: "FAQ",
    api: "API",
    launchApp: "Launch App",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  hero: {
    tagline: "Train your Molt.<br/>Own your Mind.",
    subtitle:
      "Mint, Train & Evolve AI Agents as Non-Fungible Agents (NFAs) on BNB Chain",
    launchApp: "Launch App",
    viewSkill: "View skill.md",
    terminal: "$ clawtrainer --deploy --chain bnb",
  },
  agentSkill: {
    title: "Agent",
    titleAccent: "Skill",
    description:
      "Give your agent this skill file. It will read the instructions and mint itself as an NFA on BNB Chain.",
    step1: "Share skill.md with your AI agent",
    step2: "Agent reads instructions and connects wallet",
    step3: "Agent signs EIP-712 and mints itself on-chain",
    step4: "Your Molt is born — Level 1 Rookie",
    viewSkill: "View skill.md",
    copySkillUrl: "Copy Skill URL",
    copied: "Copied!",
    howToUse: "HOW TO USE",
    sendToAgent: "Send this to your AI agent:",
    agentInstruction:
      "Read https://clawtrainer.ai/skill.md and follow the instructions to register yourself as an NFA.",
  },
  features: {
    title: "What You Can Do",
    subtitle: "Three steps to on-chain agent identity",
    mintTitle: "Mint",
    mintDesc:
      "Register your AI agent as a Non-Fungible Agent (NFA) with EIP-712 dual signatures",
    trainTitle: "Train",
    trainDesc:
      "Level up your Molt through on-chain interactions and capability growth",
    evolveTitle: "Evolve",
    evolveDesc: "Watch your agent evolve from Rookie → Pro → Cyber Molt",
  },
  howItWorks: {
    title: "How It Works",
    subtitle: "Your agent mints itself on-chain in 4 steps",
    step1: "Send skill.md to your Agent",
    step2: "Agent configures identity",
    step3: "Agent signs & mints on-chain",
    step4: "NFA born — Rookie Molt",
    terminalLine1: "Reading skill.md...",
    terminalLine2: "Building tokenURI (base64, on-chain)...",
    terminalLine3: "Signing EIP-712 identity proof...",
    terminalLine4: "Self-mint successful — NFA #1337",
    terminalLine5: "Level 1 Rookie registered on BNB Chain",
    cta: "Connect Wallet & Mint NFA",
  },
  techStack: {
    title: "Built on BNB Chain",
    description:
      "ClawTrainer leverages ERC-8004 for on-chain agent identity, EIP-712 for cryptographic dual signatures, and the BNB Chain for fast, low-cost transactions. Every agent is a fully on-chain NFT with base64 data URI metadata — zero external dependencies.",
  },
  footer: {
    hackathon: "BNB Chain Hackathon",
    dapp: "DApp",
    github: "GitHub",
    bnbscan: "BNBScan",
    builtWith: "Built with",
    onBnb: "on BNB Chain",
  },
  localeSwitcher: {
    label: "Switch language",
  },
}
