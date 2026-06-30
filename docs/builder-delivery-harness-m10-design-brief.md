# M10 Builder Delivery Harness Design Brief

## 目标

M10 的目标是把 AI Builder OS 从“PM skill 包”进一步收敛为 Builder Delivery Harness：把产品意图转化为可定义、可执行、可验证、可复盘、可复用的交付系统。

本次增强必须保持 8 个 active builder core skills，不新增第 9 个 core skill，不做目录大重构，不实现 CLI、scanner、migrator 或自动写入用户项目状态。

## 背景判断

外部参考和本地实践共同指向同一个结论：

- Matt Pocock 式工作流的价值在轻量 artifact 链路：Idea、Research、Prototype、PRD、Task Board、Implementation、QA。
- Harness Engineering 的价值在可执行环境、反馈回路、状态管理、约束和验证。
- Qoder 式工作台的价值在 Spec / Goal / Agent / Skills 的任务模式分流和文件系统记忆。
- Anthropic Product Management skills 的价值在角色型 PM 工作流拆分，但它不是完整 Builder OS。

AI Builder OS 的差异化不应是“更多 PM skills”，而是 Kernel + Memory + Gates + Templates + Evals + Runtime Adapters 共同形成的交付内核。

## 产品定位

AI Builder OS 面向产品经理、AI 产品经理、全栈产品构建者、企业数字化团队、非程序员 Builder 和独立创造者。

它不替代 IDE，也不替代人类业务判断。它负责把自然语言意图变成：

- 人类可决策的产品资产；
- agent 可执行的任务包；
- 可验证的证据；
- 可复盘的交付记录；
- 可复用的项目记忆和 skill hardening 输入。

## 3P 交付轨道

3P 是用户侧交付深度，不是线性阶段。

| Track | 中文名 | 解决的问题 | 核心产物 | 主要消费者 |
| --- | --- | --- | --- | --- |
| `prd_spec` | PRD / Spec 轨道 | 定义是否清楚、边界是否可验收 | Product Brief、Execution Spec、Acceptance Criteria | 人类、builder-spec、builder-agent-task |
| `prototype` | Prototype 轨道 | 体验、状态、交互和视觉目标是否正确 | Prototype Brief、Runnable Prototype、Design Evidence | 人类、builder-prototype、builder-review |
| `product` | Product 轨道 | 是否能运行、测试、部署和交接 | Agent Task Packet、Evidence Packet、Review Report、Release Handoff | Codex、Claude Code、Qoder、工程团队 |

轨道可以组合。新项目可能先走 `prd_spec`，也可能先做 `prototype` 探针；已有代码迭代通常直接走 `product` 或 `prd_spec + product`。Router 负责选择最轻可验证路径。

## Human View 与 Agent View

每个关键交付物都应区分人类视图和 agent 视图。

- Human View：面向快速判断，必须短、清楚、可决策，突出目标、风险、取舍、验收和下一步。
- Agent View：面向执行，必须字段化、边界清楚、带上下文来源、non-goals、forbidden actions、验证命令、停止条件和 handoff。

PRD 不应被删除，但应降级为 Human View 的一种。Agent-facing canonical artifact 应是 Execution Spec、Change Contract、Module Execution Pack 或 Agent Task Packet。

## Agent Task Pack

传统 issue/ticket 只说明“做什么”，不足以交给 agentic runtime。M10 将 Agent Task Packet 明确为 Agent Task Pack：一个可执行、可验证、可恢复的上下文包。

Agent Task Pack 必须包含：

- `task_pack_identity`：任务 ID、来源产物、交付轨道。
- `human_view`：给人的摘要和需要决策点。
- `agent_view`：给执行 agent 的执行契约和上下文包。
- `knowledge_context`：必须读取的知识层级和读取策略。
- `slice_plan`：首个可验证 slice，默认 vertical slice 或 tracer bullet。
- `verification_policy`：最小检查、可观察证据、不能声称完成的条件。
- `self_improvement_triggers`：重复失败、模板缺口、脚本/eval 候选。

## L0-L4 项目知识分层

AI Builder OS 的项目记忆应默认采用稳定到高频的分层。

| Layer | 名称 | 内容 | 稳定性 |
| --- | --- | --- | --- |
| L0 | 产品概述 | 使命、目标用户、定位、核心体验、全局索引 | 高 |
| L1 | 业务规则 | 术语、业务规则、权限、边界条件、核心流程 | 高 |
| L2 | 设计与技术规范 | 信息架构、UI/UX、模块边界、技术架构 | 中 |
| L3 | 接口和验收契约 | API、数据模型、字段、请求响应、AC、测试口径 | 中低 |
| L4 | 需求演进 | active changes、archived changes、evidence、retrospectives、issues/task packs | 高频 |

治理规则：

- 每个项目记忆入口必须有索引。
- 长期规则只能进入稳定层；临时执行记录留在 L4。
- research、exploration、temporary prototype 必须有生命周期。
- Agent 不应默认全量读取 `docs/**/*.md`；必须通过索引和任务相关性读取。
- 每轮交付后必须决定：更新稳定知识、归档为 L4、保留为 evidence，或列为 cleanup proposal。

## Self Improvement Loop

自我改进不能停留在复盘文字。M10 采用触发器机制：

- 同类问题出现 2 次：更新 rule 或 policy。
- 同类格式反复不稳定：更新 template。
- 同类检查可程序化：写 script、linter 或 test。
- 某类任务频繁出现且边界稳定：考虑 skill hardening，不默认新增 visible skill。
- 某类质量问题无法自动判断：增加 eval case 或 QA checklist。

所有 self-improvement 输出都必须经过 source-of-truth map 判断，避免把聊天记录、Review Packet 或 Branch State 升级为长期规则。

## 落地范围

M10 第一阶段只做内核化增强：

- 更新 architecture：明确 Builder Delivery Harness、3P 轨道和 Human / Agent 双视图。
- 更新 Delivery Kernel：说明 3P 如何叠加 create / improve / reframe。
- 更新 Memory：定义 L0-L4 知识分层和治理规则。
- 更新 Source-of-Truth Map：明确新概念归属。
- 更新 Agent Task Packet：加入 Task Pack identity、Human View、Agent View、Knowledge Context、Self Improvement triggers。
- 更新 schema/eval/validator：确保新增纪律可机器检查。

## 非目标

- 不新增第 9 个 core skill。
- 不把旧 `pm-*` skills 重新拉回 active surface。
- 不新增 `builder-grill`、`task-pack`、`memory-sync` 等可见 skill。
- 不引入 GitHub/Linear/Jira/Vercel 等真实 connector。
- 不创建或迁移用户项目 `.ai-builder/`。
- 不自动发布 npm，不创建 tag。

## 验收标准

- 8 个 active core skills 不变。
- 新增概念在 source-of-truth map 中有明确归属。
- Agent Task Packet 同时服务 Human View 和 Agent View。
- L0-L4 知识分层不会鼓励 agent 全量读取项目 docs。
- Self Improvement Loop 产生 rule/template/script/eval/skill-hardening 输入，而不是泛泛复盘。
- `npm run validate:builder-os` 通过，或明确记录失败原因与替代检查。
