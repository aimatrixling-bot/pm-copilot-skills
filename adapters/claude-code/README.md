# Claude Code Adapter（Claude Code 适配器）

本适配器说明 AI Builder OS 如何投影到 Claude Code。

源码仓库中的 `CLAUDE.md` 只作为 Claude Code source checkout 入口；长期规则仍以 `AGENTS.md` 和 `docs/source-of-truth-map.md` 为准。

## 调用方式（Invocation）

- 显式 slash 风格：`/builder-spec`
- 自动加载依赖 skill `description`
- 具有明显副作用的 skill 应要求用户批准

## M3.2 Package Surface

`install.js` 支持 Claude 全局和项目级 skills 目录，并且只安装纯 AI Builder OS active surface。

npm package id 为兼容性仍保留 `pm-copilot-skills`；`ai-builder-os` 是产品身份和命令别名。

## M3.3 导出（Export）

适配器 manifest：`adapters/claude-code/adapter.json`

```bash
npm run export:runtime -- --target claude-code --out ".\dist\ai-builder-os\claude-code" --clean
```

布局：`flat-skill-root`。每个导出的 builder skill 都内嵌共享的 `kernel`、`references`、`templates` 和 `adapters` 资源。
