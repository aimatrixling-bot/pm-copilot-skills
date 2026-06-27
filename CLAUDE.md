# Claude Code Project Shim

@AGENTS.md

本文件只补充 Claude Code source checkout 的入口差异。它不是新的长期 source of truth；如有冲突，按 `AGENTS.md` 和 `docs/source-of-truth-map.md` 为准。

## First Read

1. `AGENTS.md` 是本仓库 agent contract。
2. `docs/source-of-truth-map.md` 说明长期规则应该写在哪里。
3. `docs/delivery-kernel.md` 说明交付模式。
4. `docs/architecture.md` 说明 package/runtime 边界。

## Claude Code Usage

- 源仓库工作：遵循 `AGENTS.md`，使用本文件只做入口定位。
- Claude Code skill 安装：`node install.js global --overwrite` 或在目标项目执行 `node install.js project --overwrite`。
- Claude Code runtime export：`npm run export:runtime -- --target claude-code --out ".\\dist\\ai-builder-os\\claude-code" --clean`。
- Slash 调用风格：`/builder-router`、`/builder-spec` 等。

## Verification

变更后优先运行最小相关验证；涉及 package/runtime/skill surface 时，使用：

```bash
npm run validate:builder-os
npm run validate:runtime-adapters
npm run validate:package-surface
npm pack --dry-run --json
```

涉及本机 Codex 安装面时，再运行：

```bash
node install.js codex --overwrite
npm run validate:codex-install
```
