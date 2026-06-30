# Delivery Retrospective Template

Delivery Retrospective records what happened in one delivery round and where the next round should resume. It belongs to L4 demand evolution unless a human promotes specific decisions into stable source-of-truth.

```yaml
artifact_type: delivery_retrospective
task_or_goal:
source_artifacts:
what_changed:
evidence:
what_remains:
next_resume_point:
decisions_to_promote:
knowledge_disposition:
  update_stable_memory:
  archive_l4:
  retain_evidence:
  cleanup_proposal:
self_improvement_triggers:
  repeated_failure:
  template_gap:
  script_or_eval_candidate:
open_questions:
next_skill_input:
```

## Rules

- Retrospective is not a long-term rule source by default.
- Stable decisions must be migrated to the owning source-of-truth artifact before they are treated as durable.
- Use `next_resume_point` to help the next agent restart without rereading all project docs.
- Use `self_improvement_triggers` only as signals; it does not authorize automatic rule, template, script, eval or skill changes.
