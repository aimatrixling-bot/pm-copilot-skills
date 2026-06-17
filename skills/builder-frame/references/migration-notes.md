# Builder Frame 迁移说明

`builder-frame` 是旧 `pm-feature-frame` 方法在 AI Builder OS core 中的版本。

## 从 `pm-feature-frame` 保留的内容

- 从问题到可进入 prototype 的 framing。
- 明确目标用户和场景。
- Non-goals 和成功标准。
- 向 spec、prototype 或 agent-task generation 的下游交接。
- Goal suitability 和 builder readiness 思维。

## Builder Core 中的变化

- 输出被定义为可移植的 Feature Frame contract。
- 本地 references 和 templates 存放在 `skills/builder-frame/`。
- 当同一契约需要支持软件构建、个人自动化和 AI 辅助项目工作时，避免过度使用 PM-only 表述。
- 旧 `pm-feature-frame` skill 仍然保留，不能删除。

## 兼容规则

当源产物使用 `pm-feature-frame` 字段时，把它们映射进 `feature-frame.template.md` 结构，不重写源产物。
