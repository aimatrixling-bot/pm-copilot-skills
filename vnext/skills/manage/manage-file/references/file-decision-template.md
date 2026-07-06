---
title: File Decision Record — Optional YAML Template
type: reference
scope: branch-specific
status: active
owner_skill: manage-file
related_blueprint_sections: [§2.21, §2.24]
---

# File Decision Record — 可选 YAML 模板

## 1. 何时产出

此记录是可选的。仅建议用于非平凡文件操作：

- `move`：跨目录移动。
- `rename`：slug 变化。
- `version`：活动版本提升或归档快照。
- `archive`：移动到 `90_Archive/`。

不要为 create、内容编辑或格式调整产出 File Decision Record。

## 2. 为什么可选

Max Brain 是知识仓库。要求每次操作都写 YAML 会制造膨胀（Bloat），并违反渐进披露（Progressive Disclosure）。

当多文件操作、跨模块移动和归档决策需要可重放理由时，此记录很有用。

## 3. 模板

```yaml
# 可选 File Decision Record — 由 manage-file 产出
# 触发：move / rename / version / archive
id: <stable-unique-id>
operation: <move|rename|version|archive>
path_before: <relative-path or null>
path_after: <relative-path>
requester: <agent-name or user>
conflict_decision: <skip|overwrite|merge|rename-target|archive-then-write>
evidence:
  existence_check_before: <yes|no|n/a>
  existence_check_after: <yes>
  diff_or_stat: <one-line summary>
  index_impact: <updated|none|n/a>
rationale: <one-sentence why this operation was chosen>
timestamp: <ISO 8601>
```

## 4. 存储

不要创建独立的 decision-record 文件。

将记录存放在调用方 Skill 的 Output Packet `metadata` 字段或任务证据中。

## 5. 不做什么

- 不要求每次操作都产出记录。
- 不创建 Decision Record index；这会与 `_index.md` 重叠。
- 不替代 git log；该记录解释为什么，git 记录改变了什么。
