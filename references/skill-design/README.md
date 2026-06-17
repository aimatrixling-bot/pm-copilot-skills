# Skill Design References

这个目录保存 AI Builder OS 的 skill authoring 方法论。

## 当前文件

- `skill-design-playbook.zh.md`：从 Plan Goal Coach 和 skill-creator 中提炼出的 Builder Skill 设计方法。

## 使用方式

- 打磨 `builder-*` skill 前，先读取 playbook，判断应该改 `SKILL.md`、references、templates、assets、eval 还是 validator。
- 需要形成可评审改造计划时，使用 `templates/skill-hardening-brief/template.md`。
- 不要把 playbook 内容整段复制进每个 `SKILL.md`；`SKILL.md` 只保留触发、边界、流程、输出和资源读取指针。
