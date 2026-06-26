# Claude Code Project Shim

本文件是 Claude Code 进入本仓库时的项目级入口。它不是新的长期 source of truth；如有冲突，按 `AGENTS.md` 和 `docs/source-of-truth-map.md` 为准。

## First Read

1. 先读 `AGENTS.md`，确认仓库职责、8 个 active core skills、禁止事项和 Done 定义。
2. 再读 `docs/source-of-truth-map.md`，确认规则应该写在哪里，避免把 release seal、聊天记录或 Review Packet 当长期事实源。
3. 需要理解交付模式时读 `docs/delivery-kernel.md`；需要理解 package/runtime 边界时读 `docs/architecture.md`。
4. 修改 skill、template、loop、schema、eval、adapter 或 validator 前，先搜索现有实现和验证脚本。

## Operating Rules

- 默认中文交付；代码标识符、schema key、命令、runtime 名称可保留英文。
- active core skills 必须保持 8 个：`builder-router`、`builder-plan-goal`、`builder-frame`、`builder-spec`、`builder-prototype`、`builder-agent-task`、`builder-review`、`builder-decision`。
- 优先补强既有 skill、template、loop、schema、eval、validator 或 adapter；不要新增第 9 个 core skill。
- 不把 PMS 等业务领域规则写入 AI Builder OS 通用层。
- 不自动发布 npm、不创建 tag、不删除历史 release seal。
- `docs/release-*` 和 `docs/*hardening-brief.md` 是 source-only 证据或阶段材料，不进入 runtime export。

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
