---
name: evolve-memory
description: "Information Hierarchy 当偏好、反馈、项目或参考信号出现时触发，重复、未验证或未限定范围的 memory 被写入时失败。"
disable-model-invocation: false
can-invoke: []
paths: ["**/memory/**", "**/MEMORY.md"]
status: draft
owner_agent: evolver
shared_with: [supervisor, researcher, builder, reviewer]
scope: project
grade: P0
---

# evolve-memory

<!-- P0 实现范围：见蓝图 §2.21 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Invocation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.0-evolve-memory -->
- 当可长期保留的用户偏好、反馈修正、项目状态、决策或已验证 reference signal 应持久化到当前 turn 之外时调用。
- 仅在 source 已引用且 target schema 已知后使用：`user`、`feedback`、`project` 或 `reference`。
- 不要为猜测、临时任务进度、推断出的情绪、unverified claims，或应属于 spec、ADR 或 review packet 的内容写入 memory。
- 保持 `evolve-memory` 作为 leaf Skill：它分类、验证、写入、追加、取代、拒绝并报告 memory 结果，不调用下游 Skills。

## Steps
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-evolve-memory -->
1. 检测 memory signal 并按 schema 分类。Completion: signal 已根据 `vnext/memory/*.schema.md` 分类为 `user`、`feedback`、`project` 或 `reference`；模糊 signals 被标记，而不是强行归类。
2. 根据 source 验证 signal。Completion: originating artifact 已被引用，例如 chat line、file path、review output、decision log entry 或 research citation；未验证 signals 不会被写入。
3. 决定 write mode。Completion: 先搜索 existing memory；匹配 signals 会追加 observations 或 supersede entry，而不是创建 duplicates。
4. 界定 memory entry 的 scope。Completion: entry 遵循匹配 schema，并包含 required fields、stable id、status、source、confidence、last_verified、detail_ref、content、explicit scope，且 stale fields 被标记而不是静默覆盖。
5. 原子化 write back。Completion: write target 位于 `**/memory/**` 或 `MEMORY.md` 内，新 topic file 创建时已索引，并且 change 已为 Output Packet 汇总。
6. 向 calling Agent 回报。Completion: caller 收到一行说明写入、追加、取代或拒绝了什么，并包含 reason 和 target pointer。

## Reference
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- `docs/vnext-blueprint.md §2.20` 定义 Evolver ownership，以及 Supervisor、Researcher、Builder 和 Reviewer 的 shared use。
- `docs/vnext-blueprint.md §2.21` 将 `evolve-memory` 定义为 P0 Memory 4-class writeback Skill。
- `docs/vnext-blueprint.md §2.22` 定义 common Memory schema fields，以及 `user`、`feedback`、`project` 和 `reference` memory types。
- `docs/vnext-blueprint.md §2.23` 定义用于报告 writeback outcomes 的 Output Packet 证据（evidence）和 next-action fields。
- `docs/vnext-blueprint.md §2.24` 定义信息层级（Information Hierarchy）、渐进披露（Progressive Disclosure）、完成标准（Completion Criterion）和 failure-mode diagnostics。
- `docs/vnext-blueprint.md §2.25.1` 固定 P0 vNext directory 和 Skill authoring discipline。
- `docs/vnext-blueprint.md §2.26` 覆盖 GT-06 和 GT-08，其中 `evolve-memory` 写入 feedback 和 project memory。
- `vnext/memory/user.schema.md`、`vnext/memory/feedback.schema.md`、`vnext/memory/project.schema.md` 和 `vnext/memory/reference.schema.md` 是 schema references；不要创建新的 schema files。
- `vnext/references/skill-authoring.md §4.1` 定义 completion criteria discipline；§8 定义 premature completion diagnostics。

## Completion Criteria
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-evolve-memory -->
- Frontmatter 保持 9 个必填 Skill 字段加 `grade`，并保持 `owner_agent: evolver`、`can-invoke: []`、`scope: project`，且 `shared_with` 排除 owner 同时包含 Researcher。
- Description 以 `Information Hierarchy` 开头，遵循 `X when Y, fails when Z`，并保持一句话且少于 200 字符。
- 五个 SECTION headings 全部按顺序保留，并保留指向现有 blueprint sections 的 `SECTION_REF` 锚点。
- 每个 step 都有 `Completion:` criterion，且 writeback path 证明 schema classification、source verification、duplicate check、explicit scope、atomic write、indexing 和 caller report。
- Deletion Test 保持 Lose：没有其他 P0 Skill 负责 user、feedback、project 和 reference memory signals 的 durable writeback。

## Failure Modes
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- Signal: Duplicate Write - 为已有 memory record 的 signal 写入新 entry。
- Signal: Unverified Source - 在未引用 originating artifact 的情况下，从 inference 或假设（assumption）写入 memory。
- Signal: Narrative Content - 写入散文式文本、观点或 chat log，而不是匹配 schema 的 structured observations。
- Signal: Stale Verification - 用更新但未验证的 content 覆盖 previously verified entry。
- Signal: Scope Drift - entry 为 project-specific signal 声称 global scope，或为 stable cross-project user preference 声称 project scope。
- Signal: Orphan Detail - 写入 topic file 却未在 `MEMORY.md` 中索引，导致未来加载时被隐藏。
