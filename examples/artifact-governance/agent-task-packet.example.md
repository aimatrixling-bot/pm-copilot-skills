# Agent Task Packet 示例

本示例展示 `builder-agent-task` 如何把当前项目的 Artifact Governance Milestone 3A/3B/3C 转成可执行任务包。

```yaml
task_name: "AI Builder OS Artifact Governance Milestone 3A-3C"
background:
  - "AI Builder OS 当前保持 8 个 active builder skills。"
  - "Milestone 1/2 已补充 Artifact Governance 文档协议、Harness 写入纪律、Artifact Hygiene Loop 和 artifact eval cases。"
  - "当前目标是让 artifact eval 可验证，并让 review/task packet 接入 artifact governance 的最小闭环。"
desired_outcome:
  - "新增轻量 Artifact Eval Validator。"
  - "builder-review 在交付物评审中引用 Artifact Hygiene Loop。"
  - "builder-agent-task 要求 Output Packet 包含 artifact_index_update_proposal。"
scope:
  - "新增 scripts/validate-artifact-evals.js。"
  - "更新 package scripts 和 validate:builder-os 接入。"
  - "更新 builder-review、builder-agent-task、相关模板和 packet schema。"
non_goals:
  - "不新增第 9 个 core skill。"
  - "不实现真实文件扫描。"
  - "不自动清理、删除、迁移或归档资产。"
  - "不让 Artifact Hygiene Loop 自动执行。"
context_sources:
  - "memory/schemas/artifact-index.schema.md"
  - "memory/policies/artifact-lifecycle-policy.zh.md"
  - "memory/policies/artifact-cleanup-policy.zh.md"
  - "memory/policies/artifact-consistency-policy.zh.md"
  - "harness/artifact-write-policy.zh.md"
  - "loops/recipes/artifact-hygiene.loop.md"
  - "evals/artifact/*.cases.json"
target_runtime: "Codex"
recommended_mode: "goal"
runtime_constraints:
  - "Windows PowerShell。"
  - "不新增 npm 依赖。"
  - "只做最小文档和 validator 接入。"
plan_prompt: null
goal_prompt: "实现 Artifact Eval Validator，并将 artifact governance 字段接入 builder-review 与 builder-agent-task 的输出契约。"
acceptance_criteria:
  - "npm run validate:artifact-evals 可单独运行。"
  - "npm run validate:builder-os 包含 artifact eval validator。"
  - "builder-review 输出契约包含 artifact_hygiene_audit 和 artifact_index_update_proposal。"
  - "builder-agent-task / Output Packet 包含 artifact_index_update_proposal。"
  - "仍保持 8 个 active builder skills。"
verification:
  - "npm run validate:artifact-evals"
  - "npm run validate:package-surface"
  - "npm run validate:runtime-adapters"
  - "npm run validate:builder-os"
  - "git diff --check"
artifact_index_update_proposal:
  status: "proposal_only"
  add_or_update:
    - path: "scripts/validate-artifact-evals.js"
      artifact_type: "validator"
      lifecycle_state: "current"
      reason: "Artifact eval cases 的轻量结构验证器。"
    - path: "loops/recipes/artifact-hygiene.loop.md"
      artifact_type: "loop_recipe"
      lifecycle_state: "current"
      reason: "Artifact Hygiene 的周期审计协议。"
    - path: "harness/artifact-write-policy.zh.md"
      artifact_type: "policy"
      lifecycle_state: "current"
      reason: "资产写入纪律。"
    - path: "evals/artifact/*.cases.json"
      artifact_type: "eval_case"
      lifecycle_state: "current"
      reason: "Artifact Governance 回归样例。"
  supersede: []
  cleanup_candidates: []
  forbidden_actions:
    - "不要把本 proposal 当作已写入 artifact index。"
    - "不要自动删除或迁移任何现有文件。"
design_brief: null
design_constraints: []
ui_states: []
design_consistency_gate: "not_applicable"
allowed_tools:
  - "read files"
  - "edit files"
  - "run npm validation scripts"
forbidden_actions:
  - "git reset --hard"
  - "自动删除资产"
  - "自动迁移历史文件"
  - "新增 core skill"
human_approval_gates:
  - "任何高风险清理或 source-of-truth 变更必须先生成 proposal，并由人确认。"
risks:
  - "如果字段只进模板、不进 validator，后续可能漂移。"
  - "如果 proposal 被误解为已执行状态，会污染 artifact index。"
blocked_stop_condition:
  - "无法确认 8 个 active builder skills 时停止。"
  - "validate:builder-os 无法通过且无法定位原因时停止。"
handoff_packet:
  next_skill_hint: "builder-review"
  handoff_context:
    - "重点检查 artifact eval validator 是否 fail-closed。"
    - "重点检查 builder-review 是否只引用 Artifact Hygiene Loop，而不是自动执行清理。"
    - "重点检查 Output Packet 的 artifact_index_update_proposal 是否是 proposal-only。"
```

## 说明

这个任务包中的 `artifact_index_update_proposal` 用来告诉执行 agent：完成后必须说明 artifact index 应如何更新。它不是写入授权，也不是清理授权。
