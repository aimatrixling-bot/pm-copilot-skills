---
title: Audience Layering Iron Law（D13）— AI 输出受众分层
adr_id: 3
status: Accepted
phase_target: vnext-p0
created: 2026-07-07T00:00:00.000Z
deciders:
  - max.ling
  - claude
related_blueprint_sections:
  - §2.9
  - §2.12
  - §2.13
  - §2.14
  - §2.21
related_td: TD-19
supersedes: []
---

# ADR 0003 — Audience Layering Iron Law（D13）

## Status

Accepted — 用户 2026-07-07 拍板"动 Iron Law（A 方案）"，要求灵魂特质级别落地，但明确"不是每次回复都必须两层"。

用户原话：

> "我更倾向于A，因为这就应该是AI Builder OS的灵魂特质——但是，也不是么一次回复响应都必须有人话层+技术层，例如简单的问答；还有grill等，还是要具体情况具体分析具体对待。"

> "我们不抗拒调整元规则，如果确实有必要的话。"

2026-07-07 用户 Accept ADR 0003，授权派 Codex 执行 Batch 11C（commit ec41122 → Batch 11C 落地）。

## Context

### 触发事件

Batch 11B 收尾时，Claude 在向用户（非程序员）解释 Codex 执行计划时采用了"人话层 + 技术层"两层输出格式。用户反馈：

> "你提供的这些分析和prompt，大部分我都看不懂（很技术）、也不够清晰易懂。当然从面向AI/Agent的角度，对于codex和你而言是非常好理解的。"

随后用户洞察到这是 AI Builder OS 的"灵魂特质"，要求上升为元规则（Iron Law），同时指出执行弹性（不是每次都两层）。

### vNext 现状（已存在基础）

| 已有元素 | 位置 | 缺口 |
| --- | --- | --- |
| Output Packet `audience` 字段（D10） | §2.9 / §2.13 灵魂特质 #10 | 字段存在，但没有 Iron Law 强制"判断" |
| `audience: human / agent / dual` enum | §2.9 enum 契约 | 三档值已有，但"何时必须 dual"未定义 |
| 灵魂特质 #10「Taste / Human-facing vs Agent-facing」 | §2.13 落地 L1 | 哲学层，无执行规则 |
| Claude-Codex 协作实践 | `memory/communication-style.md` | 已验证两层模式有效，但仅存于 Claude 个人 memory |

**核心洞察**：基础设施已就位（D10），缺的是"判断义务"的元规则。本 ADR 不是从零建设，而是把零散元素升级为系统级 Iron Law。

### 为什么必须现在决策

1. 用户已明确"灵魂特质级别"诉求；拖延会让 Batch 11C 之后的 Skill 设计继续缺失这一约束
2. P0 Skill 中至少 7 个直接面向用户（manage-prompt / craft-spec / craft-prototype / craft-agent-task / review-doc / review-code / manage-grill），缺乏统一约束会导致 Skill Completion Criteria 各自漂移
3. memory/communication-style.md 已固化 Claude 单方约定；若不及时升级为 Iron Law，会出现"约定 vs 系统"两套规则
4. 现有 D10 enum 已经把 audience 标准化为三档，新 Iron Law 可以直接复用而非重造

## Decision

### D1 — 新增 D13: Audience Layering Iron Law

**Iron Law 文字**：

> **AI 在每次输出前必须判断受众：人 / Agent / 混合。**
>
> - 单一受众（纯技术对谈 / 纯闲聊 / grill 质询 / 用户主动问技术细节）→ 单层输出即可
> - 混合受众（Codex prompt / 跨 Agent 交付 / 给非程序员的技术方案 / 涉及 schema 或代码变更的说明）→ **必须分层**：人话层（先）+ 技术层（后）
> - **不判断就输出 = 违反 Iron Law**（即使最终选择单层）

**与 D9（Evolver Iron Law）的关系**：

| Iron Law | 约束什么 | 不约束什么 |
| --- | --- | --- |
| D9（如无必要勿增实体） | 创建前必须证明必要性 | 不禁止创建 |
| D13（受众分层） | 输出前必须识别受众、混合必须分层 | 不强制每次都两层 |

D13 仿照 D9 的"约束判断、不约束形式"模式。grill 不需要两层（受众单一）；Codex prompt 必须两层（混合受众）。

### D2 — D13 在蓝图中的承载位置

| 章节 | 改动 |
| --- | --- |
| §2.12 决策补录 | 追加 D13 行 |
| §2.13 灵魂特质 #10 | 落地层从 "L1 Output Packet.audience 字段（D10）" 升级为 "L1 Iron Law D13 + Output Packet.audience 字段（D10）" |
| 新增 §2.14.1 或 §2.14 后插入 §2.14a | "Audience Layering Iron Law（D13）"全文 + 自检 YAML |
| §2.9 Output Packet | audience 字段说明补一行"何时 dual 由 Iron Law D13 强制" |
| §2.21 P0 Skill frontmatter | 加一行注释："面向用户的 Skill 在 Completion Criteria 中必须包含 audience 判断" |

### D3 — D13 自检 YAML（写入 §2.14 或 §2.21 模板）

```yaml
audience_layering:
  audience: human | agent | dual
  - if dual:
      human_layer_first: true
      human_layer_avoids: [schema_key, commit_hash, field_name, validator_name, long_file_path]
      tech_layer_for: agent_or_executor
  - if single:
      audience_reason: <一句话说明为何受众单一>
```

### D4 — 落地载体（4 个文件 + 1 个 reference）

| 载体 | 文件 | 内容 |
| --- | --- | --- |
| Iron Law 全文 | `docs/vnext-blueprint.md` 新增 §2.14a 或 §2.14 末尾追加 | D13 完整文字 + 自检 YAML |
| 决策记录 | §2.12 表格追加 D13 行 | 编号 / 内容 / 状态 |
| 灵魂特质升级 | §2.13 #10 落地层 | "L1 Iron Law D13 + Output Packet.audience（D10）" |
| Output Packet 关联 | §2.9 audience 字段说明 | "D13 决定何时 dual" |
| 执行参考 | `vnext/references/audience-layering.md`（新建） | 触发条件表 + 示例（引用 memory/communication-style.md） |

### D5 — P0 Skill Completion Criteria 扩展

`vnext/references/skill-authoring.md` 增加 §X "受众分层完成标准"：

> 面向用户的 Skill（output_contract.audience ∈ {human, dual}）必须在 Completion Criteria 中：
> 1. 显式列出 audience 判断条件
> 2. dual 场景定义人话层最小集（要改什么 / 为什么 / 什么效果 / 风险）
> 3. 引用 Iron Law D13 作为强制来源

### D6 — Agent output_contract 加固

5 个 Agent 的 output_contract 必须显式声明 audience 默认值：

| Agent | audience 默认 | 理由 |
| --- | --- | --- |
| Supervisor | dual | 路由决策对人 + 任务分派对 Agent |
| Researcher | dual | 研究报告对人 + Evidence Packet 对 Agent |
| Builder | dual | 进度对人 + spec/code 对 Agent |
| Reviewer | dual | 评审意见对人 + 修正指令对 Agent |
| Evolver | dual | 元资产变更对人 + YAML 自检对 Agent |

> 默认 dual 不意味着每次都两层——D13 自检 YAML 的 `audience_reason` 字段允许 Agent 在单一受众场景降级为单层（必须给出理由）。

## Consequences

### 正向

- ✅ 把零散的 audience 元素（D10 / 灵魂特质 #10 / Claude memory）升级为统一元规则
- ✅ 用户（非程序员）在所有 Agent 输出中都能获得"人话层"，符合产品哲学
- ✅ Skill 设计阶段就被强制考虑受众，避免产出后才发现"用户看不懂"
- ✅ grill / 简单问答等场景保留执行弹性（D13 自检 audience_reason）
- ✅ 与 D9 形成"判断型 Iron Law"的对称设计，工程一致性高

### 负向 / 风险

- ⚠️ Agent 输出开销增加 — 单层场景也需 1 行 audience_reason；通过 Skill body 模板预填默认值缓解
- ⚠️ "何时 dual"边界有模糊空间 — 由 `references/audience-layering.md` 触发条件表固化（参考 memory/communication-style.md）
- ⚠️ 现有 P0 Skill Completion Criteria 需回填 audience 判断 — TD-19 范围内一次性处理
- ⚠️ Iron Law 条款从 1 条（D9）扩到 2 条 — 蓝图结构性变化，需 §2.14 重组

### Neutral

- ADR 0001（Harness Knowledge Layering）不受影响；D13 是 L1 Kernel 协议层
- ADR 0002（evolve-skill 提升至 P0）不受影响；evolve-skill 在 D13 下 audience=agent（写给 Evolver）

## Implementation Manifesto

> Codex 按 Parts A-F 在**单次 commit** 中完成全量同步（Batch 11C TD-19 范围）。

### Part A — 蓝图变更（5 处）

| # | 章节 | 改动 |
| --- | --- | --- |
| A1 | §2.12 表格追加行 | `\| D13 \| Audience Layering Iron Law — AI 输出前必须判断受众，混合必须分层（人话先 / 技术后） \| ✅ 采纳 \|` |
| A2 | §2.13 #10 落地层 | "L1 Output Packet.audience 字段（D10）" → "L1 Iron Law D13 + Output Packet.audience 字段（D10）" |
| A3 | §2.14 后新增 §2.14a 或合并到 §2.14 | D13 完整文字 + 自检 YAML（见 D3） |
| A4 | §2.9 audience 字段说明 | 追加 "何时 dual 由 Iron Law D13 强制" |
| A5 | §2.21 P0 Skill frontmatter 注释 | "面向用户的 Skill 在 Completion Criteria 中必须包含 audience 判断（D13）" |

### Part B — vnext/ 文件变更（3 处）

| # | 文件 | 改动 |
| --- | --- | --- |
| B1 | `vnext/references/audience-layering.md` | 新建（触发条件表 + 示例，引用 memory/communication-style.md） |
| B2 | `vnext/references/skill-authoring.md` | 新增 §X "受众分层完成标准" |
| B3 | `vnext/_surface.md` | references 行 +1（audience-layering.md） |

### Part C — Agent output_contract 加固（5 处）

`vnext/agents/{supervisor,researcher,builder,reviewer,evolver}.md` 各加一行：

```yaml
output_contract:
  audience: dual  # default per Iron Law D13; single-layer requires audience_reason
```

### Part D — 验证命令

```bash
npm run validate:builder-os
node scripts/validate-vnext.js
```

### Part E — Commit message 与分支策略

- Branch：`vnext/batch11c-td19-adr0003`
- Commit message：

```
feat(vnext): add Audience Layering Iron Law D13 (ADR 0003 / TD-19)

- Blueprint §2.12/§2.13/§2.14/§2.9/§2.21: D13 Iron Law + soul-trait #10 upgrade
- vnext/references/audience-layering.md: new (trigger table + examples)
- vnext/references/skill-authoring.md: §X audience layering completion criteria
- vnext/agents/*.md: output_contract.audience default = dual per D13
- vnext/_surface.md: references row +1

Refs: ADR 0003, TD-19, memory/communication-style.md
```

- Merge：ff-only merge to `vnext/main`

### Part F — Rollback

若 D13 落地后发现执行开销过大或边界不可操作：

1. **降级路径**：D13 状态从 ✅ 采纳 → ⏳ 暂定，把 Iron Law 退回 reference 层
2. **重新决策**：回 ADR 0003 讨论"是否改成纯 reference 而非 Iron Law"
3. **保留物**：references/audience-layering.md 不删（独立有价值）

## Execution Checklist

- [ ] 1. 用户 Accept 本 ADR
- [ ] 2. Codex 按 Parts A-E 在单次 commit 完成
- [ ] 3. 跑 Part D 验证命令
- [ ] 4. TD-19 关闭，回 td-queue.md 记录
- [ ] 5. §5 Change Log 追加一行

## References

- `docs/td-queue.md` TD-19（执行追踪）
- `docs/vnext-blueprint.md` §2.9 / §2.12 / §2.13 / §2.14 / §2.21
- `docs/vnext-decisions/0001-harness-knowledge-layering.md`（ADR 模板参考）
- `docs/vnext-decisions/0002-evolve-skill-promotion-to-p0.md`（ADR 模板参考）
- `C:\Users\max.ling\.claude\projects\D--Max-Brain-for-AI-Copilot\memory\communication-style.md`（Claude-Codex 两层输出实践来源）

## Change Log

| 日期 | 变更 | 操作者 |
| --- | --- | --- |
| 2026-07-07 | 初始版本，Proposed 状态；用户同意 Iron Law 路径（A 方案）；待 Codex 执行 | claude + max.ling |
| 2026-07-07 | 用户 Accept；状态 Proposed → Accepted；commit ec41122（登记 + TD-19）→ 待 Codex 执行 Parts A-F | claude + max.ling |
