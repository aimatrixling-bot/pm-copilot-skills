# Visit + Check-in Prototype Brief Fixture

来源：`D:\PMS-Dev-AIFirst\modules\visit\prototype-brief.md`

## Prototype Summary

- Prototype purpose: Vue Active Demo 的 Visit + Check-in 高保真原型规格。
- Boundary: 本 brief 不是最终数据库、API 或生产实现合同。
- Target Truth: `knowledge/domain/Visit.md`、`modules/visit/README.md`、业务规则和 UI/UX 设计规范。
- Current Reality: Vue Active Demo 尚无正式 `/operation/check-in` 或 `/operation/visits` route；短期 demo alias 不代表长期 IA。
- Active Demo: Vue 3 + TypeScript + Element Plus + mock。

## Covered Flows

- Appointment check-in creates or opens a Visit.
- Walk-in creates same-day minimal Appointment link, then creates or opens Visit.
- Visit queue separates lifecycle status from operational phase.
- Action strip covers Examination, Consultation, Surgery, Prescription, Billing, Next Appointment, Leave.
- VOIDED visits are hidden by default and shown only when `查看 VOID 记录` is enabled.

## States Covered

- default
- empty
- error
- disabled
- permission

## Gaps

- Route readiness remains `design` until implementation and verification.
- Mock contract is not final API contract.
- Visit phase final enum, permissions, audit and production API are not confirmed.
- Walk-in Appointment link production fields and audit model remain open.

## Verification

- Prototype brief acceptance checklist.
- Route proposal readiness table.
- Mock contract draft and non-goal statements.
