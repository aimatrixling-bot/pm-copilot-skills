# 模块执行契约（Module Execution Pack）

## Human Decision Summary

- Goal:
- Recommended mode: create | reframe
- Current baseline:
- Key decisions:
- Non-goals:
- Open blockers:
- Ready for implementation: yes | no
- Human decision needed:

## Agent Execution Contract

```yaml
artifact_type: module_execution_pack
title:
delivery_mode: create | reframe
status: draft | accepted | superseded
spec_output_profile: minimal_execution_pack | full_execution_pack
source_context:
  project:
  upstream_artifacts:
  related_docs:

decision_summary:
  one_sentence_goal:
  recommended_direction:
  key_decisions:
    - decision:
      reason:
  rejected_options:
    - option:
      reason:

profile_selection:
  default_profile: minimal_execution_pack
  use_full_profile_when:
    - reframe
    - cross_module_or_cross_repo
    - permission_data_api_audit_or_security_sensitive
    - release_readiness
    - high_fidelity_new_module_with_unclear_target_shape
    - runtime_demo_with_production_boundary_risk
  allowed_degradation: minimal_execution_pack_with_open_questions

objective:
  business_goal:
  user_goal:
  what_this_must_prove:

non_goals:
  - item:
    reason:

users_and_scenarios:
  primary_users:
  secondary_users:
  primary_scenario:
  high_pressure_scenario:
  success_looks_like:

source_assets:
  absorb:
    - source:
      useful_for:
  do_not_copy:
    - source:
      reason:
  pending_judgment:
    - source:
      question:

target_shape:
  page_or_system_type:
  top_area:
  context_area:
  main_area:
  drawer_or_modal:
  audit_or_history_area:
  responsive_behavior:

domain_semantics:
  core_objects:
  stable_terms:
  concepts_not_to_confuse:
  invariants:
    - rule:
      check:

information_architecture:
  first_view_hierarchy:
  navigation:
  content_priority:
  empty_loading_error_states:

field_contract:
  - field:
    business_purpose:
    priority: P0 | P1 | P2 | P3
    source:
    display_rule:
    responsive_rule:

action_contract:
  primary_actions:
  row_or_item_actions:
  bulk_actions:
  disabled_states:
  dangerous_actions:
  unimplemented_behavior_policy:

state_flow_contract:
  lifecycle_states:
  operational_states:
  allowed_transitions:
  forbidden_transitions:
  audit_rules:

acceptance:
  functional:
  visual_or_experience:
  business_semantic:
  responsive:
  code_or_artifact_quality:

verification:
  commands:
  screenshot_or_browser_checks:
  manual_checks:
  evidence_required:

definition_sync:
  expected_check: templates/definition-drift-check/template.md
  docs_to_update_if_changed:
  rules_to_capture_if_repeated:
  branch_state_required: true | false

open_questions:
  - question:
    owner:
    blocks_implementation: true | false

handoff_targets:
  next_skill:
  agent_task_ready: true | false
  review_required: true | false
```

## 使用规则

- 新建模式 `create` 和重塑模式 `reframe` 使用本模板。
- 本模板是 agent 可执行契约，不是长 PRD。
- 默认使用 `minimal_execution_pack`，只在重塑、发布就绪、跨模块/跨仓库、权限/数据/API/审计/安全敏感、目标形态不清的新高保真模块，或有生产边界风险的 runtime demo 使用 `full_execution_pack`。
- 如果目标、用户、non-goals、验收或验证方式缺失，不应进入实现。
- 如果旧资产之间冲突，先在 `source_assets.pending_judgment` 和 `open_questions` 中标出，不要伪造确定性。
- 修改实现后必须用 Definition Drift Check 判断定义是否需要同步。
