# AI Builder OS 1.0 Release Naming and Migration Plan

## Decision

AI Builder OS 1.0 推荐采用双包过渡策略：

- `ai-builder-os` 是 1.0 正式主包名和产品身份。
- `pm-copilot-skills` 保留为兼容包，至少覆盖一个正式 release 周期。
- 两个包都从同一个 canonical source 生成，不允许手工维护两套源码。
- 1.0 前只做 dry-run 和 release seal，不在同一个 milestone 中执行 npm publish、旧包 deprecation 或 repo split。

## Current Facts

- 当前仓库：`pm-copilot-skills`
- 当前 npm package：`pm-copilot-skills@0.7.0`
- 当前 product identity：`AI Builder OS`
- 当前 command aliases：`pm-copilot-skills`、`ai-builder-os`
- 当前 active surface：8 个 `builder-*` core skills
- 当前 RC tag：`ai-builder-os-v1.0.0-rc.1`
- `ai-builder-os` npm 名称在 M3.6 检查时返回 404，看起来未被占用；发布前必须重新确认。

Post-1.0 更新说明：`ai-builder-os@1.0.0`、`ai-builder-os@1.0.1`、`pm-copilot-skills@1.0.0` 和 `pm-copilot-skills@1.0.1` 已发布。后续 patch release 不再检查“包名是否未占用”，而是检查目标版本和目标 tag 是否尚不存在。

## Package Strategy

### Primary package

`ai-builder-os` 应成为正式主包：

```bash
npx ai-builder-os
npx ai-builder-os codex
npx ai-builder-os codex-project
```

主包仍保留 `pm-copilot-skills` bin alias 一个周期，用于降低迁移摩擦。

### Compatibility package

`pm-copilot-skills` 保留兼容包：

```bash
npx pm-copilot-skills
npx pm-copilot-skills codex
npx -p pm-copilot-skills ai-builder-os codex
```

兼容包不得重新暴露 legacy `pm-*` active skills。它只安装同一套 8 个 AI Builder OS builder skills。

## Repository Strategy

1. 1.0 发布仍使用当前 GitHub repo：`aimatrixling-bot/pm-copilot-skills`。
2. 不在 1.0 前执行 repo split 或目录迁移。
3. 后续如迁移到独立 repo，应先完成独立 plan，处理 tags、issues、npm repository metadata、README links 和用户迁移路径。

## Release Order

1. 合并 AI Builder OS 1.0 RC PR。
2. 执行 M3.7 双包 dry-run，确认两个 package projection 都可 pack 和安装。
3. 执行 M3.8 final 1.0 release seal。
4. 从最终 release commit 创建 `ai-builder-os-v1.0.0` tag。
5. 重新确认 npm `ai-builder-os` 名称可用。
6. 发布 `ai-builder-os@1.0.0`。
7. 发布 `pm-copilot-skills` 兼容版本，说明主包迁移路径。
8. 用真实 npx 安装验证 Codex / Claude Code / generic export。

Post-1.0 patch release 使用同一顺序，但必须显式选择新的 patch 版本，例如 `1.0.2`，并通过 `prepare:dual-package-publish -- --version <version> --tag ai-builder-os-v<version>` 生成发布前证据。

## Compatibility Policy

- 不删除 `_archived/pm-copilot-legacy-v1.0/`。
- 不恢复旧 `pm-*` active skills。
- 不立即 deprecate `pm-copilot-skills`。
- 如未来 deprecate 旧包，必须至少在一个兼容 release 之后，并先发布迁移说明。

## Rollback

npm publish 不应被视为可回滚操作。出错后优先发布修正版本：

- 主包发布失败：不发布兼容包，修正后重新 dry-run。
- 主包已发布但安装失败：发布 `ai-builder-os@1.0.1` 修正。
- 兼容包发布失败：保留旧 `pm-copilot-skills@0.7.0`，先修正兼容包 metadata。
- 文档错误：发布 patch 版本并更新 release notes。

## M3.7 Dry-run Requirements

M3.7 不 publish，只验证技术可行性：

- 从当前 source projection 出 `ai-builder-os` 主包。
- 从当前 source projection 出 `pm-copilot-skills` 兼容包。
- 两个 projection 都运行 `npm pack --dry-run --json`。
- 两个 projection 都在临时目录运行 `node install.js codex-project --overwrite`。
- 两个 projection 都只安装 8 个 active builder skills。
- forbidden package prefixes 不进入任何 projection。

## M3.8 Input

M3.8 final seal 应冻结：

- 最终 package names。
- 最终 versions。
- release tag。
- npm publish 命令顺序。
- post-release verification 清单。
- 是否创建 GitHub Release。
