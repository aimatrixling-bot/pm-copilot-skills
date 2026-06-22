# Expected Prototype-to-Spec Output: Visit + Check-in

```yaml
readiness_gate:
  status: ready
spec_type: prototype_to_spec
source_prototype:
  artifact_path: evals/prototype-to-spec/fixtures/visit-checkin.prototype-brief.md
  original_source: D:\PMS-Dev-AIFirst\modules\visit\prototype-brief.md
  prototype_mode: boundary_first
  fidelity: high
extracted_from_prototype:
  covered_flows:
    - Appointment check-in creates or opens Visit
    - Walk-in creates same-day Appointment link before Visit
    - Visit queue separates lifecycle status and operational phase
    - Action strip projects Visit facts
    - VOIDED visits hidden by default
  states_covered:
    - default
    - empty
    - error
    - disabled
    - permission
prototype_gaps:
  mock_or_route_gaps:
    - route readiness remains design
    - mock contract is not final API
  data_api_permission_gaps:
    - production Visit API, permissions and audit are not confirmed
    - Walk-in Appointment link production fields remain open
prototype_verification:
  evidence:
    - prototype brief acceptance checklist
    - route proposal readiness table
requirements:
  functional:
    - Visit queue must not treat Appointment list as Visit facts.
    - VOIDED visits must be hidden by default and visible only under explicit VOID filter.
acceptance_criteria:
  - id: AC-VISIT-VOIDED-HIDDEN
    statement: 当 Visit 为 VOIDED 时，默认不进入候诊、进行中、待收费、已离开或异常队列。
    evidence: Prototype brief acceptance checklist or demo preview manual check.
open_questions:
  - Visit phase final enum and production audit rules.
  - Walk-in Appointment link production contract.
risks:
  - Mock route readiness may be mistaken for production route completion.
```

Manual review expectation: `prototype_to_spec_audit.gaps_preserved = pass` and `mock_boundary = pass`.
