# Skill 选择规则

## 选择原则

- 优先选择能产出所需资产的最小 skill。
- 当用户不知道 skill 名称时，优先走 router。
- 不要为日常建议或轻量文案润色触发重型 builder workflow。
- 产品或任务契约不清楚之前，不要进入构建/执行类 skill。
- 发布、推广或验收前先做 review。
- 当 spec、prototype 或 agent task 请求缺少关键决策树、non-goals、成功标准或验证方式时，先回到 `builder-frame` 的 `grill_frame`，不要硬交给下游 skill。

## Core Skill Map（核心 skill 映射）

| 需求 | Skill |
| --- | --- |
| 选择路径 | `builder-router` |
| 判断 Prompt/Plan/Goal | `builder-plan-goal` |
| 梳理模糊意图 | `builder-frame` |
| 解析关键决策树并形成共享理解 | `builder-frame` + `loops/recipes/grill-decision.loop.md` |
| 写可构建规格 | `builder-spec` |
| 做视觉或原型资产 | `builder-prototype` |
| 交给 Codex/Claude/Qoder 执行 | `builder-agent-task` |
| 审计输出、证据或就绪度 | `builder-review` |
| 记录重要取舍 | `builder-decision` |

## 防膨胀规则

新增 skill 必须具备独立触发场景、独立输出契约、至少三个可重复用例和 eval 覆盖。
