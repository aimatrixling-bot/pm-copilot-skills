---
name: reference
type: memory-schema
status: draft
---

# Memory Schema: reference

<!-- P0 实现范围：见蓝图 §2.22 -->
<!-- 终态封顶：见蓝图 §2.26.3 -->

## Purpose
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.22-reference -->
- `reference` memory 记录研究完成后的外部资料、仓库文档路径和已验证链接。
- 它帮助后续 Agent 找到证据来源，不承载完整研究报告。
- 引用必须带可信度和验证日期，避免过期资料被当作当前事实。

## Schema
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.22-reference -->
- Required: `id`, `type=reference`, `scope`, `status`, `source`, `confidence`, `last_verified`, `detail_ref`, `content`。
- `content` 摘要说明资料是什么、适用什么问题、为什么可信。
- `detail_ref` 指向研究笔记、source map 或引用索引；URL 本身可放在 detail_ref 中维护。

## Lifecycle
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.22-reference -->
- Researcher 写入前确认来源可访问，并记录 `last_verified`。
- 资料超过 90 天或来源有版本漂移风险时，使用前必须重新验证。
- 链接失效或被新资料取代时，将旧条目标为 `superseded` 或 `archived`。

## Examples
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.22-reference -->
- Synthetic: `content: docs/vnext-blueprint.md §2.23 定义 Kernel Packet 字段`。
- Synthetic: `content: vnext/references/skill-authoring.md 是 Skill 写作规范 source of truth`。
- Reject: `content: 某篇博客说这样最好`，因为缺少路径、验证日期和可信度。

<!-- VERIFICATION: skeleton-of-skeleton Step A - Memory schema, 4 frontmatter fields, 4 sections, 0 business content -->
