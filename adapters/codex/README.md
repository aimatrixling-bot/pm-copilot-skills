# Codex Adapter（Codex 适配器）

本适配器说明 AI Builder OS 如何投影到 Codex。

## 调用方式（Invocation）

- 显式 skill 调用：`$builder-agent-task`
- 自然语言路由：依赖 skill `description`
- Goal 工作流：使用 `builder-plan-goal` 或 `builder-agent-task` 生成的可复制 `/goal` 提示词

## M3.2 Package Surface

`install.js codex` 会把纯 AI Builder OS active surface 安装到 Codex 用户级 skills 目录。

包元数据由 `skill-pack.json` 和 `agents/openai.yaml` 声明。npm package id 为兼容性仍保留 `pm-copilot-skills`；`ai-builder-os` 是产品身份和命令别名。

## M3.3 导出（Export）

适配器 manifest：`adapters/codex/adapter.json`

```bash
npm run export:runtime -- --target codex --out ".\dist\ai-builder-os\codex" --clean
```

布局：`flat-skill-root`。每个导出的 builder skill 都内嵌共享的 `kernel`、`references`、`templates` 和 `adapters` 资源。
