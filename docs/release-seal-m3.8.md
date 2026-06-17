# AI Builder OS Milestone 3.8 Final 1.0 Release Seal

## Seal

- Milestone: Milestone 3.8
- Status: final 1.0 release seal
- Decision: PASS_FOR_RELEASE_PREP
- Primary package: `ai-builder-os@1.0.0`
- Compatibility package: `pm-copilot-skills@1.0.0`
- Final tag: `ai-builder-os-v1.0.0`
- Current source package: `pm-copilot-skills@0.7.0`

## Scope

M3.8 冻结 AI Builder OS 1.0 正式发布策略，但不执行发布动作。

本次允许：

- 新增 final 1.0 release seal。
- 更新 README、architecture、manifest、validator 和 pack gate，使其识别 M3.8。
- 记录最终 package names、version、tag、publish 顺序和 post-release verification。

本次不做：

- 不执行 `npm publish`。
- 不创建 final tag。
- 不 deprecate `pm-copilot-skills`。
- 不迁移 repo。
- 不删除 archive。
- 不新增 builder skill。

## Frozen Release Strategy

### Package names

- 主包：`ai-builder-os`
- 兼容包：`pm-copilot-skills`
- 两个包都从同一个 canonical source projection 生成。
- 兼容包不得重新暴露旧 `pm-*` active skills。

### Versions

- 主包正式版本：`ai-builder-os@1.0.0`
- 兼容包正式版本：`pm-copilot-skills@1.0.0`
- 当前 source 仍保持 `pm-copilot-skills@0.7.0`，直到正式 publish milestone 执行版本切换和 tag。

### Release tag

正式 release tag：

```text
ai-builder-os-v1.0.0
```

RC tag 已存在：

```text
ai-builder-os-v1.0.0-rc.1
```

### Publish order

1. 合并 M3.8 release seal 变更。
2. 从最终 release commit 创建 `ai-builder-os-v1.0.0` tag。
3. 重新确认 `npm view ai-builder-os` 仍返回 404 或确认包归属可发布。
4. 运行完整 release gates。
5. 先发布 `ai-builder-os@1.0.0`。
6. 运行真实安装验证：`npx ai-builder-os codex`。
7. 再发布 `pm-copilot-skills@1.0.0` 兼容版本。
8. 运行真实安装验证：`npx pm-copilot-skills codex`。
9. 创建 GitHub Release，附上验证结果和迁移说明。

## Required Gates

发布前必须通过：

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

## Command Evidence

M3.8 当前验证结果：

| Command / Check | Result |
| --- | --- |
| `npm run validate:package-surface` | PASS；8 个 active builder skills、`skill-pack.json`、`agents/openai.yaml` 和 package files 边界 |
| `npm run validate:dual-package-dry-run` | PASS；`ai-builder-os@1.0.0-dry-run.0` 和 `pm-copilot-skills@1.0.0-compat-dry-run.0` 都生成 151-file dry-run tarball，并通过临时 `codex-project` 安装 |
| `npm run validate:builder-os` | PASS；8 个 active builder skill、16 个 legacy PM skill 归档和 88 个必需文件 |
| `npm run validate:runtime-adapters` | PASS；3 个 runtime target 和 8 个 active builder skills projection |
| `npm run validate:trigger-descriptions` | PASS；8 个 builder skill description 和 16 个 trigger-description cases |
| `node install.js codex --overwrite` | PASS；更新 Codex 用户级 8 个 active builder skills |
| `npm run validate:codex-install` | PASS；目标目录只验证 8 个 AI Builder OS active builder skills |
| `npm run validate:doctor-preference-e2e` | PASS；14 个文件和 6 个 eval case |
| `npm run test:doctor-preference-e2e` | PASS；6/6 tests |
| `npm pack --dry-run --json` | PASS；当前 source package 仍是 `pm-copilot-skills@0.7.0`，151 files |
| `git diff --check` | PASS；仅 Windows CRLF 提示 |
| `npm view ai-builder-os` | E404；当前 registry 未找到该包，发布前必须再次确认 |
| `npm view pm-copilot-skills` | latest `0.7.0` |

## Diff Boundary

M3.8 仍未执行真实发布动作：

- 未修改真实 `package.json` 的 `name`。
- 未执行 `npm publish`。
- 未创建 `ai-builder-os-v1.0.0` final tag。
- 未 deprecate `pm-copilot-skills`。
- 未迁移 repo。

## Post-release Verification

发布后必须验证：

```bash
npm view ai-builder-os version
npm view pm-copilot-skills version
npx ai-builder-os codex --overwrite
npm run validate:codex-install
npx pm-copilot-skills codex --overwrite
npm run validate:codex-install
npm run export:runtime -- --target codex --out .\dist\ai-builder-os\codex --clean
npm run export:runtime -- --target claude-code --out .\dist\ai-builder-os\claude-code --clean
npm run export:runtime -- --target generic-agent --out .\dist\ai-builder-os\generic-agent --clean
```

人工检查：

- Codex 新线程可识别 `$builder-router`、`$builder-plan-goal`、`$builder-spec`。
- Claude Code skill root 中只出现 8 个 active builder skills。
- `_archived/` 不进入 npm package。
- README 顶部说明 `ai-builder-os` 是主包，`pm-copilot-skills` 是兼容包。

## Compatibility Policy

- `pm-copilot-skills` 至少保留一个 1.0 兼容版本。
- 不立即 deprecate 旧包。
- 如未来 deprecate，必须先发布迁移公告和至少一个 patch 周期。
- installer 继续清理由本包旧版本安装的 legacy active surface，但只在 marker 证明属于本包时执行。

## Rollback / Fix-forward

npm publish 不能被视为可回滚操作，发布后以 fix-forward 为主：

- `ai-builder-os@1.0.0` 发布失败：停止，不发布兼容包，修正后重新发布主包。
- `ai-builder-os@1.0.0` 已发布但安装失败：发布 `ai-builder-os@1.0.1`。
- 兼容包发布失败：保留 `pm-copilot-skills@0.7.0` latest，修正后再发布兼容版本。
- 文档错误：发布 patch 版本并更新 GitHub Release notes。

## Remaining Risks

- `ai-builder-os` npm 名称在 M3.7 检查时可用，但发布前仍可能被占用。
- 双包 projection 是 dry-run，不能替代真实 npm registry 安装验证。
- `sync-and-publish.sh` 仍是 canonical source 的 release gate helper 和历史单包发布脚本，不是正式双包发布器；M3.9 发布前必须按本 seal 手工执行 publish order，或先补专用双包发布脚本并 dry-run。
- 当前 repo 仍名为 `pm-copilot-skills`，品牌和 repo URL 不完全一致。
- Windows 下 `sync-and-publish.sh` 仍可能受 WSL/bash 环境影响，应保留 Node release gates。

## M3.9 Input

M3.9 publish and post-release verification 应只执行发布和验证：

- 不新增功能。
- 不重构 package surface。
- 不更改 active skills。
- 不直接使用 `sync-and-publish.sh` 执行双包发布，除非先完成专用双包发布脚本改造和 dry-run。
- 只按本 seal 的 publish order 执行。
