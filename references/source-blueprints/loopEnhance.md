是的，\*\*Loop Engineering 非常值得引入\*\*。而且我会说得更直接一点：



> 你前面设计的 AI Builder OS，其实已经在朝 Loop Engineering 走了；只是我们之前把它叫作 Kernel、Harness、Memory、Eval、Plan/Goal Routing。

> Loop Engineering 给了它一个更清晰的上位概念：\*\*不是让用户一次次提示 Agent，而是设计一套会持续发现、执行、验证、记录、调整的循环系统。\*\*



\---



\# 1. 什么是 Loop Engineering？



\## 简单定义



\*\*Loop Engineering\*\* 可以理解为：



> 设计一套让 AI Agent 持续运行的反馈循环系统，而不是每次由人手动写 Prompt、看结果、再写下一条 Prompt。



它关注的不是单条提示词，而是整个循环：



```text

目标 → 上下文 → 行动 → 观察 → 验证 → 调整 → 继续 / 停止 / 交给人

```



Addy Osmani 在 2026 年 6 月的文章里把它描述为：你不再是那个一条条提示 Agent 的人，而是设计“提示 Agent 的系统”；这个 loop 会发现工作、分配工作、检查结果、记录已完成内容，并决定下一步。(\[addyosmani.com]\[1])



Kilo 的定义也很接近：Prompt Engineering 关注模型输入，Loop Engineering 关注模型周围的完整流程，包括工具、上下文、验证、停止条件和人类介入方式。(\[Kilo]\[2])



\---



\## 它和 Prompt Engineering / Context Engineering 的关系



我建议这样理解：



| 层级                   | 优化对象                     | 单位          |

| -------------------- | ------------------------ | ----------- |

| Prompt Engineering   | 一条指令怎么写                  | 单次输入        |

| Context Engineering  | 模型看到什么上下文                | 单次任务环境      |

| Harness Engineering  | 单个 Agent 在什么环境里执行        | 单次 Agent 运行 |

| \*\*Loop Engineering\*\* | 谁在什么时候提示 Agent、如何验证、如何继续 | 多轮自动循环      |



Lushbinary 的文章也把它放在 Prompt Engineering 和 Context Engineering 之上：Prompt 优化一条指令，Context 优化模型看到的条件，Loop Engineering 优化“系统何时提示、如何验证、如何继续”。(\[Lushbinary]\[3])



所以它不是替代 Prompt，而是把 Prompt 变成一个更大系统里的组件。



\---



\# 2. 一个 Loop 通常包含什么？



我建议用这个结构理解：



```text

Loop =

Trigger

\+ Goal

\+ Context Loader

\+ Skill / Agent Executor

\+ Observation

\+ Verification

\+ Adjustment

\+ Memory Writeback

\+ Stop / Handoff Condition

```



展开来看：



| 组成               | 含义                                         |

| ---------------- | ------------------------------------------ |

| Trigger          | 什么会启动循环：用户请求、定时任务、文件变化、测试失败、review comment |

| Goal             | 当前循环要达成什么结果                                |

| Context Loader   | 读取哪些文件、历史、资产、决策、规则                         |

| Executor         | 调用哪个 skill、agent、tool 或 workflow           |

| Observation      | 收集结果：diff、日志、测试、截图、用户反馈                    |

| Verification     | 判断是否达标                                     |

| Adjustment       | 如果失败，下一轮如何改变策略                             |

| Memory Writeback | 把经验、决策、证据写回                                |

| Stop / Handoff   | 何时停止，何时交给人                                 |



Kilo 的文章把基础循环拆成 Intent、Context、Action、Observation、Adjustment 五步；在 coding 场景里又进一步表达为 Plan、Search、Modify、Verify、Repair、Summarize。(\[Kilo]\[2])



\---



\# 3. 常见 Loop 模式



\## A. Retry Loop



适合短任务：



```text

尝试 → 验证 → 失败 → 修正 → 再试

```



例如：



```text

写一个函数 → 跑测试 → 失败 → 修复 → 再跑

```



MindStudio 把 Retry Loop 作为最简单模式，适合有明确 pass/fail 标准的短任务，但风险是无限重试，必须有策略变化和停止条件。(\[MindStudio]\[4])



\---



\## B. Plan → Execute → Verify Loop



适合多步骤任务：



```text

计划 → 执行一步 → 验证 → 更新计划 → 下一步

```



适合：



```text

重构模块

实现一个新功能

构建一个页面原型

迁移一个服务

```



这个和我们前面讨论的 Plan mode / Goal mode 非常一致。



\---



\## C. Explore → Narrow Loop



适合不确定问题：



```text

探索多个方向 → 收集证据 → 收敛到最优方案

```



适合：



```text

debug 未知错误

评估技术选型

探索产品方案

分析复杂业务流程

```



MindStudio 提到 Explore-Narrow Loop 适合 debugging、陌生 API、性能优化等不确定场景，但要小心上下文爆炸和成本失控。(\[MindStudio]\[4])



\---



\## D. Maker → Checker Loop



适合高质量交付：



```text

一个 Agent 产出

另一个 Agent 检查

再回到产出 Agent 修正

```



对应我们前面说的：



```text

builder-agent-task → builder-review → 修正 → evidence packet

```



Addy 提到 sub-agents 的一个重要价值，就是一个负责产生想法，另一个负责检查。(\[addyosmani.com]\[1])



\---



\## E. Scheduled Discovery / Triage Loop



适合持续工作：



```text

定时扫描 → 发现任务 → 分类优先级 → 派发 → 记录

```



例如：



```text

每天检查 GitHub issues

每天整理客户反馈

每周扫描项目 backlog

每天总结 AI Builder OS 使用中的 evolution signals

```



Addy 把定时自动发现和 triage 视为 Loop Engineering 的核心 building block 之一。(\[addyosmani.com]\[1])



\---



\# 4. 它对 AI Builder OS 的价值



我的判断是：



> \*\*Loop Engineering 应该成为 AI Builder OS 的“运行层”，而不只是一个参考概念。\*\*



我们之前已经设计了：



```text

Kernel

Harness

Memory

Eval

Skills

Bundles

Adapters

```



现在可以进一步明确：



```text

Loop Engineering = 把 Kernel / Harness / Memory / Eval / Skills 串成可持续运行的工作循环

```



也就是说，AI Builder OS 不只是有很多 skills，而是有很多可复用 loops。



\---



\# 5. AI Builder OS 应该如何引入 Loop Engineering？



\## 建议一：新增 `loops/` 目录



我建议在 AI Builder OS 目录中新增：



```text

loops/

├── README.md

├── schemas/

│   └── loop-definition.schema.md

├── patterns/

│   ├── retry-loop.zh.md

│   ├── plan-execute-verify-loop.zh.md

│   ├── explore-narrow-loop.zh.md

│   ├── maker-checker-loop.zh.md

│   ├── human-approval-loop.zh.md

│   └── evolution-loop.zh.md

├── recipes/

│   ├── idea-to-spec.loop.md

│   ├── spec-to-prototype.loop.md

│   ├── prototype-review.loop.md

│   ├── agent-task-execution.loop.md

│   ├── skill-evolution.loop.md

│   └── project-weekly-review.loop.md

└── evals/

&#x20;   └── loop-quality-rubric.md

```



这样它不会污染每个 skill，但能成为 OS 的运行协议。



\---



\## 建议二：定义 Loop Definition Schema



每个 loop 都应该有固定格式。



```yaml

loop\_id:

name:

purpose:

trigger:

entry\_condition:

inputs:

context\_sources:

steps:

&#x20; - step\_id:

&#x20;   skill\_or\_agent:

&#x20;   action:

&#x20;   expected\_output:

&#x20;   verifier:

state:

memory\_read:

memory\_write:

evidence\_required:

stop\_conditions:

handoff\_conditions:

human\_approval\_gates:

budget\_limits:

risk\_level:

eval\_binding:

```



这很关键。否则 Loop Engineering 会变成另一个泛泛概念。



\---



\## 建议三：把现有 Harness 升级为 Loop Harness



我们之前设计的 Harness 是：



```text

Guides

Sensors

Gates

Steering Loop

Tool Policy

Run Report

```



现在可以升级为：



```text

Loop Harness =

Guides

\+ Sensors

\+ Gates

\+ State

\+ Scheduler

\+ Verifier

\+ Budget Guard

\+ Human Handoff

\+ Run Report

```



尤其要新增两个东西：



| 新增模块           | 为什么需要                     |

| -------------- | ------------------------- |

| State          | loop 必须知道自己第几轮、做过什么、失败过什么 |

| Stop Condition | loop 必须知道何时停止，不能无限执行      |



Lushbinary 特别提醒，Loop Engineering 不是让工作变简单；坏 loop 会把坏决策放大得更快。(\[Lushbinary]\[3])



\---



\# 6. 对 AI Builder OS 最值得引入的 6 个 Loop



\## 1. Idea → Frame Loop



用途：把模糊想法变成 Feature Frame。



```text

用户想法

&#x20; ↓

builder-router

&#x20; ↓

builder-frame

&#x20; ↓

检查 Problem / User / Scenario / Success Criteria 是否完整

&#x20; ↓

缺失则追问或假设

&#x20; ↓

输出 Feature Frame

```



适合普通用户和产品经理。



\---



\## 2. Frame → Spec Loop



用途：把 Feature Frame 变成可交付规格。



```text

Feature Frame

&#x20; ↓

builder-spec

&#x20; ↓

验收标准检查

&#x20; ↓

风险/非目标检查

&#x20; ↓

Review

&#x20; ↓

输出 Spec / PRD / Agent-readable Spec

```



\---



\## 3. Spec → Prototype Loop



用途：把规格变成原型。



```text

Spec

&#x20; ↓

builder-prototype

&#x20; ↓

low fidelity / high fidelity 判断

&#x20; ↓

生成 wireframe / prototype

&#x20; ↓

Fake UI Gate

&#x20; ↓

Mapping Evidence

&#x20; ↓

Review

```



这可以直接吸收你旧 `pm-prototype` 中的 low/high fidelity、MAPPING.md、Fake UI、Evidence Packet 等机制。



\---



\## 4. Agent Task Execution Loop



用途：把任务交给 Codex / Claude Code / Qoder 执行。



```text

Spec / Goal

&#x20; ↓

builder-agent-task

&#x20; ↓

生成 Plan / Goal Prompt

&#x20; ↓

执行 Agent

&#x20; ↓

收集 diff / tests / logs

&#x20; ↓

builder-review

&#x20; ↓

修正或停止

```



这是 AI Builder OS 最核心的 loop。



\---



\## 5. Maker → Checker Loop



用途：提升输出质量。



```text

Maker Skill 产出

&#x20; ↓

Checker Skill 评审

&#x20; ↓

发现问题

&#x20; ↓

Maker 修正

&#x20; ↓

Evidence Gate

```



例如：



```text

builder-spec → builder-review

builder-prototype → builder-review

builder-agent-task → builder-review

```



\---



\## 6. Skill Evolution Loop



用途：让系统持续进化。



```text

一次运行结束

&#x20; ↓

Run Report

&#x20; ↓

Eval 判断质量

&#x20; ↓

发现误触发 / 输出缺陷 / 模板过重

&#x20; ↓

Evolution Note

&#x20; ↓

更新 skill / reference / eval

&#x20; ↓

进入 regression eval

```



Daniel Demmel 对 feedback loop engineering 的表达很适合这里：今天总结出的经验会成为明天的 guide，也就是 outer loop 让 inner loop 随时间改善。(\[Daniel Demmel]\[5])



\---



\# 7. 它会改变我们原来的架构吗？



会，但不是推翻，而是加一个“Loop Layer”。



我建议把 AI Builder OS 架构从之前的八层微调为九层：



```text

AI Builder OS

├── 1. Builder Kernel

├── 2. Loop Layer

├── 3. Execution Harness

├── 4. Memory \& Evolution

├── 5. Core Skills

├── 6. Scenario Bundles

├── 7. References \& Templates

├── 8. Eval System

└── 9. Runtime Adapters / Future Workspace

```



或者更简洁地说：



```text

Kernel 决定规则

Loop 编排过程

Harness 约束执行

Skills 完成任务

Memory 记住经验

Eval 判断好坏

Adapters 适配工具

```



\---



\# 8. 对 AI Builder OS 的具体修改建议



\## 目录新增



```text

loops/

├── README.md

├── schemas/

│   └── loop-definition.schema.md

├── patterns/

├── recipes/

└── evals/

```



\## Kernel 修改



在 `kernel/routing/` 中增加：



```text

loop-selection-rules.zh.md

```



用于判断：



```text

当前任务是一次性 skill 任务，还是应该进入 loop？

```



\## Harness 修改



在 `harness/` 中增加：



```text

loop-state-policy.zh.md

stop-condition-policy.zh.md

budget-policy.zh.md

```



\## Memory 修改



在 `memory/schemas/` 中增加：



```text

loop-memory.schema.md

```



记录：



```yaml

loop\_id:

run\_id:

current\_state:

completed\_steps:

failed\_attempts:

evidence:

decisions:

next\_action:

```



\## Eval 修改



在 `evals/` 中增加：



```text

loop/

├── loop-contract.cases.yaml

├── stop-condition.cases.yaml

├── maker-checker.cases.yaml

└── evolution-loop.cases.yaml

```



\---



\# 9. 什么时候应该用 Loop，什么时候不该用？



这是非常关键的边界。



\## 应该用 Loop 的场景



| 场景         | 推荐 Loop                   |

| ---------- | ------------------------- |

| 多步骤构建      | Plan → Execute → Verify   |

| 复杂 Bug     | Explore → Narrow          |

| 原型迭代       | Spec → Prototype → Review |

| Agent 执行任务 | Agent Task Execution      |

| 周期性总结      | Scheduled Review          |

| Skill 改进   | Skill Evolution           |

| 高质量交付      | Maker → Checker           |



\## 不应该用 Loop 的场景



| 场景            | 原因              |

| ------------- | --------------- |

| 一次性简单问题       | Loop 成本过高       |

| 强依赖人类判断的问题    | 不应自动推进          |

| 不可验证任务        | Loop 容易假完成      |

| 高风险副作用动作      | 必须人工确认          |

| 预算/Token 严格受限 | Loop 成本可能失控     |

| 目标本身不清楚       | 先 Frame，不要 Loop |



Addy 和 Lushbinary 都提醒：Loop Engineering 仍然早期，token 成本和验证难度是必须严肃对待的问题。(\[addyosmani.com]\[1])



\---



\# 10. 我对它的判断：值得引进，但要克制



\## 不要这样理解



```text

Loop Engineering = 让 Agent 自动一直干活

```



这是危险的。



\## 应该这样理解



```text

Loop Engineering = 为可验证、可重复、可停止的任务设计反馈循环

```



它必须有：



```text

清晰目标

上下文边界

验证机制

停止条件

预算限制

人工交接

记忆回写

```



否则 loop 只会把错误放大。



\---



\# 11. 对 AI Builder OS 的最终建议



我建议你把 Loop Engineering 纳入 AI Builder OS，但不要把它做成一个单独的大 skill。



更好的方式是：



```text

Loop Engineering = OS 级运行模型

```



具体落地为：



```text

1\. loops/ 目录

2\. Loop Definition Schema

3\. Loop Patterns

4\. Loop Recipes

5\. Loop Selection Rules

6\. Stop Condition Policy

7\. Loop Eval

8\. Loop Memory

```



也就是说：



> \*\*Skill 是能力，Loop 是把能力串起来并持续改进的工作流。\*\*



如果说我们之前的 AI Builder OS 方案解决的是：



```text

有哪些能力？

```



Loop Engineering 解决的是：



```text

这些能力如何持续运转？

```



\---



\# 12. 更新后的 AI Builder OS 核心公式



我建议把新版公式改成：



```text

AI Builder OS =

Kernel

\+ Skills

\+ Loops

\+ Harness

\+ Memory

\+ Eval

\+ Adapters

```



更完整一点：



```text

User Intent

&#x20; ↓

Builder Router

&#x20; ↓

Skill or Loop Selection

&#x20; ↓

Loop Harness

&#x20; ↓

Skill / Agent Execution

&#x20; ↓

Evidence \& Eval

&#x20; ↓

Memory Writeback

&#x20; ↓

Next Action / Stop / Human Handoff

```



这就真正像 OS 了。



\---



\# 13. 可以追加给 Codex 的重构补充提示词



你可以把下面这段加到之前的 AI Builder OS 重构提示词里：



```text

补充要求：请在 AI Builder OS 中显式引入 Loop Engineering。



Loop Engineering 在本项目中的定义是：



不是让用户一条条提示 Agent，而是设计一套能围绕目标持续运行的反馈循环系统。它负责把 Router、Skills、Harness、Memory、Eval 和 Runtime Adapters 串成可重复、可验证、可停止、可进化的工作流。



请新增 `loops/` 目录，至少包含：



loops/

├── README.md

├── schemas/

│   └── loop-definition.schema.md

├── patterns/

│   ├── retry-loop.zh.md

│   ├── plan-execute-verify-loop.zh.md

│   ├── explore-narrow-loop.zh.md

│   ├── maker-checker-loop.zh.md

│   ├── human-approval-loop.zh.md

│   └── evolution-loop.zh.md

├── recipes/

│   ├── idea-to-frame.loop.md

│   ├── frame-to-spec.loop.md

│   ├── spec-to-prototype.loop.md

│   ├── agent-task-execution.loop.md

│   ├── prototype-review.loop.md

│   └── skill-evolution.loop.md

└── evals/

&#x20;   └── loop-quality-rubric.md



请定义 Loop Definition Schema，至少包含：



loop\_id:

name:

purpose:

trigger:

entry\_condition:

inputs:

context\_sources:

steps:

state:

memory\_read:

memory\_write:

evidence\_required:

stop\_conditions:

handoff\_conditions:

human\_approval\_gates:

budget\_limits:

risk\_level:

eval\_binding:



请在 kernel/routing/ 中新增：



\- loop-selection-rules.zh.md



用于判断当前任务应该：

\- 普通回答

\- 单个 skill

\- Plan

\- Goal

\- Plan → Goal

\- Loop



请在 harness/ 中补充：



\- loop-state-policy.zh.md

\- stop-condition-policy.zh.md

\- budget-policy.zh.md



请在 memory/schemas/ 中补充：



\- loop-memory.schema.md



请在 evals/ 中补充：



evals/loop/

├── loop-contract.cases.yaml

├── stop-condition.cases.yaml

├── maker-checker.cases.yaml

└── evolution-loop.cases.yaml



Loop Engineering 的边界要求：



\- 不要把 Loop 理解成无限自动执行。

\- Loop 必须有明确停止条件。

\- Loop 必须有 Evidence Packet。

\- Loop 必须能区分 PASS / PARTIAL / BLOCKED。

\- 高风险动作必须进入 human approval gate。

\- Loop 必须考虑 token / 时间 / 工具调用预算。

\- 不可验证任务不应进入自动 loop。

\- 用户判断价值高的任务应保留 human-in-the-loop。

```



\---



\## 最终一句话



\*\*Loop Engineering 对 AI Builder OS 的意义非常大：它让系统从“有很多 skills”升级为“有一套会运转、会验证、会停止、会记忆、会进化的构建循环”。\*\*



但它必须被克制地引入：



> \*\*不是自动化一切，而是把可重复、可验证、可停止的构建工作变成 loop。\*\*



\[1]: https://addyosmani.com/blog/loop-engineering/ "AddyOsmani.com - Loop Engineering"

\[2]: https://kilo.ai/articles/what-is-loop-engineering "What Is Loop Engineering? AI Feedback Loops | Kilo"

\[3]: https://lushbinary.com/blog/loop-engineering-ai-coding-agents-guide/ "Loop Engineering: The Guide for AI Agents | Lushbinary"

\[4]: https://www.mindstudio.ai/blog/what-is-loop-engineering-ai-coding-agents "What Is Loop Engineering? The New Meta for AI Coding Agents"

\[5]: https://www.danieldemmel.me/blog/feedback-loop-engineering "Feedback loop engineering"



