# AI Builder OS Milestone 2.3 Release Seal

## 结论

当前 M1/M2/M2.2 工作树可以进入人工 review 和提交准备，前提是提交时保持本报告列出的范围边界。

本次 release seal 的重点不是新增能力，而是确认当前 AI Builder OS 骨架、builder core skills、UI/UX shared contract、Design Brief、Design Consistency Gate、installer 和 validator 之间的一致性。

## 变更分类

### 核心交付

- `kernel/`：Builder Kernel 的 routing、packets、gates、protocols。
- `harness/`：执行指南、sensors、gates、steering loop、tool policy 和 run report schema。
- `memory/`：用户、项目、产物、决策和 evolution memory 的 schema 与 policy。
- `skills/builder-*`：8 个 AI Builder OS core skill 草案。
- `references/ui-ux/`：UI/UX shared contract。
- `templates/`：Feature Frame、Builder Spec、Agent Task Packet、Design Brief、Decision Record 等模板。
- `bundles/core/`：AI Builder OS core bundle manifest。
- `adapters/`：Codex、Claude Code 和 generic-agent 的 runtime projection notes。

### 验证脚本

- `scripts/validate-builder-os.js`：检查 Builder OS 必需文件、builder skill 结构、Plan Goal Coach 等价内容、UI/UX contract、output contract、routing/trigger eval 和 core bundle。
- `scripts/validate-codex-install.js`：检查 Codex 安装态目录、marker、builder skill 数量，以及每个 builder skill 内的共享 `kernel/`、`references/`、`templates/` 资源。

### 安装逻辑

- `install.js` 保留原 package 名和安装入口。
- Codex 安装仍默认跳过 `pdf` / `pptx` utility copy，避免重复能力污染。
- 每个 `builder-*` 安装目录会复制 Builder OS 共享资源：`adapters/`、`kernel/`、`references/`、`templates/`，保证相对引用在安装态可用。

### 文档

- `README.md`：产品身份、安装方式、验证命令、项目结构和 Milestone 2.2 状态。
- `docs/architecture.md`：AI Builder OS 架构、迁移边界、真相源边界和验证策略。
- `references/README.md`、`templates/README.md`：共享 reference/template 的分层规则。
- `docs/release-seal-m2.3.md`：本 release seal 报告。

### Eval / Schema

- `evals/trigger/`：builder core trigger cases。
- `evals/routing/`：builder workflow routing cases。
- `evals/output-contract/`：builder-plan-goal、feature-frame、builder-spec、agent-task-packet、design-brief output contracts。
- `evals/e2e/`、`evals/evidence/`、`evals/quality/`、`evals/regression/`、`evals/personalization/`：后续 E2E、证据、质量和回归评测占位与说明。

## Untracked 目录归属

| 目录 | 归属 | 是否应纳入提交 |
| --- | --- | --- |
| `adapters/` | Runtime adapters | 是 |
| `bundles/` | Scenario bundles | 是 |
| `docs/` | 架构和 release seal 文档 | 是 |
| `evals/e2e/` | E2E 场景 | 是 |
| `evals/evidence/` | Evidence rubric | 是 |
| `evals/output-contract/` | Output contract schema | 是 |
| `evals/personalization/` | Personalization eval 占位 | 是 |
| `evals/quality/` | Quality rubric | 是 |
| `evals/regression/` | Regression eval 占位 | 是 |
| `evals/routing/` | Routing eval | 是 |
| `evals/trigger/` | Trigger eval | 是 |
| `examples/` | 示例入口 | 是 |
| `harness/` | Execution harness | 是 |
| `kernel/` | Builder kernel | 是 |
| `memory/` | Memory & evolution | 是 |
| `references/` | Runtime-neutral shared references | 是 |
| `skills/builder-*` | Core builder skills | 是 |
| `templates/` | Shared templates | 是 |

未发现应从本次提交中剔除的新增 Builder OS 目录。

## 安装态一致性

检查目标：`C:\Users\max.ling\.agents\skills`

安装态必须满足：

- 8 个 `builder-*` skill 均存在。
- 每个 `builder-*` skill 目录包含 `SKILL.md` 和 `.pm-copilot-skills-source.json` marker。
- 每个 `builder-*` skill 目录包含可相对读取的共享资源：
  - `kernel/README.md`
  - `kernel/gates/design-consistency-gate.zh.md`
  - `references/ui-ux/design-principles.zh.md`
  - `references/ui-ux/component-guidelines.zh.md`
  - `references/ui-ux/interaction-patterns.zh.md`
  - `references/ui-ux/visual-style.zh.md`
  - `templates/design-brief/template.md`

`validate:codex-install` 已覆盖这些安装态风险。

## Package dry-run

`npm pack --dry-run --json` 应证明 npm 包包含：

- `install.js`
- `README.md`
- `docs/`
- `kernel/`
- `harness/`
- `memory/`
- `references/`
- `templates/`
- `adapters/`
- `bundles/`
- `skills/builder-*`
- `evals/trigger/`
- `evals/routing/`
- `evals/output-contract/`

## 回滚方式

如果本次提交后需要回滚：

1. 使用 `git revert <commit>` 回滚已提交的 Builder OS M1/M2/M2.2/M2.3 变更。
2. 如只想清理本地未提交变更，先人工确认目标路径，再删除本次新增目录或恢复 tracked 文件。
3. 安装态回滚不应手工编辑单个 skill；应重新运行上一个稳定版本的 installer，或删除带 `.pm-copilot-skills-source.json` marker 的 package-owned 目录后重装。

## 剩余风险

- 旧 `pm-*` skills 保留为历史资产，本次不做全面断链修复或结构统一。
- `skills/pm-prototype/SKILL.md` 仍存在历史引用 `references/scene-templates.md`，该问题不属于本次 Builder OS M1/M2/M2.2 新增范围；如要修复，应另开小型兼容性修复。
- `builder-prototype`、`builder-agent-task`、`builder-review` 和 `builder-decision` 已接入核心骨架，但尚未达到 `builder-plan-goal` 的完整 reference/template/eval 深度。
- 当前 validator 是 deterministic static gate，不替代真实 agent runtime 的触发质量测试。

## 建议提交信息

```text
feat(builder-os): seal core skills and design contract release
```

## Release Seal 判定

判定：`PASS`

理由：

- 当前变更范围可归类。
- 新增目录有明确 AI Builder OS 分层归属。
- 安装态和源码态的 builder shared resources 已对齐。
- validator 覆盖核心文件、builder skill 结构、Plan Goal Coach 等价内容、UI/UX contract、output contracts、routing eval、trigger eval 和安装态共享资源。
- 不重命名 npm package。
- 不引入新依赖。
- 不删除旧 `pm-*` skills。
