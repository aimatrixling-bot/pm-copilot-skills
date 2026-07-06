---
name: review-doc
description: "Document review when a deliverable is ready, fails when HALO issues lack severity, evidence, or fix path."
disable-model-invocation: false
can-invoke: [craft-test-case, evolve-memory]
paths: []
status: draft
owner_agent: reviewer
shared_with: []
scope: project
grade: P0
---

# review-doc

<!-- P0 实现范围：见蓝图 §2.21 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Invocation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.0-review-doc -->
- Invoke when a document deliverable is ready for review before acceptance or handoff.
- Use for PRD, spec, task pack, review packet, decision record, or reference document checks.
- Prioritize HALO issues: hallucination, omission, and misalignment against source truth.

## Steps
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-review-doc -->
1. Identify review target, source-of-truth files, and acceptance criteria. Completion: target and sources are listed before findings.
2. Classify issues with HALO. Completion: each issue is hallucination, omission, or misalignment.
3. Build a Rationalization Table. Completion: each row has issue, severity, evidence, and fix_suggestion.
4. Decide pass, pass-with-caveat, or block. Completion: decision follows from severity and evidence.

## Reference
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- `docs/vnext-blueprint.md §2.23-Evidence` for Evidence Packet fields.
- `docs/vnext-blueprint.md §2.20-Reviewer` for Reviewer forbidden actions.
- `vnext/references/skill-authoring.md §8` for premature completion and variance diagnostics.

## Completion Criteria
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-review-doc -->
- Every finding includes HALO type, severity, evidence reference, and fix suggestion.
- No blocking claim is made without source path, line, packet id, or quoted user requirement.
- Review result names residual risk even when no findings are found.

## Failure Modes
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- Signal: "looks good" without checked sources or residual risk.
- Signal: findings listed without HALO type or severity.
- Signal: blocking a doc based on preference rather than evidence.
- Signal: Reviewer rewrites the document instead of reporting fix path.

<!-- VERIFICATION: skeleton-of-skeleton Step A - Skill file, 9 frontmatter fields + grade, 5 sections, 0 business content -->
