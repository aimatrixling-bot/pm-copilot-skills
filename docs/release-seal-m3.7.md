# AI Builder OS Milestone 3.7 Package / Repo Migration Dry-run Seal

## Seal

- Milestone: Milestone 3.7
- Status: package / repo migration dry-run
- Decision: validate dual-package feasibility before any npm publish
- Primary package candidate: `ai-builder-os`
- Compatibility package: `pm-copilot-skills`

## Scope

本 milestone 验证 `ai-builder-os` 主包和 `pm-copilot-skills` 兼容包的技术可行性。

本次允许：

- 更新 package metadata 中的 dry-run release gate。
- 新增 dual-package dry-run validator。
- 更新 publish script 的 dry-run gate。
- 新增正式版命名、迁移和发布文档。

本次不做：

- 不执行 `npm publish`。
- 不 deprecate `pm-copilot-skills`。
- 不修改真实 `package.json` 的 `name`。
- 不迁移 repo。
- 不删除 archive。
- 不新增 builder skill。

## Dry-run Contract

`npm run validate:dual-package-dry-run` 必须：

1. 从当前 npm pack surface 复制文件到临时目录。
2. 生成 `ai-builder-os` primary package projection。
3. 生成 `pm-copilot-skills` compatibility package projection。
4. 分别运行 `npm pack --dry-run --json`。
5. 分别运行 `node install.js codex-project --overwrite`。
6. 验证两个 projection 都只安装 8 个 active builder skills。
7. 验证 forbidden prefixes 不进入任何 projection：
   - `_archived/`
   - `research/`
   - `skills/pm-*`
   - `skills/pdf`
   - `skills/pptx`
   - `skills/download-anything`
   - `skills/references`

## Install Commands

Primary package:

```bash
npx ai-builder-os
npx ai-builder-os codex
npx -p ai-builder-os ai-builder-os codex
```

Compatibility package:

```bash
npx pm-copilot-skills
npx pm-copilot-skills codex
npx -p pm-copilot-skills ai-builder-os codex
```

## Required Gates

```bash
npm run validate:dual-package-dry-run
npm run validate:builder-os
npm run validate:package-surface
npm run validate:runtime-adapters
npm run validate:trigger-descriptions
npm pack --dry-run --json
git diff --check
```

`sync-and-publish.sh` 必须在正式 publish 前运行 `validate:dual-package-dry-run`。

## Repo Strategy

M3.7 不做 repo split。当前 repo 仍是 canonical source。独立 repo 或目录迁移应在 1.0 正式发布后单独规划。

## Result

M3.7 结果：PASS_FOR_REVIEW。

验证结论：

- `ai-builder-os` 可作为 1.0 主包候选进入 M3.8 final seal。
- `pm-copilot-skills` 可作为兼容包继续发布。
- 双包 projection 的复杂度被限制在 `scripts/validate-dual-package-dry-run.js`，未改变真实 `package.json` 的 `name`。
- M3.8 final 1.0 seal 可以启动，但仍需在 publish 前重新确认 npm `ai-builder-os` 名称可用。

## Command Evidence

| Command / Check | Result |
| --- | --- |
| `npm run validate:dual-package-dry-run` | PASS；`ai-builder-os@1.0.0-dry-run.0` 和 `pm-copilot-skills@1.0.0-compat-dry-run.0` 都生成 150-file dry-run tarball，并通过临时 `codex-project` 安装 |
| `npm run validate:builder-os` | PASS；已检查 8 个 active builder skill、16 个 legacy PM skill 归档和 87 个必需文件 |
| `npm run validate:package-surface` | PASS |
| `npm run validate:runtime-adapters` | PASS；3 个 runtime target 和 8 个 active builder skills projection |
| `npm run validate:trigger-descriptions` | PASS；8 个 builder skill description 和 16 个 trigger-description cases |
| `node install.js codex --overwrite` | PASS；Codex 用户级安装更新 8 个 active builder skills |
| `npm run validate:codex-install` | PASS；目标目录只验证 8 个 AI Builder OS active builder skills |
| `npm run validate:doctor-preference-e2e` | PASS；14 个文件和 6 个 eval case |
| `npm run test:doctor-preference-e2e` | PASS；6/6 tests |
| `npm pack --dry-run --json` | PASS；当前兼容包仍是 `pm-copilot-skills@0.7.0`，150 files |
| `git diff --check` | PASS；仅 Windows CRLF 提示 |
| `npm view ai-builder-os` | E404；当前 registry 未找到该包，发布前仍需重新确认 |
| `npm view pm-copilot-skills` | latest `0.7.0` |

## Rollback

如 M3.7 dry-run 失败：

- 删除 `scripts/validate-dual-package-dry-run.js`。
- 从 `package.json`、`skill-pack.json`、`agents/openai.yaml`、`sync-and-publish.sh` 移除 `validate:dual-package-dry-run`。
- 保留 M3.5 RC package surface。
- 不执行 npm publish。
