# Loop Recipes

Loop Recipes 是 AI Builder OS 的运行协议层，用来描述可重复、可验证、可停止的工作循环。它们不是第 9 个核心 skill，也不是自动调度系统。

## Role

- Router 判断什么时候需要进入 loop。
- Skills 负责生成具体资产。
- Harness 约束执行纪律。
- Memory 记录资产、决策和证据。
- Eval 检查 loop 是否退化。

## Rules

- Loop 必须有触发条件、上下文来源、步骤、输出、停止条件和人工确认点。
- Loop 不能无限执行。
- Loop 不应自动删除、部署、提交、推送或修改生产数据。
- 不可验证任务不进入自动 loop。
- 高风险动作必须停在 human approval gate。

## Recipes

| Recipe | Purpose |
| --- | --- |
| `recipes/artifact-hygiene.loop.md` | 对项目资产做周期盘点、一致性审计和清理提案 |
| `recipes/grill-decision.loop.md` | 在产出 frame、spec、prototype 或 agent task 前解析关键决策树和阻塞问题 |
