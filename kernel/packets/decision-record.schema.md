# Decision Record Schema

Decision Record 用于保存重要取舍，避免后续在没有新证据时反复争论。

```yaml
decision_mode:
decision_title:
context:
options_considered:
decision:
rationale:
tradeoffs:
risks:
assumptions:
evidence:
reversal_conditions:
owners:
follow_up:
memory_target:
date:
```

## 规则

- 当决策影响架构、范围、产品行为、发布、隐私或长期 workflow 时，应该记录。
- 必须包含被拒绝选项和 reversal conditions。
- 证据不足时，使用 defer_decision，并记录需要补充的证据或 owner。
