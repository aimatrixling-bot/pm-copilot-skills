---
name: craft-prototype
description: "Progressive Disclosure when a spec or PRD must become a runnable minimal scaffold, fails when starter reuse, run evidence, or scope boundary is missing."
disable-model-invocation: false
can-invoke: [manage-file]
paths: ["30_Projects/**/_sandbox/**", "**/prototype/**"]
status: draft
owner_agent: builder
shared_with: [researcher]
scope: project
grade: P0
---

# craft-prototype

<!-- P0 实现范围：见蓝图 §2.21 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Invocation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.0-craft-prototype -->
- Invoke when an accepted spec, PRD, Engineering Request, or scoped user request must become a runnable minimal project scaffold.
- Use for first executable shape: starter selection, project skeleton, stub implementation, mock-only data seams, and run evidence.
- Do not use for textual spec writing, production hardening, high-fidelity UI polish, commit creation, or code review; route those to `craft-spec`, later build work, `build-commit`, or `review-code`.
- Prefer existing project patterns or mature starters before creating custom structure, and keep every addition traceable to the source spec.
- Deletion Test: without `craft-prototype`, Builder loses the P0 bridge from accepted spec to executable evidence.

## Steps
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-craft-prototype -->
1. Bound the prototype slice from the spec. Completion: source spec path or artifact, target user flow, first screen or entrypoint, non-goals, and acceptance evidence are written before code changes.
2. Select reuse path before scaffolding. Completion: existing repo pattern, mature starter, or no-starter decision is named with one reason; duplicate scaffold work is rejected when a usable starter exists.
3. Place the scaffold deliberately. Completion: target directory is inside `paths`, `manage-file` is invoked when placement, naming, or versioning needs a decision, and no unrelated project path is touched.
4. Build the minimal runnable skeleton. Completion: entrypoint, route or command surface, stub components/services, synthetic mock data, and visible not-yet-implemented seams match the bounded slice.
5. Verify the scaffold runs. Completion: exact install/start/test command, observed output or URL, and any failing caveat are recorded; "looks plausible" is not accepted as run evidence.
6. Package the handoff. Completion: changed files, run command, starter choice, spec coverage, known gaps, and next skill (`build-commit` or `review-code`) are listed for downstream use.

## Reference
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- `docs/vnext-blueprint.md §2.20` assigns prototype and application delivery to Builder.
- `docs/vnext-blueprint.md §2.21` defines `craft-prototype` as the P0 bridge from spec to runnable prototype output.
- `docs/vnext-blueprint.md §2.26` covers GT-03 and GT-07, where prototype output must include run evidence and remain tied to spec.
- `vnext/references/skill-authoring.md §4.1` requires sharp completion criteria; §8 names Premature Completion, Variance, Context Pointer Miss, and Bloat diagnostics.
- `C:\Users\max.ling\.claude\rules\common\patterns.md` requires checking mature starters/scaffolds before new-project work.
- `C:\Users\max.ling\.claude\rules\common\testing.md` frames prototype verification as pragmatic run evidence rather than full coverage.

## Completion Criteria
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-craft-prototype -->
- Frontmatter keeps the 9 required Skill fields plus `grade`, with `status: draft`, `grade: P0`, `owner_agent: builder`, and `shared_with` excluding the owner.
- Description starts with `Progressive Disclosure`, follows `X when Y, fails when Z`, and stays one sentence under 200 characters.
- All five SECTION headings remain in order and keep `SECTION_REF` anchors to existing blueprint sections.
- Every step has a `Completion:` criterion, and the prototype has a bounded spec source, reuse decision, scoped path, runnable skeleton, run evidence, and handoff notes.
- Deletion Test remains Lose: no other P0 Skill owns conversion from accepted spec to executable scaffold evidence.

## Failure Modes
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- Signal: Spec Drift - scaffold screens, routes, or stubs cannot be traced back to the accepted spec or stated non-goals.
- Signal: Scaffold Rebuild - custom project structure is created while an existing repo pattern or mature starter would satisfy the slice.
- Signal: Premature Optimization - state management, auth, persistence, deployment, or polish is added before the minimal runnable slice needs it.
- Signal: Verification Gap - Builder reports completion without exact run command, observed output, URL, or failure caveat.
- Signal: Scope Creep - prototype includes user flows, features, data models, or visual fidelity not requested by the spec.
