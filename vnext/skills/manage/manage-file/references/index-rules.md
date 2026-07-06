---
title: Index Rules — _index.md Update Triggers
type: reference
scope: branch-specific
status: active
owner_skill: manage-file
related_blueprint_sections: [§2.21, §2.24]
---

# Index Rules — _index.md Update Triggers

## 1. When _index.md MUST Update

- Creating a top-level file in a module root, project root, or article directory.
- Moving a top-level file to another directory.
- Archiving a top-level file to `90_Archive/`.
- Renaming a top-level file when the slug changes.
- Creating a module subdirectory that should appear in navigation.

## 2. When _index.md Check Is Enough

- After a move, verify existing links still resolve.
- After batch operations involving three or more files, check for navigation drift.
- When a long-stale directory is touched, check whether the index still describes the current contents.

## 3. When _index.md Is NOT Required

- Internal content edits that do not change path or slug.
- `_sandbox/` isolated outputs that are not part of the formal structure.
- Files created inside subdirectories when the parent index only tracks top-level entries.
- Edits inside already archived directories.

## 4. Collaboration Boundary

- **manage-file**: immediate synchronization when create, move, rename, or archive changes navigation.
- **evolve-kb-check**: periodic audit for dead links, orphan files, and index drift; this user skill is not part of vNext P0.
- **evolve-doc-check**: periodic audit for document inconsistency; this user skill is not part of vNext P0.
- Boundary principle: manage-file does not run periodic audits; evolve-* checks do not perform immediate path synchronization.

## 5. Frontmatter for _index.md

Module-level `_index.md` files use `title`, `description`, and `last_updated`.

When an index file changes, update `last_updated` in the same edit.
