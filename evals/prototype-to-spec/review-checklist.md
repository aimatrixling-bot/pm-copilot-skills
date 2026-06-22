# Prototype-to-Spec Manual Review Checklist

对每个 `prototype_to_spec` 输出进行人工检查：

- [ ] `source_prototype.artifact_path` 保留真实来源或 fixture 路径。
- [ ] `extracted_from_prototype.covered_flows` 来自原型 brief，而不是凭空扩展。
- [ ] `states_covered` 保留已覆盖状态；未覆盖状态进入 `prototype_gaps`。
- [ ] `prototype_gaps` 没有被直接写成已确认 requirements。
- [ ] mock/demo 数据、route readiness、mock-only 字段和 production gap 保留。
- [ ] `prototype_verification` 标明证据来源，例如验收清单、route proposal、manual checks 或 evidence packet。
- [ ] verification provenance 可追溯，不能用“已验证”替代具体证据来源。
- [ ] 权限、API、数据库、审计、库存、收费、正式签名等高风险内容保持 spec-first guard。
- [ ] `acceptance_criteria` 只覆盖可验证行为。
- [ ] `open_questions` / `risks` 包含高风险未确认项。
- [ ] `builder-review` 输出包含 `prototype_to_spec_audit`。

决策规则：

- 全部通过：`PASS`。
- provenance 或 verification 有轻微缺失，但 gaps/mock boundary 保留：`PARTIAL`。
- gaps 被提升为 requirements、mock 被写成生产事实、或高风险 guard 丢失：`REQUEST_CHANGES` 或 `BLOCKED`。
