# Review Report 模板

```yaml
review_mode: contract_review | evidence_review | design_review | release_readiness | not_reviewable
review_target:
contract_checked:
findings:
evidence_audit:
design_consistency_audit:
risk_assessment:
decision: PASS | PARTIAL | BLOCKED | APPROVE | REQUEST_CHANGES
required_fixes:
unverified_areas:
next_step:
```

## 使用规则

- Findings 按严重程度排序，并引用可观察证据或文件路径。
- 证据不足时，decision 不得使用 PASS 或 APPROVE。
- UI/prototype review 必须覆盖 Design Brief、状态、组件、响应式、mock/demo 标注和交互真实性。
- 需要人类接受取舍时，交给 `builder-decision`。
