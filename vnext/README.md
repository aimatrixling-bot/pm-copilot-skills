---
name: vnext
type: namespace
status: draft
---

# vNext - AI Builder OS vNext Namespace

<!-- P0 实现范围：见蓝图 §2.15 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Overview
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.15 -->
- `vnext/` 是 AI Builder OS vNext 的隔离命名空间，当前只承载 P0 闭环骨架。
- P0 surface 包含 5 Agent、11 Skill、4 Kernel Packet、4 Memory schema 和必要索引文件。
- 本目录不改变 v1 runtime surface；所有 vNext 资产必须可被单独审计和删除。

## Coexistence
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.25.2 -->
- vNext 与 v1 side-by-side 共存；v1 的 `skills/`、`kernel/`、`memory/`、`templates/`、`evals/` 保持冻结。
- 任何 vNext 修改必须落在 `vnext/` 或明确的 vNext source document 内。
- Step C 不接入发布、安装或 runtime adapter；git 化推迟到后续步骤。

## Rollback
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.25.2 -->
- 回滚策略是删除或忽略 `vnext/`，因为当前没有 v1 文件依赖这些 manifest。
- 若后续 Step D 接入 runtime，必须先更新 rollback 说明和验证脚本。
- 任何跨目录引用都要可追溯到蓝图或 reference 文件，避免隐式耦合。

## Validation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.25.5 -->
- Structural check: 28 manifest files remain present and frontmatter stays frozen.
- Content check: each SECTION keeps `SECTION_REF` and contains executable guidance rather than single-line stubs.
- Repo gate: run `npm run validate:builder-os` after each meaningful batch and before review.

## Roadmap
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.26 -->
- Step A created skeletons; Step B filled frontmatter and section anchors; Step C expands executable manifest guidance.
- Step D remains responsible for blueprint cleanup, stale forward references, and deeper business-rule alignment.
- P1/P2/P3 files are not generated until Golden Tasks and T1-T4 gates justify expansion.

<!-- VERIFICATION: skeleton-of-skeleton Step A - Root README, 5 sections, 0 business content -->
