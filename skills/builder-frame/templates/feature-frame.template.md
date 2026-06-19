# Feature Frame 模板

`builder-frame` 输出默认使用这个模板。

```yaml
artifact_type: feature_frame
frame_mode: idea_frame | problem_frame | opportunity_frame | grill_frame | not_ready_for_spec
title:
source_context:
  project:
  requester:
  source_materials:
shared_understanding:
  summary:
  agreed_direction:
  unresolved_boundary:
decision_tree:
  - decision:
    options:
      - option:
        tradeoff:
    recommended_default:
    blocks: frame | spec | prototype | agent_task | decision | review
    needs_human_decision: true | false
critical_questions:
  - question:
    why_it_matters:
    recommended_answer:
recommended_defaults:
  - assumption:
    reason:
    safe_to_use_until:
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
human_decision_points:
  - decision:
    owner:
    blocks:
stable_terms:
  - term:
    meaning:
    avoid:
frame_confidence:
  level: high | medium | low
  reason:
blocking_questions:
  - question:
    blocks: frame | spec | prototype | agent_task | decision | review
    recommended_default:
evidence_needed:
  - evidence:
    purpose:
spec_readiness:
  status: ready | needs_clarification | not_ready
  reason:
next_skill_hint:
next_skill_input:
  target_skill:
  context:
  facts:
  assumptions:
  non_goals:
  success_criteria:
  blocking_questions:
```

## 说明

- 保持 problem-first，不要直接跳到 UI 页面或实现任务。
- 如果证据较弱，清楚标注，不要写成已证实事实。
- `magic_moment` 描述目标用户真正感受到产品价值的那一刻。
- `grill_frame` 模式下可以先输出 `decision_tree`、`critical_questions`、`recommended_defaults` 和 `blocking_questions`，不必假装已经 spec-ready。
- `next_skill_input` 必须让下游 skill 可以直接继续，而不是只给出 skill 名称。
