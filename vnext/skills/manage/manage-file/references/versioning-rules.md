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

## 6. Git 优先原则（Git Precedence）

> 适用判定：目标目录是否属于 git 仓库（含 GitHub/GitLab/Bitbucket 等云端托管）。Max Brain 知识库根目录（`D:\Max Brain for AI Copilot\`）不在 git，其下子项目（如 `30_Projects/personal/AI Builder OS`）单独决定。

### 6.1 应该用 git 而不是本地 -vN

当目标目录在 git 仓库内时，以下文件不允许本地 `-vN` 后缀，版本历史由 git 管理：

- 代码文件（`.ts`、`.py`、`.rs`、`.go`、`.java` 等）
- 配置文件（`.json`、`.yaml`、`.toml` 等）
- 已定稿的长期文档（PRD、tech-spec、`decision_log.md`）

若需探索多方案分支，使用 `git branch` 而不是本地 `-vN`。
若已存在 `prd-v1.md` `prd-v2.md` 并存，按本规则视为违规，需合并为单一活动文件并依赖 git history。

### 6.2 即使在 git 仓库内仍可使用本地 -vN 的场景

- 工作流阶段产物：文章 `draft-v1.md` → `final-article.md`（表达工作流阶段，不是版本历史）
- 同时探索的多个方案分支（必须明确标注哪个是 active，遵守 §1 "同一时间同一制品只允许一个活动态 `-vN`"）
- AI 协作场景：当 Claude/Codex 需要直接读到某版本文件，而 `git log + checkout` 成本过高时

### 6.3 不适用 Git 优先原则的场景

- Max Brain 知识库根目录及非 git 子目录
- `40_Content/` 中未加入 git 的内容
- 个人 memo、临时笔记
- `90_Archive/` 内的快照（已固化，与 git 无关）

这些场景仍按 §1-§5 的本地版本规则。

### 6.4 判定流程

1. 操作前检查目标目录是否在 git 仓库（`git rev-parse --is-inside-work-tree`）
2. 是 → 按 §6.1 / §6.2 判定
3. 否 → 按 §6.3 回退到本地版本规则
4. 不确定 → 视为非 git，保守按本地版本规则处理
