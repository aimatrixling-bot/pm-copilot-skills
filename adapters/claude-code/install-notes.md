# Claude Code Install Notes

Current commands:

```bash
npx pm-copilot-skills
npx pm-copilot-skills project
```

These commands install the package skills into Claude Code global or project-level skill directories.

They install only the AI Builder OS active builder core.

Export command:

```bash
npm run export:runtime -- --target claude-code --out ".\dist\ai-builder-os\claude-code" --clean
```
