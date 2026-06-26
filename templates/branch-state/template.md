# 分支状态（Branch State）

## Human Decision Summary

- Goal:
- Recommended mode:
- Current baseline:
- Key decisions:
- Non-goals:
- Open blockers:
- Ready for implementation: yes | no
- Human decision needed:

## Agent Execution Contract

```yaml
artifact_type: branch_state
project_anchor:
path_policy:
  preferred_path: .ai-builder/branch-state.md
  fallback_path: docs/branch-state/<branch-or-worktree>.md
  project_agents_md_override: true
  require_human_acceptance_before_creating_new_state_directory: true
branch_or_worktree:
delivery_mode: create | improve | reframe | unknown
last_updated:
state_status: current | stale | archived

runtime_protocol:
  required_for:
    - high_fidelity_prototype
    - multi_turn_goal
    - cross_repo_or_cross_asset
    - context_compaction_risk
    - complex_business_system_task
  read_first_after_recovery: true
  update_triggers:
    - before_context_compaction
    - after_user_decision
    - after_scope_change
    - after_acceptance_change
    - after_major_milestone
    - after_verification
    - before_handoff
  merge_disposition:
    - migrate_stable_decisions_to_source_of_truth
    - archive_branch_state
    - list_unresolved_gaps

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
- 默认优先使用项目 AGENTS.md 指定的 Branch State 路径；没有项目覆盖时，优先提议 `.ai-builder/branch-state.md`。
- fallback path 只能作为 proposal；如果目标项目没有现成状态目录，必须先获得人工接受，不能自动创建新 state directory。
- 多轮 Goal：建议使用。
- 高保真原型：必须使用。
- 跨仓库/跨资产：必须使用。
- 复杂业务系统任务：必须使用，但不得写入领域规则作为通用事实。
- 发生上下文恢复、自动压缩、对话切换、分支切换或阶段切换：必须先读 Branch State。
- 用户决策、范围变化、验收变化、重要实现 milestone、验证完成、handoff 前：必须更新 Branch State。
- review 阶段必须检查 Branch State 是否 `stale`。
- 合并前，长期有效决策必须迁移到正式 source of truth；Branch State 本身应归档或在 handoff 中标记处理方式。

## 质量要求

- 只记录当前分支继续工作所需事实，不写成长复盘。
- `rejected_directions_do_not_retry` 必须保留已否定方向，避免压缩后重复返工。
- `recent_verification_evidence` 必须区分已运行和未运行。
- 不得把 Branch State 当作 source of truth；它是当前工作状态缓存。
