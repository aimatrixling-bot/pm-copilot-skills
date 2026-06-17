# Codex Install Notes

Current command:

```bash
npx pm-copilot-skills codex
```

Current target:

```text
~/.agents/skills
```

Codex installation and export now include only the AI Builder OS active builder core. Legacy `pm-*`, `pdf`, `pptx`, `download-anything`, and old `skills/references` are not installed by default.

Export command:

```bash
npm run export:runtime -- --target codex --out ".\dist\ai-builder-os\codex" --clean
```
