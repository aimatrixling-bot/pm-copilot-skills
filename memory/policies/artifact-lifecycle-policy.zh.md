# Artifact Lifecycle Policy

本策略定义 AI Builder OS 资产从草稿、工作中、当前可信、被替代、废弃、归档到临时产物的生命周期。它用于约束 Artifact Memory、Output Packet、Evidence Packet 和后续一致性审计。

## 状态定义

| Status | 含义 | 默认处理 |
| --- | --- | --- |
| `draft` | 初稿或未评审产物 | 可继续编辑，不能作为下游唯一依据 |
| `working` | 正在被当前任务使用或修改 | 可被替换，完成前需要 review 或用户确认 |
| `current` | 当前可信版本 | 下游优先读取，不得自动删除 |
| `superseded` | 已被新版本替代 | 默认归档，除非确认为无价值重复稿 |
| `deprecated` | 不再推荐使用，但仍解释历史上下文 | 保留引用，避免后续误用 |
| `archived` | 长期保存但不进入默认上下文 | 仅在追溯或复盘时读取 |
| `temp` | 过程产物、试验文件、临时日志或一次性输出 | 默认可进入 cleanup proposal |

## 状态转换

```text
draft -> working
working -> current
current -> superseded
superseded -> archived
working -> deprecated
temp -> cleanup_candidate
temp -> archived
```

转换规则：

- `draft -> working`：资产进入正式编辑或被当前任务消费。
- `working -> current`：通过 review、Evidence Gate 或用户确认。
- `current -> superseded`：出现新的 `current` 版本，并在 `artifact-index` 中记录 `supersedes`。
- `superseded -> archived`：旧版本仍有决策、验收、历史解释或回滚价值。
- `working -> deprecated`：发现方向不再推荐，但仍需要保留避免重复讨论。
- `temp -> cleanup_candidate`：无下游引用、无决策价值、无复用价值，且已超过保留期。
- `temp -> archived`：虽然是过程产物，但被 Decision、Evidence、Spec 或 Review 引用。

## Promotion Gate

资产提升为 `current` 前必须满足：

- 有稳定路径。
- 有明确 `artifact_type`。
- 有来源说明或上游资产引用。
- 有必要的 Decision 或 Evidence 引用。
- 没有与已知 `current` 资产冲突。
- 如果替代旧资产，必须记录 `supersedes`。

## Demotion Rule

当一个新资产成为同类型、同项目、同范围的 `current` 时，旧 `current` 必须转为 `superseded` 或 `deprecated`，不能同时保留多个互相冲突的 current 入口。

## Stop Conditions

遇到以下情况时，不应自动推进生命周期状态：

- 无法判断两个资产谁是 source of truth。
- 资产涉及生产配置、权限、合规、安全或真实用户数据。
- 用户明确要求保留旧版本。
- 资产被其他 `current` 资产依赖。
- Evidence Packet 不足以证明完成状态。
