# Builder Spec 模板

`builder-spec` 输出默认使用这个模板。

```yaml
artifact_type: builder_spec
spec_type: mini_spec | prd | engineering_request | agent_readable_spec
title:
source_context:
  project:
  source_materials:
  upstream_artifact:
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
```

## 说明

- Requirements 描述必须成立的产品行为，不写未经确认的实现猜测。
- Acceptance criteria 必须可测试。
- Verification 应命名能让 reviewer 信任结果的证据。
