# AI Builder OS Milestone 3.9 Publish Prep Seal

## Seal

- Milestone: Milestone 3.9
- Status: publish prep, dry-run only
- Decision: PASS_FOR_PUBLISH_APPROVAL_PENDING
- Final tag: `ai-builder-os-v1.0.0`
- Primary package: `ai-builder-os@1.0.0`
- Compatibility package: `pm-copilot-skills@1.0.0`
- Current patch candidate: `ai-builder-os-v1.0.2` / `ai-builder-os@1.0.2` / `pm-copilot-skills@1.0.2`

## Scope

M3.9 当前阶段只完成发布专项准备，不执行真实发布。

本次允许：

- 新增 M3.9 publish runbook。
- 新增双包发布准备脚本 `scripts/prepare-dual-package-publish.js`。
- 生成 `ai-builder-os@1.0.0` 与 `pm-copilot-skills@1.0.0` 的发布投影和 tarball dry-run。
- 运行 registry preflight、`npm publish --dry-run`、release gates 和 post-release verification 清单检查。

本次不做：

- 不执行真实 `npm publish`。
- 不创建 `ai-builder-os-v1.0.0` final tag。
- 不 deprecate `pm-copilot-skills`。
- 不删除 archive。
- 不改变 active builder skills。
- 不把 `sync-and-publish.sh` 当作正式双包发布器。

## Dedicated Publish Prep Tool

命令：

```bash
npm run prepare:dual-package-publish -- --out ".release/ai-builder-os-v1.0.0" --clean --check-registry --npm-publish-dry-run
```

安全约束：

- 脚本没有真实 publish 路径。
- 脚本拒绝 `--publish`，传入后会直接失败。
- 脚本支持显式 `--version` 和 `--tag`，用于 post-1.0 patch release 的 dry-run-only 发布准备。
- 只生成 projection、tarball 和 `release-manifest.json`。
- 真实发布必须从 manifest 中的 publish command 手工执行，并且需要用户明确批准。

## Required Human Approval

执行以下任一动作前必须再次获得用户明确确认：

- `git tag ai-builder-os-v1.0.0`
- `git push origin ai-builder-os-v1.0.0`
- `npm publish ".release/ai-builder-os-v1.0.0/tarballs/ai-builder-os-1.0.0.tgz" --access public`
- `npm publish ".release/ai-builder-os-v1.0.0/tarballs/pm-copilot-skills-1.0.0.tgz" --access public`
- GitHub Release 创建或发布

## Release Runbook

正式步骤见：

- `docs/release-runbook-m3.9.md`

发布顺序：

1. 确认 `master` 干净且位于最终 release commit。
2. 确认 `ai-builder-os` 名称可发布，`pm-copilot-skills@1.0.0` 未发布。
3. 运行完整 release gates。
4. 运行 `prepare:dual-package-publish` 生成 tarball。
5. 获得用户明确批准。
6. 创建并推送 final tag。
7. 先发布 `ai-builder-os@1.0.0`。
8. 验证主包真实 npx 安装。
9. 再发布 `pm-copilot-skills@1.0.0`。
10. 验证兼容包真实 npx 安装。
11. 创建 GitHub Release。

## Command Evidence

当前 M3.9 publish prep dry-run 结果：

| Command / Check | Result |
| --- | --- |
| `npm run prepare:dual-package-publish -- --version 1.0.2 --tag ai-builder-os-v1.0.2 --out ".release/ai-builder-os-v1.0.2" --clean --check-registry --npm-publish-dry-run` | PASS；生成 `ai-builder-os@1.0.2` 与 `pm-copilot-skills@1.0.2` 两个 projection，并执行 `npm publish --dry-run` |
| `npm run validate:builder-os` | PASS；8 个 active builder skill、16 个 legacy PM skill 归档、110 个必需文件，包含 artifact/onboarding eval gates |
| `npm run validate:artifact-evals` | PASS；3 个 artifact eval 文件和 12 个 cases |
| `npm run validate:onboarding-evals` | PASS；5 个 onboarding cases，覆盖 5 个 project modes |
| `npm run validate:trigger-descriptions` | PASS；兼容 Windows CRLF / LF frontmatter |
| Primary package dry-run | PASS；`ai-builder-os@1.0.2`，179 files |
| Compatibility package dry-run | PASS；`pm-copilot-skills@1.0.2`，179 files |
| Registry preflight | PASS；`ai-builder-os` latest 为 `1.0.1`，`pm-copilot-skills` latest 为 `1.0.1`，目标版本 `1.0.2` 均未发布 |
| Tag preflight | PASS；远端 `ai-builder-os-v1.0.2` tag 不存在 |
| Safety check | PASS；未执行真实 `npm publish`，release 输出保留在 `.release/ai-builder-os-v1.0.2/` 作为发布前证据；manifest 记录 `sourceWorktreeStatus` |

## Remaining Risks

- `ai-builder-os` 在 preflight 时返回 E404 不等于发布时一定可用；发布窗口内仍可能被占用。
- Post-1.0 patch release 必须显式选择未发布版本；不能复用已发布的 `1.0.0` 或 `1.0.1`。
- 当前 dry-run 可在未提交工作树上生成证据，但真实 tag / npm publish 必须来自干净的 final release commit。
- `npm publish --dry-run` 不能完全替代真实 registry publish。
- 发布 tarball 源于 projection，必须保留 `release-manifest.json` 作为证据。
- npm publish 不可真正回滚；发布后以 fix-forward 为主。
