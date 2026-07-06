---
name: iron-law
type: packet-schema
status: draft
---

# Iron Law Schema

<!-- P0 实现范围：见蓝图 §2.14 + §2.23 -->
<!-- 终态封顶：见蓝图 §2.26.3 -->

## Purpose
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.23-Iron-Law -->
- Iron Law 是 L1 全局纪律，约束所有 Agent 的入口判断和完成声明。
- Evolver 创建、修改或删除元资产前必须显式执行 Iron Law 自检。
- 它的作用是阻止过度复杂、缺目标、无证据完成和未经确认的 global scope 变更。

## Schema
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.23-Iron-Law -->
- Required: `version`, `rules`, `enforcement`。
- 每条 rule 必含 `id`, `rule`, `soul_trait_ref`；`id` 使用 `IL-01` 这类稳定编号。
- P0 规则覆盖最小路径、目标/验收/证据、hook 纪律、三次失败停手、6 metadata 和 global scope 确认。
- `enforcement=harness_gate` 表示该协议后续应接入更高层验证。

## Examples
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.23-Iron-Law -->
- Synthetic pass: local project memory write with source, confidence, detail_ref and no global scope change.
- Synthetic reject: creating a new global skill because of one conversation without reuse check or human confirmation.
- Synthetic stop: same validation failure repeated three times without new evidence.

## Validation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.23-Iron-Law -->
- Reject if an Evolver output lacks Iron Law self-check YAML.
- Reject if global scope changes proceed without explicit human confirmation.
- Stop and escalate when the same failure condition repeats three times without progress.

<!-- VERIFICATION: skeleton-of-skeleton Step A - Kernel packet schema, 4 frontmatter fields, 4 sections, 0 business content -->
