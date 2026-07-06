---
name: skills-index
type: index
status: draft
---

# Skill Index

<!-- P0 实现范围：见蓝图 §2.21 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Purpose
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21 -->
- `vnext/skills/` indexes the 11 P0 Skills selected for the minimum closed loop.
- Each Skill keeps 10 frontmatter fields, 5 body sections, and executable Step C guidance.
- This index does not authorize P1/P2/P3 creation; future expansion waits for Step D and Golden Task evidence.

## Inventory
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.25.1 -->
- manage: `manage-prompt`, `manage-grill`, `manage-file`.
- discover: `discover-research`.
- craft: `craft-spec`, `craft-prototype`, `craft-agent-task`.
- review: `review-doc`, `review-code`.
- build/evolve: `build-commit`, `evolve-memory`.

## Leading Word Index
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- Description leading words are mirrored in each Skill body through Invocation and Failure Modes.
- Step-based Skills include explicit `Completion:` markers inside `## Steps`.
- Review and evolve Skills reference Evidence Packet, Memory schema, and Iron Law instead of duplicating full rules.
- Use `vnext/references/skill-authoring.md` as the writing discipline source of truth.

<!-- VERIFICATION: skeleton-of-skeleton Step A - Index file, 3 sections, 0 business content -->
