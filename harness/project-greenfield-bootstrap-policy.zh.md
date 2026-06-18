# Greenfield Bootstrap Policy

本策略定义用户从 0 开始使用 AI Builder OS 创建项目或产品时的最小 bootstrap 行为。目标是建立项目锚点，而不是生成一整套沉重项目文档。

## Trigger

使用 `greenfield` 的典型信号：

- 用户明确说“从 0 开始”“新项目”“新产品”“先帮我搭一个方向”。
- 当前项目目录没有稳定 README、Spec、代码、原型或历史决策。
- 用户只提供想法、问题、目标用户或业务机会。
- `.ai-builder/` 和 artifact index 不存在。

## Minimum Inputs

如果缺少以下信息，应先提问或标记为 open question：

- 项目或产品意图。
- 目标用户或使用者。
- 当前要解决的问题。
- 第一阶段期望结果。
- 明确 non-goals 或暂不做事项。
- 关键约束，例如时间、技术、数据、权限、发布或合规。

## Minimum Output

Greenfield bootstrap 至少输出：

```yaml
greenfield_bootstrap:
  project_mode: greenfield
  project_anchor:
    project_name:
    product_intent:
    primary_users:
    current_phase:
  success_criteria:
    - criterion:
  non_goals:
    - item:
  constraints:
    - constraint:
  proposed_runtime:
    path: .ai-builder/
    create_now: false
    reason:
  project_profile_proposal:
    status: proposal_only
    summary:
  artifact_index_update_proposal:
    status: proposal_only
    proposed_entries:
      - path:
        artifact_type:
        proposed_status: draft | working
        reason:
  recommended_next_skill: builder-frame | builder-spec | builder-agent-task
  next_action:
```

## Bootstrap Rules

- 默认只提出 `.ai-builder/` runtime 建议，不自动创建。
- 初始产物默认是 `draft` 或 `working`，不得直接标记为 `current`。
- 如果用户只有模糊想法，下一步必须先进入 `builder-frame`。
- 如果用户已有清晰业务目标、范围和验收标准，可以进入 `builder-spec`。
- 如果用户已经要交给外部 agent 执行，可以进入 `builder-agent-task`，但必须带上 `artifact_index_update_proposal`。
- 不一次性生成大量模板；只生成当前下一步需要的最小资产。

## Recommended Initial Assets

仅在用户确认或任务明确要求时，建议创建：

- Project Profile：记录项目锚点、模式、事实、假设和下一步。
- Feature Frame：当项目意图还未成型。
- Decision Record：当已有关键取舍或约束。
- Artifact Index：当已经有可复用资产需要登记。

## Anti-Patterns

- 把 greenfield bootstrap 变成完整 PRD、路线图、数据库设计、页面设计和 Agent Task 的混合大文档。
- 在没有 review 或用户确认前，把初稿标记为 `current`。
- 因为目录为空就自动创建 `.ai-builder/`。
- 自动生成一堆空文件作为“项目初始化”。
- 跳过用户、问题、non-goals，直接进入实现任务。

## Handoff

Greenfield bootstrap 的 handoff 必须保留：

- project_mode。
- project anchor。
- facts / assumptions / open questions。
- proposed runtime path。
- artifact index update proposal。
- recommended next skill。
