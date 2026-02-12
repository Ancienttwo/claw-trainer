# ERC-8004 & NFA 生态调研报告

> 调研日期: 2026-02-13 | 适用: ClawTrainer.ai (BNB Hackathon, DDL: Feb 19)

---

## 一、ERC-8004: Trustless Agents 标准

### 1.1 基本信息

| 属性 | 值 |
|------|-----|
| **状态** | Draft (Standards Track: ERC) |
| **创建日期** | 2025-08-13 |
| **主网上线** | 2026-01-29 (Ethereum Mainnet) |
| **作者** | Marco De Rossi (MetaMask), Davide Crapis (EF), Jordan Ellis (Google), Erik Reppel (Coinbase) |
| **依赖** | EIP-155, EIP-712, EIP-721, EIP-1271 |
| **注册量** | 已超过 24,000+ agents |
| **部署** | 15+ EVM 链 (ETH, BSC, Arbitrum, Optimism, Polygon, Base, Linea 等) |

### 1.2 三大注册表架构

ERC-8004 定义了三个轻量级链上注册表，构成 Agent 信任层：

#### (1) Identity Registry — 身份注册表
- 基于 **ERC-721 + URIStorage** — 每个 Agent 是一个 NFT
- Agent 全局标识符格式: `eip155:{chainId}:{registryAddress}:{agentId}`
- 注册文件 (JSON) 包含: name, description, image, services[], x402Support, active, supportedTrust[]
- 支持 **Agent Wallet** 绑定 (EIP-712 签名验证)
- 支持 **Metadata** 键值对存储
- 可选: `.well-known/agent-registration.json` 域名验证

```solidity
// 核心函数
function register(string agentURI, MetadataEntry[] metadata) → uint256 agentId
function setAgentURI(uint256 agentId, string newURI)
function setAgentWallet(uint256 agentId, address newWallet, uint256 deadline, bytes signature)
function setMetadata(uint256 agentId, string key, bytes value)
```

#### (2) Reputation Registry — 声誉注册表
- 标准化反馈接口：int128 评分 + 标签分类
- 防自评：调用者不能是 agent owner/operator
- 支持链上汇总 + 链下高级算法

```solidity
function giveFeedback(agentId, value, valueDecimals, tag1, tag2, endpoint, feedbackURI, feedbackHash)
function getSummary(agentId, clientAddresses, tag1, tag2) → (count, summaryValue, decimals)
function revokeFeedback(agentId, feedbackIndex)
function appendResponse(agentId, clientAddress, feedbackIndex, responseURI, responseHash)
```

**标准化标签体系:**
| tag1 | 含义 | 示例值 |
|------|------|--------|
| `starred` | 质量评分 (0-100) | 87 |
| `reachable` | 端点可达 (0/1) | 1 |
| `uptime` | 正常运行率 | 9977 (99.77%) |
| `successRate` | 任务成功率 | 89 |
| `responseTime` | 响应时间(ms) | 560 |

#### (3) Validation Registry — 验证注册表
- 通用 hook：agent 请求验证 → validator 合约返回结果
- 验证方式: stake 重执行 / zkML 证明 / TEE oracle / 可信评审
- response 值 0-100 (二元判定或连续评分)

```solidity
function validationRequest(validatorAddress, agentId, requestURI, requestHash)
function validationResponse(requestHash, response, responseURI, responseHash, tag)
function getValidationStatus(requestHash) → (validator, agentId, response, hash, tag, lastUpdate)
```

### 1.3 BSC 部署地址

| 网络 | IdentityRegistry | ReputationRegistry |
|------|------------------|-------------------|
| **BSC Mainnet** | `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432` | `0x8004BAa17C55a88189AE136b182e5fdA19dE9b63` |
| **BSC Testnet** | `0x8004A818BFB912233c491871b3d84c89A494BD9e` | `0x8004B663056A597Dffe9eCcC1965A193B7388713` |

### 1.4 协议互操作性

ERC-8004 与以下协议组合形成 "Agentic Web" 基础设施栈：

| 协议 | 职责 | 关系 |
|------|------|------|
| **MCP** (Model Context Protocol) | 能力发现 (prompts/resources/tools) | Identity 记录可链接 MCP endpoint |
| **A2A** (Agent-to-Agent, Google) | 任务编排、Agent 间通信 | ERC-8004 是 A2A 的链上信任扩展 |
| **x402** (Coinbase) | HTTP 原生 Agent 支付 | ERC-8004 提供支付身份验证层 |
| **EIP-712** | 类型化签名 | Agent 钱包签名验证 |
| **EIP-1271** | 合约签名 | 智能合约 Agent 验证 |

### 1.5 v2 开发方向

- 更深的 MCP 支持 (超越 A2A 兼容性)
- 更灵活的链上声誉数据存储 (智能合约组合性)
- 更清晰的 x402 集成 (标准化支付证明格式)

---

## 二、BAP-578: Non-Fungible Agent (NFA) 标准

### 2.1 基本信息

| 属性 | 值 |
|------|-----|
| **状态** | Draft |
| **创建日期** | 2025-05-27 |
| **提出者** | ChatAndBuild |
| **网络** | BNB Chain 专用 |
| **定位** | ERC-721 的 Agent 扩展 |

### 2.2 核心特性

BAP-578 在 ERC-721 基础上增加了 Agent 生命周期管理：

**Agent 状态机:** Active → Paused → Terminated

**双路径架构:**
1. **JSON Light Memory** (默认) — 简单静态 Agent，基本元数据存储
2. **Merkle Tree Learning** (可选) — 高级学习 Agent，链上 Merkle root 证明

**混合存储架构:**

| 链上 (On-Chain) | 链下 (Off-Chain / Vault) |
|-----------------|------------------------|
| Agent 身份和所有权 | 扩展记忆和交互历史 |
| 权限配置 | 完整学习树结构 |
| 关键元数据 | 媒体资产 (语音、动画) |
| Logic 合约引用 | 复杂 AI 行为数据 |
| Merkle root (32 bytes) | 详细学习数据 |

**核心元数据:**
- `persona`: JSON 编码的角色属性
- `experience`: Agent 角色/用途摘要
- `voiceHash`: 音频配置引用
- `animationURI`: 头像/动画位置
- `vaultURI` + `vaultHash`: 扩展数据存储

### 2.3 与 ERC-8004 的关系

| 维度 | ERC-8004 | BAP-578 |
|------|----------|---------|
| **范围** | 跨链通用标准 | BNB Chain 专用 |
| **核心** | 信任层 (Identity + Reputation + Validation) | Agent 生命周期 (学习 + 执行 + 资产管理) |
| **NFT 基础** | ERC-721 + URIStorage | ERC-721 + Agent 扩展 |
| **学习能力** | 不涉及 | Merkle Tree 可验证学习 |
| **支付** | x402 集成 | Agent 自有 BNB 余额 |
| **执行** | 不涉及 | Logic 合约委托执行 |
| **互补性** | 提供发现和信任 | 提供运行时能力 |

**结论:** ERC-8004 和 BAP-578 是**互补**的。ERC-8004 解决 "谁是这个 Agent、能不能信"，BAP-578 解决 "Agent 能做什么、怎么进化"。

---

## 三、BNB Chain Agent 生态

### 3.1 BNB Chain 的 ERC-8004 支持

- **2026-02-04 官方宣布**: BNB Chain 正式支持 ERC-8004
- BSC Mainnet + Testnet 均已部署官方注册表合约
- 利用 BSC 低 Gas 费优势 — 机器间频繁小额交互经济可行
- 定位为 "早期 Agent 系统枢纽"

### 3.2 关键生态项目

| 项目 | 类型 | 相关性 |
|------|------|--------|
| **ChatAndBuild** | NFA 平台 (BAP-578 发起者) | 直接竞品/参考 — Agent 构建+交易+管理 |
| **NFA.xyz** | NFA 市场 | Agent 市场参考 |
| **Phala Network** | TEE Agent 执行 | TEE 验证集成参考 |
| **Vistara Labs** | Agent Arena SDK | 实现框架参考 |
| **Praxis Protocol** | Python/Go SDK | SDK 设计参考 |
| **Ch40s Chain** | 参考实现 + Genesis Studio | 全栈参考 |

### 3.3 生态 SDK/工具

| 名称 | 语言 | 用途 |
|------|------|------|
| `erc-8004-js` | JS/TS | 轻量级 ERC-8004 交互 |
| `erc-8004-py` | Python | Python 实现 |
| `chaoschain-sdk` | Python/JS | 全功能 + 治理 |
| `erc8004-cairo` | Cairo | Starknet 实现 |
| `erc-8004-contracts` | Solidity | 官方参考合约 |
| `awesome-erc8004` | 资源集 | 生态全景 |

---

## 四、ClawTrainer 现状 vs ERC-8004 规范 Gap 分析

### 4.1 当前实现概况

ClawTrainer 的 `IdentityRegistry.sol` 是一个**自定义 ERC-8004 profile**:

| 特性 | 实现 | 状态 |
|------|------|------|
| ERC-721 NFT 身份 | 自研合约 | ✅ |
| EIP-712 Agent 签名 | 双签名 (trainer + agent) | ✅ |
| 确定性 tokenId | keccak256(name + owner) | ✅ |
| Agent Wallet 绑定 | 1:1 mapping | ✅ |
| Soul-bound (不可转让) | _update() 重写 | ✅ (自定义增强) |
| Agent 等级系统 | agentLevels mapping | ✅ (自定义增强) |
| On-chain 元数据 | base64 data URI (Nouns 模式) | ✅ |
| 事件索引器 | CF Worker + D1 | ✅ |
| 前端集成 | API-first + 链上 fallback | ✅ |
| 测试 | 30 tests, 100% coverage | ✅ |

**部署:** BSC Testnet `0x93EdC70ADEF0aBde3906D774bEe95D90a959012a`

### 4.2 与官方 ERC-8004 的差异

| ERC-8004 Feature | ClawTrainer 现状 | Gap |
|------------------|-----------------|-----|
| 标准 register() 接口 | 自研 mint() 带 EIP-712 | 接口不同但功能覆盖 |
| Agent URI (外部 URL) | On-chain base64 data URI | 设计选择 (更去中心化) |
| Metadata KV 存储 | 无 (全在 URI 里) | 可扩展但非必需 |
| Agent Wallet (EIP-712) | ✅ 实现 | 对齐 |
| **Reputation Registry** | ❌ 未实现 | **最大 Gap** |
| **Validation Registry** | ❌ 未实现 | 可 DEFER |
| 跨链标识符格式 | 未采用 | 可标注兼容 |
| `.well-known` 域名验证 | 未实现 | Agent 无独立域名 |

### 4.3 与 BAP-578 的差异

| BAP-578 Feature | ClawTrainer 现状 | Gap |
|-----------------|-----------------|-----|
| Agent 状态机 (Active/Paused/Terminated) | 仅 pause 合约级 | 单个 Agent 无状态切换 |
| Logic 合约委托 | 无 | 不在 MVP 范围 |
| Merkle Tree 学习 | 无 | DEFER (v2 考虑) |
| Agent 自有 BNB 余额 | 无 | 不在 MVP 范围 |
| Vault URI + Hash | 无 | 可扩展 |

---

## 五、Hackathon 评估与建议

### 5.1 对 BNB Hackathon 的战略意义

1. **BNB Chain 刚于 2/4 官宣 ERC-8004** — 评委必然关注此标准的应用
2. ClawTrainer 已经是 BSC 上的 ERC-8004 实现者 — 先发优势
3. 竞品 ChatAndBuild 走 BAP-578 路线 — ClawTrainer 可以走 "ERC-8004 + 自定义增强" 差异化路线

### 5.2 MVP 优先级建议

#### MUST (Hackathon DDL 前)
- **现有 Identity 合约已足够** — 不需要迁移到官方 ERC-8004 注册表
- **在叙事和文档中明确标注 ERC-8004 兼容性** — 评委关心标准合规
- **完善 NFA Mint Flow + Molt-Dex + Molt Card** — 这些才是 MVP 核心

#### NICE-TO-HAVE (如有余力)
- 对接官方 BSC Testnet ReputationRegistry (`0x8004B663...`) — 给 Agent 添加链上声誉
- 在 Agent Card 上显示 ERC-8004 标准化标签 (starred, uptime, successRate)

#### DEFER (赛后)
- Validation Registry 集成
- BAP-578 学习模块
- 跨链 Agent 标识符
- x402 支付集成
- MCP endpoint 注册

### 5.3 叙事建议 (Pitch Deck)

ClawTrainer 的独特价值主张：

> "BNB Chain 上首个 ERC-8004 原生 Agent Marketplace — 融合链上身份、EIP-712 双签名准入、Nouns 式完全链上元数据，打造 Agent 经济的 Pokédex"

差异化要点：
1. **ERC-8004 原生** (vs ChatAndBuild 的 BAP-578 路线)
2. **Soul-bound NFA** — Agent 身份不可转让，强化信任
3. **完全链上元数据** — 零 IPFS 依赖
4. **双签名准入** — Agent 必须同意被训练师注册

---

## 六、参考资源

### 标准文档
- [EIP-8004 官方规范](https://eips.ethereum.org/EIPS/eip-8004)
- [BAP-578 规范](https://github.com/bnb-chain/BEPs/blob/master/BAPs/BAP-578.md)
- [ERC-8004 官方合约](https://github.com/erc-8004/erc-8004-contracts)

### BNB Chain
- [BNB Chain ERC-8004 博客](https://www.bnbchain.org/en/blog/making-agent-identity-practical-with-erc-8004-on-bnb-chain)
- [BNB Chain 官宣 (Chainwire)](https://chainwire.org/2026/02/04/bnb-chain-announces-support-for-erc-8004-to-enable-verifiable-identity-for-autonomous-ai-agents/)

### 生态
- [Awesome ERC-8004](https://github.com/sudeepb02/awesome-erc8004)
- [ChatAndBuild NFA 参考实现](https://github.com/ChatAndBuild/non-fungible-agents-BAP-578)
- [NFA 白皮书 (PDF)](https://cdn.chatandbuild.com/official-docs/NFAWhitepaper2025.pdf)

### 深度分析
- [ERC-8004: A Trustless Extension of A2A (Medium)](https://medium.com/coinmonks/erc-8004-a-trustless-extension-of-googles-a2a-protocol-for-on-chain-agents-b474cc422c9a)
- [MCP, A2A, x402 & ERC-8004 全景 (PayRam)](https://payram.com/blog/mcp-a2a-ap2-acp-x402-erc-8004)
- [ERC-8004 + x402 基础设施 (SmartContracts Tools)](https://www.smartcontracts.tools/blog/erc8004-x402-infrastructure-for-autonomous-ai-agents/)
- [Polygon ERC-8004 集成文档](https://docs.polygon.technology/payment-services/agentic-payments/agent-integration/erc8004/)
- [CoinDesk 报道](https://www.coindesk.com/markets/2026/01/28/ethereum-s-erc-8004-aims-to-put-identity-and-trust-behind-ai-agents)
