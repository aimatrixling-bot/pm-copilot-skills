# Claude Code Adapter

This adapter documents how AI Builder OS projects to Claude Code.

## Invocation

- Explicit slash style: `/builder-spec`
- Automatic loading depends on skill `description`
- Side-effect-heavy skills should require user approval.

## M3.2 Package Surface

`install.js` supports global and project Claude skills directories and installs only the pure AI Builder OS active surface.

The npm package id remains `pm-copilot-skills` for compatibility; `ai-builder-os` is the product identity and command alias.

## M3.3 Export

Adapter manifest: `adapters/claude-code/adapter.json`

```bash
npm run export:runtime -- --target claude-code --out ".\dist\ai-builder-os\claude-code" --clean
```

Layout: `flat-skill-root`. Each exported builder skill embeds shared `kernel`, `references`, `templates`, and `adapters` resources.
