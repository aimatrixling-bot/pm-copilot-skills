---
title: Naming Rules — Project & Content Files
type: reference
scope: branch-specific
status: active
owner_skill: manage-file
related_blueprint_sections: [§2.21, §2.24]
---

# 命名规则 — 项目与内容文件

## 1. 稳定约定（铁律层）

- **短标识大小写（Slug case）**：英文 slug 使用 kebab-case 小写，例如 `prd.md` 和 `decision-log.md`。
- **中文原名**：书名、人名和产品名按原样保留，例如 `俞军产品方法论/` 或 `The_Lean_Startup/`；不要转换为拼音。
- **同级消歧**：当两个同级文件在语义上重叠时，添加范围后缀，例如 `prd.md`、`prd-template.md` 或 `prd-v1.md`；不允许同名但含义不同。
- **final-final 禁止**：不要创建 `final.md`、`真的最终.md` 或 `final-v2.md`；版本演进使用 `vN` 后缀。
- **隐藏和系统文件**：不要创建 `.draft`、`.tmp` 或 `~backup`；隔离临时输出使用 `_sandbox/`。

## 2. vN 后缀规则

- `draft-v1.md` 和 `prd-v2.md` 表示迭代版本。
- 对实质性内容变更提升 `vN`：结构变化、章节增删或关键决策修订。
- 不因润色、错别字、格式调整或单行措辞变化提升版本。
- 提升版本前，确认上一版本是否已归档，避免 `prd-v1.md` 和 `prd.md` 都被视为活动态。

## 3. 禁止模式

- 活动文件名中包含空格。
- 中文标点，除非书名号是保留标题的一部分。
- Windows 非法字符：`< > : " / \ | ? *`。
- 活动文件使用 `2026-04-foo.md` 这类日期前缀；日期前缀只用于归档快照。
- 全大写英文名称，但 `README.md` 或 `CONTRIBUTING.md` 这类社区约定除外。

## 4. 用户偏好（scope: user-preference）

这些是 Max 的个人偏好，不是全局规则；分支可以继承或覆盖它们。

- 只有当 `_index.md` 字母序不足以表达顺序时，才使用 `01_` 到 `99_` 的数字前缀。
- 文章目录可以使用 `YYYY-MM_topic_snake_case`，例如 `2026-04_pm_copilot_agent`。
- `yyyymmdd` 后缀只用于归档快照；见 `versioning-rules.md`。

迁移到另一个分支时可以保留这些偏好，但它们不应成为拒绝某个文件名的唯一理由。
