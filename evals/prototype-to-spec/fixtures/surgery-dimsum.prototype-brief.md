# Surgery + Dimsum Prototype Brief Fixture

来源：`D:\PMS-Dev-AIFirst\modules\surgery\prototype-brief.md`

## Prototype Summary

- Prototype purpose: Vue Active Demo 的 Surgery + Dimsum 高保真原型规格。
- Boundary: 本 brief 不是最终数据库、API、库存、收费或医疗文书合同。
- Target Truth: SurgeryCase、DimsumPaper、SurgeryMaterialUsage 和业务规则。
- Current Reality: Vue Active Demo 已有 surgery arrangement 相关 route，但尚未覆盖 SurgeryCase、DimsumPaper、MaterialUsage、OT Log、Consent、Operation Record。
- Active Demo: Vue 3 + TypeScript + Element Plus + mock。

## Covered Flows

- SurgeryCase shell and detail.
- DimsumPaper list and editor.
- Add item / save draft creates mock-only reservation projection.
- Doctor sign confirm converts mock reservation into mock deduction projection.
- Cancel, reject or remove item releases mock reservation.

## States Covered

- default
- error
- disabled
- permission

## Gaps

- Route readiness remains planned/design before implementation.
- Mock reservation is not real InventoryTransaction.
- Billing, official legal e-signature, permission matrix, audit log and offline backfill are out of first slice.
- Real inventory transaction timing and production handoff need later spec/ADR.

## Verification

- First Slice Handoff Readiness.
- Handoff packet minimum.
- Prototype brief acceptance checklist.
