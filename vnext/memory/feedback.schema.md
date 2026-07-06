---
name: feedback
type: memory-schema
status: draft
---

# Memory Schema: feedback

<!-- P0 实现范围：见蓝图 §2.22 -->
<!-- 终态封顶：见蓝图 §2.26.3 -->

## Purpose
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.22-feedback -->
- `feedback` memory 记录用户纠错、明确负反馈或对 AI 输出方式的修正。
- 它服务于后续质量改进，必须保留触发反馈的来源和被纠正对象。
- 普通赞同、一次性偏好或未指向具体问题的情绪反馈不直接写入。

## Schema
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.22-feedback -->
- Required: `id`, `type=feedback`, `scope`, `status`, `source`, `confidence`, `last_verified`, `detail_ref`, `content`。
- `source` 必含 session_id、timestamp 和接收 correction 的 Agent。
- `detail_ref` 必须指向包含上下文、错误类型和修正路径的 topic file。

## Lifecycle
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.22-feedback -->
- 写入前判断反馈是否已有同主题条目；重复反馈合并为趋势，不新增平行条目。
- 高严重度或重复三次的 feedback 触发 Evolver 审计相关 Skill、Agent 或规则。
- 修复完成并通过验证后，保留 feedback 但更新 `status` 或 `last_verified`。

## Examples
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.22-feedback -->
- Synthetic: `content: 上次报告把 status 和 grade 混用，后续必须区分生命周期与成熟度`。
- Synthetic: `content: 用户指出不要只给抽象理解，要覆盖整体愿景、路径和标准`。
- Reject: `content: 用户说好`，因为缺少可执行纠错或改进信号。

<!-- VERIFICATION: skeleton-of-skeleton Step A - Memory schema, 4 frontmatter fields, 4 sections, 0 business content -->
