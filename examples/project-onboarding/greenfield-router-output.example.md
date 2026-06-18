# Greenfield Router Output 示例

本示例展示用户从 0 开始一个新项目时，`builder-router` 应如何输出 Project Onboarding 信息。

## 输入

```text
我想从 0 开始做一个客户成功 AI 工具，现在还没有代码和文档，先帮我进入 AI Builder OS。
```

## Router Output

```yaml
route_type: skill_route
recommended_mode: skill
recommended_skill: builder-frame
project_mode: greenfield
project_profile_proposal:
  status: proposal_only
  project_root: unknown
  project_runtime_status: proposed
  artifact_index_status: proposed
  create_ai_builder_runtime: false
  proposed_runtime_path: .ai-builder/
  project_anchor:
    project_name: 客户成功 AI 工具
    product_intent: 帮助客户成功团队识别客户风险并推进下一步行动
    current_phase: idea
    primary_users:
      - 客户成功经理
  facts:
    - fact: 用户明确说明从 0 开始，暂无代码和文档
      evidence: 用户输入
  assumptions:
    - assumption: 第一阶段应先明确问题、用户、场景和成功标准
      risk: 如果直接进入 spec 或实现，容易过早扩大范围
  open_questions:
    - question: 第一版面向哪类客户或哪类客户成功场景？
      blocks: spec readiness
    - question: 是否接受 `.ai-builder/` 作为后续项目记忆目录？
      blocks: runtime initialization decision
  artifact_index_update_proposal:
    status: proposal_only
    proposed_entries: []
  cleanup_proposal:
    safe_to_delete: []
    archive_instead: []
    needs_human_decision: []
    do_not_touch: []
recommended_next_skill: builder-frame
reasoning_summary:
  - 项目从 0 开始，当前没有稳定资产可评审。
  - 需要先建立 Feature Frame，而不是直接生成 PRD、原型或 Agent Task Packet。
  - Project Onboarding 只提出 profile/runtime/index 建议，不创建 `.ai-builder/`。
missing_context:
  - 目标用户细分
  - 第一阶段成功标准
  - non-goals
risk_flags:
  - risk: 直接进入实现会导致范围膨胀
    severity: P2
  - risk: 自动初始化项目 runtime 可能写入用户未确认的目录
    severity: P1
next_prompt: |
  请使用 builder-frame，把“客户成功 AI 工具”整理成 Feature Frame。
  要求区分事实、假设和 open questions，并明确 non-goals、success criteria 和 spec_readiness。
handoff_packet:
  intent: 从 0 开始建立客户成功 AI 工具的项目锚点
  project_mode: greenfield
  project_profile_proposal_status: proposal_only
  recommended_next_skill: builder-frame
  forbidden_actions:
    - 不要自动创建 `.ai-builder/`
    - 不要自动写入 artifact-index.yaml
    - 不要生成大而全 PRD
    - 不要直接进入代码实现
```

## 说明

这个输出的关键是：`builder-router` 只做进入判断和下一步路由。它不会初始化项目文件，也不会把初始想法包装成已确认的项目真相。
