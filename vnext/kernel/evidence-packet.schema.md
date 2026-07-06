---
name: evidence-packet
type: packet-schema
status: draft
---

# Evidence Packet Schema

<!-- P0 实现范围：见蓝图 §2.15 + §2.23 -->
<!-- 终态封顶：见蓝图 §2.26.3 -->

## Purpose
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.23-Evidence -->
- Evidence Packet 是 Reviewer 主用协议，用于承载 HALO 诊断、风险分级和修复建议。
- 它把评审意见从主观判断变成可追溯证据，供原交付 Agent 修复。
- 文档评审和代码评审都应优先输出 Evidence Packet，再给摘要。

## Schema
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.23-Evidence -->
- Required: `reviewer_agent`, `target_output_id`, `halo_diagnosis`, `rationalization_table`, `deletion_test_applied`, `model_isolation`, `created_at`。
- `halo_diagnosis` 必含 `hallucination`, `omission`, `misalignment` 三类 list。
- `rationalization_table` 每项包含 `issue`, `halo_type`, `severity`, `fix_suggestion`。
- `severity` 使用 `P0|P1|P2`，代表评审严重度，不是 Skill grade。

## Examples
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.23-Evidence -->
- review-doc: missing acceptance criteria → `halo_type=omission`, `severity=P1`。
- review-code: untested auth change → `halo_type=misalignment`, `severity=P0`。
- No-issue case still records `rationalization_table=[]` plus remaining test gaps or residual risk.

## Validation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.23-Evidence -->
- Reject any finding without HALO type, severity, evidence target, or fix_suggestion.
- Reject if `model_isolation=false` but the review claims independent verification.
- Require at least one cited target file, packet id, URL, or line reference for blocking findings.

<!-- VERIFICATION: skeleton-of-skeleton Step A - Kernel packet schema, 4 frontmatter fields, 4 sections, 0 business content -->
