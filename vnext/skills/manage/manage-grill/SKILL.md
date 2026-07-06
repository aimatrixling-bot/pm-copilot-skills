---
name: manage-grill
description: "Progressive Disclosure when ambiguity blocks routing or scoping, fails when questions assume the goal or exceed scope."
disable-model-invocation: false
can-invoke: []
paths: []
status: draft
owner_agent: supervisor
shared_with: [researcher, builder, reviewer, evolver]
scope: project
grade: P0
---

# manage-grill

<!-- P0 实现范围：见蓝图 §2.21 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Invocation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.0-manage-grill -->
- Invoke when a specific ambiguity blocks routing, scoping, acceptance, owner selection, or safe execution.
- Use after `manage-prompt` or Supervisor identifies the blocking decision; do not grill merely because input is imperfect.
- Ask only the questions needed to produce a routeable Context Pointer or explicit blocker.
- Do not solve the task, select the user's goal for them, or loop after routing becomes possible.

## Steps
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-manage-grill -->
1. Identify the specific ambiguity blocking routing or scope. Completion: the blocking decision (`goal`, `scope`, `agent`, `constraint`, or `context`) is named; vagueness without a blocking decision does not trigger grilling.
2. Draft questions that probe one assumption each. Completion: every question targets a stated assumption, is answerable in one phrase, and does not bundle two questions.
3. Ask in batches the user can actually answer. Completion: questions are ordered by blocking priority, the batch size fits the user's turn, and convergence signal is defined before sending.
4. Converge or escalate. Completion: either the user's answers remove the blocking ambiguity and produce a restated goal, or the ambiguity is reported back to `manage-prompt` as unresolvable without user direction.
5. Re-batch only when new blocking ambiguity appears. Completion: one additional batch is asked only if the new ambiguity still blocks routing; otherwise route with the caveat.

## Reference
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- `docs/vnext-blueprint.md §2.20` defines Supervisor responsibility for ask/grill, ambiguity handling, and routing.
- `docs/vnext-blueprint.md §2.21` defines `manage-grill` as the P0 clarification Skill.
- `docs/vnext-blueprint.md §2.23` defines Intent Packet fields such as `probe_depth`, routing, and Output Packet next actions.
- `docs/vnext-blueprint.md §2.24` defines Progressive Disclosure, Context Pointer, Completion Criterion, and failure-mode diagnostics.
- `docs/vnext-blueprint.md §2.25.1` fixes the P0 vNext directory and Skill authoring discipline.
- `docs/vnext-blueprint.md §2.26` covers GT-01, where `manage-grill` resolves ambiguity before `craft-agent-task`.
- `vnext/references/skill-authoring.md §4.1` defines completion criteria discipline; §8 defines premature completion diagnostics.

## Completion Criteria
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-manage-grill -->
- Frontmatter keeps the 9 required Skill fields plus `grade`, with `owner_agent: supervisor`, `can-invoke: []`, `scope: project`, and `shared_with` excluding the owner.
- Description starts with `Progressive Disclosure`, follows `X when Y, fails when Z`, and stays one sentence under 200 characters.
- All five SECTION headings remain in order and keep `SECTION_REF` anchors to existing blueprint sections.
- Every step has a `Completion:` criterion, and the grill sequence identifies a blocker, asks single-assumption questions, defines convergence, and stops after route or escalation.
- Deletion Test remains Lose: no other P0 Skill owns turning blocking ambiguity into user-provided routing evidence.

## Failure Modes
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- Signal: Endless Probe - keeps asking questions past the point where a routing decision or explicit blocker is available.
- Signal: Leading Question - question phrasing assumes the answer or narrows the user's options unfairly.
- Signal: Premature Routing - gives up on grilling before the blocking ambiguity is resolved or explicitly escalated.
- Signal: Solve-While-Grilling - answers the question for the user or slips a solution into the clarification prompt.
