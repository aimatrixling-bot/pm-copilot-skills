# Evidence Packet Schema

Evidence Packet 用于防止假完成。
可复制输出格式见 `templates/evidence-packet/template.md`。

```yaml
artifacts:
commands_run:
command_outputs:
screenshots:
manual_checks:
interaction_smoke:
mapping_evidence:
freshness:
missing_evidence:
open_risks:
completion_claim: PASS | PARTIAL | BLOCKED
```

## 完成声明规则

- `PASS`：必要检查已经运行或人工验证，且没有阻塞风险。
- `PARTIAL`：已有有用产出，但仍有部分验证或范围缺口。
- `BLOCKED`：缺少用户决策或外部变化，无法继续推进。

没有证据，就不能给 `PASS`。
旧日志、旧截图、agent self-report 或 validator-only proof 不能单独构成 `PASS`。
