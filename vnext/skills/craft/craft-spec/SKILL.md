---
name: craft-spec
description: "Information Hierarchy 当需要 PRD、Mini Spec、Eng Request 或 Requirements 时触发，受众、验收标准或来源边界缺失时失败。"
disable-model-invocation: false
can-invoke: [discover-research, manage-file]
paths: ["30_Projects/**", "40_Content/**"]
status: draft
owner_agent: researcher
shared_with: [builder, reviewer]
scope: project
grade: P0
---

# craft-spec

<!-- P0 实现范围：见蓝图 §2.21 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Invocation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.0-craft-spec -->
- 当交付物（deliverable）必须成为 PRD、Mini Spec、Engineering Request 或 Requirements 文档时调用。
- 在已有足够意图可选择受众（audience）、配置档（profile）、范围（scope）和来源边界（source boundaries）后使用；如果关键证据缺失，在起草前调用 `discover-research`。
- 不要用于可运行原型、代码变更或评审发现（review findings）；这些应路由到 `craft-prototype`、`build-commit` 或 `review-doc`。
- Deletion Test：没有 `craft-spec` 时，PM 到 Builder/Reviewer 的移交（handoff）会失去稳定的 spec 形态和验收边界。

## Steps
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-craft-spec -->
1. 选择配置档和受众。Completion: profile（`lite`、`standard` 或 `ultra`）和 audience（`human`、`agent` 或 `dual`）已在内容起草前写明。
2. 建立来源边界。Completion: 事实源文件（source-of-truth files）、引用（citations）、假设（assumptions）和阻塞未知项（blocked unknowns）已列出；无支持的 claims 已标记为 assumptions 或路由到 `discover-research`。
3. 填充必需 spec 槽位。Completion: goal、user/context、scope、non-goals、requirements、constraints、acceptance criteria、risks 和 open questions 均有内容或显式 `N/A`。
4. 塑造信息层级（Information Hierarchy）。Completion: 面向人的理由（rationale）、Agent 可读指令（instructions）、evidence/citation blocks 已分离，使 Builder 和 Reviewer 可扫描且无需重新解释。
5. 附加 handoff notes 和文件放置。Completion: 已识别目标路径或文档，已命名下一个 Agent，剩余风险（residual risks）明确，并在需要创建、移动或版本管理时使用 `manage-file`。

## Reference
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- `docs/vnext-blueprint.md §2.21` 将 `craft-spec` 定义为 P0 spec-writing Skill，并将 `discover-research` 和 `manage-file` 作为允许调用项。
- `docs/vnext-blueprint.md §2.20` 将 spec 和 research 工作分配给 Researcher，并将下游移交分配给 Builder/Reviewer。
- `docs/vnext-blueprint.md §2.24.2` 定义 Information Hierarchy、Steps、Completion Criterion、渐进披露（Progressive Disclosure）和 Leading Word。
- `vnext/references/skill-authoring.md §3` 是 frontmatter source of truth；§4.1 定义 step completion criteria；§8 列出 failure modes；§9 是 pre-submit checklist。
- 相关 P0 资产（assets）：`discover-research` 提供 evidence，`manage-file` 处理 placement/versioning，`review-doc` 检查完成的文档。

## Completion Criteria
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-craft-spec -->
- Frontmatter 保持 9 个必填 Skill 字段加 `grade`，并保持 `status: draft`、`grade: P0`、`owner_agent: researcher` 和 `scope: project`。
- `description` 以列出的 leading word `Information Hierarchy` 开头，遵循 `X when Y, fails when Z`，并保持一句话且少于 200 字符。
- 五个 SECTION heading 全部按顺序保留，并保留指向现有 Blueprint sections 的 `SECTION_REF` 锚点。
- 每个 step 都有 `Completion:` criterion，产出的 spec 包含 profile、audience、source boundaries、required slots、citations 和 handoff notes。
- Deletion Test 保持 Lose：没有其他 P0 Skill 负责把 intent/evidence 转换为 acceptance-ready handoff 的 spec 创建。

## Failure Modes
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- Signal: Premature Completion - 在 acceptance criteria、source boundaries 或 blocking questions 仍缺失时，spec 被标记为 ready。
- Signal: Variance - 未先选择 profile 或 audience，导致重复运行产生不同 spec 形态。
- Signal: Context Pointer Miss - citations 或 source-of-truth files 命名含糊、缺失，或下一个 Agent 无法加载。
- Signal: Bloat - branch-specific business rules 被复制进此 Skill，而不是留在项目 specs、ADRs 或 references 中。
- Signal: Handoff Drift - Builder 或 Reviewer 无法从 spec 中识别 next action、target file、residual risk 或 pass/fail criteria。
