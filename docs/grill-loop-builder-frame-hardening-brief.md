# Grill Loop + Builder Frame Hardening Brief

## 目标

把 `builder-frame` 从“把模糊输入整理成 Feature Frame”增强为“先解析关键决策树，再判断是否产出 Feature Frame”。本次增强不新增第 9 个 core skill，不改变 active surface，不引入自动调度系统。

## 范围

本次最小实现覆盖：

- 新增 `loops/recipes/grill-decision.loop.md`。
- 强化 `skills/builder-frame/SKILL.md` 的模式判断、输出契约、质量门禁和 handoff。
- 更新 `skills/builder-frame/templates/feature-frame.template.md`。
- 更新 `skills/builder-frame/references/frame-rules.zh.md`。
- 轻量更新 `builder-router` 相关路由说明，让 router 能识别需要 Grill Loop 的场景。
- 更新 feature-frame output contract、routing eval 和 builder-os validator。

不做：

- 不新增 `builder-grill` 或其他 user-facing skill。
- 不把 router 做成强制拦截所有 skill 的自动 supervisor。
- 不改变 runtime adapter 或 package active skill surface。
- 不自动写入用户项目资产、删除文件、迁移文件或执行生产动作。

## 当前角色

```yaml
current_role:
  builder-frame: 把模糊意图转成下游 skill 可以使用的 Feature Frame。
  loops: 描述可重复、可验证、可停止的工作循环，不替代 skill。
```

## 目标角色

```yaml
target_role:
  builder-frame: 先判断输入是否足以形成共享理解；不足时进入 grill_frame 模式，输出决策树、推荐默认答案和阻塞项；足够时产出 Feature Frame。
  grill-decision.loop: 作为前置澄清和决策树解析协议，被 router、frame、spec、agent-task 按需引用。
```

## 主要产物

```yaml
primary_artifact:
  - Feature Frame
  - grill_state
  - decision_tree
  - next_skill_input
```

## 触发条件

```yaml
trigger_conditions:
  explicit:
    - 用户要求“先追问我”“先帮我想清楚”“不要急着写方案”。
    - 用户要求把模糊想法、业务问题、产品请求或个人项目意图整理成 Feature Frame。
  implicit:
    - 目标用户、核心场景、成功标准、non-goals、验收方式缺失。
    - 用户直接要求 spec、prototype 或 Agent Task Packet，但输入明显不成熟。
    - 早期选择会影响范围、成本、架构、验证或后续 skill 路径。
```

## 非触发条件

```yaml
non_trigger_conditions:
  - 已有 accepted Feature Frame，需要写 spec。
  - 已有清晰 spec、目标 runtime 和验收标准，需要生成 Agent Task Packet。
  - 已有产物，需要 review 或 evidence audit。
  - 用户只需要记录已明确取舍，应使用 builder-decision。
  - 用户只问简单事实或轻量文案。
```

## 模式判断

```yaml
mode_decision:
  modes:
    - idea_frame
    - problem_frame
    - opportunity_frame
    - grill_frame
    - not_ready_for_spec
  decision_order:
    - 输入是否已经足够小且清楚？
    - 是否存在会改变方向的关键决策？
    - 是否有足够 facts 支撑用户、场景、成功标准？
    - 是否可以输出 Feature Frame，还是必须先 grill？
    - 输出后应交给 spec、prototype、agent-task、decision 还是 review？
```

## 新输出字段

```yaml
new_fields:
  frame_mode:
  shared_understanding:
  decision_tree:
  critical_questions:
  recommended_defaults:
  human_decision_points:
  stable_terms:
  frame_confidence:
  blocking_questions:
  evidence_needed:
  next_skill_input:
```

## 质量门禁

- 不把模糊输入包装成完整 Feature Frame。
- 每个 `open_questions` 或 `blocking_questions` 必须说明阻塞对象：spec、prototype、agent task、decision 或 review。
- Grill 问题一次只聚焦一个高杠杆决策，并给推荐答案。
- AI 可以推荐默认值，但必须标记为 assumption。
- `spec_readiness.status` 为 `not_ready` 时，不允许建议直接进入 `builder-agent-task`。
- 下游交接必须包含 `next_skill_input`，而不只是 `next_skill_hint`。

## Handoff 规则

```yaml
handoff_targets:
  builder-router:
    - 识别 grill_frame 场景并路由到 builder-frame 或 grill-decision loop。
  builder-spec:
    - 消费 ready 或 needs_clarification 且阻塞项已明确的 Feature Frame。
  builder-prototype:
    - 消费用户、场景、核心能力、关键状态明确的 Feature Frame。
  builder-agent-task:
    - 只消费边界、验收、non-goals、验证方式明确的 frame/spec。
  builder-decision:
    - 消费 human_decision_points 中需要长期沉淀的真实 trade-off。
```

## Eval 计划

- 增加 routing case：模糊输入需要 `builder-router -> builder-frame` 并包含 `grill_state`。
- 增加 routing case：用户误 call agent task 但输入不成熟时，回退到 `builder-frame`。
- 更新 `feature-frame.schema.json`，把 Grill 字段纳入 required。
- 更新 `validate-builder-os.js`，确保新 loop、字段和 routing eval 不会漂移。

## 完成标准

- `loops/recipes/grill-decision.loop.md` 存在，并被 `loops/README.md`、`builder-frame` 和 router 规则引用。
- `builder-frame` 支持 `grill_frame` 模式。
- Feature Frame 模板包含 `decision_tree`、`human_decision_points`、`next_skill_input`。
- output-contract 和 routing eval 覆盖新增字段和路径。
- `npm run validate:builder-os` 通过。
