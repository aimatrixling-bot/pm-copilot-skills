# Claude Code Mapping

| AI Builder OS concept | Claude Code projection |
| --- | --- |
| Skill | `.claude/skills/<skill-name>/SKILL.md` or user-level equivalent |
| Explicit invocation | `/skill-name` |
| References | relative files under the skill or package |
| Human approval gate | ask before risky tools or side effects |
| Adapter role | installation and invocation notes only |
| Export layout | `flat-skill-root` |
| Export manifest | `<target>/.ai-builder-os/export-manifest.json` |
