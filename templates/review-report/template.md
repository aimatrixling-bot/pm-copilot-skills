# Review Report 模板

```yaml
review_mode: contract_review | evidence_review | design_review | release_readiness | not_reviewable
review_target:
contract_checked:
findings:
evidence_audit:
design_consistency_audit:
artifact_hygiene_audit: not_applicable | not_available | findings
artifact_index_update_proposal: none | proposed_changes
risk_assessment:
decision: PASS | PARTIAL | BLOCKED | APPROVE | REQUEST_CHANGES
required_fixes:
unverified_areas:
cleanup_proposal: none | proposal_only
next_step:
```

## 使用规则

- Findings 按严重程度排序，并引用可观察证据或文件路径。
- 证据不足时，decision 不得使用 PASS 或 APPROVE。
- UI/prototype review 必须覆盖 Design Brief、状态、组件、响应式、mock/demo 标注和交互真实性。
- 交付物、项目输出或资产替代相关评审必须引用 Artifact Hygiene Loop，至少说明 `artifact_hygiene_audit` 是否适用。
- `artifact_index_update_proposal` 只能提出 index 更新建议；除非有 Evidence Packet，不得声称已经完成写入。
- 高风险清理必须写入 `cleanup_proposal`，且只能是 proposal，不得要求自动删除。
- 需要人类接受取舍时，交给 `builder-decision`。
