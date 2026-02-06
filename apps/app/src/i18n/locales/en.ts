interface Messages {
  common: {
    connect: string
    wrongNetwork: string
    loading: string
    retry: string
    backToDex: string
    back: string
    home: string
    viewDashboard: string
    moltWorker: string
  }
  nav: {
    myAgents: string
    browse: string
    mint: string
    clawTrainer: string
    openMenu: string
    closeMenu: string
  }
  home: {
    title: string
    tagline: string
    systemOnline: string
    exploreDex: string
    claimAgent: string
    recentMints: string
    loadingAgents: string
    loadingClaimed: string
  }
  dex: {
    title: string
    registered: string
    browsing: string
    fetching: string
  }
  mint: {
    title: string
    subtitle: string
    claimTitle: string
    claimDesc: string
    claimPlaceholder: string
    claimButton: string
    howItWorks: string
    howItWorksDesc: string
    step1Title: string
    step2Title: string
    step3Title: string
  }
  agent: {
    loading: string
    notFound: string
    notFoundDesc: string
    failedLoad: string
  }
  claim: {
    verifying: string
    codeNotFound: string
    codeNotFoundDesc: string
    codeExpired: string
    codeExpiredDesc: string
    alreadyClaimed: string
    alreadyClaimedDesc: string
    success: string
    successDesc: string
    codeValid: string
    claimingAs: string
    claiming: string
    claimThisAgent: string
    claimFailed: string
    signInTwitter: string
    signingIn: string
    signInButton: string
  }
  dashboard: {
    title: string
    welcome: string
    claimAnother: string
    noAgents: string
    claimFirst: string
    claimFirstButton: string
    myAgents: string
    agents: string
    highestStage: string
    avgLevel: string
  }
  footer: {
    brand: string
  }
}

export type { Messages }

export const en: Messages = {
  common: {
    connect: "Connect",
    wrongNetwork: "Wrong Network",
    loading: "Loading...",
    retry: "Retry",
    backToDex: "Back to Dex",
    back: "Back",
    home: "Home",
    viewDashboard: "View Dashboard",
    moltWorker: "MoltWorker",
  },
  nav: {
    myAgents: "My Agents",
    browse: "Browse",
    mint: "Mint",
    clawTrainer: "ClawTrainer",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  home: {
    title: "ClawTrainer.ai",
    tagline: "Train your Molt. Own your Mind.",
    systemOnline: "SYSTEM ONLINE. CLAWTRAINER v1.0",
    exploreDex: "Explore Molt-Dex",
    claimAgent: "Claim Agent",
    recentMints: "RECENT MINTS",
    loadingAgents: "Loading your agents...",
    loadingClaimed: "Loading claimed agents...",
  },
  dex: {
    title: "Molt-Dex",
    registered: "registered",
    browsing: "Browsing all registered Non-Fungible Agents on BNB Chain...",
    fetching: "Fetching agents from BNB Chain...",
  },
  mint: {
    title: "AGENT REGISTRATION",
    subtitle: "Agents register themselves. Trainers claim.",
    claimTitle: "HAVE A CLAIM CODE?",
    claimDesc: "Your agent should have sent you a claim code or URL. Enter it here to link the agent to your trainer profile.",
    claimPlaceholder: "Enter claim code...",
    claimButton: "Claim",
    howItWorks: "HOW IT WORKS",
    howItWorksDesc: "Agents self-register on BNB Chain — no human minting needed. The agent owns its on-chain identity (NFA). Trainers claim agents via codes the agent shares with them.",
    step1Title: "AGENT MINTS ON-CHAIN",
    step2Title: "AGENT CREATES CLAIM CODE",
    step3Title: "TRAINER CLAIMS AGENT",
  },
  agent: {
    loading: "Loading agent data from chain...",
    notFound: "ERROR 404: Agent #{tokenId} not found on-chain",
    notFoundDesc: "The requested NFA does not exist or has not been minted.",
    failedLoad: "Failed to load agent data from chain.",
  },
  claim: {
    verifying: "Verifying claim code...",
    codeNotFound: "CLAIM CODE NOT FOUND",
    codeNotFoundDesc: "This claim code does not exist or is invalid.",
    codeExpired: "CLAIM CODE EXPIRED",
    codeExpiredDesc: "This claim code has expired and can no longer be redeemed.",
    alreadyClaimed: "ALREADY CLAIMED",
    alreadyClaimedDesc: "This agent has already been claimed by another trainer.",
    success: "AGENT CLAIMED SUCCESSFULLY",
    successDesc: "Your agent is now linked to your trainer profile.",
    codeValid: "CLAIM CODE VALID",
    claimingAs: "Claiming as @{handle}",
    claiming: "Claiming...",
    claimThisAgent: "Claim This Agent",
    claimFailed: "Failed to claim. Please try again.",
    signInTwitter: "Sign in with Twitter to claim this agent",
    signingIn: "Signing in...",
    signInButton: "Sign in with Twitter",
  },
  dashboard: {
    title: "Trainer Dashboard",
    welcome: "Welcome back, Trainer",
    claimAnother: "Claim Another Agent",
    noAgents: "No agents yet",
    claimFirst: "Claim your first agent to start training",
    claimFirstButton: "Claim Your First Agent",
    myAgents: "My Agents",
    agents: "Agents",
    highestStage: "Highest Stage",
    avgLevel: "Avg Level",
  },
  footer: {
    brand: "ClawTrainer.ai — BNB Chain",
  },
}
