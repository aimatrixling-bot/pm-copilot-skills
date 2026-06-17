# Memory & Evolution

Memory makes AI Builder OS cumulative instead of one-shot.

It records reusable context, preferences, artifacts, decisions, and skill evolution signals. It does not store all chat history.

## Memory Types

| Type | Purpose |
| --- | --- |
| User Memory | durable user preferences and working style |
| Project Memory | project goals, constraints, phase, and next step |
| Artifact Memory | index of Feature Frames, Specs, Prototypes, Agent Task Packets, Reviews, Decisions |
| Decision Memory | key tradeoffs and reversal conditions |
| Skill Evolution Memory | trigger misses, template issues, missing gates, missing evals |

## Project Runtime Draft

```text
.ai-builder/
├── PROJECT.md
├── MEMORY.md
├── artifact-index.yaml
├── decision-log.md
├── run-log.md
└── evolution-log.md
```

This project runtime is a future consumer-facing convention. Phase 1 only defines it.
