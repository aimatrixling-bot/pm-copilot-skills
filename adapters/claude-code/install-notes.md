# Claude Code 安装说明（Claude Code Install Notes）

当前命令：

```bash
npx pm-copilot-skills
npx pm-copilot-skills project
```

这些命令会把 package skills 安装到 Claude Code 全局或项目级 skill 目录。

它们只安装 AI Builder OS active builder core。

导出命令：

```bash
npm run export:runtime -- --target claude-code --out ".\dist\ai-builder-os\claude-code" --clean
```
