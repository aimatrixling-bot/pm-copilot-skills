# Research Brief Template

Research Brief caches exploration work that affects a product, architecture, implementation or delivery decision. It should stay short and decision-oriented.

```yaml
artifact_type: research_brief
research_question:
decision_it_informs:
scope:
sources_checked:
  - source:
    type: repo | doc | web | code | experiment | user_input
    relevance:
findings:
  - finding:
    evidence:
    confidence: high | medium | low
options:
  - option:
    upside:
    downside:
    fit:
recommendation:
confidence: high | medium | low
staleness_risk:
assumptions:
open_questions:
follow_up:
next_artifact: feature_frame | builder_spec | module_execution_pack | change_contract | decision_record | agent_task_pack | none
```

## Rules

- Research Brief answers one decision question; it is not a general notes dump.
- Separate facts, inferences and recommendations.
- If research could become stale, record `staleness_risk` and the condition that should trigger refresh.
- Research findings do not become requirements until they are accepted into Feature Frame, Spec, Decision Record or another source-of-truth artifact.
