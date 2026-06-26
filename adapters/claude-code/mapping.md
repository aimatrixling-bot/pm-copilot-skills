# Claude Code 映射（Claude Code Mapping）

| AI Builder OS 概念 | Claude Code 投影 |
| --- | --- |
| Skill | `.claude/skills/<skill-name>/SKILL.md` 或用户级等价目录 |
| 显式调用 | `/skill-name` |
| References | skill 或 package 下的相对文件 |
| 人工确认门禁 | 使用高风险工具或产生副作用前先询问 |
| Adapter 角色 | 只提供安装和调用说明 |
| 导出布局 | `flat-skill-root` |
| 导出 manifest | `<target>/.ai-builder-os/export-manifest.json` |
