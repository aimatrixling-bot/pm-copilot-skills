---
name: discover-research
description: "Research synthesis when a topic needs evidence, fails when claims lack source, confidence, or recency."
disable-model-invocation: false
can-invoke: [manage-file]
paths: []
status: draft
owner_agent: researcher
shared_with: [writer, supervisor]
scope: project
grade: P0
---

# discover-research

<!-- P0 实现范围：见蓝图 §2.21 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Invocation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.0-discover-research -->
- Invoke when a research topic is identified and the next output needs evidence.
- Prefer primary sources, official docs, code, datasets, or durable repo artifacts before summaries.
- Output findings for `craft-spec`, Reviewer, or human decision; do not jump to implementation.

## Steps
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-discover-research -->
1. Define the research question and evidence threshold. Completion: the question can be answered with sources, not taste alone.
2. Collect sources in priority order and record recency. Completion: each source has path or URL, date when available, and trust level.
3. Convert findings into claims. Completion: every claim maps to at least one source or is labeled inference.
4. Produce an evidence table. Completion: claim, source, confidence, and limitation columns are filled.

## Reference
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- `docs/vnext-blueprint.md §2.20` for Researcher output requiring citations.
- `docs/vnext-blueprint.md §2.22-reference` for writing durable research references.
- `vnext/references/skill-authoring.md §2` for single source of truth and duplication discipline.

## Completion Criteria
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-discover-research -->
- Each key claim has a source, confidence level, and limitation.
- Recency-sensitive facts are verified against current or explicitly dated sources.
- Output separates facts, inferences, assumptions, and open questions.

## Failure Modes
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- Signal: source-free recommendation for a disputed or changing topic.
- Signal: treating outdated evidence as current without a verification date.
- Signal: copying source language without synthesis or limitation.
- Signal: missing evidence table when downstream spec depends on claims.

<!-- VERIFICATION: skeleton-of-skeleton Step A - Skill file, 9 frontmatter fields + grade, 5 sections, 0 business content -->
