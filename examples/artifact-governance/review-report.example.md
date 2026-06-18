# Review Report 示例

本示例展示 `builder-review` 如何评审 Artifact Governance Milestone 3A/3B/3C 的交付物，并引用 Artifact Hygiene Loop。

```yaml
review_mode: "contract_review"
review_target:
  - "scripts/validate-artifact-evals.js"
  - "skills/builder-review/SKILL.md"
  - "skills/builder-agent-task/SKILL.md"
  - "kernel/packets/output-packet.schema.md"
  - "evals/output-contract/*.schema.json"
contract_checked:
  - "Artifact Eval Validator 可单独运行并接入 validate:builder-os。"
  - "builder-review 评审交付物时引用 Artifact Hygiene Loop。"
  - "builder-agent-task / Output Packet 包含 artifact_index_update_proposal。"
  - "不新增第 9 个 core skill。"
findings:
  - severity: "info"
    item: "Artifact Hygiene Loop 已作为 review/audit 参考接入 builder-review。"
    evidence:
      - "skills/builder-review/SKILL.md"
      - "evals/output-contract/builder-review.schema.json"
  - severity: "info"
    item: "artifact_index_update_proposal 已贯穿 Agent Task Packet 和 Output Packet。"
    evidence:
      - "skills/builder-agent-task/SKILL.md"
      - "kernel/packets/output-packet.schema.md"
      - "evals/output-contract/agent-task-packet.schema.json"
  - severity: "info"
    item: "验证仍保持 8 个 active builder skills。"
    evidence:
      - "npm run validate:package-surface"
      - "npm run validate:builder-os"
evidence_audit:
  status: "sufficient_for_protocol_review"
  verified_commands:
    - "npm run validate:artifact-evals"
    - "npm run validate:package-surface"
    - "npm run validate:runtime-adapters"
    - "npm run validate:builder-os"
    - "git diff --check"
  caveat:
    - "本评审不证明任何真实项目资产已经被清理或归档。"
design_consistency_audit: "not_applicable"
artifact_hygiene_audit:
  reference:
    - "loops/recipes/artifact-hygiene.loop.md"
    - "memory/policies/artifact-consistency-policy.zh.md"
    - "memory/policies/artifact-cleanup-policy.zh.md"
  lifecycle_check:
    - "新增 validator、policy、loop、eval case 均应登记为 current 或 working，取决于发布状态。"
    - "示例文件应登记为 reference/example，不应成为 source-of-truth。"
  consistency_check:
    - "builder-review 的 skill 文档、review report 模板和 output contract 字段一致。"
    - "builder-agent-task 的 skill 文档、Agent Task Packet schema、Output Packet schema 和 output contract 字段一致。"
  cleanup_check:
    - "没有发现需要自动删除的资产。"
    - "任何 future cleanup 都必须先生成 proposal。"
artifact_index_update_proposal:
  status: "proposal_only"
  proposed_updates:
    - path: "examples/artifact-governance/README.md"
      action: "add"
      artifact_type: "example"
      lifecycle_state: "current"
      reason: "端到端说明入口。"
    - path: "examples/artifact-governance/agent-task-packet.example.md"
      action: "add"
      artifact_type: "example"
      lifecycle_state: "current"
      reason: "展示 builder-agent-task 如何要求 artifact index update proposal。"
    - path: "examples/artifact-governance/output-packet.example.md"
      action: "add"
      artifact_type: "example"
      lifecycle_state: "current"
      reason: "展示 Output Packet 如何交接 artifact index update proposal。"
    - path: "examples/artifact-governance/review-report.example.md"
      action: "add"
      artifact_type: "example"
      lifecycle_state: "current"
      reason: "展示 builder-review 如何引用 Artifact Hygiene Loop。"
risk_assessment:
  - "风险：示例被误读为真实执行记录。缓解：README 和每个样例均声明 proposal-only / example-only。"
  - "风险：示例与上游 schema 漂移。缓解：README 明确 source-of-truth 链，上游协议优先。"
decision: "PASS"
required_fixes: []
unverified_areas:
  - "未验证真实 artifact-index 写入，因为本 Milestone 明确不实现自动化或实际写入。"
cleanup_proposal:
  status: "none"
  reason: "本样例不要求清理任何文件；高风险清理必须在未来单独 proposal 中提出。"
next_step:
  - "如需推进下一阶段，可设计 artifact index 的人工更新模板或 release review checklist。"
```

## 说明

本 Review Report 的重点不是证明自动治理已经存在，而是证明三个协议点已经形成可审查闭环：

- 执行前：Agent Task Packet 要求产出 index proposal。
- 执行后：Output Packet 报告产物和 proposal。
- 评审时：builder-review 按 Artifact Hygiene Loop 检查 proposal、清理风险和一致性。
