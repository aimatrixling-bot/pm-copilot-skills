---
name: builder-review
displayName: Builder Review
description: "评审 spec、prototype、Design Brief、Agent Task Packet、agent 输出、代码变更、Evidence Packet、release seal 或 launch readiness。适用于用户要求 review、audit、critique、evidence check、quality gate、Go/No-Go、PASS/PARTIAL/BLOCKED、REQUEST_CHANGES、fake UI check、fake test check、design consistency audit 或 readiness assessment。不要用于创建缺失的 spec/prototype/task，也不要用于记录已做出的长期取舍；决策沉淀交给 builder-decision。"
user-invocable: true
argument-hint: "[产物路径、输出、diff 或 review target]"
---

# Builder Review

## 使命

审计一个输出是否真正满足目标，并且是否有足够证据进入下一步。

## 资源读取

- 通用质量评审时，读取 `kernel/gates/builder-quality-gates.zh.md` 和 `kernel/packets/evidence-packet.schema.md`。
- 评审 UI、prototype 或界面实现时，读取 `kernel/gates/design-consistency-gate.zh.md`、`kernel/gates/product-logic-containment-gate.zh.md`、`templates/design-brief/template.md` 和 `references/ui-ux/`。
- 评审高保真、可交互或可运行原型时，读取 `loops/recipes/design-plan-to-prototype.loop.md`，检查是否存在 `design_plan`、`runnable_prototype`、`preview_or_run_command` 和 Evidence Packet。
- 检查 demo、mock 或测试可信度时，读取 `kernel/gates/fake-ui-gate.zh.md` 和 `kernel/gates/fake-test-gate.zh.md`。
- 评审交付物、项目输出、资产清理或跨资产一致性时，读取 `loops/recipes/artifact-hygiene.loop.md`、`memory/policies/artifact-consistency-policy.zh.md` 和 `memory/policies/artifact-cleanup-policy.zh.md`。
- 输出 Review Report 时，读取 `templates/review-report/template.md`。
- 打磨或评审 skill 设计时，读取 `references/skill-design/skill-design-playbook.zh.md`。

## 何时使用

- 用户要求 review、critique、audit 或 readiness。
- 已经有 spec、prototype、agent task、代码变更或 evidence packet。
- 用户需要 GO / NO-GO 或 PASS / PARTIAL / BLOCKED 判断。
- 用户需要判断是否可以进入下一个 Goal、agent handoff 或发布步骤。

## 何时不要使用

- 用户要求从零创建新产物。
- 还没有 review target。
- 用户只是想头脑风暴。
- 用户只是需要把取舍沉淀为决策记录；交给 `builder-decision`。

## 输入

- Review target。
- 原始目标和范围。
- 验收标准。
- Evidence packet，如果有。
- 风险上下文。
- 当评审 UI、prototype 或产品界面时，提供 Design Brief 或 UI/UX 约束。
- 当评审对象会产生、替代、废弃或清理项目资产时，提供 artifact index 或相关资产路径；如果没有，标记为 `not_available`，不要凭空推断。

## 模式判断

- `contract_review`：检查 spec、agent task 或输出是否满足原始契约。
- `evidence_review`：检查测试、截图、日志、命令结果或 Evidence Packet 是否可信。
- `design_review`：检查 Design Brief、组件一致性、状态覆盖、响应式、mock/demo 标注。
- `release_readiness`：检查是否达到 Go/No-Go 或 release seal 条件。
- `not_reviewable`：缺少 review target、原始契约或证据，先要求补材料。

## 执行流程

1. 识别 review target 和原始契约。
2. 对照范围和验收标准检查完整性。
3. 应用相关门禁：Evidence Gate、Fake UI Gate、Product Logic Containment Gate、Design Consistency Gate、Fake Test Gate、Safety Gate。
4. 如果 review target 涉及项目资产、文档膨胀、清理动作、交付物替代或 source-of-truth 变更，按 Artifact Hygiene Loop 做一次轻量审计：检查生命周期状态、index 更新需要、清理风险和一致性风险。
5. 按严重程度列出 findings 和 required action。
6. 给出 PASS、PARTIAL、BLOCKED、APPROVE 或 REQUEST_CHANGES。

## 输出契约

```yaml
review_mode:
review_target:
contract_checked:
findings:
evidence_audit:
design_consistency_audit:
product_logic_containment_audit:
design_plan_audit:
artifact_hygiene_audit:
artifact_index_update_proposal:
risk_assessment:
decision:
required_fixes:
unverified_areas:
cleanup_proposal:
next_step:
```

## 质量门禁

- Findings 必须引用产物路径或可观察证据。
- 未检查证据前不要 approve。
- 区分产品问题和实现问题。
- 明确列出未验证区域。
- UI/prototype review 必须检查 Design Brief、组件一致性、状态覆盖、交互真实性、响应式和 mock/demo 标注。
- UI/prototype review 必须检查 Product Logic Containment Gate；发现业务规则说明侵入界面主体时，默认 `REQUEST_CHANGES`。
- 高保真原型 review 必须检查 Design Plan to Prototype Loop，包括 `design_plan`、`runnable_prototype`、`preview_or_run_command`、Evidence Packet 和 `nudge_options`。
- 不要批准只有视觉上“像真的”、但缺少交互/状态证据的 UI 工作。
- 如果证据不足，决策必须是 PARTIAL、BLOCKED 或 REQUEST_CHANGES，不能用 APPROVE 掩盖。
- `artifact_hygiene_audit` 必须明确为 `not_applicable`、`not_available` 或列出审计结论；不要省略。
- `artifact_index_update_proposal` 只允许提出建议，不得声称已经更新 index，除非 evidence packet 中有可验证证据。
- 高风险清理只能进入 `cleanup_proposal`，不得在 review 中要求自动删除；涉及 `current`、`accepted`、`source_of_truth`、`decision_record` 或 evidence 的资产必须要求人工确认。

## 交接

交给负责修复问题的 skill；如果需要接受取舍，则交给 `builder-decision`。交接时保留 findings、required_fixes、unverified_areas、design_consistency_audit、product_logic_containment_audit、design_plan_audit、artifact_hygiene_audit、artifact_index_update_proposal、cleanup_proposal、decision 和 next_step。

## 参考

- `kernel/gates/builder-quality-gates.zh.md`
- `kernel/gates/fake-ui-gate.zh.md`
- `kernel/gates/design-consistency-gate.zh.md`
- `kernel/gates/product-logic-containment-gate.zh.md`
- `kernel/gates/fake-test-gate.zh.md`
- `kernel/packets/evidence-packet.schema.md`
- `loops/recipes/artifact-hygiene.loop.md`
- `loops/recipes/design-plan-to-prototype.loop.md`
- `memory/policies/artifact-consistency-policy.zh.md`
- `memory/policies/artifact-cleanup-policy.zh.md`
- `templates/review-report/template.md`
- `templates/design-brief/template.md`
- `references/ui-ux/`
- `evals/output-contract/builder-review.schema.json`
- `references/skill-design/skill-design-playbook.zh.md`
- 既有来源：`skills/pm-code-review/SKILL.md`
