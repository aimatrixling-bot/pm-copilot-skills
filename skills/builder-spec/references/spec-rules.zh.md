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

## Readiness / Reroute Gate

当输入不满足 spec 就绪检查时，使用 `not_ready_for_spec`，并输出 `readiness_gate` 与 `reroute_recommendation`。

回退规则：

- 缺少用户、场景、核心问题、non-goals 或成功标准时，回退到 `builder-frame`。
- 缺少关键决策树时，回退到 `builder-frame` 的 `grill_frame`。
- 只有一两个可快速回答的缺口时，可以列为 `blocking_questions`，但不得假装 spec 已 ready。
- `not_ready_for_spec` 时，不输出完整 requirements、flows、acceptance criteria；只输出缺口、推荐默认答案和 `next_skill_input`。
- `reroute_recommendation.next_skill_input` 必须保留已知 facts、assumptions、open questions 和阻塞对象。

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
