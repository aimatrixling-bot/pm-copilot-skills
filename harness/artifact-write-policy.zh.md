# Artifact Write Policy

本策略定义 AI Builder OS 在创建、修改、提升或交接资产时的写入纪律。它适用于所有 `builder-*` skills、agent task、人工整理和未来 runtime projection；它不是新的核心 skill。

## Before Write

写入任何可复用资产前，必须先明确：

- 本次目标资产是什么。
- 资产类型是什么，例如 `spec`、`prototype`、`agent_task`、`review_report`、`decision_record`、`script`、`html`、`evidence`。
- 目标路径在哪里。
- 初始状态是什么，默认从 `draft`、`working` 或 `temp` 开始。
- 上游来源是什么，例如用户请求、Decision Record、current Spec、Prototype Mapping 或 Agent Task Packet。
- 是否替代已有资产。
- 是否需要 Evidence Packet 或人工确认后才能成为 `current`。
- 保留策略是什么：`keep`、`archive`、`expire` 或 `cleanup_candidate`。

如果这些信息缺失，先输出问题、假设或 Plan，不要直接创建长期资产。

## During Write

写入过程中必须遵守：

- 不创建无来源说明的孤立资产。
- 不把草稿直接标记为 `current`。
- 不让 `temp` 文件成为下游唯一依据。
- 不覆盖已有 `current` 资产，除非明确记录 `supersedes`。
- 不把过程日志、失败实验或一次性分析默认写入长期 memory。
- 涉及生产配置、权限、数据、发布或删除动作时，必须触发人工确认。

## After Write

完成写入后，必须至少给出：

```yaml
artifact_write_report:
  artifact_path:
  artifact_type:
  proposed_status:
  source:
  derived_from:
  supersedes:
  depends_on:
  retention_policy:
  evidence_refs:
  index_update_required: true | false
  next_action:
```

如果当前任务不能直接修改 `artifact-index.yaml`，必须在 Output Packet 或 final report 中给出 index update proposal。

## Promotion Rule

资产提升为 `current` 前必须满足：

- 路径稳定。
- 内容可被下游消费。
- 上游来源清楚。
- scope、non-goals、acceptance criteria 或 completion claim 可追溯。
- 已通过必要 review、Evidence Gate 或用户确认。

## Cleanup Rule

写入任务不能顺手删除资产。发现可清理材料时，只能生成 cleanup proposal，并遵守 `memory/policies/artifact-cleanup-policy.zh.md`。

## Handoff Checklist

交接给下游 skill 或 agent 前，检查：

- 下游应该读取哪个 `current` 资产。
- 哪些资产只是 `draft`、`working` 或 `temp`。
- 哪些旧资产已经 `superseded`。
- 哪些文件需要人工确认后才能清理。
- Evidence 是否足以支撑当前完成声明。
