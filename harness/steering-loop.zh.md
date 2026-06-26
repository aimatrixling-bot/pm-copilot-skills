# 调向循环（Steering Loop）

多步骤 Builder 工作使用此循环：

```text
Plan -> Act -> Observe -> Check -> Adjust -> Evidence -> Handoff
```

## 调整规则（Adjustments）

- 目标不清楚 -> 回到 Intent Gate；
- 范围过大 -> 回到 Plan；
- 输出薄弱 -> 按 Output Contract 重新执行；
- 动作不安全 -> 请求人工批准；
- 完成无法验证 -> 降级 completion claim；
- 依赖被阻塞 -> 报告证据和停止条件。
