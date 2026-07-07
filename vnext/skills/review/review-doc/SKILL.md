---
name: review-doc
description: "Information Hierarchy 当文档交付物需要 review 时触发，结构、引用、验收标准或移交反馈不清晰时失败。"
disable-model-invocation: false
can-invoke: [evolve-memory]
paths: []
status: draft
owner_agent: reviewer
shared_with: [researcher, builder]
scope: project
grade: P0
---

# review-doc

<!-- P0 实现范围：见蓝图 §2.21 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Invocation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.0-review-doc -->
- 当 PRD、Mini Spec、Engineering Request、task pack、decision record、reference note 或 review packet 已准备好进行 acceptance 或 handoff review 时调用。
- 在作者已产出带有明确目标、受众、来源边界和验收标准（acceptance criteria）的有界文档后使用。
- 根据事实源（source-of-truth）、引用、结构、验收标准和 handoff completeness 进行 review；不要原地重写文档。
- 仅当 issue 在当前文档之外仍具 durable 性时，才通过 `evolve-memory` 持久化 reusable feedback。

## Steps
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-review-doc -->
1. 界定 review target。Completion: document path 或 artifact id、authoring Skill、audience、intended handoff 和事实源文件已在 findings 前列出。
2. 检查文档结构和信息层级（Information Hierarchy）。Completion: goal、scope、non-goals、requirements、验收标准、证据（evidence）/citations、risks 和 next actions 均存在或被显式标记为 missing。
3. 验证 citations 和 source alignment。Completion: 每个 non-obvious claim 都有可重新加载的 source，并且每个 cited source 都支持所提出的 claim。
4. 按 impact 分类 issues。Completion: 每个 finding 都有 category、适用时的 HALO type、severity（`blocker`、`major`、`minor`、`nit`）、证据指针和 fix path。
5. 分离 blocker 与 nit。Completion: acceptance decision 仅基于 blocker/major 证据，而 nits 单独分组且不能单独阻塞。
6. 为下游 owner 产出 executable feedback。Completion: result 为 PASS、PASS_WITH_CAVEAT 或 BLOCKED，并包含有序 fix list、owner、residual risk 和 handoff target。

## Reference
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- `docs/vnext-blueprint.md §2.20` 定义 Reviewer responsibilities、Evidence Packet output 和 forbidden actions。
- `docs/vnext-blueprint.md §2.21` 将 `review-doc` 定义为 P0 文档 review Skill，并允许 feedback memory writeback。
- `docs/vnext-blueprint.md §2.23` 定义 Reviewer outputs 使用的 Evidence Packet concepts。
- `docs/vnext-blueprint.md §2.24.2` 定义信息层级、完成标准（Completion Criterion）、上下文指针（Context Pointer）和渐进披露（Progressive Disclosure）。
- `vnext/references/skill-authoring.md §8` 定义 Premature Completion、Variance、Context Pointer Miss 和 Bloat diagnostics。

## Completion Criteria
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-review-doc -->
- Review target、事实源文件、audience 和验收标准都已明确。
- 每个 finding 都包含 category、适用时的 HALO type、severity、证据指针和 fix path。
- Blockers 和 nits 已分离，并且 final decision 来自 severity 和证据。
- Feedback 可由 Researcher 或 Builder 执行，而无需 Reviewer 重写文档。
- 仅当 scope 和证据证明持久化合理时，reusable feedback 才路由到 `evolve-memory`。

## Failure Modes
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- Signal: Premature Completion - 在 source truth、acceptance criteria、citations 和 residual risk 被检查前，review 就说 PASS。
- Signal: Variance - 因为 target、audience、source boundary 或 severity scale 未先固定，review shape 发生变化。
- Signal: Context Pointer Miss - finding 引用了含糊 claim、缺失 source 或不可重新加载的 reference。
- Signal: Nit Blocking - preference、wording 或 style comments 在没有 product 或 delivery risk 证据时阻塞 acceptance。
- Signal: Role Drift - Reviewer 重写文档或调用 authoring work，而不是返回 executable feedback。
