---
name: skills-index
type: index
status: draft
---

# Skill Index

<!-- P0 实现范围：见蓝图 §2.21 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Purpose
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21 -->
- `vnext/skills/` 索引（index）12 个为最小闭环选择的 P0 Skill。
- 每个 Skill 保留 10 个 frontmatter 字段、5 个正文 section 和可执行 Step C 指导。
- 本索引不授权创建 P1/P2/P3；未来扩展等待 Step D 和 Golden Task 证据。

## Inventory
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.25.1 -->
- manage：`manage-prompt`、`manage-grill`、`manage-file`。
- discover：`discover-research`。
- craft：`craft-spec`、`craft-prototype`、`craft-agent-task`。
- review：`review-doc`、`review-code`。
- build/evolve：`build-commit`、`evolve-memory`、`evolve-skill`。

## Leading Word Index
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- description leading words 通过 Invocation 和 Failure Modes 镜像到每个 Skill 正文。
- 基于 step 的 Skill 在 `## Steps` 内包含显式 `Completion:` 标记。
- Review 和 evolve Skills 引用 Evidence Packet、Memory schema 和 Iron Law，而不是复制完整规则。
- 使用 `vnext/references/skill-authoring.md` 作为写作纪律事实源。

<!-- VERIFICATION: skeleton-of-skeleton Step A - Index file, 3 sections, 0 business content -->
