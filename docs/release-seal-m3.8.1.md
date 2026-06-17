# AI Builder OS Milestone 3.8.1 Multi-runtime Smoke Seal

## Seal

- Milestone: Milestone 3.8.1
- Status: multi-runtime install and loading smoke test
- Decision: PASS_FOR_M3.9_PREP_WITH_CONDITIONS
- Current source package: `pm-copilot-skills@0.7.0`
- Product identity: `AI Builder OS`
- Command aliases: `pm-copilot-skills`, `ai-builder-os`
- Runtime targets checked: Codex, Claude Code, generic-agent/QoderWork

## Scope

M3.8.1 验证当前 PR #2 的 M3.7+M3.8 package surface 能被多个 runtime 消费。

本次允许：

- 运行 Codex 用户级安装 smoke test。
- 运行 Claude Code global 和 clean project install smoke test。
- 运行 generic-agent export smoke test，作为 QoderWork 等未提供稳定 native skill root 的 runtime 消费方式。
- 补充 README、adapter notes、release seal 和 validator 的 package surface 检查。

本次不做：

- 不执行 `npm publish`。
- 不创建 final tag。
- 不新增 builder skill。
- 不重构 installer。
- 不删除 archive。
- 不删除用户已有的非本包 marker skills。

## Runtime Results

### Codex

命令：

```bash
node install.js codex --overwrite
npm run validate:codex-install
```

结果：

- PASS。
- 安装目标：`C:\Users\max.ling\.agents\skills`
- 已更新 8 个 AI Builder OS active builder skills。
- `validate:codex-install` 确认只验证 8 个 `builder-*` active skills。

### Claude Code

命令：

```bash
node install.js global --overwrite
```

结果：

- PASS。
- 安装目标：`C:\Users\max.ling\.claude\skills`
- 已安装 8 个 AI Builder OS active builder skills。
- 每个 builder skill 都包含 `SKILL.md`、marker、`kernel/`、`references/`、`templates/`、`adapters/`。
- 本包 marker 证明的 legacy active surface 数量：0。

注意：

- 该用户级 Claude Code skill root 中仍存在用户已有的非本包 marker `pm-*` 目录。
- Installer 不删除这些目录，因为无法证明它们由当前包安装。
- 需要纯净验证时，应使用 project-level install 到干净项目目录。

干净项目级 smoke test：

```bash
node install.js project --overwrite
```

结果：

- PASS。
- 临时项目 `.claude/skills` 中总目录数：8。
- 8 个目录全部是 `builder-*` active skills。

### generic-agent / QoderWork

命令：

```bash
npm run export:runtime -- --target generic-agent --out ".\dist\ai-builder-os\generic-agent" --clean
```

结果：

- PASS。
- 导出目标：`dist\ai-builder-os\generic-agent`
- Active skills：8。
- `skills/`、`kernel/`、`references/`、`templates/`、`adapters/` 都存在。
- `.ai-builder-os/export-manifest.json` 可作为通用 runtime 的加载入口。

QoderWork 当前建议：

- 若没有稳定 native skill root，按 `generic-agent` 消费。
- 先读取 `.ai-builder-os/export-manifest.json`。
- 默认入口使用 `skills/builder-router/SKILL.md`。
- 需要 Plan/Goal 决策时使用 `skills/builder-plan-goal/SKILL.md`。

## Unpublished Latest Install

在 M3.9 npm publish 前，其他 runtime 要安装当前最新分支，应优先从本地 checkout 安装或导出。

Claude Code global：

```bash
cd "D:\Max Brain for AI Copilot\30_Projects\personal\pm-copilot-skills"
node install.js global --overwrite
```

Claude Code project：

```bash
cd "<target-project>"
node "D:\Max Brain for AI Copilot\30_Projects\personal\pm-copilot-skills\install.js" project --overwrite
```

Codex user：

```bash
cd "D:\Max Brain for AI Copilot\30_Projects\personal\pm-copilot-skills"
node install.js codex --overwrite
```

Generic agent / QoderWork：

```bash
cd "D:\Max Brain for AI Copilot\30_Projects\personal\pm-copilot-skills"
npm run export:runtime -- --target generic-agent --out "<runtime-readable-dir>" --clean
```

发布后再改用：

```bash
npx ai-builder-os codex
npx ai-builder-os
npx pm-copilot-skills codex
```

## Command Evidence

| Command / Check | Result |
| --- | --- |
| `git status -sb` | PASS；当前分支 `codex/m3.6-release-naming-plan` 跟踪 `origin/codex/m3.6-release-naming-plan` |
| `npm run validate:builder-os` | PASS；8 个 active builder skill、16 个 legacy PM skill 归档和 89 个必需文件；dual package dry-run projection 为 152 files |
| `npm run validate:runtime-adapters` | PASS；3 个 runtime target 和 8 个 active builder skills projection |
| `node install.js codex --overwrite` | PASS；Codex 用户级安装更新 8 个 builder skills |
| `npm run validate:codex-install` | PASS；Codex 安装态验证 8 个 active builder skills |
| `node install.js global --overwrite` | PASS；Claude Code global 安装 8 个 builder skills |
| Claude Code marker check | PASS；8 个 builder skills 均有 marker 和共享资源 |
| Claude Code clean project smoke | PASS；干净项目 `.claude/skills` 中总目录数 8，全部是 `builder-*` |
| `npm run export:runtime -- --target generic-agent --out ".\dist\ai-builder-os\generic-agent" --clean` | PASS；generic-agent export 生成 8 个 active skills 和共享资源 |

## M3.9 Recommendation

建议进入 M3.9，但必须满足以下条件：

- PR #1 先合并到 `master`。
- PR #2 重新对齐到 `master` 后确认 diff 只包含 M3.7/M3.8/M3.8.1 release path。
- 发布前再次确认 `npm view ai-builder-os` 仍可发布。
- 发布前再次运行完整 release gates。
- 不直接使用 `sync-and-publish.sh` 做双包发布，除非先完成专用双包发布脚本和 dry-run。

## Remaining Risks

- Claude Code 用户级 skill root 可能已有非本包 marker 的旧 `pm-*` skills，installer 不会删除它们。
- generic-agent/QoderWork 当前是文件投影和人工加载约定，不代表 QoderWork native skill selector 已完成端到端验证。
- 当前真实 npm package 仍是 `pm-copilot-skills@0.7.0`，M3.9 前不能把 `npx ai-builder-os` 当作已发布主包使用。
