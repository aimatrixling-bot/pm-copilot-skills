# Builder Spec 规则

当把 Feature Frame、PRD 草稿、会议记录或需求转成可构建 spec 时，使用这些规则。

## Spec 就绪检查

写 spec 前确认：

- 目标清楚。
- 目标用户或受影响角色已知。
- 范围内和范围外可以明确表述。
- Non-goals 明确。
- 至少存在一个主流程或场景。
- 能定义验收和验证期望。

如果这些条件不成立，交给 `builder-frame`，或提出聚焦问题。

## 需求纪律

- 产品需求说明对用户、业务或系统来说必须成立的事实。
- 只有当既有架构或显式约束提供依据时，才写实现说明。
- 推断出来的实现细节必须标记为 assumptions。
- Open questions 不能藏在 requirements 中。
- 必须暴露跨模块影响、权限、数据一致性、迁移和兼容风险。

## 输出纪律

- Spec 要足够简洁，能被工程或 agent 执行。
- 优先使用结构化章节，而不是长篇叙述。
- 每个主要 requirement 都应该能映射到 acceptance criteria 或 verification evidence。
- Spec 应能被 `builder-prototype`、`builder-agent-task`、`builder-review` 或 legacy implementation skills 消费。
