---
name: manage-prompt
description: "Context Pointer 当用户输入模糊、过载或路由错位时触发，目标、范围或 Agent 边界仍隐式时失败。"
disable-model-invocation: false
can-invoke: [manage-grill]
paths: []
status: draft
owner_agent: supervisor
shared_with: [researcher, builder, reviewer, evolver]
scope: project
grade: P0
---

# manage-prompt

<!-- P0 实现范围：见蓝图 §2.21 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Invocation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.0-manage-prompt -->
- 当原始用户输入模糊、过载、规格不足，或很可能被路由到错误 Agent 时调用。
- 在 Supervisor 分派前使用，适用于措辞需要持久上下文指针（Context Pointer）而不是立即执行的情况。
- 不要编造缺失事实、直接解决任务或掩盖歧义；未解决的阻塞性歧义路由到 `manage-grill`。
- 输出紧凑的上下文指针，保留原始措辞，重述目标，限定范围，并命名接收方 Agent 或阻塞点。

## Steps
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-manage-prompt -->
1. 在改写前逐字捕获原始用户输入。Completion: 原始措辞、已声明目标、已命名的范围线索和 Agent 路由信号已记录。
2. 用一句话重述目标，并明确执行者和结果。Completion: 重述使用用户词汇，命名单一执行者，并暴露单一结果；多目标输入已拆分或标记。
3. 解析范围边界。Completion: 范围内事项、明确非目标（non-goals）和歧义边缘已列出；无法通过重述解决的歧义触发 `manage-grill`。
4. 分类路由信号。Completion: 已命名目标 Agent（`supervisor`、`researcher`、`builder`、`reviewer` 或 `evolver`）并给出一句理由，或已路由回用户进行消歧。
5. 产出 Context Pointer。Completion: 重述目标、范围摘要、路由决策和原始逐字锚点已打包给接收方 Skill 或 Agent。
6. 当 Step 3 调用 `manage-grill` 时移交追问结果。Completion: 追问答案已合并进 Context Pointer，并更新原重述而非重复生成。

## Reference
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- `docs/vnext-blueprint.md §2.20` 定义 Supervisor 对意图识别、prompt 优化和路由的职责。
- `docs/vnext-blueprint.md §2.21` 将 `manage-prompt` 定义为 P0 输入质量 Skill。
- `docs/vnext-blueprint.md §2.23` 定义用于路由、证据和 next actions 的 Intent Packet 与 Output Packet 字段。
- `docs/vnext-blueprint.md §2.24` 定义 leading words、Context Pointer、渐进披露（Progressive Disclosure）和 failure-mode 诊断。
- `docs/vnext-blueprint.md §2.25.1` 固定 P0 vNext 目录和 Skill 写作纪律。
- `docs/vnext-blueprint.md §2.26` 覆盖 GT-01，其中 `manage-prompt` 位于 `manage-grill` 和 `craft-agent-task` 之前。
- `vnext/references/skill-authoring.md §4.1` 定义 completion criteria 纪律；§8 定义 premature completion 诊断。

## Completion Criteria
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-manage-prompt -->
- Frontmatter 保持 9 个必填 Skill 字段加 `grade`，并保持 `owner_agent: supervisor`、`scope: project`、`can-invoke: [manage-grill]`，且 `shared_with` 不包含 owner。
- `description` 以 `Context Pointer` 开头，遵循 `X when Y, fails when Z`，保持一句话且少于 200 字符，并保留路由失败模式。
- 五个 SECTION heading 全部按顺序保留，并保留指向现有 blueprint section 的 `SECTION_REF` 锚点。
- 每个 step 都有 `Completion:` criterion，输出保留原始输入、单执行者重述、范围边界、路由信号和歧义移交。
- 删除测试（Deletion Test）保持 Lose：没有其他 P0 Skill 负责把原始用户措辞转换为可路由的 Context Pointer。

## Failure Modes
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- Signal: Hidden Assumption - 重述静默填补用户从未声明的缺口，且未标记该假设。
- Signal: Constraint Erasure - 用户已声明的时间、技术栈、范围、角色或来源边界等约束从 Context Pointer 中消失。
- Signal: Premature Routing - 在重述范围或目标之前就路由到 Agent，把歧义推给下游。
- Signal: Polish Without Structure - 只润色语气或措辞，却没有结构化目标、范围、路由和原始锚点。
