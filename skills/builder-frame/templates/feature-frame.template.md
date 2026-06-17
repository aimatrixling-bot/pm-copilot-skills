# Feature Frame 模板

`builder-frame` 输出默认使用这个模板。

```yaml
artifact_type: feature_frame
title:
source_context:
  project:
  requester:
  source_materials:
problem:
  statement:
  evidence:
  why_now:
user:
  primary_user:
  secondary_users:
  affected_roles:
scenario:
  current_situation:
  trigger:
  desired_flow:
current_pain:
  pain_points:
  impact:
desired_outcome:
core_capability:
magic_moment:
non_goals:
success_criteria:
  - criterion:
    evidence:
constraints:
facts:
assumptions:
open_questions:
spec_readiness:
  status: ready | needs_clarification | not_ready
  reason:
next_skill_hint:
```

## 说明

- 保持 problem-first，不要直接跳到 UI 页面或实现任务。
- 如果证据较弱，清楚标注，不要写成已证实事实。
- `magic_moment` 描述目标用户真正感受到产品价值的那一刻。
