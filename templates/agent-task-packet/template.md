# Agent Task Packet 模板

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
  target_skill:
  context:
  missing_inputs:
  recommended_mode:
  blocking_questions:
handoff_packet:
```
