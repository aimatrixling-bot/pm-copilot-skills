# Artifact Cleanup Policy

本策略定义 AI Builder OS 中哪些资产可以清理、哪些应归档、哪些禁止删除。默认原则是：AI 只能提出 cleanup proposal，不能自动删除高风险资产。

## Default Rule

清理前必须先输出 proposal，并把每个候选项分为：

```yaml
cleanup_proposal:
  safe_to_delete:
    - path:
      reason:
  archive_instead:
    - path:
      reason:
  needs_human_decision:
    - path:
      question:
  do_not_touch:
    - path:
      reason:
```

## 可进入清理候选

以下资产可以进入 `safe_to_delete` 或 `needs_human_decision`，但仍需先提案：

- 未登记且不被任何 `current` 资产引用的临时文件。
- 已被 `superseded` 且没有决策、验收、复盘价值的重复草稿。
- 已被 Evidence Packet 摘要覆盖、且无需复现的原始日志或命令输出。
- 失败实验脚本、一次性 HTML、临时分析稿、重复导出文件。
- 空文件、断裂链接文件、无来源说明且无人引用的孤立资产。
- 超过项目约定保留期的 `temp` 资产。

## 应归档而不是删除

以下资产默认进入 `archive_instead`：

- 被新版本替代但曾作为 `current` 的 Spec、Prototype、Agent Task Packet 或 Review。
- 解释关键取舍的旧稿。
- 支撑 Evidence Packet、Decision Record 或 Release Gate 的原始材料。
- 失败实验中包含可复用教训或反例的材料。
- 用户曾明确要求保留的历史版本。

## 禁止自动删除

以下资产必须进入 `do_not_touch`：

- `current` 资产。
- Decision Record 和 decision log。
- 与发布、验收、合规、安全、权限、审计相关的 Evidence。
- 被其他 `current` 资产通过 `depends_on`、`derived_from` 或 `evidence_refs` 引用的文件。
- 用户明确标记 `keep` 的资产。
- 无法确认用途但可能影响业务判断的文件。

## 高风险动作

以下动作必须停止并要求人工确认：

- 删除目录。
- 批量删除。
- 删除代码、脚本、HTML、测试或配置文件。
- 删除任何 `current`、`archived`、`keep` 或被引用资产。
- 修改 artifact index 以掩盖真实文件缺失。

## Cleanup Evidence

每次 cleanup proposal 至少要说明：

- 扫描范围。
- 判定依据。
- 受影响路径。
- 是否有下游引用。
- 推荐动作。
- 未确认风险。

如果没有足够证据判断，结论必须是 `needs_human_decision`，不能假设安全。
