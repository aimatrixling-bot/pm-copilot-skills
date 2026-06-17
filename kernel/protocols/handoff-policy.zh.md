# 交接协议

每个有意义的 Builder workflow 都应该留下下一步交接信息。

## 最小交接内容

```yaml
current_artifact:
status:
key_decisions:
open_assumptions:
next_skill_hint:
next_action:
evidence:
risks:
```

## 规则

- 交接信息必须短到可以复用。
- 不要把原始聊天历史当作唯一连续性来源。
- 如果稳定产物发生变化，必须包含路径和 review 状态。
