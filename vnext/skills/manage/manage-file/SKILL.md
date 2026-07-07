---
name: manage-file
description: "Context Pointer 当项目资产需要创建、移动、重命名或版本管理时触发，路径、命名、冲突或证据未检查时失败。"
disable-model-invocation: false
can-invoke: []
paths: ["30_Projects/**", "40_Content/**"]
status: draft
owner_agent: builder
shared_with: [supervisor, researcher, reviewer, evolver]
scope: project
grade: P0
---

# manage-file

<!-- P0 实现范围：见蓝图 §2.21 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Invocation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.0-manage-file -->
- 当项目或内容资产必须创建、移动、重命名、版本管理、索引或验证时调用。
- 在依赖目录归属、`_index.md`、事实源映射（source-of-truth maps）、命名规则或回滚安全的写入操作前使用。
- 将请求方 Agent 自身的路径权限视为上限；此 Skill 不授予触碰 v1、blueprint 或无关项目文件的权限。
- 不解释 shell 语法或文件系统基础；将分支专用（branch-specific）命令细节保留在任务输出或 disclosed references 中。

## Steps
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-manage-file -->
1. 分类文件操作。Completion: 已命名 create、move、rename、version、index 或 verify，并记录请求方 Agent 和目标制品（artifact）类型。
2. 检查路径权限和放置规则。Completion: 目标是相对路径，位于 `paths` 内，位于请求方 scope 内，并由 index、blueprint、source map 或显式用户指令证明合理。当子路径放置有歧义或落在标准表之外时，查阅 skill-local `vnext/skills/manage/manage-file/references/path-authority-map.md`。
3. 应用命名和版本策略。Completion: 写入前已检查文件名、扩展名、slug/date/version marker 和目录约定。当 slug case、date marker 或 active/archive 状态有歧义时，查阅 skill-local `vnext/skills/manage/manage-file/references/naming-rules.md` 和 `vnext/skills/manage/manage-file/references/versioning-rules.md`。
4. 检测冲突和回滚需求。Completion: 变更（mutation）前已记录现有目标、重复制品、过期版本，以及所需的备份/重命名决策。
5. 执行最小文件变更。Completion: 只有预期路径集合发生变化；未引入大范围递归 move/delete 或无关格式化扰动（churn）。
6. 在操作后产出证据。Completion: 已为调用方记录存在性检查、diff/stat、moved-from/moved-to 映射或 index 影响。对于非平凡操作（move、rename、version、archive），可选使用 skill-local `vnext/skills/manage/manage-file/references/file-decision-template.md` 产出 File Decision Record，并按 `vnext/skills/manage/manage-file/references/index-rules.md` 验证 `_index.md` 更新要求。

## Reference
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- `docs/vnext-blueprint.md §2.21` 将 `manage-file` 定义为 P0 文件/目录操作 Skill，且不调用下游 Skill。
- `docs/vnext-blueprint.md §2.25.1` 定义 vNext P0 tree；§2.25.2 定义 side-by-side coexistence 和 rollback。
- `docs/vnext-blueprint.md §2.20` 表明 Researcher、Builder、Reviewer、Supervisor 和 Evolver 都可以通过 `manage-file` 路由工作。
- `vnext/references/skill-authoring.md §5.4` 定义 scope honesty；§8 将膨胀（Bloat）和 Context Pointer Miss 命名为 failure modes。
- 将操作专用 shell 命令保留在任务证据中；此 Skill 负责决策顺序和 acceptance criteria，而不是文件系统教程。

## Completion Criteria
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-manage-file -->
- 操作类型、请求方、目标路径和放置权限都是显式的。
- 路径是相对路径，已被 scope 限定，并由 index、blueprint、source map 或用户指令证明合理。
- 变更前已记录命名、版本和冲突决策。
- 结果证据证明预期路径集合发生了变化，且没有触碰无关路径。
- 任何 index、manifest 或 rollback 影响都已报告给调用方。

## Failure Modes
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- Signal: Context Pointer Miss - 目标路径无法由 index、source map、blueprint 或显式用户指令证明合理。
- Signal: Boundary Drift - 在 scoped task 中，操作触碰 v1、blueprint、无关项目或 scope 外文件。
- Signal: Conflict Blindness - 未记录决策就覆盖已有文件、重复制品或版本冲突。
- Signal: Broad Mutation - 递归 move/delete、通配符 staging 或生成的路径列表改变了超出预期 artifact 集合的内容。
- Signal: Evidence Gap - 在没有存在性、diff/stat 或移动路径证明的情况下，调用方被告知文件操作已成功。
