---
name: memory-index
type: index
status: draft
---

# Memory Index

<!-- P0 实现范围：见蓝图 §2.22 + §2.25.1 -->
<!-- 终态封顶：见蓝图 §2.26.3 -->

## Purpose
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.22 -->
- `vnext/memory/` 是 P0 schema 目录，用于持久 Memory 分类。
- 它区分用户偏好、反馈修正、项目状态和参考证据。
- 本索引（index）仅路由（routing）schema 使用；Step C 不在此存放实际 memory entry。

## Inventory
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.25.1 -->
- `user.schema.md` — 稳定用户偏好和沟通模式。
- `feedback.schema.md` — 对 AI 输出的修正和明确反馈。
- `project.schema.md` — 已验证的项目状态、决策、里程碑和验证证据。
- `reference.schema.md` — 研究来源、已验证链接和持久 reference 路径。

## Shared Fields
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.22 -->
- 所有 Memory schema 都要求 `id`、`type`、`scope`、`status`、`source`、`confidence`、`last_verified`、`detail_ref` 和 `content`。
- `content` 是一行摘要；更长上下文必须移动到 `detail_ref` 目标。
- 同主题写入必须合并或取代已有 memory，而不是创建重复项。
- `global` 范围（scope）写入在持久化前需要显式人类确认。

<!-- VERIFICATION: skeleton-of-skeleton Step A - Index file, 3 sections, 0 business content -->
