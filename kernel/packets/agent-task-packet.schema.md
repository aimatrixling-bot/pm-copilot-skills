# Agent Task Packet Schema（任务包契约）

Agent Task Packet 把人类意图转成 Codex、Claude Code、Qoder、Cursor、Trae、Workbuddy 或通用 agent 可以执行的任务。

```yaml
readiness_gate:
  status: ready | not_ready_for_agent_task
  missing_inputs:
    - input:
      blocks:
  reason:
reroute_recommendation:
  target_skill: builder-frame | builder-spec | builder-plan-goal | none
  reason:
  next_skill_input:
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
artifact_index_update_proposal: none | proposed_changes
design_brief:
design_constraints:
ui_states:
design_consistency_gate:
allowed_tools:
forbidden_actions:
human_approval_gates:
risks:
blocked_stop_condition:
next_skill_input:
handoff_packet:
```

## 规则

- 任务模糊或跨多个边界时，优先使用 Plan。
- 只有完成状态可验证时，才使用 Goal。
- 必须包含 non-goals 和 forbidden actions。
- 高风险副作用必须设置 human approval gates。
- UI/prototype 任务必须包含 Design Brief、状态覆盖或明确设计约束。
- 涉及项目资产写入、替代、归档或清理时，必须要求执行 agent 在 Output Packet 中提交 `artifact_index_update_proposal`。
- `artifact_index_update_proposal` 只描述建议更新，不授权自动删除、自动迁移或自动提升为 `current`。
- 缺少 frame/spec、验收标准、验证方式、目标 runtime 或 stop conditions 时，输出 `not_ready_for_agent_task` 和 `reroute_recommendation`，不要生成伪可执行任务包。
