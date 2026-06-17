# Legacy PM Methods

本目录是旧 `pm-copilot` 方法资产的索引层，不是 active skill surface。

## Source

旧内容已归档到：

```text
_archived/pm-copilot-legacy-v1.0/skills/
```

## 可复用资产

后续打磨 AI Builder OS 时，优先从归档内容中提炼这些类型的资产：

- Discovery、PRD、prototype、launch、decision、prioritization 的方法框架。
- PM theory KB 中已沉淀的理论摘要。
- Design KB 中可迁移为 UI/UX shared contract 的组件和交互规则。
- Quality Gates 中的中文优先、证据、假完成和交接约束。
- 旧 `pm-*` skills 中经过验证的 output packet、handoff 和 validator 思路。

## 迁移目标

legacy 方法不应直接重新变成 active skill。推荐迁移路径：

```text
legacy skill / reference
-> references 或 templates
-> builder skill 消费
-> eval / validator 覆盖
-> release seal 记录
```

## 使用边界

- `skills/` 下 active skill surface 只保留 8 个 `builder-*` core skills。
- 旧 `pm-*` 名称只作为归档索引、历史兼容说明或迁移来源出现。
- 若某个旧方法要进入 1.0，需要先定义它服务的 AI Builder OS 层级、消费者、输出契约和验证方式。
