---
name: manage-prompt
description: "Prompt shaping when input is vague or overloaded, fails when goal, scope, or context remain implicit."
disable-model-invocation: false
can-invoke: []
paths: []
status: draft
owner_agent: shared
shared_with: [supervisor, researcher, builder, reviewer, evolver]
scope: global
grade: P0
---

# manage-prompt

<!-- P0 实现范围：见蓝图 §2.21 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Invocation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.0-manage-prompt -->
- Invoke when user input is vague, overloaded, missing context, or hard for Supervisor to route.
- Use it before `manage-grill` when the likely goal exists but the wording needs structure.
- Output a refined prompt plus a short reason list; do not invent missing facts.

## Steps
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-manage-prompt -->
1. Extract the likely goal, scope, inputs, constraints, and requested output. Completion: each extracted item is either filled from user text or marked as missing.
2. Rewrite the prompt into routeable structure for Supervisor or a target Agent. Completion: the rewritten prompt has goal, context, deliverable, and acceptance checks.
3. List assumptions separately from user-provided facts. Completion: no assumption is phrased as confirmed source truth.
4. Decide whether `manage-grill` is still required. Completion: unresolved ambiguity flags are explicit.

## Reference
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- `vnext/references/skill-authoring.md §2` for invocability and predictable process.
- `vnext/references/skill-authoring.md §4.1` for sharp completion criteria.
- `docs/vnext-blueprint.md §2.20` for Supervisor routing and Intent Packet dependencies.

## Completion Criteria
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-manage-prompt -->
- Refined prompt contains goal, scope, deliverable, constraints, and acceptance checks.
- Assumptions are separated from facts and can be inspected line by line.
- If ambiguity remains, output names the exact `ambiguity_flags` for `manage-grill`.

## Failure Modes
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- Signal: "I assume the user wants..." without marking it as an assumption.
- Signal: polished rewrite that removes constraints or source references.
- Signal: premature completion when goal, scope, or context remain implicit.
- Signal: routing directly to Builder/Reviewer while ambiguity flags are unresolved.

<!-- VERIFICATION: skeleton-of-skeleton Step A - Skill file, 9 frontmatter fields + grade, 5 sections, 0 business content -->
