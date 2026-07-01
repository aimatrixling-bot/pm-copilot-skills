# 项目记忆 Schema（Project Memory Schema）

Project Memory 让未来 session 不依赖原始聊天记录也能继续工作。它捕获项目当前状态、约束、已知资产、未解决问题和决策引用。**AI Builder OS 不得自动创建、迁移、删除或重命名用户项目文件**——Project Memory 是 proposal，写入用户项目需人类确认。

## Schema

```yaml
project_name:
project_anchor:
goal:
background:
current_phase: discovery | framing | spec | prototype | build | review | release | maintenance | paused | completed
constraints:
  - type: technical | business | regulatory | resource | time
    description:
    source:
known_assets:
  - artifact_id:
    relation: owns | depends_on | produced | consumes | references
    path:
    status:
current_artifact:
open_questions:
  - question:
    blocking: true | false
    unblock_action:
decisions_refs:
  - decision_id:
risks:
next_step:
status: active | paused | completed | archived
last_updated:
last_updated_by:
```

## Field Rules

| Field | Type | Required | 写入时机 | 读取时机 | 生命周期 |
| --- | --- | --- | --- | --- | --- |
| `project_name` | string | ✅ | 项目创建时 | 识别当前项目 | 永久 |
| `project_anchor` | string | ✅ | 项目创建时 | 定位项目根 | 永久 |
| `current_phase` | enum | ✅ | 每次阶段切换 | router 决定下一步 | 滚动更新 |
| `constraints` | object[] | ✅ | 发现约束时 | spec/decision 判断可行性 | 永久 |
| `known_assets` | object[] | ✅ | 产物创建/变更时 | review 评估资产健康 | 跟随资产生命周期 |
| `current_artifact` | string | ✅ | 每次产物切换 | handoff 时定位上下文 | 滚动更新 |
| `open_questions` | object[] | ⚠️ | 有未解决问题时 | 决定是否阻塞下一步 | resolved 后归档 |
| `decisions_refs` | string[] | ⚠️ | 项目级决策落地时 | 防止重复争论 | 永久 |
| `status` | enum | ✅ | 默认 active | 决定是否加载 | active→paused→completed→archived |
| `last_updated` | date | ✅ | 每次写入 | 判断新鲜度 | 滚动更新 |
| `last_updated_by` | string | ✅ | 每次写入 | 审计 | 滚动更新 |

## Minimum Example

```yaml
project_name: AI Builder OS
project_anchor: D:\Max Brain for AI Copilot\30_Projects\personal\AI Builder OS
goal: 把 v1.0.6 推到 v1.1，使 8 skills 真正符合 playbook 标准，Memory schema 达到黄金标准，Product Track 具备可交付能力
background: |
  v1.0.6 已具备完整 Builder Kernel + 8 skills + 15 templates + Definition Sync Loop + Source-of-Truth Map（38 行），
  但与 14 节产品愿景对比仍有 4 类系统性差距：skill 内核、memory 分层、product track、evals。
current_phase: build
constraints:
  - type: business
    description: 用户定位为 Builder (P1)，但兼顾 PM 场景（PRD 文档类交付）
    source: 用户口述（2026-07-01）
  - type: technical
    description: 不破坏 8-skill 红线、不新增第 9 个 core skill、不做大规模目录重构
    source: docs/builder-alignment-plan-v1.1.md Scope Boundaries
known_assets:
  - artifact_id: plan-v1.1-alignment
    relation: owns
    path: docs/builder-alignment-plan-v1.1.md
    status: current
  - artifact_id: source-of-truth-map
    relation: references
    path: docs/source-of-truth-map.md
    status: current
current_artifact: docs/builder-alignment-plan-v1.1.md
open_questions:
  - question: P0.1 中 Skill Hardening Brief 暴露 12-15 字段的具体子集是否需要 per-skill 定制
    blocking: false
    unblock_action: 在 builder-decision 完成后由用户审阅模板，再批量化
decisions_refs:
  - decision-ai-builder-os-8-core-skills
risks:
  - 计划跨多个压缩窗口，需 docs 持久化防丢失
next_step: 执行 P0.4（四个 Memory Schema 升级），然后 P0.1（八个 SKILL.md 公式套用）
status: active
last_updated: 2026-07-01
last_updated_by: claude-code-session
```

## Usage Rule

Use Project Memory 在新 session 启动时恢复项目上下文，或在 handoff 时交接给下一个 skill/session。**禁止**用它替代 spec、decision-record 或 release seal——它是缓存层，不是规则源。AI Builder OS 不得基于 Project Memory 自动创建、迁移、删除或重命名用户项目文件；所有写入用户项目目录的动作必须人类确认。`status: paused/completed` 的项目进入归档前必须把长期规则迁移到正式 source-of-truth。
