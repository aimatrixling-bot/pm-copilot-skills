---
name: builder-frame
displayName: Feature Frame
description: "把模糊想法、业务问题、产品请求、个人项目意图或非程序员描述转成清晰的 Feature Frame。适用于进入 spec、prototype 或 agent task 前，问题、用户、场景、期望结果、核心能力、non-goals、成功标准或 spec readiness 还不明确的情况。不要用于已有已接受 Feature Frame 后写 spec、做 prototype 或生成 Agent Task Packet 的请求。"
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
- `not_ready_for_spec`：关键业务目标、用户或非目标缺失，必须先澄清或列 open questions。

## 执行流程

1. 读取 Feature Frame 模板和 frame rules。
2. 捕获问题、用户、场景和当前痛点。
3. 区分事实、假设和未知项。
4. 定义期望结果、核心能力和 magic moment。
5. 列出 non-goals、成功标准、约束和证据缺口。
6. 推荐下一 skill，并判断 frame 是否 spec-ready。

## 输出契约

```yaml
artifact_type: feature_frame
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
spec_readiness:
next_skill_hint:
```

## 质量门禁

- 不要跳过问题验证。
- 核心能力不清楚之前，不要定义页面。
- Non-goals 必须明确。
- 成功标准必须可观察或可验证。
- 事实、假设和未知项必须保持分离。
- 如果 frame 还没有 spec-ready，说明缺什么，不要假装已经可进入 spec。
- 不要把 screen-by-screen UI 细节写进 Feature Frame；那属于 spec 或 prototype。

## 交接

通常交给 `builder-spec`、`builder-prototype` 或 `builder-agent-task`。交接时必须保留 facts、assumptions、open_questions、non_goals、success_criteria 和 spec_readiness。

## 参考

- `kernel/packets/output-packet.schema.md`
- `templates/feature-frame.template.md`
- `references/frame-rules.zh.md`
- `references/migration-notes.md`
- `evals/output-contract/feature-frame.schema.json`
- `references/skill-design/skill-design-playbook.zh.md`
- 既有来源：`skills/pm-feature-frame/SKILL.md`
