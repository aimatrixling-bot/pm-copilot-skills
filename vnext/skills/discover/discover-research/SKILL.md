---
name: discover-research
description: "Information Hierarchy 当某主题需要为 spec 或决策提供证据时触发，claims 缺少来源、置信度、时效性或移交边界时失败。"
disable-model-invocation: false
can-invoke: [manage-file, evolve-memory]
paths: []
status: draft
owner_agent: researcher
shared_with: [craft-spec, review-doc]
scope: project
grade: P0
---

# discover-research

<!-- P0 实现范围：见蓝图 §2.21 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Invocation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.0-discover-research -->
- 当 `craft-spec`、Reviewer、Supervisor 或用户在撰写或接受文档前需要证据（evidence）时调用。
- 用于当前事实、技术参考、repo 证据、市场/用户上下文，以及有来源支持的比较。
- 在摘要之前，优先使用官方文档、第一手来源、本地事实源（source-of-truth）文件、代码、数据集和 durable repo artifacts。
- 不要撰写 spec、做最终产品判断，或隐藏无支持的假设（assumption）；只有在置信度和范围明确后，才将 durable reference memory 路由到 `evolve-memory`。

## Steps
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-discover-research -->
1. 定义研究目标和下游接口。Completion: 问题、请求方、decision/spec slot、所需时效性和移交目标都已明确。
2. 按优先级搜索多个来源类别。Completion: local SoT/code、官方或第一手来源、二手摘要均已检查或显式排除。
3. 将发现规范化为证据行。Completion: 每一行都有 claim、source path 或 URL、可用时的 date 或 revision、source type、confidence 和 limitation。
4. 分离事实、推断、假设和未知项。Completion: 高置信度 claims 不与 guesses 混合，并且每个假设都标注为何仍未验证。
5. 为 `craft-spec` 或 review 打包移交材料。Completion: evidence_table、recommended citations、unresolved questions，以及 use/do-not-use guidance 已准备好交给下一个 Skill。
6. 仅在需要时持久化 durable outputs。Completion: 只有当 evidence artifact 或 reference memory 具备稳定复用价值时，才调用 `manage-file` 或 `evolve-memory`。

## Reference
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- `docs/vnext-blueprint.md §2.20` 将 research、PRD/spec delivery 和需要 citations 的 markdown output 分配给 Researcher。
- `docs/vnext-blueprint.md §2.21` 将 `discover-research` 定义为 P0 证据供应 Skill，并允许 `manage-file` 用于 durable artifacts。
- `docs/vnext-blueprint.md §2.22` 定义当 research evidence 应持久化到任务之外时使用的 reference memory fields。
- `docs/vnext-blueprint.md §2.24.2` 定义信息层级（Information Hierarchy）和上下文指针（Context Pointer），二者都是可重新加载证据所需。
- `vnext/references/skill-authoring.md §4.1` 要求尖锐的完成标准（Completion Criterion）；§8 将 Context Pointer Miss 和 Bloat 命名为 failure modes。

## Completion Criteria
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-discover-research -->
- 研究目标、下游 Skill、证据阈值和 recency requirement 都已明确。
- 每个 key claim 都映射到可重新加载的 citation data 和 confidence level。
- 事实、推断、假设、unknowns 和 limitations 已在 handoff 前分离。
- 证据表可被 `craft-spec` 使用，且不需要重新研究同一问题。
- 持久化 files 或 memories 仅限 durable artifacts；transient research 保留在 task output 中。

## Failure Modes
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- Signal: Untraceable Source - claim 没有下一个 Agent 可重新加载的 path、URL、revision 或 source type。
- Signal: Confidence Collapse - 高置信度证据、inference、假设和 open question 混在同一段中。
- Signal: Context Pointer Miss - citation text 含糊、仅为摘要、已陈旧，或缺少足以再次找到来源的细节。
- Signal: Recency Drift - time-sensitive claims 缺少 retrieval date、source date 或显式 stale-risk note。
- Signal: Handoff Gap - `craft-spec` 收到 findings 时缺少 evidence_table、limitations 或 unresolved questions。
