---
name: output-packet
type: packet-schema
status: draft
---

# Output Packet Schema

<!-- P0 实现范围：见蓝图 §2.15 + §2.23 -->
<!-- 终态封顶：见蓝图 §2.26.3 -->

## Purpose
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.23-Output -->
- Output Packet 是所有 Agent 的出口协议，用于让输出可追溯、可评审、可交接。
- 它必须承载输出主体、Intent Packet 引用、6 个 metadata 字段和下一步建议。
- Reviewer 产出的输出若涉及评审证据，必须关联 Evidence Packet。

## Schema
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.23-Output -->
- Required: `agent`, `intent_packet_id`, `content`, `metadata`, `next_actions`, `created_at`。
- `metadata` 必含 `confidence`, `cost`, `format`, `risk`, `citations`, `audience` 六字段。
- `evidence_packet_id` 可选；Reviewer 输出和 review-code/review-doc 路径必须填写。
- `next_actions` 每项包含 `agent`, `skill`, `reason`，用于显式 handoff。

## Examples
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.23-Output -->
- Researcher spec: `format=markdown`, `audience=dual`, `citations=[docs/vnext-blueprint.md#§2.21]`。
- Builder artifact: `format=code`, `risk=reversible`, `next_actions=[{agent: reviewer, skill: review-code}]`。
- Evolver memory write: `format=markdown`, `audience=agent`, `citations=[vnext/memory/user.schema.md]`。

## Validation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.23-Output -->
- Reject if any metadata key is missing; missing `audience` means the packet is incomplete.
- Reject if `risk=destructive` and no human confirmation or handoff reason is present.
- Reject if citations are required by the Agent contract but `metadata.citations` is empty.

<!-- VERIFICATION: skeleton-of-skeleton Step A - Kernel packet schema, 4 frontmatter fields, 4 sections, 0 business content -->
