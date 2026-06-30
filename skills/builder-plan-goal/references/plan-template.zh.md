# Plan 提示词模板

当任务需要先理解、侦察、拆解或做方案比较时，使用这些模板。

## 通用模板

```text
/plan

我需要先得到一份可评审、可执行的实施计划，请先不要改代码。

任务背景：
[说明目标、业务背景、当前痛点或期望结果]

当前上下文：
- 项目/仓库：[如已知则填写，不知道则写“请先识别”]
- 相关目录/文件/模块：[如已知则填写]
- 当前行为：[已有行为或问题]
- 期望行为：[目标行为]
- 已知约束：[技术栈、架构、权限、性能、UI 风格、兼容性等]

请输出：
1. 你对问题的理解
2. 需要重点查看或确认的文件/模块/路由/API/数据结构
3. 当前系统或代码现状摘要
4. 关键假设
5. 阻塞性问题，如有则只问最少的问题
6. 至少两个可选方案
7. 方案取舍对比
8. 推荐方案和理由
9. 分阶段实施里程碑
10. 每个里程碑可能影响的文件/模块
11. 测试和验证策略
12. 风险、回滚方式和不应改变的内容
13. 可直接复制的 Milestone 1 `/goal` 提示词

规则：
- 不要开始实现。
- 优先选择最小安全路径。
- 明确 Must / Should / Later。
- 避免大而全设计和无关重构。
- 如果需求与现有架构冲突，请明确指出。
```

## M10 Router-first Prompt 模板

这些模板用于从常见入口进入 AI Builder OS。稳定标识用于 validator：`from_idea`、`from_visual_or_prototype`、`from_existing_code`、`spec_to_agent_task_pack`、`review_readiness`。

### from_idea：从想法开始

```text
/plan

我现在只有一个产品/功能/重构想法，请先不要实现，也不要直接写完整 spec。

原始想法：
[写下想法、目标用户、业务背景、为什么现在要做]

请先按 AI Builder OS 路由：
1. 判断应该先进入 builder-frame、builder-spec、builder-prototype、builder-agent-task、builder-review 还是 builder-decision。
2. 如果信息不足，最多问 3 个会真正影响方向的问题，并给出推荐默认答案。
3. 输出 Human View：目标、边界、主要风险、需要我决定的点。
4. 输出 Agent View：下一步 skill、需要读取的上下文、不得做的事、可验证产物。
5. 如果可以继续，请给出可直接交给下一步 skill 的 next_skill_input。

约束：
- 不新增第 9 个 core skill。
- 不把模糊想法直接升级成实现任务。
- 不默认要求 agent 全量读取项目 docs。
```

### from_visual_or_prototype：从截图、原型或视觉目标开始

```text
/plan

我有截图、原型、设计稿或已有页面作为输入，请先判断应该走 prototype-first、boundary-first 还是 spec-first。

输入材料：
[截图/原型路径、URL、已有页面、设计说明或差异描述]

请输出：
1. visual/prototype 输入能确定的事实。
2. 仍然只是推断的内容。
3. 应进入 builder-prototype、builder-spec 还是 builder-review。
4. 需要生成或更新的 Design Brief / Prototype Brief / Spec。
5. 对 mock、业务规则、API、权限和数据来源的边界说明。
6. 可直接复制的下一步 `/goal` 或 next_skill_input。

约束：
- 不把 prototype gaps 写成已确认需求。
- 不用视觉相似度替代交互、状态和证据验证。
- 如果需要运行原型，必须说明 preview URL、截图、viewport/state 和 design QA。
```

### from_existing_code：从已有代码迭代开始

```text
/plan

我想在已有代码库中做一次迭代，请先检查现状并规划，不要直接大范围修改。

目标变化：
[描述希望改变的行为、页面、API、模块或体验]

已知上下文：
- 仓库/目录：
- 相关文件或模块：
- 当前行为：
- 期望行为：
- 明确不改：

请输出：
1. delivery_mode 应该是 improve、create 还是 reframe。
2. 是否需要 Change Contract、Module Execution Pack、Branch State 或 Definition Drift Check。
3. 最小安全实现路径。
4. 可能影响的文件/模块。
5. 验证方式和不能声称完成的条件。
6. 可直接复制的 Milestone 1 `/goal`。

约束：
- 优先小范围 improve；发现目标形态不清或范围膨胀时，明确提示 reframe 风险。
- 保留现有架构、公共 API、权限、数据和生产配置，除非我明确批准。
```

### spec_to_agent_task_pack：把 spec 转成 Agent Task Pack

```text
/plan

我已经有 spec / PRD / Change Contract / Module Execution Pack，请帮我转成可交给 coding agent 的 Agent Task Pack。

来源产物：
[粘贴或指向 spec、PRD、Change Contract、Module Execution Pack、Design Brief、Prototype Brief]

请输出：
1. task_pack_identity：任务 ID、来源产物、delivery_track。
2. Human View：一句话目标、需要我决定的点、风险。
3. Agent View：执行契约、context pack、non-goals、forbidden actions。
4. knowledge_context：需要读取的 L0-L4 层和读取策略，禁止默认全量读取。
5. slice_plan：首个 vertical slice 或 tracer bullet。
6. verification_policy：最小检查、可观察证据、不能 claim done 的条件。
7. self_improvement_triggers：重复失败、模板缺口、脚本/eval 候选。

约束：
- 传统 issue/ticket 不能替代 Agent Task Pack。
- 如果来源 spec 不足以执行，先给 reroute_recommendation，不要伪造完整任务包。
```

### review_readiness：进入审查或发布前检查

```text
/plan

我需要判断当前产物是否可以进入下一步，请按 AI Builder OS review/readiness 思路规划检查。

待审查对象：
[spec/prototype/agent task/diff/evidence/release handoff 的路径或摘要]

请输出：
1. 应使用的 review_profile：quick_change_review、prototype_review、definition_drift_review、skill_quality_review、agent_navigability_review 或 release_readiness。
2. 必须读取的契约、模板、证据和 source-of-truth。
3. Evidence Packet 是否足够；如果不足，列出 missing_evidence。
4. 是否需要 Definition Drift Check、Branch State audit、artifact hygiene audit。
5. 可能的 PASS / PARTIAL / BLOCKED / REQUEST_CHANGES 条件。
6. 可直接交给 builder-review 的 next_skill_input。

约束：
- 不用 validator-only proof、agent self-report、旧日志或视觉观感替代当前证据。
- 缺证据时默认 PARTIAL、BLOCKED 或 REQUEST_CHANGES。
```

## 需求澄清模板

```text
/plan

这个需求还比较粗糙，请先帮我澄清，不要写代码。

粗略想法：
[输入原始想法]

请先判断哪些信息会真正影响实现方案，然后最多问 3 个高价值问题。
每个问题优先给 A/B/C 选项，并说明每个选项的影响。

在我回答后，请把需求整理成：
1. 目标用户
2. 核心场景
3. Must / Should / Later
4. 验收标准
5. 第一版实现里程碑
6. 可直接复制的 `/goal` 提示词
7. 如适用，推荐 AI Builder OS handoff：builder-frame / builder-spec / builder-prototype / builder-agent-task / builder-review
```

## 新功能模板

```text
/plan

请为 [功能名称] 制定实施计划，先不要改代码。

功能目标：
[用户要完成什么，系统要产生什么结果]

当前状态：
[当前已有页面/API/组件/数据结构]

期望行为：
- [行为 1]
- [行为 2]
- [行为 3]

请输出：
1. 当前实现摘要
2. 影响的文件/模块
3. 数据流变化
4. UI/API/状态变化，如适用
5. 可选方案
6. 推荐方案
7. 实施里程碑
8. 测试和检查
9. 风险和边界情况
10. 可直接复制的 `/goal` 提示词

规则：
- 保持增量实现。
- 保留现有行为。
- 避免无关重构。
```

## Bug 诊断模板

```text
/plan

请先规划如何诊断并修复这个 bug，不要改代码。

Bug：
[具体异常行为]

期望行为：
[正确行为]

复现步骤：
1. [步骤 1]
2. [步骤 2]
3. [步骤 3]

已知证据：
- 错误信息/日志：[如有]
- 怀疑区域：[如有]
- 最近变更：[如有]

请输出：
1. 根因假设，按可能性排序
2. 需要检查的文件/函数
3. 诊断步骤
4. 最小修复策略
5. 回归测试策略
6. 修复风险
7. 可直接复制的 `/goal` 提示词

规则：
- 不要静默猜测。
- 优先最小安全修复。
```

## 重构模板

```text
/plan

我们需要重构 [模块/子系统名称]，请先制定计划，不要改代码。

重构目标：
- [目标 1，例如降低耦合]
- [目标 2，例如提升可测试性]
- [目标 3，例如减少重复逻辑]

约束：
- 不改变用户可见行为。
- 公共 API 保持稳定，除非明确说明并获得确认。
- 避免 big-bang rewrite。
- 每个里程碑必须可独立 review 和回滚。

请输出：
1. 当前架构摘要
2. 主要设计问题
3. 依赖/耦合分析
4. 推荐目标结构
5. 迁移策略
6. 里程碑拆分
7. 每个里程碑的文件影响
8. 每个里程碑的测试策略
9. 回滚策略
10. 兼容性风险
11. Milestone 1 `/goal` 提示词
```

## UI / 产品原型模板

```text
/plan

请规划 [页面/流程名称] 的第一版实现，不要改代码。

产品意图：
[页面要表达什么，用户要完成什么]

参考材料：
[截图、Figma、现有页面、文字描述]

当前项目上下文：
- 前端技术栈：[如已知]
- 组件/样式约定：[如已知]
- 目标路由：[如已知，不确定则让 Codex 建议]

请输出：
1. 推荐信息架构
2. 核心用户流
3. 页面/路由结构
4. 组件拆分
5. mock 数据结构
6. 状态和交互模型
7. 响应式要求
8. 实施里程碑
9. 文件影响
10. 手工 QA 清单
11. Milestone 1 `/goal` 提示词
12. 推荐 handoff：通常是 `builder-prototype` 或 `builder-agent-task`

规则：
- 复用现有组件和样式。
- 不引入新设计系统，除非用户明确要求。
- 优先业务可读性，不追求装饰。
```
