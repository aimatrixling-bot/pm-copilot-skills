# 用户记忆 Schema（User Memory Schema）

User Memory 记录稳定的工作偏好（语言、输出风格、工具选择、风险倾向、复盘节奏）。**用户纠错必须立即更新**；`consent_status: withdrawn` 的字段禁止再读取。除非明确需要且已获批准，不存储敏感个人数据。

## Schema

```yaml
user_id:
language_preference:
output_style:
preferred_artifacts:
  - artifact_type:
    reason:
tool_preferences:
  primary_editor:
  primary_runtime:
  shell:
risk_preference: conservative | balanced | aggressive
review_preference: lightweight | standard | rigorous
do_not_repeat:
  - pattern:
    learned_from:
    correction_date:
consent_status: granted | pending | withdrawn
withdrawn_fields:
last_updated:
source:
```

## Field Rules

| Field | Type | Required | 写入时机 | 读取时机 | 生命周期 |
| --- | --- | --- | --- | --- | --- |
| `user_id` | string | ✅ | 首次创建 | 区分多用户场景 | 永久 |
| `language_preference` | string | ✅ | 首次创建 | 所有输出 | 用户修改时更新 |
| `output_style` | string | ✅ | 首次创建 | 所有输出格式化 | 用户修改时更新 |
| `preferred_artifacts` | object[] | ⚠️ | 用户表达偏好时 | 选择产物类型 | 滚动更新 |
| `tool_preferences` | object | ⚠️ | 用户声明工具栈时 | 命令/路径建议 | 用户修改时更新 |
| `risk_preference` | enum | ⚠️ | 用户声明时 | 决策推荐力度 | 滚动更新 |
| `review_preference` | enum | ⚠️ | 用户声明时 | review 严格度 | 滚动更新 |
| `do_not_repeat` | object[] | ✅ | **用户纠错的当次** | 所有后续行为 | 永久（除非用户撤销） |
| `consent_status` | enum | ✅ | 默认 granted | 决定是否可读取 | 用户可撤销 |
| `withdrawn_fields` | string[] | ⚠️ | consent_status=withdrawn 时 | 屏蔽特定字段 | 永久 |
| `last_updated` | date | ✅ | 每次写入 | 判断新鲜度 | 滚动更新 |
| `source` | string | ✅ | 每次写入 | 审计来源 | 滚动更新 |

## Minimum Example

```yaml
user_id: max
language_preference: 简体中文（代码/命令/变量名保留英文）
output_style: 结论先行，结构化优先（表格 > 列表 > 段落），无 AI 味填充语
preferred_artifacts:
  - artifact_type: prototype
    reason: 可运行 > 可阅读，原型是 PM 的核心交付武器
  - artifact_type: prd
    reason: PRD 必须可喂给开发团队
tool_preferences:
  primary_editor: Claude Code
  primary_runtime: Bun + Node
  shell: bash (Unix 语法，Windows 11 环境)
risk_preference: balanced
review_preference: rigorous
do_not_repeat:
  - pattern: 不要谄媚（不夸想法好、不说"这是个很好的问题"、不加"当然可以"）
    learned_from: 全局 CLAUDE.md "思维原则" 章节
    correction_date: 2026-07-01
  - pattern: 不擅自生成或大幅修改 README/CHANGELOG（除非项目初始化/里程碑）
    learned_from: 全局 CLAUDE.md "不做什么" 章节
    correction_date: 2026-07-01
  - pattern: 不在一次回复中输出超过 80 行代码而不先讲思路
    learned_from: 全局 CLAUDE.md "不做什么" 章节
    correction_date: 2026-07-01
consent_status: granted
withdrawn_fields: []
last_updated: 2026-07-01
source: 全局 CLAUDE.md + 项目交互观察
```

## Usage Rule

Use User Memory 在每个 session 启动时加载稳定偏好。**用户纠错（"我说过不要 X"）必须立即更新** `do_not_repeat` 或相关字段，不能等"下次再记"。`consent_status: withdrawn` 时禁止读取该用户记忆；`withdrawn_fields` 列出的字段即使整体 consent 是 granted 也必须跳过。User Memory 只记录稳定偏好——一次性上下文需求（"今天先做 A"）不写入。除非用户明确批准，不存储个人敏感数据（健康、财务、身份细节）。
