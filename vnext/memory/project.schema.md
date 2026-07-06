---
name: project
type: memory-schema
status: draft
---

# Memory Schema: project

<!-- P0 实现范围：见蓝图 §2.22 -->
<!-- 终态封顶：见蓝图 §2.26.3 -->

## Purpose
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.22-project -->
- `project` memory 记录项目状态、关键决策、里程碑和验证结果。
- 它是可检索工作记忆，不替代正式 spec、ADR、source-of-truth 文档或变更日志。
- 只有已确认或已验证的状态可写入，不能写入临时猜测。

## Schema
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.22-project -->
- Required: `id`, `type=project`, `scope=project`, `status`, `source`, `confidence`, `last_verified`, `detail_ref`, `content`。
- `content` 应概括项目事实，例如阶段完成、验证门通过、关键约束或决策。
- `detail_ref` 指向项目内证据文件，而不是聊天记录摘要。

## Lifecycle
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.22-project -->
- Builder 或 Supervisor 写入前必须确认该状态已被文件、测试、评审或用户明确确认支持。
- 后续阶段改变同一事实时，旧条目标为 `superseded`，新条目引用替代原因。
- 项目结束、分支废弃或事实过期时归档，不删除历史证据。

## Examples
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.22-project -->
- Synthetic: `content: vNext Step B review closed; non-Skill grade removed; validator passed`。
- Synthetic: `content: P0 manifest 保持 untracked，git 化推迟到 Step D 或发布同步`。
- Reject: `content: 可能快完成了`，因为缺少可验证证据和明确状态。

<!-- VERIFICATION: skeleton-of-skeleton Step A - Memory schema, 4 frontmatter fields, 4 sections, 0 business content -->
