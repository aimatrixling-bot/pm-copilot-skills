---
name: manage-prompt
description: "Context Pointer when user input is vague, overloaded, or misrouted, fails when goal, scope, or agent boundary stays implicit."
disable-model-invocation: false
can-invoke: [manage-grill]
paths: []
status: draft
owner_agent: supervisor
shared_with: [researcher, builder, reviewer, evolver]
scope: project
grade: P0
---

# manage-prompt

<!-- P0 实现范围：见蓝图 §2.21 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Invocation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.0-manage-prompt -->
- Invoke when raw user input is vague, overloaded, underspecified, or likely to be routed to the wrong Agent.
- Use before Supervisor dispatch when wording needs a durable Context Pointer rather than immediate execution.
- Do not invent missing facts, solve the task, or hide ambiguity; unresolved blocking ambiguity routes to `manage-grill`.
- Output a compact context pointer that preserves the original wording, restates the goal, bounds scope, and names the receiving Agent or blocker.

## Steps
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-manage-prompt -->
1. Capture raw user input verbatim before mutation. Completion: original phrase, stated goal, named scope hints, and agent routing signal are recorded.
2. Restate goal in one sentence with explicit actor and outcome. Completion: restatement uses user vocabulary, names the single actor, and surfaces the single outcome; multi-goal input is split or flagged.
3. Resolve scope boundaries. Completion: in-scope items, explicit non-goals, and ambiguous edges are listed; ambiguity that cannot be resolved by restatement triggers `manage-grill`.
4. Classify routing signal. Completion: target agent (`supervisor`, `researcher`, `builder`, `reviewer`, or `evolver`) is named with one-line reason, or routed back to user for disambiguation.
5. Produce a Context Pointer output. Completion: restated goal, scope summary, routing decision, and original verbatim anchor are packaged for the receiving Skill or Agent.
6. Hand off grill results when Step 3 invokes `manage-grill`. Completion: grill answers are merged into the Context Pointer and the original restatement is updated, not duplicated.

## Reference
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- `docs/vnext-blueprint.md §2.20` defines Supervisor ownership for intent identification, prompt optimization, and routing.
- `docs/vnext-blueprint.md §2.21` defines `manage-prompt` as the P0 input-quality Skill.
- `docs/vnext-blueprint.md §2.23` defines Intent and Output Packet fields used for routing, evidence, and next actions.
- `docs/vnext-blueprint.md §2.24` defines leading words, Context Pointer, Progressive Disclosure, and failure-mode diagnostics.
- `docs/vnext-blueprint.md §2.25.1` fixes the P0 vNext directory and Skill authoring discipline.
- `docs/vnext-blueprint.md §2.26` covers GT-01, where `manage-prompt` precedes `manage-grill` and `craft-agent-task`.
- `vnext/references/skill-authoring.md §4.1` defines completion criteria discipline; §8 defines premature completion diagnostics.

## Completion Criteria
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-manage-prompt -->
- Frontmatter keeps the 9 required Skill fields plus `grade`, with `owner_agent: supervisor`, `scope: project`, `can-invoke: [manage-grill]`, and `shared_with` excluding the owner.
- Description starts with `Context Pointer`, follows `X when Y, fails when Z`, stays one sentence under 200 characters, and preserves the routing failure mode.
- All five SECTION headings remain in order and keep `SECTION_REF` anchors to existing blueprint sections.
- Every step has a `Completion:` criterion, and the output preserves raw input, single-actor restatement, scope boundary, routing signal, and ambiguity handoff.
- Deletion Test remains Lose: no other P0 Skill owns conversion from raw user wording into a routeable Context Pointer.

## Failure Modes
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- Signal: Hidden Assumption - restatement silently fills gaps the user never stated, without flagging the assumption.
- Signal: Constraint Erasure - stated user constraints such as time, tech stack, scope, role, or source boundary disappear from the Context Pointer.
- Signal: Premature Routing - routes to an Agent before scope or goal is restated, pushing ambiguity downstream.
- Signal: Polish Without Structure - rewrites tone or wording without structuring goal, scope, route, and original anchor.
