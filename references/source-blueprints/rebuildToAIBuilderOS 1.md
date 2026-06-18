# Rebuildtoaibuilderos

非常好。这个命名是对的：**AI Builder OS** 比 **PM Copilot Skills** 更准确，也更有生命力。
我会把它定义为：
> **AI Builder OS 是一套面向非纯工程背景构建者的 AI 原生工作操作系统。它帮助用户借助 Codex、Claude Code、Qoder、Cursor、Trae、Workbuddy 等 Agentic 工具，把模糊想法转化为可验证资产、可执行任务、可交付成果和可复用经验。**
这里的关键词不是 PM，也不是 Coding，而是：
```javascript
Builder

```
也就是说，它不只是帮产品经理写文档，而是帮助一个人完成：
```javascript
理解问题 → 形成判断 → 设计方案 → 生成资产 → 交给 Agent 执行 → 验证结果 → 发布/复盘 → 沉淀能力

```
你现有 README 中已经有很好的基础：它把系统定位为覆盖 Product / Design / Build / Review / Release / Evolution 的 AI Product Builder OS，并且已有 canonical source、中文优先、证据驱动、流水线型 Output Packet 等概念。 但下一版应该从 “PM Skills 包” 升级为 **Builder Kernel + Skills Bundle + Runtime Adapters + Evaluation System**。
---
# 1. 总体判断：你要构建的不是 skills 集合，而是 Builder OS
## 我的核心建议
你应该把 AI Builder OS 设计成四层产品：
| 层级 | 作用 | 当前阶段优先级 |
| --- | --- | --- |
| **Kernel** | 统一路由、计划/目标判断、证据协议、交付协议、风险门禁 | 最高 |
| **Skills** | 具体工作能力：发现、规格、原型、架构、实现、评审、发布 | 高 |
| **Bundles** | 面向不同人群/场景组合 skills 和 references | 高 |
| **Adapters / Plugins** | 适配 Codex、Claude Code、Qoder、Cursor 等运行环境 | 中 |
| **Workspace / App** | 未来的桌面/网页工作台，管理项目、上下文、资产和运行记录 | 后置 |
一句话：
> **现在先做 Skill Bundle，不要急着做 App；先做 Kernel，不要继续堆 Skill；先做 Adapters，不要一开始就做重型 Plugin。**
Codex 官方也把 skill 定义为可复用工作流的 authoring format，而 plugin 更适合作为可安装分发单元；也就是说，应该先设计 workflow，再在需要对外安装时打包为 plugin。([OpenAI 开发者](https://developers.openai.com/codex/skills "Agent Skills – Codex | OpenAI Developers"))
---
# 2. AI Builder OS 的北极星
## 产品一句话
> **AI Builder OS 帮助产品经理、企业数字化从业者、AI Builder 和普通非程序员，把想法、需求、问题和业务场景转化为 Agentic 工具可以理解、执行、验证和沉淀的构建流程。**
## 目标用户
| 用户 | 典型痛点 | AI Builder OS 应该帮他做什么 |
| --- | --- | --- |
| 产品经理 | 会想、会写，但不会稳定驱动 AI Coding Agent | 把需求变成规格、原型、实现任务、验收标准 |
| 企业数字化负责人 | 业务复杂、系统约束多、跨部门协同难 | 建模流程、拆系统、形成可执行改造方案 |
| AI 产品 Builder | 想法多，但容易停留在概念层 | 快速形成 prototype / spec / agent workflow |
| 普通非程序员 | 不懂代码，不知道如何让 AI 工具做事 | 生成清晰任务包、提示词、验收清单、交付路径 |
| 独立创造者 | 想做个人产品、工具、内容资产 | 从 idea 到 MVP，到发布和复盘 |
## 你的差异化
你不是做一个“会写 PRD 的助手”。
你做的是：
```javascript
让非纯工程背景的人，也能像 Builder 一样组织 AI 工具完成复杂工作。

```
---
# 3. AI Builder OS 的设计原则
我建议确定 10 条系统原则。
## 1. Builder First
所有能力都要服务“产出可验证成果”，而不是停留在分析、建议、灵感或文档。
每个 skill 都必须回答：
```javascript
这个 skill 最终产出什么资产？
这个资产如何被验证？
这个资产如何交给下一个 skill 或 Agent？

```
---
## 2. Asset-Oriented
所有输出都应该尽量变成资产，而不是一次性回答。
典型资产包括：
```javascript
Opportunity Brief
Problem Frame
Feature Frame
PRD
Prototype Brief
Wireframe
Interactive Prototype
Architecture Plan
Agent Task Packet
Goal Prompt
Review Report
Decision Record
Launch Plan
Evolution Note

```
---
## 3. Human-in-Control
AI Builder OS 不是自动驾驶系统。
它应该默认：
```javascript
AI 负责推演、生成、执行、检查
人负责目标、边界、批准、取舍、最终责任

```
特别是部署、发邮件、改生产数据、删除数据、提交 PR、发布版本等动作，必须显式确认。
---
## 4. Plan before Goal
复杂任务不要直接执行。
你刚构建的 `plan-goal-coach` 应该成为 Kernel 级能力，而不是一个孤立 skill。
Codex 官方对 Goal mode 的定义很清楚：Goal 是一个持久目标，适合多步骤任务，并且 goal 文本同时是起始提示和完成标准；好的 goal 需要具体结果、可衡量目标或测试标准。([OpenAI 开发者](https://developers.openai.com/codex/prompting "Prompting – Codex | OpenAI Developers"))
所以 AI Builder OS 应该强制区分：
```javascript
还不清楚 → Plan
已经清楚 → Goal
太大 → Plan → 拆 Goal
已完成 → Review / Evidence

```
---
## 5. Evidence over Claim
AI 不能只说“完成了”。
必须提供证据：
```javascript
文件
路径
截图
测试命令
运行结果
diff 摘要
手工验收步骤
未验证风险
完成状态：PASS / PARTIAL / BLOCKED

```
你现有 `pm-prototype` 中的 Evidence Packet 已经很接近这个方向，包括 artifact、interaction smoke、mapping evidence、open risks 和 completion claim。
下一步应该把它上升为全局协议。
---
## 6. Progressive Disclosure
主 skill 不要写成百科全书。
Codex 的 skill 机制会先加载 skill 的 name、description、file path，只有决定使用时才加载完整 `SKILL.md`；如果安装很多 skills，description 还会受上下文预算限制。([OpenAI 开发者](https://developers.openai.com/codex/skills "Agent Skills – Codex | OpenAI Developers"))
Claude Code 也建议 `SKILL.md` 做 overview 和 navigation，把详细资料放到 reference 文件，并明确建议主文件控制在 500 行以内。([Claude Code](https://code.claude.com/docs/en/skills "Extend Claude with skills - Claude Code Docs"))
所以新版 AI Builder OS 必须遵守：
```javascript
SKILL.md = 执行协议
references/ = 方法论和模板
templates/ = 可复制资产格式
evals/ = 触发和质量验证

```
---
## 7. Router First
普通用户不应该先知道该调用哪个 skill。
应该有一个入口技能：
```javascript
builder-router

```
它负责判断：
```javascript
现在应该：
- 普通回答？
- 调用哪个 Builder skill？
- 先 Plan？
- 直接 Goal？
- 先补上下文？
- 生成 Agent Task Packet？
- 转成 Review？

```
你现有 README 已经有 pipeline 和 Packet flow，但它仍然偏“人手动选 skill”。
新版 OS 应该更智能：**用户可以显式指定，也可以自然语言触发。**
---
## 8. Small Core, Rich References
核心 skills 要少，references 可以丰富。
不要把每个模板、方法论、框架都做成 skill。你现有 README 也提到从 VibeCodingPromptTemplate 吸收模板资产库，但不把每个模板都升级为 core skill，这是正确方向。
---
## 9. Runtime-Agnostic
AI Builder OS 不应该绑定某一个工具。
它要能投影到：
```javascript
Codex
Claude Code
Qoder / Qoder Work
Cursor
Trae
CodeBuddy / Workbuddy
Generic Agent

```
所以 canonical source 应该是中立的；每个平台由 adapter 转换安装路径、frontmatter 字段、调用方式和限制。
---
## 10. Evolution Writeback
每次执行后，如果发现可复用经验，应该轻量回写。
但不要让每个 skill 都写一大段 Evolution Writeback。你现有 `pm-prototype` 已经有 Evolution Writeback 格式。
新版建议变成全局协议：
```javascript
有观察才记录
没有观察不强写
只记录可复用规则，不记录噪音

```
---
# 4. 总体架构：AI Builder OS 六层模型
我建议的架构如下：
```javascript
AI Builder OS
├── Layer 1: Builder Kernel
├── Layer 2: Core Skills
├── Layer 3: Scenario Bundles
├── Layer 4: References / Templates / Evals
├── Layer 5: Runtime Adapters
└── Layer 6: Future Workspace / App

```
## Layer 1：Builder Kernel
Kernel 是系统心脏。
它不负责写 PRD、做原型、写代码。
它负责所有 skill 共享的规则。
```javascript
kernel/
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
│   ├── production-safety-gate.zh.md
│   └── launch-readiness-gate.zh.md
├── protocols/
│   ├── chinese-first.zh.md
│   ├── assumption-policy.zh.md
│   ├── evidence-policy.zh.md
│   ├── handoff-policy.zh.md
│   ├── progressive-disclosure-policy.zh.md
│   └── evolution-writeback.zh.md
└── README.md

```
Kernel 最关键的是 5 个协议：
| 协议 | 作用 |
| --- | --- |
| Intent Packet | 捕获用户真正想要什么 |
| Output Packet | 让上游产物能交给下游 |
| Evidence Packet | 防止 AI 空口说完成 |
| Decision Record | 记录关键取舍 |
| Agent Task Packet | 把任务交给 Codex / Claude Code / Qoder 等执行 |
---
## Layer 2：Core Skills
核心 skill 控制在 8–10 个，不要太多。
我建议第一版核心 skills 是：
| Skill | 中文名 | 核心产物 |
| --- | --- | --- |
| `builder-router` | 构建路由器 | 模式建议 + skill 建议 + 下一步 |
| `builder-plan-goal` | 计划目标教练 | `/plan` / `/goal` 提示词 |
| `builder-discovery` | 机会发现 | Opportunity Brief |
| `builder-frame` | 功能框定 | Feature Frame |
| `builder-spec` | 规格生成 | PRD / Spec / Acceptance Criteria |
| `builder-prototype` | 原型构建 | Wireframe / Prototype / Mapping |
| `builder-architecture` | 架构规划 | Architecture Plan / Technical Brief |
| `builder-agent-task` | Agent 任务包 | Agent Task Packet |
| `builder-review` | 评审验证 | Review Report / Evidence Audit |
| `builder-decision` | 决策记录 | Decision Record |
可选第二阶段再加：
```javascript
builder-launch
builder-content
builder-research
builder-automation
builder-data-flow
builder-workflow

```
## 为什么我建议加 `builder-agent-task`
这是新版 AI Builder OS 的关键。
因为你的目标用户里包含“不懂编程的普通人”。他们未必应该直接让 Codex 写代码，而是需要一个中间资产：
```javascript
Agent Task Packet

```
它把人的需求翻译成 Agentic 工具可以执行的任务包：
```javascript
- 背景
- 目标
- 范围
- 不做什么
- 相关文件/上下文
- 期望产物
- 验收标准
- 验证方式
- 风险
- 推荐模式：Prompt / Plan / Goal
- 可复制提示词

```
这会是 AI Builder OS 的核心差异化。
---
## Layer 3：Scenario Bundles
Bundle 是面向用户场景的安装包。
不要让所有人都安装所有 skills。
```javascript
bundles/
├── core/
├── product-builder/
├── ai-product-builder/
├── enterprise-digital/
├── no-code-builder/
├── agent-builder/
├── content-builder/
└── personal-project-builder/

```
### Core Bundle
所有用户都需要：
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
### Product Builder Bundle
适合产品经理：
```javascript
builder-discovery
builder-frame
builder-spec
builder-prototype
builder-decision
builder-launch

```
### Enterprise Digital Bundle
适合你真实工作场景：
```javascript
business-process-map
system-context-map
data-flow-map
workflow-automation-frame
enterprise-rollout-plan
stakeholder-alignment

```
### AI Product Builder Bundle
适合 AI 产品 / Agent 产品：
```javascript
ai-patterns
agent-patterns
agent-ui-patterns
eval-design
trust-safety-patterns
human-in-loop-design

```
### No-code Builder Bundle
适合普通人：
```javascript
idea-to-project
no-code-spec
agent-task-packet
prototype-brief
tool-selection-guide
manual-validation-checklist

```
---
## Layer 4：References / Templates / Evals
这是知识和质量层。
```javascript
references/
├── builder-methodology/
├── product-kb/
├── ai-product-kb/
├── agent-design-kb/
├── enterprise-kb/
├── ux-design-kb/
├── architecture-kb/
└── coding-agent-kb/

templates/
├── opportunity-brief/
├── feature-frame/
├── prd/
├── acceptance-criteria/
├── prototype-brief/
├── architecture-plan/
├── agent-task-packet/
├── goal-prompt/
├── review-report/
├── decision-record/
└── launch-plan/

evals/
├── trigger/
├── quality/
├── e2e/
└── regression/

```
这里要强调：**reference 不是 skill。**
比如 AI Agent UI 规则，不需要每次都出现在 `builder-prototype/SKILL.md` 中；只有用户做 AI Agent 原型时才加载。你当前 `pm-prototype` 已经有 AI Agent 场景规则和 Output Packet，但它们现在都堆在主文件里。
新版应该下沉到 references。
---
## Layer 5：Runtime Adapters
适配不同 Agentic 工具。
```javascript
adapters/
├── codex/
│   ├── install.js
│   ├── mapping.md
│   ├── frontmatter-policy.md
│   └── examples.md
├── claude-code/
├── qoder/
├── cursor/
├── trae/
├── workbuddy/
└── generic-agent/

```
不同平台的差异主要包括：
| 差异点 | 说明 |
| --- | --- |
| skill 安装目录 | Codex、Claude Code 不同 |
| 显式调用方式 | Codex `$skill-name`，Claude Code `/skill-name` |
| 自动触发机制 | 依赖 description 质量 |
| side-effect 控制 | 部署、提交、删除等必须限制自动触发 |
| 是否支持 Goal / Plan | Codex 当前有 Goal；其他平台未必同构 |
| 文件/命令权限 | 不同工具权限模型不同 |
Claude Code 官方说明 skill 可以用户显式调用，也可以由 Claude 根据上下文自动加载；对有副作用的技能，可以通过 frontmatter 限制自动调用。([Claude Code](https://code.claude.com/docs/en/skills "Extend Claude with skills - Claude Code Docs"))
因此 adapter 不是可有可无，而是系统稳定性的关键。
---
## Layer 6：Future Workspace / App
这是后续，不是现在。
未来你可以做：
```javascript
AI Builder Workspace
├── Projects
├── Artifacts
├── Decisions
├── Agent Tasks
├── Runs
├── Evidence
├── Knowledge
└── Skills

```
但我建议不要现在启动 App。
现在最重要的是：
```javascript
先让 skills + kernel + bundle 在真实工作中跑通。

```
---
# 5. 新版目录结构建议
我建议把仓库重命名为：
```javascript
ai-builder-os

```
目录如下：
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
├── adapters/
│   ├── codex/
│   ├── claude-code/
│   ├── qoder/
│   ├── cursor/
│   ├── trae/
│   ├── workbuddy/
│   └── generic-agent/
│
├── evals/
│   ├── trigger/
│   ├── quality/
│   ├── e2e/
│   │   ├── new-product-launch-agent/
│   │   ├── doctor-preference/
│   │   └── no-code-builder/
│   └── regression/
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
# 6. Core Skills 设计建议
## 6.1 `builder-router`
**使命**：判断用户当前应该走哪条构建路径。
输入：
```javascript
用户自然语言请求
当前项目上下文
已有资产
目标工具

```
输出：
```javascript
模式建议
推荐 skill
推荐工作流
缺失上下文
下一步提示词

```
核心判断：
```javascript
普通回答 / Discovery / Frame / Spec / Prototype / Architecture / Agent Task / Review / Decision / Launch

```
---
## 6.2 `builder-plan-goal`
你已经做得很好，它应成为 Kernel 级基础 skill。
输出：
```javascript
Plan / Goal / Plan → Goal / 普通 Prompt / 先提问

```
Codex cookbook 对 Goal 的建议很适合直接吸收：强 Goal 应包含 outcome、verification surface、constraints、boundaries、iteration policy、blocked stop condition。([OpenAI 开发者](https://developers.openai.com/cookbook/examples/codex/using_goals_in_codex "Using Goals in Codex"))
---
## 6.3 `builder-frame`
对应原来的 `pm-feature-frame`，但更通用。
核心产物：
```javascript
Feature Frame

```
结构：
```javascript
Problem
User
Scenario
Current Pain
Desired Outcome
Core Capability
Non-goals
Success Criteria
Prototype Direction
Next Skill Hint

```
---
## 6.4 `builder-spec`
对应 `pm-prd`，但不要局限 PRD。
它应该支持：
```javascript
PRD
Mini Spec
Engineering Request
Acceptance Criteria
Agent-readable Spec

```
普通用户不一定需要正式 PRD，可能只需要“可交给 Agent 的规格”。
---
## 6.5 `builder-prototype`
对应 `pm-prototype` v2。
保留你现有能力，但瘦身：
| 保留 | 调整 |
| --- | --- |
| low/high fidelity | 保留 |
| 原型必须有明确目的 | 保留 |
| 高保真必须可交互 | 保留 |
| Layer 0 四问 | 改为“推断优先，必要时询问” |
| 场景判断 | 下沉 reference |
| AI Agent UI 规则 | 下沉 reference |
| Evidence Packet | 上升为全局协议 |
| Meta-Review | 上升为全局协议 |
你当前 `pm-prototype` 对输入源、保真度和交付结构已经定义得很细，包括 PRD、线框、自然语言、对话上下文四种输入源，以及 low/high fidelity 的不同用途。 新版不需要推倒，只需要拆层。
---
## 6.6 `builder-agent-task`
这是新系统的关键 skill。
它把任何想法转成 Agentic 工具任务包。
输出：
```javascript
Agent Task Packet

```
包括：
```javascript
- Task Name
- Background
- Desired Outcome
- Scope
- Non-goals
- Context Sources
- Files / Data / References
- Recommended Mode
- Plan Prompt
- Goal Prompt
- Acceptance Criteria
- Verification
- Risks
- Human Approval Gates

```
这对非程序员尤其重要。
---
## 6.7 `builder-review`
它不只是 code review。
它应该支持：
```javascript
Spec Review
Prototype Review
Agent Output Review
Code Review
Evidence Review
Launch Readiness Review

```
核心问题：
```javascript
它是否真的满足目标？
证据是否充分？
是否有 fake UI / fake test / fake completion？
风险是否被暴露？
下一步是什么？

```
---
# 7. Skill 主文件标准
每个 `SKILL.md` 控制在 200–350 行，最多不要超过 500 行。Claude 官方明确建议主文件接近 500 行时把细节拆到单独文件；Codex 也使用 progressive disclosure，先靠 description 选择 skill。([Claude Code](https://code.claude.com/docs/en/skills "Extend Claude with skills - Claude Code Docs"))
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
## description 写法要求
description 必须写清：
```javascript
这个 skill 做什么
什么时候触发
什么时候不要触发
典型关键词
边界

```
不要写：
```javascript
Helps with product work.

```
要写：
```javascript
Use when the user wants to turn an idea, business requirement, PRD, or rough description into a clear feature frame with problem, user, scenario, success criteria, non-goals, and next skill recommendation. Do not use for code implementation or visual prototype generation.

```
Anthropic 的 best practice 也明确反对 vague description，并建议具体说明使用场景。([Claude平台](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices "Skill authoring best practices - Claude API Docs"))
---
# 8. 质量要求：AI Builder OS 必须防的 8 个失败模式
## 1. 方法论过载
症状：
```javascript
每个 skill 都像一本书
Agent 执行前解释太多
用户等不及

```
解法：
```javascript
主 skill 瘦身
reference 下沉
按需加载

```
---
## 2. Skill 污染
症状：
```javascript
安装太多 skill
description 太长
selector 误触发

```
解法：
```javascript
核心 bundle 小
specialist bundle 可选
utilities 不默认内置

```
Codex 官方提到初始 skills 列表有上下文预算，skills 太多时会缩短描述甚至省略部分 skills。([OpenAI 开发者](https://developers.openai.com/codex/skills "Agent Skills – Codex | OpenAI Developers"))
---
## 3. 目标虚大
症状：
```javascript
帮我做一个完整系统
帮我优化整个产品
帮我重构全部代码

```
解法：
```javascript
builder-plan-goal 强制拆分
大目标先 Plan
Goal 必须可验收

```
---
## 4. Fake Completion
症状：
```javascript
AI 说完成了，但没运行、没验证、没证据

```
解法：
```javascript
Evidence Packet
PASS / PARTIAL / BLOCKED
未验证风险必须列出

```
---
## 5. Fake UI / Fake Test
症状：
```javascript
按钮不能点
测试没真正覆盖
状态没实现

```
解法：
```javascript
Fake UI Gate
Fake Test Gate
Interaction Smoke
Spec Coverage

```
---
## 6. 错误自动化
症状：
```javascript
AI 自动部署
自动提交
自动删除
自动发消息

```
解法：
```javascript
有副作用动作禁止自动调用
需要 explicit approval

```
Claude Code 支持通过 frontmatter 限制自动调用，例如部署类 skill 可以只允许用户显式触发。([Claude Code](https://code.claude.com/docs/en/skills "Extend Claude with skills - Claude Code Docs"))
---
## 7. 非程序员无法使用
症状：
```javascript
系统默认用户懂代码、懂仓库、懂测试

```
解法：
```javascript
Agent Task Packet
No-code Builder Bundle
人类语言说明 + Agent 可执行版本

```
---
## 8. 没有演化机制
症状：
```javascript
每次都重新犯错
经验没有沉淀

```
解法：
```javascript
Evolution Writeback
Eval Seeds
Regression Cases

```
---
# 9. 最小可行版本 MVP
不要一次性重建全部。
我建议 AI Builder OS v0.1 只做这些：
```javascript
kernel/
skills/
  builder-router
  builder-plan-goal
  builder-frame
  builder-spec
  builder-prototype
  builder-agent-task
  builder-review
  builder-decision
bundles/
  core
templates/
  feature-frame
  spec
  prototype-brief
  agent-task-packet
  review-report
  decision-record
adapters/
  codex
  claude-code
evals/
  trigger
  e2e/new-product-launch-agent

```
不做：
```javascript
App
复杂插件
MCP 集成
真实项目数据库
多 Agent 编排
自动发布
过多 specialist skills

```
---
# 10. 推荐构建路线
## Phase 0：重命名与战略重构
目标：
```javascript
pm-copilot-skills → ai-builder-os

```
产物：
```javascript
README.md
docs/architecture.md
kernel/README.md
bundles/core/manifest.json

```
---
## Phase 1：Kernel 先行
先实现：
```javascript
Intent Packet
Output Packet
Evidence Packet
Agent Task Packet
Decision Record
Plan/Goal Routing
Quality Gates

```
---
## Phase 2：Core Skills v1
实现 8 个核心 skills：
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
---
## Phase 3：Prototype v2 作为样板
把旧 `pm-prototype` 拆成：
```javascript
SKILL.md
references/fidelity-modes.zh.md
references/scene-patterns.zh.md
references/visual-systems.zh.md
references/agent-ui-patterns.zh.md
references/prototype-quality-checklist.zh.md

```
---
## Phase 4：Adapters
先做：
```javascript
codex
claude-code
generic-agent

```
暂时不要强行适配所有平台。
---
## Phase 5：Evals
至少做三类 eval：
```javascript
trigger eval：用户说什么会触发哪个 skill
quality eval：输出是否满足资产格式
e2e eval：从 idea 到 agent task / prototype / spec

```
---
# 11. 给 Codex 的重构构建提示词
下面这段可以直接给 Codex。建议你先用 `/plan`，让它基于现有仓库生成迁移计划，不要一上来就大改。
/plan
我要把当前的 `pm-copilot-skills` 项目重新设计并构建为一个新的系统：`AI Builder OS`。
请先理解当前仓库，再制定重构计划。不要直接修改代码。
## 一、背景
当前项目是一个面向产品经理、AI 产品经理和全栈产品构建者的 skills 包，原名接近 `pm-copilot-skills`。它包含多个 PM 类 skills，例如 discovery、feature frame、PRD、prototype、code architect、code implement、review、launch、decision 等。
现在我希望将它升级为：
**AI Builder OS**
它不再只是 PM Copilot，也不只是 PM Skills，而是一套面向产品经理、企业数字化从业者、AI 产品构建者、普通非程序员和独立创造者的 AI 原生构建操作系统。
它要帮助用户借助 Codex、Claude Code、Qoder/Qoder Work、Cursor、Trae、CodeBuddy/Workbuddy 等 Agentic 工具，把模糊想法、业务需求、产品构想、流程问题或个人项目，转化为可执行、可验证、可交付、可沉淀的构建成果。
## 二、产品定位
请将新系统定义为：
> AI Builder OS 是一套面向非纯工程背景构建者的 AI 原生工作操作系统。它帮助用户借助 Agentic 工具完成：理解问题 → 形成判断 → 设计方案 → 生成资产 → 交给 Agent 执行 → 验证结果 → 发布/复盘 → 沉淀能力。
重要：不要把它设计成“会写 PRD 的助手”，也不要只面向产品经理。它的核心身份是 Builder OS。
## 三、目标用户
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
## 四、核心设计原则
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
普通用户不应该先知道该调用哪个 skill。系统需要 `builder-router` 帮用户判断下一步。
8. Small Core, Rich References
核心 skills 要少，references 可以丰富。不要把每个模板都升级为 core skill。
9. Runtime-Agnostic
canonical source 不绑定 Codex 或 Claude Code；通过 adapters 投影到不同 Agentic 工具。
10. Evolution Writeback
有可复用经验时轻量记录；没有观察时不要强写。
## 五、目标架构
请将新项目设计为六层：
1. Builder Kernel
统一路由、模式判断、Packet 协议、证据协议、质量门禁、交接协议。
2. Core Skills
具体工作能力，例如 builder-router、builder-plan-goal、builder-frame、builder-spec、builder-prototype、builder-agent-task、builder-review、builder-decision。
3. Scenario Bundles
面向不同场景组合 skills，例如 core、product-builder、ai-product-builder、enterprise-digital、no-code-builder、agent-builder。
4. References / Templates / Evals
方法论、模板、检查清单、触发和质量评估案例。
5. Runtime Adapters
适配 Codex、Claude Code、Qoder、Cursor、Trae、Workbuddy、generic-agent。
6. Future Workspace / App
后续再做项目、资产、决策、运行记录的工作台。当前不要实现 App。
## 六、建议目录结构
请设计并逐步迁移到以下结构：
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
├── adapters/
│   ├── codex/
│   ├── claude-code/
│   ├── qoder/
│   ├── cursor/
│   ├── trae/
│   ├── workbuddy/
│   └── generic-agent/
│
├── evals/
│   ├── trigger/
│   ├── quality/
│   ├── e2e/
│   │   ├── new-product-launch-agent/
│   │   ├── doctor-preference/
│   │   └── no-code-builder/
│   └── regression/
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
## 七、Core Skills 第一版
请先设计以下核心 skills，不要一次性迁移所有旧 PM skills：
1. `builder-router`
作用：判断用户当前任务应该走普通回答、Plan、Goal、Discovery、Frame、Spec、Prototype、Agent Task、Review、Decision 还是 Launch。
产物：模式建议、推荐 skill、下一步提示词。
2. `builder-plan-goal`
作用：判断是否应该使用 Plan 模式、Goal 模式、Plan → Goal，或者普通 Prompt。
产物：中文为主、可直接复制的 `/plan` 或 `/goal` 提示词。
3. `builder-frame`
作用：把模糊需求转化为 Feature Frame。
产物：Problem、User、Scenario、Current Pain、Desired Outcome、Core Capability、Non-goals、Success Criteria、Next Skill Hint。
4. `builder-spec`
作用：把 Feature Frame 或需求转成可交付规格。
产物：Mini Spec / PRD / Acceptance Criteria / Engineering Request / Agent-readable Spec。
5. `builder-prototype`
作用：把需求、PRD、Feature Frame 或自然语言构想转成低保真线框或高保真可交互原型。
产物：wireframe 或 prototype、MAPPING.md、design decisions、Evidence Packet。
注意：从旧 `pm-prototype` 中吸收能力，但主 SKILL.md 必须瘦身，详细视觉系统、场景判断、AI Agent UI 规则放 references。
6. `builder-agent-task`
作用：把人类需求转成 Codex、Claude Code、Qoder、Cursor 等 Agentic 工具可执行的任务包。
产物：Agent Task Packet，包括背景、目标、范围、不做什么、上下文、验收标准、验证方式、推荐模式、Plan/Goal 提示词。
7. `builder-review`
作用：评审规格、原型、Agent 输出、代码或交付物是否真实满足目标。
产物：Review Report、Evidence Audit、风险、修正建议。
8. `builder-decision`
作用：记录关键取舍。
产物：Decision Record，包括背景、选项、取舍、决定、影响、后续检查点。
## 八、SKILL.md 标准
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
## 九、Packet 协议
请在 kernel/packets/ 中创建以下协议文件：
### Intent Packet
用于捕获用户意图：
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
### Output Packet
用于下游交接：
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
### Evidence Packet
用于防止 fake completion：
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
### Agent Task Packet
用于交给 Agentic 工具执行：
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
### Decision Record
用于记录决策：
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
## 十、质量门禁
请在 kernel/gates/ 中创建：
1. builder-quality-gates.zh.md
通用质量门禁。
2. fake-ui-gate.zh.md
检查原型中按钮、链接、状态、表单、导航是否真实可用或明确标注不可用。
3. fake-test-gate.zh.md
检查测试是否真实覆盖关键行为，而不是只为了通过。
4. security-privacy-gate.zh.md
检查敏感信息、权限、隐私、安全风险。
5. production-safety-gate.zh.md
对部署、删除、提交、发消息、修改生产数据等动作要求显式确认。
## 十一、Bundle 第一版
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
manifest.json 至少包含：
```javascript
{
  "name": "ai-builder-os-core",
  "displayName": "AI Builder OS Core",
  "description": "Core skills and kernel protocols for turning ideas, requirements, and project context into executable, verifiable AI Builder workflows.",
  "skills": [],
  "references": [],
  "templates": [],
  "target_runtimes": ["codex", "claude-code", "generic-agent"]
}

```
## 十二、Adapters 第一版
请先设计，不必完全实现所有平台。
创建：
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
- Codex 使用 `$skill-name` 显式调用，或依靠 description 隐式触发。
- Claude Code 使用 `/skill-name` 显式调用，或由模型自动触发。
- 有副作用的技能必须禁止自动调用或要求用户确认。
- adapters 只负责投影和安装，不要复制业务方法论。
## 十三、Evals 第一版
创建至少三类 eval：
1. trigger eval
验证用户自然语言是否触发正确 skill。
2. quality eval
验证 skill 输出是否满足 Output Contract。
3. e2e eval
验证从 idea 到 spec / prototype / agent task / review 的完整路径。
至少创建以下 E2E 场景：
```javascript
evals/e2e/new-product-launch-agent/
evals/e2e/no-code-builder/

```
`new-product-launch-agent` 场景应模拟：一个消费电子企业新品上市流程智能体应用，从用户构想到 Feature Frame、Spec、Prototype、Agent Task Packet。
## 十四、从旧项目迁移
请先检查当前仓库已有 README、skills、references、scripts、evals。
迁移原则：
- 不要直接删除旧内容，先移动到 `_legacy/` 或 `_archived/`。
- 保留有价值的方法论，但下沉到 references。
- 保留有价值的安装脚本和验证脚本，但改名适配 ai-builder-os。
- 旧 `pm-prototype` 的大量设计规则要拆分，不要继续塞进一个 SKILL.md。
- 旧 `pm-*` 可以逐步映射到 `builder-*`，不要一次性全量迁移。
- 旧 README 中关于 canonical source、中文优先、证据驱动、Output Packet、runtime adapters 的思想应保留并升级。
## 十五、不要做的事情
本轮不要做：
- 不要构建 App / Workspace。
- 不要接入 MCP。
- 不要实现真实部署。
- 不要创建太多 specialist skills。
- 不要把 pdf/pptx 这类 utility 默认塞进 core bundle。
- 不要让每个 skill 都变成长篇方法论文档。
- 不要直接把 PM Copilot 改名后结束，必须完成架构重构。
## 十六、计划输出要求
请先输出重构计划，必须包含：
1. 当前仓库理解
2. 当前结构问题
3. 目标架构
4. 文件迁移策略
5. 新目录结构
6. Core Skills 设计
7. Kernel 协议设计
8. Bundle 设计
9. Adapter 设计
10. Eval 设计
11. 分阶段实施计划
12. 风险和回滚策略
13. 第一阶段可执行 `/goal` 提示词
不要直接改代码。等我确认计划后，再执行 Milestone 1。
---
# 12. 我建议你让 Codex 执行的第一个 Goal
当 Codex 给出计划、你确认之后，第一个 Goal 不要太大。
建议第一个 `/goal` 是：
```javascript
/goal

将当前仓库重构为 AI Builder OS 的第一阶段骨架，保留旧内容但不破坏现有文件。

完成目标：
- 创建新的顶层目录：kernel、skills、bundles、references、templates、adapters、evals、examples、docs。
- 创建 docs/architecture.md，说明 AI Builder OS 六层架构。
- 创建 kernel/README.md，并定义 Intent Packet、Output Packet、Evidence Packet、Agent Task Packet、Decision Record 的概览。
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
- 不删除旧 pm-* skills；如需移动，先放入 _legacy/ 或 _archived/。
- 更新 README.md 的产品定位为 AI Builder OS，但保留旧项目迁移说明。

验证方式：
- 目录结构符合目标架构。
- 每个核心 skill 都有 name、description、Mission、When to Use、When Not to Use、Output Contract、Handoff。
- README 能清楚说明 AI Builder OS 的定位、用户、架构、安装方向。
- 不引入新依赖，除非明确说明。
- 不实现 App、MCP、真实工具集成。

完成后汇报：
- 新增/修改文件列表
- 旧内容如何保留
- 哪些只是草案
- 下一阶段建议

```
---
# 13. 最后给你的判断
你这次改名不是 cosmetic rename，而是战略升级。
从：
```javascript
PM Copilot Skills

```
到：
```javascript
AI Builder OS

```
本质变化是：
| 过去 | 现在 |
| --- | --- |
| 产品经理技能包 | 构建者操作系统 |
| 文档/分析导向 | 资产/执行/验证导向 |
| PM 流水线 | Builder 全流程 |
| 单平台 skill | 多 runtime adapter |
| 人知道调哪个 skill | Router 帮人判断 |
| Prompt 优化 | Agent Task Packet |
| 产出建议 | 产出证据 |
我的最终建议：
> **AI Builder OS 的第一版不要追求强大，追求“让普通人也能稳定把任务交给 Agent，并知道如何验收”。**
这会比“有很多厉害 skills”更有价值。