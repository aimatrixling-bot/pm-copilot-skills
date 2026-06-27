# AI Builder OS Source-of-Truth Map

本文件说明 AI Builder OS 中不同问题的唯一事实源，目标是减少 README、architecture、Delivery Kernel、skill、template、loop、schema、eval 和 release seal 之间的规则复制。

| Question / Concern | Source of Truth | Supporting Assets | Do Not Duplicate In | Notes |
| --- | --- | --- | --- | --- |
| AI Builder OS 是什么、如何安装、如何验证 | `README.md` | `skill-pack.json`、`package.json`、`docs/architecture.md` | skill、template、release seal | README 只放入口说明和命令，不承载细粒度运行协议。 |
| Claude Code source checkout 如何进入本仓库 | `AGENTS.md` | `CLAUDE.md`、`adapters/claude-code/`、`docs/architecture.md` | skill、release seal、Review Packet | `CLAUDE.md` 是 Claude Code 入口 shim，只指向事实源，不承载第二套长期规则。 |
| 系统分层、package surface、runtime adapter 边界 | `docs/architecture.md` | `skill-pack.json`、`agents/openai.yaml`、`adapters/` | README、release seal、skill | 架构文档说明结构，不写具体 skill 的长执行步骤。 |
| What are delivery modes? | `docs/delivery-kernel.md` | `skills/builder-router/SKILL.md`、`templates/module-execution-pack/template.md`、`templates/change-contract/template.md` | release seal、README、Branch State | delivery mode 的长期定义只在 Delivery Kernel 维护。 |
| How does routing work? | `skills/builder-router/SKILL.md` | `kernel/routing/`、`evals/routing/builder-routing.cases.json`、`evals/output-contract/builder-router.schema.json` | README、Delivery Kernel、review packet | Router skill 定义实时输出结构；eval/schema 只验证关键纪律。 |
| What is a Module Execution Pack? | `templates/module-execution-pack/template.md` | `docs/delivery-kernel.md`、`skills/builder-spec/SKILL.md` | README、release seal、Branch State | 模板是字段事实源；Delivery Kernel 只说明何时使用。 |
| What is a Change Contract? | `templates/change-contract/template.md` | `docs/delivery-kernel.md`、`skills/builder-spec/SKILL.md` | README、release seal、Branch State | 模板是迭代契约字段事实源。 |
| What is Branch State? | `templates/branch-state/template.md` | `skills/builder-agent-task/SKILL.md`、`skills/builder-review/SKILL.md`、`loops/recipes/definition-sync.loop.md` | release seal、README、长期 docs | Branch State 是分支运行状态缓存，不是长期 source of truth。 |
| How is definition drift handled? | `loops/recipes/definition-sync.loop.md` | `templates/definition-drift-check/template.md`、`skills/builder-review/SKILL.md` | README、release seal、Branch State | Loop 定义分类和流程；模板定义完成前检查格式。 |
| Where do Agent task rules live? | `skills/builder-agent-task/SKILL.md` | `templates/agent-task-packet/template.md`、`kernel/packets/agent-task-packet.schema.md`、runtime adapters | README、Delivery Kernel | runtime handoff、forbidden actions、verification、Branch State policy 在 agent-task skill 中维护。 |
| Where do review gates live? | `skills/builder-review/SKILL.md` | `kernel/gates/`、`templates/review-report/template.md`、`evals/output-contract/builder-review.schema.json` | README、release seal | review skill 负责检查证据、drift、branch state stale 和 mode switch。 |
| What does Release Seal prove? | `docs/release-seal-*.md` | git diff、命令输出、版本/tag/npm preflight 证据 | README、skills、templates、loops | Release Seal 只证明某次版本验证结果，不能新增长期规则。 |
| Where do PMS domain rules live? | PMS source repo / governance repo | AI Builder OS 里的 PMS eval fixtures 只做样例 | AI Builder OS docs、skills、templates、loops | 通用 Delivery Kernel 不能吸收 PMS 领域规则。 |
| Where do schema / eval expectations live? | `evals/output-contract/*.schema.json`、`evals/**/*.cases.json` | `scripts/validate-builder-os.js` | README、release seal、Branch State | schema/eval 只验证可机器检查的输出纪律，不替代模板正文。 |
| How is Direct / Guided / Governed output weight tested? | `evals/runtime/lite-runtime-conformance.cases.json` | `scripts/validate-builder-os.js`、`skills/builder-router/SKILL.md` | README、release seal、Branch State | 该 eval 只固定默认可见块、trace-only 字段和三档升级边界；实时判断仍由 Router skill 负责。 |
| How are templates added or changed? | 对应 `templates/*/template.md` | `docs/source-of-truth-map.md`、`scripts/validate-builder-os.js` | release seal、README | 优先修改既有模板；新增模板需要明确降低摩擦，且更新 validator。 |
| How are loops added or changed? | `loops/recipes/*.loop.md` | `loops/README.md`、相关 skill、eval | release seal、README | 新增 loop 是高摩擦动作，默认优先补强既有 loop。 |
| How are active core skills governed? | `skill-pack.json` | `bundles/core/manifest.json`、`README.md`、`scripts/validate-builder-os.js` | release seal、Review Packet | active builder core skills 必须保持 8 个，除非另有明确 milestone 决策。 |
| How are task complexity and response weight chosen? | `skills/builder-router/SKILL.md` | `kernel/routing/builder-router.zh.md`、`evals/output-contract/builder-router.schema.json`、`evals/routing/builder-routing.cases.json` | README、release seal、Branch State | Router 是复杂度、response profile、contract profile 和 context strategy 的实时输出事实源。 |
| Where do small-change scope boundary fields live? | `templates/change-contract/template.md` | `skills/builder-spec/SKILL.md`、`evals/output-contract/builder-spec.schema.json` | README、AGENTS.md、Branch State | `allowed_files_or_areas`、`max_expected_files_touched`、`requires_human_approval_if`、`reframe_risk` 是 Change Contract 字段，不应复制到全局规则。 |
| How is skill load policy represented? | `skill-pack.json` | `bundles/core/manifest.json`、`scripts/validate-builder-os.js` | runtime adapter docs、SKILL.md、release seal | `skill_load_policy` 是 runtime-neutral metadata，只约束 invocation/context-load 纪律，不写 runtime-specific 禁用模型调用语义。 |
| What is artifact lifecycle policy for handoff, Branch State and Decision Record? | `docs/delivery-kernel.md` | `templates/branch-state/template.md`、`templates/decision-record/template.md`、`loops/recipes/definition-sync.loop.md` | release seal、Review Packet、聊天记录 | handoff 是临时 pointer-only；Branch State 是分支运行缓存；Decision Record 只记录难逆、惊讶或真实取舍。 |
| How should builder skill quality be reviewed? | `references/skill-design/skill-design-playbook.zh.md` | `skills/builder-review/SKILL.md`、`evals/output-contract/builder-review.schema.json` | release seal、README | skill 设计哲学、no-op/sediment/sprawl/context load/progressive disclosure 检查集中在 playbook 和 review profile。 |

## Operating Notes

- 长期规则只写入对应 source of truth；其他文件只引用或给最小入口说明。
- Review Packet 是外部评审材料，不得回写成事实源。
- Handoff packet 只作为当前交接的 pointer-only 临时上下文，不得成为长期事实源。
- Branch State 可以记录临时判断和恢复上下文；合并前，长期有效决策必须迁移到正式 source of truth 或进入 open gap。
- Decision Record 只在 hard-to-reverse、surprising、real tradeoff 或人类明确要求保留决策时创建；普通小改和实现细节不创建。
