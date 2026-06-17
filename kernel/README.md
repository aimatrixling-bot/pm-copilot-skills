# Builder Kernel

Builder Kernel 定义 AI Builder OS 的共享运行规则。

它不直接写 PRD、不创建原型、不实现代码；它负责定义系统如何理解意图、选择路径、判断 Prompt/Plan/Goal 模式、执行门禁、产出证据，并把工作交接给下一个 skill 或 agent runtime。

## Kernel 职责

- 用 Intent Packet 捕获用户意图。
- 将请求路由到 Prompt、Plan、Goal 或具体 `builder-*` skill。
- 定义 Output Packet、Evidence Packet、Agent Task Packet、Decision Record 的契约。
- 应用质量、假完成、安全、隐私和生产安全门禁。
- 保留中文优先输出规则和假设处理规则。
- 确保每个有意义的结果都能被继续交接。

## 目录结构

```text
kernel/
├── routing/
├── packets/
├── gates/
└── protocols/
```

## 当前规则

Kernel 文件目前是 AI Builder OS 的共享协议源。Milestone 3.1 后，active skill surface 已收敛为 8 个 `builder-*` core skills；旧 `pm-*` 行为保留在 `_archived/pm-copilot-legacy-v1.0/`，作为回滚和方法迁移来源。
