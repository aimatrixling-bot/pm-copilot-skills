---
name: builder-spec
displayName: Builder Spec
description: "从已接受的 Feature Frame、需求、PRD 草稿、会议记录、业务上下文或 prototype artifact 创建可构建规格。适用于用户需要 Mini Spec、PRD、验收标准、工程请求、agent-readable spec、prototype-to-spec 反向提取、Design Brief 或可交给 prototype、agent-task、review 消费的交付契约。不要用于还很模糊的想法；先用 builder-frame。不要用于直接做原型、生成任务包或评审证据。"
user-invocable: true
argument-hint: "[Feature Frame、需求、上下文或产物路径]"
---

# Builder Spec

## 使命

产出可构建、可评审的规格，用于进入 prototype、architecture、implementation 或 agent task generation。

这个 skill 把已接受的 Feature Frame、需求来源或已经评审/迭代过的 prototype artifact，转成包含范围、验收标准和验证证据的交付契约。

它支持 prototype-to-spec 反向提取：从原型路径、覆盖流程、状态覆盖、缺口和验证证据中沉淀 Mini Spec、PRD 或 agent-readable spec，同时保留哪些内容只是 prototype 事实、哪些仍是 open question。

## 资源读取

- 创建规格时，读取 `templates/builder-spec.template.md`、`references/spec-rules.zh.md` 和 `references/acceptance-criteria.zh.md`。
- 从 prototype artifact、Prototype Brief、screen flow 或 demo evidence 反向提取 spec 时，读取 `references/prototype-to-spec.zh.md`。
- 需要参考真实 prototype brief 的反向提取样例时，读取 `references/examples-prototype-to-spec.zh.md`。
- 输入来自旧 PM/PRD 产物时，读取 `references/migration-notes.md`。
- 输入不满足 spec readiness 时，读取 `loops/recipes/grill-decision.loop.md`，并生成回退到 `builder-frame` 的 reroute recommendation。
- 涉及界面、状态、组件、交互或业务规则说明时，读取 `templates/design-brief/template.md`、`references/ui-ux/`、`kernel/gates/design-consistency-gate.zh.md` 和 `kernel/gates/product-logic-containment-gate.zh.md`。
- 需要判断 skill hardening 或输出契约边界时，读取 `references/skill-design/skill-design-playbook.zh.md`。

## 何时使用

- 用户要求 PRD、spec、验收标准或工程请求。
- 已有 Feature Frame，需要转成交付细节。
- 已有 prototype artifact、Prototype Brief、状态覆盖、gaps 或 verification，需要反向沉淀成 Mini Spec、PRD 或 agent-readable spec。
- 下游 agent 工作需要明确范围和验证方式。
- 用户要求把业务需求整理成 prototype、implementation 或 agent task 可消费的契约。

## 何时不要使用

- 问题和用户仍不清楚；应先用 `builder-frame`。
- 用户只需要基于已接受 spec 做 prototype；应使用 `builder-prototype`。
- 用户需要给其他 runtime 写执行指令；应使用 `builder-agent-task`。
- 用户要求检查已有 spec/prototype/代码是否达标；应使用 `builder-review`。

## 输入

- Feature Frame 或源需求。
- Prototype artifact、Prototype Brief、covered flows、states covered、gaps、verification 或 review notes。
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
- `prototype_to_spec`：从 prototype artifact、状态覆盖、gaps 和 verification 中提取可构建规格，明确 prototype facts、推断、缺口和下一步验证。
- `not_ready_for_spec`：Feature Frame 不成熟，退回 `builder-frame` 或先提问。

## 执行流程

1. 读取 spec 模板、spec rules 和 acceptance-criteria guide。
2. 判断输入来源：frame/spec-first、prototype-to-spec、legacy migration 或 not-ready。
3. 验证输入是否已经 spec-ready；来自 prototype 的输入也必须检查高风险权限、数据、API、生产和治理边界。
4. 如果输入不成熟，输出 `readiness_gate`、`reroute_recommendation` 和 `next_skill_input`，优先回退到 `builder-frame` 的 `grill_frame`，不要写伪完整 spec。
5. 对 `prototype_to_spec`：把 prototype 的 `artifact_path`、`covered_flows`、`states_covered`、`gaps` 和 `verification` 映射为 source provenance、requirements、flows、states、acceptance criteria、open questions 和 risks。
6. 定义目标、范围、non-goals、角色、流程、状态和边界情况。
7. 区分产品需求、prototype facts、实现猜测和未验证缺口。
8. 如果涉及 UI/UX，读取 Design Brief template、UI/UX shared contract 和 Product Logic Containment Gate，补充设计约束和业务规则说明边界。
9. 写出 acceptance criteria 和 rejection criteria。
10. 定义验证或测试策略。
11. 产出供下游 skill 使用的 Output Packet。

## 输出契约

```yaml
readiness_gate:
reroute_recommendation:
spec_type:
source_prototype:
extracted_from_prototype:
prototype_gaps:
prototype_verification:
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
ui_content_boundary:
business_rule_notes:
rule_notes_placement:
non_ui_explanations:
assumptions:
open_questions:
risks:
next_skill_hint:
next_skill_input:
```

## 质量门禁

- 必须区分产品需求和实现猜测。
- 从原型提取时，必须区分 prototype facts、inferred requirements、prototype gaps 和已验证证据。
- Prototype 的 `gaps` 不得被提升为已确认 requirement；必须进入 open_questions、risks、non_goals 或 next_skill_input。
- Prototype 的 `verification` 只能作为证据来源，不能替代 API、权限、数据、审计或生产迁移的规格。
- 如果 prototype 包含 spec_first 或高风险工程/数据/API/权限缺口，必须保持 spec-first 保护，不得因为已有页面原型就跳过验收和验证计划。
- 必须包含 non-goals 和 acceptance criteria。
- 必须标记 assumptions 和 open questions。
- 必须能被 `builder-prototype` 或 `builder-agent-task` 消费。
- Acceptance criteria 必须能通过人工 review、自动检查或明确证据验证。
- 如果实现细节只是推断，必须标成 assumption，而不是 requirement。
- 如果目标、用户、场景、non-goals、成功标准或关键决策树不清楚，必须使用 `not_ready_for_spec`，并输出回退到 `builder-frame` 的 `reroute_recommendation`。
- `not_ready_for_spec` 不得产出看似完整的 requirements、flows 或 acceptance criteria；只能给出缺口、推荐默认答案和下一步输入。
- UI/UX 相关 spec 必须说明 Design Brief、状态覆盖、交互要求、响应式和可访问性基础。
- UI-facing spec 必须说明 `ui_content_boundary`、`business_rule_notes`、`rule_notes_placement` 和 `non_ui_explanations`。
- 业务规则、权限矩阵、计算逻辑、状态机、接口或评审说明不得混入界面主体；默认放入 `业务规则说明（非界面内容）`。
- 只有用户真实需要看到的规则提示才能进入界面本体，并必须标注为 user_visible_rule_exceptions。
- 不要把视觉喜好写成需求，除非它可验收或来自既有设计约定。
- 如果 acceptance criteria 无法被人工 review、自动检查或证据验证，必须降级为 open question。

## 交接

交给 `builder-prototype`、`builder-agent-task`、`builder-review`，或 legacy architecture/implementation skills。交接时保留 readiness_gate、reroute_recommendation、spec_type、source_prototype、extracted_from_prototype、prototype_gaps、scope、non_goals、acceptance_criteria、verification_plan、assumptions、open_questions、risks、next_skill_hint 和 next_skill_input。

## 参考

- `kernel/packets/output-packet.schema.md`
- `loops/recipes/grill-decision.loop.md`
- `kernel/gates/design-consistency-gate.zh.md`
- `kernel/gates/product-logic-containment-gate.zh.md`
- `templates/design-brief/template.md`
- `references/ui-ux/design-principles.zh.md`
- `references/ui-ux/component-guidelines.zh.md`
- `references/ui-ux/interaction-patterns.zh.md`
- `references/ui-ux/visual-style.zh.md`
- `templates/builder-spec.template.md`
- `references/spec-rules.zh.md`
- `references/acceptance-criteria.zh.md`
- `references/prototype-to-spec.zh.md`
- `references/examples-prototype-to-spec.zh.md`
- `references/migration-notes.md`
- `evals/output-contract/builder-spec.schema.json`
- `references/skill-design/skill-design-playbook.zh.md`
- 既有来源：`skills/pm-prd/SKILL.md`
