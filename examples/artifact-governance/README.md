# Artifact Governance 端到端样例

本目录展示当前 AI Builder OS 项目中 Artifact Governance 协议的最小闭环：

```text
builder-agent-task
  -> Output Packet
  -> builder-review
```

样例基于当前项目真实的 Milestone 3A/3B/3C：

- Milestone 3A：新增 Artifact Eval Validator，并接入 `validate:builder-os`。
- Milestone 3B：让 `builder-review` 在评审交付物时引用 Artifact Hygiene Loop。
- Milestone 3C：让 `builder-agent-task` 的 Output Packet 包含 `artifact_index_update_proposal`。

## 文件

- `agent-task-packet.example.md`：示例任务包，展示如何要求执行 agent 产出 artifact index 更新提案。
- `output-packet.example.md`：示例执行结果，展示 Output Packet 如何报告产物和 index proposal。
- `review-report.example.md`：示例评审报告，展示 `builder-review` 如何引用 Artifact Hygiene Loop 做轻量审计。

## 使用边界

- 这些文件是示例，不是实际执行记录。
- 示例中的 `artifact_index_update_proposal` 不是已写入状态。
- 示例中的 `cleanup_proposal` 不是删除授权。
- 本样例不新增第 9 个 core skill。
- 本样例不实现 CLI、扫描器、自动删除、自动迁移或自动归档。

## Source-of-truth 链

本样例默认遵循以下 source-of-truth 顺序：

```text
skill / packet schema
  -> artifact policy / loop recipe
  -> eval cases / validator
  -> examples
```

如果示例和上游协议冲突，应以上游协议为准，并更新示例。
