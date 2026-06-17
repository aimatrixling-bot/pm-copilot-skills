# Acceptance Criteria 指南

使用这个指南，让 `builder-spec` 的 acceptance criteria 可测试。

## 好的验收标准

每条标准应该包含：

- Condition：行为适用的条件。
- Expected behavior：必须发生什么。
- Evidence：reviewer 或测试如何证明它成立。

示例：

```yaml
- id: AC-001
  statement: 当用户提交空的必填字段时，系统显示字段级校验提示，并阻止提交。
  evidence: 人工表单检查或自动化组件测试。
```

## 覆盖清单

需要覆盖：

- Happy path。
- Empty、loading 和 error states。
- 相关时的权限或角色差异。
- 数据校验和一致性。
- 相关时的向后兼容或迁移影响。
- 相关时的 audit、logging、privacy 或 security 期望。

## Rejection Criteria

使用 rejection criteria 说明哪些结果不能被接受，例如：

- 把假数据伪装成生产行为。
- 只有 UI 完成，但底层契约缺失。
- 缺少验证证据。
- 静默修改权限或 schema。
