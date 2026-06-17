# Generic Agent Adapter

This adapter describes how to use AI Builder OS with agent runtimes that do not support native skills.

## Use

1. Copy the relevant `builder-*` skill instructions.
2. Provide required kernel packet schemas.
3. Ask the runtime to produce an Output Packet and Evidence Packet.
4. Preserve risky actions as human approval gates.

## M3.2 Package Surface

Use `skill-pack.json` as the machine-readable manifest and `agents/openai.yaml` as OpenAI/Codex-oriented metadata. `_archived/` and `research/` are not part of the package surface.

## M3.3 Export

Adapter manifest: `adapters/generic-agent/adapter.json`

```bash
npm run export:runtime -- --target generic-agent --out ".\dist\ai-builder-os\generic-agent" --clean
```

Layout: `package-root`. Builder skills are under `skills/`, and shared resources stay at the package root.
