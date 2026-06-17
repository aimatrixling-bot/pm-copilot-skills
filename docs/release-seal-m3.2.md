# AI Builder OS Milestone 3.2 Release Seal

判定：`PASS_WITH_REVIEW`

## 目标

Milestone 3.2 将仓库的对外 package surface 收敛为 AI Builder OS，而不是旧 `pm-copilot` skill 包叙事。

本阶段不重命名 npm package，不改 package version 到 1.0，不优化 trigger description，不新增 runtime export tooling。

## 命名策略

- 产品身份：`AI Builder OS`
- 机器可读 pack id：`ai-builder-os`
- 兼容 npm package id：`pm-copilot-skills`
- 安装命令：
  - `npx pm-copilot-skills`
  - `npx -p pm-copilot-skills ai-builder-os`

保留 `pm-copilot-skills` 是兼容策略，不代表产品身份继续停留在 PM Copilot。

## package surface

M3.2 后，AI Builder OS package surface 由这些文件定义：

- `package.json`
- `skill-pack.json`
- `agents/openai.yaml`
- `bundles/core/manifest.json`
- `install.js`
- `adapters/`
- `kernel/`
- `harness/`
- `memory/`
- `skills/builder-*`
- `references/`
- `templates/`
- `evals/`
- `docs/`

`_archived/` 和 `research/` 不进入 npm package surface。

## manifest

`skill-pack.json` 是 AI Builder OS 的机器可读 manifest，应声明：

- active surface：`pure-builder-core`
- 8 个 active builder skills
- shared resources
- excluded legacy paths
- runtime adapters
- release gates
- npm package compatibility policy

`agents/openai.yaml` 是 OpenAI/Codex-oriented package metadata，不替代 skill-local `SKILL.md`。

## installer

`install.js` 的主叙事是 AI Builder OS Installer。

它继续支持：

- Claude Code global/project install
- Codex user/project/home install
- `--overwrite`
- 本包 marker 保护
- legacy package-owned skill cleanup

它不默认安装旧 `pm-*`、utility skills 或旧 `skills/references`。

## validator

新增 `npm run validate:package-surface`，覆盖：

- `skills/` 只包含 8 个 builder core skills。
- `package.json` 保留兼容 package name，同时提供 `ai-builder-os` bin alias。
- `package.json files` 包含 manifest、agents、active assets，并排除 `_archived/`、`research/`。
- `skill-pack.json` 与 `package.json` version、bin、active skills 一致。
- `agents/openai.yaml` 与 active skills、version、package surface 一致。
- `sync-and-publish.sh` 运行 package surface gate，并在 pack dry-run 中检查 required files 和 forbidden prefixes。

`validate:builder-os` 应调用或覆盖 package surface validator，避免 release gate 漏跑。

## pack gate

`sync-and-publish.sh` 的 npm pack dry-run 应要求：

- `skill-pack.json`
- `agents/openai.yaml`
- 8 个 `skills/builder-*/SKILL.md`
- `references/README.md`
- `templates/README.md`
- `kernel/README.md`
- `docs/release-seal-m3.2.md`

并拒绝：

- `_archived/`
- `research/`
- `skills/pm-*`
- `skills/pdf`
- `skills/pptx`
- `skills/download-anything`
- `skills/references`

## 回滚方式

如 M3.2 package surface 造成外部安装或发布问题：

1. 保留 M3.1 archive，不移动 legacy 内容。
2. 从 `package.json` 移除 `ai-builder-os` bin alias、`validate:package-surface` 和 `agents/`、`skill-pack.json` files entry。
3. 从 `sync-and-publish.sh` 移除 M3.2 pack required/forbidden gate。
4. 移除 `skill-pack.json`、`agents/openai.yaml` 和 `scripts/validate-package-surface.js`。
5. 重新运行：

```bash
npm run validate:builder-os
node install.js codex --overwrite
npm run validate:codex-install
npm pack --dry-run --json
```

## M3.3 输入

M3.3 应聚焦 runtime adapter/export hardening：

- 是否需要 `scripts/export-ai-builder-os.js` 或 projection tooling。
- 是否需要生成 Codex、Claude Code、generic-agent 三种目标目录。
- 是否需要 per-skill `agents/openai.yaml` 或只保留 package-level metadata。
- 是否需要 repo-local pack validator 解析实际 `npm pack --dry-run --json` 输出。
- 不在 M3.3 做 trigger description optimization；该事项留给 M3.4。

## 剩余风险

- npm package name 尚未变更，外部仍会看到 `pm-copilot-skills`；这是兼容选择，不是最终品牌形态。
- `ai-builder-os` bin alias 对 `npx` 的直接体验受 npm 调用方式限制，推荐写法是 `npx -p pm-copilot-skills ai-builder-os`。
- `agents/openai.yaml` 目前是 package-level metadata，不代表 OpenAI 插件或完整 runtime adapter 已经完成。
