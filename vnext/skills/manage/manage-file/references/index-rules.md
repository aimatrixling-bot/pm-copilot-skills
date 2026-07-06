---
title: Index Rules — _index.md Update Triggers
type: reference
scope: branch-specific
status: active
owner_skill: manage-file
related_blueprint_sections: [§2.21, §2.24]
---

# 索引规则 — _index.md 更新触发条件

## 1. _index.md 必须更新的情况

- 在模块根目录、项目根目录或文章目录中创建顶层文件。
- 将顶层文件移动到另一个目录。
- 将顶层文件归档到 `90_Archive/`。
- 在 slug 变化时重命名顶层文件。
- 创建应出现在导航中的模块子目录。

## 2. _index.md 只需检查的情况

- 移动后，验证现有链接仍可解析。
- 涉及三个或更多文件的批量操作后，检查是否出现导航漂移。
- 触碰长期陈旧目录时，检查 index 是否仍描述当前内容。

## 3. _index.md 不需要的情况

- 不改变路径或 slug 的内部内容编辑。
- 不属于正式结构的 `_sandbox/` 隔离输出。
- 当父级 index 只跟踪顶层条目时，在子目录内创建文件。
- 已归档目录内的编辑。

## 4. 协作边界

- **manage-file**：当 create、move、rename 或 archive 改变导航时立即同步。
- **evolve-kb-check**：周期性审计 dead links、orphan files 和 index drift；此 user skill 不属于 vNext P0。
- **evolve-doc-check**：周期性审计文档不一致；此 user skill 不属于 vNext P0。
- 边界原则：manage-file 不运行周期性审计；evolve-* checks 不执行即时路径同步。

## 5. _index.md 的 Frontmatter

模块级 `_index.md` 文件使用 `title`、`description` 和 `last_updated`。

当 index 文件变化时，在同一次编辑中更新 `last_updated`。
