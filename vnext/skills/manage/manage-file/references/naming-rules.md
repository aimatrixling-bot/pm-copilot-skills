---
title: Naming Rules — Project & Content Files
type: reference
scope: branch-specific
status: active
owner_skill: manage-file
related_blueprint_sections: [§2.21, §2.24]
---

# Naming Rules — Project & Content Files

## 1. Stable Conventions（铁律层）

- **Slug case**: use kebab-case lowercase for English slugs such as `prd.md` and `decision-log.md`.
- **Chinese original**: preserve book names, people names, and product names as written, such as `俞军产品方法论/` or `The_Lean_Startup/`; do not convert them to pinyin.
- **Sibling disambiguation**: when two sibling files overlap semantically, add a scope suffix such as `prd.md`, `prd-template.md`, or `prd-v1.md`; same name with different meaning is not allowed.
- **final-final prohibition**: do not create `final.md`, `真的最终.md`, or `final-v2.md`; use a `vN` suffix for version evolution.
- **Hidden and system files**: do not create `.draft`, `.tmp`, or `~backup`; use `_sandbox/` for isolated temporary outputs.

## 2. vN Suffix Rule

- `draft-v1.md` and `prd-v2.md` indicate iteration versions.
- Bump `vN` for substantive content changes: structure changes, section additions/removals, or key decision revisions.
- Do not bump for polish, typos, formatting, or one-line wording changes.
- Before bumping, confirm whether the previous version is archived to avoid `prd-v1.md` and `prd.md` both being treated as active.

## 3. Forbidden Patterns

- Spaces in active filenames.
- Chinese punctuation, except book-title brackets when they are part of a preserved title.
- Windows-illegal characters: `< > : " / \ | ? *`.
- Date prefixes such as `2026-04-foo.md` for active files; date prefixes are for archive snapshots only.
- All-uppercase English names except community conventions such as `README.md` or `CONTRIBUTING.md`.

## 4. 用户偏好（scope: user-preference）

These are Max's personal preferences, not global rules; a branch may inherit or override them.

- Use `01_` through `99_` numeric prefixes only when `_index.md` alphabetical order is insufficient.
- Article directories may use `YYYY-MM_topic_snake_case`, such as `2026-04_pm_copilot_agent`.
- `yyyymmdd` suffixes are for archive snapshots only; see `versioning-rules.md`.

Migration into another branch may preserve these preferences, but they should not be the only reason to reject a filename.
