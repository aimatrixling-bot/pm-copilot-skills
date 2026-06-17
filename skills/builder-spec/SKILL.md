---
name: builder-spec
displayName: Builder Spec
description: "从已接受的 Feature Frame、需求、PRD 草稿、会议记录或业务上下文创建可构建规格。适用于用户需要 Mini Spec、PRD、验收标准、工程请求、agent-readable spec、Design Brief 或可交给 prototype、agent-task、review 消费的交付契约。不要用于还很模糊的想法；先用 builder-frame。不要用于直接做原型、生成任务包或评审证据。"
user-invocable: true
argument-hint: "[Feature Frame、需求、上下文或产物路径]"
---

# Builder Spec

## 使命

产出可构建、可评审的规格，用于进入 prototype、architecture、implementation 或 agent task generation。

这个 skill 把已接受的 Feature Frame 或需求来源，转成包含范围、验收标准和验证证据的交付契约。

## 资源读取

- 创建规格时，读取 `templates/builder-spec.template.md`、`references/spec-rules.zh.md` 和 `references/acceptance-criteria.zh.md`。
- 输入来自旧 PM/PRD 产物时，读取 `references/migration-notes.md`。
- 涉及界面、状态、组件或交互时，读取 `templates/design-brief/template.md`、`references/ui-ux/` 和 `kernel/gates/design-consistency-gate.zh.md`。
- 需要判断 skill hardening 或输出契约边界时，读取 `references/skill-design/skill-design-playbook.zh.md`。

## 何时使用

- 用户要求 PRD、spec、验收标准或工程请求。
- 已有 Feature Frame，需要转成交付细节。
- 下游 agent 工作需要明确范围和验证方式。
- 用户要求把业务需求整理成 prototype、implementation 或 agent task 可消费的契约。

## 何时不要使用

- 问题和用户仍不清楚；应先用 `builder-frame`。
- 用户只需要基于已接受 spec 做 prototype；应使用 `builder-prototype`。
- 用户需要给其他 runtime 写执行指令；应使用 `builder-agent-task`。
- 用户要求检查已有 spec/prototype/代码是否达标；应使用 `builder-review`。

## 输入

- Feature Frame 或源需求。
- 用户故事或场景。
- 约束和 non-goals。
- 验收和验证期望。
- 上下文来源。
- 当 spec 涉及产品界面时，提供 UI/UX 参考、既有设计系统或组件约定。

## 模式判断

- `mini_spec`：范围小、只需明确目标、流程、验收和验证。
- `prd`：需要更完整的用户、场景、需求、状态、边界和风险。
- `engineering_request`：面向工程实现，强调实现边界、验收、测试和不做内容。
- `agent_readable_spec`：面向 agent task，强调上下文来源、验证方式、stop conditions 和 handoff。
- `not_ready_for_spec`：Feature Frame 不成熟，退回 `builder-frame` 或先提问。

## 执行流程

1. 读取 spec 模板、spec rules 和 acceptance-criteria guide。
2. 验证输入是否已经 spec-ready。
3. 定义目标、范围、non-goals、角色、流程、状态和边界情况。
4. 区分产品需求和实现猜测。
5. 如果涉及 UI/UX，读取 Design Brief template 和 UI/UX shared contract，补充设计约束。
6. 写出 acceptance criteria 和 rejection criteria。
7. 定义验证或测试策略。
8. 产出供下游 skill 使用的 Output Packet。

## 输出契约

```yaml
spec_type:
objective:
users:
scope:
non_goals:
requirements:
flows:
states:
edge_cases:
acceptance_criteria:
rejection_criteria:
verification_plan:
design_brief:
ui_states:
interaction_requirements:
responsive_requirements:
accessibility_notes:
assumptions:
open_questions:
risks:
next_skill_hint:
```

## 质量门禁

- 必须区分产品需求和实现猜测。
- 必须包含 non-goals 和 acceptance criteria。
- 必须标记 assumptions 和 open questions。
- 必须能被 `builder-prototype` 或 `builder-agent-task` 消费。
- Acceptance criteria 必须能通过人工 review、自动检查或明确证据验证。
- 如果实现细节只是推断，必须标成 assumption，而不是 requirement。
- UI/UX 相关 spec 必须说明 Design Brief、状态覆盖、交互要求、响应式和可访问性基础。
- 不要把视觉喜好写成需求，除非它可验收或来自既有设计约定。
- 如果 acceptance criteria 无法被人工 review、自动检查或证据验证，必须降级为 open question。

## 交接

交给 `builder-prototype`、`builder-agent-task`、`builder-review`，或 legacy architecture/implementation skills。交接时保留 spec_type、scope、non_goals、acceptance_criteria、verification_plan、assumptions、open_questions、risks 和 next_skill_hint。

## 参考

- `kernel/packets/output-packet.schema.md`
- `kernel/gates/design-consistency-gate.zh.md`
- `templates/design-brief/template.md`
- `references/ui-ux/design-principles.zh.md`
- `references/ui-ux/component-guidelines.zh.md`
- `references/ui-ux/interaction-patterns.zh.md`
- `references/ui-ux/visual-style.zh.md`
- `templates/builder-spec.template.md`
- `references/spec-rules.zh.md`
- `references/acceptance-criteria.zh.md`
- `references/migration-notes.md`
- `evals/output-contract/builder-spec.schema.json`
- `references/skill-design/skill-design-playbook.zh.md`
- 既有来源：`skills/pm-prd/SKILL.md`
