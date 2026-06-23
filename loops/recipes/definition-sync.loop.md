# Definition Sync Loop

## Purpose

Definition Sync Loop 用于在实现过程中和完成前检查定义、任务契约、代码/原型产物与证据是否保持一致。它不自动改写 source of truth，也不自动提升资产状态，只输出漂移判断、同步建议和需要人工确认的问题。

## Trigger

- Agent 实现结果与 Module Execution Pack、Change Contract、Design Brief、Spec 或 Agent Task Packet 不完全一致。
- 实现过程中出现新约束、新缺口、范围变化或概念冲突。
- 长对话、Goal、上下文压缩、跨仓库或跨资产任务需要收束当前事实。
- 分支准备进入 review、merge、release seal 或下一里程碑。
- 用户要求复盘“实现和原定义是否一致”。

## Entry Conditions

- 已有至少一个上游定义资产，例如 Module Execution Pack、Change Contract、Spec、Prototype Brief、Design Brief 或 Agent Task Packet。
- 已有可观察实现结果、diff、prototype artifact、Evidence Packet、截图、测试输出或人工检查记录。
- 已能定位本轮范围和 non-goals。

## Context Sources

- `docs/delivery-kernel.md`
- `templates/module-execution-pack/template.md`
- `templates/change-contract/template.md`
- `templates/branch-state/template.md`
- `templates/definition-drift-check/template.md`
- `loops/recipes/artifact-hygiene.loop.md`
- `memory/policies/artifact-consistency-policy.zh.md`
- 当前任务的 Spec、Design Brief、Prototype Brief、Agent Task Packet、Review Report、Evidence Packet、diff 或截图。

## Change Types

| 类型 | 英文 key | 中文解释 | 默认处理 |
| --- | --- | --- | --- |
| A | `Implementation Adjustment` | 实现细节调整，不改变产品定义或验收结果 | 记录在实现说明或 handoff，不必更新核心定义 |
| B | `Spec Gap` | 原定义缺少必要说明，实现时补了合理默认 | 更新 Execution Pack、Change Contract 或 open questions |
| C | `Requirement Change` | 需求、范围、验收或用户目标发生变化 | 需要明确接受，并同步对应定义资产 |
| D | `Conflict / Contradiction` | 多个定义、实现结果或证据互相冲突 | 停止自动推进，要求人工决策或转 `builder-decision` |

## Steps

1. 绑定本轮 delivery mode：`create`、`improve`、`reframe` 或 `unknown`。
2. 读取原始契约：Module Execution Pack、Change Contract、Spec、Design Brief 或 Agent Task Packet。
3. 读取实现结果和证据：diff、artifact path、测试、截图、manual check 或 Evidence Packet。
4. 对照目标、范围、non-goals、acceptance、verification 和 stop conditions。
5. 把差异归类为 `Implementation Adjustment`、`Spec Gap`、`Requirement Change` 或 `Conflict / Contradiction`。
6. 判断哪些差异需要更新定义资产，哪些只需要记录在 Branch State 或 handoff。
7. 如果涉及资产状态、source-of-truth、归档或清理，交给 Artifact Hygiene Loop 输出 proposal。
8. 输出 Definition Drift Check 和下一步建议。

## Output Contract

```yaml
definition_sync_report:
  delivery_mode: create | improve | reframe | unknown
  source_contracts:
    - path:
      type:
      status:
  implementation_evidence:
    - path:
      evidence_type:
      status:
  drift_findings:
    - type: Implementation Adjustment | Spec Gap | Requirement Change | Conflict / Contradiction
      severity: P0 | P1 | P2 | P3
      finding:
      evidence:
      recommended_sync:
  docs_to_update:
    - path:
      reason:
      update_type: required | proposed | not_now
  rules_to_capture:
    - target: gate | loop | template | skill | eval | none
      rule:
      reason:
  unresolved_gaps:
    - gap:
      owner:
      blocks_next_step: true | false
  decision:
    status: PASS | PARTIAL | BLOCKED | REQUEST_CHANGES
    next_step:
```

## Stop Conditions

- 出现 `Conflict / Contradiction`，且默认判断会改变产品、业务、安全、权限、数据或发布结果。
- 实现结果扩大范围但没有用户确认。
- 需要自动删除、迁移、归档或提升 source-of-truth 资产。
- Evidence 声称通过但缺少可复查证据。
- 当前任务缺少原始契约，无法判断 drift。

## Handoff Rules

- 交给 `builder-review`：附 Definition Drift Check、证据、未验证区域和 required fixes。
- 交给 `builder-spec`：当 drift 暴露出 spec gap 或 requirement change，需要更新 Module Execution Pack / Change Contract。
- 交给 `builder-agent-task`：当下一轮实现需要把同步后的定义转成可执行任务。
- 交给 `builder-decision`：当存在长期取舍、冲突定义或不可逆方向选择。
- 交给 Artifact Hygiene Loop：当涉及 artifact index、source-of-truth、归档或清理 proposal。

## Quality Gates

- 不得把实现结果自动升级为已确认需求。
- 不得把 prototype gaps 自动提升为 requirements。
- 不得用“测试通过”掩盖 scope drift。
- 所有高风险同步只能 proposal-only，必须保留人工确认点。
- 必须区分产品问题、实现问题、证据问题和资产治理问题。
