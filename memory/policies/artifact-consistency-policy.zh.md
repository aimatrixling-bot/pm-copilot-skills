# Artifact Consistency Policy

本策略定义 AI Builder OS 如何检查项目资产之间是否一致。目标不是让文档变重，而是防止旧决策、旧 Spec、原型、Agent Task、代码和 Evidence 互相冲突。

## Source Of Truth Chain

默认可信链路如下：

```text
Decision Record
> current Spec / PRD
> Prototype Mapping
> Agent Task Packet
> Code / Script / HTML Artifact
> Evidence Packet
```

规则：

- Decision Record 记录为什么这样做，以及什么条件下反转。
- current Spec / PRD 定义范围、非目标、验收标准和业务规则。
- Prototype Mapping 证明原型从 Spec 派生，不应引入未经说明的新范围。
- Agent Task Packet 必须继承 Spec 的 scope、non-goals、acceptance criteria 和 verification。
- Code / Script / HTML Artifact 必须能追溯到 Agent Task 或明确的人工任务。
- Evidence Packet 必须证明产物是否达到 PASS、PARTIAL 或 BLOCKED。

## Consistency Checks

一致性审计至少检查：

- `artifact-index` 中登记的路径是否真实存在。
- 实际存在的正式资产是否已登记。
- 同一项目、同一类型、同一范围是否存在多个互相冲突的 `current` 资产。
- `current` 资产是否有来源、依赖、决策或证据引用。
- Agent Task 是否遗漏上游 Spec 的 `scope`、`non-goals`、`acceptance criteria` 或 `verification`。
- Prototype Mapping 是否能追溯到 Spec 或 Design Brief。
- Evidence Packet 是否能支撑 completion claim。
- Decision Record 是否已经反转，但下游资产仍引用旧结论。

## Result Levels

| Result | 含义 | 后续动作 |
| --- | --- | --- |
| `PASS` | 未发现阻塞性冲突，资产链路可继续使用 | 可继续下游任务 |
| `PARTIAL` | 有缺口但不阻塞当前低风险工作 | 记录 fix proposal |
| `FAILED` | 存在 source-of-truth 冲突或关键字段缺失 | 停止依赖该链路推进 |
| `BLOCKED` | 需要人工业务、合规、安全或发布判断 | 请求用户决策 |

## Audit Output

一致性审计输出应包含：

```yaml
consistency_audit:
  result: PASS | PARTIAL | FAILED | BLOCKED
  scanned_sources:
    - path:
  source_of_truth:
    decisions:
      - artifact_id:
    current_spec:
      - artifact_id:
  findings:
    - severity: P0 | P1 | P2 | P3
      artifact_id:
      issue:
      evidence:
      recommended_fix:
  cleanup_proposal_ref:
  next_action:
```

## Stop Conditions

审计发现以下问题时，必须停止并要求人工确认：

- 两个 `current` Spec 对同一业务规则给出相反结论。
- Agent Task 要求执行上游 Spec 明确排除的内容。
- Evidence 声称 PASS，但缺少命令、截图、手工检查或可复验证据。
- 下游代码或原型引入了未被 Spec 或 Decision 覆盖的高风险能力。
- 需要删除或覆盖可能仍有业务价值的资产。
