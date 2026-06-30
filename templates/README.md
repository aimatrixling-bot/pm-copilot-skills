# Templates

`templates/` 定义 AI Builder OS 可复用的输出产物格式。

当前目标模板：

- Feature Frame
- Design Brief
- Builder Spec
- Prototype Brief
- Agent Task Packet
- Review Report
- Decision Record
- Evidence Packet
- Skill Hardening Brief
- Module Execution Pack
- Change Contract
- Branch State
- Definition Drift Check

Phase 1 只建立目录和迁移目标；具体模板会按 milestone 逐步补齐。

Milestone 2.4 新增 `templates/skill-hardening-brief/template.md`，用于把一个待打磨的 builder skill 转成可评审、可执行、可验证的改造计划。

本轮 hardening 已补齐 `templates/prototype-brief/template.md` 和 `templates/review-report/template.md`，并强化 Agent Task Packet 与 Decision Record 模板，使 prototype、agent-task、review、decision 的 handoff 字段可被 validator/eval 检查。

M6 Delivery Kernel 新增 4 个交付契约模板：

- `templates/module-execution-pack/template.md`：新建模式 `create` 和重塑模式 `reframe` 的执行契约。
- `templates/change-contract/template.md`：迭代模式 `improve` 的局部变更契约。
- `templates/branch-state/template.md`：多轮 Goal、上下文压缩和跨资产任务的当前状态缓存。
- `templates/definition-drift-check/template.md`：完成前检查定义与实现是否漂移。

M10 Prompt / Template support 新增 4 个轻量模板：

- `templates/evidence-packet/template.md`：记录当前范围的 fresh evidence，防止 `PASS`、完成声明或 release readiness 只依赖 agent self-report、旧日志或 validator-only proof。
- `templates/research-brief/template.md`：缓存会影响产品、架构、实现或交付决策的调研结论；调研结论进入 spec 或 decision 前不能自动升级为需求。
- `templates/delivery-retrospective/template.md`：记录单轮交付做了什么、遗留什么、下一轮从哪里恢复，以及是否触发 rule/template/script/eval/skill-hardening 输入。
- `templates/project-memory-index/template.md`：提出 L0-L4 项目记忆入口和读取策略；它是 proposal-only，不授权自动创建、迁移、删除或重命名用户项目文件。
