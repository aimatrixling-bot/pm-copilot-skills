---
title: File Decision Record — Optional YAML Template
type: reference
scope: branch-specific
status: active
owner_skill: manage-file
related_blueprint_sections: [§2.21, §2.24]
---

# File Decision Record — Optional YAML Template

## 1. When to Emit

This record is optional. It is suggested only for non-trivial file operations:

- `move`: cross-directory movement.
- `rename`: slug change.
- `version`: active version bump or archive snapshot.
- `archive`: movement into `90_Archive/`.

Do not emit a File Decision Record for create, content edits, or formatting changes.

## 2. Why Optional

Max Brain is a knowledge repository. Requiring YAML for every operation creates Bloat and violates Progressive Disclosure.

The record is useful when multi-file operations, cross-module moves, and archive decisions need replayable rationale.

## 3. Template

```yaml
# Optional File Decision Record — emitted by manage-file
# Trigger: move / rename / version / archive
id: <stable-unique-id>
operation: <move|rename|version|archive>
path_before: <relative-path or null>
path_after: <relative-path>
requester: <agent-name or user>
conflict_decision: <skip|overwrite|merge|rename-target|archive-then-write>
evidence:
  existence_check_before: <yes|no|n/a>
  existence_check_after: <yes>
  diff_or_stat: <one-line summary>
  index_impact: <updated|none|n/a>
rationale: <one-sentence why this operation was chosen>
timestamp: <ISO 8601>
```

## 4. Storage

Do not create a standalone decision-record file.

Store the record in the calling Skill's Output Packet `metadata` field or task evidence.

## 5. Non-Goals

- Do not require a record for every operation.
- Do not create a Decision Record index; that would overlap with `_index.md`.
- Do not replace git log; the record explains why, while git records what changed.
