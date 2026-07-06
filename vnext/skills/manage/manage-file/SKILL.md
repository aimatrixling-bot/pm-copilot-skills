---
name: manage-file
description: "Context Pointer when a project asset must be created, moved, renamed, or versioned, fails when path, naming, conflict, or evidence is unchecked."
disable-model-invocation: false
can-invoke: []
paths: ["30_Projects/**", "40_Content/**"]
status: draft
owner_agent: builder
shared_with: [supervisor, researcher, reviewer, evolver]
scope: project
grade: P0
---

# manage-file

<!-- P0 实现范围：见蓝图 §2.21 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Invocation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.0-manage-file -->
- Invoke when a project or content asset must be created, moved, renamed, versioned, indexed, or verified.
- Use before write operations that depend on directory ownership, `_index.md`, source-of-truth maps, naming rules, or rollback safety.
- Treat the requesting Agent's own path authority as an upper bound; this Skill does not grant permission to touch v1, blueprint, or unrelated project files.
- Do not explain shell syntax or filesystem basics; keep branch-specific command details in the task output or disclosed references.

## Steps
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-manage-file -->
1. Classify the file operation. Completion: create, move, rename, version, index, or verify is named, with the requesting Agent and target artifact type.
2. Check path authority and placement rule. Completion: target is relative, inside `paths`, inside the requester scope, and justified by index, blueprint, source map, or explicit user instruction. Consult `references/path-authority-map.md` when sub-path placement is ambiguous or falls outside the standard table.
3. Apply naming and version policy. Completion: filename, extension, slug/date/version marker, and directory conventions are checked before writing. Consult `references/naming-rules.md` and `references/versioning-rules.md` when slug case, date marker, or active/archive state is ambiguous.
4. Detect conflicts and rollback needs. Completion: existing target, duplicate artifact, stale version, and required backup/rename decision are recorded before mutation.
5. Execute the smallest file change. Completion: only the intended path set changes; no broad recursive move/delete or unrelated formatting churn is introduced.
6. Produce evidence after the operation. Completion: existence check, diff/stat, moved-from/moved-to mapping, or index impact is recorded for the caller. For non-trivial operations (move, rename, version, archive), optionally emit a File Decision Record using `references/file-decision-template.md`, and verify `_index.md` update requirement per `references/index-rules.md`.

## Reference
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- `docs/vnext-blueprint.md §2.21` defines `manage-file` as the P0 file/dir operation Skill with no downstream Skill invocation.
- `docs/vnext-blueprint.md §2.25.1` defines the vNext P0 tree; §2.25.2 defines side-by-side coexistence and rollback.
- `docs/vnext-blueprint.md §2.20` shows Researcher, Builder, Reviewer, Supervisor, and Evolver can route work through `manage-file`.
- `vnext/references/skill-authoring.md §5.4` defines scope honesty; §8 names Bloat and Context Pointer Miss as failure modes.
- Keep operation-specific shell commands in task evidence; this Skill owns decision order and acceptance criteria, not a filesystem tutorial.

## Completion Criteria
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-manage-file -->
- Operation type, requester, target path, and placement authority are explicit.
- Path is relative, scoped, and justified by index, blueprint, source map, or user instruction.
- Naming/version/conflict decision is recorded before mutation.
- Result evidence proves the intended path set changed and no unrelated path was touched.
- Any index, manifest, or rollback impact is reported to the caller.

## Failure Modes
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- Signal: Context Pointer Miss - target path cannot be justified by index, source map, blueprint, or explicit user instruction.
- Signal: Boundary Drift - operation touches v1, blueprint, unrelated project, or out-of-scope files during a scoped task.
- Signal: Conflict Blindness - existing file, duplicate artifact, or version collision is overwritten without a recorded decision.
- Signal: Broad Mutation - recursive move/delete, wildcard staging, or generated path list changes more than the intended artifact set.
- Signal: Evidence Gap - caller is told the file operation succeeded without existence, diff/stat, or moved-path proof.
