---
name: craft-spec
description: "Information Hierarchy when PRD, Mini Spec, Eng Request, or Requirements is needed, fails when audience, acceptance criteria, or source boundaries are absent."
disable-model-invocation: false
can-invoke: [discover-research, manage-file]
paths: ["30_Projects/**", "40_Content/**"]
status: draft
owner_agent: researcher
shared_with: [builder, reviewer]
scope: project
grade: P0
---

# craft-spec

<!-- P0 实现范围：见蓝图 §2.21 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Invocation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.0-craft-spec -->
- Invoke when the deliverable must become a PRD, Mini Spec, Engineering Request, or Requirements document.
- Use after enough intent exists to choose audience, profile, scope, and source boundaries; if key evidence is missing, invoke `discover-research` before drafting.
- Do not use for runnable prototypes, code changes, or review findings; route those to `craft-prototype`, `build-commit`, or `review-doc`.
- Deletion Test: without `craft-spec`, the PM-to-Builder/Reviewer handoff loses a stable spec shape and acceptance boundary.

## Steps
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-craft-spec -->
1. Select profile and audience. Completion: profile (`lite`, `standard`, or `ultra`) and audience (`human`, `agent`, or `dual`) are written before content drafting begins.
2. Establish source boundaries. Completion: source-of-truth files, citations, assumptions, and blocked unknowns are listed; unsupported claims are marked as assumptions or routed to `discover-research`.
3. Fill required spec slots. Completion: goal, user/context, scope, non-goals, requirements, constraints, acceptance criteria, risks, and open questions each have content or explicit `N/A`.
4. Shape the information hierarchy. Completion: human-facing rationale, agent-readable instructions, and evidence/citation blocks are separated so Builder and Reviewer can scan without reinterpretation.
5. Attach handoff notes and file placement. Completion: target path or document is identified, next agent is named, residual risks are explicit, and `manage-file` is used when creation, movement, or versioning is needed.

## Reference
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- `docs/vnext-blueprint.md §2.21` defines `craft-spec` as the P0 spec-writing Skill with `discover-research` and `manage-file` as allowed invocations.
- `docs/vnext-blueprint.md §2.20` assigns spec and research work to Researcher and downstream handoff to Builder/Reviewer.
- `docs/vnext-blueprint.md §2.24.2` defines Information Hierarchy, Steps, Completion Criterion, Progressive Disclosure, and Leading Word.
- `vnext/references/skill-authoring.md §3` is the frontmatter source of truth; §4.1 defines step completion criteria; §8 lists failure modes; §9 is the pre-submit checklist.
- Related P0 assets: `discover-research` supplies evidence, `manage-file` handles placement/versioning, and `review-doc` checks the finished document.

## Completion Criteria
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-craft-spec -->
- Frontmatter keeps the 9 required Skill fields plus `grade`, with `status: draft`, `grade: P0`, `owner_agent: researcher`, and `scope: project`.
- Description starts with the listed leading word `Information Hierarchy`, follows `X when Y, fails when Z`, and stays one sentence under 200 characters.
- All five SECTION headings remain in order and keep `SECTION_REF` anchors to existing blueprint sections.
- Every step has a `Completion:` criterion, and the produced spec has profile, audience, source boundaries, required slots, citations, and handoff notes.
- Deletion Test remains Lose: no other P0 Skill owns spec creation from intent/evidence into an acceptance-ready handoff.

## Failure Modes
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- Signal: Premature Completion - spec is marked ready while acceptance criteria, source boundaries, or blocking questions are still missing.
- Signal: Variance - profile or audience is not chosen first, causing repeated runs to produce different spec shapes.
- Signal: Context Pointer Miss - citations or source-of-truth files are named vaguely, absent, or impossible for the next agent to load.
- Signal: Bloat - branch-specific business rules are copied into this Skill instead of staying in project specs, ADRs, or references.
- Signal: Handoff Drift - Builder or Reviewer cannot identify next action, target file, residual risk, or pass/fail criteria from the spec.
