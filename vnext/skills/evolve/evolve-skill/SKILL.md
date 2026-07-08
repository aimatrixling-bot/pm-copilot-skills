---
name: evolve-skill
description: "Pruning 当需要创建、改进、审计或废弃 skill 时触发，Iron Law、验收标准或 failure-mode review 被跳过时失败。"
disable-model-invocation: false
can-invoke: [evolve-memory]
paths: ["vnext/skills/**", "vnext/references/skill-authoring.md"]
status: draft
owner_agent: evolver
shared_with: [supervisor, reviewer]
scope: global
grade: P0
---

# evolve-skill

<!-- P1.1 implementation scope: create one executable meta-skill; do not modify blueprint, v1 files, validators, or P0 manifests. -->

## Invocation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.5-evolve-skill -->
- Invoke when Evolver must create, improve, audit, or deprecate a Skill asset.
- Use create mode only after the Iron Law proves the need cannot be handled by reuse, merge, demotion to sub-mode, archive, or clarification.
- Use improve mode when an existing Skill fails trigger accuracy, completion discipline, ownership, bucket fit, or reference loading.
- Use audit mode when Reviewer, Supervisor, or user feedback asks whether a Skill is predictable, bloated, stale, or mis-scoped.
- Use deprecate mode when Deletion Test shows the Skill is safe to archive or must be replaced by a new Candidate path.

## Steps
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.14 -->
1. Classify the request as create, improve, audit, or deprecate. Completion: target Skill path, mode, requester, scope, and expected output are explicit.
2. Run the Evolver Iron Law create gate. Completion: prove_no_reuse, prove_no_merge, prove_no_demote, prove_no_archive, prove_no_clarify, and scope are answered; global scope has human confirmation.
3. Apply the Deletion Test: answer "what breaks if this Skill does not exist or does not change?" Completion: result is Lose, Workaround, Safe-drop, or Reject with one-sentence rationale.
4. Load only required source-of-truth files and baseline the target. For create mode, list missing fields and SECTIONs; for improve mode, list current Skill versus target-state gaps; for audit or deprecate mode, capture the current-state snapshot before judgment. Completion: source files are identified and the baseline gap table (missing fields, missing SECTIONs, and target-state gaps) is written so Step 5 and Step 7 can judge scope from evidence.
5. Run the acceptance check for create/improve. Completion: 9 required fields plus grade are present; description follows the three rules; step-based Skills include Completion criteria; description starts with a listed leading word.
6. Run the audit dimensions. Completion: Premature Completion, Variance, Context Pointer Miss, and Bloat are checked; Pruning covers single source of truth, relevance, and sentence-level no-op removal; the information hierarchy ladder is intact.
7. Apply the smallest coherent Skill change. Completion: owner_agent remains single, shared_with stays explicit, scope is honest, status and grade are not mixed, and no unrelated Skill is edited.
8. Verify and report. Completion: file-level checks pass, `npm run validate:builder-os` is run when repo state allows, and the report lists changed files, evidence, unresolved decisions, and reviewer review points.

## Reference
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- `docs/vnext-blueprint.md §2.5` defines evolve-skill as the Evolver meta-skill for create and improve.
- `docs/vnext-blueprint.md §2.14` defines the Evolver Iron Law gate before creating any new asset.
- `docs/vnext-blueprint.md §2.24.5` defines the acceptance check and audit dimensions for evolve-skill.
- `vnext/references/skill-authoring.md §3` is the frontmatter source of truth; §4 covers Steps and references; §8 lists failure modes; §9 is the pre-submit checklist.
- 11 leading words to check explicitly: Model-Invoked, User-Invoked, Description, Context Pointer, Router Skill, Information Hierarchy, Steps, Completion Criterion, Progressive Disclosure, Leading Word, Pruning.
- Acceptance check: 9 required frontmatter fields plus grade, description three rules, step-based Skill includes Completion criteria, and the description starts with a listed leading word.
- Audit dimensions: the 4 failure modes, Pruning three disciplines, and information hierarchy ladder completeness.
- Do not duplicate generic Iron Law self-review steps inside Skill bodies: Iron Law plus L3 Harness enforce self-check before declaring done, while Skill Steps carry only skill-specific acceptance criteria.

## Completion Criteria
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24.5 -->
- Mode is explicit: create, improve, audit, or deprecate.
- Iron Law create gate is answered before creating or expanding a Skill.
- Deletion Test is answered and supports the proposed grade or deprecation path.
- Acceptance check passes for any created or modified Skill.
- Audit dimensions cover Premature Completion, Variance, Context Pointer Miss, Bloat, Pruning, and information hierarchy.
- Output names changed files, checks run, evidence, and unresolved reviewer decisions.
- No blueprint, v1 file, frozen P0 manifest, runtime code, or validator code is modified unless the user explicitly requests that scope.

## Failure Modes
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24.3 -->
- Signal: Premature Completion - the Skill is declared ready while a step lacks a Completion criterion or the Deletion Test is unanswered.
- Signal: Variance - repeated use of the Skill produces different process shape because trigger, owner, scope, or steps are ambiguous.
- Signal: Context Pointer Miss - the Skill points to a disclosed reference but the loading condition is vague or the path is wrong.
- Signal: Bloat - SKILL.md grows into a rulebook instead of moving branch-specific detail into references.
- Signal: Grade Inflation - Candidate or P1 work is marked P0 without Deletion Test evidence and reviewer decision.
- Signal: Owner Drift - owner_agent changes to satisfy a momentary workflow instead of preserving single responsibility.
- Signal: Bucket Misfit - the Skill cannot fit manage, discover, craft, review, build, or evolve without forcing semantics.
