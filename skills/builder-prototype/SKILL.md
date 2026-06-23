---
name: builder-prototype
displayName: Builder Prototype
description: "基于 Feature Frame、spec、PRD、Design Brief、截图、source URL、existing code 或自然语言创建低保真线框图、可运行原型、prototype brief、screen flow 或视觉验证资产。适用于用户要求 prototype、wireframe、mockup、demo、layout、交互状态、响应式检查、visual target 还原或原型证据。优先交付可评审产物；当边界或风险不足以直接做原型时，降级为最小可行原型计划、缺口清单和高价值澄清问题。不要用于写完整 spec、生成 Agent Task Packet，或评审既有原型与 Design Brief 是否一致；评审交给 builder-review。"
user-invocable: true
argument-hint: "[frame/spec/PRD/path/description] [--fidelity=low|medium|high]"
---

# Builder Prototype

## 使命

把产品意图、frame、spec、Design Brief 或 visual target 变成可评审、可运行或可交接的原型产物。默认先让用户拿到可看的东西；同时识别存量系统、mock boundary、route readiness、权限、数据、API 和生产治理风险，避免把高风险问题伪装成 UI demo。

本 skill 是 prototype-first doer + boundary-aware director：能做时直接做，边界高风险时先收窄，信息不足时降级交付，不输出空白的 `not_ready_for_prototype`。

## 资源读取

- 判断三路径和降级策略时，读取 `skills/builder-prototype/references/prototype-path-rules.zh.md`。
- 判断 visual target、source visual 和高保真降级策略时，读取 `skills/builder-prototype/references/visual-target-rules.zh.md`。
- 生成或交接可运行原型证据时，读取 `skills/builder-prototype/references/coded-prototype-recipe.zh.md`。
- 需要示例、反模式或输出风格时，读取 `skills/builder-prototype/references/examples.zh.md`。
- 编写 prototype brief 或交接原型产物时，读取 `templates/prototype-brief/template.md`。
- 输入来自 Delivery Kernel 时，读取 `docs/delivery-kernel.md`、`templates/module-execution-pack/template.md`、`templates/change-contract/template.md` 和 `templates/branch-state/template.md`。
- 涉及界面规范时，读取 `templates/design-brief/template.md`、`references/ui-ux/`、`kernel/gates/design-consistency-gate.zh.md` 和 `kernel/gates/product-logic-containment-gate.zh.md`。
- 高保真、可交互或可运行原型时，读取 `loops/recipes/design-plan-to-prototype.loop.md`，先形成轻量 `Design Plan` 再进入产物生成。
- 检查 fake UI、mock honesty 和证据时，读取 `kernel/gates/fake-ui-gate.zh.md` 和 `kernel/packets/evidence-packet.schema.md`。
- 打磨或评审 skill 设计时，读取 `references/skill-design/skill-design-playbook.zh.md`。

## 何时使用

- 用户要求 wireframe、prototype、mockup、demo、UI layout、screen flow 或可运行视觉产物。
- 任务需要用原型评审页面结构、流程、状态、响应式、mock 数据、visual target 匹配或交互。
- 已有 frame/spec/PRD/Design Brief，需要转成可评审或可交给 agentic build workflow 的原型输入。
- 用户只有粗略界面想法，但风险较低，可以先做低保真或最小可行版本再迭代。

## 何时不要使用

- 用户明确只要完整 PRD、验收标准或工程规格；应使用 `builder-spec`。
- 用户需要另一个 coding agent 直接实现工程变更；应使用 `builder-agent-task`。
- 用户只要求评审已有原型；应使用 `builder-review`。
- 请求主体是后端、权限、数据模型、API、生产迁移或高风险业务规则，且没有最小规格；使用 `spec_first` 输出窄交接，不要强行做 UI。

## 输入

- Feature Frame、spec、PRD、截图、source URL、existing code path、现有页面路径或自然语言描述。
- Module Execution Pack、Change Contract 或 Branch State。
- 目标用户、核心流程、状态覆盖和保真度目标。
- visual target：`none`、`brief_only`、`source_image`、`source_url`、`existing_code`、`generated_option` 或 `not_required`。
- 既有设计系统、UI 参考、route readiness、mock boundary、数据来源和验证期望。
- 已有或可推导的 Design Brief；缺失时写明设计假设。

## 三路径模式

- `prototype_first`：新想法、界面流程、评审型原型、低风险概念验证。先给低保真、可运行或可交互产物，再记录缺口。
- `boundary_first`：PMS、存量复杂系统、跨仓库、mock boundary、route readiness、生产/治理边界高风险。先明确 Target Truth、Active Demo、mock honesty、route readiness 和最小 slice，再做边界内原型。
- `spec_first`：后端、权限、数据、API、工程交付或高风险业务规则变更。不要假装能靠页面原型解决；输出最小规格缺口、可视化范围和 `builder-spec` 交接。

## Visual Target 规则

- 低保真 wireframe、screen flow、信息架构和最小可行原型计划可以从文字 brief 开始，`visual_target.type` 可为 `brief_only` 或 `not_required`。
- 高保真视觉还原、截图转代码、URL 克隆、redesign implementation 或 design-system faithful prototype 必须有 `source_image`、`source_url`、`existing_code` 或用户选中的 `generated_option`。
- 只有文字 brief 时，不得声称完成 faithful high-fidelity visual match；应降级为中/低保真、输出视觉方向选项，或要求用户提供/选择 visual target。
- PMS、存量复杂系统和 route readiness 高风险场景即使有 visual target，也必须保留 `boundary_first` 和 mock honesty。

## 输出模式

- `runnable_prototype`：能在本地或浏览器中运行的 HTML/CSS/JS、React/Vue 或等价原型。
- `wireframe`：低保真结构、信息架构、流程和状态草图。
- `prototype_brief`：当前环境不适合直接生成代码，但可以给 agent、设计工具或后续实现使用的原型 brief。
- `degraded_prototype`：信息不足或风险过高时的降级交付，包含最小可行版本、缺口清单和最多 3 个高价值问题。

## 执行流程

1. 先判断路径：`prototype_first`、`boundary_first` 或 `spec_first`；说明选择依据。
2. 判断 visual target：`none`、`brief_only`、`source_image`、`source_url`、`existing_code`、`generated_option` 或 `not_required`。
3. 确认原型目的、保真度、核心流程、状态覆盖、数据来源、运行方式和截图验证方式。
4. 如果已有 Module Execution Pack、Change Contract 或 Branch State，优先继承其中的 non-goals、字段/操作/状态契约、verification 和 definition_sync 要求。
5. 信息不足时降级交付：先给低保真结构或最小可行原型计划，再列 `gaps` 和最多 3 个高价值问题。
6. `prototype_first`：优先产出可看的 artifact；低风险时可以直接生成单文件或小型可运行原型。
7. `boundary_first`：先隔离真实业务规则、mock/demo 数据、route readiness 和 active demo 边界；只承诺边界内的窄 slice。
8. `spec_first`：输出可视化范围、缺口和 `builder-spec` 交接输入；不要生成会误导工程交付的假原型。
9. 高保真或可运行产物应用 Design Plan to Prototype Loop、Design Consistency Gate、Product Logic Containment Gate 和 Fake UI Gate。
10. 可运行原型必须给出 `runnable_evidence`；如果没有实际运行或截图，写明 blocker，不得声称已验证。
11. 输出核心字段和证据字段，把重门禁放进 `builder-review` / release workflow，不用 20+ 字段填充日常原型。

## 输出契约

```yaml
prototype_mode: prototype_first | boundary_first | spec_first | runnable_prototype | wireframe | prototype_brief | degraded_prototype
delivery_mode: create | improve | reframe | unknown
visual_target:
  type: none | brief_only | source_image | source_url | existing_code | generated_option | not_required
  source:
  required_for_fidelity: true | false
  decision:
artifact_path:
fidelity: low | medium | high | not_applicable
covered_flows:
states_covered:
gaps:
runnable_evidence:
  run_command:
  preview_url:
  screenshot_path:
  viewport:
  state:
  design_qa: not_run | passed | blocked | not_applicable
verification:
definition_sync:
next: builder-review | builder-agent-task | builder-spec | builder-frame | iterate | ask_user
```

## 质量门禁

- 不允许空手拒绝：没有足够信息时输出 `degraded_prototype`，而不是 `not_ready_for_prototype`。
- 低风险界面想法优先交付可评审原型；不要先写一份大型流程文档。
- 不照搬全局 No Visual Target No Build：只有高保真视觉还原、设计稿转代码、截图/URL faithful recreation 才必须有 visual target。
- PMS 或存量复杂系统必须保持 `boundary_first`，不能把经验误改成全局 prototype-first。
- Mock/demo 数据、不可用交互、未接入路由和未验证状态必须在 `gaps` 或 `verification` 中诚实标注。
- 业务规则说明必须进入 `业务规则说明（非界面内容）` 或等价独立区域，不能侵入界面主体。
- 高保真或可运行原型必须说明运行方式、预览 URL、截图/人工检查方式、状态覆盖和未覆盖状态。
- 有 Design Brief 时必须使用；没有时写明设计假设，不伪造已确认的设计系统。
- 有 Module Execution Pack、Change Contract 或 Branch State 时必须尊重其中的 non-goals、verification 和 definition_sync；不得在原型阶段扩大范围。
- 需要 release、promotion、artifact governance 或严格 Evidence Packet 时，交给 `builder-review` 或 release workflow 执行重门禁。

## 交接

带着 artifact path、三路径判断、visual target、保真度、覆盖流程、状态覆盖、缺口、runnable evidence、验证方式和下一步建议，交给 `builder-review`、`builder-agent-task`、`builder-spec` 或继续迭代。日常交接保持简短；只有进入评审、发布、promotion 或治理场景时再展开 Evidence Packet、artifact governance 和 handoff packet。

## 参考

- `skills/builder-prototype/references/prototype-path-rules.zh.md`
- `skills/builder-prototype/references/visual-target-rules.zh.md`
- `skills/builder-prototype/references/coded-prototype-recipe.zh.md`
- `skills/builder-prototype/references/examples.zh.md`
- `templates/prototype-brief/template.md`
- `docs/delivery-kernel.md`
- `templates/module-execution-pack/template.md`
- `templates/change-contract/template.md`
- `templates/branch-state/template.md`
- `templates/design-brief/template.md`
- `references/ui-ux/design-principles.zh.md`
- `references/ui-ux/component-guidelines.zh.md`
- `references/ui-ux/interaction-patterns.zh.md`
- `references/ui-ux/visual-style.zh.md`
- `kernel/gates/fake-ui-gate.zh.md`
- `kernel/gates/design-consistency-gate.zh.md`
- `kernel/gates/product-logic-containment-gate.zh.md`
- `kernel/packets/evidence-packet.schema.md`
- `loops/recipes/design-plan-to-prototype.loop.md`
- `evals/output-contract/builder-prototype.schema.json`
- `references/skill-design/skill-design-playbook.zh.md`
