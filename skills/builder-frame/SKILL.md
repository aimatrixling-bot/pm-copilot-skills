---
name: builder-frame
displayName: Feature Frame
description: "把模糊想法、业务问题、产品请求、个人项目意图或非程序员描述转成清晰的 Feature Frame。适用于进入 spec、prototype 或 agent task 前，问题、用户、场景、期望结果、核心能力、non-goals、成功标准、关键决策树或 spec readiness 还不明确的情况。不要用于已有已接受 Feature Frame 后写 spec、做 prototype 或生成 Agent Task Packet 的请求。"
user-invocable: true
argument-hint: "[想法、问题、需求或项目上下文]"
---

# Builder Frame

## 使命

把模糊意图转成下游 skill 可以使用的 Feature Frame。

当 AI Builder OS 已经捕获意图、但还没有可构建产品产物时，这个 skill 是第一步成型动作。

## 资源读取

- 生成 Feature Frame 时，读取 `templates/feature-frame.template.md`。
- 判断 frame 是否成熟时，读取 `references/frame-rules.zh.md`。
- 输入需要先追问和解析关键决策树时，读取 `loops/recipes/grill-decision.loop.md`。
- 需要从旧 PM skill 迁移口径时，读取 `references/migration-notes.md`。
- 打磨或评审 skill 设计时，读取 `references/skill-design/skill-design-playbook.zh.md`。

## 何时使用

- 用户有想法，但还不是清晰功能。
- 用户描述了问题，但没有定义用户或结果。
- 此时直接写 spec 或 prototype 还太早。
- 产出需要交给 `builder-spec` 或 `builder-prototype`。
- 用户正在描述“想做什么”，但还没有形成可验收范围。

## 何时不要使用

- 已经有完整 PRD 或已接受的 Feature Frame。
- 用户只需要给已定范围任务写执行指令。
- 任务主要是代码实现或评审。
- 用户已经要求评审已有产物；交给 `builder-review`。
- 用户只需要记录明确取舍；交给 `builder-decision`。

## 输入

- 原始想法或问题。
- 目标用户或假设用户。
- 当前上下文和约束。
- 证据或示例。
- 期望输出深度。

## 模式判断

- `idea_frame`：只有初始想法，需要提炼问题、用户、场景和价值。
- `problem_frame`：已有业务痛点，需要明确目标用户、当前痛点和期望结果。
- `opportunity_frame`：已有方向或竞品启发，需要定义核心能力、magic moment 和成功标准。
- `grill_frame`：关键决策树、推荐默认答案或共享理解缺失，必须先追问，不直接输出完整 Feature Frame。
- `not_ready_for_spec`：关键业务目标、用户或非目标缺失，必须先澄清或列 open questions。

## 执行流程

1. 读取 Feature Frame 模板和 frame rules。
2. 捕获问题、用户、场景和当前痛点。
3. 判断是否需要进入 `grill_frame`；如果需要，读取 Grill Decision Loop，一次聚焦一个高杠杆问题，并给出推荐默认答案。
4. 区分事实、假设和未知项。
5. 定义 shared understanding、decision tree、期望结果、核心能力和 magic moment。
6. 列出 non-goals、成功标准、约束、证据缺口和 human decision points。
7. 推荐下一 skill，生成 `next_skill_input`，并判断 frame 是否 spec-ready。

## 输出契约

```yaml
artifact_type: feature_frame
frame_mode:
shared_understanding:
decision_tree:
critical_questions:
recommended_defaults:
problem:
user:
scenario:
current_pain:
desired_outcome:
core_capability:
magic_moment:
non_goals:
success_criteria:
constraints:
facts:
assumptions:
open_questions:
human_decision_points:
stable_terms:
frame_confidence:
blocking_questions:
evidence_needed:
spec_readiness:
next_skill_hint:
next_skill_input:
```

## 质量门禁

- 不要跳过问题验证。
- 核心能力不清楚之前，不要定义页面。
- Non-goals 必须明确。
- 成功标准必须可观察或可验证。
- 事实、假设和未知项必须保持分离。
- 关键决策未解析时，使用 `grill_frame`，不要把模糊输入包装成完整 Feature Frame。
- 每个 open question 或 blocking question 必须说明阻塞对象：frame、spec、prototype、agent_task、decision 或 review。
- 推荐默认答案必须标记为 assumption，不能伪装成用户已确认决定。
- 如果 frame 还没有 spec-ready，说明缺什么，不要假装已经可进入 spec。
- `spec_readiness` 为 `not_ready` 时，不要建议直接进入 `builder-agent-task`。
- 下游交接必须包含 `next_skill_input`，而不只是 `next_skill_hint`。
- 不要把 screen-by-screen UI 细节写进 Feature Frame；那属于 spec 或 prototype。

## 交接

通常交给 `builder-spec`、`builder-prototype` 或 `builder-agent-task`。交接时必须保留 facts、assumptions、open_questions、non_goals、success_criteria、decision_tree、human_decision_points、blocking_questions、spec_readiness 和 next_skill_input。

## Skill Hardening Brief

```yaml
skill_name: builder-frame
primary_artifact: feature-frame.yaml（含 problem/user/scenario/non_goals/success_criteria/spec_readiness）
target_users:
  - 有想法但还没形成可验收范围的用户
  - 描述了业务痛点但没定义用户或结果的 PM
  - 从竞品启发或方向探索进入的 builder
baseline_failure_scenarios:
  - 跳过问题验证直接写 UI 细节
  - 关键决策未解析时强行输出完整 Frame（应 grill_frame）
  - 推荐默认答案伪装成用户已确认决定
  - spec_readiness=not_ready 却建议直接进 agent_task
trigger_conditions:
  explicit:
    - 用户说"我有个想法"
    - 用户描述业务痛点但没定义用户
    - 用户要求"提炼问题"或"Feature Frame"
  implicit:
    - 请求指向 spec/prototype 但用户/场景/期望结果不清
    - frame 阶段关键决策树缺失
  adjacent_skill_boundaries:
    - builder-spec：已有 Feature Frame → spec
    - builder-decision：用户只需记录明确取舍 → decision
non_trigger_conditions:
  - 已有完整 PRD 或已接受 Feature Frame
  - 用户只需基于已定范围写执行指令
  - 任务主要是代码实现或评审
mode_decision:
  - idea_frame / problem_frame / opportunity_frame / grill_frame / not_ready_for_spec
quality_gates:
  - 不跳过问题验证
  - 核心能力清楚前不定义页面
  - non_goals 必须明确
  - 成功标准必须可观察或可验证
  - 事实/假设/未知项必须分离
  - 关键决策未解析时使用 grill_frame
  - 每个 open question 必须说明阻塞对象
  - 推荐默认答案必须标记为 assumption
red_flags:
  - decision_tree 字段为空但 critical_questions 多个
  - spec_readiness=ready 但 success_criteria 缺失
  - next_skill_hint 有但 next_skill_input 缺失
anti_evasion_rules:
  - 不得把模糊输入包装成完整 Feature Frame
  - 不得用"用户大概率想要 X"替代实际验证
done_when:
  - frame_mode 已选定
  - 输出契约 YAML 全字段已填或显式 null
  - next_skill_input 已生成（不只是 hint）
  - spec_readiness 已明确（ready / not_ready + 缺什么）
open_questions:
  - grill_frame 默认推荐答案的 confidence 阈值
```

## Meta-Review

何时该被 builder-review 复审：

- Feature Frame 进入 spec/prototype 后立即被下游 skill reroute 回 frame（说明 frame 不充分）
- spec_readiness 判断被下游 skill 推翻

已知 false-positive 场景：

- 已有方向性想法被识别为 idea_frame（应 opportunity_frame）

已知 false-negative 场景：

- 隐性 spec（散落在 prototype 中的取舍）未触发 frame，导致下游 spec 反复 reroute

## Evolution Writeback

本 skill 的稳定决策应迁移到以下 source-of-truth（参考 `docs/source-of-truth-map.md`）：

- Feature Frame 模板 → `templates/feature-frame.template.md`
- Frame 规则 → `references/frame-rules.zh.md`
- Grill Decision Loop → `loops/recipes/grill-decision.loop.md`
- 迁移口径 → `references/migration-notes.md`

## 示例

**示例**（should_trigger / 模糊 idea 到 Feature Frame）**: 用户输入 "我想加个推荐功能"。frame 启动 Grill Decision Loop，3-5 轮提问收敛为"为新用户在 onboarding 第 3 步推荐 5 个高相关内容"，输出 Feature Frame（users / problem / scope / non_goals / success_metrics）。

**示例**（should_not_trigger / 已有可构建 spec）**: 用户输入 "这是上周确认的 Mini Spec，直接做 prototype"。frame 不再 grill，直接路由到 `builder-prototype`。

**示例**（adjacent-skill 分流）**: 用户输入 "帮我们决定要不要做这个功能"。这是决策而非 frame，路由到 `builder-decision` 的 `compare_options` 模式。

**示例**（high-risk ask-first）**: 用户输入 "重写整个推荐引擎"。frame 检测到 reframe 风险 + 影响 production，先 ask_user 确认是否真要 reframe 而非 improve，并要求提供 baseline 和不可触碰范围。

## 参考

- `kernel/packets/output-packet.schema.md`
- `loops/recipes/grill-decision.loop.md`
- `templates/feature-frame.template.md`
- `references/frame-rules.zh.md`
- `references/migration-notes.md`
- `references/worked-example-idea-to-feature-frame.zh.md` — 端到端示例（模糊 idea → Feature Frame）
- `evals/output-contract/feature-frame.schema.json`
- `references/skill-design/skill-design-playbook.zh.md`
