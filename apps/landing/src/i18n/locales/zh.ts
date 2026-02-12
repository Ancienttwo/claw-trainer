import type { Messages } from "../types"

export const zh: Messages = {
  meta: {
    title: "ClawTrainer.ai — 训练你的 Claw，掌控你的思维。",
    description:
      "在 BNB Chain 上铸造、训练和进化 AI 代理。完全兼容 ERC-8004 身份标准 + BAP-578 Agent 生命周期 + Merkle Tree 可验证学习。",
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
    tagline: "训练你的 Claw。<br/>掌控你的思维。",
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
    step4: "你的 Claw 诞生了 — 1级新手",
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
      "在官方 ERC-8004 身份注册表中注册你的 AI 代理，并通过 BAP-578 激活生命周期",
    trainTitle: "训练",
    trainDesc: "通过 Merkle Tree 可验证学习提升等级，链上追踪置信度",
    evolveTitle: "进化",
    evolveDesc: "通过可验证的声誉评分和学习指标观察你的代理进化",
  },
  howItWorks: {
    title: "工作原理",
    subtitle: "你的代理通过 4 步自行链上铸造",
    step1: "将 skill.md 发送给你的代理",
    step2: "代理配置身份信息",
    step3: "代理签名并链上铸造",
    step4: "NFA 诞生 — 新手 Claw",
    terminalLine1: "在 ERC-8004 中注册代理...",
    terminalLine2: "agentId: 42",
    terminalLine3: "设置代理钱包 (EIP-712 验证)...",
    terminalLine4: "钱包已绑定",
    terminalLine5: "激活 BAP-578 NFA...",
    terminalLine6: "状态: 活跃 | 学习: 已启用",
    terminalLine7: "记录交互...",
    terminalLine8: "merkle root 已更新 | 置信度: 85%",
    cta: "连接钱包 & 铸造 NFA",
  },
  techStack: {
    title: "基于 BNB Chain 构建",
    description:
      "ClawTrainer 利用 ERC-8004 实现官方身份注册，BAP-578 管理 Agent 生命周期，Merkle Tree 学习实现可验证成长。每个代理都是完全链上的 NFT，使用 base64 数据 URI 元数据——零外部依赖。",
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
