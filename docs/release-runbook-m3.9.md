# AI Builder OS M3.9 Publish Runbook

## Purpose

M3.9 的目标是发布 AI Builder OS 1.0，并完成发布后验证。

本 runbook 是正式发布前的唯一执行顺序来源。历史 `sync-and-publish.sh` 只能作为 release gate helper，不能直接用于双包发布。

## Release Identity

- Final tag: `ai-builder-os-v1.0.0`
- Primary package: `ai-builder-os@1.0.0`
- Compatibility package: `pm-copilot-skills@1.0.0`
- Canonical source repo: `aimatrixling-bot/pm-copilot-skills`
- Current source package id before projection: `pm-copilot-skills@0.7.0`

## Non-goals

- 不新增 builder skill。
- 不改变 active surface。
- 不删除 `_archived/`。
- 不 deprecate `pm-copilot-skills`。
- 不使用 `sync-and-publish.sh` 执行双包发布。

## Preflight

```bash
git checkout master
git pull --ff-only origin master
git status --short
npm whoami
npm view ai-builder-os version
npm view pm-copilot-skills versions --json
git ls-remote --tags origin ai-builder-os-v1.0.0
```

期望：

- 工作树干净。
- `npm whoami` 是允许发布的账号。
- `npm view ai-builder-os version` 返回 E404，或发布人确认已经拥有该包且 `1.0.0` 未发布。
- `pm-copilot-skills` 尚无 `1.0.0`。
- `ai-builder-os-v1.0.0` tag 尚不存在。

## Required Gates

```bash
npm run validate:builder-os
npm run validate:package-surface
npm run validate:runtime-adapters
npm run validate:trigger-descriptions
npm run validate:dual-package-dry-run
node install.js codex --overwrite
npm run validate:codex-install
npm run validate:doctor-preference-e2e
npm run test:doctor-preference-e2e
npm pack --dry-run --json
git diff --check
```

## Build Release Tarballs

只生成发布投影和 tarball，不发布：

```bash
npm run prepare:dual-package-publish -- --out ".release/ai-builder-os-v1.0.0" --clean --check-registry --npm-publish-dry-run
```

产物：

- `.release/ai-builder-os-v1.0.0/release-manifest.json`
- `.release/ai-builder-os-v1.0.0/tarballs/ai-builder-os-1.0.0.tgz`
- `.release/ai-builder-os-v1.0.0/tarballs/pm-copilot-skills-1.0.0.tgz`

检查：

- manifest 中两个 package 都是 `1.0.0`。
- primary package name 是 `ai-builder-os`。
- compatibility package name 是 `pm-copilot-skills`。
- 两个 tarball 都不包含 `_archived/`、`research/` 或 `skills/pm-*`。

## Publish Order

只有用户明确批准后才能执行：

```bash
git tag ai-builder-os-v1.0.0
git push origin ai-builder-os-v1.0.0

npm publish ".release/ai-builder-os-v1.0.0/tarballs/ai-builder-os-1.0.0.tgz" --access public
npm view ai-builder-os version
npx ai-builder-os codex --overwrite
npm run validate:codex-install

npm publish ".release/ai-builder-os-v1.0.0/tarballs/pm-copilot-skills-1.0.0.tgz" --access public
npm view pm-copilot-skills version
npx pm-copilot-skills codex --overwrite
npm run validate:codex-install
```

## Post-release Verification

```bash
npm view ai-builder-os version
npm view pm-copilot-skills version
npm run export:runtime -- --target codex --out ".\dist\ai-builder-os\codex" --clean
npm run export:runtime -- --target claude-code --out ".\dist\ai-builder-os\claude-code" --clean
npm run export:runtime -- --target generic-agent --out ".\dist\ai-builder-os\generic-agent" --clean
```

人工检查：

- Codex 新线程能识别 `$builder-router`、`$builder-plan-goal`、`$builder-spec`。
- Claude Code 全局或项目级 skill root 只需 8 个 `builder-*` active skills；非本包 marker 的旧 skill 不由 installer 删除。
- QoderWork 若无 native skill root，按 `generic-agent` export 消费。

## Fix-forward Policy

- 主包发布失败：停止，不发布兼容包，修正后重新 dry-run。
- 主包已发布但安装失败：发布 `ai-builder-os@1.0.1` 修正。
- 兼容包发布失败：保留 `pm-copilot-skills@0.7.0` 或当前 latest，修正后再发布兼容版本。
- 文档错误：发布 patch 版本并更新 GitHub Release notes。
