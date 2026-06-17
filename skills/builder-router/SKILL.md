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
- 路由边界或 skill hardening 场景不清时，读取 `references/skill-design/skill-design-playbook.zh.md`。

## 何时使用

- 用户给出的是模糊想法、需求、项目或 agentic coding 任务。
- 用户询问应该使用什么模式或 skill。
- 任务可能需要 Plan、Goal 或 Plan -> Goal。
- 请求横跨 framing、spec、prototype、agent task、review 或 decision。
- 用户需要从自然语言入口进入 AI Builder OS，但不应该先记住 skill 名称。

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

## 模式判断

按以下顺序判断：

1. `answer`：可以直接回答，且不需要构建产物。
2. `prompt`：小而清楚的一次性 agent 指令。
3. `plan`：目标、范围、代码库、约束或验收还不清楚。
4. `goal`：目标清楚、边界明确、完成状态可验证。
5. `plan_to_goal`：目标大、跨模块、跨产物或需要多个里程碑。
6. `skill_route`：用户需要明确产物，交给对应 `builder-*` skill。
7. `ask_first`：缺少会改变方向的业务、安全、权限、数据或发布决策。

## 执行流程

1. 捕获 Intent Packet。
2. 判断请求应走 Prompt、Plan、Goal、Plan -> Goal，还是某个 builder skill。
3. 识别缺失上下文和风险标记。
4. 推荐一条路径，并说明原因。
5. 提供可复制的下一步提示词或 handoff packet。

## 输出契约

```yaml
route_type: answer | prompt | plan | goal | plan_to_goal | skill_route | ask_first
recommended_mode:
recommended_skill:
reasoning_summary:
missing_context:
risk_flags:
next_prompt:
handoff_packet:
```

## 质量门禁

- 不要把大型模糊任务直接路由到 Goal。
- 不要为日常建议强行触发 builder workflow。
- 如果风险影响业务、安全、权限、生产或数据行为，先询问或路由到 Plan。
- 必须解释为什么不是相邻路径，特别是 `builder-frame` vs `builder-spec`、`builder-prototype` vs `builder-agent-task`、`builder-review` vs `builder-decision`。
- 路由结果必须包含下一步可执行动作，而不是只给 skill 名称。

## 交接

把 Intent Packet、推荐路径、缺失上下文、风险标记和下一步提示词交给选定的 `builder-*` skill。

## 参考

- `kernel/routing/builder-router.zh.md`
- `kernel/routing/plan-goal-routing.zh.md`
- `kernel/routing/skill-selection-rules.zh.md`
- `kernel/packets/intent-packet.schema.md`
- `evals/output-contract/builder-router.schema.json`
- `references/skill-design/skill-design-playbook.zh.md`
