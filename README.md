# PM Copilot Skills

[![npm version](https://img.shields.io/npm/v/pm-copilot-skills.svg)](https://www.npmjs.com/package/pm-copilot-skills)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![Skills](https://img.shields.io/badge/skills-16_PM_%2B_3_utilities-green.svg)](skills/)

16 PM Skills for [Claude Code](https://claude.ai/claude-code) + 3 utility skills, organized as a **product building pipeline** — from discovery to launch.

> v0.5.0 restructured from 36 skills to 16 pipeline-aligned skills based on real AI Native PM workflow research ([QoderWork case study](research/QoderWorkPM%E5%88%86%E4%BA%AB/)).

## Why PM Copilot Skills?

- **Pipeline-aligned** — Skills organized by workflow phase, not document type
- **Knowledge-backed** — Integrated methodology KB from 23 classic PM books
- **Quality-gated** — Every skill includes Iron Law validation and output quality checks
- **Zero config** — Install once, use immediately in any Claude Code session

## Quick Install

```bash
# Install globally (available in all projects)
npx pm-copilot-skills

# Install to current project only
npx pm-copilot-skills project
```

## Pipeline Architecture

```
Phase 0: Discovery          Phase 1: Design & Build
+------------------+        +------------------+
| pm-discovery     |------->| pm-feature-frame |
| pm-deconstruct   |        | pm-prototype     |
+------------------+        +--------+---------+
                                     |
Phase 2: Quality & PRD              v
+------------------+        +------------------+
| pm-code-review   |<-------| pm-prd           |
+------------------+        +--------+---------+
                                     |
Phase 3: Construct                  v
+------------------+        +------------------+
| pm-code-architect|<-------| pm-code-implement|
+------------------+        +------------------+

Phase 4: Ship & Decide
+------------------+
| pm-comp          |  (analysis + critique modes)
| pm-launch        |
| pm-content-general|
+------------------+

Cross-cutting: pm-decision | pm-prioritize (RICE + roadmap + backlog)
Special: pm-ai-patterns | pm-agent-patterns
Personal: pm-job-search
```

## Skills by Phase

### Phase 0: Discovery (2 skills)

| Skill | Trigger | What it does |
|-------|---------|--------------|
| `pm-discovery` | `/pm-discovery` | End-to-end product discovery -- idea to validated opportunity |
| `pm-deconstruct` | `/pm-deconstruct` | Reverse-engineer products -- interaction layer to strategic intent |

### Phase 1: Design & Build (2 skills)

| Skill | Trigger | What it does |
|-------|---------|--------------|
| `pm-feature-frame` | `/pm-feature-frame` | Problem validation + feature conception -- bridge from problem to prototype |
| `pm-prototype` | `/pm-prototype` | High-fidelity interactive prototypes + low-fidelity wireframes (`--fidelity=low|high`) |

### Phase 2: Quality & PRD (2 skills)

| Skill | Trigger | What it does |
|-------|---------|--------------|
| `pm-code-review` | `/pm-code-review` | Review code for security, logic, and performance |
| `pm-prd` | `/pm-prd` | PRD + acceptance criteria (`--include-acceptance`) + engineering requests (`--eng-request`) |

### Phase 3: Construct (2 skills)

| Skill | Trigger | What it does |
|-------|---------|--------------|
| `pm-code-architect` | `/pm-code-architect` | Design system architecture from PRD/Tech Spec |
| `pm-code-implement` | `/pm-code-implement` | Execute code implementation from architecture design |

### Phase 4: Ship & Decide (3 skills)

| Skill | Trigger | What it does |
|-------|---------|--------------|
| `pm-comp` | `/pm-comp` | Competitive analysis (`--mode=analysis`) + product critique (`--mode=critique`) |
| `pm-launch` | `/pm-launch` | Launch plans and release checklists |
| `pm-content-general` | `/pm-content-general` | Generate blog posts, landing pages, release notes, product docs |

### Cross-cutting (2 skills)

| Skill | Trigger | What it does |
|-------|---------|--------------|
| `pm-decision` | `/pm-decision` | Structured decisions with rationale and trade-offs |
| `pm-prioritize` | `/pm-prioritize` | RICE scoring + roadmap planning + sprint backlog (`--mode=prioritize|roadmap|backlog`) |

### Specialized: AI Products (2 skills)

| Skill | Trigger | What it does |
|-------|---------|--------------|
| `pm-ai-patterns` | `/pm-ai-patterns` | AI product design patterns -- interaction, trust, personalization, evaluation |
| `pm-agent-patterns` | `/pm-agent-patterns` | AI Agent architecture & security patterns -- identity, memory, tools, safety |

### Personal (1 skill)

| Skill | Trigger | What it does |
|-------|---------|--------------|
| `pm-job-search` | `/pm-job-search` | PM job materials -- JD analysis, resume, interview prep |

### Bundled Utilities (3 skills)

| Skill | What it does | License |
|-------|--------------|---------|
| `pdf` | PDF manipulation -- extract, create, merge, split | Proprietary (c) Anthropic, PBC |
| `pptx` | Presentation creation and editing (.pptx) | Proprietary (c) Anthropic, PBC |
| `download-anything` | Find and download digital resources | No license declared |

## Knowledge Base

Every skill has access to a shared knowledge base in `skills/references/`:

- **Methodology KB** -- 23 classic PM books distilled into actionable patterns
- **Quality Gates** -- Iron Law validation rules and output quality standards
- **Design KB** -- UI patterns and component references

## Usage

After installation, invoke any skill in Claude Code:

```
/pm-discovery Validate the idea of an AI-powered daily news digest
/pm-feature-frame I want to build a CRM for dental clinics
/pm-prototype --fidelity=low Dashboard layout for patient management
/pm-prd --include-acceptance CRM appointment scheduling module
/pm-comp --mode=critique Review this landing page design
/pm-prioritize --mode=roadmap Q3 2026 product roadmap
```

## Architecture

```
pm-copilot-skills/
+-- skills/                    # 16 PM skills + 3 utilities
|   +-- pm-prd/               # Each skill has its own directory
|   |   +-- SKILL.md          # Skill definition (YAML + instructions)
|   +-- references/           # Shared knowledge base
|   |   +-- design-kb/
|   |   +-- pm-theory-kb/
|   |   +-- quality-gates-shared.md
|   +-- ...
+-- _archived/                 # Archived skills (v0.4.x -> v0.5.0)
|   +-- skills-removed-v0.5.0/
+-- research/                  # Upgrade analysis & case studies
+-- install.js                 # npm installer script
+-- sync-and-publish.sh        # CI: sync from source + npm publish
+-- package.json
+-- README.md
```

## Compatibility

- **Claude Code CLI** -- primary target, tested with Claude Sonnet 4.6 / Opus 4.6
- **SKILL.md format** -- standard YAML frontmatter compatible with [skills.sh](https://skills.sh), [awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills), and [agentskills.io](https://agentskills.io)
- **Cross-platform** -- macOS, Linux, Windows (bash)

## License

- **PM Skills** (16): [Apache-2.0](LICENSE)
- **pdf & pptx utilities**: Proprietary, (c) Anthropic, PBC -- see `skills/pdf/LICENSE.txt` and `skills/pptx/LICENSE.txt`

## Links

- [GitHub](https://github.com/aimatrixling-bot/pm-copilot-skills)
- [npm](https://www.npmjs.com/package/pm-copilot-skills)
- [PM Copilot Agent](https://github.com/aimatrixling-bot/pm-copilot-agent) -- full Tauri desktop app
