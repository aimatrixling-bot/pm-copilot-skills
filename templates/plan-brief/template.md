---
template_name: plan-brief
schema_version: 0.1.0
purpose: |
  builder-plan-goal 的标准产物。把"用户的目标 + 当前已知信息"冻结成一个
  可交接给 builder-spec / builder-agent-task / builder-prototype 的最小契约，
  防止 Plan/Goal 路由输出漂移。
---

# Plan Brief Template

> 这是模板，不是事实源。字段定义以 `kernel/packets/plan-brief.schema.md`（如存在）为准。
> 在每个占位符处填入真实内容；不要保留 `[...]` 标记。

---

## Frontmatter（写入产物的元数据）

```yaml
---
plan_id: <kebab-case-id>
created_at: <YYYY-MM-DD>
author: <name>
delivery_mode: create | improve | reframe | unknown
handoff_target: builder-spec | builder-agent-task | builder-prototype
recommended_mode: prompt | plan | goal | plan_to_goal
---
```

---

## 字段表

| 字段 | 类型 | 必填 | 写入时机 | 读取时机 | 生命周期 |
|---|---|---|---|---|---|
| `plan_summary` | string (1-3 句) | ✅ | Plan Brief 创建时 | 下游 skill 接收时 | 一次性 |
| `goal_statement` | string (1 句) | ✅ | Plan Brief 创建时 | 下游 skill + review | 持续到目标达成或废弃 |
| `non_goals` | string[] | ✅ | Plan Brief 创建时 | 下游 skill + review | 持续 |
| `assumptions` | object[] `{id, assumption, confidence, invalidation}` | ✅ | 创建时 | 下游 skill | 持续到验证完成 |
| `success_metrics` | object[] `{type: leading\|lagging, metric, target, measurement}` | ✅ | 创建时 | 下游 skill + review | 持续到 review 完成 |
| `decision_points` | object[] `{point, options, owner, needed_by}` | ⚠️ 条件必填（plan_to_goal 模式） | 创建或迭代时 | 下游 skill | 持续到决策完成 |
| `handoff_target` | enum | ✅ | 创建时 | 下游 skill 路由 | 一次性 |
| `revisit_trigger` | string[] | ✅ | 创建时 | review | 持续 |
| `verification_plan` | object `{minimum_checks, observable_evidence, cannot_claim_done_without}` | ✅ | 创建时 | 下游 skill + review | 持续 |
| `slice_strategy` | enum `vertical_slice \| tracer_bullet \| horizontal_layer \| investigation_only` | ✅ | 创建时 | 下游 skill | 一次性 |
| `delegation_mode` | enum `afk_ready \| hitl_checkpoint_required \| blocked` | ✅ | 创建时 | 下游 skill | 一次性 |
| `open_questions` | string[] | ⚠️ 条件必填（有未解决问题时） | 创建时 | 下游 skill | 持续到回答 |

---

## Minimum Example

```yaml
plan_summary: |
  在 ai-pm-daily 现有 32 源 RSS pipeline 基础上，新增每日 8:00 AM 邮件推送，
  内容为 AI 4 维度分析的精选日报，2 周内试点。

goal_statement: |
  让 AI 产品经理在 5 分钟内通过邮件获得当日 AI 行业精选动态。

non_goals:
  - 不做个性化推荐引擎（v1 仅通用精选）
  - 不做内容生成（只做筛选 + 摘要）
  - 不做社交分享 / 评论

assumptions:
  - id: A1
    assumption: "用户每天早上会主动打开邮件"
    confidence: medium
    invalidation: "试点 2 周打开率 <30%"

success_metrics:
  - type: leading
    metric: 日报打开率
    target: "≥ 50%"
    measurement: "邮件 provider 打开追踪"
  - type: lagging
    metric: 30 日留存
    target: "≥ 40%"
    measurement: "周活跃订阅者"

decision_points:
  - point: "邮件 provider 选型"
    options: ["Resend", "阿里云邮件推送", "腾讯企业邮"]
    owner: "@max"
    needed_by: "2026-07-15"

handoff_target: builder-spec
revisit_trigger:
  - "试点第 7 天打开率 <40%"
  - "LLM 成本超 0.5 元/用户/天"

verification_plan:
  minimum_checks:
    - "邮件 provider 配置 + 发送测试通过"
    - "试点 5 个订阅者实际收到 7 天日报"
  observable_evidence:
    - "邮件 provider 发送日志截图"
    - "订阅者反馈截图或问卷"
  cannot_claim_done_without:
    - "至少 5 个真实订阅者完成 7 天试点"

slice_strategy: vertical_slice
delegation_mode: hitl_checkpoint_required

open_questions:
  - "推送时间是否支持 per-user 时区？v1 是否先固定 HKT？"
```

---

## Usage Rule

### 必填字段不可省略

`plan_summary / goal_statement / non_goals / assumptions / success_metrics / handoff_target / revisit_trigger / verification_plan / slice_strategy / delegation_mode` 这 10 个字段必填。Plan Brief 是下游 skill 的契约，省略会导致 spec/agent-task 退化成"自己看着办"。

### slice_strategy 默认 vertical_slice

除非有明确技术依赖（如"前后端必须分开做"），否则使用 `vertical_slice`。`horizontal_layer` 必须在 plan_summary 中说明理由。

### delegation_mode 与 verification_plan 必须一致

- `afk_ready` 要求 verification_plan 的 `minimum_checks` 完整且可机器验证
- `hitl_checkpoint_required` 要求 verification_plan 中至少有 1 个 `observable_evidence` 需要人工确认
- `blocked` 要求 `verification_plan.cannot_claim_done_without` 列出未解除的阻塞条件

### assumptions 必须有 invalidation

每个 assumption 必须附 `invalidation` 字段，说明"什么证据能推翻这个假设"。没有 invalidation 的 assumption 等于无验证假设，不能进入 Plan Brief。

### 不要伪造精确

数字字段（成功率、成本、时长）必须给区间或标注 confidence。`target: "≥ 50%"` 而非 `target: "53.7%"`。

### Plan Brief 不是 spec

Plan Brief 冻结"目标 + 范围 + 假设 + 验收方向"，但不展开字段级 API、状态机、数据模型。展开是 builder-spec 的职责。下游 handoff_target 指向 builder-spec 时，Plan Brief 应该被 `recommended_mode: plan_to_goal` 或 `goal` 消费。

---

## 与其他模板的边界

| 场景 | 用 Plan Brief | 用其他模板 |
|---|---|---|
| 用户目标清楚但实现细节未定 | ✅ | — |
| 用户已有完整规格，直接实现 | ❌（用 Change Contract） | Change Contract / Execution Pack |
| 用户只是想 grill 一个想法 | ❌（用 Feature Frame） | Feature Frame |
| 用户想把 Plan Brief 转成可构建规格 | Plan Brief → builder-spec | builder-spec 接收后产出 spec |

---

## 参考

- `skills/builder-plan-goal/SKILL.md` — 本模板的调用入口
- `kernel/packets/plan-goal-routing.zh.md` — Plan/Goal/Plan-to-Goal 路由规则
- `templates/module-execution-pack/template.md` — 当 Plan Brief 转入 create 模式时由 builder-spec 产出
- `templates/change-contract/template.md` — 当 Plan Brief 转入 improve 模式时由 builder-spec 产出
- `references/skill-design/skill-design-playbook.zh.md` — 模板设计原则
