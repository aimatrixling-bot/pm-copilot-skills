# Builder Router

## 目的

`builder-router` 是 AI Builder OS 面对模糊请求时的默认入口。

它判断当前请求应该由哪种方式处理：

- 普通回答；
- Prompt；
- Plan；
- Goal；
- Plan -> Goal；
- `builder-frame`；
- `builder-spec`；
- `builder-prototype`；
- `builder-agent-task`；
- `builder-review`；
- `builder-decision`。

它也可以判断是否需要先进入 Grill Decision Loop：当用户请求已经指向 spec、prototype 或 agent task，但共享理解、关键决策树、non-goals、成功标准或验证方式仍不清楚时，router 应推荐 `builder-frame` 的 `grill_frame` 路径，而不是直接把任务交给下游执行类 skill。

首次进入或恢复项目时，它还要判断 Project Onboarding 模式：

- `greenfield`：从 0 开始的新项目；
- `brownfield`：已有本地项目资产，中途接入 AI Builder OS；
- `resume`：已有 `.ai-builder/`、project profile 或 artifact index；
- `unknown`：证据不足，不能安全判断；
- `not_applicable`：不是首次进入或恢复项目场景。

## 路由问题

1. 这个任务是否足够小、足够清楚，可以直接回答？
2. 用户的目标、范围、上下文或验证方式是否缺失？
3. 是否已有明确完成条件和验证方法？
4. 这是否是一个产物创建任务？
5. 用户是否要把任务交给另一个 agentic coding 工具执行？
6. 用户是否在请求评审、证据检查或就绪度判断？
7. 是否有必须沉淀的重要决策？
8. 这是否是 AI Builder OS 首次进入或恢复某个项目？
9. 如果是，项目是 greenfield、brownfield、resume 还是 unknown？
10. 是否缺少会阻塞下游 skill 的关键决策树，需要先执行 `loops/recipes/grill-decision.loop.md`？
11. 任务复杂度是 `micro`、`lite`、`standard` 还是 `full`？
12. 当前应使用 `terse`、`normal` 还是 `audit` 响应档位？
13. 当前需要 `none`、`micro_note`、`lite_change_contract`、`standard_change_contract` 还是 `full_change_contract`？

## Project Onboarding 规则

- `greenfield`：先建立项目锚点和 project profile proposal，通常交给 `builder-frame`。
- `brownfield`：先生成资产盘点、source-of-truth 候选和 cleanup proposal，通常交给 `builder-review`。
- `resume`：先读取既有 project profile、artifact index 或 handoff，再继续路由。
- `unknown`：缺少项目根、授权范围或可观察证据时，先提问，不要假装已完成 intake。
- Router 不自动创建 `.ai-builder/`，不自动扫描全盘，不自动迁移、删除、重命名或归档文件。

## Complexity-Aware 输出规则

Router 的默认职责是帮人选择下一步，不是默认输出审计报告。先判定 `task_complexity`，再决定 `response_profile` 和 `contract_profile`：

- `micro`：1-2 个文件、文案/样式/小 UI、无业务语义变化；默认 `response_profile: terse`、`contract_profile: none | micro_note`。
- `lite`：2-5 个文件、局部 UI/交互、有轻微回归风险；默认 `response_profile: terse | normal`、`contract_profile: lite_change_contract`。
- `standard`：跨组件、状态、流程或局部业务语义；默认 `response_profile: normal`、`contract_profile: standard_change_contract`。
- `full`：跨模块、权限、API、数据、审计、发布、重塑或长线程；默认 `response_profile: audit`、`contract_profile: full_change_contract`。

`context_strategy` 用于说明下一步上下文策略：

- `direct_answer`：直接回答，不进入 builder workflow。
- `direct_contract`：上下文足够，直接进入 Contract / Execution Pack。
- `grill_first`：关键决策树、non-goals、成功标准或领域语义不清。
- `prototype_question_first`：需要用原型回答设计、状态或交互问题。
- `handoff_required`：需要跨 session / runtime 交接，但不需要持久状态。
- `branch_state_required`：多轮 Goal、高保真、跨仓库、上下文压缩或复杂业务系统。
- `review_first`：已有资产、实现或证据需要先评审。

Display policy：默认用户可见正文只使用 `理解`、`下一步`、`需要决定`、`验收` 四个块；`terse` 不展示内部字段名，`normal` 只在四个块内补充紧凑理由和关键边界，`audit` 也先保持四个块，只有审查、复盘、冲突、release、definition drift 或用户明确要求时才追加审计附录。`task_complexity`、`response_profile`、`contract_profile`、`context_strategy`、`delivery_decision`、metrics、memory/evidence 默认进入内部 trace 或 handoff artifact。

## 输出契约

默认用户可见正文：

```markdown
**理解**

**下一步**

**需要决定**

**验收**
```

内部 trace / handoff artifact：

```yaml
route_type: answer | prompt | plan | goal | plan_to_goal | skill_route | ask_first
recommended_mode: prompt | plan | goal | plan_to_goal | skill
recommended_skill:
project_mode: greenfield | brownfield | resume | unknown | not_applicable
task_complexity: micro | lite | standard | full
response_profile: terse | normal | audit
contract_profile: none | micro_note | lite_change_contract | standard_change_contract | full_change_contract
context_strategy: direct_answer | direct_contract | grill_first | prototype_question_first | handoff_required | branch_state_required | review_first
project_profile_proposal:
recommended_next_skill:
reasoning_summary:
missing_context:
risk_flags:
suggested_chain:
next_skill_input:
next_prompt:
handoff_packet:
```

## 门禁

如果 router 不能解释为什么选择某条路径，就必须选择 Plan，或最多提出三个高价值澄清问题。

路由结果必须说明为什么不是相邻路径，尤其是 `builder-frame` vs `builder-spec`、`builder-prototype` vs `builder-agent-task`、`builder-review` vs `builder-decision`。

Router 可以输出 `suggested_chain`，但这只是交接建议，不等于 runtime 已经自动连续调用多个 skill。除非目标 runtime 明确支持调度，否则必须同时给出用户或 agent 可以复制使用的 `next_skill_input`。

micro/lite 任务默认不得展开完整 `delivery_decision`、usage metrics、memory/evidence；只有审查、复盘、冲突、release、definition drift 或用户明确要求时才使用 `audit`。
