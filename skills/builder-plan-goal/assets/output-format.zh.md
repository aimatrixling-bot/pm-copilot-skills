# Builder Plan Goal 固定输出格式

使用本 skill 时，最终回答默认采用以下结构。内容保持简洁，中文为主，提示词用代码块给出。

## 1. 模式建议

写明推荐模式：

- 普通 Prompt
- Plan
- Goal
- Plan -> Goal
- 先提问

必要时补一句“不建议直接 Goal”或“不需要 Plan/Goal”。

## 2. 判断理由

用 2-5 条说明：

- 任务复杂度。
- 上下文是否充足。
- 验收标准是否清晰。
- 是否需要方案比较。
- 是否适合持续执行。

## 3. 当前风险

列出最关键风险，不要泛泛而谈：

- 目标过大。
- 范围膨胀。
- 验收标准缺失。
- 代码库影响面不明。
- 权限/数据/安全/生产风险。
- 缺少人工业务决策。

## 4. 推荐工作流

说明具体顺序，例如：

```text
先 /plan -> 人工评审计划 -> 再 /goal 执行 Milestone 1 -> 验证 -> review diff -> 下一个 Goal
```

如果任务属于 AI Builder OS 链路，说明 handoff：

```text
builder-frame -> builder-spec -> builder-prototype / builder-agent-task -> builder-review
```

## 5. 可直接复制的提示词

根据建议模式输出完整提示词：

- 普通 Prompt：给一条普通指令。
- Plan：给 `/plan` 提示词。
- Goal：给 `/goal` 提示词。
- Plan -> Goal：先给 `/plan`，再给“计划确认后使用的 `/goal`”。
- 先提问：给最多 3 个澄清问题，并说明回答后会生成哪种提示词。

## 6. 如果适用，拆分后的里程碑

仅当任务较大时输出。每个 milestone 必须可审查、可验证。

```text
Milestone 1: [名称] - [完成标准]
Milestone 2: [名称] - [完成标准]
Milestone 3: [名称] - [完成标准]
```

## 7. 下一步建议

给用户一个明确动作：

- 复制上面的 `/plan`。
- 先回答 3 个问题。
- 先确认 milestone 边界。
- 先补充日志/截图/验收标准。
- 直接用普通 Prompt 执行。
- 交给指定 AI Builder OS skill 继续。

## 机器可读字段

需要结构化输出时，可附加：

```yaml
mode_recommendation:
  mode:
  confidence:
  one_line_reason:
reasoning_summary:
  facts:
  assumptions:
  risk_signals:
missing_context:
  questions:
  can_continue_with_assumptions:
risk_level:
recommended_workflow:
  steps:
  next_runtime_or_skill:
copy_ready_plan_prompt:
copy_ready_goal_prompt:
milestones:
  - name:
    objective:
    done_when:
    verification:
stop_conditions:
handoff_packet:
  target_skill:
  target_runtime:
  required_inputs:
```

## 短响应版本

当用户只需要直接建议时，回答：

1. 推荐模式。
2. 原因。
3. 可复制提示词，或必须先回答的一个关键问题。
