# Grill Decision Loop

## Purpose

Grill Decision Loop 用于在生成 Feature Frame、Spec、Prototype Brief 或 Agent Task Packet 前，解析关键决策树并形成共享理解。它只输出 `grill_state`、`decision_tree`、推荐默认答案和下一步输入；不替代 `builder-frame`，也不是新的 core skill。

## Trigger

- 用户明确要求先追问、先想清楚、先不要产出完整方案。
- 用户输入仍然缺少目标用户、场景、期望结果、non-goals、成功标准或验证方式。
- 用户直接要求 spec、prototype 或 agent task，但上游 framing 不成熟。
- 一个早期选择会影响范围、成本、架构、验证、发布或后续 skill 路径。
- Router 或任一 builder skill 发现当前请求不适合继续执行，需要退回澄清。

## Entry Conditions

- 已捕获用户原始请求或 Intent Packet。
- 已读取当前 skill 的 readiness rules 或 routing rules。
- 如果存在项目材料，已优先读取用户指定范围内的 durable artifacts。
- 如果问题可从已有文档或代码中回答，先查证，不把可查事实转嫁给用户。

## Context Sources

- 用户原始请求。
- `kernel/packets/intent-packet.schema.md`。
- `kernel/routing/builder-router.zh.md`。
- 当前 skill 的 output contract 和 readiness gate。
- 相关 Feature Frame、Spec、Decision Record、Artifact Index 或 handoff。

## Steps

1. 捕获当前目标、候选下游 skill 和已知约束。
2. 识别会改变方向、范围、成本、架构、风险或验收的关键决策。
3. 把关键决策组织成 `decision_tree`，每个节点包含选项、推荐默认答案、理由和阻塞对象。
4. 一次只提出一个最高杠杆问题；如果用户不回答也可以安全推进，则明确默认假设。
5. 每轮更新 `grill_state`，区分已确定、待确认、风险、下一步资产。
6. 当足够支撑下游产物时，输出 `next_skill_input`。
7. 如果遇到业务、安全、权限、数据、发布或生产风险，停止并请求人工决策。

## Output Contract

```yaml
grill_state:
  status: in_progress | ready_for_frame | ready_for_spec | ready_for_agent_task | blocked
  confirmed:
    - item:
      evidence:
  pending:
    - question:
      blocks: frame | spec | prototype | agent_task | decision | review
      recommended_default:
      reason:
  risks:
    - risk:
      severity: P0 | P1 | P2 | P3
  next_asset:
decision_tree:
  - decision:
    options:
      - option:
        tradeoff:
    recommended_default:
    blocks:
    needs_human_decision: true | false
stable_terms:
  - term:
    meaning:
    avoid:
next_skill_input:
  target_skill:
  context:
  facts:
  assumptions:
  non_goals:
  success_criteria:
  blocking_questions:
```

## Stop Conditions

- 最高杠杆问题需要用户或业务 owner 判断。
- 缺少项目根、授权范围或 source-of-truth，无法安全查证。
- 继续追问不会改变下游产物质量。
- 已有足够信息进入 `builder-frame`、`builder-spec`、`builder-prototype` 或 `builder-agent-task`。
- 涉及生产配置、真实数据、安全、权限、合规、发布或删除行为。

## Handoff Rules

- 交给 `builder-frame` 时，保留 `decision_tree`、`stable_terms`、`recommended_defaults` 和 `blocking_questions`。
- 交给 `builder-spec` 时，必须已有用户、场景、核心能力、non-goals、成功标准和主要约束。
- 交给 `builder-agent-task` 时，必须已有验收标准、验证方式、forbidden actions 和 stop conditions。
- 交给 `builder-decision` 时，只传递真实 trade-off，不把普通偏好升级成 Decision Record。

## Budget Guard

默认最多提出三个高杠杆问题。超过三个仍无法形成共享理解时，输出 Plan 或 `blocked` 状态，而不是继续无限追问。
