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
- `vnext/memory/` is the P0 schema directory for durable memory categories.
- It separates user preference, feedback correction, project state, and reference evidence.
- This index only routes schema usage; actual memory entries are not stored here in Step C.

## Inventory
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.25.1 -->
- `user.schema.md` — stable user preferences and communication patterns.
- `feedback.schema.md` — corrections and explicit feedback on AI output.
- `project.schema.md` — verified project state, decisions, milestones, and validation evidence.
- `reference.schema.md` — research sources, verified links, and durable reference paths.

## Shared Fields
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.22 -->
- All memory schemas require `id`, `type`, `scope`, `status`, `source`, `confidence`, `last_verified`, `detail_ref`, and `content`.
- `content` is a one-line summary; longer context must move to the `detail_ref` target.
- Same-topic writes must merge or supersede existing memory rather than creating duplicates.
- Global scope writes require explicit human confirmation before persistence.

<!-- VERIFICATION: skeleton-of-skeleton Step A - Index file, 3 sections, 0 business content -->
