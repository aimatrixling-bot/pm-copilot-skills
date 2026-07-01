---
name: builder-router
displayName: Builder Router
description: "Use when 用户给出宽泛、模糊或多阶段的 AI Builder OS 构建请求，需要路由到对应 builder skill；适用于不知道下一步该 frame、spec、prototype、agent task、review、decision，或需要选择 Prompt / Plan / Goal / Plan 到 Goal、生成 handoff 路径。不要用于已明确要求产出 Feature Frame、spec、prototype、Agent Task Packet、review report 或 Decision Record 的请求；这类请求应直接交给对应 builder skill。"
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
- 用户没有显式提到 AI Builder OS，但请求本质上是宽泛、多阶段或需要 formal builder workflow 的产品/构建任务。
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

Router 必须先判断任务复杂度，再决定四块用户可见正文和内部 trace 的边界。内部可以保留完整 `delivery_decision`，但用户可见输出按 `response_profile` 降噪。

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

- 默认用户可见正文只使用四个块：`理解`、`下一步`、`需要决定`、`验收`；没有待决事项时，在 `需要决定` 写“无”。
- `terse` 只在四个块内给最小判断，不展示 `delivery_mode`、`task_complexity`、`contract_profile` 等字段名。
- `normal` 仍只使用四个块，可在块内补充紧凑理由、关键边界和验证建议。
- `audit` 也先保持四个块；只有审查、复盘、冲突、release、definition drift 或用户明确要求时，才在正文后追加审计附录。
- `task_complexity`、`response_profile`、`contract_profile`、`context_strategy`、`delivery_decision`、usage metrics、memory/evidence 默认进入内部 trace 或 handoff artifact，不直接作为用户正文展开。
- 用户只问“你能理解吗”时，默认不要展示完整 Router 决策；只有审查、复盘、冲突、release、definition drift 或用户明确要求时才使用 `audit`。

## Delivery Decision 判断

当请求已经进入具体交付任务时，必须形成结构化 `delivery_decision`，但默认放入内部 trace 或 handoff artifact，不直接在用户正文展开 YAML/JSON 字段。

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
4. 对具体交付任务生成内部 `delivery_decision`，包括 primary / secondary mode、confidence、首个产物、切换条件和停止条件。
5. 识别缺失上下文和风险标记。
6. 推荐一条路径，并说明原因。
7. 提供可复制的下一步提示词或 handoff packet。

## 输出契约

默认用户可见正文：

```markdown
**理解**

**下一步**

**需要决定**

**验收**
```

内部 trace / handoff artifact：

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
- 首次进入项目时必须在内部 trace 标记 `project_mode`；非 onboarding 场景使用 `not_applicable`，用户可见正文只解释判断结果。
- 具体交付任务必须生成内部 `delivery_decision`；非交付场景使用 `delivery_mode: not_applicable` 或说明原因。
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

## Skill Hardening Brief

```yaml
skill_name: builder-router
primary_artifact: intent-packet.yaml + routing-decision（用户可见四块正文 + 内部 trace）
target_users:
  - 不知道该用哪个 builder skill 的用户
  - 首次进入项目或恢复 .ai-builder/ 状态的 agent
  - 需要从自然语言进入 AI Builder OS 的非程序员
baseline_failure_scenarios:
  - 把模糊大型任务直接路由到 Goal，跳过 frame/spec
  - 把日常建议强行触发 builder workflow（过度包装）
  - brownfield 场景自动扫描全盘或自动迁移资产
  - 用户已显式 call 下游 skill 但输入不成熟时，未输出 reroute 建议
trigger_conditions:
  explicit:
    - 用户问"我应该用哪个 skill / 模式"
    - 用户给出模糊、宽泛、多阶段请求
    - 项目首次进入或恢复 .ai-builder/ 状态
  implicit:
    - 请求本质是产品/构建任务但未指明 skill
    - 跨 framing/spec/prototype/agent_task/review/decision 多阶段
  adjacent_skill_boundaries:
    - builder-plan-goal：用户明确问 Prompt/Plan/Goal 模式选择 → plan-goal
    - builder-frame：用户已明确要 Feature Frame → 直接 frame
non_trigger_conditions:
  - 简单事实问答
  - 用户已显式 call 更具体的 skill 且范围清楚
  - 轻量文案润色或日常讨论
mode_decision:
  - answer / prompt / plan / goal / plan_to_goal / skill_route / ask_first
  - delivery_decision: create / improve / reframe / improve_with_reframe_risk / create_with_brownfield_references / reframe_blocked_until_target_shape / unknown
quality_gates:
  - 不把大型模糊任务直接路由到 Goal
  - 风险影响业务/安全/权限/生产/数据时先询问或路由到 Plan
  - 首次进入项目必须输出 project_mode（内部 trace）
  - 具体交付任务必须生成 delivery_decision（内部 trace）
  - improve 任务出现 IA/状态模型/页面类型/领域语义变化风险时必须标记 secondary_mode: reframe
red_flags:
  - 用户可见正文展开 delivery_mode / contract_profile 字段名（terse/normal profile 不该展示）
  - project_profile_proposal 声称已创建 .ai-builder/
  - brownfield 自动扫描全盘
anti_evasion_rules:
  - 不得用"看起来路由合理"掩盖未实际检查 project_mode
  - 不得把 delivery_decision 包装成已确认决策
  - 不得声称 runtime 会自动连续执行多个 skill
done_when:
  - 用户可见四块正文（理解/下一步/需要决定/验收）已填
  - 内部 trace 含 route_type / recommended_skill / delivery_decision（若涉及交付）
  - next_skill_input 已准备
open_questions:
  - response_profile 自动升级条件是否需要更明确
```

## Meta-Review

何时该被 builder-review 复审：

- routing 决定导致下游 skill 反复 reroute（说明 router 判断不准）
- 用户连续 2 次说"你路由错了"
- project_mode 判断与实际项目状态不一致

已知 false-positive 场景：

- 用户问"你能做 X 吗"被路由到具体 builder skill，实际只需 answer 模式

已知 false-negative 场景：

- 用户已用 `/builder-X` 显式调用但输入不成熟，router 未识别为 reroute 场景

## Evolution Writeback

本 skill 的稳定决策应迁移到以下 source-of-truth（参考 `docs/source-of-truth-map.md`）：

- 路由规则 → `kernel/routing/builder-router.zh.md` / `kernel/routing/skill-selection-rules.zh.md`
- Intent Packet 定义 → `kernel/packets/intent-packet.schema.md`
- Delivery Kernel 判断 → `docs/delivery-kernel.md`
- 项目 onboarding 政策 → `harness/project-onboarding-policy.zh.md`

## 示例

**示例**（should_trigger / 用户显式触发）**: 用户输入 `/builder-router 我想做一个宠物领养匹配小程序`。router 把 Intent Packet 标记为 `trigger_source=user_explicit`、`complexity_hint=unknown`，路由到 `builder-plan-goal` 形成 Plan Brief，不直接跳到 prototype。

**示例**（should_not_trigger / 已有 spec 直接消费）**: 用户输入 "基于这份已确认的 PRD 直接出工程请求"。router 检测到已有 spec readiness，跳过 frame/plan-goal，直接路由到 `builder-spec` 的 `engineering_request` profile。

**示例**（adjacent-skill 分流）**: 用户输入 "帮我评审这份 prototype 是否符合 Design Brief"。router 识别评审意图，路由到 `builder-review`，不在 router 层做评审。

**示例**（high-risk ask-first）**: 用户输入 "把这个 demo 直接发到生产环境"。router 检测到生产边界 + 数据/权限风险，不直接路由，先 ask_user 确认 release gate、回滚预案和 sign-off owner。

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
