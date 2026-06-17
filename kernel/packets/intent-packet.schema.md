# Intent Packet Schema

Intent Packet 用于在选择 skill 或执行模式之前，捕获用户真正想要的结果。

```yaml
want:
user:
context:
constraints:
depth: draft | review | release
output_target:
success_criteria:
known_inputs:
missing_inputs:
recommended_skill:
recommended_mode: prompt | plan | goal | plan_to_goal | skill
```

## 规则

- 去掉过早方案，先捕获底层目标。
- 明确标记假设。
- 如果缺失输入会影响方向，最多问三个问题，或路由到 Plan。
