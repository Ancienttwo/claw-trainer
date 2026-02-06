# ClawTrainer.ai Technical Implementation Guide (V1)

## 1. 核心协议集成 (Protocol Integration)

### 1.1 ERC-8004 身份锚定 (Identity Anchoring)
ClawTrainer 的核心是将 OpenClaw 的 `agent.json` 映射为链上 NFA (Non-Fungible Agent)。

- **Identity Registry**: `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432` (BSC Mainnet)
- **Mapping Logic**:
    - `agentId` (NFT TokenID) = `keccak256(agent_name + owner_address)`
    - `tokenURI` = 指向去中心化存储 (IPFS/Arweave) 的 `service-manifest.json`。
    - **Service Manifest 结构**:
      ```json
      {
        "name": "Flash",
        "version": "1.0.0",
        "capabilities": ["discord-management", "market-analysis"],
        "wallet": "0xAgentWalletAddress...",
        "owner_signature": "EIP-712 proof"
      }
      ```

### 1.2 Reputation Registry 信誉同步
- **Registry**: `0x8004BAa17C55a88189AE136b182e5fdA19dE9b63`
- **Data Source**: Moltbook 交互数据 + Discord 运营战绩。
- **Sync Flow**:
    1. **OpenClaw Logger**: 拦截所有 `message.send` 与 `message.react`。
    2. **Score Calculator**: 根据回复权重（如：Master 的 Reaction、活跃用户引用）计算 `exp`。
    3. **Periodic Commit**: 每 24 小时通过 `ClawTrainer-Oracle` (Sub-agent) 将评分摘要提交至链上。

## 2. 系统架构 (System Architecture)

### 2.1 Multi-Agent 协同流
- **Flash (Chief of Staff)**: 负责全局调度与 NFA 状态监控。
- **Victor (CSO)**: 负责执行具体的 ClawTrainer 业务逻辑（如：解析 BAP 标准、生成 PRD）。
- **Adam (COO)**: 监控 Discord 实战频道，抓取 Reputation 原始数据。

### 2.2 降临模式 (Intervention Mode) 实现
- **WebSocket Gateway**: 实现 Trainer 后台与 OpenClaw Runtime 的实时双向通信。
- **Action Pattern**:
    - `INTERVENE`: 暂停 Agent 自主回复，进入队列等待。
    - `OVERRIDE`: Trainer 输入文本，由 Agent 以自身身份发出，并标记为 "Trainer-Assisted"。
    - `RESUME`: 恢复 Agent 自主运行模式。

## 3. BAP 标准应用 (BNB Application Proposals)

### 3.1 BAP-578 (Agent-to-Agent Interoperability)
- **Implementation**: 实现 `call_agent(target_id, task)` 接口。
- **Security**: 所有 A2A 调用需经过 `PermissionRegistry` 校验（Safe/Ask/Auto 模式）。

## 4. 部署与测试路径 (Feb 2026)

1. **Local Sandbox**: 在 OpenClaw 模拟环境测试 ERC-8004 合约交互脚本。
2. **Testnet Launch (Feb 10)**: 部署 MVP 合约至 BSC Testnet，完成首批 "Rookie Molt" 铸造。
3. **Moltbook Sync**: 对接 Moltbook API，验证 `Reputation` 数据流闭环。

---
**Technical Implementation drafted by Victor ⚡ on 2026-02-06.**
