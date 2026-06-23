# AI Builder OS M6-M9 Delivery Kernel Release Seal

## Seal

- Milestone: M6-M9 Delivery Kernel
- Status: release-ready, local runtime installed
- Decision: PASS_FOR_LOCAL_TRIAL
- Public npm publish: not executed
- Git tag: not created
- Active skill surface: 8 builder core skills

## Scope

本 seal 覆盖 Delivery Kernel v0.1 从定义到本机运行时可用的最小闭环：

- M6：新增 Delivery Kernel 文档、Definition Sync Loop 和 4 个模板。
- M7：把 Delivery Kernel 接入现有 output-contract schema 和 5 个相关 builder skills。
- M8：新增 routing / trigger / delivery-kernel eval 覆盖三种模式与 definition drift。
- M9：通过 validator、package dry-run、Codex 安装同步和安装态验证，让用户可以在真实使用中观察效果。

## Delivered Capabilities

- 新建模式 `create`：从 0 做，核心产物是 Module Execution Pack。
- 迭代模式 `improve`：在旧上改，核心产物是 Change Contract。
- 重塑模式 `reframe`：先重定再做，核心产物是 Asset Digestion + Target Shape + Execution Pack。
- Definition Sync Loop：完成前区分 `Implementation Adjustment`、`Spec Gap`、`Requirement Change`、`Conflict / Contradiction`。
- Branch State：用于长对话、Goal、上下文压缩、高保真原型和跨仓库任务。

## Runtime Installation

本地 Codex 用户级安装面：

```text
C:\Users\max.ling\.agents\skills
```

安装方式：

```bash
node install.js codex
npm run validate:codex-install
```

安装面仍只包含 8 个 active builder skills，不恢复 legacy `pm-*` skills，不新增第 9 个 core skill。

## Verification Commands

本 seal 的通过条件：

```bash
npm run validate:builder-os
npm run validate:package-surface
npm run validate:runtime-adapters
npm run validate:trigger-descriptions
npm run validate:artifact-evals
npm run validate:onboarding-evals
npm run validate:dual-package-dry-run
npm run validate:doctor-preference-e2e
npm run test:doctor-preference-e2e
node install.js codex
npm run validate:codex-install
npm pack --dry-run --json
git diff --check
```

## Command Evidence

本轮记录的验证结果：

| Command / Check | Result |
| --- | --- |
| `npm view ai-builder-os version` | PASS；当前 latest 为 `1.0.4` |
| `npm view pm-copilot-skills version` | PASS；当前 latest 为 `1.0.4` |
| `git ls-remote --tags origin ai-builder-os-v1.0.5` | PASS；输出为空，候选 tag 当前不存在 |
| `npm run validate:builder-os` | PASS；8 个 active builder skill、16 个 legacy PM skill 归档、139 个必需文件 |
| `npm run validate:package-surface` | PASS |
| `npm run validate:runtime-adapters` | PASS |
| `npm run validate:trigger-descriptions` | PASS；8 个 builder skill description 和 16 个 trigger-description cases |
| `npm run validate:artifact-evals` | PASS；3 个 artifact eval 文件和 12 个 cases |
| `npm run validate:onboarding-evals` | PASS；5 个 onboarding cases |
| `npm run validate:dual-package-dry-run` | PASS；两个 dry-run projection 均为 208 files |
| `npm run validate:doctor-preference-e2e` | PASS；14 个文件和 6 个 eval case |
| `npm run test:doctor-preference-e2e` | PASS；6 个测试通过 |
| `npm pack --dry-run --json` | PASS；`pm-copilot-skills@0.7.0`，208 files |
| `npm run prepare:dual-package-publish -- --version 1.0.5 --tag ai-builder-os-v1.0.5 --out ".release/ai-builder-os-v1.0.5-delivery-kernel" --clean --check-registry --npm-publish-dry-run` | PASS；生成 `ai-builder-os@1.0.5` 与 `pm-copilot-skills@1.0.5` tarball，均为 208 files |
| `node install.js codex` | PASS；8 个 active builder skills 更新到 `C:\Users\max.ling\.agents\skills` |
| `npm run validate:codex-install` | PASS |
| `git diff --check` | PASS；仅 Windows LF/CRLF warning，无 whitespace error |

发布准备产物：

```text
.release/ai-builder-os-v1.0.5-delivery-kernel/release-manifest.json
.release/ai-builder-os-v1.0.5-delivery-kernel/tarballs/ai-builder-os-1.0.5.tgz
.release/ai-builder-os-v1.0.5-delivery-kernel/tarballs/pm-copilot-skills-1.0.5.tgz
```

## Release Boundary

本次允许：

- 提交 M6-M9 Delivery Kernel 相关源码、文档、模板、eval、schema 和 validator。
- 运行 dry-run-only package / release checks。
- 更新本机 Codex runtime 安装面。

本次不做：

- 不执行真实 `npm publish`。
- 不创建或推送 git tag。
- 不 deprecate `pm-copilot-skills`。
- 不删除 `_archived/`。
- 不改变 npm package name。
- 不新增 core skill。
- 不把 PMS 领域规则写进通用 Delivery Kernel。

## Trial Guidance

实际试用时优先观察：

- 模糊构建任务是否能先判定 `create` / `improve` / `reframe`。
- 高保真原型或多轮 Goal 是否会主动要求 Branch State。
- Agent Task Packet 是否保留 forbidden actions、verification 和 stop condition。
- 完成前 review 是否会输出 Definition Drift Check，而不是直接声称可合并。
- 反复纠错是否会沉淀到 gate / loop / template / skill / eval，而不是停留在聊天里。

## Remaining Risks

- 当前 seal 只代表本地 release-ready 和 runtime install 已完成，不代表真实 npm publish。
- Delivery Kernel 的真实效果仍需要在 PMS 或其他复杂模块中观察。
- 若未来要公开发布 npm 包，仍必须按 `docs/release-runbook-m3.9.md` 重新做版本、tag、registry 和 publish approval。
