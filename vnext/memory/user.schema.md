---
name: user
type: memory-schema
status: draft
---

# Memory Schema: user

<!-- P0 实现范围：见蓝图 §2.22 -->
<!-- 终态封顶：见蓝图 §2.26.3 -->

## Purpose
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.22-user -->
- `user` memory 记录跨项目稳定的用户偏好、沟通方式和长期 quirks。
- 只有重复出现、用户明确表达或对后续协作有持续影响的信号才可写入。
- 临时任务状态、当前文件进度或一次性偏好不得进入 user memory。

## Schema
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.22-user -->
- Required: `id`, `type=user`, `scope`, `status`, `source`, `confidence`, `last_verified`, `detail_ref`, `content`。
- `scope` 通常为 `global` 或 `project`；global scope 写入必须有人类确认。
- `content` 只保留一行摘要，长解释必须放入 `detail_ref` 指向的 topic file。

## Lifecycle
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.22-user -->
- 写入前检索同主题 memory；已有条目时 merge 或 supersede，不重复创建。
- `last_verified` 超 90 天时标记 stale，后续使用前先验证。
- 用户撤回或修正偏好时，将旧条目标为 `superseded` 或 `archived` 并记录来源。

## Examples
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.22-user -->
- Synthetic: `content: 用户偏好中文优先交付，代码标识符可保留英文`。
- Synthetic: `content: 用户要求 repo-grounded 回答，先读本地 source-of-truth`。
- Reject: `content: 用户今天看起来很赶时间`，因为这是未经确认的会话推测。

<!-- VERIFICATION: skeleton-of-skeleton Step A - Memory schema, 4 frontmatter fields, 4 sections, 0 business content -->
