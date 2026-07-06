---
title: Path Authority Map — Sub-path Placement
type: reference
scope: branch-specific
status: active
owner_skill: manage-file
related_blueprint_sections: [§2.21, §2.24]
---

# 路径权限映射 — 子路径放置

## 1. paths 范围

`manage-file` frontmatter 将文件操作限制在 `["30_Projects/**", "40_Content/**"]`。

除非用户显式改变任务边界，否则在此范围之外的路径会在决策流程开始前被拒绝。

## 2. 子路径权限表

| 模块 | 子路径 | 内容 | 命名 |
|---|---|---|---|
| `30_Projects/company/{project}/` | project root | `prd.md`、`decision_log.md`、`airtable_design.md` 和标准公司项目文档 | snake_case |
| `30_Projects/company/{project}/` | `research/`、`specs/`、`docs/`、`scripts/` | 项目子模块 | kebab-case |
| `30_Projects/personal/{project}/` | project root 和子模块 | 具有相同通用结构的个人项目文档 | snake_case |
| `40_Content/` | 文章目录 | 单篇文章工作区 | `YYYY-MM_topic_snake_case` |
| `40_Content/{article}/` | 文章资产 | `draft-v1.md`、`final-article.md`、`cover.png` | kebab-case |
| `90_Archive/` | 归档树 | 仅用于溯源（provenance）的完整项目归档 | 保留原始命名 |

## 3. 范围外路径（自动拒绝）

- `00_System/`、`10_Library/`、`20_Skills/` 和 `50_Career/`，除非用户另有显式指示。
- `.claude/` 或 `.ai-builder/` 等隐藏目录。
- 任何 `.env`、secret、token 或 CI/CD 配置。
- v1 source、blueprint 文件或另一个项目的 working tree。
- 项目根目录下未分类模块归属的散落文件。

## 4. 歧义触发查阅

在以下情况查阅本 reference 并请求用户确认：

- 用户指定路径位于表格之外。
- 移动跨越模块，例如从 `40_Content/` 到 `30_Projects/`。
- 同名文件出现在不同模块中。
- 新的 project-root 文件缺少明确的子模块 owner。
