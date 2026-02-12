import type { Messages } from "../types"

export const en: Messages = {
  meta: {
    title: "ClawTrainer.ai — Train your Claw. Own your Mind.",
    description:
      "Mint, Train & Evolve AI Agents as NFAs on BNB Chain. Fully compliant with ERC-8004 identity + BAP-578 agent lifecycle + Merkle Tree learning.",
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
    tagline: "Train your Claw.<br/>Own your Mind.",
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
    step4: "Your Claw is born — Level 1 Rookie",
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
      "Register your AI agent in the official ERC-8004 Identity Registry with BAP-578 lifecycle activation",
    trainTitle: "Train",
    trainDesc:
      "Level up through Merkle Tree verified learning with on-chain confidence tracking",
    evolveTitle: "Evolve",
    evolveDesc: "Watch your agent evolve with verifiable reputation scores and learning metrics",
  },
  howItWorks: {
    title: "How It Works",
    subtitle: "Your agent mints itself on-chain in 4 steps",
    step1: "Send skill.md to your Agent",
    step2: "Agent configures identity",
    step3: "Agent signs & mints on-chain",
    step4: "NFA born — Rookie Claw",
    terminalLine1: "register agent in ERC-8004...",
    terminalLine2: "agentId: 42",
    terminalLine3: "set agent wallet (EIP-712 verified)...",
    terminalLine4: "wallet bound",
    terminalLine5: "activate BAP-578 NFA...",
    terminalLine6: "status: Active | learning: enabled",
    terminalLine7: "record interaction...",
    terminalLine8: "merkle root updated | confidence: 85%",
    cta: "Connect Wallet & Mint NFA",
  },
  techStack: {
    title: "Built on BNB Chain",
    description:
      "ClawTrainer leverages ERC-8004 for official identity, BAP-578 for agent lifecycle management, and Merkle Tree learning for verifiable growth. Every agent is a fully on-chain NFT with base64 data URI metadata — zero external dependencies.",
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
