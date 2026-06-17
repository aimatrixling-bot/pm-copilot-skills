# Codex Mapping

| AI Builder OS concept | Codex projection |
| --- | --- |
| Skill | `~/.agents/skills/<skill-name>/SKILL.md` |
| Explicit invocation | `$skill-name` |
| Plan prompt | `/plan` text copied by user |
| Goal prompt | `/goal` text copied by user |
| Evidence Packet | final report with commands, files, risks |
| Human approval gate | user confirmation before risky side effects |
| Export layout | `flat-skill-root` |
| Export manifest | `<target>/.ai-builder-os/export-manifest.json` |

Adapter files must not duplicate methodology. They only explain runtime projection.
