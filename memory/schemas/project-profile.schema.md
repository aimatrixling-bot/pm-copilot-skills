# Project Profile Schema

Project Profile 记录 AI Builder OS 首次进入或恢复一个项目时的项目锚点、进入模式、已知资产、source-of-truth 候选和下一步建议。它不是完整知识库，也不是自动初始化结果；在没有人工确认前，它只是一份 onboarding proposal。

## Project Mode

| Mode | 含义 | 默认下一步 |
| --- | --- | --- |
| `greenfield` | 项目从 0 开始，尚无稳定本地资产或产品真相源 | 建立项目锚点，通常交给 `builder-frame` |
| `brownfield` | 项目已有文档、代码、原型、脚本、日志或历史决策 | 做资产盘点和 source-of-truth 候选，通常交给 `builder-review` |
| `resume` | 项目已有 `.ai-builder/` 或等价 profile/index，可从既有状态继续 | 读取当前 profile、artifact index 和 handoff，再路由 |
| `unknown` | 缺少足够证据判断项目模式 | 先提问或输出最小检查清单 |

## Schema

```yaml
project_profile:
  project_id:
  project_name:
  project_mode: greenfield | brownfield | resume | unknown
  project_root:
  created_at:
  updated_at:
  created_by:
  source_request:
  current_phase:
  product_intent:
  primary_users:
  success_criteria:
    - criterion:
  constraints:
    - constraint:
  project_runtime_status: missing | proposed | existing | stale | blocked
  artifact_index_status: missing | proposed | existing | stale | blocked
  known_assets:
    - path:
      asset_type: readme | spec | decision | prototype | code | script | html | evidence | log | config | test | temp | unknown
      role: source_of_truth_candidate | reference | working | temp | legacy | unknown
      confidence: confirmed | inferred | unknown
      reason:
  source_of_truth_candidates:
    - path:
      truth_scope:
      reason:
      confidence: confirmed | inferred | unknown
      conflicts_with:
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
  risk_flags:
    - risk:
      severity: P0 | P1 | P2 | P3
  onboarding_proposal:
    create_ai_builder_runtime: true | false
    proposed_runtime_path:
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
    human_decisions_required:
      - question:
  recommended_next_skill:
  next_action:
```

## Field Rules

| Field | Rule |
| --- | --- |
| `project_mode` | 必须基于可观察证据判断；证据不足时使用 `unknown`，不要猜测。 |
| `project_runtime_status` | 只描述 `.ai-builder/` 或等价 runtime 是否存在；不得自动创建目录。 |
| `artifact_index_status` | 只描述 artifact index 状态；不得声称已写入 index，除非有可验证证据。 |
| `known_assets` | 只登记本次 onboarding 读取或用户提供的资产，不做无边界全盘索引。 |
| `source_of_truth_candidates` | 只能标记候选，不等同于人工确认的 source of truth。 |
| `cleanup_proposal` | Brownfield 中任何删除、迁移、重命名都必须进入 proposal；不得自动执行。 |
| `recommended_next_skill` | 应从 8 个 core skills 中选择；Project Onboarding Protocol 不是第 9 个 skill。 |

## Minimum Greenfield Example

```yaml
project_profile:
  project_id: project-20260618-001
  project_name: 新客户成功工具
  project_mode: greenfield
  project_root: "."
  current_phase: idea
  product_intent: 帮助客户成功经理跟踪客户健康度和下一步行动
  primary_users:
    - 客户成功经理
  success_criteria:
    - criterion: 能在一个页面看到高风险客户和推荐跟进行动
  constraints:
    - constraint: 先做原型，不接生产 CRM
  project_runtime_status: proposed
  artifact_index_status: proposed
  known_assets: []
  source_of_truth_candidates: []
  facts:
    - fact: 项目从 0 开始，没有既有本地资产
      evidence: 用户说明
  assumptions: []
  open_questions:
    - question: 第一版面向哪个客户分层？
      blocks: spec readiness
  risk_flags: []
  onboarding_proposal:
    create_ai_builder_runtime: false
    proposed_runtime_path: .ai-builder/
    artifact_index_update_proposal:
      status: proposal_only
      proposed_entries: []
    cleanup_proposal:
      safe_to_delete: []
      archive_instead: []
      needs_human_decision: []
      do_not_touch: []
    human_decisions_required:
      - question: 是否接受 `.ai-builder/` 作为后续项目记忆目录？
  recommended_next_skill: builder-frame
  next_action: 先生成 Feature Frame，再决定是否进入 spec。
```

## Minimum Brownfield Example

```yaml
project_profile:
  project_id: project-20260618-002
  project_name: 既有订单系统改造
  project_mode: brownfield
  project_root: "."
  current_phase: existing_product_intake
  product_intent: 在不破坏既有订单链路的前提下理解项目现状
  primary_users: []
  success_criteria:
    - criterion: 识别可信入口、冲突资产和下一步审计范围
  constraints:
    - constraint: 不自动迁移、删除、重命名任何文件
  project_runtime_status: missing
  artifact_index_status: missing
  known_assets:
    - path: README.md
      asset_type: readme
      role: source_of_truth_candidate
      confidence: confirmed
      reason: 项目入口说明
    - path: docs/old-prd.md
      asset_type: spec
      role: legacy
      confidence: inferred
      reason: 文件名显示可能是旧需求
  source_of_truth_candidates:
    - path: README.md
      truth_scope: project setup
      reason: 当前项目入口说明
      confidence: confirmed
      conflicts_with: []
  facts:
    - fact: 项目已有 README 和 docs 目录
      evidence: 本次读取范围
  assumptions:
    - assumption: docs/old-prd.md 可能不是当前需求
      risk: 误用旧 PRD
  open_questions:
    - question: 当前业务规则以 README、docs 还是代码测试为准？
      blocks: source-of-truth confirmation
  risk_flags:
    - risk: 可能存在多个互相冲突的需求来源
      severity: P1
  onboarding_proposal:
    create_ai_builder_runtime: false
    proposed_runtime_path: .ai-builder/
    artifact_index_update_proposal:
      status: proposal_only
      proposed_entries:
        - path: README.md
          artifact_type: analysis
          proposed_status: working
          reason: 候选项目入口，需人工确认
    cleanup_proposal:
      safe_to_delete: []
      archive_instead: []
      needs_human_decision:
        - path: docs/old-prd.md
          question: 这份旧 PRD 是否仍有业务价值？
      do_not_touch:
        - path: README.md
          reason: 当前候选入口，不能自动删除
    human_decisions_required:
      - question: 哪些文件应作为当前 source of truth？
  recommended_next_skill: builder-review
  next_action: 先做 Brownfield asset review，再决定是否初始化 artifact index。
```

## Usage Rule

Project Profile 用于帮助后续 skill 知道“当前项目处于什么进入状态”。它不得用于自动创建项目 runtime、自动写入 artifact index、自动迁移文件或自动删除文件。
