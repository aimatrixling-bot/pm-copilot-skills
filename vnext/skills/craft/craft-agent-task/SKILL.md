---
name: craft-agent-task
description: "Task packaging when Supervisor decomposes or hands off work, fails when done criteria or stop conditions are missing."
disable-model-invocation: false
can-invoke: [manage-file]
paths: []
status: draft
owner_agent: supervisor
shared_with: [builder]
scope: project
grade: P0
---

# craft-agent-task

<!-- P0 实现范围：见蓝图 §2.21 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Invocation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.0-craft-agent-task -->
- Invoke when Supervisor decomposes work or an Agent needs a handoff-ready task pack.
- Use for agent-readable execution packets, not human-facing PRD prose.
- The task pack must make stop conditions and done criteria explicit before handoff.

## Steps
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-craft-agent-task -->
1. State the concrete goal and target Agent. Completion: one Agent owns the next action.
2. List inputs, expected outputs, constraints, and forbidden actions. Completion: no downstream Agent has to infer scope.
3. Write done criteria and stop conditions. Completion: each criterion is observable and each stop condition names escalation path.
4. Attach references and working paths. Completion: required files, packets, and source-of-truth links are listed.

## Reference
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- `docs/vnext-blueprint.md §2.20` for Agent handoff fields and forbidden actions.
- `docs/vnext-blueprint.md §2.23-Output` for `next_actions` handoff shape.
- `vnext/references/skill-authoring.md §4.1` for sharp done criteria.

## Completion Criteria
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-craft-agent-task -->
- Task pack includes goal, owner Agent, inputs, outputs, constraints, done criteria, and stop conditions.
- Handoff target can start without reading unrelated chat history.
- Stop conditions include missing evidence, repeated failure, capability limit, and human decision needed.

## Failure Modes
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- Signal: "continue the work" without target Agent, paths, or done criteria.
- Signal: task includes multiple independent owners with no sequencing.
- Signal: no stop condition for uncertainty, repeated failure, or destructive action.
- Signal: hidden dependence on prior chat instead of durable references.

<!-- VERIFICATION: skeleton-of-skeleton Step A - Skill file, 9 frontmatter fields + grade, 5 sections, 0 business content -->
