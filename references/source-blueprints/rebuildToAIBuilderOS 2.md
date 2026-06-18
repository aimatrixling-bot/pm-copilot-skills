# Rebuildtoaibuilderos 2

是的，这三个都**必须考虑**，而且它们应该成为新版 **AI Builder OS** 的核心能力，而不是附属功能。
我对这三个问题的判断是：
| 问题 | 是否需要 | 应该放在哪一层 |
| --- | --- | --- |
| Harness 技巧 | 需要，但要轻量化 | **Execution Harness / Kernel** |
| 记忆与持续进化 | 非常需要 | **Memory & Evolution Layer** |
| Eval / 评测驱动 | 必须需要 | **Eval System / Quality Layer** |
你现有版本其实已经“有雏形”了：README 里已经吸收了 Guides、Sensors、Steering Loop、hook/gate 思维，也有 Eval Notes、Meta-Review、Evolution Writeback 等结构；`pm-prototype` 里也已经有 Evidence Packet、Sensor Gates、Meta-Review、Evolution Writeback。
但问题是：这些能力现在是**散落在各个 skill 里**，还没有上升为 AI Builder OS 的系统层。
我的建议是：**新版 AI Builder OS 必须新增三层：Harness、Memory、Eval。**
---
# 1. Harness：要考虑，但不要让它支配整个系统
## 我的判断
Harness 的价值很大，但不能把 AI Builder OS 做成一个“超重型执行框架”。
你现在需要的不是一个庞大的 harness，而是一个：
> **轻量、可组合、能约束 Agent 行为的 Execution Harness。**
它的职责不是替代 skill，而是规范 Agent 的执行方式。
简单说：
```javascript
Skill = 做什么
Harness = 怎么安全、稳定、可验证地做
Eval = 怎么判断做得好不好
Memory = 做完之后如何沉淀

```
---
## Harness 应该包含什么？
我建议 AI Builder OS 的 Harness 由 6 个模块组成。
```javascript
Execution Harness
├── Guides        # 执行前指导
├── Sensors       # 执行中感知
├── Gates         # 关键节点门禁
├── Steering Loop # 发现偏差后如何调整
├── Tool Policy   # 工具/副作用约束
└── Run Report    # 执行结束报告

```
### A. Guides：执行前指导
Guides 是“开始前先看清楚”。
例如：
```javascript
- 当前任务是什么？
- 推荐模式是 Prompt / Plan / Goal / Plan→Goal？
- 当前资产是什么？
- 哪些上下文必须读取？
- 哪些边界不能碰？
- 最小可交付物是什么？

```
这适合放在：
```javascript
kernel/harness/guides.zh.md

```
---
### B. Sensors：执行中感知
Sensors 是“执行中要留意什么”。
例如：
```javascript
- 是否范围膨胀？
- 是否开始重构无关代码？
- 是否编造不存在的文件？
- 是否做了 fake UI？
- 是否没有验证就声称完成？
- 是否对不确定事项默默假设？

```
你现在 README 里已经有 Sensor Gates 的思路，`pm-prototype` 也有 Fake UI、Spec Coverage、Accessibility、Visual Consistency 等 sensor。
新版应该把它们抽成通用协议。
---
### C. Gates：关键门禁
Gates 是“到某个节点必须检查”。
我建议 AI Builder OS 的通用 Gates 包括：
| Gate | 作用 |
| --- | --- |
| Intent Gate | 是否真的理解用户要什么 |
| Scope Gate | 是否明确做什么、不做什么 |
| Plan Gate | 复杂任务是否先计划 |
| Evidence Gate | 是否有完成证据 |
| Safety Gate | 是否涉及删除、部署、发消息、生产数据 |
| Review Gate | 是否需要人工确认 |
| Handoff Gate | 是否能交给下一个 skill 或 Agent |
你现有的 Gate 机制已经有 Pause / Risk / Nudge 的失败处理，这是很好的，可以保留并上升到 Kernel。
---
### D. Steering Loop：偏差修正循环
这是 Harness 最有价值的部分。
不是一次性执行，而是：
```javascript
Plan → Act → Observe → Check → Adjust → Evidence → Handoff

```
我建议定义成：
```javascript
kernel/harness/steering-loop.zh.md

```
规则：
```javascript
如果发现目标不清 → 回到 Intent Gate
如果发现范围过大 → 回到 Plan
如果发现输出不可验证 → 回到 Evidence Gate
如果发现用户目标与实现冲突 → 暂停并说明取舍
如果发现执行风险超过权限 → 请求人工确认

```
---
### E. Tool Policy：工具与副作用策略
AI Builder OS 面向 Codex、Claude Code、Qoder、Cursor、Trae 等工具，未来很容易涉及真实文件、代码、Git、部署、外部系统。
必须有工具策略：
```javascript
允许：
- 读取文件
- 创建草案
- 生成原型
- 运行本地测试
- 写入新文档

谨慎：
- 修改现有代码
- 批量重构
- 安装依赖
- 修改配置

必须确认：
- 删除文件
- git commit / push
- 部署
- 发邮件/消息
- 修改生产数据
- 调用外部 API 写操作

```
这应该是 Kernel 级协议，不属于某一个 skill。
---
## 我建议新增目录
```javascript
kernel/
├── harness/
│   ├── README.md
│   ├── guides.zh.md
│   ├── sensors.zh.md
│   ├── gates.zh.md
│   ├── steering-loop.zh.md
│   ├── tool-policy.zh.md
│   └── run-report.schema.md

```
---
# 2. Memory：必须考虑，而且是 AI Builder OS 的长期壁垒
## 我的判断
如果没有记忆，AI Builder OS 只是一个高级 prompt/skill 包。
如果有好的记忆机制，它才会变成真正的 OS。
但这里要小心：
> **记忆不是把所有内容都存下来。记忆是把可复用判断、偏好、决策、资产和教训结构化沉淀。**
你现有 `pm-prototype` 已经有 Evolution Writeback：执行后记录方法论偏差、反理实化补充、边界调整信号。
但这还是 skill 层的“经验回写”。新版 AI Builder OS 应该做成完整的 Memory Layer。
---
## 我建议的五类记忆
### A. User Memory：用户偏好记忆
记录使用者长期偏好。
例如：
```javascript
language: 中文优先，必要术语保留英文
style: 系统化、蓝图化、可执行
preferred_outputs:
  - frameworks
  - templates
  - checklists
  - specifications
risk_preference: 偏好提前暴露风险和取舍
tool_preference:
  - Codex
  - Claude Code
  - Qoder

```
注意：
这类记忆应该尽量记录**工作偏好**，不要记录敏感隐私。
---
### B. Project Memory：项目记忆
每个项目都有自己的上下文。
例如：
```javascript
项目目标
业务背景
关键用户
技术栈
已有资产
重要约束
当前阶段
关键决策
未解决问题
下一步

```
建议位置：
```javascript
.ai-builder/projects/{project-name}/PROJECT.md
.ai-builder/projects/{project-name}/context.md
.ai-builder/projects/{project-name}/decisions/
.ai-builder/projects/{project-name}/artifacts/

```
---
### C. Artifact Memory：资产记忆
记录产出的资产，而不是只靠文件散落。
例如：
```javascript
artifact_id: spec-20260617-001
artifact_type: feature-frame
path: artifacts/feature-frame.md
source: user conversation + discovery
key_decisions:
  - first milestone focuses on prototype
status: draft
next_skill_hint: builder-prototype

```
这会让系统知道：
```javascript
已有 Feature Frame
已有 Spec
已有 Prototype
下一步该进入 Agent Task 还是 Review

```
---
### D. Decision Memory：决策记忆
这是最重要的长期资产之一。
例如：
```javascript
decision_title: 第一版不做真实后端
context: 为了快速验证新品上市流程智能体应用
options:
  - 做真实后端
  - 使用 mock data
decision: 使用 mock data
rationale: 降低复杂度，优先验证流程和交互
reversal_conditions:
  - 原型被确认进入开发阶段

```
这能避免以后反复问：
```javascript
为什么当时不做后端？
为什么用 mock？
为什么先做 low fidelity？

```
---
### E. Skill Evolution Memory：技能进化记忆
这是 AI Builder OS 自我提升的核心。
记录：
```javascript
某个 skill 经常误触发
某个模板太复杂
某个 Gate 太严格
某个用户场景缺 reference
某个 eval case 应新增
某个输出格式不利于后续 handoff

```
建议位置：
```javascript
docs/evolution-log.md
evals/regression/
kernel/evolution/

```
---
## Memory 的工作流
我建议定义成：
```javascript
Before Run:
读取 User Memory + Project Memory + Artifact Index + Recent Decisions

During Run:
使用当前上下文，但不要污染长期记忆

After Run:
生成 Output Packet + Evidence Packet + Decision Record + Evolution Note

Periodic:
把多次运行记录总结成更稳定的偏好、规则、eval case

```
---
## 新增目录建议
```javascript
memory/
├── README.md
├── schemas/
│   ├── user-profile.schema.md
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
    ├── user-memory.example.md
    ├── project-memory.example.md
    └── artifact-index.example.yaml

```
项目级可以是：
```javascript
.ai-builder/
├── PROJECT.md
├── MEMORY.md
├── artifact-index.yaml
├── decision-log.md
├── run-log.md
└── evolution-log.md

```
---
# 3. Eval：必须考虑，而且要作为“评测驱动开发”的主线
## 我的判断
Eval 不是锦上添花。
对 AI Builder OS 来说，Eval 是系统能否长期稳定的关键。
你当前 README 已经有验证脚本，包括 `validate:builder-os`、`validate:codex-install`、`validate:doctor-preference-e2e`、`test:doctor-preference-e2e`，并说明这些会验证 canonical source、Codex 安装完整性、核心结构、trigger eval 种子覆盖和真实 E2E 场景。
所以你已经有 eval 意识。下一步是把它体系化。
---
## Eval 应该评什么？
我建议至少做 7 类 eval。
### 1. Trigger Eval：触发评测
评估：
```javascript
用户说这句话时，应该触发哪个 skill？
是否误触发？
是否漏触发？
是否应该先 router？

```
示例：
```javascript
input: "我想做一个新品上市流程智能体应用，先帮我看看怎么开始"
expected:
  skill: builder-router
  mode: plan
  next_skill_candidates:
    - builder-frame
    - builder-spec

```
这是最重要的 eval，因为 skill 系统首先要“选对能力”。
---
### 2. Routing Eval：路径评测
评估：
```javascript
用户从 idea 进来，系统是否推荐了合理路径？

```
例如：
```javascript
Idea → builder-frame → builder-spec → builder-prototype → builder-agent-task

```
你现有 README 中已有 pipeline 和 Output Packet 流转，这正适合作为 Routing Eval 的基础。
---
### 3. Output Contract Eval：产物契约评测
评估输出是否满足格式。
例如 `builder-agent-task` 必须包含：
```javascript
background
desired_outcome
scope
non_goals
recommended_mode
acceptance_criteria
verification
human_approval_gates

```
缺字段就失败。
---
### 4. Evidence Eval：证据评测
评估 AI 是否真的提供证据。
例如：
```javascript
是否有文件路径？
是否有命令结果？
是否有手工验收步骤？
是否明确 PASS / PARTIAL / BLOCKED？
是否列出未验证风险？

```
你现有 `pm-prototype` 的 Evidence Packet 结构已经很好，可以升级为通用 Evidence Eval。
---
### 5. Quality Rubric Eval：质量评分
不是只检查字段，而是评估质量。
例如：
| 维度 | 评分 |
| --- | --- |
| 目标清晰度 | 1–5 |
| 范围控制 | 1–5 |
| 业务价值 | 1–5 |
| 可执行性 | 1–5 |
| 验收标准 | 1–5 |
| 风险暴露 | 1–5 |
| 下游可用性 | 1–5 |
---
### 6. Regression Eval：回归评测
每次修改 skill 后，跑一组固定案例，防止能力退化。
例如：
```javascript
- 模糊大任务是否仍然先 Plan
- 明确小任务是否不会误触发复杂流程
- 原型任务是否不会跳到 PRD
- Agent Task 是否不会变成普通建议

```
---
### 7. Personalization Eval：个性化评测
这点非常适合你。
评估：
```javascript
系统是否越来越贴合用户偏好？
是否使用中文优先？
是否偏向资产化输出？
是否保留了用户偏好的结构？
是否避免了用户讨厌的泛泛建议？

```
这能把 Memory 和 Eval 连接起来。
---
## Eval 数据结构建议
```javascript
evals/
├── trigger/
│   ├── builder-router.cases.yaml
│   ├── builder-plan-goal.cases.yaml
│   └── builder-prototype.cases.yaml
├── output-contract/
│   ├── builder-agent-task.schema.yaml
│   ├── builder-spec.schema.yaml
│   └── builder-review.schema.yaml
├── quality/
│   ├── rubrics/
│   │   ├── feature-frame.rubric.md
│   │   ├── agent-task-packet.rubric.md
│   │   └── prototype.rubric.md
├── e2e/
│   ├── new-product-launch-agent/
│   ├── doctor-preference/
│   └── no-code-builder/
├── regression/
└── personalization/

```
---
# 4. 三者之间的关系
这三个不是独立模块，而是一个闭环。
```javascript
Harness 约束执行
  ↓
Evidence 记录结果
  ↓
Eval 判断质量
  ↓
Memory 沉淀经验
  ↓
Kernel 更新规则
  ↓
下次执行更贴合用户

```
更完整：
```javascript
User Request
  ↓
Router
  ↓
Plan / Goal Decision
  ↓
Skill Execution
  ↓
Harness: Guides / Sensors / Gates
  ↓
Output Packet + Evidence Packet
  ↓
Eval: Trigger / Contract / Quality / E2E
  ↓
Memory: Project / User / Decision / Evolution
  ↓
Improved Future Runs

```
这就是 AI Builder OS 真正像 OS 的地方。
---
# 5. 我会如何更新之前的架构
我建议把原来的六层架构升级为八层：
```javascript
AI Builder OS
├── 1. Builder Kernel
├── 2. Execution Harness
├── 3. Memory & Evolution
├── 4. Core Skills
├── 5. Scenario Bundles
├── 6. References / Templates
├── 7. Eval System
└── 8. Runtime Adapters / Future Workspace

```
或者更工程化一点：
```javascript
ai-builder-os/
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
---
# 6. 我建议给 Codex 的补充指令
你可以把下面这段追加到上一份 Codex `/plan` 提示词中。
```javascript
补充要求：请在 AI Builder OS 的重新设计中，显式考虑 Harness、Memory/Evolution 和 Eval 三个系统层。

## 一、Execution Harness

请新增 `harness/` 或 `kernel/harness/`，用于定义 Agent 执行过程中的通用约束和运行协议。

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

要求：
- Harness 必须轻量化，不要变成复杂框架。
- 不要让单一 Harness 支配整个系统。
- Skill 仍然负责具体任务，Harness 负责执行纪律。

## 二、Memory & Evolution

请新增 `memory/`，用于定义 AI Builder OS 如何在持续使用中沉淀上下文、偏好、决策、资产和经验。

至少包含：

- README.md
- schemas/user-memory.schema.md
- schemas/project-memory.schema.md
- schemas/artifact-index.schema.md
- schemas/decision-memory.schema.md
- schemas/evolution-note.schema.md
- policies/what-to-remember.zh.md
- policies/what-not-to-remember.zh.md
- policies/privacy-policy.zh.md
- policies/summarization-policy.zh.md
- examples/

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

```text
.ai-builder/
├── PROJECT.md
├── MEMORY.md
├── artifact-index.yaml
├── decision-log.md
├── run-log.md
└── evolution-log.md

```
## 三、Eval System
请新增或强化 `evals/`，把 AI Builder OS 设计为评测驱动的 skill/bundle 系统。
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
请为以下场景建立第一批 eval：
1. 用户提出模糊大任务
预期：触发 builder-router，建议 Plan 或 Plan → Goal。
2. 用户要求创建原型
预期：触发 builder-prototype，而不是 builder-spec 或 builder-agent-task。
3. 用户已有清晰计划，要交给 Codex 执行
预期：触发 builder-agent-task 或 builder-plan-goal，生成可执行 Goal Prompt。
4. 用户提出新品上市流程智能体应用
预期：从 builder-frame → builder-spec → builder-prototype → builder-agent-task 形成 E2E 路径。
5. 用户是非程序员，想做个人项目
预期：生成人类可理解说明 + Agent 可执行任务包，而不是直接假设用户懂代码。
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
要求：
- Skill 变更必须新增或更新 eval case。
- 重要 bug 修复必须变成 regression case。
- E2E eval 应优先覆盖真实使用场景，而不是抽象 toy case。
- Eval 结果应能指导 Memory/Evolution Writeback。
```javascript

---

# 7. 最终建议

你这三个问题都非常关键。

我的最终判断是：

> **Harness 是执行纪律，Memory 是长期个性化，Eval 是质量飞轮。三者缺任何一个，AI Builder OS 都只能是一个高级 skill 包，而不是 OS。**

我建议新版架构直接升级为：

```text
AI Builder OS =
Builder Kernel
+ Execution Harness
+ Memory & Evolution
+ Core Skills
+ Scenario Bundles
+ References & Templates
+ Eval System
+ Runtime Adapters

```
优先级：
```javascript
P0: Kernel + Harness + Core Skills
P1: Memory schemas + Eval seeds
P2: Prototype v2 + Agent Task Packet
P3: Project-level .ai-builder memory
P4: Runtime adapters
P5: Workspace/App

```
真正的壁垒不是你有多少 skills，而是：
```javascript
每次使用后，系统是否更懂你？
每次输出后，系统是否有证据？
每次修改后，系统是否能评测不退化？
每次执行中，系统是否能防止 AI 失控？

```
这四个问题，就是 AI Builder OS 的护城河。