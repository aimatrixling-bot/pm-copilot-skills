# Prototype-to-Spec Review Checklist

用于 `builder-review` 的 `prototype_to_spec_review`。目标是检查从原型反向沉淀出的 spec 是否保留了原型证据和边界，而不是把 demo 误升级为生产合同。

## 必查项

1. Source provenance
   - 是否保留 `source_prototype.artifact_path`。
   - 是否说明 prototype mode、fidelity、来源 brief、截图或 evidence。
   - 是否能追溯到原型中的 covered flows、states covered、gaps 和 verification。

2. Prototype facts vs inferred requirements
   - 原型中已呈现且已验证的行为是否被标为 prototype facts。
   - 推断需求是否有依据。
   - 未验证推断是否进入 assumptions，而不是 requirements。

3. Prototype gaps
   - 原型的 gaps 是否保留为 `prototype_gaps`。
   - 未覆盖状态、未接 API、未确认权限、未验证数据是否进入 open questions、risks 或 next_skill_input。
   - gaps 是否没有被直接改写成已确认 requirements。

4. Mock boundary
   - mock/demo 数据是否被明确标注。
   - route readiness 是否保留 planned/design/partial/ready 等真实状态。
   - demo-only、mock-only、production gap 是否没有被写成生产完成。

5. Verification provenance
   - `prototype_verification` 是否说明证据来源。
   - acceptance criteria 是否能用截图、预览、人工检查、测试或 evidence packet 验证。
   - 原型证据是否没有替代真实 API、权限、数据、审计或生产迁移验证。

6. Spec-first guard
   - 权限、API、数据库、审计、库存、收费、医疗、生产发布等高风险内容是否保持 spec-first 保护。
   - 如果这些内容缺失，decision 不得是 PASS / APPROVE。

## 输出建议

```yaml
prototype_to_spec_audit:
  source_provenance: pass | partial | fail
  facts_vs_inference: pass | partial | fail
  gaps_preserved: pass | partial | fail
  mock_boundary: pass | partial | fail
  verification_provenance: pass | partial | fail
  spec_first_guard: pass | partial | fail
  required_fixes:
  decision_driver:
```

## 常见失败

- `artifact_path` 丢失，后续 reviewer 无法追溯原型。
- 把 `route readiness = design` 写成 route 已实现。
- 把 mock endpoint 写成最终 API contract。
- 把 `gaps` 中的权限、API、数据库或审计直接写成 requirement。
- acceptance criteria 只写“页面看起来正确”，没有证据来源。
- 高风险缺口存在时仍给 `APPROVE`。
