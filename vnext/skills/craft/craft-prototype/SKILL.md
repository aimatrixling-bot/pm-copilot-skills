---
name: craft-prototype
description: "Prototype crafting when runnable high-fidelity mock is requested, fails when mock data leaks or handoff is absent."
disable-model-invocation: false
can-invoke: [manage-file, craft-spec]
paths: ["30_Projects/**/_sandbox/**", "**/prototype/**"]
status: draft
owner_agent: builder
shared_with: []
scope: project
grade: P0
---

# craft-prototype

<!-- P0 实现范围：见蓝图 §2.21 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Invocation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.0-craft-prototype -->
- Invoke when the user asks for a high-fidelity, runnable prototype or interactive mock.
- Use only after target user, workflow, visual scope, and mock data boundary are clear enough to build.
- If the request is only conceptual or textual, route to `craft-spec` instead.

## Steps
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-craft-prototype -->
1. Define the prototype slice and user workflow. Completion: first screen, core interaction, and out-of-scope areas are named.
2. Scaffold UI using existing project patterns. Completion: prototype runs locally or has a clear static open path.
3. Add synthetic mock data and interactions. Completion: mock data is isolated and visibly non-production.
4. Write handoff notes. Completion: downstream Builder/Reviewer can find files, run steps, assumptions, and gaps.

## Reference
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- `docs/vnext-blueprint.md §2.20-Builder` for Builder ownership and output contract.
- `docs/vnext-blueprint.md §2.21` for `craft-prototype` paths and P0 scope.
- `vnext/references/skill-authoring.md §8` for bloat and variance failure checks.

## Completion Criteria
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-craft-prototype -->
- Prototype entry file or dev server command is documented and verified.
- Mock data is synthetic, local, and not mixed with production credentials or real records.
- Handoff notes list changed files, run steps, visual scope, and known gaps.

## Failure Modes
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- Signal: screenshot-only delivery when runnable prototype was requested.
- Signal: real customer, patient, financial, or private data in mock fixtures.
- Signal: no run command or entry path for Reviewer.
- Signal: oversized marketing page instead of the requested usable experience.

<!-- VERIFICATION: skeleton-of-skeleton Step A - Skill file, 9 frontmatter fields + grade, 5 sections, 0 business content -->
