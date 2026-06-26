# Codex 映射（Codex Mapping）

| AI Builder OS 概念 | Codex 投影 |
| --- | --- |
| Skill | `~/.agents/skills/<skill-name>/SKILL.md` |
| 显式调用 | `$skill-name` |
| Plan prompt | 用户复制的 `/plan` 文本 |
| Goal prompt | 用户复制的 `/goal` 文本 |
| Evidence Packet | 包含命令、文件、风险的 final report |
| 人工确认门禁 | 高风险副作用前需要用户确认 |
| 导出布局 | `flat-skill-root` |
| 导出 manifest | `<target>/.ai-builder-os/export-manifest.json` |

Adapter 文件不得复制方法论，只说明 runtime projection。
