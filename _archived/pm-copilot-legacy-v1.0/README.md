# pm-copilot legacy archive v1.0

本目录保存 Milestone 3.1 从 active surface 中移出的旧 `pm-copilot` 内容。

## 归档范围

归档路径：`_archived/pm-copilot-legacy-v1.0/`

已归档内容：

- 16 个旧 `pm-*` skills。
- 3 个 legacy utilities：`download-anything`、`pdf`、`pptx`。
- 原 `skills/references/` 共享资料，包括 PM theory KB、design KB、quality gates 和早期 Builder OS blueprint。

## 当前状态

这些内容不再属于 AI Builder OS 1.0 的 active skill surface，也不再由 `install.js` 默认安装。

它们仍可作为历史方法资产、迁移参考、回滚来源和后续 references 提炼素材。

## 回滚方式

如需恢复兼容过渡态，可将本目录下的子目录移回 `skills/`：

```powershell
Move-Item -LiteralPath "_archived\pm-copilot-legacy-v1.0\skills\pm-prd" -Destination "skills\pm-prd"
```

批量回滚前应先确认 `skills/` 中没有同名目录，并重新运行：

```bash
npm run validate:builder-os
node install.js codex --overwrite
npm run validate:codex-install
```

## 迁移原则

- 不直接把 legacy skill 重新暴露为 active skill。
- 需要复用的方法先迁移为 `references/`、`templates/` 或 eval 用例。
- 只有当某个能力符合 AI Builder OS 的 8 层架构和 output contract，才进入新的 `builder-*` active surface。
