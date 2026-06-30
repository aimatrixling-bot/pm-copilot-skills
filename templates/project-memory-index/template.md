# Project Memory Index Template

Project Memory Index proposes how a user project should organize L0-L4 knowledge. It is proposal-only: AI Builder OS must not automatically create, delete, migrate or rename user project files from this template.

```yaml
artifact_type: project_memory_index
project:
status: proposal | accepted | needs_review
scope:
layers:
  L0:
    purpose: product_overview
    candidate_files:
    read_policy:
    update_policy:
  L1:
    purpose: business_rules
    candidate_files:
    read_policy:
    update_policy:
  L2:
    purpose: design_and_technical_specs
    candidate_files:
    read_policy:
    update_policy:
  L3:
    purpose: interface_and_acceptance_contracts
    candidate_files:
    read_policy:
    update_policy:
  L4:
    purpose: demand_evolution
    candidate_files:
    read_policy:
    update_policy:
lifecycle_policy:
  research:
  prototype:
  evidence:
  retrospectives:
approval_required:
non_goals:
next_step:
```

## Rules

- Do not require agents to read all project docs by default.
- L0-L3 should hold stable knowledge; L4 should hold active changes, evidence, retrospectives and task packs.
- Any initialization, migration or cleanup action must become a human-reviewed proposal first.
- If project `AGENTS.md` defines a different memory convention, follow the project rule and use this template only as a comparison aid.
