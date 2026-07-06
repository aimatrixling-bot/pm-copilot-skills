---
name: craft-agent-task
description: "Information Hierarchy when Supervisor decomposes or hands off work, fails when done criteria, owner, or stop conditions are missing."
disable-model-invocation: false
can-invoke: [manage-file]
paths: []
status: draft
owner_agent: supervisor
shared_with: [researcher, builder, reviewer, evolver]
scope: project
grade: P0
---

# craft-agent-task

<!-- P0 实现范围：见蓝图 §2.21 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Invocation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.0-craft-agent-task -->
- Invoke when Supervisor must decompose work or hand off a bounded task to Researcher, Builder, Reviewer, or Evolver.
- Use after routing and clarification have produced enough context to name one owner, one outcome, done criteria, and stop conditions.
- Do not use for human-facing PRD prose, open-ended brainstorming, or multi-owner programs; route those to `craft-spec`, `manage-grill`, or explicit planning first.
- Output an agent-readable task pack that can be replayed without hidden chat dependency.

## Steps
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-craft-agent-task -->
1. Parse source intent into one-page task pack. Completion: source spec, route, or decision is named, the single task outcome is stated, and the owner Agent is identified unambiguously.
2. Define done criteria testable in one observation. Completion: each done criterion is binary, tied to user-visible behavior or artifact, and free of "mostly" or "approximately" wording.
3. Define stop conditions and escalation. Completion: explicit conditions for escalate, abort, or hand-back are listed, each with the trigger and recipient named.
4. Validate task pack schema. Completion: required fields (`id`, `title`, `owner`, `done-criteria`, `stop-conditions`, `source-ref`, `context-pointer`) are present, owner matches `owner_agent`, and any chat context pointer is durable.
5. Hand off task pack via Output Packet. Completion: pack is written to the location the receiving Agent can read, `manage-file` is invoked for placement decisions, and the next Skill or Agent is named.

## Reference
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- `docs/vnext-blueprint.md §2.20` defines Agent contracts, handoff boundaries, and forbidden actions.
- `docs/vnext-blueprint.md §2.21` defines `craft-agent-task` as the P0 Supervisor task-dispatch Skill.
- `docs/vnext-blueprint.md §2.23` defines Output Packet fields such as `content`, `metadata`, `next_actions`, and routing evidence.
- `docs/vnext-blueprint.md §2.24` defines Information Hierarchy, Completion Criterion, Context Pointer, and failure-mode diagnostics.
- `docs/vnext-blueprint.md §2.25.1` fixes the P0 vNext directory and Skill authoring discipline.
- `docs/vnext-blueprint.md §2.26` covers GT-01 and the v1-to-vNext mapping where `builder-agent-task` becomes `craft-agent-task`.
- `vnext/references/skill-authoring.md §4.1` defines completion criteria discipline; §8 defines premature completion diagnostics.

## Completion Criteria
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-craft-agent-task -->
- Frontmatter keeps the 9 required Skill fields plus `grade`, with `owner_agent: supervisor`, `can-invoke: [manage-file]`, `scope: project`, and `shared_with` excluding the owner.
- Description starts with `Information Hierarchy`, follows `X when Y, fails when Z`, and stays one sentence under 200 characters.
- All five SECTION headings remain in order and keep `SECTION_REF` anchors to existing blueprint sections.
- Every step has a `Completion:` criterion, and the task pack includes one owner, binary done criteria, stop conditions, durable source/context pointers, placement decision, and Output Packet handoff.
- Deletion Test remains Lose: no other P0 Skill owns conversion from routed intent into an agent-readable execution task pack.

## Failure Modes
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- Signal: Multi-Owner Pack - pack names two owners or omits owner, allowing accountability drift.
- Signal: Implicit Done - done criterion is vague such as "works", "complete", or "ready", or is not observable.
- Signal: No Stop Condition - pack has no escalate, abort, or hand-back path, forcing the receiving Agent to guess.
- Signal: Hidden Chat Dependency - pack references "the conversation above" instead of a durable pointer, breaking replay.
- Signal: Vague Goal - task title restates a category such as "build the feature" instead of a single outcome.
