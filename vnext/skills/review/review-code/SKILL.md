---
name: review-code
description: "Code review when changes need self-check or review, fails when tests, evidence, or risk tier are absent."
disable-model-invocation: false
can-invoke: [craft-test-case, evolve-memory]
paths: ["**/*.{ts,tsx,js,jsx,py,go,rs,java}"]
status: draft
owner_agent: reviewer
shared_with: [builder]
scope: project
grade: P0
---

# review-code

<!-- P0 实现范围：见蓝图 §2.21 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Invocation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.0-review-code -->
- Invoke when code changes are ready for review or Builder needs self-check before handoff.
- Use for implementation diffs, tests, security-sensitive changes, and behavior-affecting refactors.
- Output Evidence Packet with risk tier, verification evidence, and concrete fix suggestions.

## Steps
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-review-code -->
1. Identify changed files, intended behavior, and relevant specs/tests. Completion: review scope is explicit.
2. Check correctness, security, data integrity, permission, and compatibility risks. Completion: each risk is accepted, rejected, or flagged with evidence.
3. Check tests and verification commands. Completion: run output or missing-test caveat is recorded.
4. Produce findings ordered by severity. Completion: each finding includes file/line when available and fix_suggestion.

## Reference
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- `docs/vnext-blueprint.md §2.23-Evidence` for Evidence Packet and severity fields.
- `docs/vnext-blueprint.md §2.20-Reviewer` for no build/merge boundary.
- `vnext/references/skill-authoring.md §8` for evidence and premature completion failure modes.

## Completion Criteria
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-review-code -->
- Findings are ordered by severity and grounded in file paths, lines, commands, or specs.
- Verification status is explicit: passed command, failed command, or not run with reason.
- Risk tier is assigned and handoff target is named for fixes.

## Failure Modes
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- Signal: only style comments while behavior, auth, data, or migration risk is unchecked.
- Signal: "tests should pass" without fresh command output.
- Signal: severity lower than impact on users, data, or security.
- Signal: broad refactor accepted without focused evidence.

<!-- VERIFICATION: skeleton-of-skeleton Step A - Skill file, 9 frontmatter fields + grade, 5 sections, 0 business content -->
