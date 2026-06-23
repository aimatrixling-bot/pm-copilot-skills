# 分支状态（Branch State）

```yaml
artifact_type: branch_state
project_anchor:
branch_or_worktree:
delivery_mode: create | improve | reframe | unknown
last_updated:

frozen_decisions:
  - decision:
    source:
    must_preserve: true | false

current_scope:
  in:
  out:
  current_focus:

non_goals:
  not_in_current_cycle:
  forbidden_expansion:
  must_not_retry:

current_implementation_status:
  completed:
  in_progress:
  not_started:
  known_gaps:

acceptance:
  current_cycle_acceptance:
  blocked_items:
  human_review_needed:

verification:
  required_before_handoff:
  current_evidence_status:
  missing_evidence:

definition_sync:
  source_contract:
  drift_check_required: true | false
  docs_to_update_if_scope_changed:

rejected_directions_do_not_retry:
  - direction:
    reason:

open_questions:
  - question:
    owner:
    blocks_next_step: true | false

next_step:
  exact_action:
  target_file_or_artifact:
  recommended_skill_or_runtime:

recent_verification_evidence:
  commands_run:
  screenshots_or_browser_checks:
  manual_checks:
  not_run:

handoff_note:
  read_first:
  preserve:
  risks:
  stop_conditions:
```

## 使用规则

- 普通小改：可不用。
- 多轮 Goal：建议使用。
- 高保真原型：必须使用。
- 跨仓库/跨资产：必须使用。
- 发生上下文压缩、对话切换、分支切换或阶段切换：必须更新。

## 质量要求

- 只记录当前分支继续工作所需事实，不写成长复盘。
- `rejected_directions_do_not_retry` 必须保留已否定方向，避免压缩后重复返工。
- `recent_verification_evidence` 必须区分已运行和未运行。
- 不得把 Branch State 当作 source of truth；它是当前工作状态缓存。
