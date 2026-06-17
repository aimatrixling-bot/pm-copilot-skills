# AI Builder OS Milestone 3.5 Release Candidate Seal

## Seal

- Milestone: Milestone 3.5
- Status: AI Builder OS 1.0 RC seal
- RC 判断: PASS_FOR_REVIEW
- Date: 2026-06-17
- Branch: `codex/rebuildtoaibuilderos`
- Baseline commit: `ef1ce06 chore(builder-os): converge pure AI Builder OS package surface`

## Scope

本 seal 只确认 AI Builder OS 1.0 RC 是否可评审、可安装、可打包、可回滚。

本次不做：

- 不新增 builder skill。
- 不新增产品能力。
- 不重命名 npm package。
- 不迁移仓库目录。
- 不删除 `_archived/` 内容。
- 不引入新依赖。
- 不 commit / push，除非用户明确要求。

## Current Surface

### Active surface

AI Builder OS 1.0 RC active surface 只包含 8 个 builder core skills：

- `builder-router`
- `builder-plan-goal`
- `builder-frame`
- `builder-spec`
- `builder-prototype`
- `builder-agent-task`
- `builder-review`
- `builder-decision`

### Package surface

对外 package surface 由以下文件和目录定义：

- `package.json`
- `skill-pack.json`
- `agents/openai.yaml`
- `bundles/core/manifest.json`
- `kernel/`
- `harness/`
- `memory/`
- `skills/builder-*`
- `references/`
- `templates/`
- `adapters/`
- `evals/`
- `scripts/`
- `docs/`

`pm-copilot-skills` 继续作为兼容 npm package id；`ai-builder-os` 是产品身份和命令别名。

### install surface

Codex 安装态应只暴露 8 个 active builder skills。安装器会把共享 `kernel`、`references`、`templates` 和 `adapters` 投影到每个 builder skill 中，使 skill 目录自包含。

### archive surface

旧 `pm-*` skills、legacy utilities 和原 `skills/references/` 保留在：

```text
_archived/pm-copilot-legacy-v1.0/
```

这些内容用于审阅、回滚和后续方法迁移，不进入 npm package surface，也不默认安装为 active skills。

## Release Gates

M3.5 RC 必须通过：

```bash
git status --short
git log -1 --oneline --decorate
git diff --check
npm run validate:builder-os
npm run validate:package-surface
npm run validate:runtime-adapters
npm run validate:trigger-descriptions
node install.js codex --overwrite
npm run validate:codex-install
npm run validate:doctor-preference-e2e
npm run test:doctor-preference-e2e
npm pack --dry-run --json
```

Windows 环境如无法执行 `sync-and-publish.sh --dry-run`，应使用等价 Node pack gate 检查：

- `docs/release-seal-m3.5.md` 进入 pack。
- `scripts/validate-trigger-descriptions.js` 进入 pack。
- `evals/trigger/builder-description.cases.json` 进入 pack。
- 8 个 `skills/builder-*/SKILL.md` 进入 pack。
- `_archived/`、`research/`、`skills/pm-*`、`skills/pdf`、`skills/pptx`、`skills/download-anything`、`skills/references` 不进入 pack。

## Command Evidence

本次 M3.5 RC seal 的验证结果：

| Command / Check | Result |
| --- | --- |
| `git status --short` | 仅 M3.5 seal 相关文件变更：`README.md`、`docs/architecture.md`、`docs/release-seal-m3.5.md`、`skill-pack.json`、`scripts/validate-builder-os.js`、`scripts/validate-package-surface.js`、`sync-and-publish.sh` |
| `git log -1 --oneline --decorate` | `ef1ce06 (HEAD -> codex/rebuildtoaibuilderos) chore(builder-os): converge pure AI Builder OS package surface` |
| `git diff --check` | PASS；仅 Windows CRLF 提示 |
| `npm run validate:builder-os` | PASS；8 个 active builder skill、16 个 legacy PM skill 归档、84 个必需文件 |
| `npm run validate:package-surface` | PASS；8 个 active builder skills、`skill-pack.json`、`agents/openai.yaml`、package files 边界 |
| `npm run validate:runtime-adapters` | PASS；3 个 runtime target 和 8 个 active builder skills projection |
| `npm run validate:trigger-descriptions` | PASS；8 个 builder skill description 和 16 个 trigger-description cases |
| `node install.js codex --overwrite` | PASS；更新 8 个 active builder skills 到 `C:\Users\max.ling\.agents\skills` |
| `npm run validate:codex-install` | PASS；Codex 目标目录只验证 8 个 AI Builder OS active builder skills |
| `npm run validate:doctor-preference-e2e` | PASS；14 个文件和 6 个 eval case |
| `npm run test:doctor-preference-e2e` | PASS；6/6 tests |
| `npm pack --dry-run --json` | PASS；`pm-copilot-skills-0.7.0.tgz`，147 files |
| M3.5 Node pack content gate | PASS；必需文件存在，forbidden legacy prefixes 不存在 |
| `bash ./sync-and-publish.sh --dry-run` | BLOCKED_BY_ENV；当前 Windows `bash` 进入 WSL 启动器，提示需安装/更新 WSL；已用等价 Node pack gate 覆盖包内容检查 |

## Surface Audit

源码 `skills/` active surface：

```text
builder-agent-task
builder-decision
builder-frame
builder-plan-goal
builder-prototype
builder-review
builder-router
builder-spec
skill-template.md
```

Codex 安装态中与本包相关的 builder / legacy skill 枚举：

```text
builder-agent-task
builder-decision
builder-frame
builder-plan-goal
builder-prototype
builder-review
builder-router
builder-spec
```

归档目录 `_archived/pm-copilot-legacy-v1.0/skills/`：

```text
download-anything
pdf
pm-agent-patterns
pm-ai-patterns
pm-code-architect
pm-code-implement
pm-code-review
pm-comp
pm-content-general
pm-decision
pm-deconstruct
pm-discovery
pm-feature-frame
pm-job-search
pm-launch
pm-prd
pm-prioritize
pm-prototype
pptx
references
```

## RC Evidence Checklist

| Requirement | Evidence source | Expected |
| --- | --- | --- |
| git 状态清楚 | `git status --short` | 仅 M3.5 seal 相关小修复，或最终为空 |
| 最新提交明确 | `git log -1 --oneline --decorate` | `ef1ce06` 或后续用户批准提交 |
| active surface 纯净 | `npm run validate:builder-os` | 8 个 active builder skills |
| package surface 纯净 | `npm run validate:package-surface` + pack gate | 无 legacy active files |
| runtime adapters 可投影 | `npm run validate:runtime-adapters` | codex / claude-code / generic-agent 通过 |
| trigger description 可验证 | `npm run validate:trigger-descriptions` | 8 skills + 16 cases 通过 |
| Codex 安装态可用 | `node install.js codex --overwrite` + `npm run validate:codex-install` | 只安装 8 个 active builder skills |
| e2e 基线未回归 | doctor preference validate/test | 6 个 case 通过 |
| pack 可发布 | `npm pack --dry-run --json` | 必需文件存在，forbidden prefixes 不存在 |

## Rollback

### 回滚 M3.5 seal 小修复

如果只需要撤销 M3.5 seal，可回滚这些文件：

- `docs/release-seal-m3.5.md`
- `README.md`
- `docs/architecture.md`
- `skill-pack.json`
- `scripts/validate-builder-os.js`
- `scripts/validate-package-surface.js`
- `sync-and-publish.sh`

### 回滚到 M3.4

恢复 `skill-pack.json` 的 status 为 `m3.4-trigger-description-hardening`，移除 M3.5 release seal 相关 validator 和 pack gate 要求，然后重新运行 release gates。

### 回滚 legacy archive

如需恢复旧 `pm-*` 兼容过渡态，从 `_archived/pm-copilot-legacy-v1.0/skills/` 移回对应目录到 `skills/`，并重新审查 installer、package surface 和 validator。该操作不属于 1.0 RC 默认路径。

## Tag / Push Recommendation

- tag: 建议在 M3.5 seal 变更被用户评审并提交后，再创建 `ai-builder-os-v1.0.0-rc.1` 或等价 RC tag。
- push: 建议在 release gates 通过、用户确认 commit 后再 push 当前分支。
- package rename: 不建议在 M3.5 内重命名 npm package；应作为 M3.6/M4 独立 Plan 处理兼容策略。
- repo split: 不建议在 M3.5 内迁移到独立目录或新仓库；应先形成正式 migration plan。

## Remaining Risks

- npm package id 仍为 `pm-copilot-skills`，对外叙事需持续强调这是兼容 id。
- 当前 validator 是静态结构和内容检查，不能替代真实多 runtime 人工试用。
- `trigger description` gate 能减少误触发，但不能证明所有 runtime 的 skill selection 行为完全一致。
- 旧 archive 内容体量较大，后续应按需迁移为 references/templates/evals，而不是重新暴露为 active skills。

## Next

M3.6 建议单独规划：

- AI Builder OS 1.0 正式版命名策略。
- npm package rename / alias / deprecation 策略。
- 是否迁移到 `D:\Max Brain for AI Copilot\30_Projects\personal\AI Builder OS` 或新仓库。
- `ai-builder-os-v1.0.0-rc.1` tag、push、npm publish 的发布顺序。
