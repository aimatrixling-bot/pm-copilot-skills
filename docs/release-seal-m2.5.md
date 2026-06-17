# AI Builder OS Milestone 2.5 Release Boundary Seal

## 结论

当前 M1-M2.4 工作树可以进入人工 review 和分组提交准备，前提是提交时保持本报告列出的边界。

本次 M2.5 不新增产品能力，不优化 builder skill frontmatter description，不重命名 npm package，不删除旧 `pm-*` skills，不引入新依赖。它只确认当前工作树的可评审性、可提交性、可回滚性，并为 M2.6 Trigger Description Eval Plan 建立稳定输入基线。

判定：`PASS_WITH_COMMIT_SPLIT`

原因：

- 当前变更可以按 AI Builder OS 分层清晰归类。
- 源码态和 Codex 安装态 validator 已覆盖当前 release contract。
- 旧 `pm-*` skills 未被本轮修改。
- 当前工作树很大，不建议压成单个 commit。

## 当前变更分类

### Tracked 修改

当前 tracked diff 只涉及 5 个文件：

| 文件 | 归属 | 说明 |
| --- | --- | --- |
| `README.md` | 文档 | AI Builder OS 产品身份、安装方式、验证基线、M2.4 hardening 状态 |
| `install.js` | 安装逻辑 | Codex 用户级安装、builder shared resources copy、Codex utility skip、安装输出提示 |
| `package.json` | package manifest | 保留包名，扩展 package files 以包含 AI Builder OS 分层目录 |
| `scripts/validate-builder-os.js` | 源码态 validator | 检查 builder skills、shared contracts、templates、eval/schema、routing/trigger、release seal |
| `scripts/validate-codex-install.js` | 安装态 validator | 检查 Codex 用户级安装态和每个 builder skill 的共享资源 |

### Untracked 新增目录

当前 untracked 共 108 个文件，全部落在 AI Builder OS 交付分层内。

| 目录 | 文件数 | 分类 | 是否纳入提交 |
| --- | ---: | --- | --- |
| `adapters/` | 9 | Runtime adapter notes | 是 |
| `bundles/` | 2 | Core bundle manifest | 是 |
| `docs/` | 3 | 架构与 release seal 文档 | 是 |
| `evals/` | 19 | trigger/routing/output-contract/quality/e2e/evidence 占位和案例 | 是 |
| `examples/` | 1 | 示例入口 | 是 |
| `harness/` | 7 | Execution harness | 是 |
| `kernel/` | 20 | Builder Kernel: gates、packets、protocols、routing | 是 |
| `memory/` | 10 | Memory & evolution schema/policies | 是 |
| `references/` | 8 | UI/UX contract 与 Skill Design Playbook | 是 |
| `scripts/` | 1 | Skill Design Playbook validator | 是 |
| `skills/builder-*` | 21 | 8 个 builder skills 及本地 references/templates/assets | 是 |
| `templates/` | 7 | shared output templates | 是 |

未发现应从本次 release boundary 中剔除的无关新增目录。

## M2.4 / M2.5 可提交范围

### M2.4 可提交范围

- `references/skill-design/`
- `templates/skill-hardening-brief/`
- `evals/output-contract/skill-hardening-brief.schema.json`
- `evals/quality/skill-design-playbook.rubric.md`
- `scripts/validate-skill-design-playbook.js`
- `skills/builder-plan-goal/SKILL.md` 中对 Skill Design Playbook / Skill Hardening Brief 的引用
- `scripts/validate-builder-os.js` 和 `scripts/validate-codex-install.js` 中对应 M2.4 检查

### M2.4 后续 hardening 可提交范围

- `skills/builder-router/SKILL.md`
- `skills/builder-frame/SKILL.md`
- `skills/builder-spec/SKILL.md`
- `skills/builder-prototype/SKILL.md`
- `skills/builder-agent-task/SKILL.md`
- `skills/builder-review/SKILL.md`
- `skills/builder-decision/SKILL.md`
- `templates/prototype-brief/template.md`
- `templates/review-report/template.md`
- `templates/agent-task-packet/template.md`
- `templates/decision-record/template.md`
- `kernel/routing/builder-router.zh.md`
- `kernel/packets/agent-task-packet.schema.md`
- `kernel/packets/decision-record.schema.md`
- `evals/output-contract/builder-router.schema.json`
- `evals/output-contract/builder-prototype.schema.json`
- `evals/output-contract/builder-review.schema.json`
- `evals/output-contract/decision-record.schema.json`
- `evals/output-contract/agent-task-packet.schema.json`
- `evals/trigger/builder-core.cases.json`
- `evals/routing/builder-routing.cases.json`

### M2.5 可提交范围

- `docs/release-seal-m2.5.md`
- 如 validator 或 README 中缺少 release boundary 信息，可做最小补充。

## 建议 commit 拆分

建议拆成 5 个 commit，而不是单个大 commit：

1. `feat(builder-os): add kernel harness memory and adapters`
   - `kernel/`
   - `harness/`
   - `memory/`
   - `adapters/`
   - `bundles/`
   - `examples/`

2. `feat(builder-os): add core builder skills and contracts`
   - `skills/builder-*`
   - `templates/agent-task-packet/`
   - `templates/decision-record/`
   - `templates/design-brief/`
   - `templates/prototype-brief/`
   - `templates/review-report/`

3. `feat(builder-os): add shared references and skill design playbook`
   - `references/`
   - `templates/skill-hardening-brief/`
   - `evals/quality/skill-design-playbook.rubric.md`
   - `scripts/validate-skill-design-playbook.js`

4. `test(builder-os): add eval contracts and validation gates`
   - `evals/`
   - `scripts/validate-builder-os.js`
   - `scripts/validate-codex-install.js`

5. `docs(builder-os): update package docs and release seals`
   - `README.md`
   - `docs/`
   - `package.json`
   - `install.js`

如果希望 commit 更少，可以合并为 3 个：`core architecture`、`skills/contracts/evals`、`installer/docs/seal`。不建议少于 3 个。

## 回滚方式

### 已提交后回滚

优先使用：

```bash
git revert <commit>
```

如果按建议拆分 commit，可以只回滚某一层，例如只回滚 `docs(builder-os)` 或只回滚 `test(builder-os)`。

### 未提交时回滚

不要使用 `git reset --hard`，除非已经确认要抛弃全部本地变更。

建议按路径人工确认后清理：

- 新增目录：`adapters/`、`bundles/`、`docs/`、`evals/`、`examples/`、`harness/`、`kernel/`、`memory/`、`references/`、`skills/builder-*`、`templates/`
- tracked 修改：`README.md`、`install.js`、`package.json`、`scripts/validate-builder-os.js`、`scripts/validate-codex-install.js`

### 安装态回滚

不要手工编辑单个已安装 skill。使用上一个稳定版本的 installer 重新安装，或删除带 `.pm-copilot-skills-source.json` marker 的 package-owned 目录后重装。

## 旧 `pm-*` skills 状态

本次 M2.5 不修改旧 `pm-*` skills。

检查命令：

```bash
git diff --name-only -- "skills/pm-*"
```

期望结果为空。

历史风险仍保留：`skills/pm-prototype/SKILL.md` 曾被发现存在 `references/scene-templates.md` 的历史引用问题。该问题不属于 M2.5 release boundary，本次不修复；如要处理，应另开兼容性小修复。

## M2.6 Trigger Description Eval Plan 输入基线

M2.6 应以当前 M2.5 seal 后的 8 个 builder skills 为输入，不应再混入结构性 hardening。

输入文件：

- `skills/builder-router/SKILL.md`
- `skills/builder-plan-goal/SKILL.md`
- `skills/builder-frame/SKILL.md`
- `skills/builder-spec/SKILL.md`
- `skills/builder-prototype/SKILL.md`
- `skills/builder-agent-task/SKILL.md`
- `skills/builder-review/SKILL.md`
- `skills/builder-decision/SKILL.md`
- `evals/trigger/builder-core.cases.json`
- `evals/routing/builder-routing.cases.json`
- `references/skill-design/skill-design-playbook.zh.md`

M2.6 不应直接改 description。它应先产出：

- 每个 builder skill 的 should-trigger cases。
- 每个 builder skill 的 should-not-trigger cases。
- 相邻 skill 竞争矩阵：
  - `builder-router` vs 具体 builder skill
  - `builder-plan-goal` vs `builder-agent-task`
  - `builder-frame` vs `builder-spec`
  - `builder-spec` vs `builder-prototype`
  - `builder-prototype` vs `builder-agent-task`
  - `builder-review` vs `builder-decision`
- 欠触发风险清单。
- 过触发风险清单。
- M2.7 description optimization 的安全编辑范围。

## 剩余风险

- 当前 worktree 仍是大批量未提交状态，review 时应按 commit split 审查，避免一次性接受所有变更。
- `validate:codex-install` 证明 Codex 用户级安装态可用，但它不是完整 npm release gate。
- 当前 deterministic validator 不能替代真实 runtime 的 skill selector 行为测试；M2.6 应补 trigger description eval plan。
- 尚未引入 machine-readable `skill-pack.json` 或 export/projection tooling；这是后续 release-contract 能力，不属于 M2.5。

## Release Boundary 判定

判定：`PASS_WITH_COMMIT_SPLIT`

当前状态适合进入人工 review 和分组提交准备；不建议在完成提交前继续优化 builder skill description。
