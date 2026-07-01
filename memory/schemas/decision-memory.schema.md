# 决策记忆 Schema（Decision Memory Schema）

Decision Memory 沉淀已经做出的重要取舍，避免后续 session 重新争论已解决的问题，也让 review/audit 能追溯"为什么选了 A 而不是 B"。它只记录难逆、惊讶、真实 tradeoff 或人类明确要求保留的决策；普通小改和实现细节不进入。

## Schema

```yaml
decisions:
  - decision_id:
    decision_mode: record_decision | compare_options | accept_tradeoff | defer_decision
    decision_title:
    context:
    options_considered:
      - option:
        verdict:
        evidence:
    decision:
    rationale:
    tradeoffs:
      - dimension:
        gave_up:
        gained:
    risks:
    assumptions:
      - statement:
        review_by:
    evidence:
      - source:
        finding:
    reversal_conditions:
      - trigger:
        threshold:
        action_on_trigger:
    owners:
    follow_up:
    memory_target:
    status: active | superseded | reversed | archived
    superseded_by:
    date:
    last_reviewed_at:
```

## Field Rules

| Field | Type | Required | 写入时机 | 读取时机 | 生命周期 |
| --- | --- | --- | --- | --- | --- |
| `decision_id` | string | ✅ | 创建决策时 | 引用决策时 | 永久（即使 archived 也保留 ID） |
| `decision_mode` | enum | ✅ | 创建决策时 | review 判断决策类型时 | 永久 |
| `decision_title` | string | ✅ | 创建决策时 | 检索/列表展示 | 永久 |
| `context` | string | ✅ | 创建决策时 | 后续 session 恢复上下文 | 永久 |
| `options_considered` | object[] | ✅ | compare_options 模式必填 | review 检查是否隐藏被拒选项 | superseded 时归档 |
| `tradeoffs` | object[] | ✅ | accept_tradeoff 模式必填 | review 检查取舍是否对称 | 永久 |
| `reversal_conditions` | object[] | ✅ | 难逆决策必填 | review 判断是否触发反转 | 直到 status=reversed |
| `assumptions` | object[] | ✅ | 任何模式 | review 到期复核 | review_by 过期需重新确认 |
| `evidence` | object[] | ⚠️ | 有外部证据时 | review 判断证据充分度 | 永久 |
| `status` | enum | ✅ | 创建时默认 active | 决定是否可引用 | active→superseded→archived |
| `superseded_by` | string | ⚠️ | status=superseded 时必填 | 审计追溯 | 永久 |
| `last_reviewed_at` | date | ✅ | 每次复审 | 判断是否过期 | 滚动更新 |

## Minimum Example

```yaml
decisions:
  - decision_id: decision-ai-builder-os-8-core-skills
    decision_mode: record_decision
    decision_title: 保持 active core skills 为 8 个
    context: |
      v1.0.6 评审阶段曾出现"是否新增 builder-memory / builder-meta skill"讨论。
      约束：每新增一个 core skill 都会让 router 路由复杂度上升，并增加 context load。
    options_considered:
      - option: 新增 builder-memory 作为第 9 个 core skill
        verdict: rejected
        evidence: 新 skill 会让 router 8→9 路由分支膨胀，且 memory 治理本质是横切协议
      - option: 保持 8 skills，memory 规则下沉到 schemas + policies
        verdict: accepted
        evidence: memory/schemas/ + memory/policies/ 已能承载字段约束和生命周期
    decision: 保持 8 个 core skills；memory 通过 schema + policy 横切治理
    rationale: |
      新增 skill 必须证明能改变路由、输出、验证或 handoff 行为；
      memory 是所有 skill 共享资源，不应由单一 skill 拥有。
    tradeoffs:
      - dimension: 可发现性
        gave_up: 用户无法通过 /builder-memory 直达 memory 操作
        gained: 避免了 router 复杂度和 context load 增加
      - dimension: 一致性
        gave_up: 需在多个 skill 中引用 memory schema
        gained: memory 规则有单一事实源
    risks:
      - 若 memory schema 长期无人维护，可能漂移
    assumptions:
      - statement: 8 skills 足以覆盖 builder 工作流核心
        review_by: 2026-10-01
    evidence:
      - source: docs/source-of-truth-map.md line 30
        finding: active core skills 治理规则
      - source: references/skill-design/skill-design-playbook.zh.md
        finding: 不应因为场景多就拆成大量新 skill
    reversal_conditions:
      - trigger: 出现第 3 类无法归入现有 8 skills 的核心产物
        threshold: 连续 3 个真实任务被错误路由
        action_on_trigger: 升级为 open gap，启动 skill-hardening-brief 评审
    owners:
      - max
    follow_up:
      - 在 v1.2 评审时重新评估 8-skill 边界
    memory_target: memory/schemas/decision-memory.schema.md
    status: active
    superseded_by: null
    date: 2026-07-01
    last_reviewed_at: 2026-07-01
```

## Usage Rule

Use Decision Memory 当同一个争议第二次出现，或决策满足"难逆 / 惊讶 / 真实 tradeoff / 人类明确要求保留"任一条件。`status: superseded` 的决策必须保留（不能删除），由 `superseded_by` 指向新决策。不要把日常小改进、实现细节或未确认的猜测写入 Decision Memory。普通 review 复盘应优先进入 Evolution Note；只有稳定下来的决策才迁移到这里。
