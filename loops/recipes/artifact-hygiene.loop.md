# Artifact Hygiene Loop

## Purpose

Artifact Hygiene Loop 用于周期性检查项目资产是否登记、可信、过期、可归档或互相冲突。它只输出审计报告、index update proposal 和 cleanup proposal；不自动删除文件。

## Trigger

- 重要里程碑结束。
- 生成新的 `current` Spec、Prototype、Agent Task Packet、Review Report 或 Decision Record 后。
- 项目交接前。
- 用户要求清理项目资产。
- 文件数量明显膨胀，且下游 agent 不知道该读取哪个资产。

## Entry Conditions

- 已能定位项目根目录。
- 已读取 `memory/schemas/artifact-index.schema.md`。
- 已读取以下策略：
  - `memory/policies/artifact-lifecycle-policy.zh.md`
  - `memory/policies/artifact-cleanup-policy.zh.md`
  - `memory/policies/artifact-consistency-policy.zh.md`
  - `harness/artifact-write-policy.zh.md`

## Context Sources

- `.ai-builder/artifact-index.yaml`，如项目已初始化。
- 当前项目中的 Spec、PRD、Prototype Mapping、Agent Task Packet、Review Report、Decision Record。
- Evidence Packet、run report、manual checks。
- 代码、脚本、HTML、截图、日志和临时分析文件。

## Steps

1. 读取 artifact index；如果不存在，只生成初始化建议，不假装已有治理状态。
2. 扫描当前任务相关资产，不做全盘大范围删除。
3. 对登记资产检查路径是否存在、状态是否合法、是否有来源和依赖。
4. 对未登记资产判断是否应登记、归档、保留为临时文件或进入 cleanup proposal。
5. 根据 source-of-truth 链执行一致性审计。
6. 输出 `PASS`、`PARTIAL`、`FAILED` 或 `BLOCKED`。
7. 输出 index update proposal。
8. 输出 cleanup proposal。
9. 如果存在高风险清理、source-of-truth 冲突或业务判断缺口，停止并请求人工决策。

## Output Contract

```yaml
artifact_hygiene_report:
  result: PASS | PARTIAL | FAILED | BLOCKED
  scanned_scope:
    - path:
  index_findings:
    - artifact_id:
      issue:
      recommended_update:
  consistency_findings:
    - severity: P0 | P1 | P2 | P3
      issue:
      evidence:
      recommended_fix:
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
  next_action:
```

## Stop Conditions

- 需要删除或覆盖 `current`、`keep`、Decision Record、Evidence 或被引用资产。
- 同一范围存在多个冲突的 `current` 资产。
- Evidence 声称 PASS 但缺少可复验证据。
- 扫描范围过大，可能造成上下文或时间预算失控。
- 需要业务、合规、安全或发布判断。

## Budget Guard

默认只扫描当前项目、当前里程碑或用户指定路径。需要全仓库盘点时，应先输出 Plan，让用户确认范围和成本。
