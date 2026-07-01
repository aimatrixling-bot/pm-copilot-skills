---
template_name: delivery-sign-off
schema_version: 0.1.0
purpose: |
  3P（PRD-Spec / Prototype / Product）三轨交付的统一确认模板。每条交付物
  进入 review 或 release 前必须填此模板，冻结"交付完成"的判定依据，避免
  "看起来完成了"的伪交付。
---

# Delivery Sign-Off Template

> 这是模板。字段定义以 `kernel/packets/delivery-sign-off.schema.md`（如存在）为准。
> 每个 `[...]` 必须替换为真实内容，不得保留占位符。

---

## Frontmatter

```yaml
---
signoff_id: <kebab-case-id>
delivery_track: prd_spec | prototype | product
delivery_mode: create | improve | reframe
created_at: <YYYY-MM-DD>
sign_off_owner: <name>
sign_off_status: draft | pending_review | approved | rejected | superseded
---
```

---

## 字段表

| 字段 | 类型 | 必填 | 写入时机 | 读取时机 | 生命周期 |
|---|---|---|---|---|---|
| `delivery_track` | enum | ✅ | 创建时 | review / release | 一次性 |
| `delivery_mode` | enum | ✅ | 创建时 | review | 一次性 |
| `artifact_refs` | object[] `{role, path, version}` | ✅ | 创建时 | review / release | 持续 |
| `acceptance_criteria_met` | object[] `{criterion, status: met\|partial\|not_met, evidence_ref}` | ✅ | review 前 | review | 一次性（review 后冻结） |
| `evidence_packet_ref` | object `{path, contents[]}` | ✅ | review 前 | review / release | 持续到归档 |
| `residual_risks` | object[] `{risk, severity, mitigation, owner}` | ✅ | review 前 | review / release | 持续到风险关闭 |
| `sign_off` | object `{decision: approved\|rejected\|conditional, by, date, conditions[]}` | ✅ | review 时 | release | 持续 |
| `next_track_handoff` | object `{track, artifact_refs[], preserved_context[], open_questions[]}` | ⚠️ 条件必填（有下游交接时） | sign_off 后 | 下游 track | 一次性 |
| `definition_sync` | object `{updated_sources[], reasons[], pending_updates[]}` | ✅ | review 时 | release | 持续 |

---

## Minimum Example

```yaml
delivery_track: prototype
delivery_mode: create

artifact_refs:
  - role: prototype_artifact
    path: prototype/ai-pm-daily-push-v1.html
    version: "1.0.0"
  - role: prototype_brief
    path: docs/prototype-brief-ai-pm-daily-push.md
    version: "1.0.0"

acceptance_criteria_met:
  - criterion: "邮件预览窗口可见，含标题 / 摘要 / 4 维度分析卡片"
    status: met
    evidence_ref: "screenshots/01-email-preview.png"
  - criterion: "响应式：移动端单列、桌面端双列"
    status: met
    evidence_ref: "screenshots/02-mobile-view.png"
  - criterion: "暗色主题支持"
    status: partial
    evidence_ref: "screenshots/03-dark-theme-partial.png"
    note: "暗色主题标题栏对比度未达 WCAG AA"

evidence_packet_ref:
  path: evidence/ai-pm-daily-push-v1-evidence.md
  contents:
    - "5 张交互流程截图"
    - "1 段 30s 操作录屏链接"
    - "1 份 5 人用户反馈纪要"

residual_risks:
  - risk: "暗色主题对比度未达标"
    severity: medium
    mitigation: "v1.1 修正对比度，v1 先用浅色默认"
    owner: "@max"
  - risk: "试点规模不足（5 人），统计显著性弱"
    severity: low
    mitigation: "v1 标注'试点证据'，v1.1 扩大到 30 人"
    owner: "@max"

sign_off:
  decision: conditional
  by: "@max"
  date: 2026-07-15
  conditions:
    - "暗色主题对比度问题作为 v1.1 priority 1 项"
    - "试点证据必须明确标注规模限制"

next_track_handoff:
  track: prd_spec
  artifact_refs:
    - path: docs/prototype-brief-ai-pm-daily-push.md
    - path: evidence/ai-pm-daily-push-v1-evidence.md
  preserved_context:
    - "non_goals: 不做个性化推荐 / 不做内容生成"
    - "暗色主题对比度 v1.1 必修"
    - "试点规模 5 人，证据等级 limited"
  open_questions:
    - "推送时间 per-user 时区？v1 是否先固定 HKT？"
    - "邮件 provider 选型"

definition_sync:
  updated_sources: []
  reasons: "v1 交付，无既存 spec 需要同步"
  pending_updates:
    - "v1.1 修正暗色主题后，需更新 prototype_brief 的 design_qa 字段"
```

---

## Usage Rule

### `acceptance_criteria_met` 不允许全部 met

真实交付总有遗留。若所有 criterion 都 `status: met`，必须重新审查——要么标准过松，要么证据不足。至少 1 个 `partial` 或显式说明"标准本身就高，确实全 met"。

### `evidence_packet_ref.path` 必须真实存在

不得引用未创建的证据文件。证据文件缺失时 `sign_off.decision` 必须是 `rejected` 或 `conditional`，不能 approved。

### `residual_risks` 不可空

写"无遗留风险"等于未认真评估。至少列出 1 个风险，即便是 low severity。

### `sign_off.decision` 三态规则

- `approved`：所有 acceptance_criteria_met 且 residual_risks 全部 low severity。可进入 release。
- `conditional`：部分 criterion `partial` 或有 medium severity risk。可进入下游 track 但必须 carry conditions。
- `rejected`：有 criterion `not_met` 或 high severity risk 无 mitigation。必须返工。

### `conditional` 必须有 conditions[]

`conditional` 决策必须列出具体条件，每个条件必须有 owner 和明确完成标准。`conditional` 不等于"先放过去"。

### `next_track_handoff` 仅在交接下游时填写

如果当前 track 是终点（如 release），可省略 `next_track_handoff`。但凡有下游（prototype → spec、spec → agent-task、agent-task → release），必须填写。

### `definition_sync` 区分 updated_sources 与 pending_updates

`updated_sources` 是本次 sign-off 触发的"已写入"长期事实源（如 spec、decision_log）。
`pending_updates` 是"待写入"项，sign_off 时不立即触发但记录待办。两者不可混。

---

## 3P Track 适用边界

### Track 1：prd_spec（PRD / Spec 轨）

- `delivery_track: prd_spec`
- artifact_refs 至少含 spec 文件 / module-execution-pack 或 change-contract
- review 重点：acceptance_criteria 是否可验证 / non_goals 是否清晰

### Track 2：prototype（原型轨）

- `delivery_track: prototype`
- artifact_refs 至少含 prototype_artifact / prototype_brief
- review 重点：gaps 是否诚实 / runnable_evidence 是否真实运行 / prototype_intent 是否与生命周期一致

### Track 3：product（产品 / 发布轨）

- `delivery_track: product`
- artifact_refs 至少含 release_artifact / Evidence Packet
- review 重点：residual_risks 是否可接受 / monitoring 是否就绪 / rollback 是否可行

---

## 参考

- `skills/builder-spec/SKILL.md` / `skills/builder-prototype/SKILL.md` / `skills/builder-review/SKILL.md` — 调用入口
- `kernel/packets/evidence-packet.schema.md` — `evidence_packet_ref` 字段定义
- `kernel/packets/output-packet.schema.md` — 输出契约 schema
- `templates/module-execution-pack/template.md` / `templates/change-contract/template.md` — 上游产物
- `docs/delivery-kernel.md` — Delivery Kernel 整体规则
- `references/skill-design/skill-design-playbook.zh.md` — 模板设计原则
