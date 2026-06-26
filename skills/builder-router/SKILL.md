---
name: builder-router
displayName: Builder Router
description: "路由宽泛、模糊或多阶段的 AI Builder OS 构建请求。适用于用户不知道下一步该用哪个 builder skill、需要选择 Prompt/Plan/Goal/Plan 到 Goal 或需要把产品/构建意图拆成 handoff 路径。不要用于已明确要求产出 Feature Frame、spec、prototype、Agent Task Packet、review report 或 Decision Record 的请求；这类请求应直接交给对应 builder skill。"
user-invocable: true
argument-hint: "[用户请求或项目上下文]"
---

# Builder Router

## 使命

为用户请求选择最小、最安全的 AI Builder OS 路径，并给出清楚的下一步。

## 资源读取

- 判断 Prompt / Plan / Goal / Plan -> Goal 时，读取 `kernel/routing/plan-goal-routing.zh.md`。
- 判断 builder skill 分流时，读取 `kernel/routing/builder-router.zh.md` 和 `kernel/routing/skill-selection-rules.zh.md`。
- 需要输出可交接上下文时，读取 `kernel/packets/intent-packet.schema.md`。
- 输入需要先解析关键决策树时，读取 `loops/recipes/grill-decision.loop.md`，再路由到 `builder-frame`。
- 首次进入或恢复项目时，读取 `harness/project-onboarding-policy.zh.md` 和 `memory/schemas/project-profile.schema.md`。
- 判断具体交付任务应走新建、迭代、重塑或混合风险路径时，读取 `docs/delivery-kernel.md` 和 `docs/source-of-truth-map.md`。
- 路由边界或 skill hardening 场景不清时，读取 `references/skill-design/skill-design-playbook.zh.md`。

## 何时使用

- 用户给出的是模糊想法、需求、项目或 agentic coding 任务。
- 用户询问应该使用什么模式或 skill。
- 任务可能需要 Plan、Goal 或 Plan -> Goal。
- 请求横跨 framing、spec、prototype、agent task、review 或 decision。
- 用户需要从自然语言入口进入 AI Builder OS，但不应该先记住 skill 名称。
- 用户第一次在项目中使用 AI Builder OS，或需要判断项目是从 0 开始、已有资产中途接入、还是恢复既有 `.ai-builder/` 状态。

## 何时不要使用

- 用户只是问一个简单事实问题。
- 用户已经明确调用更具体的 builder skill，且范围清楚。
- 用户只需要轻量文案润色或日常讨论。
- 用户已经提供清晰 spec、目标 runtime 和验收标准，并明确要求直接生成 Agent Task Packet；交给 `builder-agent-task`。
- 用户已经有 review target 并要求质量判断；交给 `builder-review`。

## 输入

- 用户请求。
- 已知项目或产物上下文。
- 目标 runtime，如果已知。
- 约束、风险和期望输出。
- 首次进入项目时的项目根、用户授权扫描范围、已有资产线索或 `.ai-builder/` 状态；如果未知，标记为 `unknown`。

## 模式判断

按以下顺序判断：

1. `answer`：可以直接回答，且不需要构建产物。
2. `prompt`：小而清楚的一次性 agent 指令。
3. `plan`：目标、范围、代码库、约束或验收还不清楚。
4. `goal`：目标清楚、边界明确、完成状态可验证。
5. `plan_to_goal`：目标大、跨模块、跨产物或需要多个里程碑。
6. `skill_route`：用户需要明确产物，交给对应 `builder-*` skill。
7. `ask_first`：缺少会改变方向的业务、安全、权限、数据或发布决策。

如果请求已经指向 spec、prototype 或 agent task，但目标用户、场景、non-goals、成功标准或关键决策树仍不清楚，优先推荐 `builder-frame` 的 `grill_frame` 路径，不要直接进入下游执行类 skill。

## Complexity-Aware 输出纪律

Router 必须先判断任务复杂度，再决定展示多重的理解、规格、证据和审查信息。内部可以保留完整 `delivery_decision`，但用户可见输出按 `response_profile` 降噪。

```yaml
task_complexity: micro | lite | standard | full
response_profile: terse | normal | audit
contract_profile: none | micro_note | lite_change_contract | standard_change_contract | full_change_contract
context_strategy: direct_answer | direct_contract | grill_first | prototype_question_first | handoff_required | branch_state_required | review_first
```

- `micro`：1-2 个文件、轻微文案/样式/小 UI、无业务语义变化；默认 `terse`，不默认输出完整 Contract、metrics 或 memory/evidence。
- `lite`：2-5 个文件、局部 UI/交互、有轻微回归风险；默认 `terse` 或 `normal`，需要时输出 `lite_change_contract`。
- `standard`：跨组件、状态、流程或局部业务语义；默认 `normal`，输出标准 Contract 和必要验证。
- `full`：跨模块、权限、API、数据、审计、发布、长线程或重塑风险；默认 `audit`，需要 Branch State 和完整证据。

Display policy：

- `terse` 只展示需求理解、`delivery_mode`、`task_complexity`、`contract_profile`、Branch State 是否需要和下一步。
- `normal` 展示紧凑理由、关键 Contract 字段和验证建议。
- `audit` 才展开完整 `delivery_decision`、`why_not_other_modes`、usage metrics、memory/evidence 和 source references。
- 用户只问“你能理解吗”时，默认不要展示完整 Router 决策；只有审查、复盘、冲突、release、definition drift 或用户明确要求时才使用 `audit`。

## Delivery Decision 判断

当请求已经进入具体交付任务时，输出结构化 `delivery_decision`，不要只给一个单值。

- `create`（新建模式）：没有稳定基线，从 0 做新项目、新模块、新页面、新 Agent 或新工作流；通常推荐 `builder-spec` 产出 Module Execution Pack。
- `improve`（迭代模式）：有稳定基线，只做局部优化、修复、删减或调整；通常推荐 `builder-spec` 产出 Change Contract。
- `reframe`（重塑模式）：有旧资产但目标形态、IA、流程或技术栈需要重定；通常先推荐 `builder-review` 或 `builder-spec` 做 asset digestion、target shape 和 Execution Pack。
- `improve_with_reframe_risk`：用户要求基于稳定基线局部改，但改动可能触及 IA、字段优先级、状态模型、页面类型或领域语义；primary 仍是 `improve`，secondary 是 `reframe`，先产出 Change Contract，并列出切换条件。
- `create_with_brownfield_references`：没有稳定基线，但有旧截图、竞品、旧代码或历史草稿作为参考；primary 是 `create`，secondary 是 `improve` 或 `reframe`，旧资产只能作为 source assets。
- `reframe_blocked_until_target_shape`：已有资产但目标形态未冻结；primary 是 `reframe`，实现必须停止在 asset digestion / target shape，直到人工确认。
- `unknown`：证据不足，先提问或输出最小检查清单。

`delivery_decision` 必须包含：

```yaml
delivery_decision:
  primary_mode: create | improve | reframe | unknown
  secondary_mode: create | improve | reframe | none
  confidence: high | medium | low
  required_first_artifacts:
    - module_execution_pack | change_contract | asset_digestion | target_shape | branch_state | none
  required_first_artifact: module_execution_pack | change_contract | asset_digestion | target_shape | branch_state | none
  why_not_other_modes:
    create:
    improve:
    reframe:
  mode_switch_conditions:
    - condition:
  stop_conditions:
    - condition:
```

`required_first_artifacts` 是核心字段，允许多个首要产物；例如 Visit Workbench 二次迭代且需要长线程恢复时，应同时输出 `change_contract` 和 `branch_state`。兼容字段 `required_first_artifact` 可继续输出第一个 artifact，`delivery_mode` 可继续输出 primary mode，但二者都不能替代 `delivery_decision`。

## Project Onboarding 判断

首次进入或恢复项目时，先判断 `project_mode`：

- `greenfield`：用户从 0 开始，或当前项目没有稳定本地资产；通常推荐 `builder-frame`。
- `brownfield`：当前项目已有文档、代码、原型、脚本、日志、测试或历史决策；通常推荐 `builder-review` 先做资产盘点。
- `resume`：已有 `.ai-builder/`、project profile 或 artifact index；通常继续读取既有状态再路由。
- `unknown`：缺少项目根、授权范围或可观察证据；先提问或输出最小检查清单。
- `not_applicable`：当前请求不是项目首次进入或恢复场景。

Router 只能输出 `project_profile_proposal`，不得自动创建 `.ai-builder/`、自动扫描全盘、自动迁移、删除、重命名或归档文件。

## 执行流程

1. 捕获 Intent Packet。
2. 如果是项目首次进入或恢复场景，判断 `project_mode`，并生成轻量 `project_profile_proposal`。
3. 判断请求应走 Prompt、Plan、Goal、Plan -> Goal，还是某个 builder skill。
4. 对具体交付任务输出 `delivery_decision`，包括 primary / secondary mode、confidence、首个产物、切换条件和停止条件。
5. 识别缺失上下文和风险标记。
6. 推荐一条路径，并说明原因。
7. 提供可复制的下一步提示词或 handoff packet。

## 输出契约

```yaml
route_type: answer | prompt | plan | goal | plan_to_goal | skill_route | ask_first
recommended_mode:
recommended_skill:
project_mode:
delivery_mode:
task_complexity:
response_profile:
contract_profile:
context_strategy:
display_policy:
delivery_decision:
  primary_mode:
  secondary_mode:
  confidence:
  required_first_artifacts:
  required_first_artifact:
  why_not_other_modes:
  mode_switch_conditions:
  stop_conditions:
project_profile_proposal:
recommended_next_skill:
reasoning_summary:
missing_context:
risk_flags:
suggested_chain:
next_skill_input:
next_prompt:
handoff_packet:
```

## 质量门禁

- 不要把大型模糊任务直接路由到 Goal。
- 不要为日常建议强行触发 builder workflow。
- 如果风险影响业务、安全、权限、生产或数据行为，先询问或路由到 Plan。
- 首次进入项目时必须显式输出 `project_mode`；非 onboarding 场景使用 `not_applicable`。
- 具体交付任务必须输出 `delivery_decision`；非交付场景使用 `delivery_mode: not_applicable` 或说明原因。
- `improve` 任务只要出现 IA、状态模型、页面类型、字段优先级或领域语义变化风险，就必须标记 `secondary_mode: reframe` 和 `mode_switch_conditions`。
- `reframe` 且 target shape 未冻结时，必须把实现列入 `stop_conditions`。
- `project_profile_proposal` 只能是 proposal，不得声称已创建 `.ai-builder/` 或已写入 artifact index。
- Brownfield 场景不得自动扫描全盘；不得自动清理、迁移、删除、重命名已有资产。
- 必须解释为什么不是相邻路径，特别是 `builder-frame` vs `builder-spec`、`builder-prototype` vs `builder-agent-task`、`builder-review` vs `builder-decision`。
- Router 可以推荐 `suggested_chain` 和 `next_skill_input`，但不得声称 runtime 会自动连续执行多个 skill。
- 当用户显式 call 某个下游 skill 但输入不成熟时，输出 reroute 建议和可直接交给 `builder-frame` 的输入。
- 路由结果必须包含下一步可执行动作，而不是只给 skill 名称。
- micro/lite 任务默认不得设置 `secondary_mode: reframe`；只在 IA、状态模型、页面类型、字段优先级、领域语义、导航分类或 target shape 风险明确时升级为 reframe 风险。
- metrics、memory/evidence、完整 `why_not_other_modes` 默认只在 `response_profile: audit` 展示。

## 交接

把 Intent Packet、project_mode、project_profile_proposal、task_complexity、response_profile、contract_profile、context_strategy、delivery_decision、推荐路径、缺失上下文、风险标记和下一步提示词交给选定的 `builder-*` skill。

## 参考

- `kernel/routing/builder-router.zh.md`
- `kernel/routing/plan-goal-routing.zh.md`
- `kernel/routing/skill-selection-rules.zh.md`
- `kernel/packets/intent-packet.schema.md`
- `docs/delivery-kernel.md`
- `docs/source-of-truth-map.md`
- `loops/recipes/grill-decision.loop.md`
- `harness/project-onboarding-policy.zh.md`
- `memory/schemas/project-profile.schema.md`
- `evals/output-contract/builder-router.schema.json`
- `evals/onboarding/project-onboarding.cases.json`
- `references/skill-design/skill-design-playbook.zh.md`
