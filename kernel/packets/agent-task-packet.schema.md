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
task_pack_identity:
  id:
  source_artifact:
  delivery_track: prd_spec | prototype | product
human_view:
  summary:
  decision_points:
agent_view:
  execution_contract:
  context_pack:
knowledge_context:
  required_layers:
  read_policy:
scope:
non_goals:
context_sources:
target_runtime:
recommended_mode: prompt | plan | goal | plan_to_goal
delegation_mode: afk_ready | hitl_checkpoint_required | blocked
slice_plan:
  strategy: vertical_slice | tracer_bullet | horizontal_layer | investigation_only
  first_slice:
  preserves:
  stop_after:
hitl_checkpoints:
  - checkpoint:
    required_before:
    owner:
verification_policy:
  minimum_checks:
  observable_evidence:
  cannot_claim_done_without:
human_transparency_protocol:
  announce_mode_and_risks: true | false
  report_verification_gaps_before_completion: true | false
  stop_and_ask_when:
anti_evasion_checks:
  red_flags:
  forbidden_completion_claims:
self_improvement_triggers:
  repeated_failure:
  template_gap:
  script_or_eval_candidate:
runtime_constraints:
plan_prompt:
goal_prompt:
acceptance_criteria:
verification:
artifact_index_update_proposal: none | proposed_changes
design_brief:
design_constraints:
ui_states:
design_plan:
ui_content_boundary:
business_rule_notes:
rule_notes_placement: below_interface | side_panel | linked_doc | not_applicable
non_ui_explanations:
prototype_evidence_requirements:
product_logic_containment_gate:
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
- 必须包含 task_pack_identity、human_view、agent_view、knowledge_context、delegation_mode、slice_plan、hitl_checkpoints、verification_policy、human_transparency_protocol、anti_evasion_checks 和 self_improvement_triggers。
- 传统 issue/ticket 不能替代 Agent Task Packet；任务包必须同时服务 Human View 和 Agent View。
- knowledge_context 必须说明 L0-L4 哪些层需要读取，以及为什么不能默认全量读取项目 docs。
- 高风险副作用必须设置 human approval gates。
- 执行 agent 不能用局部检查、旧日志、agent 自报成功、截图观感或 validator 通过替代完成证据。
- self_improvement_triggers 只记录触发条件，不自动写 rule、template、script、eval 或 skill。
- UI/prototype 任务必须包含 Design Brief、状态覆盖或明确设计约束。
- UI/prototype 任务必须传递 Product Logic Containment Gate，要求业务规则说明与界面本体分离。
- 高保真原型或可运行 demo 任务必须包含 `design_plan` 或要求执行 agent 先补 Design Plan。
- 涉及项目资产写入、替代、归档或清理时，必须要求执行 agent 在 Output Packet 中提交 `artifact_index_update_proposal`。
- `artifact_index_update_proposal` 只描述建议更新，不授权自动删除、自动迁移或自动提升为 `current`。
- 缺少 frame/spec、验收标准、验证方式、目标 runtime 或 stop conditions 时，输出 `not_ready_for_agent_task` 和 `reroute_recommendation`，不要生成伪可执行任务包。
