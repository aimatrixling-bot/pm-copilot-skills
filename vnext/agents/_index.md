---
name: agents-index
type: index
status: draft
---

# Agent Index

<!-- P0 实现范围：见蓝图 §2.20 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Purpose
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.20 -->
- `vnext/agents/` is the P0 Agent contract directory and route map.
- It defines which Agent receives an intent, which Skill bucket it may invoke, and which handoff paths are allowed.
- This index is navigational; individual Agent files remain the source for role, trigger, output, failure, and forbidden behavior.

## Inventory
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.25.1 -->
- `supervisor.md` — default route, intent parsing, clarification, delegation.
- `researcher.md` — research, evidence collection, PRD/spec/document delivery.
- `builder.md` — prototype, implementation, verification, commit handoff.
- `reviewer.md` — document/code review, Evidence Packet, HALO diagnosis.
- `evolver.md` — memory writeback, skill quality, harness entropy reduction.

## Routing
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.26 -->
- Default route is Supervisor unless the user explicitly targets an Agent and the request is already scoped.
- Research/document/spec intents route to Researcher; prototype/build/commit intents route to Builder.
- Review/check/test intents route to Reviewer; memory/skill/harness improvement intents route to Evolver.
- Ambiguous or multi-agent requests return to Supervisor for Intent Packet update before execution.

<!-- VERIFICATION: skeleton-of-skeleton Step A - Index file, 3 sections, 0 business content -->
