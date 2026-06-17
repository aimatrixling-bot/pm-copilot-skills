---
name: builder-prototype
displayName: Builder Prototype
description: "基于 Feature Frame、spec、PRD、Design Brief、截图或自然语言创建低保真线框图、高保真可交互原型、prototype brief、screen flow 或视觉验证资产。适用于用户要求 prototype、wireframe、mockup、demo、layout、交互状态、响应式检查或原型证据。不要用于写 spec、生成 Agent Task Packet，或评审既有原型与 Design Brief 是否一致；评审交给 builder-review。"
user-invocable: true
argument-hint: "[frame/spec/PRD/path/description] [--fidelity=low|high]"
---

# Builder Prototype

## 使命

把已接受的 frame 或 spec 转成可以评审、测试，或交给 agentic build workflow 的视觉产物。

这是旧 `pm-prototype` 的轻量 v0.1 草案。详细视觉系统、场景规则和 Agent UI 规则应放在 references 中。

## 资源读取

- 确定原型范围和格式时，读取 `templates/prototype-brief/template.md`。
- 涉及界面规范时，读取 `templates/design-brief/template.md`、`references/ui-ux/` 和 `kernel/gates/design-consistency-gate.zh.md`。
- 检查 fake UI 和证据时，读取 `kernel/gates/fake-ui-gate.zh.md` 和 `kernel/packets/evidence-packet.schema.md`。
- 需要沿用旧原型能力时，按需读取 `skills/pm-prototype/references/`。
- 打磨或评审 skill 设计时，读取 `references/skill-design/skill-design-playbook.zh.md`。

## 何时使用

- 用户要求 wireframe、prototype、mockup、demo、UI layout 或 screen flow。
- 任务需要视觉验证。
- 已有 spec，需要转成可评审流程。
- 用户需要把 Design Brief 转成可检查的界面或交互方案。

## 何时不要使用

- 问题或功能还未 framed；应使用 `builder-frame`。
- spec 缺少验收边界；应使用 `builder-spec`。
- 用户需要另一个 coding agent 实现；应使用 `builder-agent-task`。
- 用户只要求评审已有原型；应使用 `builder-review`。

## 输入

- Feature Frame、spec、PRD、截图或描述。
- 保真度目标：low 或 high。
- 目标用户和核心流程。
- 既有设计系统或 UI 参考。
- 验证期望。
- 已有或可从 spec 推导的 Design Brief。

## 模式判断

- `wireframe`：结构、信息架构或流程还在早期验证，避免高保真。
- `high_fidelity_prototype`：已有清晰 spec/Design Brief，需要可运行或可交互原型。
- `prototype_brief`：当前环境不适合直接实现原型，先产出交给 agent 或设计工具的 brief。
- `not_ready_for_prototype`：缺少用户、核心流程、状态或验收边界，退回 `builder-frame` / `builder-spec`。

## 执行流程

1. 确认原型目的和保真度。
2. 读取或推导 Design Brief 和 UI/UX shared contract。
3. 识别核心流程、状态、交互要求、组件和数据。
4. 选择低保真线框图或高保真可交互路径。
5. 产出 prototype brief、原型产物和 mapping notes。
6. 填写用于交互、截图或人工评审的 Evidence Packet。

## 输出契约

```yaml
prototype_mode: wireframe | high_fidelity_prototype | prototype_brief | not_ready_for_prototype
prototype_type:
artifact_path:
mapping_path:
design_brief_path:
core_flows:
states_covered:
component_usage:
interaction_requirements:
responsive_requirements:
design_decisions:
demo_data_notes:
evidence_packet:
verification:
next_skill_hint:
```

## 质量门禁

- 应用 Fake UI Gate。
- 当 strategy/scope 不清楚时，不要过早投入高保真。
- 高保真原型必须可运行，或清楚标注为静态。
- 主要流程和关键边界状态必须呈现，或明确说明延后。
- 应用 Design Consistency Gate。
- 有 Design Brief 时必须使用；缺失时应产出可交接的 Design Brief。
- Mock/demo 数据和不可用交互必须清楚标注。
- 如果无法运行或截图验证，必须说明原因和人工检查步骤。

## 交接

带着 prototype brief、产物路径、Design Brief、mapping notes、状态覆盖和证据，交给 `builder-review`、`builder-agent-task` 或 implementation skills。

## 参考

- `kernel/gates/fake-ui-gate.zh.md`
- `kernel/gates/design-consistency-gate.zh.md`
- `kernel/packets/evidence-packet.schema.md`
- `templates/prototype-brief/template.md`
- `templates/design-brief/template.md`
- `references/ui-ux/design-principles.zh.md`
- `references/ui-ux/component-guidelines.zh.md`
- `references/ui-ux/interaction-patterns.zh.md`
- `references/ui-ux/visual-style.zh.md`
- 既有来源：`skills/pm-prototype/SKILL.md`
- 既有参考：`skills/pm-prototype/references/`
- `evals/output-contract/builder-prototype.schema.json`
- `references/skill-design/skill-design-playbook.zh.md`
