# Brownfield Router Output 示例

本示例展示用户已有本地项目资产、中途引入 AI Builder OS 时，`builder-router` 应如何输出 Project Onboarding 信息。

## 输入

```text
这个本地仓库已经有 README、docs、src 和一些旧 PRD，我现在想中途接入 AI Builder OS，先帮我判断该怎么开始。
```

## Router Output

```yaml
route_type: skill_route
recommended_mode: skill
recommended_skill: builder-review
project_mode: brownfield
project_profile_proposal:
  status: proposal_only
  project_root: user_provided_or_current_workspace
  project_runtime_status: missing
  artifact_index_status: missing
  create_ai_builder_runtime: false
  proposed_runtime_path: .ai-builder/
  scanned_scope:
    - path: README
      status: proposed_to_read
    - path: docs/
      status: proposed_top_level_only
    - path: src/
      status: do_not_scan_deep_without_plan
    - path: old PRD files
      status: candidate_legacy_assets
  asset_map:
    source_of_truth_candidates:
      - path: README.md
        truth_scope: project overview and setup
        confidence: unknown_until_read
        reason: 用户提到仓库已有 README
      - path: docs/
        truth_scope: product or architecture documentation
        confidence: unknown_until_read
        reason: 用户提到已有 docs
    working_assets:
      - path: src/
        reason: 当前实现可能反映真实系统行为，但不等于业务 source of truth
    legacy_or_stale_candidates:
      - path: old PRD files
        reason: 用户称为旧 PRD，可能已被替代
    temp_or_process_assets: []
  facts:
    - fact: 用户说明项目已有 README、docs、src 和旧 PRD
      evidence: 用户输入
  assumptions:
    - assumption: 旧 PRD 可能不是当前可信需求
      risk: 如果直接作为 current spec 使用，可能误导后续任务
  open_questions:
    - question: 当前业务规则以 README、docs、代码、测试还是某份 PRD 为准？
      blocks: source-of-truth confirmation
    - question: 哪些目录禁止读取或需要人工授权？
      blocks: intake scope
  artifact_index_update_proposal:
    status: proposal_only
    proposed_entries:
      - path: README.md
        artifact_type: analysis
        proposed_status: working
        reason: 候选项目入口，需读取后确认
      - path: docs/
        artifact_type: analysis
        proposed_status: working
        reason: 候选文档资产范围，需进一步审计
  cleanup_proposal:
    safe_to_delete: []
    archive_instead: []
    needs_human_decision:
      - path: old PRD files
        question: 这些旧 PRD 是否仍解释历史决策或业务约束？
    do_not_touch:
      - path: src/
        reason: 代码、脚本、HTML、测试或配置不得在 onboarding 阶段自动清理
      - path: README.md
        reason: 候选项目入口，不得自动删除或移动
recommended_next_skill: builder-review
reasoning_summary:
  - 这是已有项目中途接入场景，应先做 Brownfield Intake。
  - 当前不能直接宣布 source of truth，只能标记候选并提出审计范围。
  - 下一步应由 builder-review 做资产可信度、一致性和 cleanup proposal 审计。
missing_context:
  - 项目根目录
  - 授权读取范围
  - 当前可信业务规则来源
  - 是否已有测试或 Evidence Packet
risk_flags:
  - risk: 旧 PRD 和当前实现可能冲突
    severity: P1
  - risk: 深扫全仓库可能超出用户授权或上下文预算
    severity: P1
  - risk: 自动迁移或删除旧文件可能破坏历史追溯
    severity: P0
next_prompt: |
  请使用 builder-review，对用户授权范围内的 README、docs 顶层索引、旧 PRD 和必要项目 manifest 做 Brownfield Intake。
  输出 asset map、source-of-truth candidates、conflicts、missing_context、artifact_index_update_proposal 和 cleanup_proposal。
  不要自动扫描全仓库，不要移动、删除、重命名任何文件。
handoff_packet:
  intent: 中途接入已有本地项目资产
  project_mode: brownfield
  project_profile_proposal_status: proposal_only
  recommended_next_skill: builder-review
  forbidden_actions:
    - 不要自动创建 `.ai-builder/`
    - 不要自动写入 artifact-index.yaml
    - 不要自动扫描全仓库
    - 不要自动迁移、删除、重命名或归档文件
```

## 说明

这个输出的关键是：Brownfield 不是“整理文件”的同义词。它的第一步是保护已有资产，识别候选真相源和冲突，再把任何清理或迁移动作放进 proposal。
