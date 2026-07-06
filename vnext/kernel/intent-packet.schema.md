---
name: intent-packet
type: packet-schema
status: draft
---

# Intent Packet Schema

<!-- P0 实现范围：见蓝图 §2.15 + §2.23 -->
<!-- 终态封顶：见蓝图 §2.26.3 -->

## Purpose
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.23-Intent -->
- Intent Packet 是 Supervisor 入口协议，用于把用户原始输入转成可路由任务。
- 它必须承载目标、验收标准、范围、歧义标志、决策卡和目标 Agent。
- 没有 Intent Packet 的复杂请求不得进入 craft、build、review 或 evolve 主路径。

## Schema
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.23-Intent -->
- Required: `raw_input`, `probe_depth`, `parsed`, `decision_card`, `reply_mode`, `routing`, `created_at`。
- `parsed` 必含 `goal`, `done_criteria`, `scope`, `ambiguity_flags`；`done_criteria` 是 list。
- `decision_card` 必含 `scope_fit`, `deadline`, `reversibility`；`routing` 必含 `target_agent`, `skills_needed`。
- Enum: `probe_depth=shallow|medium|deep`, `scope=project|session|global`, `reply_mode=action|no_reply`。

## Examples
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.23-Intent -->
- Synthetic: "帮我做个原型" → `probe_depth=medium`, `ambiguity_flags=[missing_domain, missing_acceptance]`。
- Synthetic: "根据这个 PRD 实现登录页" → `target_agent=builder`, `skills_needed=[craft-prototype]`。
- Redacted examples must not include private project text unless the source file is already in repo scope.

## Validation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.23-Intent -->
- Reject if `raw_input`, `goal`, `done_criteria`, `target_agent`, or `created_at` is missing.
- Reject if `done_criteria` is empty while `reply_mode=action`。
- Require `manage-grill` when `scope_fit=needs_clarify` or ambiguity_flags is non-empty.

<!-- VERIFICATION: skeleton-of-skeleton Step A - Kernel packet schema, 4 frontmatter fields, 4 sections, 0 business content -->
