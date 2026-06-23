# 变更契约（Change Contract）

```yaml
artifact_type: change_contract
title:
delivery_mode: improve
status: draft | accepted | superseded
source_context:
  project:
  current_baseline_artifacts:
  related_docs:

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
- 先捕获当前基线，再定义差异；不要把局部优化扩成重塑任务。
- 如果本次变更会改变核心 IA、领域语义、跨模块契约或目标形态，应切换到重塑模式 `reframe`。
- 完成前必须用 Definition Drift Check 对照 preserve、change、do_not_touch 和 acceptance。
