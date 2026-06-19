# Builder Frame 规则

把模糊意图转成 Feature Frame 时，使用这些规则。

## 核心 framing 规则

- 从用户真实问题开始，而不是从用户要求的产物格式开始。
- 区分事实、假设和开放问题。
- 先识别目标用户和具体场景，再定义能力。
- 先定义期望结果，再描述页面、API、prompt 或实现。
- 明确 non-goals，保护范围。
- 成功标准必须能通过用户行为、产物 review、指标或验证证据观察到。

## Spec 就绪判断

只有以下内容足够清楚时，才标记为 `ready`：

- 问题和目标用户。
- 场景和期望结果。
- 核心能力。
- Non-goals。
- 成功标准。
- 主要约束和开放风险。

当只有一两个重要问题缺失，且可以快速回答时，使用 `needs_clarification`。

当任务仍隐藏战略、用户、范围或决策归属时，使用 `not_ready`。

## Grill Frame 规则

当输入仍缺少共享理解时，使用 `grill_frame`，不要直接产出完整 Feature Frame。

`grill_frame` 的目标不是多问问题，而是解析会影响后续产物的关键决策树：

- 一次只聚焦一个最高杠杆问题。
- 每个问题必须给出推荐默认答案。
- 推荐默认答案必须进入 assumptions，不能写成用户已确认事实。
- 每个问题必须说明阻塞对象：frame、spec、prototype、agent_task、decision 或 review。
- 如果问题可通过当前文档、代码或用户提供资料回答，先查证，不要问用户。
- 当三次高杠杆追问后仍无法收敛，输出 `not_ready_for_spec` 或 Plan，不要无限追问。

`decision_tree` 至少记录：

- 需要做出的决策。
- 可选方案及各自 tradeoff。
- 推荐默认答案和理由。
- 是否需要 human decision。
- 阻塞哪个下游 skill 或产物。

## Handoff 规则

Feature Frame 输出给下游 skill 时，必须包含 `next_skill_input`。

- 交给 `builder-spec`：必须包含用户、场景、核心能力、non-goals、成功标准、主要约束和阻塞问题。
- 交给 `builder-prototype`：必须包含目标场景、magic moment、关键状态和不可丢失的用户价值。
- 交给 `builder-agent-task`：必须先有验收标准、验证方式、forbidden actions 或 stop conditions；否则回退到 spec。
- 交给 `builder-decision`：只传真实 trade-off，不把普通偏好升级成长期决策。

## 设计层级纪律

轻量使用五层模型：

- strategy：为什么重要，为谁重要。
- scope：哪些能力在范围内或范围外。
- structure：用户旅程或系统流程如何运转。
- skeleton：结构清楚后，再考虑页面、命令或产物布局。
- surface：frame 支撑后，再进入视觉细节。

不要从 strategy 或 scope 问题直接跳到高保真输出。
