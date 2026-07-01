---
title: AI Builder OS Release Seal v1.1
version: 1.1.0
status: v1.1-rc
rc_created_at: 2026-07-01
plan_ref: docs/builder-alignment-plan-v1.1.md
previous_seal: docs/release-seal-m3.9.md
---

# AI Builder OS Release Seal — v1.1 Builder Alignment (Release Candidate)

> **状态**：Release Candidate。工作树尚未 commit，无 git tag、无 npm publish 证据。本文件先冻结 v1.1 源码层的验证快照，待 commit 后再补 source_commit / tag / npm 证据，并升级为正式 Release Seal。
>
> 不可作为长期规则来源（见 `docs/source-of-truth-map.md`）。长期规则以 source-of-truth-map 为准；版本执行状态以 `docs/builder-alignment-plan-v1.1.md` 为准。

## 版本同步证据

四文件版本一致性（由 `npm run validate:package-surface` 强制）：

| 文件 | version | status |
|---|---|---|
| `package.json` | `1.1.0` | — |
| `skill-pack.json` | `1.1.0` | `v1.1-builder-alignment` |
| `bundles/core/manifest.json` | `1.1.0` | `v1.1-builder-alignment` |
| `agents/openai.yaml` | `1.1.0` | — |

## 计划完成度

来自 `docs/builder-alignment-plan-v1.1.md`，全部 10 个子任务 ✅ DONE：

- P0.4 四个 Memory Schema 黄金标准升级
- P0.1 八个 SKILL.md 对齐 skill-design-playbook（入口契约 / Skill Hardening Brief / Meta-Review / Evolution Writeback）
- P0.2 builder-decision 深度重构（MCDA + Reversibility Matrix + Cost of Delay）
- P0.3 builder-frame 嵌套 schema 端到端示例
- P1.1+P1.2 plan-brief + delivery-sign-off 模板
- P1.6 builder-spec `full_prd` 模式 + prd-quality-checklist
- P1.4+P1.5 evals README 归档 + run-eval-suite.js 轻量 runner
- P1.3 Examples marker 阈值检查（每个 SKILL.md ≥4 markers，实测 5/4 each）
- P2.2 本 release seal（RC 版）

## 行为级验证证据

- 每个 SKILL.md 包含：入口契约 / Skill Hardening Brief / Meta-Review / Evolution Writeback 四个新章节 ✅
- 4 个 memory schema 包含：Schema / Field Rules / Minimum Example / Usage Rule 四个章节 ✅
- builder-decision 包含 MCDA / Reversibility Matrix / Cost of Delay 三个关键词 ✅
- builder-spec 包含 `full_prd` 模式 ✅
- 每个 SKILL.md 的 examples ≥4 markers（实测 5/4 each）✅

## 自动化验证输出

执行于 2026-07-01（RC 阶段，未 commit）：

```
=== validate:builder-os ===
Builder OS 验证通过。
已检查 8 个 active builder skill、16 个 legacy PM skill 归档和 155 个必需文件。

=== validate:runtime-adapters ===
Runtime adapter/export 验证通过。
已验证 3 个 runtime target 和 8 个 active builder skills 的 projection。

=== validate:package-surface ===
Package surface 验证通过。
已验证 8 个 active builder skills、skill-pack.json、agents/openai.yaml 和 package files 边界。

=== validate:eval-suite ===  # schema fixture only, no LLM-as-judge
cases total : 121
passed      : 121
failed      : 0

=== check:examples ===  # marker gate, not semantic coverage
[PASS] builder-agent-task     5/4
[PASS] builder-decision       5/4
[PASS] builder-frame          5/4
[PASS] builder-plan-goal      5/4
[PASS] builder-prototype      5/4
[PASS] builder-review         5/4
[PASS] builder-router         5/4
[PASS] builder-spec           5/4
passing: 8, failing: 0
```

### Metric 边界声明（避免过度解释）

- **`validate:eval-suite`** 是 schema fixture 验证（`scripts/run-eval-suite.js:8`、`evals/README.md:9`），**不跑 LLM、不做回归质量判断**。"121/121 passed" 仅表示所有 case 的输出契约通过 schema 校验。
- **`check:examples`** 是 marker 覆盖检查（`scripts/check-examples-coverage.js:7`），统计 `**示例**`/`## 示例` 等标题数量。"8/8 passed" 仅表示每个 SKILL.md ≥4 markers，**不是语义覆盖**。

## Batch B：Release Gate 修正（RC 阶段补丁）

针对 RC 自审发现的 3 个 release gate 缺陷，本次在同一次工作树中修复，不另开 commit：

| 修正项 | 文件 | 变更 |
|---|---|---|
| **B1** | `scripts/prepare-dual-package-publish.js:10` | `defaultReleaseVersion` 从硬编码 `'1.0.0'` 改为 `require('../package.json').version`，让 dual-package publish prep 跟随 package.json（当前 1.1.0） |
| **B2** | `scripts/validate-dual-package-dry-run.js:97-122` | `packageTargets[*].version` 从硬编码 `1.0.0-dry-run.0` / `1.0.0-compat-dry-run.0` 改为从 `require('../package.json').version` 派生，使 dry-run 验证当前版本而非陈旧 1.0.0 |
| **B3** | `scripts/validate-package-surface.js:157-158` | 新增 2 条 assert，强制 `skill-pack.json:release_gates` 必须包含 `validate:eval-suite` 与 `check:examples`（与 Batch A1/A2 同步的 gate 列表互锁） |

### Batch B 验证输出（5 validator 重跑，2026-07-01）

```
=== validate:builder-os ===  (含内嵌 dual-package dry-run)
Builder OS 验证通过。
- ai-builder-os@1.1.0-dry-run.0           210 files
- pm-copilot-skills@1.1.0-compat-dry-run.0 210 files
（证明 B1+B2 已生效：版本派生自 package.json，不再陈旧 1.0.0）

=== validate:package-surface ===  (含 B3 新增 2 条 assert)
Package surface 验证通过。

=== validate:runtime-adapters ===
Runtime adapter/export 验证通过。

=== validate:eval-suite ===   # schema fixture only
cases total: 121, passed: 121, failed: 0

=== check:examples ===        # marker gate only
passing: 8, failing: 0 (5/4 markers each)
```

B3 的互锁证据：若 `skill-pack.json` 中 `validate:eval-suite` 或 `check:examples` 缺失，`validate:package-surface` 会失败；当前 PASS 状态确认 A1/A2（gate 列表同步）与 B3（validator 强制完整性）已对齐。

## Git Diff 摘要

基线：`5c7617d fix(builder-os): validate projected codex installs`（v1.0.6 末端）

**Modified (21 files, +1280 / -26 lines)**：
- `package.json`, `skill-pack.json`, `bundles/core/manifest.json`, `agents/openai.yaml` — 版本同步到 1.1.0；release_gates 追加 `validate:eval-suite` / `check:examples`
- `memory/schemas/{decision-memory,evolution-note,project-memory,user-memory}.schema.md` — 黄金标准升级
- `scripts/validate-builder-os.js` — 新增 4 章节/关键词/mode 检查（+79 行）
- `scripts/validate-package-surface.js` — 解耦 stale status literal（line 115）；Batch B3 新增 2 条 release_gates 完整性 assert（+2 行）
- `scripts/validate-dual-package-dry-run.js` — Batch B2：版本派生自 package.json（line 97-122）
- `scripts/prepare-dual-package-publish.js` — Batch B1：`defaultReleaseVersion` 派生自 package.json（line 10）
- `skills/builder-{router,plan-goal,frame,spec,prototype,agent-task,review,decision}/SKILL.md` — P0.1 公式套用（+89~108 行/each）

**New (10 files)**：
- `docs/builder-alignment-plan-v1.1.md` — 跨会话版本执行状态锚点
- `docs/release-seal-v1.1.md` — 本文件（RC）
- `evals/README.md` — evals placeholder 边界声明
- `references/prd-quality-checklist.zh.md` — P1.6 PRD 质量清单
- `scripts/check-examples-coverage.js` — P1.3 examples 阈值检查
- `scripts/run-eval-suite.js` — P1.5 schema-only eval runner
- `skills/builder-decision/references/decision-frameworks.zh.md` — P0.2 决策框架
- `skills/builder-frame/references/worked-example-idea-to-feature-frame.zh.md` — P0.3 端到端示例
- `templates/delivery-sign-off/template.md` — P1.2 3P 交付确认
- `templates/plan-brief/template.md` — P1.1 Plan Brief

## 红线遵守

- ✅ 未新增第 9 个 core skill（保持 8 个）
- ✅ 未做大规模目录重构
- ✅ 未实现 CLI / scanner / migrator / 自动写入用户项目
- ✅ 未删除历史 release seal（m2.3 → m3.9 全部保留）
- ✅ 未自动发布 npm、未自动打 tag

## 待补证据（commit 后升级为正式 Release Seal）

- [ ] git commit hash（源码层封存点）
- [ ] git tag（如 `v1.1.0`）
- [ ] `npm publish` 证据（如发布）
- [ ] Batch C：`node install.js codex --overwrite` + `npm run validate:codex-install` 输出（Codex 安装面同步，按用户指示 commit 后再执行）
- [x] 最终 5 validator 重跑结果（见上方 "Batch B 验证输出"）

## Open Questions（v1.2 处理）

- Q1：Skill Hardening Brief 暴露字段子集是否需要 per-skill 定制？（v1.1 采用统一 12 字段最小集）
- Q2：eval runner 是否引入 LLM-as-judge？（v1.1 仅 schema 验证，v1.2 评估）
- Q3：L0-L4 知识分层 operational 工具（P2.1 推迟到 v1.2）

## 下一步

1. 用户决策是否 `git commit` + `git tag v1.1.0` + `npm publish`（由用户主动触发）
2. commit 后执行 Codex 安装面同步（Batch C）
3. 把上述证据回填到本文件，并把 status 从 `v1.1-rc` 升级为 `v1.1-sealed`
