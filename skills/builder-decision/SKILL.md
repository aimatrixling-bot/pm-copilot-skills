---
name: builder-decision
displayName: Decision Record
description: "为产品、架构、范围、发布、安全、记忆、runtime、workflow 或 builder skill 取舍创建结构化 Decision Record。适用于用户需要记录已做出或待确认的决策、比较方案、保留理由、记录被拒绝选项、定义反转条件、避免后续重复争论，或把 review/plan 中的关键取舍沉淀到项目记忆。不要用于开放式 review、audit、spec、prototype 或 agent task 生成。"
user-invocable: true
argument-hint: "[决策上下文和选项]"
---

# Builder Decision

## 入口契约

接收来自 builder-router 或上游 skill 的 Intent Packet（参考 `kernel/packets/intent-packet.schema.md`）。本 skill 关心的最小字段集：

- `want`：用户想要的决策结果（"记录决策" / "比较方案" / "接受 tradeoff" / "推迟决策"）。
- `context`：决策影响的产物、技能或 runtime 范围。
- `constraints`：时间、不可逆程度、相关干系人。
- `missing_inputs`：缺哪些证据会让决策必须 defer。

若 Intent Packet 缺 `want` 或 `context`，先退回 builder-plan-goal 澄清，不要在证据不足时强行给推荐。

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

## Skill Hardening Brief

```yaml
skill_name: builder-decision
primary_artifact: decision-record.yaml（写入 kernel/packets/decision-record.schema.md 定义的契约）
target_users:
  - 需要沉淀决策的 Builder（自己或团队后续会回看）
  - 在 review/release gate 发现 tradeoff 需要接受的产品负责人
  - 证据不足但需要明确 defer 动作的 Agent
baseline_failure_scenarios:
  - compare_options 给出"看起来合理但其实无依据"的推荐
  - reversal_conditions 是标量字符串，无法机器检查何时该反转
  - 用户接受的 tradeoff 在后续 review 中被反复质疑，因为没记录接受理由
  - defer_decision 没有 evidence_needed/owner/revisit_by，决策永远搁置
red_phase:
  - 识别决策类型（one-way door vs two-way door）
  - 列出每个选项的 reversal cost 和 cost of delay
  - 标记 assumptions 的 review_by 日期
green_phase:
  - compare_options 应用 MCDA（多准则评分）+ Reversibility Matrix
  - 优先级排序使用 Cost of Delay = Value / Time（CD3），见 references/decision-frameworks.zh.md
  - reversal_conditions 结构化为 {trigger, threshold, action_on_trigger}
  - defer_decision 输出 evidence_needed[] + decision_owner + revisit_by
trigger_conditions:
  explicit:
    - 用户说"记录决策"/"比较方案"/"接受 tradeoff"/"推迟决策"
    - review 或 release gate 要求接受风险或降级范围
  implicit:
    - 决策影响未来 skill/产物/runtime 行为
    - 多个选项正在被权衡且需要推荐
  adjacent_skill_boundaries:
    - builder-review：review 提出取舍但未要求记录 → review 不调用 decision
    - builder-plan-goal：目标澄清阶段，证据不足 → 先 plan 再 decision
non_trigger_conditions:
  - 日常一次性建议，不需要沉淀
  - 用户只需要创建 spec/prototype/agent task，不是记录取舍
quality_gates:
  - Decision Reversibility Gate：one-way door 决策必须更高证据门槛（至少 2 条独立证据）
  - Assumption Expiration Gate：每个 assumption 必须有 review_by 日期
  - Evolution Writeback Gate：决策若进入长期记忆，必须走 memory/schemas/decision-memory.schema.md 写回流程
  - 不隐藏被拒绝选项
  - 证据不足时用 defer_decision，不假装已有结论
  - 不把用户业务判断包装成 AI 确定性
red_flags:
  - 推荐结论引用的 evidence 在上下文中不存在
  - reversal_conditions 为空但 decision 标记为"可逆"
  - assumptions 无 review_by
  - tradeoffs 只列优点不列缺点
anti_evasion_rules:
  - 不得用"综合来看"掩盖未实际打分的 MCDA
  - 不得把 defer_decision 包装成 record_decision（"暂时记录为..."）
  - 不得在 evidence 字段填"用户确认"来绕过证据门槛
done_when:
  - decision_mode 已明确（4 模式之一）
  - 输出契约 YAML 全字段已填或显式标注 null
  - reversal_conditions（若涉及）已结构化为对象数组
  - memory_target 已指向具体 schema 文件路径
open_questions:
  - 决策框架引用是否需要独立 references/decision-frameworks.zh.md（P0.2 落地）
  - MCDA 评分权重默认值是否需要配置化
```

## Meta-Review

何时该被 builder-review 复审：

- decision 进入长期记忆（memory_target 非空）后的下一个 review 窗口
- reversal_conditions 被触发，决策需要反转时
- 同一决策在 3 个月内被重新讨论（说明 reversal_conditions 或 rationale 不充分）

已知 false-positive 场景：

- 用户口述"已经决定 X"但实际只是倾向，会被误判为 record_decision（应路由到 compare_options）

已知 false-negative 场景：

- 隐性决策（散落在 spec/prototype 中的取舍）未被识别为 decision，导致不沉淀

## Evolution Writeback

本 skill 的稳定决策应迁移到以下 source-of-truth（参考 `docs/source-of-truth-map.md`）：

- 决策记录本身 → `memory/schemas/decision-memory.schema.md`（长期记忆）
- 重复出现的决策反模式 → `memory/schemas/evolution-note.schema.md`（提议写回）
- 决策契约定义 → `kernel/packets/decision-record.schema.md`（输出 schema）
- 决策模板 → `templates/decision-record/template.md`（交付物模板）

## 示例

**示例**（should_trigger / 显式决策记录）**: 用户输入 "记录这个决策：选 Postgres 不选 MongoDB"。decision 进入 `record_decision` 模式，输出 options_considered / tradeoffs / decision_owner / revisit_by，并判断 reversibility。

**示例**（should_not_trigger / 还在 frame 阶段）**: 用户输入 "决定要不要做这个功能"。这是 framing 而非 decision record，路由到 `builder-frame` 先收敛问题定义。

**示例**（adjacent-skill 分流 / compare_options）**: 用户输入 "比较 monorepo 和 polyrepo 两个方案"。decision 进入 `compare_options`，应用 MCDA + Reversibility Matrix + Cost of Delay（CD3），输出排序 + 推荐 + reversal_conditions。

**示例**（high-risk ask-first / one-way door）**: 用户输入 "决定下线旧版 API"。decision 检测到 one-way door + 影响 production，升级证据门槛，先 ask_user 确认 migration plan、rollback、stakeholder sign-off，再生成 decision record。

## 参考

- `kernel/packets/decision-record.schema.md`
- `templates/decision-record/template.md`
- `memory/schemas/decision-memory.schema.md`
- `evals/output-contract/decision-record.schema.json`
- `references/skill-design/skill-design-playbook.zh.md`
