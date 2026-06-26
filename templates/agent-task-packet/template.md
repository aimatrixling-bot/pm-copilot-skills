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
branch_state_policy:
  required: true | false
  path_policy:
    preferred_path: .ai-builder/branch-state.md
    fallback_path: docs/branch-state/<branch-or-worktree>.md
    project_agents_md_override: true
    require_human_acceptance_before_creating_new_state_directory: true
  file_path:
  create_before_implementation: true | false
  update_triggers:
    - before_context_compaction
    - after_user_decision
    - after_scope_change
    - after_acceptance_change
    - after_major_milestone
    - after_verification
    - before_handoff
  recovery_instruction:
  merge_disposition:
    - migrate_stable_decisions_to_source_of_truth
    - archive_branch_state
    - list_unresolved_gaps
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
