# 定义漂移检查（Definition Drift Check）

## Human Decision Summary

- Goal:
- Recommended mode:
- Current baseline:
- Key decisions:
- Non-goals:
- Open blockers:
- Ready for review / merge: yes | no
- Human decision needed:

## Agent Execution Contract

```yaml
artifact_type: definition_drift_check
title:
delivery_mode: create | improve | reframe | unknown
source_contracts:
  - path:
    type: module_execution_pack | change_contract | spec | design_brief | agent_task_packet | other
    status:

actual_delivery:
  summary:
  files_or_artifacts_changed:
  behavior_changed:
  evidence:

non_goals:
  respected:
  violated:
  needs_escalation:

acceptance:
  accepted_items_met:
  accepted_items_partial:
  accepted_items_not_met:

verification:
  completed:
  partial:
  missing:

contract_alignment:
  matches_objective: true | false | partial
  matches_scope: true | false | partial
  respects_non_goals: true | false | partial
  meets_acceptance: true | false | partial
  verification_complete: true | false | partial

mode_switch_assessment:
  original_mode: create | improve | reframe | prototype_first | boundary_first | spec_first | unknown
  actual_mode: create | improve | reframe | prototype_first | boundary_first | spec_first | unknown
  should_switch_mode: true | false
  reason:
  recommended_next_artifact: module_execution_pack | change_contract | design_brief | spec | decision_record | branch_state | none

drift_classification:
  implementation_adjustments:
    - change:
      reason:
      docs_update_needed: true | false
  spec_gaps:
    - gap:
      recommended_update:
      blocks_next_step: true | false
  requirement_changes:
    - change:
      requires_human_acceptance: true | false
      docs_to_update:
  conflicts_or_contradictions:
    - conflict:
      evidence:
      required_decision:

definition_sync:
  docs_to_update:
    - path:
      reason:
      priority: required | proposed | later
  rules_to_capture:
    - target: gate | loop | template | skill | eval | none
      rule:
      reason:
  artifact_index_update_proposal: none | proposed_changes

remaining_gaps:
  - gap:
    owner:
    blocks_review_or_merge: true | false

decision:
  can_enter_review: true | false
  can_merge_or_promote: true | false
  next_milestone_ready: true | false
  rationale:
```

## 必答问题

- 实现实际交付了什么？
- 是否符合 Module Execution Pack / Change Contract？
- 哪些定义发生变化？
- 哪些变化只是实现细节？
- 哪些变化属于 spec gap？
- 哪些变化属于 requirement change？
- 是否存在 conflict / contradiction？
- 哪些文档需要更新？
- 哪些规则应沉淀到 gate / loop / template / skill？
- 哪些缺口仍未解决？
- 是否可以进入 review / merge / next milestone？
- 任务是否从 improve 漂移成 reframe？
- 任务是否从 prototype-first 漂移成 spec-first？
- 局部改动是否已经变成全局重塑？

## 使用规则

- 完成前检查使用本模板。
- 不得把实现结果自动升级为需求事实。
- 不得把测试通过当成无漂移证明。
- 若 `mode_switch_assessment.should_switch_mode` 为 true，review 不能直接 approve，必须先补推荐的下一产物或取得人工决策。
- 出现 conflict / contradiction 时，默认不能进入 merge 或 promotion。
- 涉及 artifact index、归档、清理或 source-of-truth 状态时，只能输出 proposal。
