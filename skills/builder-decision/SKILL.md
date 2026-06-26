---
name: builder-decision
displayName: Decision Record
description: "为产品、架构、范围、发布、安全、记忆、runtime、workflow 或 builder skill 取舍创建结构化 Decision Record。适用于用户需要记录已做出或待确认的决策、比较方案、保留理由、记录被拒绝选项、定义反转条件、避免后续重复争论，或把 review/plan 中的关键取舍沉淀到项目记忆。不要用于开放式 review、audit、spec、prototype 或 agent task 生成。"
user-invocable: true
argument-hint: "[决策上下文和选项]"
---

# Builder Decision

## 使命

保存重要决策，避免未来 Builder 工作丢失上下文或重复已经解决的争论。

## 资源读取

- 创建决策记录时，读取 `templates/decision-record/template.md` 和 `kernel/packets/decision-record.schema.md`。
- 决策需要进入长期记忆时，读取 `memory/schemas/decision-memory.schema.md`。
- 决策来自 review 或 release gate 时，按需读取相关 gate 和 evidence。
- 打磨或评审 skill 设计时，读取 `references/skill-design/skill-design-playbook.zh.md`。

## 何时使用

- 正在做产品、架构、范围、发布、安全或 workflow 取舍。
- 用户比较多个选项并需要推荐。
- 决策会影响未来 skill、产物或 runtime 行为。
- Review 发现需要人类接受风险、降级范围或选择方案。

## 何时不要使用

- 用户只需要不需要沉淀的日常建议。
- 决策影响很小，不值得保存。
- 证据不足，需要先 Plan。
- 用户需要创建 spec、prototype 或 agent task，而不是记录取舍。

## 输入

- 决策上下文。
- 已考虑选项。
- 约束和证据。
- 相关干系人或受影响产物。
- 反转条件。

## 模式判断

- `record_decision`：用户已做出选择，需要沉淀理由和反转条件。
- `compare_options`：需要比较多个方案并推荐。
- `accept_tradeoff`：review 或 release gate 发现风险，需要记录接受理由。
- `defer_decision`：证据不足，不能做决定，必须列出补证据动作。

## 执行流程

1. 澄清决策以及为什么重要。
2. 列出选项和取舍。
3. 推荐或记录已选择的决策。
4. 捕获理由、风险和反转条件。
5. 定义 follow-up 和记忆位置。

## 输出契约

```yaml
decision_mode:
decision_title:
context:
options_considered:
decision:
rationale:
tradeoffs:
risks:
assumptions:
evidence:
reversal_conditions:
owners:
follow_up:
memory_target:
date:
```

## 质量门禁

- 不要隐藏被拒绝选项。
- 对不确定选择包含 reversal conditions。
- 标记 assumptions。
- 不要把用户拥有的业务判断包装成 AI 确定性。
- 证据不足时，使用 `defer_decision`，不要假装已经有推荐结论。

## 交接

当存在项目记忆、产物记忆或明确 decision log 时，把决策记录进去。交接给后续 skill 时必须保留 decision、rationale、tradeoffs、risks、assumptions、evidence、reversal_conditions 和 follow_up。

## 参考

- `kernel/packets/decision-record.schema.md`
- `templates/decision-record/template.md`
- `memory/schemas/decision-memory.schema.md`
- `evals/output-contract/decision-record.schema.json`
- `references/skill-design/skill-design-playbook.zh.md`
