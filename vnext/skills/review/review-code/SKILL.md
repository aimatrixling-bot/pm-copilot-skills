---
name: review-code
description: "Information Hierarchy when code changes need review or Builder self-check, fails when tests, security, severity, or fix ownership are unclear."
disable-model-invocation: false
can-invoke: [evolve-memory]
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
- Invoke when a PR, commit, branch diff, or Builder self-check needs code review before acceptance, handoff, or commit closeout.
- Use for behavior-changing code, tests, refactors, security-sensitive work, generated scaffold review, and post-fix verification.
- Review code against correctness, security, style, performance, and maintainability; include test evidence before PASS.
- Return PASS, PASS_WITH_CAVEAT, or BLOCKED with ordered executable fixes; do not rewrite code in place or invoke build/craft work from Reviewer.
- Persist reusable feedback through `evolve-memory` only when the finding is durable beyond the current diff.

## Steps
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-review-code -->
1. Bound the review target. Completion: branch/commit/PR/diff range, changed files, intended behavior, source spec, and reviewer role boundary are explicit.
2. Load relevant context before judging. Completion: touched code, nearby tests, public API/schema/auth paths, and project rules are checked or ruled out with reason.
3. Review five dimensions. Completion: correctness, security, style, performance, and maintainability each has PASS, caveat, or finding with evidence.
4. Verify tests and commands. Completion: relevant test/typecheck/lint/build outputs are recorded, or missing verification is labeled as a caveat or blocker with reason.
5. Classify findings by severity. Completion: every finding is tagged `blocker`, `major`, `minor`, or `nit`, and nits are separated from merge-blocking issues.
6. Produce executable review output. Completion: final state is PASS, PASS_WITH_CAVEAT, or BLOCKED with ordered fix list, owner, evidence pointer, and suggested verification command.
7. Route durable learning only when justified. Completion: `evolve-memory` is invoked only for reusable review patterns, not transient diff comments.

## Reference
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- `docs/vnext-blueprint.md §2.20` defines Reviewer responsibilities, Evidence Packet output, and no-build/no-merge boundary.
- `docs/vnext-blueprint.md §2.21` defines `review-code` as the P0 code review Skill for Reviewer and Builder self-check.
- `docs/vnext-blueprint.md §2.23` defines Evidence Packet fields used for findings, severity, risk, and next actions.
- `docs/vnext-blueprint.md §2.26` uses `review-code` in GT-05 and GT-07 as the code quality and self-check gate.
- `vnext/references/skill-authoring.md §4.1` requires sharp completion criteria; §8 covers premature completion and context pointer misses.
- `C:\Users\max.ling\.claude\rules\common\coding-style.md` defines exact-change and readability expectations.
- `C:\Users\max.ling\.claude\rules\common\security.md` defines mandatory checks for secrets, injection, XSS, authorization, and sensitive error leakage.
- `C:\Users\max.ling\.claude\rules\common\testing.md` defines pragmatic verification expectations for critical paths and bug fixes.
- `C:\Users\max.ling\.claude\rules\common\performance.md` is consulted when a diff touches hot paths, data volume, rendering, or IO.

## Completion Criteria
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-review-code -->
- Frontmatter keeps the 9 required Skill fields plus `grade`, with `status: draft`, `grade: P0`, `owner_agent: reviewer`, and `shared_with` excluding the owner.
- Description starts with `Information Hierarchy`, follows `X when Y, fails when Z`, and stays one sentence under 200 characters.
- All five SECTION headings remain in order and keep `SECTION_REF` anchors to existing blueprint sections.
- Every step has a `Completion:` criterion, and the review covers bounded scope, context load, five dimensions, verification evidence, severity split, executable fix list, and durable-feedback routing.
- Final decision is PASS, PASS_WITH_CAVEAT, or BLOCKED; blockers and nits are separated, and Reviewer does not directly edit code.

## Failure Modes
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- Signal: Premature PASS - review approves without fresh test/typecheck/lint/build evidence or an explicit not-run caveat.
- Signal: Security Blindness - injection, XSS, secret exposure, authz/authn, path traversal, or sensitive error leakage is not checked when relevant.
- Signal: Style Nitpicking - formatting or preference comments block acceptance despite no correctness, security, performance, or maintainability risk.
- Signal: Context Loss - review inspects an isolated hunk without loading surrounding code, tests, spec, schema, or public API impact.
- Signal: Role Drift - Reviewer rewrites code, stages fixes, invokes craft/build work, or hides ownership instead of returning executable fixes.
