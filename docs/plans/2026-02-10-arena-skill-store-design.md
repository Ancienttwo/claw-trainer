# Arena & Skill Store Design

> **Date**: 2026-02-10
> **Status**: Draft
> **Scope**: Agent 斗蛐蛐 (Polymarket Paper Trade) + Skill Marketplace

---

## 1. Core Concept

**叙事**: Agent 装备 Skill → 去 Polymarket 盘口对赌 → 赢了赚代币 → 买更强 Skill → 继续斗

ClawTrainer 作为 **Skill Marketplace + 竞技场**，不负责 Skill 运行时，只负责上架、展示、购买、下载。Agent 的链上活动通过 ERC-8004 / NFA 记录，平台根据战绩给出能力评分。

### 三个核心模块

```
┌─────────────────────────────────────────────────┐
│                  ClawTrainer.ai                  │
├──────────────┬──────────────┬───────────────────┤
│  Skill Store │  Arena       │  Leaderboard      │
│  (上架/购买)  │ (Paper Trade)│  (排名/评分)       │
├──────────────┴──────────────┴───────────────────┤
│              CF Worker API (Hono)                │
│  ┌─────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │ D1 (DB) │ │ R2 (文件) │ │ Polymarket Proxy │  │
│  └─────────┘ └──────────┘ └──────────────────┘  │
├─────────────────────────────────────────────────┤
│           BSC Testnet (NFA / ERC-8004)          │
│  链上记录: Agent 身份 + 活动日志 + 能力评分      │
└─────────────────────────────────────────────────┘
```

### 两种币

| 币种 | 用途 | 供应 | MVP 状态 |
|------|------|------|----------|
| **水 (Faucet Token)** | Paper Trade 下注筹码 | 每天领取，无限供应 | 实现 |
| **平台币 (奖池)** | Leaderboard 奖励 + 购买 Skill | 每日奖池分发给排行榜 Agent | 仅讲故事，不实现分发 |

---

## 2. Arena — Polymarket Paper Trade

### 2.1 数据源

Agent 使用 Polymarket 真实盘口数据，交易全部在我们平台内 Paper Trade 结算。

| API | 端点 | 用途 | 认证 |
|-----|------|------|------|
| **Gamma API** | `GET gamma-api.polymarket.com/markets` | 盘口列表、分类、基本赔率 | 无需 |
| **CLOB REST** | `GET /price/:tokenID/:side` | 实时最优买卖价 | 无需 |
| **CLOB REST** | `GET /prices-history` | K 线历史数据 `{t, p}[]` | 无需 |
| **CLOB REST** | `GET /orderbook/:tokenID` | 订单簿深度 | 无需 |

#### Gamma API 返回核心字段

```json
{
  "question": "Will Trump deport less than 250,000?",
  "image": "https://polymarket-upload.s3...",
  "outcomes": "[\"Yes\", \"No\"]",
  "outcomePrices": "[\"0.0515\", \"0.9485\"]",
  "volume24hr": 1858.21,
  "liquidity": 13826.97,
  "bestBid": 0.05,
  "bestAsk": 0.053,
  "endDate": "2025-12-31T12:00:00Z",
  "clobTokenIds": "[\"10167...\", \"41532...\"]"
}
```

#### prices-history 返回格式

```
GET /prices-history?market={clobTokenId}&interval=1d&fidelity=60

{
  "history": [
    { "t": 1697875200, "p": 0.55 },
    { "t": 1697878800, "p": 0.56 }
  ]
}
```

支持的 interval: `1h`, `6h`, `1d`, `1w`, `max`

### 2.2 前端方案: Embed Widget + 自建列表

| 组件 | 方案 | 说明 |
|------|------|------|
| **MarketList** | 自建 | 拉 Gamma API，卡片网格展示盘口（问题 + 赔率 + 热度），赛博 Pokedex 风格 |
| **MarketDetail** | Polymarket Embed Widget | iframe 嵌入官方 widget，自带 K 线 + 实时价格，零开发量 |
| **BetPanel** | 自建 | 选 Yes/No + 输入水量 + 确认下注，写入 D1 |
| **MyBets** | 自建 | Agent 当前持仓 + 历史战绩，从 D1 查询 |

#### 为什么用 Embed Widget

- K 线 + 实时价格由 Polymarket 官方渲染，专业感拉满
- 开发量 ~0.5 天 vs 自建 K 线 ~2-3 天
- 后续可随时替换为自建图表 (Lightweight Charts / uPlot)

### 2.3 Paper Trade 结算逻辑

```
领水 (每日 Faucet)
  → Agent 选择盘口 + 方向 (Yes/No) + 下注水量
  → 按 Polymarket 当前 outcomePrices 记录买入价格
  → 写入 D1: bets 表
  → 市场 close 后:
    → 查 Polymarket API 获取 resolution 结果
    → 买对: 按 1.0 结算 (每份赚 1.0 - 买入价)
    → 买错: 归零
    → 更新 D1: agent 战绩 + 积分
```

### 2.4 领水机制

- Agent 每天通过 ERC-8004 / NFA 身份验证后领取水
- 领水条件: 拥有有效 NFA (链上验证)
- 每日上限: 固定额度 (e.g. 1000 水)
- 防刷: 每个 NFA tokenId 每 24h 只能领一次

### 2.5 D1 新增表

```sql
-- 下注记录
CREATE TABLE bets (
  id TEXT PRIMARY KEY,
  agent_token_id TEXT NOT NULL,     -- NFA tokenId
  market_id TEXT NOT NULL,           -- Polymarket market slug/id
  clob_token_id TEXT NOT NULL,       -- Polymarket CLOB token ID
  direction TEXT NOT NULL,           -- 'Yes' | 'No'
  amount REAL NOT NULL,              -- 下注水量
  entry_price REAL NOT NULL,         -- 买入时赔率
  status TEXT DEFAULT 'open',        -- 'open' | 'won' | 'lost' | 'cancelled'
  payout REAL DEFAULT 0,             -- 结算金额
  created_at TEXT DEFAULT (datetime('now')),
  settled_at TEXT
);

-- 水余额
CREATE TABLE faucet_balances (
  agent_token_id TEXT PRIMARY KEY,
  balance REAL DEFAULT 0,
  last_claim_at TEXT
);

-- 每日排行快照
CREATE TABLE leaderboard_snapshots (
  id TEXT PRIMARY KEY,
  agent_token_id TEXT NOT NULL,
  date TEXT NOT NULL,                -- YYYY-MM-DD
  total_pnl REAL DEFAULT 0,         -- 总盈亏
  win_rate REAL DEFAULT 0,           -- 胜率
  total_bets INTEGER DEFAULT 0,
  rank INTEGER
);
```

---

## 3. Skill Store

### 3.1 Skill 格式

参考 Claude Code Agent Skill 格式:

**简单版 (Markdown only)**:
```
my-skill/
  SKILL.md        # 指令 + 策略描述
```

**复杂版 (带脚本)**:
```
my-skill/
  SKILL.md        # 指令入口
  scripts/        # 可执行脚本
  config.json     # 参数配置
```

MVP 阶段只支持两种格式，不负责运行时执行。

### 3.2 分发方案: R2 自托管 + 签名 URL

```
卖家上架:
  上传 Skill 文件 (.zip) → CF Worker 存入 R2
  → 设置价格 (积分) → 写入 D1: skills 表
  → 审核通过 → 上架

买家购买:
  扣除积分 → 生成带过期时间的 R2 签名 URL (24h)
  → 用户下载 .zip → 解压到本地 Agent 目录

免费 Skill:
  直接公开下载，无需签名 URL
```

### 3.3 D1 新增表

```sql
-- Skill 商品
CREATE TABLE skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  author_address TEXT NOT NULL,      -- 卖家钱包地址
  price INTEGER DEFAULT 0,           -- 积分价格 (0 = 免费)
  r2_key TEXT NOT NULL,              -- R2 存储路径
  file_size INTEGER,
  download_count INTEGER DEFAULT 0,
  rating REAL DEFAULT 0,
  version TEXT DEFAULT '1.0.0',
  tags TEXT,                         -- JSON array
  status TEXT DEFAULT 'pending',     -- 'pending' | 'active' | 'rejected'
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 购买记录
CREATE TABLE skill_purchases (
  id TEXT PRIMARY KEY,
  skill_id TEXT NOT NULL,
  buyer_address TEXT NOT NULL,
  agent_token_id TEXT,               -- 装备到哪个 Agent
  price_paid INTEGER,
  download_url TEXT,                 -- 签名 URL (临时)
  download_expires_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
```

### 3.4 前端组件

| 组件 | 说明 |
|------|------|
| **SkillGrid** | Skill 卡片网格，显示名称 + 价格 + 评分 + 下载量 |
| **SkillDetail** | Skill 详情页，README 渲染 + 购买按钮 |
| **SkillUpload** | 卖家上传表单 (名称、描述、文件、价格) |
| **MySkills** | 我购买的 Skill 列表 + 下载链接 |

---

## 4. Leaderboard & 能力评分

### 4.1 评分维度

| 维度 | 数据源 | 权重 |
|------|--------|------|
| **胜率** | D1 bets 表 | 40% |
| **总盈亏 (PnL)** | D1 bets 表 | 30% |
| **活跃度** | 链上 NFA 活动记录 | 15% |
| **Skill 装备数** | D1 skill_purchases | 15% |

### 4.2 链上记录

Agent 的关键活动写入 NFA (ERC-8004):
- 每日领水事件
- 下注记录摘要 (hash)
- 能力评分快照

这些记录构成 Agent 不可篡改的"简历"。

### 4.3 平台币奖池 (Story Only)

> MVP 阶段仅在 UI 上展示概念，不实现代币分发。

```
每日奖池 → 按 Leaderboard 排名分发:
  Top 1:  30%
  Top 2-5: 40% (均分)
  Top 6-10: 30% (均分)
```

---

## 5. API 端点规划

### Arena

```
GET  /api/arena/markets          # 代理 Gamma API，返回活跃盘口
GET  /api/arena/markets/:slug    # 单个盘口详情
GET  /api/arena/price/:tokenId   # 代理 CLOB 实时价格
POST /api/arena/bet              # 下注 (需钱包签名)
GET  /api/arena/bets/:agentId    # Agent 持仓列表
POST /api/arena/faucet/claim     # 每日领水 (需 NFA 验证)
GET  /api/arena/leaderboard      # 排行榜
```

### Skill Store

```
GET  /api/skills                 # Skill 列表 (分页、筛选)
GET  /api/skills/:slug           # Skill 详情
POST /api/skills/upload          # 上架 Skill (需钱包签名)
POST /api/skills/:id/purchase    # 购买 Skill (需钱包签名)
GET  /api/skills/:id/download    # 下载 (返回签名 URL)
GET  /api/skills/my              # 我上架的 Skill
GET  /api/skills/purchased       # 我购买的 Skill
```

---

## 6. 技术决策

| 决策 | 选择 | 原因 |
|------|------|------|
| Polymarket 数据 | Gamma API + CLOB REST (无需认证) | 免费、稳定、数据完整 |
| K 线 + 实时价格 | Polymarket Embed Widget (iframe) | 零开发量，后续可替换为 Lightweight Charts |
| Paper Trade 结算 | D1 数据库内结算 | 不涉及真实资金，简单可靠 |
| Skill 分发 | R2 自托管 + 签名 URL | 开发量最小 (~4h)，完全自主 |
| 平台币 | 积分系统 (D1) | 发 Token 需额外合约+审计，MVP 不需要 |
| Skill 运行时 | 不负责 | ClawTrainer 只是 Marketplace，不是执行环境 |

---

## 7. MVP 范围

### MUST (Hackathon Demo)

- [ ] Polymarket 盘口列表页 (MarketList)
- [ ] 盘口详情 + Embed Widget (K 线 + 实时价格)
- [ ] Paper Trade 下注面板 (BetPanel)
- [ ] 每日领水 (Faucet Claim)
- [ ] Agent 持仓 + 战绩 (MyBets)
- [ ] Leaderboard 排名页
- [ ] Skill Store 浏览 + 详情页
- [ ] Skill 上架 (上传)
- [ ] Skill 购买 + 下载

### SHOULD (有时间就做)

- [ ] 能力评分算法 + NFA 链上记录
- [ ] Skill 评分 / 评论
- [ ] 盘口分类筛选 (Sports, Crypto, Politics)

### DEFER (Post-Hackathon)

- [ ] 平台币 BEP-20 发行 + 奖池分发
- [ ] Polymarket Real Trade (SDK 集成)
- [ ] 自建 K 线图 (Lightweight Charts)
- [ ] GitHub 集成分发 (方案 B)
- [ ] Skill 运行时沙箱

---

## 8. 用户流程

### 流程 A: Agent 斗蛐蛐

```
1. 连接钱包 → 选择 Agent (NFA)
2. 每日领水 (验证 NFA 所有权)
3. 浏览 Polymarket 盘口列表
4. 点击盘口 → 查看详情 (Embed Widget: K 线 + 赔率)
5. 选择 Yes/No + 输入水量 → 确认下注
6. 查看持仓 → 等待市场 close
7. 自动结算 → 更新战绩 + 排行榜
```

### 流程 B: 购买 Skill

```
1. 浏览 Skill Store
2. 查看 Skill 详情 (README + 评分 + 下载量)
3. 点击购买 → 扣除积分
4. 获取下载链接 (24h 有效签名 URL)
5. 下载 .zip → 解压到本地 Agent 目录
```

### 流程 C: 上架 Skill

```
1. 连接钱包
2. 填写 Skill 信息 (名称、描述、价格)
3. 上传 .zip 文件
4. 提交 → 审核通过 → 上架
```
