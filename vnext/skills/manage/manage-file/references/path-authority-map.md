---
title: Path Authority Map — Sub-path Placement
type: reference
scope: branch-specific
status: active
owner_skill: manage-file
related_blueprint_sections: [§2.21, §2.24]
---

# Path Authority Map — Sub-path Placement

## 1. paths Scope

`manage-file` frontmatter limits file operations to `["30_Projects/**", "40_Content/**"]`.

Paths outside this scope are rejected before the decision flow starts unless the user explicitly changes the task boundary.

## 2. Sub-path Authority Table

| Module | Sub-path | Contents | Naming |
|---|---|---|---|
| `30_Projects/company/{project}/` | project root | `prd.md`, `decision_log.md`, `airtable_design.md`, and standard company project docs | snake_case |
| `30_Projects/company/{project}/` | `research/`, `specs/`, `docs/`, `scripts/` | project submodules | kebab-case |
| `30_Projects/personal/{project}/` | project root and submodules | personal project docs with the same general structure | snake_case |
| `40_Content/` | article directory | single article workspace | `YYYY-MM_topic_snake_case` |
| `40_Content/{article}/` | article assets | `draft-v1.md`, `final-article.md`, `cover.png` | kebab-case |
| `90_Archive/` | archive tree | complete project archive for provenance only | preserve original naming |

## 3. Out-of-Scope Paths（自动拒绝）

- `00_System/`, `10_Library/`, `20_Skills/`, and `50_Career/`, unless the user explicitly instructs otherwise.
- Hidden directories such as `.claude/` or `.ai-builder/`.
- Any `.env`, secret, token, or CI/CD configuration.
- v1 source, blueprint files, or another project's working tree.
- Loose files at a project root without a classified module ownership.

## 4. Ambiguity Triggers Consultation

Consult this reference and ask for user confirmation when:

- The user-specified path is outside the table.
- A move crosses modules, such as `40_Content/` to `30_Projects/`.
- Files with the same name appear in different modules.
- A new project-root file lacks a clear submodule owner.
