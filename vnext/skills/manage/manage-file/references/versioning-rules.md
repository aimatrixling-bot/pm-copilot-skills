---
title: Versioning Rules — Active vs Archive Snapshot
type: reference
scope: branch-specific
status: active
owner_skill: manage-file
related_blueprint_sections: [§2.21, §2.24]
---

# 版本规则 — 活动态与归档快照

## 1. 状态标记

- **活动态（Active）**：无日期后缀；当前事实源（source of truth），例如 `prd.md` 或 `decision-log.md`。
- **迭代态（Iteration）**：`-vN` 后缀；活动文件的中间演进，例如 `draft-v1.md` 或 `prd-v2.md`。
- **快照（Snapshot）**：`-yyyymmdd` 或 `-YYYY-MM-DD` 后缀；正常工作中只读的归档或导出快照，例如 `kb-report-20260701.md`。
- **归档（Archive，`90_Archive/`）**：完整项目归档，仅用于溯源查询（provenance lookup）。

同一时间，同一制品（artifact）只允许一个活动态 `-vN` 版本。

## 2. 何时提升版本

- 实质性变更提升 `vN`：章节增删、决策修订或结构调整。
- 润色、错别字修复、格式调整和单行措辞变化不提升 `vN`。
- 如果不确定，使用读者影响测试：diff 改变理解时提升；只改变呈现时不提升。

## 3. 何时生成快照

- `40_Content/` 文章发布后。
- 项目 closeout 或 release milestones 时。
- 对 KB health reports 和 audit reports 等周期性产出。
- 将快照写入 `90_Archive/`，或在同目录中使用日期后缀；保持活动文件不变。

## 4. 冲突处理

- 如果无后缀活动文件与 `-vN` 共存，将无后缀文件视为活动态，将 `-vN` 视为历史。
- 如果 `-v1` 和 `-v2` 对同一制品都呈现为活动态，拒绝操作；不允许并行活动版本。
- 如果快照被误认为活动态，触发 manage-file Failure Mode "Conflict Blindness"。

## 5. 不做什么

- 不要求每次编辑都提升版本。
- 不引入 Git tags；那属于 git workflow。
- 不对知识文件使用语义化版本（semantic versioning）；semver 用于代码包。
