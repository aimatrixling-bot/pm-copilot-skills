---
name: craft-agent-task
description: "Information Hierarchy 当 Supervisor 拆解或移交工作时触发，完成标准（done criteria）、owner 或 stop conditions 缺失时失败。"
disable-model-invocation: false
can-invoke: [manage-file]
paths: []
status: draft
owner_agent: supervisor
shared_with: [researcher, builder, reviewer, evolver]
scope: project
grade: P0
---

# craft-agent-task

<!-- P0 实现范围：见蓝图 §2.21 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Invocation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.0-craft-agent-task -->
- 当 Supervisor 必须拆解工作，或把有边界的任务移交给 Researcher、Builder、Reviewer 或 Evolver 时调用。
- 在路由和澄清已产生足够上下文、能够命名一个 owner、一个结果、完成标准（done criteria）和停止条件（stop conditions）后使用。
- 不要用于面向人类的 PRD 文案、开放式头脑风暴或多 owner 项目；这些应先路由到 `craft-spec`、`manage-grill` 或显式规划。
- 输出 Agent 可读的任务包（task pack），且该任务包可在没有隐藏聊天依赖的情况下重放。

## Steps
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-craft-agent-task -->
1. 将源意图解析为一页任务包。Completion: 已命名源 spec、路由或决策，已声明单一任务结果，并且 owner Agent 已被无歧义识别。
2. 定义可通过一次观察测试的完成标准。Completion: 每条完成标准都是二元判断，绑定到用户可见行为或制品（artifact），且不含 "mostly" 或 "approximately" 表述。
3. 定义 stop conditions 和升级路径。Completion: 已列出 escalate、abort 或 hand-back 的显式条件，并且每条都命名触发条件和接收方。
4. 校验任务包 schema。Completion: 必填字段（`id`、`title`、`owner`、`done-criteria`、`stop-conditions`、`source-ref`、`context-pointer`）齐全，owner 匹配 `owner_agent`，且任何聊天上下文指针都是持久的。
5. 通过 Output Packet 移交任务包。Completion: 任务包已写入接收方 Agent 可读取的位置，已调用 `manage-file` 处理放置决策，并命名下一个 Skill 或 Agent。

## Reference
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- `docs/vnext-blueprint.md §2.20` 定义 Agent 契约、handoff 边界和 forbidden actions。
- `docs/vnext-blueprint.md §2.21` 将 `craft-agent-task` 定义为 P0 Supervisor 任务分派 Skill。
- `docs/vnext-blueprint.md §2.23` 定义 Output Packet 字段，例如 `content`、`metadata`、`next_actions` 和路由证据。
- `docs/vnext-blueprint.md §2.24` 定义信息层级（Information Hierarchy）、Completion Criterion、Context Pointer 和 failure-mode 诊断。
- `docs/vnext-blueprint.md §2.25.1` 固定 P0 vNext 目录和 Skill 写作纪律。
- `docs/vnext-blueprint.md §2.26` 覆盖 GT-01 以及 v1-to-vNext 映射，其中 `builder-agent-task` 变为 `craft-agent-task`。
- `vnext/references/skill-authoring.md §4.1` 定义 completion criteria 纪律；§8 定义 premature completion 诊断。

## Completion Criteria
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-craft-agent-task -->
- Frontmatter 保持 9 个必填 Skill 字段加 `grade`，并保持 `owner_agent: supervisor`、`can-invoke: [manage-file]`、`scope: project`，且 `shared_with` 不包含 owner。
- `description` 以 `Information Hierarchy` 开头，遵循 `X when Y, fails when Z`，并保持一句话且少于 200 字符。
- 五个 SECTION heading 全部按顺序保留，并保留指向现有 blueprint section 的 `SECTION_REF` 锚点。
- 每个 step 都有 `Completion:` criterion，任务包包含一个 owner、二元完成标准、stop conditions、持久 source/context pointers、放置决策和 Output Packet handoff。
- 删除测试（Deletion Test）保持 Lose：没有其他 P0 Skill 负责把已路由意图转换为 Agent 可读的执行任务包。

## Failure Modes
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- Signal: Multi-Owner Pack - 任务包命名两个 owner 或遗漏 owner，导致责任漂移。
- Signal: Implicit Done - 完成标准含糊，例如 "works"、"complete" 或 "ready"，或不可观察。
- Signal: No Stop Condition - 任务包没有 escalate、abort 或 hand-back 路径，迫使接收方 Agent 猜测。
- Signal: Hidden Chat Dependency - 任务包引用 "the conversation above" 而不是持久指针，破坏可重放性。
- Signal: Vague Goal - 任务标题重述 "build the feature" 这类类别，而不是单一结果。
