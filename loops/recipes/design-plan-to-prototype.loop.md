# Design Plan to Prototype Loop

## Purpose

Design Plan to Prototype Loop 用于把清晰的 frame/spec/Design Brief 转成可运行、可评审、可迭代的高保真原型。它不是新的 core skill，而是 `builder-prototype` 在高保真和 runnable demo 场景下必须遵守的工作循环。

## Trigger

- 用户要求高保真原型、可交互原型、可运行 Demo、前端代码型原型或系统菜单页面。
- 原型需要被产品经理、前端、设计或业务方评审。
- 原型包含复杂业务状态、权限、审批、生命周期或领域模型说明。
- 用户希望基于一次原型继续调整密度、布局、组件、层级或状态呈现。

## Entry Conditions

- 已有 Feature Frame、Builder Spec、PRD 或足够清晰的需求上下文。
- 已读取或可推导 Design Brief。
- 已明确目标用户、核心流程、关键状态和验收方式。
- 如果输入不成熟，先回退 `builder-frame` 或 `builder-spec`，不要进入高保真生成。

## Context Sources

- `templates/design-brief/template.md`
- `templates/prototype-brief/template.md`
- `kernel/gates/design-consistency-gate.zh.md`
- `kernel/gates/product-logic-containment-gate.zh.md`
- `kernel/gates/fake-ui-gate.zh.md`
- 相关 Feature Frame、Spec、Design Brief、业务规则文档、现有设计系统或参考实现。

## Steps

1. 运行 readiness check：确认 frame/spec/Design Brief、核心流程、状态、数据边界和验收方式足够。
2. 输出 `design_plan`：页面目标、信息层级、布局策略、组件策略、状态覆盖、响应式策略、业务规则说明位置和 mock/demo 边界。
3. 明确 `ui_content_boundary`：区分界面本体内容、非界面业务说明和用户可见规则例外。
4. 选择原型形态：静态 brief、可交互页面、可运行前端 demo 或代码可复用原型。
5. 生成或要求生成原型产物，并提供 `preview_or_run_command`。
6. 收集 Evidence Packet：截图、浏览器检查、交互检查、状态覆盖和未验证区域。
7. 输出 `nudge_options`：密度、间距、布局、组件变体、内容层级、规则说明位置等可调项。
8. 如果原型要交给下游 agent，实现任务必须通过 `builder-agent-task` 传递验证命令、禁止动作和 stop condition。

## Output Contract

```yaml
design_plan:
  page_goal:
  first_view_hierarchy:
  layout_strategy:
  component_strategy:
  state_strategy:
  responsive_strategy:
  data_strategy:
  rule_notes_strategy:
prototype_artifact:
  path:
  type:
  fidelity:
runnable_prototype:
  status: runnable | static | not_available
  reason:
preview_or_run_command:
ui_content_boundary:
business_rule_notes:
rule_notes_placement:
non_ui_explanations:
evidence_packet:
nudge_options:
next_skill_input:
```

## Stop Conditions

- 缺少用户、核心流程、验收标准或 Design Brief，无法安全进入高保真。
- 业务规则需要 owner 决策，且默认假设会误导界面。
- 无法运行、预览或截图验证，只能降级为 `prototype_brief` 并说明人工检查方式。
- 用户要求直接改生产系统、真实数据或权限配置。

## Handoff Rules

- 交给 `builder-review`：必须带 `design_plan`、Design Brief、原型路径、Evidence Packet 和未验证区域。
- 交给 `builder-agent-task`：必须带 `preview_or_run_command`、验收标准、验证命令、业务规则隔离要求和 stop conditions。
- 交给 `builder-spec`：只在发现需求/状态/验收缺口时回退，并附 `next_skill_input`。

## Quality Gates

- 应用 Product Logic Containment Gate。
- 应用 Design Consistency Gate。
- 应用 Fake UI Gate。
- 高保真原型必须可运行或明确降级为静态。
- 业务规则说明不得直接侵入界面主体。

