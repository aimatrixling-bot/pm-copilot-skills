# 演进记录 Schema（Evolution Note Schema）

Evolution Note 捕获"重复失败模式 / skill 漂移信号 / 反模式观察"，并建议写回到哪个 source-of-truth。它是**临时沉淀**——`status: applied` 的 note 必须把规则迁移到对应 source；Evolution Note 本身不能作为长期规则来源。

## Schema

```yaml
evolution_notes:
  - note_id:
    date:
    area: skill | template | loop | schema | eval | kernel | routing | review_gate | memory
    scenario:
    baseline_failure:
      - failure_pattern:
        affected_user_outcome:
    observation:
    suggested_writeback:
      target_type: skill | template | loop | schema | eval | reference | validator
      target_path:
      proposed_change:
    confidence: high | medium | low
    related_eval_case:
    related_skill:
    status: open | applied | rejected | expired
    applied_to:
    reject_reason:
    last_reviewed_at:
```

## Field Rules

| Field | Type | Required | 写入时机 | 读取时机 | 生命周期 |
| --- | --- | --- | --- | --- | --- |
| `note_id` | string | ✅ | 创建 note 时 | 引用时 | 永久（即使 applied/rejected 也保留） |
| `area` | enum | ✅ | 创建时 | 分流到对应 source 维护者 | 永久 |
| `scenario` | string | ✅ | 创建时 | 评估是否触发写回 | 永久 |
| `baseline_failure` | object[] | ✅ | RED 阶段（识别失败模式） | review 判断严重度 | applied 后归档 |
| `suggested_writeback` | object | ✅ | GREEN 阶段（建议改进） | 决定写回到哪 | 直到 applied 或 rejected |
| `confidence` | enum | ✅ | 创建时 | 评估写回优先级 | 滚动更新 |
| `status` | enum | ✅ | 默认 open | 决定是否可被引用 | open→applied/rejected/expired |
| `applied_to` | string | ⚠️ | status=applied 时必填 | 审计迁移路径 | 永久 |
| `reject_reason` | string | ⚠️ | status=rejected 时必填 | 避免重复提议 | 永久 |
| `last_reviewed_at` | date | ✅ | 每次复审 | 判断是否过期 | 滚动更新 |

## Minimum Example

```yaml
evolution_notes:
  - note_id: evo-20260701-001
    date: 2026-07-01
    area: skill
    scenario: builder-decision 在 v1.0.6 评审中被识别为最薄弱节点（98 行，4 模式，质量门禁仅 5 个）
    baseline_failure:
      - failure_pattern: compare_options 模式无决策框架，agent 容易给出"看起来合理但其实无依据"的推荐
        affected_user_outcome: 用户接受了一个事后被证明错误的方案选择
      - failure_pattern: reversal_conditions 是标量字符串，无法机器检查"什么时候该反转"
        affected_user_outcome: 决策已经过期但仍在被引用
    observation: |
      缺少 MCDA / Reversibility Matrix / Cost of Delay 三个决策框架的引入；
      质量门禁未覆盖 one-way door 决策的证据门槛。
    suggested_writeback:
      target_type: skill
      target_path: skills/builder-decision/SKILL.md
      proposed_change: |
        P0.2 任务：增 MCDA + Reversibility Matrix + Cost of Delay 框架；
        reversal_conditions 升级为对象数组 {trigger, threshold, action_on_trigger}；
        质量门禁从 5 → 8（新增 Reversibility / Assumption Expiration / Evolution Writeback）。
    confidence: high
    related_eval_case: evals/output-contract/decision-record.schema.json
    related_skill: builder-decision
    status: open
    applied_to: null
    reject_reason: null
    last_reviewed_at: 2026-07-01
```

## Usage Rule

Use Evolution Note 当观察到重复失败模式、skill 漂移信号或反模式，但**还不确定**是否应升级为长期规则。`status: applied` 的 note 必须同时把规则迁移到 `suggested_writeback.target_path` 指向的 source-of-truth——Evolution Note 不能替代 source。普通一次性复盘不写 Evolution Note；只有在 2 个以上独立场景出现的模式才进入。`rejected` 的 note 保留 `reject_reason` 防止重复提议。
