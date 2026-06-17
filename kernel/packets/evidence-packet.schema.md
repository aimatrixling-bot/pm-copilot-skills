# Evidence Packet Schema

Evidence Packet 用于防止假完成。

```yaml
artifacts:
commands_run:
command_outputs:
screenshots:
manual_checks:
interaction_smoke:
mapping_evidence:
open_risks:
completion_claim: PASS | PARTIAL | BLOCKED
```

## 完成声明规则

- `PASS`：必要检查已经运行或人工验证，且没有阻塞风险。
- `PARTIAL`：已有有用产出，但仍有部分验证或范围缺口。
- `BLOCKED`：缺少用户决策或外部变化，无法继续推进。

没有证据，就不能给 `PASS`。
