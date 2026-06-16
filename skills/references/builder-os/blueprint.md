# AI Product Builder OS 蓝图

本文是 `pm-copilot-skills` 的 durable synthesis target（持久化综合蓝图）。它会随 npm 包发布，可被 README、skills、下游 agents 和未来 plugin adapters 引用。

## 定位

`pm-copilot-skills` 是 PM Copilot 能力设计的 canonical source（权威源）。`pm-copilot-agent` 等下游产品应在版本被接受后从本包镜像或投影，不应反向覆盖本包。

它不只是 PM prompt 包，而是面向产品经理、AI 产品经理和全栈产品构建者的 AI Product Builder OS，覆盖从产品意图到可验证软件交付的链路：

```text
Product -> Design -> Build -> Review -> Release -> Evolution
```

## 默认语言

用户可见输出默认**中文为主**。英文仅保留在代码、字段名、文件路径、命令、API、包名、运行时术语、行业通用缩写或本项目固定术语中。首次出现关键英文术语时，优先使用"中文名（English Term）"，例如"证据包（Evidence Packet）"、"传感器门禁（Sensor Gates）"。

## 来源角色

| 来源 | 在本系统中的角色 | 吸收内容 |
|---|---|---|
| Meta_Kim | 治理主干 | 意图澄清、能力优先分派、审查/元审查、验证、经验回写、权威源到运行时投影 |
| 毒舌产品经理 5.0 | 轻量 Harness 参考 | 行动前 Guides、行动后 Sensors、反馈后 Steering Loop、标准驱动执行、目标驱动执行、hook/gate 思维 |
| andrej-karpathy-skills | 行为纪律 | 不假设、暴露困惑和取舍、最小变更、定义成功标准、循环验证 |
| VibeCodingPromptTemplate | 模板资产库 | PRD、MVP、研究、设计、架构、自文档化功能、营销模板作为 references 或 optional packs |
| Superpowers | 工程交付文化 | 先设计后编码、计划审批、TDD/review 纪律、子代理执行、收尾纪律、skill 变更 eval 证据 |
| Everything Claude Code | 插件系统地图 | agents、skills、commands、hooks、MCP、rules、memory、context management、marketplace packaging |
| OpenAI / Anthropic official docs | 平台边界 | 渐进披露、简洁触发描述、本地 skill 优先、稳定分发后再 plugin 化、重 references 按需加载 |

## 明确不做

- 不复制任何标杆项目的完整目录结构。
- 不扩展出几十个 always-on agents 或 commands。
- 不把每个模板都升级为 core skill。
- 不暴露 chain-of-thought，也不要求模型展示隐藏推理。
- 没有证据，不声明 workflow complete。
- skill/rule surface 未稳定前，不创建 runtime adapters。
- 不允许 `pm-copilot-agent` 重新成为上游源。

## 架构分层

```text
AI Product Builder OS
├─ core rules        # 全局行为纪律、语言规则、反膨胀规则
├─ skills            # 产品、设计、构建、审查、发布、演进工作流
├─ references        # 方法论、设计规则、模板、Builder OS 蓝图
├─ agents            # 只有在确实需要独立上下文时才设置的小型隔离角色
├─ commands          # 稳定工作流的薄入口，不承载知识主体
├─ sensors           # review/test/build/security/privacy/fake-UI/fake-test gates
├─ evals             # skill 变更的触发和质量评测
└─ runtime adapters  # Codex、Claude Code、Qoder、WorkBuddy、CodeBuddy 投影
```

当前包实现的是 `skills/` 和 `references/`。其他层只有在契约清晰、且无法被现有 skills/references 覆盖时才添加。

## 工作流主干

每个有意义的工作流都应保留这条主干：

1. **Intent Lock（意图锁定）**：澄清 want、constraints、context、depth、output target。
2. **Capability Routing（能力路由）**：选择正确的 skill、reference、command、agent 或 human handoff。
3. **Plan / Owner（计划与责任人）**：判断由主 agent、subagent、script 还是 human 负责。
4. **Execution（执行）**：产出 artifact 或变更。
5. **Sensor Gates（传感器门禁）**：尽可能运行确定性检查。
6. **Review / Meta-Review（审查/元审查）**：审查输出和方法，而不只是润色。
7. **Evidence Packet（证据包）**：声明完成前附上证据。
8. **Evolution Writeback（经验回写）**：记录可复用经验，或明确无需回写。

## Guides / Sensors / Steering Loop

系统把三类职责分开：

| 层 | 目的 | 示例 |
|---|---|---|
| **Guides** | 行动前的标准 | Intent Packet、Iron Law、Capability Index、模板、design-before-code |
| **Sensors** | 行动后的检查 | build/test 输出、review report、fake UI scan、fake test scan、privacy/security audit |
| **Steering Loop** | 反馈后的改进 | Eval Notes、Evolution Writeback、规则退休、模板更新 |

Guides 应保持简洁。重知识放在 references。Sensors 应尽可能确定性。

## Builder 证据标准

Builder 类工作流在声明完成前必须提供证据包（Evidence Packet）：

- **Artifacts（产物）**：文件、报告、截图、包输出或其他持久化 artifact。
- **Checks Run（已运行检查）**：精确命令和关键输出。
- **Manual Verification（人工验证）**：用户路径、截图、浏览器检查或 review checklist。
- **Open Risks（开放风险）**：未解决假设和人工审查点。
- **Completion Claim（完成声明）**：`PASS（通过）`、`PARTIAL（部分通过）` 或 `BLOCKED（阻塞）`。

没有证据，不得写 `PASS`。

## 目标驱动执行

适合 goal-driven execution 的任务：

- 目标具体；
- 完成标准可验证；
- 风险边界明确；
- 停止条件清晰；
- 不在无审批情况下执行不可逆的生产、安全、隐私动作。

不适合 goal-driven execution 的任务：

- 真实产品决策还不清楚；
- 成功标准高度主观；
- 任务依赖干系人判断；
- 涉及数据删除、生产配置、资金或隐私影响且无人工审批。

## 反膨胀准入测试

新增 skill / agent / command / hook 前，必须回答：

1. 是否有独立触发条件？
2. 是否有独立输出契约？
3. 是否至少有 3 个可信复用场景？
4. 是否可以由现有 skill + reference/checklist 低成本覆盖？
5. 是否可通过 eval、脚本或人工评审验证？
6. 是否保持平台中立，或清楚声明 runtime 限制？

如果答案薄弱，先保留为 reference 或 optional pack。

## Runtime Adapter 顺序

1. 先在本包稳定 canonical skill 行为。
2. 增加触发和输出质量 eval seed。
3. 只为稳定 surface 创建 adapter manifest：
   - Codex plugin
   - Claude Code plugin
   - Qoder / WorkBuddy / CodeBuddy compatible packs
4. 只为确定性检查增加 hooks。
5. 版本接受后，再镜像到 `pm-copilot-agent`。

Adapter 是投影，不得成为 canonical source。

## Skill 变更证据

每次有意义的 skill 变更至少应包含：

- 行为变化；
- should-trigger 样例；
- should-not-trigger 样例；
- 预期输出契约；
- 回归风险；
- 人工评审点。

## 开放问题

- 哪条工作流应该最先成为 runtime plugin surface？
- 哪些 hooks 可以安全地同时适配 Codex 和 Claude Code？
- 哪些检查适合脚本化，同时不对单个项目过拟合？
- 哪些 skills 需要拆成 agent，哪些只需要更强的 reference 文件？
