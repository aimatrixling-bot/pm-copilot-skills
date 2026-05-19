# PM Copilot Skills

[![npm version](https://img.shields.io/npm/v/pm-copilot-skills.svg)](https://www.npmjs.com/package/pm-copilot-skills)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![Skills](https://img.shields.io/badge/skills-34_PM_%2B_3_utilities-green.svg)](skills/)

34 production-ready PM Skills for [Claude Code](https://claude.ai/claude-code) + 3 utility skills, covering the full product management lifecycle from discovery to launch.

## Why PM Copilot Skills?

- **Battle-tested** — Built from real PM practice across enterprise digital products and AI-native applications
- **Knowledge-backed** — Integrated methodology KB from 23 classic PM books (Hooked, The Lean Startup, Mom Test, etc.)
- **Quality-gated** — Every skill includes Iron Law validation and output quality checks
- **Zero config** — Install once, use immediately in any Claude Code session

## Quick Install

```bash
# Install globally (available in all projects)
npx pm-copilot-skills

# Install to current project only
npx pm-copilot-skills project
```

Or install from source:

```bash
git clone https://github.com/aimatrixling-bot/pm-copilot-skills.git
cd pm-copilot-skills
npm link
```

## Skills Overview

### PM Core (18 skills)

Core product management skills — from problem framing to launch planning.

| Skill | Trigger | What it does |
|-------|---------|--------------|
| `pm-problem-frame` | `/pm-problem-frame` | Define and validate problems before jumping to solutions |
| `pm-discovery` | `/pm-discovery` | End-to-end product discovery — idea to validated opportunity |
| `pm-persona` | `/pm-persona` | Create evidence-based user personas |
| `pm-comp` | `/pm-comp` | Systematic competitive analysis |
| `pm-prd` | `/pm-prd` | Write or improve Product Requirements Documents |
| `pm-rice` | `/pm-rice` | RICE prioritization (Reach x Impact x Confidence / Effort) |
| `pm-decision` | `/pm-decision` | Structured decisions with rationale and trade-offs |
| `pm-roadmap` | `/pm-roadmap` | Product roadmaps connecting strategy to execution |
| `pm-backlog` | `/pm-backlog` | Sprint planning and backlog prioritization |
| `pm-wireframe` | `/pm-wireframe` | Low-fidelity wireframes for page layouts |
| `pm-prototype` | `/pm-prototype` | High-fidelity interactive prototypes |
| `pm-tech-spec` | `/pm-tech-spec` | Technical specifications from PRD features |
| `pm-experiment` | `/pm-experiment` | Design rigorous experiments (H0/H1, sample size) |
| `pm-metrics` | `/pm-metrics` | Define metric systems — North Star, guardrails |
| `pm-testing` | `/pm-testing` | Test plans — happy paths, edge cases, error handling |
| `pm-launch` | `/pm-launch` | Launch plans and release checklists |
| `pm-critique` | `/pm-critique` | Critical review of products, designs, PRDs |
| `pm-ai-patterns` | `/pm-ai-patterns` | AI product design patterns — completion, generation, recommendation |

### Decision & Analysis (4 skills)

| Skill | Trigger | What it does |
|-------|---------|--------------|
| `pm-data-analysis` | `/pm-data-analysis` | 7-in-1 analysis — snapshot, funnel, cohort, RCA, etc. |
| `pm-gap-analysis` | `/pm-gap-analysis` | Diagnose gaps between strategy, build, and user needs |
| `pm-solution-brief` | `/pm-solution-brief` | One-page solution summaries for stakeholders |
| `pm-strategy-session` | `/pm-strategy-session` | 30-min structured strategy session |

### Engineering (6 skills)

Bridge PM requirements to engineering execution.

| Skill | Trigger | What it does |
|-------|---------|--------------|
| `pm-code-architect` | `/pm-code-architect` | Design system architecture from PRD/Tech Spec |
| `pm-code-implement` | `/pm-code-implement` | Execute code implementation from architecture design |
| `pm-code-review` | `/pm-code-review` | Review code for security, logic, and performance |
| `pm-eng-request` | `/pm-eng-request` | Engineering requests with Given-When-Then criteria |
| `pm-seo` | `/pm-seo` | SEO strategy and audit |
| `pm-content-general` | `/pm-content-general` | Generate blog posts, landing pages, release notes |

### Growth & Cross-functional (4 skills)

| Skill | Trigger | What it does |
|-------|---------|--------------|
| `pm-feature-cycle` | `/pm-feature-cycle` | Full feature lifecycle — RICE to launch |
| `pm-sync` | `/pm-sync` | Project status reports from local files |
| `pm-retro` | `/pm-retro` | Team retrospectives with actionable improvements |
| `pm-urgent` | `/pm-urgent` | 3-min structured clarification for urgent questions |

### Career (2 skills)

| Skill | Trigger | What it does |
|-------|---------|--------------|
| `pm-job-search` | `/pm-job-search` | PM job materials — JD analysis, resume, interview prep |
| `pm-ost` | `/pm-ost` | PM skill assessment with Open Skill Tree framework |

### Bundled Utilities (3 skills)

General-purpose tools included for convenience.

| Skill | What it does | License |
|-------|--------------|---------|
| `pdf` | PDF manipulation — extract, create, merge, split | Proprietary (c) Anthropic, PBC |
| `pptx` | Presentation creation and editing (.pptx) | Proprietary (c) Anthropic, PBC |
| `download-anything` | Find and download digital resources | No license declared |

## Knowledge Base

Every skill has access to a shared knowledge base in `skills/references/`:

- **Methodology KB** — 23 classic PM books distilled into actionable patterns
- **Quality Gates** — Iron Law validation rules and output quality standards
- **Design KB** — UI patterns and component references
- **Decision Frameworks** — Reusable templates for trade-off analysis

## Usage

After installation, invoke any skill in Claude Code:

```
/pm-prd Build a CRM system for dental clinics in Hong Kong...
/pm-comp Compare Notion vs Linear vs Monday.com for PM teams
/pm-critique Review this PRD for a children's educational game
/pm-discovery Validate the idea of an AI-powered daily news digest
```

## Architecture

```
pm-copilot-skills/
├── skills/                    # 34 PM skills + 3 utilities
│   ├── pm-prd/               # Each skill has its own directory
│   │   └── SKILL.md          # Skill definition (YAML + instructions)
│   ├── references/           # Shared knowledge base
│   │   ├── design-kb/        # UI pattern references
│   │   ├── pm-theory-kb/     # PM methodology from 23 books
│   │   └── quality-gates-shared.md
│   └── ...
├── install.js                 # npm installer script
├── sync-and-publish.sh        # CI: sync from source + npm publish
├── package.json
└── README.md
```

## Compatibility

- **Claude Code CLI** — primary target, tested with Claude Sonnet 4.6 / Opus 4.6
- **SKILL.md format** — standard YAML frontmatter compatible with [skills.sh](https://skills.sh), [awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills), and [agentskills.io](https://agentskills.io)
- **Cross-platform** — macOS, Linux, Windows (bash)

## License

- **PM Skills** (34): [Apache-2.0](LICENSE)
- **pdf & pptx utilities**: Proprietary, (c) Anthropic, PBC — see `skills/pdf/LICENSE.txt` and `skills/pptx/LICENSE.txt`

## Links

- [GitHub](https://github.com/aimatrixling-bot/pm-copilot-skills)
- [npm](https://www.npmjs.com/package/pm-copilot-skills)
- [PM Copilot Agent](https://github.com/aimatrixling-bot/pm-copilot-agent) — full Tauri desktop app with 34 skills
