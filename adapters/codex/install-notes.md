# Codex 安装说明（Codex Install Notes）

当前命令：

```bash
npx pm-copilot-skills codex
npx pm-copilot-skills codex-project
```

当前目标目录：

```text
~/.agents/skills
./.agents/skills
```

Codex 安装和导出现在只包含 AI Builder OS active builder core。Legacy `pm-*`、`pdf`、`pptx`、`download-anything` 和旧 `skills/references` 默认不会安装。

导出命令：

```bash
npm run export:runtime -- --target codex --out ".\dist\ai-builder-os\codex" --clean
```
