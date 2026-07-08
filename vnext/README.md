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
- `vnext/` 是 AI Builder OS vNext 的隔离命名空间（namespace），当前只承载 P0 闭环骨架。
- P0 范围包含 5 Agent、12 Skill、4 Kernel Packet、4 Memory schema 和必要索引（index）文件。
- 本目录不改变 v1 runtime surface；所有 vNext 资产必须可被单独审计和删除。

## Coexistence
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.25.2 -->
- vNext 与 v1 并行共存；v1 的 `skills/`、`kernel/`、`memory/`、`templates/`、`evals/` 保持冻结。
- 任何 vNext 修改必须落在 `vnext/` 或明确的 vNext source 文档内。
- Step C 不接入发布、安装或 runtime adapter；git 化推迟到后续步骤。

## Rollback
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.25.2 -->
- 回滚（rollback）策略是删除或忽略 `vnext/`，因为当前没有 v1 文件依赖这些清单（manifest）。
- 若后续 Step D 接入 runtime，必须先更新回滚说明和验证脚本。
- 任何跨目录引用都要可追溯到蓝图或 reference 文件，避免隐式耦合。

## Validation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.25.5 -->
- 结构性检查：31 个清单文件保持存在，且 frontmatter 保持冻结。
- 内容检查：每个 section 保留 `SECTION_REF`，并包含可执行指导，而不是单行骨架（stub）。
- repo 门控：每个有意义的批次后、review 前运行 `npm run validate:builder-os`。

## Roadmap
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.26 -->
- Step A 创建骨架；Step B 填充 frontmatter 与 section 锚点；Step C 扩展可执行清单指导。
- Step D 仍负责蓝图清理、陈旧前向引用和更深层业务规则对齐。
- 在 Golden Task 和 T1-T4 gate 证据证明需要扩展前，不生成 P1/P2/P3 文件。

<!-- VERIFICATION: skeleton-of-skeleton Step A - Root README, 5 sections, 0 business content -->
