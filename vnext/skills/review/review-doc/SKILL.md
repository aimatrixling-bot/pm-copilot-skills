---
name: review-doc
description: "Information Hierarchy when a document deliverable needs review, fails when structure, citations, acceptance criteria, or handoff feedback are unclear."
disable-model-invocation: false
can-invoke: [evolve-memory]
paths: []
status: draft
owner_agent: reviewer
shared_with: [researcher, builder]
scope: project
grade: P0
---

# review-doc

<!-- P0 实现范围：见蓝图 §2.21 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Invocation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.0-review-doc -->
- Invoke when a PRD, Mini Spec, Engineering Request, task pack, decision record, reference note, or review packet is ready for acceptance or handoff review.
- Use after the author has produced a bounded document with stated goal, audience, source boundary, and acceptance criteria.
- Review against source truth, citations, structure, acceptance criteria, and handoff completeness; do not rewrite the document in place.
- Persist reusable feedback through `evolve-memory` only when the issue is durable beyond the current document.

## Steps
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-review-doc -->
1. Bound the review target. Completion: document path or artifact id, authoring Skill, audience, intended handoff, and source-of-truth files are listed before findings.
2. Check document structure and information hierarchy. Completion: goal, scope, non-goals, requirements, acceptance criteria, evidence/citations, risks, and next actions are each present or explicitly marked missing.
3. Verify citations and source alignment. Completion: every non-obvious claim has a reloadable source, and each cited source supports the claim made.
4. Classify issues by impact. Completion: every finding has category, HALO type when applicable, severity (`blocker`, `major`, `minor`, `nit`), evidence pointer, and fix path.
5. Separate blocker from nit. Completion: acceptance decision is based only on blocker/major evidence, while nits are grouped separately and cannot block alone.
6. Produce executable feedback for the downstream owner. Completion: result is PASS, PASS_WITH_CAVEAT, or BLOCKED, with ordered fix list, owner, residual risk, and handoff target.

## Reference
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- `docs/vnext-blueprint.md §2.20` defines Reviewer responsibilities, Evidence Packet output, and forbidden actions.
- `docs/vnext-blueprint.md §2.21` defines `review-doc` as the P0 document review Skill and allows feedback memory writeback.
- `docs/vnext-blueprint.md §2.23` defines Evidence Packet concepts used by Reviewer outputs.
- `docs/vnext-blueprint.md §2.24.2` defines Information Hierarchy, Completion Criterion, Context Pointer, and Progressive Disclosure.
- `vnext/references/skill-authoring.md §8` defines Premature Completion, Variance, Context Pointer Miss, and Bloat diagnostics.

## Completion Criteria
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-review-doc -->
- Review target, source-of-truth files, audience, and acceptance criteria are explicit.
- Each finding includes category, HALO type when applicable, severity, evidence pointer, and fix path.
- Blockers and nits are separated, and the final decision follows from severity and evidence.
- Feedback is executable by Researcher or Builder without the Reviewer rewriting the document.
- Reusable feedback is routed to `evolve-memory` only when scope and evidence justify persistence.

## Failure Modes
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- Signal: Premature Completion - review says PASS before source truth, acceptance criteria, citations, and residual risk are checked.
- Signal: Variance - review shape changes because target, audience, source boundary, or severity scale was not fixed first.
- Signal: Context Pointer Miss - finding cites a vague claim, missing source, or non-reloadable reference.
- Signal: Nit Blocking - preference, wording, or style comments block acceptance without evidence of product or delivery risk.
- Signal: Role Drift - Reviewer rewrites the document or invokes authoring work instead of returning executable feedback.
