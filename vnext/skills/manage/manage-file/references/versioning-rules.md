---
title: Versioning Rules — Active vs Archive Snapshot
type: reference
scope: branch-specific
status: active
owner_skill: manage-file
related_blueprint_sections: [§2.21, §2.24]
---

# Versioning Rules — Active vs Archive Snapshot

## 1. State Markers

- **Active**: no date suffix; current source of truth, such as `prd.md` or `decision-log.md`.
- **Iteration**: `-vN` suffix; intermediate evolution of an active file, such as `draft-v1.md` or `prd-v2.md`.
- **Snapshot**: `-yyyymmdd` or `-YYYY-MM-DD` suffix; archive or export snapshot that is read-only in normal work, such as `kb-report-20260701.md`.
- **Archive（90_Archive/）**: complete project archive used for provenance lookup only.

At one time, only one active `-vN` version is allowed for the same artifact.

## 2. When to Bump Version

- Substantive changes bump `vN`: section additions/removals, decision revisions, or structural adjustments.
- Polish, typo fixes, formatting, and one-line wording changes do not bump `vN`.
- If uncertain, use the reader-impact test: when the diff changes understanding, bump; when it only changes presentation, do not bump.

## 3. When to Snapshot

- After a `40_Content/` article is published.
- At project closeout or release milestones.
- For periodic outputs such as KB health reports and audit reports.
- Write snapshots to `90_Archive/` or to the same directory with a date suffix; keep the active file unchanged.

## 4. Conflict Resolution

- If unsuffixed active and `-vN` coexist, treat the unsuffixed file as active and `-vN` as history.
- If `-v1` and `-v2` both appear active for the same artifact, reject the operation; parallel active versions are not allowed.
- If a snapshot is mistaken for active, trigger manage-file Failure Mode "Conflict Blindness".

## 5. Non-Goals

- Do not require a version bump for every edit.
- Do not introduce Git tags; that belongs to git workflow.
- Do not use semantic versioning for knowledge files; semver is for code packages.
