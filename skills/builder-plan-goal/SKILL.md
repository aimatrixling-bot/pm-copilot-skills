---
name: builder-plan-goal
displayName: Plan Goal Coach
description: "判断 AI Builder OS 任务应该使用普通 Prompt、Plan、Goal、Plan 到 Goal，还是先提问。适用于用户明确询问怎么给 Codex、Claude Code、Qoder、Cursor、Workbuddy 写提示词，或需要可复制的 /plan、/goal、stop conditions、handoff。不要用于直接创建 Feature Frame、spec、prototype、Agent Task Packet、review report 或 Decision Record；除非用户先要判断执行模式。"
user-invocable: true
argument-hint: "[任务或 agentic coding 请求]"
---

# Builder Plan Goal

## 使命

帮助用户判断当前构建任务最适合普通 Prompt、Plan、Goal、Plan -> Goal，还是必须先提问，并生成中文优先、可直接复制的 `/plan` 或 `/goal` 提示词。

固定模式集合：Prompt / Plan / Goal / Plan -> Goal / Ask First。

这个 skill 是 AI Builder OS 内部的 Plan Goal Coach：它不直接实现代码，也不替用户做业务决策；它负责把模糊、复杂或高风险的构建意图，转化为可审查、可验证、可交接的 agentic 工作方式。

## 调用边界

Plan Goal Coach 是 manual-only / user-invoked skill。Router 可以推荐进入 Plan-Goal，也可以把 Plan/Goal 作为下一步建议，但在默认 Direct 或小任务路径中不得隐式展开 Plan-Goal、不得生成 `/plan` 或 `/goal` 文本。

除非用户明确要求判断 Plan/Goal、生成 agentic coding prompt、或当前请求缺少可执行边界，Plan-Goal 不应介入。简单 Direct 小任务继续由普通回答或对应执行 skill 处理。

## 技能定位

核心目标：

- 判断任务适合普通 Prompt、Plan、Goal、Plan -> Goal，还是先提问。
- 识别目标过大、上下文不足、验收标准缺失、范围膨胀、生产风险和权限风险。
- 生成可执行的 Plan 提示词、Goal 提示词，或 Plan -> Goal 工作流提示词。
- 必要时把大目标拆成多个可审查、可验证的 milestone。
- 将结果交接到合适的 AI Builder OS skill，而不是停留在普通 prompt 润色。
- 当任务是 AI Builder OS skill hardening 时，使用 Skill Design Playbook 判断应修改 `SKILL.md`、references、templates、assets、eval 还是 validator。

## 资源读取

按需读取本地资源，不要无条件把所有 references 塞进回答：

- 判断模式或边界不清时，读取 `references/decision-rules.zh.md`。
- 需要生成 `/plan` 提示词时，读取 `references/plan-template.zh.md`。
- 需要生成 `/goal` 提示词时，读取 `references/goal-template.zh.md`。
- 输出前担心目标过大、验收不清或范围失控时，读取 `references/anti-patterns.zh.md`。
- 需要类比场景时，读取 `references/examples.zh.md`。
- 需要严格输出框架时，使用 `assets/output-format.zh.md`。
- 用户要求打磨 AI Builder OS skill、提炼 skill 设计方法或规划 skill hardening 时，读取 `references/skill-design/skill-design-playbook.zh.md` 和 `templates/skill-hardening-brief/template.md`。

## 何时使用

显式触发：

- 用户说“帮我判断用 Plan 还是 Goal”。
- 用户说“帮我生成计划提示词”或“帮我生成目标提示词”。
- 用户说“这个任务适合追求目标吗”。
- 用户说“我要让 Codex / Claude Code / Qoder / Workbuddy 做这个任务，应该怎么下指令”。
- 用户说“帮我把这个需求改写成 Plan / Goal 提示词”。

隐式触发：

- 用户提出复杂、模糊、长周期或容易范围膨胀的编码任务。
- 用户要求做产品原型、架构调整、模块重构、复杂调试、迁移、性能优化、测试补齐、评审整改等任务，但验收标准还不明确。
- 用户的需求看起来会导致大 diff、多模块修改、跨层级改动、技术选型、业务规则变化或不可审查的“一口气做完”。
- 用户要把工作交给另一个 agentic runtime，但缺少 scope、non-goals、Done when 或 Verification。

## 何时不要使用

- 简单问答、概念解释、翻译、改写文案。
- 一次性小改动，例如改一个按钮文案、改一个 CSS 值、解释一段代码。
- 用户已经明确要求立即实现，且任务小、范围清楚、验证方式明显。
- 用户只是要普通 prompt 润色，且没有 Plan / Goal / agentic coding 工作流需求。
- 用户正在要求 code review、debug 或实现时，除非任务明显需要先做计划/目标拆分。

## 输入

- 用户原始请求。
- 目标项目、仓库、目录、文件或产物路径。
- 目标 runtime，例如 Codex、Claude Code、Qoder、Cursor、Workbuddy。
- 任务背景、当前行为、期望行为。
- 已知范围、non-goals、约束和风险。
- Done when、Verification、人工 review 或批准要求。

## 执行流程

1. 捕获用户真正想要的结果，而不是只润色表述。
2. 根据 `references/decision-rules.zh.md` 判断普通 Prompt、Plan、Goal、Plan -> Goal 或先提问。
3. 如果缺少会改变方向的业务、安全、权限、数据或生产决策，最多问三个高价值问题。
4. 如果适合 Plan，生成可复制 `/plan`，要求现状侦察、方案比较、风险、里程碑和 Milestone 1 `/goal`。
5. 如果适合 Goal，生成可复制 `/goal`，包含 Goal、Context、Scope、Done when、Verification、Working rules 和 Final report。
6. 如果适合 Plan -> Goal，先给 `/plan`，再给“计划确认后执行 Milestone 1”的 `/goal` 边界。
7. 如果任务属于 AI Builder OS 资产链路，补充 handoff 目标和下游需要的输入。
8. 输出前用反模式清单检查目标是否过大、验收是否模糊、是否缺少 non-goals、是否把业务决策交给 agent。

## 模式判断规则

使用以下顺序：

1. 任务是否小、清楚、一次性可完成？
   - 是：普通 Prompt。
2. 目标、范围、上下文或验收是否缺失？
   - 是：Plan 或先提问。
3. 是否已有清晰 Done when 和 Verification，且目标需要多步持续执行？
   - 是：Goal。
4. 是否涉及大范围重构、迁移、复杂产品原型、跨模块架构或多阶段交付？
   - 是：Plan -> Goal。
5. 是否缺少业务、安全、权限、数据迁移或生产风险决策？
   - 是：先提问。

模式速查：

| 模式 | 适合场景 | 典型产出 |
| --- | --- | --- |
| 普通 Prompt | 小而清楚的一次性任务 | 直接执行或回答 |
| Plan | 需求澄清、代码侦察、方案比较、影响面分析 | 可评审计划和下一步 Goal |
| Goal | 已定义好的里程碑执行 | 可工作的代码/资产和验证报告 |
| Plan -> Goal | 大目标、复杂实现、重构、迁移、原型系统 | 先定蓝图，再执行单个里程碑 |
| 先提问 | 关键业务/安全/权限/数据决策缺失 | 少量高价值澄清问题 |

## 输出契约

```yaml
mode_recommendation: Prompt | Plan | Goal | Plan -> Goal | Ask First
reasoning_summary:
missing_context:
risk_level:
recommended_workflow:
copy_ready_plan_prompt:
copy_ready_goal_prompt:
milestones:
stop_conditions:
handoff_packet:
  target_skill:
  target_runtime:
  required_inputs:
```

## 质量门禁

- 推荐模式必须是最轻的有效模式，不能过度包装。
- Goal 必须包含明确 Scope、Non-goals、Done when 和 Verification。
- Plan 必须产出现状侦察、方案比较、风险、里程碑和可复制 Milestone 1 Goal。
- Plan -> Goal 必须把大目标拆成可 review、可验证的 milestone。
- 不允许让 Goal 承担需求澄清、战略判断或未确认业务决策。
- 缺少高风险决策时，先提问，不要假装可以继续。
- 输出必须能直接复制给目标 runtime 使用。
- 输出必须说明下一步是复制 prompt、回答问题、确认里程碑，还是进入某个 AI Builder OS skill。
- Skill hardening 输出必须说明触发条件、不触发条件、模式判断、模板分层、反模式、示例、输出契约和 validator/eval 设计。

## 交接

当请求属于 AI Builder OS 构建链路时，给出明确 handoff：

- 模糊产品意图、用户/场景/结果不清 -> `builder-frame`
- 已有 Feature Frame 或需求，需要形成可构建规格 -> `builder-spec`
- UI、页面、线框图、可交互原型、视觉验证 -> `builder-prototype`
- 要交给 Codex / Claude Code / Qoder / Cursor / Workbuddy 执行 -> `builder-agent-task`
- 需要审计输出、证据、readiness、Go/No-Go -> `builder-review`
- 需要保留重要产品/架构/范围取舍 -> `builder-decision`

handoff 时至少包含：目标、上下文来源、推荐模式、关键假设、non-goals、验收标准、验证方式和停止条件。

## Skill Hardening Brief

```yaml
skill_name: builder-plan-goal
primary_artifact: mode-recommendation + copy-ready /plan 或 /goal 提示词
target_users:
  - 需要给 agentic runtime 写提示词的非程序员
  - 不确定任务该用 Prompt/Plan/Goal 的 builder
  - 需要 milestone 拆分的高复杂度任务 owner
baseline_failure_scenarios:
  - 把日常小任务包装成 Plan/Goal（过度工程化）
  - Goal 缺 Scope/Non-goals/Done when/Verification，agent 自我声称完成
  - Plan -> Goal 没拆 milestone，一口气做完不可审查
  - 业务/安全决策缺失时未 ask first，假装可以继续
trigger_conditions:
  explicit:
    - 用户说"帮我判断用 Plan 还是 Goal"
    - 用户说"帮我生成计划/目标提示词"
    - 用户要把工作交给另一个 agentic runtime
  implicit:
    - 复杂、模糊、长周期或易范围膨胀的编码任务
    - 大 diff、多模块、跨层级、技术选型任务
  adjacent_skill_boundaries:
    - builder-frame：意图本身模糊（不知道要做什么）→ 先 frame
    - builder-spec：已决定要做但需要规格 → spec
non_trigger_conditions:
  - 简单问答、概念解释、翻译
  - 一次性小改动，范围清楚
  - 用户已经明确要求立即实现且任务小
mode_decision:
  - prompt / plan / goal / plan_to_goal / ask_first
  - 默认推荐最轻有效模式，不过度包装
quality_gates:
  - 推荐模式必须是最轻的有效模式
  - Goal 必须含 Scope/Non-goals/Done when/Verification
  - Plan 必须含现状侦察/方案比较/风险/里程碑/Milestone 1 Goal
  - Plan -> Goal 必须拆成可 review、可验证的 milestone
  - 缺高风险决策时必须 ask first
  - 输出必须能直接复制给目标 runtime
red_flags:
  - copy_ready_plan_prompt 为空但 mode_recommendation 是 Plan
  - milestones 只有 1 个（不构成 Plan -> Goal）
  - Goal 缺 Verification
anti_evasion_rules:
  - 不允许用"综合判断"掩盖未实际检查的 missing_context
  - 不得把 ask_first 包装成 record_decision
  - 不得让 Goal 承担需求澄清或战略判断
done_when:
  - mode_recommendation 已选定（5 模式之一）
  - 若推荐 Plan/Goal，copy_ready prompt 已生成
  - next_skill_input 或"复制 prompt 即可"已说明
open_questions:
  - 是否需要为不同 runtime（Codex/Claude Code/Qoder）维护差异化模板
```

## Meta-Review

何时该被 builder-review 复审：

- 生成的 /plan 或 /goal 在下游 agent 执行中反复失败（说明 prompt 不够清楚）
- mode_recommendation 被用户连续 2 次推翻

已知 false-positive 场景：

- 简单任务被推荐为 Plan（过度工程化）

已知 false-negative 场景：

- Plan -> Goal 场景被识别为单一 Goal，导致 milestone 拆分缺失

## Evolution Writeback

本 skill 的稳定决策应迁移到以下 source-of-truth（参考 `docs/source-of-truth-map.md`）：

- 模式判断规则 → `kernel/routing/plan-goal-routing.zh.md`
- /plan /goal 模板 → `references/plan-template.zh.md` / `references/goal-template.zh.md`
- 决策规则 → `references/decision-rules.zh.md`
- 反模式 → `references/anti-patterns.zh.md`

## 示例

**示例**（should_trigger / 模糊目标到 Plan Brief）**: 用户输入 "我想提升客服效率"。plan-goal 先用 grill 问题收敛为"为 50 人客服团队降低 30% 重复问题处理时间"，输出 Plan Brief（goal_statement / non_goals / success_metrics / handoff_target=builder-frame）。

**示例**（should_not_trigger / 已有 Feature Frame）**: 用户输入 "这是已确认的 Feature Frame，直接做 prototype"。plan-goal 不再生成 Plan Brief，直接路由到 `builder-prototype`。

**示例**（adjacent-skill 分流）**: 用户输入 "帮我把这个目标拆成 sprint backlog"。这是 prioritization 而非 plan-goal，路由到 legacy `pm-backlog` 或 `builder-spec`（agent-readable spec）。

**示例**（high-risk ask-first）**: 用户输入 "目标是 Q3 收入翻倍"。plan-goal 检测到不可量化/不可达的成功指标，先 ask_user 确认范围约束（产品线、时间窗、基线），不直接生成不可执行的 Plan Brief。

## 参考

- `kernel/routing/plan-goal-routing.zh.md`
- `kernel/packets/agent-task-packet.schema.md`
- `kernel/packets/output-packet.schema.md`
- `references/decision-rules.zh.md`
- `references/plan-template.zh.md`
- `references/goal-template.zh.md`
- `references/anti-patterns.zh.md`
- `references/examples.zh.md`
- `assets/output-format.zh.md`
- `references/skill-design/skill-design-playbook.zh.md`
- `templates/skill-hardening-brief/template.md`
- `templates/plan-brief/template.md` — Plan Brief 输出模板（goal_statement / non_goals / success_metrics / decision_points / handoff_target）
