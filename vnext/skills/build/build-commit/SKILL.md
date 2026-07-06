---
name: build-commit
description: "Commit discipline when verified changes need commit, fails when staging is broad or hooks are bypassed."
disable-model-invocation: false
can-invoke: [manage-file]
paths: ["**"]
status: draft
owner_agent: builder
shared_with: []
scope: project
grade: P0
---

# build-commit

<!-- P0 实现范围：见蓝图 §2.21 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Invocation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.0-build-commit -->
- Invoke only after code or docs changes are reviewed or self-checked and verification evidence exists.
- Use for targeted staging, commit message creation, hook handling, and post-commit reporting.
- Do not use for publishing, tagging, release, or broad cleanup unless explicitly requested.

## Steps
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-build-commit -->
1. Inspect status and diff scope. Completion: intended files are separated from unrelated user changes.
2. Stage only intentional paths. Completion: `git diff --cached --name-only` matches the intended file list.
3. Write a conventional commit message tied to behavior or docs changed. Completion: subject is specific and not a generic "update".
4. Run commit and respect hooks. Completion: commit hash exists or hook failure is reported with root-cause next step.

## Reference
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- `docs/vnext-blueprint.md §2.20-Builder` for Builder commit responsibility.
- `docs/vnext-blueprint.md §2.23-Output` for reporting validation evidence and next actions.
- `vnext/references/skill-authoring.md §8` for premature completion and evidence discipline.

## Completion Criteria
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-build-commit -->
- Staged file list is exact and excludes unrelated worktree changes.
- Commit succeeds with a hash, or failure output is reported without bypassing hooks.
- Final report includes files staged, checks run, commit hash if created, and remaining risks.

## Failure Modes
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- Signal: `git add -A` used without a reviewed path list.
- Signal: `--no-verify` or hook bypass to force a commit.
- Signal: committing unverified changes while saying validation passed.
- Signal: staging unrelated user files from a dirty worktree.

<!-- VERIFICATION: skeleton-of-skeleton Step A - Skill file, 9 frontmatter fields + grade, 5 sections, 0 business content -->
