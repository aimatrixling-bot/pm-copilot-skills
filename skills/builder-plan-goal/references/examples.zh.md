# Builder Plan Goal 示例场景

## 示例 1：模块重构

用户输入：

```text
我要让 Codex 把供应商管理模块重构一下，提升可维护性，应该怎么下指令？
```

模式建议：Plan -> Goal。

理由：

- “重构一下”范围过大。
- 需要先识别模块边界、公共 API、测试覆盖和风险。
- 直接 Goal 容易产生不可审查的大 diff。

推荐工作流：

1. 先 `/plan`：要求架构现状、问题、方案、里程碑和文件影响。
2. 用户确认 Milestone 1。
3. 再 `/goal`：只执行 Milestone 1。

提示词要点：

- 不改变用户可见行为。
- 公共 API 稳定。
- 每个 milestone 可单独 review。
- 必须运行相关测试。

handoff：计划确认后通常交给 `builder-agent-task`，或直接给目标 runtime 执行。

## 示例 2：flaky test

用户输入：

```text
checkout 的测试偶尔失败，我要让 Claude Code 修复。
```

模式建议：Goal，若没有日志/复现方式则先提问。

理由：

- 修复测试可以有明确 Done when。
- 需要连续通过次数或稳定性验证。
- 如果没有失败日志，先定位证据。

可用 Goal 要点：

- 先收集失败日志和最近变更。
- 找到根因再做最小修复。
- 不跳过测试，不降低断言质量。
- Done when：相关测试连续通过 3 次，且不会掩盖真实问题。

handoff：如果用户需要把指令交给 Claude Code，输出 `builder-agent-task` 可消费的任务包字段。

## 示例 3：产品原型

用户输入：

```text
我想做一个新品上市流程的企业 AI Agent 应用原型，帮我让 Codex 开始做。
```

模式建议：Plan -> Goal。

理由：

- 产品目标、用户角色、信息架构和 milestone 都需要先收敛。
- 原型很容易被做成“完整平台”。

里程碑示例：

1. Milestone 1：信息架构、第一屏 dashboard、mock 数据。
2. Milestone 2：项目详情和阶段流转。
3. Milestone 3：角色、Agent 输出和人工决策节点。
4. Milestone 4：手工 QA、文档和演示脚本。

handoff：概念仍模糊时先 `builder-frame`；已清楚时交给 `builder-prototype` 或 `builder-agent-task`。

## 示例 4：小改动

用户输入：

```text
把登录页标题改成 Welcome back。
```

模式建议：普通 Prompt。

理由：

- 范围小。
- 无需方案比较。
- 无需长期目标。

普通指令示例：

```text
请把登录页标题改成 “Welcome back”。只修改相关文案，不要调整布局、样式或其他页面。修改后告诉我改了哪个文件。
```

handoff：无须 handoff。

## 示例 5：未知代码库新功能

用户输入：

```text
我要加一个审批流，但是不确定这个项目现在怎么组织的。
```

模式建议：Plan。

理由：

- 功能方向明确，但代码库结构和影响面不清。
- 审批流可能涉及权限、状态机、数据模型和 UI。
- 直接 Goal 风险较高。

Plan 要点：

- 先识别路由、状态管理、API、权限和相似模块。
- 给出最小实现方案和扩展方案。
- 明确哪些业务规则需要用户确认。
- 最后产出 Milestone 1 `/goal`。

handoff：需求尚未成型时先 `builder-spec`，执行前再 `builder-agent-task`。

## 示例 6：生产风险变更

用户输入：

```text
帮我写个目标，让 Agent 自动迁移数据库 schema 并上线。
```

模式建议：先提问，不要直接 Goal。

理由：

- 涉及数据迁移和生产发布。
- 需要人工确认备份、回滚、停机窗口、权限、审计和兼容性。

应先问：

1. 这是开发环境、测试环境还是生产环境？
2. 是否已有迁移脚本、备份策略和回滚方案？
3. 这次是否允许 Agent 修改 schema，还是只生成迁移计划供人工审查？

handoff：高风险写操作应先生成 `builder-agent-task` 或 `builder-decision`，不得直接执行。

## 示例 7：AI Builder OS skill 打磨

用户输入：

```text
请把 builder-spec 打磨到可以真正指导需求规格输出，并补 eval。
```

模式建议：Plan -> Goal。

理由：

- 涉及 skill 契约、references、templates、eval、validator。
- 需要先对照已有 skill 和目标定位，避免只补文案。

Plan 要点：

- 先做差距分析。
- 拆出一个只改 `builder-spec` 的 Milestone 1。
- 明确不触碰其他 builder skill 深度逻辑。
- 验证 `validate:builder-os`、安装校验和相关 e2e baseline。

handoff：计划确认后交给当前 coding runtime 执行，最终再由 `builder-review` 审计。
