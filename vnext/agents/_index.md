---
name: agents-index
type: index
status: draft
---

# Agent Index

<!-- P0 实现范围：见蓝图 §2.20 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Purpose
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.20 -->
- `vnext/agents/` 是 P0 Agent 契约目录与路由（routing）图。
- 它定义哪个 Agent 接收意图（intent）、可调用哪个 Skill 桶，以及允许哪些移交（handoff）路径。
- 本索引（index）仅用于导航；各 Agent 文件仍是角色、触发（trigger）、输出、失败和禁用行为的来源。

## Inventory
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.25.1 -->
- `supervisor.md` — 默认路由、意图解析、澄清和委派。
- `researcher.md` — 研究、证据收集、PRD/spec/文档交付。
- `builder.md` — 原型（prototype）、实现、验证和 commit 移交。
- `reviewer.md` — 文档/代码 review、Evidence Packet 和 HALO 诊断。
- `evolver.md` — Memory 写回、Skill 质量和 harness 熵减。

## Routing
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.26 -->
- 默认路由是 Supervisor，除非用户显式指定某个 Agent 且请求已经限定范围（scope）。
- 研究/document/spec 意图路由到 Researcher；原型/build/commit 意图路由到 Builder。
- review/check/test 意图路由到 Reviewer；Memory/Skill/harness 改进意图路由到 Evolver。
- 歧义或多 Agent 请求在执行前返回 Supervisor 更新 Intent Packet。

<!-- VERIFICATION: skeleton-of-skeleton Step A - Index file, 3 sections, 0 business content -->
