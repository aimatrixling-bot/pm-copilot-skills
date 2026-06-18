---
name: builder-agent-task
displayName: Agent Task Packet
description: "把已接受的 Feature Frame、spec、prototype、Design Brief 或项目上下文转成 Codex、Claude Code、Qoder、Cursor、Trae、Workbuddy 或通用 agent 可执行的 Agent Task Packet。适用于用户要交给另一个 agentic 工具执行，并需要目标 runtime、验收标准、验证命令、工具边界、human approval gate、forbidden actions 和 stop condition。不要用于判断 Prompt/Plan/Goal 模式；先用 builder-plan-goal。不要用于本地直接实现。"
user-invocable: true
argument-hint: "[任务、spec、产物路径或目标 runtime]"
---

# Builder Agent Task

## 使命

创建一个其他 agentic runtime 可以安全、可验证执行的 Agent Task Packet。

## 资源读取

- 创建任务包时，读取 `templates/agent-task-packet/template.md` 和 `kernel/packets/agent-task-packet.schema.md`。
- 判断 Prompt / Plan / Goal / Plan -> Goal 时，读取 `kernel/routing/plan-goal-routing.zh.md`。
- 目标 runtime 已知时，读取 `adapters/` 中对应说明。
- 任务涉及 UI、prototype 或产品界面时，读取 `templates/design-brief/template.md`、`references/ui-ux/` 和 `kernel/gates/design-consistency-gate.zh.md`。
- 任务会创建、修改、替代、归档或清理项目资产时，读取 `harness/artifact-write-policy.zh.md`、`memory/schemas/artifact-index.schema.md` 和 `kernel/packets/output-packet.schema.md`。
- 打磨或评审 skill 设计时，读取 `references/skill-design/skill-design-playbook.zh.md`。

## 何时使用

- 用户想把工作交给 Codex、Claude Code、Qoder、Cursor 或类似工具。
- 用户已有 spec/prototype/frame，需要执行提示词。
- 非程序员需要清晰的 agent 指令和验收标准。
- 任务包内部需要包含 Prompt/Plan/Goal 路由。
- 用户需要把多个上游产物合并成一个可复制的 agent handoff。

## 何时不要使用

- 用户只需要产品 framing。
- 任务缺少足够上下文，无法创建验收标准；应使用 `builder-plan-goal` 或 `builder-router`。
- 请求要求在当前仓库直接本地实现。
- 用户需要的是评审结果，而不是执行任务包；应使用 `builder-review`。
- 用户需要记录方案取舍；应使用 `builder-decision`。

## 输入

- 期望结果。
- 背景和上下文来源。
- 范围和 non-goals。
- 目标 runtime。
- 验收标准和验证方式。
- 允许工具和禁止动作。
- 当任务包含 UI、prototype 或产品界面时，提供 Design Brief 和 UI/UX 约束。
- 当任务会产生项目资产时，提供预期产物路径、资产类型和 source-of-truth 关系；如果未知，在 task packet 中标记为待执行 agent 提交 proposal。

## 模式判断

- `prompt`：小任务，单次指令即可完成。
- `plan`：上下文、影响面、实现方案或验证方式需要先侦察。
- `goal`：目标、范围、Done when 和 Verification 已清楚。
- `plan_to_goal`：任务大，需要先计划再执行一个里程碑。
- `ask_first`：缺少业务、安全、权限、生产、数据或发布批准。

## 执行流程

1. 捕获任务目标和目标 runtime。
2. 判断推荐模式：Prompt、Plan、Goal 或 Plan -> Goal。
3. 创建范围、non-goals、上下文来源和验证方式。
4. 如果涉及 UI/UX，附上 Design Brief、组件约束、交互状态和 Design Consistency Gate 期望。
5. 如果任务会写入或改变项目资产，补充 `artifact_index_update_proposal`，说明预计新增、更新、替代、归档或禁止删除的资产。
6. 补充 human approval gates 和停止条件。
7. 需要时产出可复制的 Plan/Goal 提示词。

## 输出契约

```yaml
task_name:
background:
desired_outcome:
scope:
non_goals:
context_sources:
target_runtime:
recommended_mode:
runtime_constraints:
plan_prompt:
goal_prompt:
acceptance_criteria:
verification:
artifact_index_update_proposal:
design_brief:
design_constraints:
ui_states:
design_consistency_gate:
allowed_tools:
forbidden_actions:
human_approval_gates:
risks:
blocked_stop_condition:
handoff_packet:
```

## 质量门禁

- 必须包含 non-goals。
- 必须包含验证方式。
- 高风险工作必须列出 forbidden actions。
- 不要要求 agent 代替人做尚未解决的业务决策。
- UI/prototype 任务必须包含 Design Brief 或明确设计约束。
- Agent 指令必须区分真实实现、mock 数据、demo-only 交互和 review-only 产物。
- 任何 Goal 指令必须包含 Done when、Verification 和 blocked stop condition。
- 涉及项目资产写入时，必须要求执行 agent 在 Output Packet 中提交 `artifact_index_update_proposal`；该字段可以是 `none`，但不得缺失。
- `artifact_index_update_proposal` 只能是建议，不能授权自动删除、自动迁移或自动提升为 `current`。
- 不要把“你看着办”包装成可执行任务；必须补充或标记 missing context。

## 交接

输出本身就是 handoff。当目标 runtime 已知时，补充 `adapters/` 中对应 runtime 的说明，并保留 context_sources、non_goals、acceptance_criteria、verification、artifact_index_update_proposal、human_approval_gates、forbidden_actions 和 blocked_stop_condition。

## 参考

- `kernel/packets/agent-task-packet.schema.md`
- `kernel/packets/output-packet.schema.md`
- `kernel/routing/plan-goal-routing.zh.md`
- `kernel/gates/design-consistency-gate.zh.md`
- `harness/artifact-write-policy.zh.md`
- `memory/schemas/artifact-index.schema.md`
- `templates/agent-task-packet/template.md`
- `templates/design-brief/template.md`
- `references/ui-ux/`
- `adapters/`
- `evals/output-contract/agent-task-packet.schema.json`
- `references/skill-design/skill-design-playbook.zh.md`
