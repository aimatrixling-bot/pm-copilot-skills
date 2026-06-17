# Output Packet Schema

Output Packet 用于让一个 Builder skill 把有用上下文交给下一个 skill 或 agent。

```yaml
artifact_path:
artifact_type:
key_decisions:
open_assumptions:
next_skill_hint:
handoff_context:
evidence_packet:
status: draft | ready_for_review | accepted | blocked
```

## 规则

- 当产物真实存在时，使用路径引用。
- `key_decisions` 只保留下游不能丢失的少数关键选择。
- 未经 review 或用户明确确认前，不要标记为 `accepted`。
