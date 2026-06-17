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

Phase 1 只建立目录和迁移目标；具体模板会按 milestone 逐步补齐。

Milestone 2.4 新增 `templates/skill-hardening-brief/template.md`，用于把一个待打磨的 builder skill 转成可评审、可执行、可验证的改造计划。

本轮 hardening 已补齐 `templates/prototype-brief/template.md` 和 `templates/review-report/template.md`，并强化 Agent Task Packet 与 Decision Record 模板，使 prototype、agent-task、review、decision 的 handoff 字段可被 validator/eval 检查。
