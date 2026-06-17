# Builder Spec 迁移说明

`builder-spec` 是旧 `pm-prd` 方法在 AI Builder OS core 中的版本。

## 从 `pm-prd` 保留的内容

- PRD 和 spec 写作纪律。
- Acceptance criteria 和 test planning。
- 进入 prototype、architecture 或 implementation 前的清晰门禁。
- Builder 交接和证据期望。

## Builder Core 中的变化

- 默认产物是可构建 spec，不一定总是完整 PRD。
- 输出契约支持 Mini Spec、PRD、engineering request 和 agent-readable spec。
- 本地 references 和 templates 存放在 `skills/builder-spec/`。
- 旧 `pm-prd` skill 仍然保留，不能删除。

## 兼容规则

当源产物已经像 PRD 时，保留其意图，并把缺失部分映射到 `builder-spec.template.md`，不要重写整份文档。
