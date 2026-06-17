# Builder 质量门禁

## 必需门禁

| 门禁 | 检查问题 | 失败处理 |
| --- | --- | --- |
| Intent Gate | 是否知道用户真正想要的结果？ | 回到意图澄清 |
| Scope Gate | 是否知道范围内外分别是什么？ | 执行前先收窄范围 |
| Asset Gate | 是否有明确产物或结果？ | 先定义输出契约 |
| Evidence Gate | 完成状态是否可验证？ | 降级为 `PARTIAL` 或转入 Plan |
| Handoff Gate | 结果是否能被下一步消费？ | 补 Output Packet |

## 规则

如果门禁失败，不要假装完成。应该修复、提问，或报告阻塞条件。
