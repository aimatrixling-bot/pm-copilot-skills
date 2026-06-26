# 变更契约（Change Contract）

## Human Decision Summary

- Goal:
- Recommended mode: improve
- Current baseline:
- Key decisions:
- Non-goals:
- Open blockers:
- Ready for implementation: yes | no
- Human decision needed:

## Agent Execution Contract

```yaml
artifact_type: change_contract
title:
delivery_mode: improve
status: draft | accepted | superseded
spec_output_profile: micro_note | lite_change_contract | minimal_change_contract | standard_change_contract | full_change_contract
source_context:
  project:
  current_baseline_artifacts:
  related_docs:

profile_selection:
  default_profile: lite_change_contract | minimal_change_contract
  use_micro_note_when:
    - one_or_two_files
    - copy_style_or_small_ui_only
    - no_domain_state_route_or_target_shape_change
  use_lite_profile_when:
    - local_ui_or_interaction_change
    - expected_files_touched_up_to_5
    - low_regression_risk
  use_standard_profile_when:
    - cross_component_state_or_flow
    - domain_semantic_change
    - route_or_navigation_classification_change
  use_full_profile_when:
    - cross_module_or_cross_repo
    - permission_data_api_audit_or_security_sensitive
    - release_readiness
    - high_fidelity_new_module_with_unclear_target_shape
    - runtime_demo_with_production_boundary_risk
    - reframe_risk_detected
  allowed_degradation: minimal_change_contract_with_open_questions

scope_boundary:
  allowed_files_or_areas:
  max_expected_files_touched:
  requires_human_approval_if:
    - touches_files_outside_allowed_scope
    - exceeds_max_expected_files_touched
    - changes_IA_state_model_page_type_domain_semantics_or_navigation_classification
    - introduces_API_data_permission_audit_or_release_boundary
  reframe_risk: none | low | medium | high

current_baseline:
  route_or_surface:
  current_behavior:
  current_visual_or_structure:
  current_data_or_state_contract:
  known_problem:
  evidence:

change_goal:
  what_should_change:
  why_now:
  expected_improvement:

non_goals:
  explicitly_not_changing:
  not_in_this_iteration:
  escalation_if_needed:

preserve:
  must_keep:
  must_not_regress:
  existing_patterns_to_reuse:

change:
  modify:
  remove_or_weaken:
  simplify:
  rename_or_reorder:

do_not_touch:
  files_or_modules:
  flows:
  routes:
  styles:
  data_contracts:
  business_rules:

impact_analysis:
  affected_components:
  affected_data:
  affected_tests:
  affected_docs:
  risk_flags:

acceptance:
  before_after_expectation:
  functional_checks:
  visual_or_experience_checks:
  regression_checks:
  business_semantic_checks:

verification:
  commands:
  screenshot_or_browser_checks:
  manual_checks:
  evidence_required:

definition_sync:
  expected_check: templates/definition-drift-check/template.md
  allowed_drift:
  docs_to_update_if_changed:
  agents_md_update_policy: do_not_update_by_default | propose_only_after_repeated_agent_boundary_failure
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

- 迭代模式 `improve` 使用本模板。
- 默认使用 `micro_note`、`lite_change_contract` 或 `minimal_change_contract` 中最轻可验收档位；只有发布就绪、跨模块/跨仓库、权限/数据/API/审计/安全敏感、目标形态不清的新高保真模块、runtime demo 有生产边界风险，或存在重塑风险时才使用 `full_change_contract`。
- `micro_note` / `lite_change_contract` 必须声明 `allowed_files_or_areas`、`max_expected_files_touched`、`requires_human_approval_if` 和 `reframe_risk`，并默认不触发 Branch State。
- `reframe_risk` 只有在 IA、状态模型、页面类型、领域语义、导航分类或 target shape 可能变化时才升级；纯 UI icon/copy/spacing 对齐不应自动升级 reframe。
- 先捕获当前基线，再定义差异；不要把局部优化扩成重塑任务。
- 如果本次变更会改变核心 IA、领域语义、跨模块契约或目标形态，应切换到重塑模式 `reframe`。
- Definition Sync 默认不更新 `AGENTS.md`；只有反复 agent boundary failure 或仓库级协作纪律缺口时才 proposal-only 建议更新，否则优先更新 UI/UX standard、组件约定、模块 spec 或本 Change Contract。
- 完成前必须用 Definition Drift Check 对照 preserve、change、do_not_touch 和 acceptance。
