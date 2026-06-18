# Project Onboarding Policy

本策略定义 AI Builder OS 首次进入或恢复一个项目时的最小判断和交接规则。它是 Memory / Harness / Artifact Governance 的横切协议，不是新的核心 skill。

## 目标

Project Onboarding 解决三个问题：

- 当前项目是从 0 开始、已有资产中途接入，还是恢复既有 AI Builder OS 项目。
- 当前应读取哪些最小上下文，避免把旧文件、过程文件或参考文件误当 source of truth。
- 是否需要生成 project profile、artifact index 初始化建议、资产盘点或人工决策问题。

## 适用场景

- 用户第一次在某个项目中使用 AI Builder OS。
- 用户说“从零开始做一个项目/产品”。
- 用户说“这里已有项目/代码/文档，帮我接入 AI Builder OS”。
- 用户要求整理、继续、理解、接管一个本地项目。
- Artifact Hygiene Loop 发现 `.ai-builder/` 或 artifact index 不存在，需要初始化建议。

## 不适用场景

- 用户只是问一个简单问题。
- 用户已经给出明确的单次任务、目标文件和验收标准。
- 用户明确要求 review 某个已知产物；此时直接用 `builder-review`。
- 用户明确要求生成 Agent Task Packet；此时直接用 `builder-agent-task`，但应携带 artifact proposal。

## Project Mode 判断

按以下顺序判断：

1. 如果存在 `.ai-builder/`、project profile 或 artifact index，且路径可信，使用 `resume`。
2. 如果用户明确说明项目从 0 开始，或当前目录没有可复用资产，使用 `greenfield`。
3. 如果当前目录已有 README、docs、src、package、tests、design、prototype、scripts、logs 等资产，使用 `brownfield`。
4. 如果缺少项目根目录、授权范围或证据，使用 `unknown`，先输出最小澄清问题。

不得仅凭项目名称、聊天记忆或文件数量推断 project mode。

## 最小读取范围

默认只读取用户指定范围或当前项目根的低风险入口文件：

- `README*`
- `AGENTS.md`
- `package.json` / `pyproject.toml` / `Cargo.toml` / 等价项目 manifest
- `docs/` 顶层索引
- `spec/`、`requirements/`、`adr/`、`decisions/` 的顶层索引
- 已存在的 `.ai-builder/` runtime 文件

如需全仓库盘点，必须先输出 Plan，说明范围、成本、风险和停止条件。

## 输出契约

```yaml
project_onboarding_report:
  project_mode: greenfield | brownfield | resume | unknown
  project_root:
  scanned_scope:
    - path:
  facts:
    - fact:
      evidence:
  assumptions:
    - assumption:
      risk:
  open_questions:
    - question:
      blocks:
  project_profile_proposal:
    path:
    summary:
  artifact_index_update_proposal:
    status: none | proposal_only
    proposed_entries:
      - path:
        artifact_type:
        proposed_status:
        reason:
  cleanup_proposal:
    safe_to_delete:
      - path:
        reason:
    archive_instead:
      - path:
        reason:
    needs_human_decision:
      - path:
        question:
    do_not_touch:
      - path:
        reason:
  recommended_next_skill:
  next_action:
```

## 通用规则

- Project Onboarding 只输出报告和 proposal，不自动写入用户项目。
- 不自动创建 `.ai-builder/`。
- 不自动扫描全盘。
- 不自动迁移、删除、重命名或归档文件。
- 不把 source-of-truth candidate 说成已确认 source of truth。
- 不把聊天上下文置于 durable artifact 之上。
- 如果项目已有规则冲突，优先读取 durable artifacts，再提出冲突和人工决策问题。

## Stop Conditions

遇到以下情况必须停止并要求人工确认：

- 用户要求删除、移动或重命名已有项目资产。
- 同一范围存在多个互相冲突的 source-of-truth 候选。
- 涉及生产配置、权限、认证、真实数据、合规、安全或发布行为。
- 扫描范围过大，可能造成上下文、时间或权限风险。
- 无法确认项目根目录。

## 与后续 skill 的交接

- `greenfield` 通常交给 `builder-frame`，先形成 Feature Frame。
- `brownfield` 通常交给 `builder-review`，先做资产可信度和一致性审计。
- `resume` 通常交给 `builder-router`，基于既有 profile 和 artifact index 决定下一步。
- 明确需要交给外部 agent 执行时，交给 `builder-agent-task`，并携带 `artifact_index_update_proposal`。
