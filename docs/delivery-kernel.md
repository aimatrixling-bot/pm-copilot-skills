# AI Builder OS Delivery Kernel v0.1

## 定位

Delivery Kernel 是 AI Builder OS 的交付内核协议层。它是横切协议，不是新的 core skill，也不是自动调度系统。

它负责把复杂构建任务在进入 `builder-spec`、`builder-prototype`、`builder-agent-task`、`builder-review` 前变成可执行、可验证、可同步的交付契约。

## 为什么需要 M6

M6 解决复杂构建任务中的几个反复问题：

- 开工前定义没有冻结，导致实现阶段持续补产品判断。
- 0->1、已有系统迭代、既有资产重塑被混成同一种任务。
- 长对话、Goal、多次自动压缩后，当前事实和已拒绝方向丢失。
- 实现结果与原定义发生漂移，但没有完成前同步检查。
- 纠错停留在聊天里，没有沉淀成下一次默认能力。

## 三种交付模式

记忆口诀：

> 没有稳定基线，用新建。
> 有稳定基线，只改局部，用迭代。
> 有旧东西但方向要重定，用重塑。

| 用户可见名称 | internal key | 记忆方式 | 适用场景 | 核心产物 |
| --- | --- | --- | --- | --- |
| 新建模式 | `create` | 从 0 做 | 新项目、新模块、新页面、新 Agent、新工作流 | Module Execution Pack |
| 迭代模式 | `improve` | 在旧上改 | 已有页面、原型或代码上的优化、修复、删减、调整 | Change Contract |
| 重塑模式 | `reframe` | 先重定再做 | 有旧资产，但目标形态、IA、流程或技术栈明显变化 | Asset Digestion + Target Shape + Execution Pack |

## v0.2.2 Complexity-Aware Workflow Hygiene

v0.2.2 在三种交付模式之上增加复杂度分层，目标是让小任务轻响应、大任务强治理。复杂度不是新的 skill，也不是新的流程分支；它只控制 Router 展示、契约重量、上下文读取和 review 强度。

| complexity | 适用场景 | 默认 response | 默认 contract | 默认 context |
| --- | --- | --- | --- | --- |
| `micro` | 1-2 个文件、文案/样式/小 UI、无领域或状态变化 | `terse` | `none` / `micro_note` | `direct_answer` |
| `lite` | 2-5 个文件、局部 UI/交互、轻微回归风险 | `terse` / `normal` | `lite_change_contract` | `direct_contract` |
| `standard` | 跨组件、局部状态/流程、导航分类或领域语义变化 | `normal` | `standard_change_contract` | `direct_contract` / `review_first` |
| `full` | 跨模块、权限、API、数据、审计、安全、发布或重塑 | `audit` | `full_change_contract` | `branch_state_required` / `handoff_required` |

输出纪律：

- `micro` / `lite` 默认 `secondary_mode: none`，不得自动升级 reframe。
- 只有 IA、状态模型、页面类型、领域语义、导航分类或 target shape 发生风险时，才升级 `reframe_risk` 并考虑 `standard` / `full`。
- `response_profile: terse` 只展示需求理解、模式、复杂度、contract profile、Branch State 是否需要和下一步；完整 `delivery_decision`、usage metrics、memory/evidence 默认只在 `audit` 展示。
- 小任务 Change Contract 必须包含 `allowed_files_or_areas`、`max_expected_files_touched`、`requires_human_approval_if`、`reframe_risk`，用于防止范围膨胀。

## Skill Load 与生命周期纪律

AI Builder OS 吸收 Matt Pocock 式 skill 设计中的工程纪律，但不复制固定 `/to-prd -> /to-issues -> /tdd` 流程。可复用原则如下：

- Process invariant：每条新增规则必须改变 agent 行为，并进入 schema、eval 或 validator；否则删除。
- No-op removal：如果某段 skill 文案不会改变路由、输出、验证或停止条件，应移除或移到参考文档。
- Context load：默认只加载完成当前任务必要的 instruction/template/reference；examples 和长参考只在风险或不确定时加载。
- Progressive disclosure：Router 输出先轻后重，skill 内部也应按任务风险逐层加载上下文。
- Single source of truth：长期规则只写入 source-of-truth map 指定位置；release seal、handoff、Branch State 不承载长期规则。
- Temporary artifact policy：handoff 是临时 pointer-only；Branch State 是分支 runtime cache；Decision Record 是 durable，但只在难逆、意外或真实取舍时创建。

### 新建模式 create

触发条件：

- 没有稳定可复用基线。
- 用户从 0 开始一个产品、模块、页面、Agent 或工作流。
- 旧材料只作为参考，不足以作为当前 source of truth。

输入：

- 用户意图、目标用户、场景、约束、成功标准。
- 可选参考资产、竞品、历史草稿或口头背景。

输出：

- `templates/module-execution-pack/template.md`
- 需要时再进入 `builder-prototype` 或 `builder-agent-task`。

停止条件：

- 目标用户、核心场景、non-goals 或验收标准缺失。
- 业务、安全、权限、数据或发布判断需要人工决定。

### 迭代模式 improve

触发条件：

- 已有稳定页面、原型、代码、文档或可观察行为。
- 本次只做局部优化、修复、删减、排序、密度调整、术语统一或视觉回归修正。
- 用户明确不希望重做整个方向。

输入：

- 当前基线、目标变更、必须保留项、不得触碰范围。
- 相关测试、截图、路由、组件或文档。

输出：

- `templates/change-contract/template.md`
- 完成前使用 `templates/definition-drift-check/template.md` 做回归和定义同步。

停止条件：

- 本次改动会改变页面类型、核心 IA、领域语义或跨模块契约。
- 改动范围明显超过局部迭代，应切换到重塑模式。

### 重塑模式 reframe

触发条件：

- 有旧资产，但旧资产不能直接作为当前目标形态。
- 需要从 React/Vue/Axure/竞品/旧 PRD/供应商系统中消化参考，再定义新目标。
- 目标 IA、流程、领域边界或技术栈明显变化。

输入：

- 旧资产清单、可信度、可吸收点、不可复制点。
- 新目标、非目标、目标形态、风险和验证方式。

输出：

- Asset Digestion：可吸收 / 不吸收 / 待判断。
- Target Shape：目标形态、信息架构、状态边界。
- Module Execution Pack：面向后续实现的执行契约。

停止条件：

- source-of-truth 候选互相冲突且缺少人工决策。
- 旧资产可信度无法判断，继续实现会制造错误确定性。

## 与 8 个 builder skills 的关系

Delivery Kernel 不替代任何 builder skill。

| Skill | M6 关系 |
| --- | --- |
| `builder-router` | 识别新建、迭代、重塑，并推荐最小下一步 |
| `builder-plan-goal` | 后续可把三种模式转成 Plan / Goal 提示词；M6 不强制修改 |
| `builder-frame` | 新建模式输入不成熟时的上游澄清入口；M6 不强制修改 |
| `builder-spec` | 生成 Module Execution Pack 或 Change Contract |
| `builder-prototype` | 高保真或可运行原型前读取 Execution Pack / Change Contract / Branch State |
| `builder-agent-task` | 把 Execution Pack / Change Contract 转成可执行 agent task |
| `builder-review` | 执行 Definition Drift Check 和 definition sync audit |
| `builder-decision` | 当 drift 需要长期取舍时记录 Decision Record；M6 不强制修改 |

## 与现有 loops / governance 的关系

- Project Onboarding：解决首次进入项目时是 `greenfield`、`brownfield`、`resume` 还是 `unknown`；Delivery Kernel 解决具体交付任务应走新建、迭代还是重塑。
- Design Plan to Prototype Loop：解决高保真原型前的设计计划和证据；Delivery Kernel 提供上游交付契约。
- Artifact Hygiene Loop：解决资产登记、一致性和清理提案；Delivery Kernel 的 Definition Drift Check 可以把资产同步问题交给 Artifact Hygiene Loop。
- Product Logic Containment Gate：继续约束业务规则说明不得侵入界面主体；Delivery Kernel 不改变该规则。

## 中文优先规则

- 用户可见名称、模板标题、验收说明、review 文案默认简体中文。
- `delivery_mode`、`create`、`improve`、`reframe`、`non_goals`、`acceptance`、`verification`、`definition_sync` 等 machine-readable key 可保留英文。
- 模板应让中文 PM 能快速审阅，也让 agent 能按字段执行。

## 不做事项

M6 不做：

- 不新增第 9 个 core skill。
- 不新增 PMS 专用 skill。
- 不实现 CLI、自动初始化器、自动扫描器或迁移器。
- 不自动写入用户项目 `.ai-builder/`。
- 不自动删除、迁移、归档用户文件。
- 不改变 npm package name、发布策略或 release tag。
- 不把具体领域规则写进通用 Delivery Kernel。

## 当前落地状态

### M7：Skill 接入

已轻量接入 `builder-router`、`builder-spec`、`builder-agent-task`、`builder-review`、`builder-prototype`，并通过 output-contract schema 保留 `delivery_mode`、Execution Pack、Change Contract、Branch State、Definition Drift Check 和 definition sync 信息。

### M8：Eval + Validator

已新增 routing / trigger / delivery-kernel eval cases，覆盖新建、迭代、重塑和 definition drift，并纳入 `scripts/validate-builder-os.js`。

### M9：真实场景试运行

已完成本地 release-ready 验证和 Codex runtime 安装同步。真实效果需要在 PMS 高保真原型或另一个复杂模块中继续观察。

## 后续建议

- 根据真实使用反馈，决定是否把 Delivery Kernel 字段进一步固化到更多 examples 和 runtime adapter 文档。
- 若发现常见漂移类型反复出现，优先沉淀到 gate / loop / template / eval，不新增 core skill。
- 公开 npm 发布前，仍按 `docs/release-runbook-m3.9.md` 重新执行 release gates、版本/tag preflight 和人工批准。
