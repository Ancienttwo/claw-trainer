import type { Messages } from "../types"

export const zh: Messages = {
  meta: {
    title: "ClawTrainer.ai — 训练你的 Molt，掌控你的思维。",
    description:
      "在 BNB Chain 上铸造、训练和进化 AI 代理为非同质化代理 (NFA)。ERC-8004 身份标准 + EIP-712 双重签名。",
  },
  nav: {
    docs: "文档",
    faq: "常见问题",
    api: "API",
    launchApp: "启动应用",
    openMenu: "打开菜单",
    closeMenu: "关闭菜单",
  },
  hero: {
    tagline: "训练你的 Molt。<br/>掌控你的思维。",
    subtitle:
      "在 BNB Chain 上铸造、训练和进化 AI 代理为非同质化代理 (NFA)",
    launchApp: "启动应用",
    viewSkill: "查看 skill.md",
    terminal: "$ clawtrainer --deploy --chain bnb",
  },
  agentSkill: {
    title: "代理",
    titleAccent: "技能",
    description:
      "将此技能文件发送给你的 AI 代理。它会阅读指令并在 BNB Chain 上自行铸造 NFA。",
    step1: "将 skill.md 分享给你的 AI 代理",
    step2: "代理阅读指令并连接钱包",
    step3: "代理签署 EIP-712 并自行链上铸造",
    step4: "你的 Molt 诞生了 — 1级新手",
    viewSkill: "查看 skill.md",
    copySkillUrl: "复制技能链接",
    copied: "已复制！",
    howToUse: "使用方法",
    sendToAgent: "发送给你的 AI 代理：",
    agentInstruction:
      "阅读 https://clawtrainer.ai/skill.md 并按照指示将自己注册为 NFA。",
  },
  features: {
    title: "你可以做什么",
    subtitle: "三步实现链上代理身份",
    mintTitle: "铸造",
    mintDesc:
      "使用 EIP-712 双重签名将你的 AI 代理注册为非同质化代理 (NFA)",
    trainTitle: "训练",
    trainDesc: "通过链上交互和能力增长提升你的 Molt 等级",
    evolveTitle: "进化",
    evolveDesc: "观看你的代理从 新手 → 专业 → 赛博 Molt 进化",
  },
  howItWorks: {
    title: "工作原理",
    subtitle: "你的代理通过 4 步自行链上铸造",
    step1: "将 skill.md 发送给你的代理",
    step2: "代理配置身份信息",
    step3: "代理签名并链上铸造",
    step4: "NFA 诞生 — 新手 Molt",
    terminalLine1: "正在读取 skill.md...",
    terminalLine2: "正在构建 tokenURI (base64, 链上)...",
    terminalLine3: "正在签署 EIP-712 身份证明...",
    terminalLine4: "自铸造成功 — NFA #1337",
    terminalLine5: "1级新手已在 BNB Chain 上注册",
    cta: "连接钱包 & 铸造 NFA",
  },
  techStack: {
    title: "基于 BNB Chain 构建",
    description:
      "ClawTrainer 利用 ERC-8004 实现链上代理身份，EIP-712 实现加密双重签名，BNB Chain 提供快速低成本交易。每个代理都是完全链上的 NFT，使用 base64 数据 URI 元数据——零外部依赖。",
  },
  footer: {
    hackathon: "BNB Chain 黑客松",
    dapp: "应用",
    github: "GitHub",
    bnbscan: "BNBScan",
    builtWith: "用",
    onBnb: "构建于 BNB Chain",
  },
  localeSwitcher: {
    label: "切换语言",
  },
}
