# Rebuildtoaibuilderos All

是的。现在最合适的做法是**先沉淀一份新的完整方案**，作为你后续交给 Codex / Claude Code / Qoder 的“重构总纲”。下面这份我会按 **AI Builder OS v1.0 Blueprint** 来写：既是产品方案，也是系统架构，也是后续构建提示词的基础。
我会基于三类依据来设计：
1. 你当前项目已有的有效资产：README 已经把现有系统定义为面向产品经理、AI 产品经理和全栈构建者的 AI Product Builder OS，并包含 canonical source、中文优先、证据驱动、流水线和 Packet flow 等基础。
2. 你当前 `pm-prototype` skill 中已经存在的好机制：Layer 0 原则、low/high fidelity、Output Packet、Evidence Packet、Sensor Gates、Meta-Review、Evolution Writeback 等。
3. 主流 Agentic 工具的官方方向：Codex skills 采用 progressive disclosure，先通过 name/description 选择，再按需读取完整 skill；Goal 适合长任务，但需要清晰目标和完成标准；Claude / Anthropic 的 skill 最佳实践也强调清晰 description、渐进披露和避免把主 skill 写成百科全书。([OpenAI 开发者](https://developers.openai.com/codex/skills?utm_source=chatgpt.com "Agent Skills – Codex"))
---
# AI Builder OS v1.0 完整方案
## 0. 一句话结论
**AI Builder OS 不是 PM Copilot 的改名，而是一次产品范式升级：从“产品经理技能包”升级为“面向所有构建者的 AI 原生工作操作系统”。**
它的目标不是帮用户写更多文档，而是帮助用户借助 Agentic 工具完成：
```javascript
想法 → 判断 → 规格 → 原型 → Agent 任务包 → 执行 → 验证 → 发布 → 复盘 → 进化

```
---
# 1. 产品定位
## 1.1 产品名称
```javascript
AI Builder OS

```
## 1.2 产品定义
> **AI Builder OS 是一套面向产品经理、企业数字化从业者、AI 产品构建者、非程序员和独立创造者的 AI 原生构建操作系统。它帮助用户把模糊想法、业务问题、产品需求或个人项目，转化为 Agentic 工具可以理解、执行、验证和沉淀的构建流程。**
## 1.3 它不是
```javascript
不是一个普通 Prompt 包
不是一个 PRD 生成器
不是一个 PM 文档模板库
不是一个单一 Agent
不是一个插件集合
不是一个自动写代码神器

```
## 1.4 它是
```javascript
一套 Builder Kernel
一组 AI Builder Skills
一套执行 Harness
一套 Memory / Evolution 机制
一套 Eval 驱动的质量系统
一组面向不同工具的 Runtime Adapters
一套可持续沉淀的构建资产流水线

```
---
# 2. 目标用户
## 2.1 核心用户
| 用户类型 | 真实需求 | AI Builder OS 应提供的能力 |
| --- | --- | --- |
| 产品经理 | 不只是写 PRD，而是驱动 AI 工具做出原型、规格、验收和任务包 | Feature Frame、Spec、Prototype、Agent Task |
| 企业数字化从业者 | 面对复杂流程、系统、角色和组织约束 | 流程建模、系统上下文、数据流、落地方案 |
| AI 产品 Builder | 构建 AI Agent、AI Workflow、AI-native 产品 | Agent Pattern、Trust/Safety、Eval、Prototype |
| 普通非程序员 | 不懂代码，但想用 Codex / Claude Code / Cursor 做项目 | 人类语言 → Agent Task Packet → 验收清单 |
| 独立创造者 | 想从 idea 到 MVP 到发布 | Idea Frame、MVP Spec、Prototype、Launch Plan |
## 2.2 你自己的典型使用场景
你的真实场景不是“写产品文档”，而是：
```javascript
企业流程智能体应用
AI 产品原型
数字化业务系统设计
Agentic Coding 工具使用
个人 AI 工作流资产沉淀
公众号文章 / 方法论资产沉淀

```
所以 AI Builder OS 的第一原则应该是：
> **面向构建结果，而不是面向文档产出。**
---
# 3. 产品北极星
## 3.1 北极星目标
> **让非纯工程背景的人，也能稳定借助 Agentic 工具完成高质量构建。**
## 3.2 核心衡量标准
| 指标 | 解释 |
| --- | --- |
| 从 idea 到可执行任务包的时间 | 用户能否快速把模糊想法变成 Agent 可执行输入 |
| Agent 误执行率 | 是否减少目标模糊、范围膨胀、乱改代码 |
| 输出可验收率 | 产物是否有明确验收标准和证据 |
| 资产复用率 | 是否能沉淀 Feature Frame、Spec、Prototype、Decision |
| 用户贴合度 | 是否随着使用越来越符合用户偏好 |
| Eval 通过率 | skill / workflow 修改后是否不退化 |
---
# 4. 设计原则
## 4.1 Builder First
所有能力都要服务于：
```javascript
产出可执行、可验证、可复用的构建资产

```
而不是只给建议。
---
## 4.2 Asset-Oriented
每个 skill 都必须产出明确资产。
```javascript
builder-frame        → Feature Frame
builder-spec         → Spec / PRD / Acceptance Criteria
builder-prototype    → Wireframe / Prototype / Mapping
builder-agent-task   → Agent Task Packet
builder-review       → Review Report
builder-decision     → Decision Record

```
---
## 4.3 Human-in-Control
AI 可以规划、生成、执行、检查，但关键动作必须由人决定。
特别是：
```javascript
删除文件
提交代码
推送远程仓库
部署
发消息
修改生产数据
调用外部系统写操作

```
必须经过显式确认。
---
## 4.4 Plan before Goal
复杂、模糊、范围大的任务必须先 Plan。
清晰、可验收、有边界的任务才适合 Goal。Codex Goal 的官方说明强调 Goal 能让 Codex 持续关注目标、判断是否完成并选择下一步行动，但前提是目标足够具体、可验证。([OpenAI 开发者](https://developers.openai.com/cookbook/examples/codex/using_goals_in_codex?utm_source=chatgpt.com "Using Goals in Codex"))
规则：
| 情况 | 推荐模式 |
| --- | --- |
| 小任务、清晰修改 | 普通 Prompt |
| 模糊想法、复杂任务 | Plan |
| 已有清晰计划和验收标准 | Goal |
| 大目标、完整系统 | Plan → 拆 Goal |
| 已完成产物 | Review / Evidence Audit |
---
## 4.5 Evidence over Claim
AI 不允许只说“完成了”。
必须输出：
```javascript
文件路径
产物路径
命令
运行结果
截图或人工检查步骤
未验证风险
PASS / PARTIAL / BLOCKED

```
你现有系统已经强调 Builder 工作流必须给验证证据，而不是声称“应该能跑”，这是必须继承的核心资产。
---
## 4.6 Progressive Disclosure
`SKILL.md` 不是百科全书，而是执行协议。
复杂知识、模板、检查清单、视觉规则、场景规则应放入 `references/` 或 `templates/`。
Codex skills 官方说明 skills 使用 progressive disclosure 来管理上下文：先加载轻量元数据，选择后再读取完整 skill。([OpenAI 开发者](https://developers.openai.com/codex/skills?utm_source=chatgpt.com "Agent Skills – Codex"))
Anthropic 的 skill authoring best practices 也强调 description、progressive disclosure 和结构化 reference 文件。([Claude平台](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices?utm_source=chatgpt.com "Skill authoring best practices - Claude API Docs"))
---
## 4.7 Router First
用户不应该先知道该用哪个 skill。
系统应先判断：
```javascript
当前是发现问题？
还是做规格？
还是做原型？
还是生成 Agent Task？
还是评审？
还是记录决策？
还是直接执行 Goal？

```
---
## 4.8 Small Core, Rich References
核心 skills 要少，references 要丰富。
你现有 README 已经吸收了“模板资产库不要全部升级成 core skill”的方向，这是正确的。
---
## 4.9 Runtime-Agnostic
AI Builder OS 不绑定某个工具。
它应支持投影到：
```javascript
Codex
Claude Code
Qoder / Qoder Work
Cursor
Trae
CodeBuddy / Workbuddy
Generic Agent

```
---
## 4.10 Eval-Driven Evolution
每次 skill 变更、模板变更、路由规则变更，都应该有 eval case 支撑。
你现有项目已经有 `validate:builder-os`、`validate:codex-install`、E2E 验证和 trigger eval 种子覆盖，这个方向要升级为正式 Eval System。
---
# 5. 总体架构
## 5.1 八层架构
```javascript
AI Builder OS
├── 1. Builder Kernel
├── 2. Execution Harness
├── 3. Memory & Evolution
├── 4. Core Skills
├── 5. Scenario Bundles
├── 6. References & Templates
├── 7. Eval System
└── 8. Runtime Adapters / Future Workspace

```
## 5.2 每层职责
| 层级 | 职责 |
| --- | --- |
| Builder Kernel | 路由、Packet、门禁、Plan/Goal 判断、证据协议 |
| Execution Harness | Guides、Sensors、Gates、Steering Loop、Tool Policy |
| Memory & Evolution | 用户偏好、项目记忆、资产索引、决策、技能进化 |
| Core Skills | 具体构建能力 |
| Scenario Bundles | 按用户/场景组合安装 |
| References & Templates | 方法论、模板、检查清单、案例 |
| Eval System | trigger、routing、contract、quality、e2e、regression |
| Runtime Adapters | Codex、Claude Code、Cursor 等平台适配 |
---
# 6. 核心概念模型
## 6.1 Builder Kernel
Kernel 是 AI Builder OS 的“操作系统内核”。
它不直接写 PRD、不画原型、不写代码，而是定义：
```javascript
如何理解任务
如何选择 skill
如何判断 Plan / Goal
如何交接上下文
如何验证结果
如何记录决策
如何沉淀经验

```
## 6.2 Execution Harness
Harness 是执行纪律层。
```javascript
Skill = 做什么
Harness = 如何稳定、安全、可验证地做

```
它包括：
```javascript
Guides        执行前指导
Sensors       执行中感知
Gates         节点门禁
Steering Loop 偏差修正循环
Tool Policy   工具与副作用策略
Run Report    执行报告

```
---
## 6.3 Memory & Evolution
Memory 不是保存所有聊天记录，而是保存未来有复用价值的信息。
包括：
```javascript
User Memory        用户长期偏好
Project Memory     项目上下文
Artifact Memory    资产索引
Decision Memory    关键决策
Skill Evolution    skill 改进信号

```
---
## 6.4 Eval System
Eval 是系统质量飞轮。
它评估：
```javascript
skill 是否触发正确
router 是否推荐正确路径
输出是否满足 contract
是否有 Evidence
质量是否达标
E2E 是否跑通
个性化是否越来越贴合用户
修改后是否发生回归

```
---
# 7. 目录结构建议
```javascript
ai-builder-os/
├── README.md
├── package.json
├── CHANGELOG.md
├── LICENSE
│
├── kernel/
│   ├── README.md
│   ├── routing/
│   │   ├── builder-router.zh.md
│   │   ├── plan-goal-routing.zh.md
│   │   └── skill-selection-rules.zh.md
│   ├── packets/
│   │   ├── intent-packet.schema.md
│   │   ├── output-packet.schema.md
│   │   ├── evidence-packet.schema.md
│   │   ├── decision-record.schema.md
│   │   └── agent-task-packet.schema.md
│   ├── gates/
│   │   ├── builder-quality-gates.zh.md
│   │   ├── fake-ui-gate.zh.md
│   │   ├── fake-test-gate.zh.md
│   │   ├── security-privacy-gate.zh.md
│   │   └── production-safety-gate.zh.md
│   └── protocols/
│       ├── chinese-first.zh.md
│       ├── assumption-policy.zh.md
│       ├── evidence-policy.zh.md
│       ├── handoff-policy.zh.md
│       └── evolution-writeback.zh.md
│
├── harness/
│   ├── README.md
│   ├── guides.zh.md
│   ├── sensors.zh.md
│   ├── gates.zh.md
│   ├── steering-loop.zh.md
│   ├── tool-policy.zh.md
│   └── run-report.schema.md
│
├── memory/
│   ├── README.md
│   ├── schemas/
│   │   ├── user-memory.schema.md
│   │   ├── project-memory.schema.md
│   │   ├── artifact-index.schema.md
│   │   ├── decision-memory.schema.md
│   │   └── evolution-note.schema.md
│   ├── policies/
│   │   ├── what-to-remember.zh.md
│   │   ├── what-not-to-remember.zh.md
│   │   ├── privacy-policy.zh.md
│   │   └── summarization-policy.zh.md
│   └── examples/
│
├── skills/
│   ├── builder-router/
│   │   └── SKILL.md
│   ├── builder-plan-goal/
│   │   └── SKILL.md
│   ├── builder-discovery/
│   │   └── SKILL.md
│   ├── builder-frame/
│   │   └── SKILL.md
│   ├── builder-spec/
│   │   └── SKILL.md
│   ├── builder-prototype/
│   │   ├── SKILL.md
│   │   └── references/
│   │       ├── fidelity-modes.zh.md
│   │       ├── scene-patterns.zh.md
│   │       ├── visual-systems.zh.md
│   │       ├── agent-ui-patterns.zh.md
│   │       └── prototype-quality-checklist.zh.md
│   ├── builder-architecture/
│   │   └── SKILL.md
│   ├── builder-agent-task/
│   │   └── SKILL.md
│   ├── builder-review/
│   │   └── SKILL.md
│   └── builder-decision/
│       └── SKILL.md
│
├── bundles/
│   ├── core/
│   │   ├── manifest.json
│   │   └── skills.list
│   ├── product-builder/
│   ├── ai-product-builder/
│   ├── enterprise-digital/
│   ├── no-code-builder/
│   └── agent-builder/
│
├── references/
│   ├── builder-methodology/
│   ├── product-kb/
│   ├── ai-product-kb/
│   ├── agent-design-kb/
│   ├── enterprise-kb/
│   ├── ux-design-kb/
│   └── coding-agent-kb/
│
├── templates/
│   ├── opportunity-brief/
│   ├── feature-frame/
│   ├── prd/
│   ├── prototype-brief/
│   ├── architecture-plan/
│   ├── agent-task-packet/
│   ├── review-report/
│   ├── decision-record/
│   └── launch-plan/
│
├── evals/
│   ├── trigger/
│   ├── routing/
│   ├── output-contract/
│   ├── quality/
│   ├── evidence/
│   ├── e2e/
│   │   ├── new-product-launch-agent/
│   │   ├── doctor-preference/
│   │   └── no-code-builder/
│   ├── regression/
│   └── personalization/
│
├── adapters/
│   ├── codex/
│   ├── claude-code/
│   ├── qoder/
│   ├── cursor/
│   ├── trae/
│   ├── workbuddy/
│   └── generic-agent/
│
├── examples/
│   ├── product-manager/
│   ├── enterprise-digital/
│   ├── ai-agent-product/
│   ├── no-code-builder/
│   └── personal-project/
│
├── scripts/
│   ├── validate-builder-os.js
│   ├── validate-skills.js
│   ├── validate-bundles.js
│   ├── validate-evals.js
│   ├── install-codex.js
│   ├── install-claude-code.js
│   └── build-bundle.js
│
└── docs/
    ├── architecture.md
    ├── roadmap.md
    ├── contribution-guide.md
    └── evolution-log.md

```
---
# 8. Core Skills v1.0
## 8.1 `builder-router`
**使命**：判断用户当前应该走哪条构建路径。
输出：
```javascript
模式建议
推荐 skill
推荐工作流
缺失上下文
下一步提示词

```
典型判断：
```javascript
普通回答
Plan
Goal
Plan → Goal
builder-frame
builder-spec
builder-prototype
builder-agent-task
builder-review
builder-decision

```
---
## 8.2 `builder-plan-goal`
**使命**：判断任务适合普通 Prompt、Plan、Goal，还是 Plan → Goal。
输出：
```javascript
模式建议
判断理由
风险提醒
可复制 /plan 提示词
可复制 /goal 提示词
里程碑拆分

```
---
## 8.3 `builder-frame`
**使命**：把模糊需求转化为 Feature Frame。
核心产物：
```javascript
Problem
User
Scenario
Current Pain
Desired Outcome
Core Capability
Non-goals
Success Criteria
Next Skill Hint

```
---
## 8.4 `builder-spec`
**使命**：把 Feature Frame / 需求 / 业务背景转成可交付规格。
支持输出：
```javascript
Mini Spec
PRD
Acceptance Criteria
Engineering Request
Agent-readable Spec

```
---
## 8.5 `builder-prototype`
**使命**：把需求、Spec、PRD、Feature Frame 或自然语言构想转成可验证视觉资产。
继承旧 `pm-prototype` 的优点：
```javascript
low / high fidelity
Purpose-first
高保真必须可交互
MAPPING.md
Evidence Packet
Fake UI Gate
AI Agent UI patterns

```
但重构方式是：
```javascript
主 SKILL.md 瘦身
视觉系统下沉 references
场景判断下沉 references
Agent UI 规则下沉 references
Evolution Writeback 上升为全局 memory/evolution

```
你当前 `pm-prototype` 对低保真、高保真、输入源、输出结构、AI Agent 场景和 evidence 都有较完整设计，可以作为新版 `builder-prototype` 的素材库，而不是直接保留为巨型主 skill。
---
## 8.6 `builder-agent-task`
**使命**：把人类需求转成 Agentic 工具可执行任务包。
这是新版 AI Builder OS 的关键。
产物：
```javascript
Agent Task Packet

```
它包含：
```javascript
task_name:
background:
desired_outcome:
scope:
non_goals:
context_sources:
target_runtime:
recommended_mode: prompt | plan | goal | plan_to_goal
plan_prompt:
goal_prompt:
acceptance_criteria:
verification:
allowed_tools:
forbidden_actions:
human_approval_gates:
risks:
blocked_stop_condition:

```
---
## 8.7 `builder-review`
**使命**：评审规格、原型、Agent 输出、代码或交付物是否真实满足目标。
支持：
```javascript
Spec Review
Prototype Review
Agent Output Review
Code Review
Evidence Review
Launch Readiness Review

```
---
## 8.8 `builder-decision`
**使命**：记录关键取舍。
产物：
```javascript
decision_title:
context:
options_considered:
decision:
rationale:
tradeoffs:
risks:
reversal_conditions:
follow_up:
date:

```
---
# 9. Packet 协议
## 9.1 Intent Packet
用于理解用户意图。
```javascript
want:
user:
context:
constraints:
depth:
output_target:
success_criteria:
known_inputs:
missing_inputs:
recommended_skill:
recommended_mode:

```
---
## 9.2 Output Packet
用于上下游交接。
```javascript
artifact_path:
artifact_type:
key_decisions:
open_assumptions:
next_skill_hint:
handoff_context:
evidence_packet:
status:

```
你现有 README 已经有 Output Packet 及下游 skill 消费 Context Sources 的设计，这应成为 AI Builder OS 的正式协议。
---
## 9.3 Evidence Packet
用于防止 fake completion。
```javascript
artifacts:
commands_run:
command_outputs:
screenshots:
manual_checks:
interaction_smoke:
mapping_evidence:
open_risks:
completion_claim: PASS | PARTIAL | BLOCKED

```
---
## 9.4 Agent Task Packet
用于交给 Codex、Claude Code、Qoder、Cursor 等工具执行。
```javascript
task_name:
background:
desired_outcome:
scope:
non_goals:
context_sources:
target_runtime:
recommended_mode:
plan_prompt:
goal_prompt:
acceptance_criteria:
verification:
allowed_tools:
forbidden_actions:
human_approval_gates:
risks:
blocked_stop_condition:

```
---
## 9.5 Decision Record
用于记录不可丢失的取舍。
```javascript
decision_title:
context:
options_considered:
decision:
rationale:
tradeoffs:
risks:
reversal_conditions:
follow_up:
date:

```
---
# 10. Harness 设计
## 10.1 Harness 的定位
> Harness 是 AI Builder OS 的执行纪律层。
它不替代 skill，而是约束 skill 的执行。
```javascript
Skill 负责产出
Harness 负责稳定性、安全性、可验证性

```
## 10.2 Harness 模块
| 模块 | 作用 |
| --- | --- |
| Guides | 执行前明确目标、资产、上下文、边界 |
| Sensors | 执行中感知范围膨胀、假完成、乱改代码 |
| Gates | 关键节点检查 |
| Steering Loop | 偏差修正循环 |
| Tool Policy | 工具和副作用动作策略 |
| Run Report | 执行结束报告 |
## 10.3 Steering Loop
```javascript
Plan
  ↓
Act
  ↓
Observe
  ↓
Check
  ↓
Adjust
  ↓
Evidence
  ↓
Handoff

```
## 10.4 通用 Gates
| Gate | 检查 |
| --- | --- |
| Intent Gate | 是否真正理解用户目标 |
| Scope Gate | 做什么、不做什么是否明确 |
| Plan Gate | 是否需要先 Plan |
| Evidence Gate | 是否提供完成证据 |
| Safety Gate | 是否涉及高风险动作 |
| Review Gate | 是否需要人工确认 |
| Handoff Gate | 是否能交给下游 |
---
# 11. Memory & Evolution 设计
## 11.1 Memory 的原则
```javascript
不保存一切
只保存对未来有复用价值的信息
默认不保存敏感信息
区分用户偏好、项目记忆、资产记忆、决策记忆和 skill 进化信号

```
## 11.2 五类记忆
| 类型 | 内容 |
| --- | --- |
| User Memory | 语言偏好、输出偏好、工具偏好、工作风格 |
| Project Memory | 项目目标、背景、约束、阶段、下一步 |
| Artifact Memory | Feature Frame、Spec、Prototype、Agent Task 等索引 |
| Decision Memory | 关键决策、取舍、反转条件 |
| Skill Evolution Memory | 误触发、模板过重、Gate 太严、缺 eval case |
## 11.3 项目级 `.ai-builder/`
```javascript
.ai-builder/
├── PROJECT.md
├── MEMORY.md
├── artifact-index.yaml
├── decision-log.md
├── run-log.md
└── evolution-log.md

```
## 11.4 Evolution Writeback
保留你现有设计的精神，但上升到系统层：
```javascript
有可复用观察才写
没有观察不强写
只记录未来能改善 skill / eval / memory 的内容

```
---
# 12. Eval System 设计
## 12.1 Eval 类型
| Eval 类型 | 评估什么 |
| --- | --- |
| Trigger Eval | 用户输入是否触发正确 skill |
| Routing Eval | router 推荐路径是否合理 |
| Output Contract Eval | 输出是否满足结构要求 |
| Evidence Eval | 是否有足够证据 |
| Quality Rubric Eval | 质量是否达标 |
| E2E Eval | 从 idea 到 spec/prototype/agent task 是否跑通 |
| Regression Eval | 修改后是否退化 |
| Personalization Eval | 是否越来越贴合用户偏好 |
## 12.2 Eval Case 格式
```javascript
id:
name:
input:
context:
expected_skill:
expected_mode:
expected_outputs:
must_include:
must_not_include:
quality_rubric:

```
## 12.3 第一批 E2E 场景
```javascript
new-product-launch-agent
doctor-preference
no-code-builder
personal-project-builder

```
其中 `new-product-launch-agent` 应覆盖：
```javascript
构想 → Feature Frame → Spec → Prototype → Agent Task Packet → Review

```
---
# 13. Scenario Bundles
## 13.1 Core Bundle
```javascript
builder-router
builder-plan-goal
builder-frame
builder-spec
builder-prototype
builder-agent-task
builder-review
builder-decision

```
## 13.2 Product Builder Bundle
```javascript
builder-discovery
builder-frame
builder-spec
builder-prototype
builder-decision
builder-launch

```
## 13.3 AI Product Builder Bundle
```javascript
ai-patterns
agent-patterns
agent-ui-patterns
eval-design
trust-safety-patterns
human-in-loop-design

```
## 13.4 Enterprise Digital Bundle
```javascript
business-process-map
system-context-map
data-flow-map
workflow-automation-frame
enterprise-rollout-plan
stakeholder-alignment

```
## 13.5 No-code Builder Bundle
```javascript
idea-to-project
no-code-spec
agent-task-packet
prototype-brief
tool-selection-guide
manual-validation-checklist

```
---
# 14. Runtime Adapters
## 14.1 Adapter 的职责
```javascript
安装路径
调用方式
frontmatter 兼容
平台限制
显式/隐式触发规则
高风险动作策略
示例提示词

```
## 14.2 第一批 Adapter
```javascript
codex
claude-code
generic-agent

```
暂不优先做：
```javascript
qoder
cursor
trae
workbuddy

```
这些可以先设计 mapping，不急着实现。
---
# 15. Skill 主文件标准
每个 `SKILL.md` 建议控制在 200–350 行，最多不要超过 500 行。
推荐结构：
```javascript
---
name:
displayName:
description:
user-invocable:
argument-hint:
---

# Mission

# When to Use

# When Not to Use

# Inputs

# Mode Decision

# Execution Flow

# Output Contract

# Quality Gates

# Handoff

# References

# Metadata

```
## 关键要求
```javascript
description 必须 trigger-focused
每个 skill 必须有明确产物
每个 skill 必须有 handoff
每个 builder workflow 必须支持 Evidence Packet
复杂方法论放 references
模板放 templates
案例放 examples/evals

```
---
# 16. 迁移策略
## 16.1 从 `pm-copilot-skills` 到 `ai-builder-os`
不要直接删除旧系统。
建议：
```javascript
保留旧 README 和 skills 作为 _legacy
抽取通用协议进入 kernel
抽取 prototype 方法进入 builder-prototype/references
重命名核心 skills
保留安装脚本思想，但重写 adapter
保留 eval 思想，但扩展为正式 evals/

```
## 16.2 旧 skill 映射
| 旧 skill | 新位置 |
| --- | --- |
| pm-discovery | builder-discovery |
| pm-feature-frame | builder-frame |
| pm-prd | builder-spec |
| pm-prototype | builder-prototype |
| pm-code-architect | builder-architecture |
| pm-code-implement | 暂不作为核心，转为 agent-task / builder-implementation later |
| pm-code-review | builder-review |
| pm-decision | builder-decision |
| pm-launch | builder-launch later |
| pm-ai-patterns | ai-product bundle |
| pm-agent-patterns | agent-builder bundle |
| pm-content-general | content-builder bundle |
| pdf/pptx utilities | 不进入 core，避免污染 selector |
---
# 17. MVP 范围
## v0.1 必须做
```javascript
README.md
docs/architecture.md
kernel/
harness/
memory/
skills/8 个 core skills
bundles/core
templates/核心模板
evals/trigger + e2e 基础案例
adapters/codex
adapters/claude-code

```
## v0.1 不做
```javascript
不做 App
不接 MCP
不做真实多 Agent 编排
不做自动部署
不迁移所有旧 skills
不默认安装 utility skills
不把所有 reference 写进 SKILL.md

```
---
# 18. Roadmap
## Phase 0：战略重构
产物：
```javascript
README.md
docs/architecture.md
kernel/README.md
core bundle manifest

```
## Phase 1：Kernel + Harness
产物：
```javascript
Intent Packet
Output Packet
Evidence Packet
Agent Task Packet
Decision Record
Guides/Sensors/Gates/Tool Policy

```
## Phase 2：Core Skills
产物：
```javascript
builder-router
builder-plan-goal
builder-frame
builder-spec
builder-prototype
builder-agent-task
builder-review
builder-decision

```
## Phase 3：Prototype v2 样板
产物：
```javascript
瘦身版 builder-prototype/SKILL.md
references/fidelity-modes
references/scene-patterns
references/agent-ui-patterns
prototype-quality-checklist

```
## Phase 4：Eval System
产物：
```javascript
trigger eval
routing eval
contract eval
e2e/new-product-launch-agent
e2e/no-code-builder

```
## Phase 5：Adapters
产物：
```javascript
codex adapter
claude-code adapter
generic-agent adapter

```
---
# 19. 给 Codex 的完整构建提示词
下面这份可以直接复制给 Codex。建议第一轮使用 `/plan`，不要让它直接改代码。
/plan
我要把当前的 `pm-copilot-skills` 项目重新设计并构建为一个新的系统：`AI Builder OS`。
请先理解当前仓库，再制定完整重构计划。不要直接修改代码。
# 一、背景
当前项目原本是面向产品经理、AI 产品经理和全栈产品构建者的 skills 包，包含 discovery、feature frame、PRD、prototype、code architect、code implement、review、launch、decision 等 PM 类 skills。
现在我要将它升级为：
AI Builder OS
它不再只是 PM Copilot，也不只是 PM Skills，而是一套面向产品经理、企业数字化从业者、AI 产品构建者、普通非程序员和独立创造者的 AI 原生构建操作系统。
它要帮助用户借助 Codex、Claude Code、Qoder/Qoder Work、Cursor、Trae、CodeBuddy/Workbuddy 等 Agentic 工具，把模糊想法、业务需求、产品构想、流程问题或个人项目，转化为可执行、可验证、可交付、可沉淀的构建成果。
# 二、产品定位
请将新系统定义为：
AI Builder OS 是一套面向非纯工程背景构建者的 AI 原生工作操作系统。它帮助用户借助 Agentic 工具完成：理解问题 → 形成判断 → 设计方案 → 生成资产 → 交给 Agent 执行 → 验证结果 → 发布/复盘 → 沉淀能力。
重要：不要把它设计成“会写 PRD 的助手”，也不要只面向产品经理。它的核心身份是 Builder OS。
# 三、目标用户
系统需要服务以下用户：
1. 产品经理
需要把需求转成规格、原型、验收标准、Agent 可执行任务。
2. 企业数字化从业者
需要梳理业务流程、系统上下文、数据流、角色协同、落地路径。
3. AI 产品 Builder
需要构建 AI Agent、AI Workflow、AI-native 产品和原型。
4. 普通非程序员
不懂代码，但希望借助 Codex、Claude Code、Qoder、Cursor 等工具构建个人项目、工作工具或自动化流程。
5. 独立创造者
需要从 idea 到 MVP、发布、内容表达和复盘。
# 四、核心原则
请在新 README 和 docs/architecture.md 中体现以下原则：
1. Builder First
所有能力都服务于产出可验证成果，而不是泛泛分析。
2. Asset-Oriented
输出应尽量变成可复用资产，例如 Feature Frame、Spec、Prototype、Agent Task Packet、Review Report、Decision Record。
3. Human-in-Control
AI 负责推演、生成、执行、检查；人负责目标、边界、批准、取舍和最终责任。
4. Plan before Goal
复杂、模糊、范围大的任务先 Plan；清晰、有验收标准的任务才 Goal；大目标必须 Plan → 拆分 Goal。
5. Evidence over Claim
不能只说“完成了”，必须提供文件、路径、命令、结果、截图、diff、人工验收步骤或未验证风险。
6. Progressive Disclosure
SKILL.md 应是执行协议，不是百科全书。复杂方法论、模板、检查清单放到 references/ 和 templates/。
7. Router First
普通用户不应该先知道该调用哪个 skill。系统需要 builder-router 帮用户判断下一步。
8. Small Core, Rich References
核心 skills 要少，references 可以丰富。不要把每个模板都升级为 core skill。
9. Runtime-Agnostic
canonical source 不绑定 Codex 或 Claude Code；通过 adapters 投影到不同 Agentic 工具。
10. Eval-Driven Evolution
每次 skill、router、template、gate 变更，都需要 eval 或 regression case 支撑。
# 五、目标架构
请将新项目设计为八层：
1. Builder Kernel
统一路由、模式判断、Packet 协议、证据协议、质量门禁、交接协议。
2. Execution Harness
Guides、Sensors、Gates、Steering Loop、Tool Policy、Run Report。
3. Memory & Evolution
用户偏好、项目记忆、资产索引、决策记忆、技能进化。
4. Core Skills
具体工作能力，例如 builder-router、builder-plan-goal、builder-frame、builder-spec、builder-prototype、builder-agent-task、builder-review、builder-decision。
5. Scenario Bundles
面向不同场景组合 skills，例如 core、product-builder、ai-product-builder、enterprise-digital、no-code-builder、agent-builder。
6. References / Templates
方法论、模板、检查清单、案例。
7. Eval System
trigger、routing、output-contract、quality、evidence、e2e、regression、personalization。
8. Runtime Adapters
适配 Codex、Claude Code、Qoder、Cursor、Trae、Workbuddy、generic-agent。
# 六、建议目录结构
请设计并逐步迁移到以下结构：
```javascript
ai-builder-os/
├── README.md
├── package.json
├── CHANGELOG.md
├── LICENSE
│
├── kernel/
├── harness/
├── memory/
├── skills/
├── bundles/
├── references/
├── templates/
├── evals/
├── adapters/
├── examples/
├── scripts/
└── docs/

```
具体展开：
```javascript
kernel/
├── README.md
├── routing/
│   ├── builder-router.zh.md
│   ├── plan-goal-routing.zh.md
│   └── skill-selection-rules.zh.md
├── packets/
│   ├── intent-packet.schema.md
│   ├── output-packet.schema.md
│   ├── evidence-packet.schema.md
│   ├── decision-record.schema.md
│   └── agent-task-packet.schema.md
├── gates/
│   ├── builder-quality-gates.zh.md
│   ├── fake-ui-gate.zh.md
│   ├── fake-test-gate.zh.md
│   ├── security-privacy-gate.zh.md
│   └── production-safety-gate.zh.md
└── protocols/
    ├── chinese-first.zh.md
    ├── assumption-policy.zh.md
    ├── evidence-policy.zh.md
    ├── handoff-policy.zh.md
    └── evolution-writeback.zh.md

```
```javascript
harness/
├── README.md
├── guides.zh.md
├── sensors.zh.md
├── gates.zh.md
├── steering-loop.zh.md
├── tool-policy.zh.md
└── run-report.schema.md

```
```javascript
memory/
├── README.md
├── schemas/
│   ├── user-memory.schema.md
│   ├── project-memory.schema.md
│   ├── artifact-index.schema.md
│   ├── decision-memory.schema.md
│   └── evolution-note.schema.md
├── policies/
│   ├── what-to-remember.zh.md
│   ├── what-not-to-remember.zh.md
│   ├── privacy-policy.zh.md
│   └── summarization-policy.zh.md
└── examples/

```
```javascript
skills/
├── builder-router/
├── builder-plan-goal/
├── builder-discovery/
├── builder-frame/
├── builder-spec/
├── builder-prototype/
├── builder-architecture/
├── builder-agent-task/
├── builder-review/
└── builder-decision/

```
```javascript
evals/
├── trigger/
├── routing/
├── output-contract/
├── quality/
├── evidence/
├── e2e/
│   ├── new-product-launch-agent/
│   ├── doctor-preference/
│   └── no-code-builder/
├── regression/
└── personalization/

```
# 七、Core Skills 第一版
请先设计以下核心 skills，不要一次性迁移所有旧 PM skills：
1. builder-router
作用：判断用户当前任务应该走普通回答、Plan、Goal、Discovery、Frame、Spec、Prototype、Agent Task、Review、Decision 还是 Launch。
产物：模式建议、推荐 skill、下一步提示词。
2. builder-plan-goal
作用：判断是否应该使用 Plan 模式、Goal 模式、Plan → Goal，或者普通 Prompt。
产物：中文为主、可直接复制的 /plan 或 /goal 提示词。
3. builder-frame
作用：把模糊需求转化为 Feature Frame。
产物：Problem、User、Scenario、Current Pain、Desired Outcome、Core Capability、Non-goals、Success Criteria、Next Skill Hint。
4. builder-spec
作用：把 Feature Frame 或需求转成可交付规格。
产物：Mini Spec / PRD / Acceptance Criteria / Engineering Request / Agent-readable Spec。
5. builder-prototype
作用：把需求、PRD、Feature Frame 或自然语言构想转成低保真线框或高保真可交互原型。
产物：wireframe 或 prototype、MAPPING.md、design decisions、Evidence Packet。
注意：从旧 pm-prototype 中吸收能力，但主 SKILL.md 必须瘦身，详细视觉系统、场景判断、AI Agent UI 规则放 references。
6. builder-agent-task
作用：把人类需求转成 Codex、Claude Code、Qoder、Cursor 等 Agentic 工具可执行的任务包。
产物：Agent Task Packet，包括背景、目标、范围、不做什么、上下文、验收标准、验证方式、推荐模式、Plan/Goal 提示词。
7. builder-review
作用：评审规格、原型、Agent 输出、代码或交付物是否真实满足目标。
产物：Review Report、Evidence Audit、风险、修正建议。
8. builder-decision
作用：记录关键取舍。
产物：Decision Record，包括背景、选项、取舍、决定、影响、后续检查点。
# 八、SKILL.md 标准
每个 SKILL.md 必须是执行协议，而不是长篇方法论。建议结构：
```javascript
---
name:
displayName:
description:
user-invocable:
argument-hint:
---

# Mission

# When to Use

# When Not to Use

# Inputs

# Mode Decision

# Execution Flow

# Output Contract

# Quality Gates

# Handoff

# References

# Metadata

```
要求：
- 主 SKILL.md 尽量控制在 200–350 行，最多不要超过 500 行。
- 详细模板、案例、方法论、检查清单放 references 或 templates。
- description 必须 trigger-focused，明确什么时候用、什么时候不用。
- 不要写泛泛的 description，例如 “helps with product work”。
- 每个 skill 必须有明确核心产物。
- 每个 skill 必须有 handoff 规则。
- 每个 builder workflow 必须支持 Evidence Packet。
# 九、Packet 协议
请在 kernel/packets/ 中创建以下协议文件：
Intent Packet:
```javascript
want:
user:
context:
constraints:
depth:
output_target:
success_criteria:
known_inputs:
missing_inputs:
recommended_skill:
recommended_mode:

```
Output Packet:
```javascript
artifact_path:
artifact_type:
key_decisions:
open_assumptions:
next_skill_hint:
handoff_context:
evidence_packet:
status:

```
Evidence Packet:
```javascript
artifacts:
commands_run:
command_outputs:
screenshots:
manual_checks:
interaction_smoke:
mapping_evidence:
open_risks:
completion_claim: PASS | PARTIAL | BLOCKED

```
Agent Task Packet:
```javascript
task_name:
background:
desired_outcome:
scope:
non_goals:
context_sources:
target_runtime:
recommended_mode: prompt | plan | goal | plan_to_goal
plan_prompt:
goal_prompt:
acceptance_criteria:
verification:
allowed_tools:
forbidden_actions:
human_approval_gates:
risks:
blocked_stop_condition:

```
Decision Record:
```javascript
decision_title:
context:
options_considered:
decision:
rationale:
tradeoffs:
risks:
reversal_conditions:
follow_up:
date:

```
# 十、Harness 要求
请新增 harness/，用于定义 Agent 执行过程中的通用约束和运行协议。
Harness 不应替代 skills，而应约束 skills 的执行方式。
至少包含：
- guides.zh.md：执行前指导
- sensors.zh.md：执行中感知点
- gates.zh.md：通用门禁
- steering-loop.zh.md：Plan → Act → Observe → Check → Adjust → Evidence → Handoff 循环
- tool-policy.zh.md：工具使用和副作用动作策略
- run-report.schema.md：运行报告结构
Harness 需要覆盖：
- 目标是否清晰
- 范围是否失控
- 是否需要先 Plan
- 是否存在 fake UI / fake test / fake completion
- 是否提供 Evidence Packet
- 是否涉及删除、部署、提交、发消息、修改生产数据等高风险操作
- 是否需要人工确认
# 十一、Memory & Evolution 要求
请新增 memory/，用于定义 AI Builder OS 如何在持续使用中沉淀上下文、偏好、决策、资产和经验。
Memory 至少分为：
1. User Memory
记录用户长期工作偏好、输出偏好、语言偏好、工具偏好。
2. Project Memory
记录项目目标、背景、阶段、上下文、约束、已有资产、下一步。
3. Artifact Memory
记录 Feature Frame、Spec、Prototype、Agent Task Packet、Review Report、Decision Record 等资产索引。
4. Decision Memory
记录关键决策、选项、取舍、反转条件和后续检查点。
5. Skill Evolution Memory
记录 skill 执行中发现的可复用改进信号，例如误触发、模板过重、Gate 太严格、缺少 eval case 等。
要求：
- 不要把所有聊天内容都当作记忆。
- 只记录对未来任务有复用价值的内容。
- 敏感信息默认不长期保存。
- 有观察才写 Evolution Note，没有观察不要强写。
- Memory 应能支持个性化，但不能导致系统过度迎合用户错误判断。
- Memory 应与 Eval 结合，持续改善 skill 触发和输出质量。
请定义项目级 `.ai-builder/` 目录结构：
```javascript
.ai-builder/
├── PROJECT.md
├── MEMORY.md
├── artifact-index.yaml
├── decision-log.md
├── run-log.md
└── evolution-log.md

```
# 十二、Eval System 要求
请新增或强化 evals/，把 AI Builder OS 设计为评测驱动的 skill/bundle 系统。
Eval 不只是测试代码，而是评估：
- skill 是否正确触发
- router 是否推荐正确路径
- 输出是否满足 contract
- 是否有充分 Evidence
- 质量是否达到 rubric
- E2E 流程是否跑通
- 个性化是否越来越贴合用户偏好
- 修改 skill 后是否发生回归
至少包含：
```javascript
evals/
├── trigger/
├── routing/
├── output-contract/
├── quality/
├── evidence/
├── e2e/
├── regression/
└── personalization/

```
每个 eval case 至少包含：
```javascript
id:
name:
input:
context:
expected_skill:
expected_mode:
expected_outputs:
must_include:
must_not_include:
quality_rubric:

```
第一批 E2E 场景：
- new-product-launch-agent
- doctor-preference
- no-code-builder
# 十三、Bundle 第一版
请先创建 core bundle：
```javascript
bundles/core/
├── manifest.json
└── skills.list

```
core bundle 包含：
```javascript
builder-router
builder-plan-goal
builder-frame
builder-spec
builder-prototype
builder-agent-task
builder-review
builder-decision

```
# 十四、Adapters 第一版
请先设计：
```javascript
adapters/codex/
adapters/claude-code/
adapters/generic-agent/

```
每个 adapter 至少包含：
```javascript
README.md
mapping.md
install-notes.md

```
说明：
- Codex 使用 $skill-name 显式调用，或依靠 description 隐式触发。
- Claude Code 使用 /skill-name 显式调用，或由模型自动触发。
- 有副作用的技能必须禁止自动调用或要求用户确认。
- adapters 只负责投影和安装，不要复制业务方法论。
# 十五、从旧项目迁移
请先检查当前仓库已有 README、skills、references、scripts、evals。
迁移原则：
- 不要直接删除旧内容，先移动到 _legacy/ 或 _archived/。
- 保留有价值的方法论，但下沉到 references。
- 保留有价值的安装脚本和验证脚本，但改名适配 ai-builder-os。
- 旧 pm-prototype 的大量设计规则要拆分，不要继续塞进一个 SKILL.md。
- 旧 pm-* 可以逐步映射到 builder-*，不要一次性全量迁移。
- 旧 README 中关于 canonical source、中文优先、证据驱动、Output Packet、runtime adapters 的思想应保留并升级。
# 十六、不要做的事情
本轮不要做：
- 不要构建 App / Workspace。
- 不要接入 MCP。
- 不要实现真实部署。
- 不要创建太多 specialist skills。
- 不要把 pdf/pptx 这类 utility 默认塞进 core bundle。
- 不要让每个 skill 都变成长篇方法论文档。
- 不要直接把 PM Copilot 改名后结束，必须完成架构重构。
# 十七、计划输出要求
请先输出重构计划，必须包含：
1. 当前仓库理解
2. 当前结构问题
3. 目标架构
4. 文件迁移策略
5. 新目录结构
6. Core Skills 设计
7. Kernel 协议设计
8. Harness 设计
9. Memory & Evolution 设计
10. Eval System 设计
11. Bundle 设计
12. Adapter 设计
13. 分阶段实施计划
14. 风险和回滚策略
15. 第一阶段可执行 /goal 提示词
不要直接改代码。等我确认计划后，再执行 Milestone 1。
---
# 20. 第一阶段建议给 Codex 的 Goal
当 Codex 输出计划并由你确认后，再给它这个 `/goal`。
```javascript
/goal

将当前仓库重构为 AI Builder OS 的第一阶段骨架，保留旧内容但不破坏现有文件。

完成目标：
- 创建新的顶层目录：kernel、harness、memory、skills、bundles、references、templates、evals、adapters、examples、docs。
- 创建 README.md 的新版草案，将产品定位升级为 AI Builder OS。
- 创建 docs/architecture.md，说明 AI Builder OS 八层架构。
- 创建 kernel/README.md，并定义 Intent Packet、Output Packet、Evidence Packet、Agent Task Packet、Decision Record 的概览。
- 创建 harness/README.md，定义 Guides、Sensors、Gates、Steering Loop、Tool Policy、Run Report。
- 创建 memory/README.md，定义 User Memory、Project Memory、Artifact Memory、Decision Memory、Skill Evolution Memory。
- 创建 bundles/core/manifest.json 和 skills.list。
- 创建 8 个 core skill 目录，每个包含一个瘦身版 SKILL.md 草案：
  - builder-router
  - builder-plan-goal
  - builder-frame
  - builder-spec
  - builder-prototype
  - builder-agent-task
  - builder-review
  - builder-decision
- 创建 evals/trigger、evals/routing、evals/output-contract、evals/e2e 的初始目录和示例 case。
- 不删除旧 pm-* skills；如需移动，先放入 _legacy/ 或 _archived/。
- 不引入新依赖，除非明确说明。
- 不实现 App、MCP、真实工具集成。

验证方式：
- 目录结构符合目标架构。
- 每个核心 skill 都有 name、description、Mission、When to Use、When Not to Use、Output Contract、Handoff。
- README 能清楚说明 AI Builder OS 的定位、用户、架构、安装方向。
- kernel/harness/memory/evals 均有初始说明文件。
- 旧内容没有丢失。

完成后汇报：
- 新增/修改文件列表
- 旧内容如何保留
- 哪些只是草案
- 哪些内容从旧 pm-prototype 中迁移或待迁移
- 下一阶段建议

```
---
# 21. 最终建议
这份方案的关键不是“做更多 skills”，而是把你的系统升级为：
```javascript
Builder Kernel
+ Execution Harness
+ Memory & Evolution
+ Core Skills
+ Scenario Bundles
+ References / Templates
+ Eval System
+ Runtime Adapters

```
如果只保留一个判断，我建议是：
> **AI Builder OS 的核心价值，不是帮用户得到一次更好的 AI 输出，而是让用户逐渐拥有一套可复用、可验证、会进化的 AI 构建能力。**
这就是它和普通 prompt 包、PM 文档包、Agent 工具集合的本质差异。