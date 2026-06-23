# Builder Spec 模板

`builder-spec` 输出默认使用这个模板。

```yaml
artifact_type: builder_spec
readiness_gate:
  status: ready | not_ready_for_spec
  missing_inputs:
    - input:
      blocks:
  reason:
reroute_recommendation:
  target_skill: builder-frame | none
  reason:
  next_skill_input:
spec_type: mini_spec | prd | engineering_request | agent_readable_spec | prototype_to_spec
title:
source_context:
  project:
  source_materials:
  upstream_artifact:
source_prototype:
  artifact_path:
  prototype_mode:
  fidelity:
  verification_summary:
extracted_from_prototype:
  covered_flows:
  states_covered:
  prototype_facts:
  inferred_requirements:
prototype_gaps:
  unresolved_flows:
  uncovered_states:
  mock_or_route_gaps:
  data_api_permission_gaps:
prototype_verification:
  evidence:
  manual_checks:
  missing_evidence:
objective:
users:
scope:
  included:
  excluded:
non_goals:
requirements:
  functional:
  non_functional:
  content_or_data:
flows:
  primary:
  alternate:
states:
  loading:
  empty:
  error:
  success:
edge_cases:
acceptance_criteria:
  - id:
    statement:
    evidence:
rejection_criteria:
verification_plan:
  automated_checks:
  manual_checks:
  evidence_required:
assumptions:
open_questions:
risks:
next_skill_hint:
next_skill_input:
  target_skill:
  context:
  scope:
  non_goals:
  acceptance_criteria:
  verification_plan:
  blocking_questions:
```

## 说明

- Requirements 描述必须成立的产品行为，不写未经确认的实现猜测。
- Acceptance criteria 必须可测试。
- Verification 应命名能让 reviewer 信任结果的证据。
- `readiness_gate.status` 为 `not_ready_for_spec` 时，只输出缺口、回退建议和 `next_skill_input`，不要写伪完整 spec。
- `spec_type` 为 `prototype_to_spec` 时，必须保留 prototype provenance：`source_prototype`、`visual_target`、`runnable_evidence`、`design_evidence`、`extracted_from_prototype`、`prototype_gaps` 和 `prototype_verification`。
- 原型中的 gaps 不得直接写成已确认 requirements；必须进入 open questions、risks、non-goals 或 next_skill_input。
