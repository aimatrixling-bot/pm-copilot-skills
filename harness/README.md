# 执行 Harness（Execution Harness）

执行 Harness 定义 AI Builder OS 工作应如何安全、可验证地运行。

Skill 定义要产出什么；Harness 定义如何避免目标漂移、虚假完成、不安全副作用和不可评审输出。

## 模块

| 模块 | 作用 |
| --- | --- |
| Guides（执行指南） | 执行前明确任务、上下文、范围和最低输出 |
| Sensors（传感器） | 监测范围漂移、Fake UI、Fake Tests 和证据缺失 |
| Gates（门禁） | 在声明完成前强制检查关键决策点 |
| Steering Loop（调向循环） | 当执行偏离目标时调整方向 |
| Tool Policy（工具策略） | 定义默认允许、谨慎使用和需要人工确认的动作 |
| Artifact Write Policy（资产写入策略） | 定义项目资产如何写入、提升、登记和交接 |
| Run Report（运行报告） | 汇总结论、证据、风险和交接信息 |

## 规则

Harness 必须保持轻量。它约束执行过程，不应演变成第二套方法论栈。
