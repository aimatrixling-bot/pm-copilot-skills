# Artifact Index Schema

Artifact Index 记录项目中可复用资产的身份、状态、来源、依赖、证据和保留策略。它不是全文知识库；原始文件仍保存在各自目录，索引用于让后续 session 和下游 skill 知道哪些资产可信、可复用、需审查或可清理。

## Schema

```yaml
artifacts:
  - artifact_id:
    artifact_type: feature_frame | spec | prototype | agent_task | review_report | decision_record | code | script | html | evidence | analysis | temp
    title:
    path:
    status: draft | working | current | superseded | deprecated | archived | temp
    owner_project:
    created_at:
    updated_at:
    created_by_skill:
    source_run_id:
    source_request:
    derived_from:
      - artifact_id:
    supersedes:
      - artifact_id:
    depends_on:
      - artifact_id:
    decision_refs:
      - decision_id:
    evidence_refs:
      - evidence_id:
    key_decisions:
      - summary:
    retention_policy: keep | archive | expire | cleanup_candidate
    retention_reason:
    last_verified_at:
    consistency_status: pass | partial | failed | unchecked
    open_risks:
      - risk:
    next_action:
    next_skill_hint:
```

## Field Rules

| Field | Rule |
| --- | --- |
| `artifact_id` | 项目内稳定唯一 ID，建议包含类型和日期，例如 `spec-20260618-001`。 |
| `artifact_type` | 必须说明资产形态；临时过程材料使用 `temp` 或 `analysis`，不要伪装成正式产物。 |
| `path` | 指向真实文件路径；路径失效时一致性审计必须标记为 `failed`。 |
| `status` | 生命周期状态，定义见 `memory/policies/artifact-lifecycle-policy.zh.md`。 |
| `derived_from` | 记录来源资产，保证 Spec、Prototype、Agent Task、Evidence 可追溯。 |
| `supersedes` | 记录本资产替代了哪些旧资产；被替代资产通常转为 `superseded`。 |
| `depends_on` | 记录当前资产依赖的其他资产；被依赖资产不能自动清理。 |
| `decision_refs` | 关联 Decision Memory 中的关键决策。 |
| `evidence_refs` | 关联 Evidence Packet 或验证记录。 |
| `retention_policy` | 说明保留策略；清理规则见 `artifact-cleanup-policy.zh.md`。 |
| `consistency_status` | 最近一次一致性审计结果。 |

## Minimum Example

```yaml
artifacts:
  - artifact_id: spec-20260618-001
    artifact_type: spec
    title: Artifact Governance 最小协议
    path: memory/schemas/artifact-index.schema.md
    status: current
    owner_project: ai-builder-os
    created_at: 2026-06-18
    updated_at: 2026-06-18
    created_by_skill: manual-goal
    source_run_id: goal-artifact-governance-minimum
    source_request: 为 AI Builder OS 增加资产治理文档协议最小版
    derived_from: []
    supersedes: []
    depends_on:
      - decision-ai-builder-os-8-core-skills
    decision_refs:
      - decision-ai-builder-os-8-core-skills
    evidence_refs: []
    key_decisions:
      - summary: Artifact Governance 是横切协议，不新增第 9 个核心 skill。
    retention_policy: keep
    retention_reason: current schema 是后续资产登记的可信入口。
    last_verified_at: 2026-06-18
    consistency_status: pass
    open_risks:
      - risk: 尚未接入 eval case 和自动校验。
    next_action: 在 Milestone 2 接入 Harness / Loop / Eval。
    next_skill_hint: builder-review
```

## Usage Rule

Use the index to know what can be reused, what must be reviewed before reuse, what has been superseded, and what can enter a cleanup proposal. Do not use it to silently delete files.
