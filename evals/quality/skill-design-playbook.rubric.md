# Skill Design Playbook Quality Rubric

用于评审 AI Builder OS skill hardening 是否真正应用了 Skill Design Playbook。

## 必须通过

- 是否明确当前 skill 的职责边界和 primary artifact。
- 是否同时定义触发条件和不触发条件。
- 是否有相邻 builder skill 的分流边界。
- 是否存在有限模式集合或明确执行路径。
- 是否把详细规则、模板、示例和反模式分层到 references/templates/assets。
- 是否有 output contract 或 handoff packet。
- 是否有 quality gates 和失败处理。
- 是否有真实输入风格的 trigger/routing/eval case。
- 是否检查安装态相对资源可用。
- 是否中文优先，且没有把 `SKILL.md` 写成巨型论文。

## 降级为 PARTIAL

- 只有 `SKILL.md` 改动，没有 references/template/eval。
- 有模板但没有 validator/eval 覆盖。
- 有触发条件但缺少不触发条件。
- 有产物字段但没有 handoff 说明。

## 标记 BLOCKED

- skill 边界会改变用户工作流，但缺少用户决策。
- 需要删除或重命名旧 `pm-*` skill。
- 需要新增依赖、runtime 或发布配置，但未获确认。
- 输出会伪装成已验证，但没有证据。
