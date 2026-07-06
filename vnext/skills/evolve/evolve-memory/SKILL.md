---
name: evolve-memory
description: "Memory writeback when preference, feedback, project, or reference signal appears, fails when duplicate or unverified memory is written."
disable-model-invocation: false
can-invoke: []
paths: ["**/memory/**", "**/MEMORY.md"]
status: draft
owner_agent: evolver
shared_with: [supervisor, builder, reviewer]
scope: global
grade: P0
---

# evolve-memory

<!-- P0 实现范围：见蓝图 §2.21 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Invocation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.0-evolve-memory -->
- Invoke when a user preference, correction, project state, or research reference should persist beyond the turn.
- Use modes: write, cleanup, merge, archive, and prune.
- Do not write memory for transient task progress, guesses, or unverified impressions.

## Steps
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-evolve-memory -->
1. Classify signal as user, feedback, project, or reference. Completion: chosen type maps to `vnext/memory/*.schema.md`.
2. Check existing memory for the same topic. Completion: duplicate write is rejected or converted to merge/supersede.
3. Validate scope, confidence, source, and detail_ref. Completion: global scope has human confirmation when required.
4. Write, merge, archive, or prune. Completion: resulting memory has schema fields and no orphan long-form content.

## Reference
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- `docs/vnext-blueprint.md §2.22` for common Memory schema and four memory types.
- `vnext/memory/user.schema.md`, `feedback.schema.md`, `project.schema.md`, `reference.schema.md` for type-specific rules.
- `vnext/kernel/iron-law.schema.md` for global scope confirmation and anti-bloat discipline.

## Completion Criteria
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-evolve-memory -->
- Memory entry has id, type, scope, status, source, confidence, last_verified, detail_ref, and content.
- Same-topic prior memory was checked and merge/supersede decision is recorded.
- Content is one-line summary; detail_ref carries extended context when needed.

## Failure Modes
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- Signal: second memory on same topic instead of merge or supersede.
- Signal: global preference written without explicit user confirmation.
- Signal: long narrative stored in content instead of detail_ref.
- Signal: stale source reused without updating last_verified.

<!-- VERIFICATION: skeleton-of-skeleton Step A - Skill file, 9 frontmatter fields + grade, 5 sections, 0 business content -->
