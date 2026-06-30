# Evidence Packet Template

Evidence Packet 记录当前交付是否真的有证据支持。它不是总结语，也不是 agent 自报成功；它必须指向可复查的命令、截图、人工检查、映射关系或缺失证据。

```yaml
artifact_type: evidence_packet
target_artifact:
target_scope:
evidence_status: PASS | PARTIAL | BLOCKED
verification_summary:
commands_run:
  - command:
    cwd:
    result: pass | fail | blocked | not_run
    output_ref:
screenshots:
  - path:
    viewport:
    state:
    captured_at:
manual_checks:
  - check:
    result: pass | fail | blocked | not_run
    evidence:
interaction_smoke:
  covered:
  not_covered:
mapping_evidence:
  source_contracts:
  observed_behavior:
  gaps:
freshness:
  collected_at:
  stale_if:
missing_evidence:
open_risks:
completion_claim:
  status: PASS | PARTIAL | BLOCKED
  claim:
  cannot_claim_done_without:
next_review:
```

## Rules

- `PASS` requires fresh evidence for the current scope; old logs, stale screenshots, agent self-report and validator-only proof are not enough.
- `PARTIAL` is valid when useful work exists but evidence, scope or verification is incomplete.
- `BLOCKED` is required when a human decision, external system or missing artifact prevents verification.
- Evidence Packet can support Review Report, Release Seal or handoff, but it does not replace `builder-review`.
- Do not claim commands or screenshots exist unless their path, command or output reference is provided.
