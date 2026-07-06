---
name: craft-spec
description: "Spec shaping when PRD, Mini Spec, Eng Request, or Requirements is needed, fails when acceptance criteria or audience are absent."
disable-model-invocation: false
can-invoke: [discover-research, manage-file]
paths: ["30_Projects/**", "40_Content/**"]
status: draft
owner_agent: researcher
shared_with: [builder]
scope: project
grade: P0
---

# craft-spec

<!-- P0 实现范围：见蓝图 §2.21 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Invocation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.0-craft-spec -->
- Invoke when the requested deliverable is PRD, Mini Spec, Engineering Request, or Requirements.
- Use after enough intent, audience, scope, and evidence exist to write a bounded spec.
- If research evidence is missing for key claims, call `discover-research` before drafting.

## Steps
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-craft-spec -->
1. Select profile and audience. Completion: lite/standard/ultra and human/agent/dual are explicit.
2. Fill goal, scope, non-goals, acceptance criteria, constraints, and evidence. Completion: no required spec slot is empty.
3. Attach citations and source-of-truth links. Completion: every non-obvious claim points to source or is labeled assumption.
4. Prepare handoff notes. Completion: Builder/Reviewer can identify inputs, outputs, risks, and open questions.

## Reference
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- `docs/vnext-blueprint.md §2.21` for `craft-spec` P0 frontmatter and trigger.
- `vnext/references/skill-authoring.md §4.1` for completion criteria.
- `docs/vnext-blueprint.md §2.23-Output` for Output Packet metadata and citations.

## Completion Criteria
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-craft-spec -->
- Spec contains acceptance criteria that a Reviewer can pass/fail.
- Scope, non-goals, audience, constraints, and citations are present.
- Open questions are explicit and do not block stated acceptance criteria unless marked blocking.

## Failure Modes
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- Signal: "write a spec" output with goals but no acceptance criteria.
- Signal: human-facing prose only when Builder needs agent-readable constraints.
- Signal: duplicating rules already owned by blueprint, ADR, or source-of-truth map.
- Signal: citations omitted for externally sourced claims.

<!-- VERIFICATION: skeleton-of-skeleton Step A - Skill file, 9 frontmatter fields + grade, 5 sections, 0 business content -->
