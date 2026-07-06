---
name: evolve-memory
description: "Information Hierarchy when preference, feedback, project, or reference signal appears, fails when duplicate, unverified, or unscoped memory is written."
disable-model-invocation: false
can-invoke: []
paths: ["**/memory/**", "**/MEMORY.md"]
status: draft
owner_agent: evolver
shared_with: [supervisor, researcher, builder, reviewer]
scope: project
grade: P0
---

# evolve-memory

<!-- P0 实现范围：见蓝图 §2.21 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Invocation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.0-evolve-memory -->
- Invoke when a durable user preference, feedback correction, project state, decision, or verified reference signal should persist beyond the current turn.
- Use only after the source is cited and the target schema is known: `user`, `feedback`, `project`, or `reference`.
- Do not write memory for guesses, transient task progress, inferred mood, unverified claims, or content that belongs in a spec, ADR, or review packet.
- Keep `evolve-memory` as a leaf Skill: it classifies, verifies, writes, appends, supersedes, rejects, and reports memory outcomes without invoking downstream Skills.

## Steps
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-evolve-memory -->
1. Detect memory signal and classify by schema. Completion: signal is classified as `user`, `feedback`, `project`, or `reference` against `vnext/memory/*.schema.md`; ambiguous signals are flagged, not force-fit.
2. Verify the signal against source. Completion: the originating artifact, such as chat line, file path, review output, decision log entry, or research citation, is cited; unverified signals are not written.
3. Decide write mode. Completion: existing memory is searched first; matching signals append observations or supersede the entry rather than creating duplicates.
4. Scope the memory entry. Completion: the entry follows the matching schema with required fields, stable id, status, source, confidence, last_verified, detail_ref, content, explicit scope, and stale fields marked rather than silently overwritten.
5. Write back atomically. Completion: write target is inside `**/memory/**` or `MEMORY.md`, a new topic file is indexed when created, and the change is summarized for the Output Packet.
6. Report back to the calling Agent. Completion: caller receives one line stating what was written, appended, superseded, or rejected, with reason and target pointer.

## Reference
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- `docs/vnext-blueprint.md §2.20` defines Evolver ownership and shared use by Supervisor, Researcher, Builder, and Reviewer.
- `docs/vnext-blueprint.md §2.21` defines `evolve-memory` as the P0 Memory 4-class writeback Skill.
- `docs/vnext-blueprint.md §2.22` defines common Memory schema fields and the `user`, `feedback`, `project`, and `reference` memory types.
- `docs/vnext-blueprint.md §2.23` defines Output Packet evidence and next-action fields for reporting writeback outcomes.
- `docs/vnext-blueprint.md §2.24` defines Information Hierarchy, Progressive Disclosure, Completion Criterion, and failure-mode diagnostics.
- `docs/vnext-blueprint.md §2.25.1` fixes the P0 vNext directory and Skill authoring discipline.
- `docs/vnext-blueprint.md §2.26` covers GT-06 and GT-08, where `evolve-memory` writes feedback and project memory.
- `vnext/memory/user.schema.md`, `vnext/memory/feedback.schema.md`, `vnext/memory/project.schema.md`, and `vnext/memory/reference.schema.md` are the schema references; do not create new schema files.
- `vnext/references/skill-authoring.md §4.1` defines completion criteria discipline; §8 defines premature completion diagnostics.

## Completion Criteria
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-evolve-memory -->
- Frontmatter keeps the 9 required Skill fields plus `grade`, with `owner_agent: evolver`, `can-invoke: []`, `scope: project`, and `shared_with` excluding the owner while including Researcher.
- Description starts with `Information Hierarchy`, follows `X when Y, fails when Z`, and stays one sentence under 200 characters.
- All five SECTION headings remain in order and keep `SECTION_REF` anchors to existing blueprint sections.
- Every step has a `Completion:` criterion, and the writeback path proves schema classification, source verification, duplicate check, explicit scope, atomic write, indexing, and caller report.
- Deletion Test remains Lose: no other P0 Skill owns durable writeback for user, feedback, project, and reference memory signals.

## Failure Modes
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- Signal: Duplicate Write - writes a new entry for a signal that already has an existing memory record.
- Signal: Unverified Source - writes memory from inference or assumption without citing the originating artifact.
- Signal: Narrative Content - writes prose, opinion, or chat log instead of structured observations matching the schema.
- Signal: Stale Verification - overwrites a previously verified entry with newer but unverified content.
- Signal: Scope Drift - entry claims global scope for a project-specific signal, or project scope for a stable cross-project user preference.
- Signal: Orphan Detail - writes a topic file without indexing it in `MEMORY.md`, hiding it from future load.
