---
name: manage-file
description: "File placement when an asset must be created, moved, or versioned, fails when target index or path is unchecked."
disable-model-invocation: false
can-invoke: []
paths: ["**"]
status: draft
owner_agent: shared
shared_with: [supervisor, researcher, builder, reviewer, evolver]
scope: project
grade: P0
---

# manage-file

<!-- P0 实现范围：见蓝图 §2.21 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Invocation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.0-manage-file -->
- Invoke when creating, moving, renaming, indexing, or verifying files and directories.
- Use it before write operations that depend on `_index.md`, source-of-truth maps, or path ownership.
- Calling Agent path permissions still constrain this Skill; `paths: ["**"]` is not blanket authority.

## Steps
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-manage-file -->
1. Resolve the intended target path and ownership boundary. Completion: path is relative, inside allowed scope, and not a v1 frozen file unless explicitly allowed.
2. Read the nearest relevant index or source-of-truth map. Completion: placement reason cites the controlling document or notes no index exists.
3. Apply the file operation with minimal scope. Completion: only intended files are created or edited.
4. Verify existence, content anchors, and index impact. Completion: command output or file diff confirms the write.

## Reference
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- `docs/vnext-blueprint.md §2.25.1` for the vNext P0 file tree.
- `docs/vnext-blueprint.md §2.25.2` for side-by-side coexistence and rollback.
- `vnext/references/skill-authoring.md §5.4` for scope honesty.

## Completion Criteria
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-manage-file -->
- Target path is justified by an index, blueprint section, or explicit user instruction.
- `git diff --check -- <path>` or equivalent whitespace check has no output.
- Created files contain required anchors and no placeholder markers.

## Failure Modes
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- Signal: writing to a convenient path without checking the directory index.
- Signal: touching v1 or blueprint files during a vNext-only task.
- Signal: broad move/delete command built from string-expanded paths.
- Signal: declaring files created without verifying they exist.

<!-- VERIFICATION: skeleton-of-skeleton Step A - Skill file, 9 frontmatter fields + grade, 5 sections, 0 business content -->
