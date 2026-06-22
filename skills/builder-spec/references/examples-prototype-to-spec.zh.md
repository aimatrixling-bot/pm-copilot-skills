# Prototype-to-Spec 示例

本文件提供 `builder-spec` 在 `prototype_to_spec` 模式下的真实样例口径。样例来自 PMS prototype brief 的结构化提炼，重点不是复述原文，而是示范如何保留 prototype provenance、mock boundary、gaps 和 verification。

## 示例 1：Visit + Check-in Prototype Brief

来源：

```text
D:\PMS-Dev-AIFirst\modules\visit\prototype-brief.md
```

输入特征：

- 原型目标：为 Vue Active Demo 实现 `Visit + Check-in` 高保真原型规格。
- 事实边界：Target Truth、Current Reality、Future Prototype、Active Demo 被明确拆分。
- 覆盖流程：Appointment check-in、Walk-in、Visit queue、action strip、Leave、Void。
- 状态覆盖：候诊、进行中、待收费、已离开、异常、全部；VOIDED 默认隐藏。
- mock boundary：Route readiness 初始为 `design`；mock contract 不代表最终 API。
- gaps：真实 API、权限、审计、Visit phase 最终枚举、Walk-in Appointment link 生产模型仍待确认。
- verification：验收清单覆盖 route readiness、mock contract、action strip、VOID、Walk-in、状态分组和生产缺口。

推荐 `prototype_to_spec` 输出要点：

```yaml
spec_type: prototype_to_spec
source_prototype:
  artifact_path: D:\PMS-Dev-AIFirst\modules\visit\prototype-brief.md
  prototype_mode: boundary_first
  fidelity: high
extracted_from_prototype:
  covered_flows:
    - Appointment Check-in
    - Walk-in Check-in
    - Visit Queue
    - Visit Action Strip
    - Leave / Void
  states_covered:
    - default
    - empty
    - error
    - disabled
    - permission
prototype_gaps:
  data_api_permission_gaps:
    - 真实 Visit API、权限、审计和 phase 状态机未确认
    - Walk-in Appointment link 的生产字段和审计待确认
prototype_verification:
  evidence:
    - 原型 brief 的验收清单
    - route proposal readiness 标注
```

注意：

- `VOIDED 默认隐藏` 可成为 requirement，因为 brief 明确且可验收。
- `真实 Visit API` 只能进入 gaps/open questions，不能写成已确认实现。
- `Current Reality` 中的 demo alias 不能写成长期 IA 已接受。

## 示例 2：Surgery + Dimsum Prototype Brief

来源：

```text
D:\PMS-Dev-AIFirst\modules\surgery\prototype-brief.md
```

输入特征：

- 原型目标：为 Active Demo 实现 `Surgery + Dimsum` 高保真原型规格。
- 事实边界：SurgeryCase、OperationArrangement、DimsumPaper、SurgeryMaterialUsage、OT Log / Print 职责被拆分。
- 覆盖流程：Surgery workbench、SurgeryCase detail、Dimsum list、Dimsum editor、doctor sign confirm。
- 状态覆盖：Draft、Submitted、Signed、Cancelled、Rejected；mock reservation / release / deduct projection。
- mock boundary：Dimsum 草稿或加入项目只产生 mock-only 库存占用，不生成真实 InventoryTransaction。
- gaps：真实库存扣减、Billing、权限、审计、doctor settlement、正式法律电子签和离线补签不在 first slice。
- verification：First Slice Handoff Readiness、handoff packet minimum 和验收清单。

推荐 `prototype_to_spec` 输出要点：

```yaml
spec_type: prototype_to_spec
source_prototype:
  artifact_path: D:\PMS-Dev-AIFirst\modules\surgery\prototype-brief.md
  prototype_mode: boundary_first
  fidelity: high
extracted_from_prototype:
  covered_flows:
    - SurgeryCase shell
    - DimsumPaper list and editor
    - mock inventory reservation
    - doctor sign confirm
  states_covered:
    - default
    - error
    - disabled
    - permission
prototype_gaps:
  mock_or_route_gaps:
    - route readiness 为 design/planned，不代表生产可用
  data_api_permission_gaps:
    - 真实 InventoryTransaction、Billing、权限、审计和正式签名未确认
prototype_verification:
  evidence:
    - First Slice Handoff Readiness
    - 验收清单
```

注意：

- `mock-only 库存占用` 必须写入 assumptions 或 requirements 的 demo 限定，不能变成真实库存扣减。
- `doctor sign confirm` 在 first slice 只是 mock operational signature，不是正式法律电子签。
- `PENDING_BACKFILL` 可进入 UI requirement，但完整补录 workflow 进入 gaps。

## 示例 3：高风险保护

输入：

> 原型已经能点了，请把 gaps 中的真实 API、数据库表、权限矩阵和审计日志直接写成工程交付 spec。

推荐处理：

- 保留 `prototype_to_spec`，但把高风险内容写入 `prototype_gaps`、`open_questions`、`risks` 和 `next_skill_input`。
- 如果用户要进入工程交付，`next_skill_hint` 可指向 `builder-agent-task`，但前提是 spec 中已有最小 API/权限/数据验收。
- 不允许把高保真页面存在当作 API、权限或数据模型已确认。
