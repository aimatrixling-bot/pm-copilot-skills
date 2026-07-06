---
name: build-commit
description: "Context Pointer when verified worktree changes must become scoped commits, fails when staging, message, hooks, or push authorization drift."
disable-model-invocation: false
can-invoke: []
paths: ["**"]
status: draft
owner_agent: builder
shared_with: [supervisor]
scope: project
grade: P0
---

# build-commit

<!-- P0 实现范围：见蓝图 §2.21 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Invocation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.0-build-commit -->
- Invoke after code, document, or vNext asset changes have review/self-check evidence and need one or more local commits.
- Use for working tree inspection, commit split planning, exact staging, conventional message drafting, hook-respecting commit execution, and post-commit reporting.
- Do not use for push, rebase, force operations, branch deletion, release tagging, or broad cleanup unless the user explicitly authorizes that separate action.
- Treat dirty worktrees as normal: preserve unrelated user files and untracked assets unless they are named in the commit plan.
- Deletion Test: without `build-commit`, Builder loses the P0 closeout step that turns verified changes into auditable history.

## Steps
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-build-commit -->
1. Inspect working tree and base context. Completion: current branch, `git status --short`, relevant diff/stat, and known untracked files are recorded before staging.
2. Decide commit boundaries by single purpose. Completion: each planned commit has one concern, file list, and rationale; mixed feat/fix/refactor/docs changes are split or explicitly justified.
3. Screen for staging leaks. Completion: `.env`, secrets, credentials, generated archives, large binaries, unrelated user changes, and broad wildcard paths are checked before `git add`.
4. Stage exact paths only. Completion: staged paths come from the approved file list, and `git diff --cached --name-only` matches that list before commit.
5. Write a compliant commit message. Completion: subject follows the local type/scope convention, names the behavior or artifact changed, and avoids generic "update" wording.
6. Commit without bypassing hooks. Completion: commit succeeds with hash, or hook failure is reported with command output and next fix path; `--no-verify` is not used.
7. Report local-only outcome. Completion: commit hash, files committed, checks run, remaining untracked files, and push status are explicit; no remote push is performed without authorization.

## Reference
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- `docs/vnext-blueprint.md §2.20` assigns implementation and git closeout work to Builder.
- `docs/vnext-blueprint.md §2.21` defines `build-commit` as the P0 git closeout Skill after review or self-check.
- `docs/vnext-blueprint.md §2.23` defines Output Packet evidence expectations such as command output, commit hash, and next actions.
- `docs/vnext-blueprint.md §2.26` uses `build-commit` in GT-03, GT-05, and GT-07 as the auditable handoff point.
- `C:\Users\max.ling\.claude\rules\common\git-workflow.md` defines local commit message types and PR workflow boundaries.
- `C:\Users\max.ling\.claude\rules\common\security.md` requires secret checks before commit.
- `C:\Users\max.ling\.claude\rules\common\coding-style.md` reinforces exact, request-traceable modifications.

## Completion Criteria
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-build-commit -->
- Frontmatter keeps the 9 required Skill fields plus `grade`, with `status: draft`, `grade: P0`, `owner_agent: builder`, `can-invoke: []`, and `shared_with` excluding the owner.
- Description starts with `Context Pointer`, follows `X when Y, fails when Z`, and stays one sentence under 200 characters.
- All five SECTION headings remain in order and keep `SECTION_REF` anchors to existing blueprint sections.
- Every step has a `Completion:` criterion, and the commit path proves exact status inspection, single-purpose boundary, leak screening, exact staging, hook-respecting commit, and local-only report.
- Deletion Test remains Lose: no other P0 Skill owns the verified-change-to-commit transition.

## Failure Modes
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- Signal: Mixed Concern - one commit combines unrelated feature, fix, refactor, docs, or generated-output changes.
- Signal: Message Drift - commit subject omits type/scope intent, uses vague "update" wording, or misstates the changed behavior.
- Signal: Staging Leak - `.env`, secrets, large binaries, generated archives, or unrelated user files enter the index.
- Signal: Hook Bypass - `--no-verify`, disabled hooks, or ignored pre-commit failures are used to force history forward.
- Signal: Unauthorized Push - local commit work silently expands into push, tag, branch deletion, or remote mutation without explicit user authorization.
