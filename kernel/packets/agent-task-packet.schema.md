# Agent Task Packet Schema（任务包契约）

Agent Task Packet 把人类意图转成 Codex、Claude Code、Qoder、Cursor、Trae、Workbuddy 或通用 agent 可以执行的任务。

```yaml
task_name:
background:
desired_outcome:
scope:
non_goals:
context_sources:
target_runtime:
recommended_mode: prompt | plan | goal | plan_to_goal
runtime_constraints:
plan_prompt:
goal_prompt:
acceptance_criteria:
verification:
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

## 规则

- 任务模糊或跨多个边界时，优先使用 Plan。
- 只有完成状态可验证时，才使用 Goal。
- 必须包含 non-goals 和 forbidden actions。
- 高风险副作用必须设置 human approval gates。
- UI/prototype 任务必须包含 Design Brief、状态覆盖或明确设计约束。
