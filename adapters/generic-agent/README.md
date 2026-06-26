# Generic Agent Adapter（通用 Agent 适配器）

本适配器说明如何在不支持 native skills 的 agent runtime 中使用 AI Builder OS。

## 使用方式（Use）

1. 复制相关 `builder-*` skill 指令。
2. 提供必需的 kernel packet schemas。
3. 要求 runtime 产出 Output Packet 和 Evidence Packet。
4. 将高风险动作保留为人工确认门禁。

## M3.2 Package Surface

使用 `skill-pack.json` 作为机器可读 manifest，使用 `agents/openai.yaml` 作为面向 OpenAI/Codex 的 metadata。`_archived/` 和 `research/` 不属于 package surface。

## M3.3 导出（Export）

适配器 manifest：`adapters/generic-agent/adapter.json`

```bash
npm run export:runtime -- --target generic-agent --out ".\dist\ai-builder-os\generic-agent" --clean
```

布局：`package-root`。Builder skills 位于 `skills/` 下，共享资源保留在 package root。
