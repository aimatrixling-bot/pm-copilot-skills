---
name: manage-grill
description: "Grill user intent when ambiguity exceeds threshold, fails when questions assume the goal or exceed scope."
disable-model-invocation: false
can-invoke: [manage-prompt]
paths: []
status: draft
owner_agent: supervisor
shared_with: [researcher]
scope: global
grade: P0
---

# manage-grill

<!-- P0 实现范围：见蓝图 §2.21 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Invocation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.0-manage-grill -->
- Invoke when Intent Packet `probe_depth` is medium/deep or ambiguity blocks routing.
- Use it for goal, scope, acceptance, audience, risk, or source-of-truth uncertainty.
- Ask one focused question at a time with recommended options and a reason.

## Steps
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-manage-grill -->
1. Identify the blocking ambiguity and why it matters. Completion: each question maps to one `ambiguity_flag`.
2. Ask the smallest useful question with 2-3 options plus a free-form path when needed. Completion: the user can answer without writing a full spec.
3. Update the Intent Packet after each answer. Completion: resolved flags are removed and remaining flags are named.
4. Stop when routing is possible or when five questions would be exceeded. Completion: next Agent or stop reason is explicit.

## Reference
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- `docs/vnext-blueprint.md §2.23` for `probe_depth`, `ambiguity_flags`, and routing.
- `vnext/references/skill-authoring.md §4.1` for completion criteria per step.
- `vnext/references/skill-authoring.md §8` for premature completion and variance risks.

## Completion Criteria
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-manage-grill -->
- No more than five questions are asked before routing, stopping, or escalating.
- Each answer changes the Intent Packet or proves the ambiguity cannot be resolved in-session.
- Final output includes target Agent, unresolved flags, or a concrete blocker.

## Failure Modes
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- Signal: asking broad interview questions when one routing blocker is enough.
- Signal: solving the task before the missing goal or acceptance criteria are known.
- Signal: more than five questions without a routing decision.
- Signal: options that steer the user toward the Agent's preferred answer.

<!-- VERIFICATION: skeleton-of-skeleton Step A - Skill file, 9 frontmatter fields + grade, 5 sections, 0 business content -->
