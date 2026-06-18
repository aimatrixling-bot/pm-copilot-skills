# Output Packet 示例

本示例展示执行 agent 完成 Artifact Governance Milestone 3A/3B/3C 后，如何把结果交给 `builder-review`。

```yaml
artifact_path:
  - "scripts/validate-artifact-evals.js"
  - "skills/builder-review/SKILL.md"
  - "skills/builder-agent-task/SKILL.md"
  - "kernel/packets/output-packet.schema.md"
  - "evals/output-contract/builder-review.schema.json"
  - "evals/output-contract/agent-task-packet.schema.json"
artifact_type: "governance_protocol_update"
key_decisions:
  - "Artifact Governance 保持为横切协议，不新增第 9 个 core skill。"
  - "Artifact Hygiene Loop 只作为 review/audit 参考，不自动执行。"
  - "artifact_index_update_proposal 是 proposal-only，不代表已写入。"
open_assumptions:
  - "当前 artifact index 尚未由脚本自动维护。"
  - "高风险清理动作仍必须由人工确认。"
next_skill_hint: "builder-review"
handoff_context:
  - "请按 Artifact Hygiene Loop 检查新增 validator、policy、loop、eval 和 output contract 是否一致。"
  - "请确认没有自动删除、自动迁移或自动归档行为。"
  - "请确认 package surface 仍只有 8 个 active builder skills。"
evidence_packet:
  commands_run:
    - command: "npm run validate:artifact-evals"
      result: "passed"
    - command: "npm run validate:package-surface"
      result: "passed"
    - command: "npm run validate:runtime-adapters"
      result: "passed"
    - command: "npm run validate:builder-os"
      result: "passed"
    - command: "git diff --check"
      result: "passed_with_line_ending_warnings_only"
  observed_results:
    - "Artifact eval validator 验证 3 个 artifact eval 文件和 12 个 cases。"
    - "validate:builder-os 仍确认 8 个 active builder skills。"
artifact_index_update_proposal:
  status: "proposal_only"
  proposed_updates:
    - path: "scripts/validate-artifact-evals.js"
      action: "add"
      artifact_type: "validator"
      lifecycle_state: "current"
      owner_layer: "eval"
      source_of_truth: "scripts/validate-artifact-evals.js"
      depends_on:
        - "evals/artifact/*.cases.json"
    - path: "harness/artifact-write-policy.zh.md"
      action: "add"
      artifact_type: "policy"
      lifecycle_state: "current"
      owner_layer: "harness"
      source_of_truth: "harness/artifact-write-policy.zh.md"
    - path: "loops/recipes/artifact-hygiene.loop.md"
      action: "add"
      artifact_type: "loop_recipe"
      lifecycle_state: "current"
      owner_layer: "loop"
      source_of_truth: "loops/recipes/artifact-hygiene.loop.md"
    - path: "evals/artifact/*.cases.json"
      action: "add"
      artifact_type: "eval_case"
      lifecycle_state: "current"
      owner_layer: "eval"
      source_of_truth: "evals/artifact/"
    - path: "skills/builder-review/SKILL.md"
      action: "update"
      artifact_type: "skill_contract"
      lifecycle_state: "current"
      owner_layer: "skill"
      source_of_truth: "skills/builder-review/SKILL.md"
    - path: "skills/builder-agent-task/SKILL.md"
      action: "update"
      artifact_type: "skill_contract"
      lifecycle_state: "current"
      owner_layer: "skill"
      source_of_truth: "skills/builder-agent-task/SKILL.md"
  cleanup_candidates: []
  archived_candidates: []
  forbidden_deletions:
    - "memory/policies/*.zh.md"
    - "loops/recipes/artifact-hygiene.loop.md"
    - "evals/artifact/*.cases.json"
    - "scripts/validate-artifact-evals.js"
status: "ready_for_review"
```

## 说明

这个 Output Packet 明确区分了三件事：

- 已完成的文件变更。
- 已运行的验证证据。
- 建议如何更新 artifact index。

其中 `artifact_index_update_proposal` 仍然不是实际 index 写入结果。
