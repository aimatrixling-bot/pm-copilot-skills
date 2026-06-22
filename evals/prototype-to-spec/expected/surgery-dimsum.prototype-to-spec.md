# Expected Prototype-to-Spec Output: Surgery + Dimsum

```yaml
readiness_gate:
  status: ready
spec_type: prototype_to_spec
source_prototype:
  artifact_path: evals/prototype-to-spec/fixtures/surgery-dimsum.prototype-brief.md
  original_source: D:\PMS-Dev-AIFirst\modules\surgery\prototype-brief.md
  prototype_mode: boundary_first
  fidelity: high
extracted_from_prototype:
  covered_flows:
    - SurgeryCase shell and detail
    - DimsumPaper list and editor
    - mock-only reservation on draft/add item
    - doctor sign confirm converts reservation into mock deduction projection
    - cancel/reject/remove releases reservation
  states_covered:
    - default
    - error
    - disabled
    - permission
prototype_gaps:
  mock_or_route_gaps:
    - route readiness remains planned/design before implementation
    - mock-only reservation is not real InventoryTransaction
  data_api_permission_gaps:
    - Billing, permission matrix, audit log and official legal e-signature are not in first slice
    - real inventory transaction timing needs later spec or ADR
prototype_verification:
  evidence:
    - First Slice Handoff Readiness
    - handoff packet minimum
    - prototype brief acceptance checklist
requirements:
  functional:
    - DimsumPaper must belong to a SurgeryCase.
    - Draft/add item may create mock-only reservation projection.
    - Doctor sign confirm must not claim official legal e-signature.
acceptance_criteria:
  - id: AC-DIMSUM-MOCK-BOUNDARY
    statement: 当点心纸保存草稿或加入项目时，只产生 mock-only reservation，不生成真实 InventoryTransaction。
    evidence: Prototype brief mock contract and demo manual check.
open_questions:
  - Production inventory transaction timing.
  - Permission and audit model for doctor signature and inventory handoff.
risks:
  - Mock deduction projection may be mistaken for real inventory deduction.
```

Manual review expectation: `prototype_to_spec_audit.spec_first_guard = pass` and `verification_provenance = pass`.
