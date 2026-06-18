# Source Blueprints（历史源蓝图）

本目录保存 AI Builder OS 早期设计输入和历史蓝图。它们用于追溯产品意图、架构取舍、循环工程和迁移来源，不直接作为当前 runtime 协议或 release gate 的权威源。

## 文件

- `rebuildToAIBuilderOS All.md`：AI Builder OS 重建总纲和合并蓝图。
- `rebuildToAIBuilderOS 1.md`：早期重建方案快照。
- `rebuildToAIBuilderOS 2.md`：第二轮重建方案和补充思路。
- `loopEnhance.md`：Loop Engineering / Loop Enhance 设计输入。

## 使用规则

1. 若本目录内容与当前协议冲突，以 `docs/architecture.md`、`skill-pack.json`、`kernel/`、`harness/`、`memory/`、`loops/`、`skills/builder-*` 和 `evals/` 为准。
2. 从本目录提炼新规则时，必须先形成 proposal 或 milestone plan，再落入对应的 policy、schema、loop、template 或 eval。
3. 不要把本目录的历史叙事直接复制进 active `SKILL.md`，避免恢复大而全的知识管理或第 9 个 core skill。
4. 本目录可以进入发布包，作为设计来源和审计材料；但 runtime agents 不应默认把它当作必须读取的执行上下文。

## 来源

这些文件迁入自本地资料目录：

```text
D:\Max Brain for AI Copilot\30_Projects\personal\AI Builder OS
```
