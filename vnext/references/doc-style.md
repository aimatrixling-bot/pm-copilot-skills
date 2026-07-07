---
title: vNext Documentation Style Convention
type: design-decision
status: active
created_at: 2026-07-07
source: Batch 11A user decision + Batch 10-revised language audit
related_skills: []
related_blueprint_sections: [§2.25.1]
---

# vNext 文档语言约定

> 本文件定义 vnext/ 下所有 markdown 文件的语言使用约定。目的是防止 heading 中英混用扩散，保留结构性锚点的 parser 友好性。

## 范围

适用：vnext/ 下所有 .md 文件（skills / agents / kernel / memory / references / _surface.md / _index.md）。
不适用：docs/vnext-blueprint.md（蓝图，单独规范）、AGENTS.md / CLAUDE.md（仓库顶层约定）。

## 语言约定表

| 元素 | 语言 | 理由 |
|------|------|------|
| Frontmatter key | 英文 | schema freeze，validator 解析 |
| Frontmatter value（除长描述外） | 英文 enum / 中文短句允许 | enum 值强制英文（draft/stable/deprecated/P0/P1），自由文本允许中文 |
| Frontmatter 长描述（description / source / title） | 中文优先 | 用户可读 |
| Section heading（## Invocation / ## Schema 等） | 英文 | parser 锚点，validator 依赖 |
| Section body bullet | 中文 | 可读性 |
| 文件标题（# H1） | 英文命名 | 与 frontmatter `name` 一致 |
| 代码块内容 | 跟随代码语言 | 不强制 |
| HTML 注释（`<!-- ... -->`） | 中文为主 | 内部备注，不进 parser |
| SECTION_REF 路径 | 英文 | 机器可读 |
| SECTION_REF 锚点文字 | 跟随蓝图章节实际命名 | 与蓝图一致 |

## 已知不一致处理

- `vnext/kernel/*.schema.md`、`vnext/memory/*.schema.md`：当前 `## Purpose / ## Schema / ## Examples / ## Validation` 英文 heading + 中文 bullet — **本约定符合，保留**
- `vnext/skills/*/SKILL.md`：已中文化（部分 heading 英文保留作 parser 锚点）— **本约定符合**
- 未来如发现 heading 半中半英（如某文件 `## 用途` 另一文件 `## Purpose`），按本约定改为统一英文 heading

## 不做的事

- 不把英文 heading 强制中文化（parser 依赖）
- 不把 frontmatter key 强制中文化（schema freeze）
- 不重写已存在文件的 bullet 风格（保留作者意图）

## Reference

- 蓝图 §2.25.1 定义 vnext/ 文件清单
- `vnext/references/skill-authoring.md` 定义 skill 文件写作规范（与本文件正交，本文件管语言约定，skill-authoring 管 skill 结构）
