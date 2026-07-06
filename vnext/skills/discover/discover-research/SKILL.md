---
name: discover-research
description: "Information Hierarchy when a topic needs evidence for a spec or decision, fails when claims lack source, confidence, recency, or handoff boundary."
disable-model-invocation: false
can-invoke: [manage-file, evolve-memory]
paths: []
status: draft
owner_agent: researcher
shared_with: [craft-spec, review-doc]
scope: project
grade: P0
---

# discover-research

<!-- P0 实现范围：见蓝图 §2.21 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Invocation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.0-discover-research -->
- Invoke when `craft-spec`, Reviewer, Supervisor, or the user needs evidence before writing or accepting a document.
- Use for current facts, technical references, repo evidence, market/user context, and source-backed comparisons.
- Prefer official docs, primary sources, local source-of-truth files, code, datasets, and durable repo artifacts before summaries.
- Do not write the spec, make final product judgment, or hide unsupported assumptions; route durable reference memory to `evolve-memory` only after confidence and scope are explicit.

## Steps
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-discover-research -->
1. Define the research target and downstream interface. Completion: question, requester, decision/spec slot, required freshness, and handoff target are explicit.
2. Search multiple source classes in priority order. Completion: local SoT/code, official or primary sources, and secondary summaries are each either checked or explicitly ruled out.
3. Normalize findings into evidence rows. Completion: every row has claim, source path or URL, date or revision when available, source type, confidence, and limitation.
4. Separate fact, inference, assumption, and unknown. Completion: high-confidence claims are not mixed with guesses, and every assumption is labeled with why it remains unverified.
5. Package the handoff for `craft-spec` or review. Completion: evidence_table, recommended citations, unresolved questions, and use/do-not-use guidance are ready for the next Skill.
6. Persist only durable outputs when needed. Completion: `manage-file` or `evolve-memory` is invoked only when the evidence artifact or reference memory has stable reuse value.

## Reference
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- `docs/vnext-blueprint.md §2.20` assigns research, PRD/spec delivery, and citation-required markdown output to Researcher.
- `docs/vnext-blueprint.md §2.21` defines `discover-research` as the P0 evidence supplier with `manage-file` available for durable artifacts.
- `docs/vnext-blueprint.md §2.22` defines reference memory fields when research evidence should be persisted beyond the task.
- `docs/vnext-blueprint.md §2.24.2` defines Information Hierarchy and Context Pointer, both required for reloadable evidence.
- `vnext/references/skill-authoring.md §4.1` requires sharp completion criteria; §8 names Context Pointer Miss and Bloat as failure modes.

## Completion Criteria
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-discover-research -->
- Research target, downstream Skill, evidence threshold, and recency requirement are explicit.
- Every key claim maps to reloadable citation data and a confidence level.
- Facts, inferences, assumptions, unknowns, and limitations are separated before handoff.
- Evidence table is usable by `craft-spec` without re-researching the same question.
- Persisted files or memories are limited to durable artifacts; transient research remains in the task output.

## Failure Modes
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- Signal: Untraceable Source - claim has no path, URL, revision, or source type that the next agent can reload.
- Signal: Confidence Collapse - high-confidence evidence, inference, assumption, and open question are mixed in one paragraph.
- Signal: Context Pointer Miss - citation text is vague, summary-only, stale, or missing enough detail to find the source again.
- Signal: Recency Drift - time-sensitive claims lack retrieval date, source date, or explicit stale-risk note.
- Signal: Handoff Gap - `craft-spec` receives findings without evidence_table, limitations, or unresolved questions.
