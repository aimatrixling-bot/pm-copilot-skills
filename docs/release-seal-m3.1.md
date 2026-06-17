# AI Builder OS Milestone 3.1 Release Seal

判定：`PASS_WITH_REVIEW`

## 目标

Milestone 3.1 将仓库从 `pm-copilot` 兼容过渡态推进到 AI Builder OS pure active surface 的第一步：active skill surface 只保留 8 个 builder core skills，legacy PM 内容进入可回滚归档。

## active skill surface

当前 `skills/` 只应包含 8 个 builder core skills：

- `builder-router`
- `builder-plan-goal`
- `builder-frame`
- `builder-spec`
- `builder-prototype`
- `builder-agent-task`
- `builder-review`
- `builder-decision`

## legacy archive

归档路径：`_archived/pm-copilot-legacy-v1.0/`

归档范围：

- 16 个旧 `pm-*` skills。
- `download-anything`、`pdf`、`pptx` legacy utilities。
- 原 `skills/references/` 下的 PM theory KB、design KB、quality gates 和早期 Builder OS blueprint。

这些内容未删除，可作为历史方法资产、references 提炼来源和回滚来源。

## installer

`install.js` 的默认行为改为只安装 active builder skills。

若目标 runtime 中仍存在由本包旧版本安装的 `pm-*`、`download-anything`、`pdf`、`pptx` 或 `references` 目录，installer 会在确认 `.pm-copilot-skills-source.json` marker 属于当前 npm package 后移除它们，避免污染 active selector。

不会移除没有本包 marker 的用户自有 skill。

## validator

`validate:builder-os` 应覆盖：

- `skills/` active surface 只包含 8 个 builder core skills。
- 16 个 legacy `pm-*` skills 均存在于 archive。
- legacy utilities 和 old `skills/references` 均存在于 archive。
- README、architecture docs、release seal 已说明 active surface 与 legacy archive。

`validate:codex-install` 应覆盖：

- Codex 用户级安装态包含 8 个 builder core skills。
- builder skills 携带共享 `kernel`、`references`、`templates`、`adapters` 资源。
- 由本包旧版本安装的 legacy active surface 不再留在 Codex 用户级 skills 目录。

## 回滚方式

若需要回滚到兼容过渡态：

1. 将 `_archived/pm-copilot-legacy-v1.0/skills/` 下需要恢复的目录移回 `skills/`。
2. 恢复 `install.js` 和 validator 中的 legacy install/validation 逻辑。
3. 重新运行验证：

```bash
npm run validate:builder-os
node install.js codex --overwrite
npm run validate:codex-install
```

## M3.2 输入

M3.2 应在本边界上继续收敛 package surface：

- 保持 npm package name 暂不重命名，先清理 README、package metadata、installer 输出中的兼容命名。
- 明确 `pm-copilot-skills` 只是过渡 package id，AI Builder OS 是产品身份。
- 评估是否增加 `skill-pack.json`、`agents/openai.yaml`、export/projection tooling。
- 不与 trigger description optimization 混在同一个 milestone。

## 剩余风险

- Git 视角会看到 legacy 内容从 `skills/` 删除并在 `_archived/` 新增；review 时应按 move/归档理解，而不是按内容删除理解。
- `npm pack` 默认不包含 `_archived/`，这是 pure package surface 的刻意选择；repo 保留回滚来源。
- 旧 eval output 中若仍出现 `pm-*` 名称，应在后续 M3.2/M3.4 判断是历史基线、迁移样例还是需要重写的 active contract。
