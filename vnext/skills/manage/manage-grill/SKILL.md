---
name: manage-grill
description: "User-Invokable 当用户调用 /manage-grill、或要求对方案/决策进行苏格拉底式挑战时触发；问题预设目标、或超出 5 类问题维度时失败。"
disable-model-invocation: false
can-invoke: []
paths: []
status: draft
owner_agent: supervisor
shared_with: [researcher, builder, reviewer, evolver]
scope: project
grade: P0
---

# manage-grill

<!-- P0 实现范围：见蓝图 §2.21 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Invocation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.0-manage-grill -->
- 当某个具体歧义阻塞路由、定界、验收、owner 选择或安全执行时调用。
- 在 `manage-prompt` 或 Supervisor 识别出阻塞性决策后使用；不要仅因为输入不完美就进行追问。
- 只提出生成可路由上下文指针（Context Pointer）或显式阻塞点所需的问题。
- 不要解决任务、替用户选择目标，或在已经可以路由后继续循环追问。

## Steps
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-manage-grill -->
1. 识别阻塞路由或范围的具体歧义。Completion: 已命名阻塞性决策（`goal`、`scope`、`agent`、`constraint` 或 `context`）；没有阻塞性决策的模糊不会触发追问。
2. 起草每次只探测一个假设的问题。Completion: 每个问题都指向一个已声明假设，可用一个短语回答，且没有捆绑两个问题。
3. 按用户实际可回答的批次提问。Completion: 问题按阻塞优先级排序，批次大小适合用户当前回合，并且收敛信号在发送前已定义。
4. 收敛或升级。Completion: 用户答案要么移除阻塞性歧义并产出重述目标，要么该歧义被报告回 `manage-prompt`，标记为没有用户指示就无法解决。
5. 只有出现新的阻塞性歧义时才重新分批。Completion: 只有当新歧义仍阻塞路由时才追加一批问题；否则带限制说明路由。

## Reference
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- `docs/vnext-blueprint.md §2.20` 定义 Supervisor 对 ask/grill、歧义处理和路由的职责。
- `docs/vnext-blueprint.md §2.21` 将 `manage-grill` 定义为 P0 澄清 Skill。
- `docs/vnext-blueprint.md §2.23` 定义 Intent Packet 字段，例如 `probe_depth`、routing 和 Output Packet next actions。
- `docs/vnext-blueprint.md §2.24` 定义渐进披露（Progressive Disclosure）、Context Pointer、Completion Criterion 和 failure-mode 诊断。本 skill 在 §2.21 的 trigger pattern 为 User-Invokable；Progressive Disclosure 是 §2.24 通用机制。
- `docs/vnext-blueprint.md §2.25.1` 固定 P0 vNext 目录和 Skill 写作纪律。
- `docs/vnext-blueprint.md §2.26` 覆盖 GT-01，其中 `manage-grill` 在 `craft-agent-task` 之前解决歧义。
- `vnext/references/skill-authoring.md §4.1` 定义 completion criteria 纪律；§8 定义 premature completion 诊断。

## Completion Criteria
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-manage-grill -->
- Frontmatter 保持 9 个必填 Skill 字段加 `grade`，并保持 `owner_agent: supervisor`、`can-invoke: []`、`scope: project`，且 `shared_with` 不包含 owner。
- `description` 以 `User-Invokable` 开头，遵循 `X when Y, fails when Z`，并保持一句话且少于 200 字符。
- 五个 SECTION heading 全部按顺序保留，并保留指向现有 blueprint section 的 `SECTION_REF` 锚点。
- 每个 step 都有 `Completion:` criterion，追问序列识别阻塞点、提出单假设问题、定义收敛，并在路由或升级后停止。
- 删除测试（Deletion Test）保持 Lose：没有其他 P0 Skill 负责把阻塞性歧义转换为用户提供的路由证据。

## Failure Modes
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- Signal: Endless Probe - 在已经可以做出路由决策或已有显式阻塞点后仍继续提问。
- Signal: Leading Question - 问题措辞预设答案，或不公平地缩窄用户选项。
- Signal: Premature Routing - 在阻塞性歧义被解决或显式升级前就放弃追问。
- Signal: Solve-While-Grilling - 替用户回答问题，或把解决方案塞进澄清提示中。
