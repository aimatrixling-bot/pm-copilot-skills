# Prototype-to-Spec 反向提取规则

## 目标

把已经存在的 prototype artifact、Prototype Brief、screen flow、visual target、运行/截图证据、状态覆盖、gaps 和 verification 沉淀成可构建 spec。原型是重要证据，但不是自动成立的业务规格；反向提取必须保留来源、证据强度和未确认缺口。

## 输入识别

当输入包含以下信息时，使用 `prototype_to_spec`：

- `artifact_path`、prototype URL、截图路径、HTML/React/Vue 原型路径。
- `visual_target`、source image、source URL、existing code、generated option 或 design target 说明。
- `runnable_evidence`、preview URL、run command、screenshot path、viewport/state 或 design QA notes。
- `covered_flows`、screen flow、页面流程或交互路径。
- `states_covered`，例如 default、loading、empty、error、success、disabled、permission。
- `gaps`、未覆盖状态、mock 数据说明、route readiness、权限/API/数据缺口。
- `verification`、截图、浏览器检查、人工 review、Evidence Packet 或 QA notes。

## 提取映射

- `artifact_path` -> `source_prototype.artifact_path` 和 `source_context.upstream_artifact`。
- `visual_target` -> `source_prototype.visual_target`、`design_evidence.visual_target` 和 relevant `design_brief` constraints。
- `covered_flows` -> `flows.primary` / `flows.alternate`，并提炼相关 `requirements.functional`。
- `states_covered` -> `states`、`ui_states` 和状态类 acceptance criteria。
- `gaps` -> `prototype_gaps`，再分流到 `open_questions`、`risks`、`non_goals` 或 `next_skill_input.blocking_questions`。
- `runnable_evidence` -> `prototype_verification.runnable_evidence`、`verification_plan.manual_checks`、`verification_plan.screenshot_checks`。
- `verification` -> `prototype_verification` 和 `verification_plan.manual_checks` / `evidence_required`。
- mock/demo 数据说明 -> `assumptions` 或 `risks`，不得写成生产数据已接入。

## 反向提取步骤

1. 先列 source prototype：路径、类型、visual target、保真度、已验证证据、已知 mock/demo 边界。
2. 把原型中已经呈现且验证过的行为标为 prototype facts。
3. 把从原型推导出的产品行为写入 inferred requirements，并标注依据。
4. 把未覆盖状态、未接 API、未确认权限、未验证数据写入 prototype gaps。
5. 只为已确认或可验证行为写 acceptance criteria。
6. 把不可验证或会改变工程边界的问题写入 open questions / risks。
7. 为下游 `builder-agent-task` 或 `builder-review` 生成最小可执行 handoff。

## Spec-first 保护

出现以下情况时，即使已有原型，也不能跳过规格确认：

- 权限、角色矩阵、审计、隐私、安全或合规。
- 数据模型、数据库 schema、迁移、回滚或生产数据一致性。
- API contract、错误码、幂等、重试、并发或性能。
- 真实系统写入、跨模块联动、账务、医疗、生产发布。
- 原型的 `gaps` 明确包含上述未确认内容。

处理方式：

- `spec_type` 可为 `engineering_request` 或 `agent_readable_spec`，但必须保留 prototype provenance。
- 把高风险缺口放入 `open_questions`、`risks` 和 `next_skill_input`。
- 不把界面存在当作后端/API/权限已确认。

## Acceptance Criteria 写法

从原型提取验收时使用 Given-When-Then 或等价结构：

```yaml
- id: AC-STATE-EMPTY
  statement: 当查询结果为空时，页面显示原型中定义的空状态文案和主要行动按钮。
  evidence: 使用 source_prototype 中的空状态截图或本地预览进行人工检查。
```

只要证据来自原型，就在 evidence 中说明来源；如果证据来自 visual target、preview URL、screenshot 或 design QA，也必须保留路径/URL、viewport 和 state。需要真实 API 或自动化测试时，写入 verification plan，而不是假装已经验证。

## Visual Evidence 保护

- visual target 可以成为 UI layout、状态、copy 或设计约束的证据，但不是业务规则、权限、API 或数据模型证据。
- screenshot_path 只能证明对应 viewport/state 被观察过，不能证明所有响应式或交互状态已覆盖。
- design QA 的 `passed` 只能说明 P0/P1/P2 视觉证据通过；P3 polish 仍应进入 follow-up。

## 反模式

- 把 prototype 的 `gaps` 直接改写成 requirements。
- 只按截图描述 UI，不提 non-goals、验收和验证。
- 因为已有高保真页面就认为权限/API/数据模型已经确认。
- 丢失 artifact path、visual target、screenshot path、状态覆盖和验证证据，导致后续 review 无法追溯。
- 把 mock/demo 数据写成生产行为。
