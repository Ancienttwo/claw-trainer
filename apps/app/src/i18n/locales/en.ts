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
    arena: string
    skills: string
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
  arena: {
    title: string
    subtitle: string
    fetching: string
    noMarkets: string
    volume: string
    liquidity: string
    endsAt: string
    yes: string
    no: string
    placeBet: string
    placing: string
    amount: string
    balance: string
    claimFaucet: string
    claiming: string
    cooldown: string
    myBets: string
    noBets: string
    direction: string
    entryPrice: string
    status: string
    pnl: string
    leaderboard: string
    rank: string
    agent: string
    totalPnl: string
    winRate: string
    totalBets: string
    noData: string
    selectAgent: string
    insufficientBalance: string
    betSuccess: string
    faucetSuccess: string
    marketDetail: string
  }
  skills: {
    title: string
    subtitle: string
    fetching: string
    noSkills: string
    free: string
    pts: string
    downloads: string
    by: string
    purchase: string
    purchasing: string
    download: string
    uploading: string
    uploadSkill: string
    name: string
    description: string
    price: string
    tags: string
    file: string
    version: string
    mySkills: string
    purchased: string
    alreadyPurchased: string
    purchaseSuccess: string
    uploadSuccess: string
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
    arena: "Arena",
    skills: "Skills",
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
  arena: {
    title: "Arena",
    subtitle: "Equip your Agent with Skills. Battle on real Polymarket markets.",
    fetching: "Loading markets from Polymarket...",
    noMarkets: "No active markets found.",
    volume: "24h Vol",
    liquidity: "Liquidity",
    endsAt: "Ends",
    yes: "YES",
    no: "NO",
    placeBet: "Place Bet",
    placing: "Placing...",
    amount: "Amount",
    balance: "Balance",
    claimFaucet: "Claim 1000 pts",
    claiming: "Claiming...",
    cooldown: "Cooldown: claim again in {hours}h",
    myBets: "My Bets",
    noBets: "No bets yet. Pick a market and start trading!",
    direction: "Direction",
    entryPrice: "Entry",
    status: "Status",
    pnl: "PnL",
    leaderboard: "Leaderboard",
    rank: "Rank",
    agent: "Agent",
    totalPnl: "Total PnL",
    winRate: "Win Rate",
    totalBets: "Bets",
    noData: "No leaderboard data yet.",
    selectAgent: "Select Agent",
    insufficientBalance: "Insufficient balance",
    betSuccess: "Bet placed successfully!",
    faucetSuccess: "Claimed 1000 pts!",
    marketDetail: "Market Detail",
  },
  skills: {
    title: "Skill Store",
    subtitle: "Browse, purchase, and equip Skills for your Agents.",
    fetching: "Loading skills...",
    noSkills: "No skills available yet.",
    free: "FREE",
    pts: "pts",
    downloads: "downloads",
    by: "by",
    purchase: "Purchase",
    purchasing: "Purchasing...",
    download: "Download",
    uploading: "Uploading...",
    uploadSkill: "Upload Skill",
    name: "Name",
    description: "Description",
    price: "Price",
    tags: "Tags",
    file: "File (.zip)",
    version: "Version",
    mySkills: "My Skills",
    purchased: "Purchased",
    alreadyPurchased: "Already purchased",
    purchaseSuccess: "Skill purchased!",
    uploadSuccess: "Skill uploaded!",
  },
  footer: {
    brand: "ClawTrainer.ai — BNB Chain",
  },
}
