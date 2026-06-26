---
name: builder-review
displayName: Builder Review
description: "评审 spec、prototype、prototype-to-spec 输出、Design Brief、Agent Task Packet、agent 输出、代码变更、Evidence Packet、release seal 或 launch readiness。适用于用户要求 review、audit、critique、evidence check、quality gate、Go/No-Go、PASS/PARTIAL/BLOCKED、REQUEST_CHANGES、fake UI check、fake test check、design consistency audit、prototype design evidence、prototype gaps/mock boundary/verification provenance 检查或 readiness assessment。不要用于创建缺失的 spec/prototype/task，也不要用于记录已做出的长期取舍；决策沉淀交给 builder-decision。"
user-invocable: true
argument-hint: "[产物路径、输出、diff 或 review target]"
---

# Builder Review

## 使命

审计一个输出是否真正满足目标，并且是否有足够证据进入下一步。

## 资源读取

- 通用质量评审时，读取 `kernel/gates/builder-quality-gates.zh.md` 和 `kernel/packets/evidence-packet.schema.md`。
- 评审 `prototype_to_spec` 输出时，读取 `references/prototype-to-spec-review.zh.md` 和共享 `references/prototype-to-spec.zh.md`。
- 评审高保真、可运行或 visual-target 原型证据时，读取 `references/prototype-design-evidence-review.zh.md`。
- 评审 UI、prototype 或界面实现时，读取 `kernel/gates/design-consistency-gate.zh.md`、`kernel/gates/product-logic-containment-gate.zh.md`、`templates/design-brief/template.md` 和 `references/ui-ux/`。
- 评审高保真、可交互或可运行原型时，读取 `loops/recipes/design-plan-to-prototype.loop.md`，检查是否存在 `design_plan`、`runnable_prototype`、`preview_or_run_command`、screenshot 和 Evidence Packet。
- 检查 demo、mock 或测试可信度时，读取 `kernel/gates/fake-ui-gate.zh.md` 和 `kernel/gates/fake-test-gate.zh.md`。
- 检查实现与 Module Execution Pack、Change Contract、Branch State 或 Agent Task Packet 是否漂移时，读取 `docs/delivery-kernel.md`、`loops/recipes/definition-sync.loop.md` 和 `templates/definition-drift-check/template.md`。
- 评审交付物、项目输出、资产清理或跨资产一致性时，读取 `loops/recipes/artifact-hygiene.loop.md`、`memory/policies/artifact-consistency-policy.zh.md` 和 `memory/policies/artifact-cleanup-policy.zh.md`。
- 输出 Review Report 时，读取 `templates/review-report/template.md`。
- 打磨或评审 skill 设计时，读取 `references/skill-design/skill-design-playbook.zh.md`。

## 何时使用

- 用户要求 review、critique、audit 或 readiness。
- 已经有 spec、prototype、agent task、代码变更或 evidence packet。
- 已经有从 prototype artifact / Prototype Brief / screen flow 反向提取出的 spec，需要检查 gaps、mock boundary 和 verification provenance 是否保留。
- 用户需要评审高保真、可运行原型是否保留 source visual、rendered implementation、preview URL、screenshot、viewport/state 和 P0-P3 findings。
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
- 当评审高保真或可运行原型时，提供 visual target、artifact path、preview URL、screenshot path、viewport/state、source visual 和 rendered implementation。
- 当评审对象会产生、替代、废弃或清理项目资产时，提供 artifact index 或相关资产路径；如果没有，标记为 `not_available`，不要凭空推断。
- 当评审 `prototype_to_spec` 输出时，提供 source prototype、Prototype Brief、covered flows、states covered、gaps、verification 和提取后的 spec。

## 模式判断

- `contract_review`：检查 spec、agent task 或输出是否满足原始契约。
- `evidence_review`：检查测试、截图、日志、命令结果或 Evidence Packet 是否可信。
- `design_review`：检查 Design Brief、组件一致性、状态覆盖、响应式、mock/demo 标注。
- `prototype_design_evidence_review`：检查高保真或可运行原型是否保留 source visual、rendered implementation、preview URL、screenshot、viewport/state、design QA 和 P0-P3 findings。
- `prototype_to_spec_review`：检查 prototype-to-spec 输出是否保留 source provenance、prototype facts、prototype gaps、mock boundary、verification provenance 和 spec-first guard。
- `definition_drift_review`：检查实现、原型、agent 输出或文档是否偏离 Module Execution Pack、Change Contract、Branch State、Spec 或 Agent Task Packet，并输出 definition_sync_audit。
- `skill_quality_review`：检查 builder skill 或 skill patch 是否存在 no-op、sediment、sprawl、context_load、progressive_disclosure、completion_criterion 和 source_of_truth_boundary 问题。
- `agent_navigability_review`：检查 agent 是否能用当前 skill/template/schema/eval 顺利导航任务，尤其是复杂度分层、handoff、Branch State、review profile、usage metrics v2 是否可见且不过载。
- `release_readiness`：检查是否达到 Go/No-Go 或 release seal 条件。
- `not_reviewable`：缺少 review target、原始契约或证据，先要求补材料。

## Review Profile

```yaml
review_profile: quick_change_review | prototype_review | definition_drift_review | skill_quality_review | agent_navigability_review | release_readiness
profile_selection_rule:
  default: quick_change_review
  use_release_readiness_when:
    - version_or_install_surface_changes
    - publish_or_release_gate_requested
  use_definition_drift_review_when:
    - module_execution_pack_or_change_contract_exists
    - implementation_differs_from_contract
    - mode_switch_risk_exists
  use_prototype_review_when:
    - prototype_or_ui_evidence_exists
    - design_brief_or_visual_target_exists
  use_skill_quality_review_when:
    - skill_or_skill_pack_changed
    - skill_design_playbook_referenced
    - no_op_sediment_sprawl_or_context_load_risk_exists
  use_agent_navigability_review_when:
    - agent_failed_to_choose_right_next_step
    - runtime_or_installed_surface_changed
    - workflow_hygiene_or_usage_metrics_visibility_changed
profile_required_sections:
  quick_change_review:
    - review_mode
    - review_profile
    - review_target
    - contract_checked
    - findings
    - evidence_audit
    - risk_assessment
    - decision
    - required_fixes
    - unverified_areas
    - next_step
  prototype_review:
    - review_mode
    - review_profile
    - review_target
    - findings
    - evidence_audit
    - design_consistency_audit
    - product_logic_containment_audit
    - prototype_design_evidence_audit
    - prototype_to_spec_audit
    - decision
    - required_fixes
    - unverified_areas
    - next_step
  definition_drift_review:
    - review_mode
    - review_profile
    - review_target
    - findings
    - definition_drift_check
    - definition_sync_audit
    - mode_switch_assessment
    - branch_state_audit
    - decision
    - required_fixes
    - unverified_areas
    - next_step
  release_readiness:
    - review_mode
    - review_profile
    - review_target
    - findings
    - evidence_audit
    - branch_state_audit
    - artifact_hygiene_audit
    - artifact_index_update_proposal
    - risk_assessment
    - decision
    - required_fixes
    - unverified_areas
    - next_step
  skill_quality_review:
    - review_mode
    - review_profile
    - review_target
    - findings
    - skill_quality_audit
    - usage_metrics_v2
    - risk_assessment
    - decision
    - required_fixes
    - unverified_areas
    - next_step
  agent_navigability_review:
    - review_mode
    - review_profile
    - review_target
    - findings
    - agent_navigability_audit
    - usage_metrics_v2
    - risk_assessment
    - decision
    - required_fixes
    - unverified_areas
    - next_step
```

默认使用 `quick_change_review`，只输出轻量 required sections；不要展开全量 audit 框架。只在原型证据、definition drift、skill quality、agent navigability、release readiness、跨模块或高风险场景升级 profile。

Usage metrics v2 只在 `skill_quality_review`、`agent_navigability_review`、`release_readiness` 或用户明确要求审计输出时展示；quick review 不默认展示。

## 执行流程

1. 识别 review target 和原始契约。
2. 对照范围和验收标准检查完整性。
3. 应用相关门禁：Evidence Gate、Fake UI Gate、Product Logic Containment Gate、Design Consistency Gate、Fake Test Gate、Safety Gate。
4. 如果 review target 是高保真或可运行原型，检查 visual target、rendered implementation、viewport/state、screenshot evidence、design QA 和 P0-P3 findings。
5. 如果 review target 是 `prototype_to_spec` 输出，检查 source provenance、facts vs inference、prototype gaps、mock boundary、verification provenance 和 spec-first guard。
6. 如果 review target 涉及 Module Execution Pack、Change Contract、Branch State 或实现结果漂移，按 Definition Sync Loop 做 definition drift check。
7. 检查 Branch State 是否 stale；高保真原型、多轮 Goal、跨仓库、跨资产、上下文压缩风险或复杂业务系统任务缺少 Branch State 时，默认 `REQUEST_CHANGES` 或 `BLOCKED`。
8. 检查 `mode_switch_assessment`：任务是否从 improve 漂移成 reframe、从 prototype-first 漂移成 spec-first，或局部改动变成全局重塑。
9. 如果 review target 涉及项目资产、文档膨胀、清理动作、交付物替代或 source-of-truth 变更，按 Artifact Hygiene Loop 做一次轻量审计：检查生命周期状态、index 更新需要、清理风险和一致性风险。
10. 如果 review target 是 skill、skill patch、manifest、template、schema 或 eval，执行 `skill_quality_review` 或 `agent_navigability_review`，检查 no-op、sediment、sprawl、context_load、progressive_disclosure、completion_criterion 和 source_of_truth_boundary。
11. 按严重程度列出 findings 和 required action。
12. 给出 PASS、PARTIAL、BLOCKED、APPROVE 或 REQUEST_CHANGES。

## 输出契约

```yaml
review_mode:
review_profile:
profile_required_sections:
review_target:
contract_checked:
findings:
risk_assessment:
decision:
required_fixes:
unverified_areas:
cleanup_proposal:
next_step:

profile_specific_sections:
  evidence_audit:
  design_consistency_audit:
  product_logic_containment_audit:
  design_plan_audit:
  prototype_design_evidence_audit:
  prototype_to_spec_audit:
  definition_drift_check:
  definition_sync_audit:
  mode_switch_assessment:
    should_switch_mode:
  branch_state_audit:
  artifact_hygiene_audit:
  artifact_index_update_proposal:
  skill_quality_audit:
    no_op:
    sediment:
    sprawl:
    context_load:
    progressive_disclosure:
    completion_criterion:
    source_of_truth_boundary:
  agent_navigability_audit:
    route_clarity:
    artifact_lifecycle:
    installed_surface:
    profile_visibility:
    blocked_recovery:
  usage_metrics_v2:
    source_requirement_lines:
    response_output_lines:
    contract_output_lines:
    references_loaded_count:
    expected_files_touched:
    files_touched:
    files_outside_allowed_scope:
    implementation_rounds:
    review_rounds:
    branch_state_required:
    docs_updated:
```

## 质量门禁

- Findings 必须引用产物路径或可观察证据。
- 未检查证据前不要 approve。
- 区分产品问题和实现问题。
- 明确列出未验证区域。
- UI/prototype review 必须检查 Design Brief、组件一致性、状态覆盖、交互真实性、响应式和 mock/demo 标注。
- UI/prototype review 必须检查 Product Logic Containment Gate；发现业务规则说明侵入界面主体时，默认 `REQUEST_CHANGES`。
- 高保真原型 review 必须检查 Design Plan to Prototype Loop，包括 `design_plan`、`runnable_prototype`、`preview_or_run_command`、screenshot、Evidence Packet 和 `nudge_options`。
- 高保真 visual-target review 缺少 source visual、rendered implementation、preview URL、screenshot path 或 viewport/state 时，默认 `REQUEST_CHANGES` 或 `BLOCKED`。
- Prototype design evidence review 必须按 P0/P1/P2/P3 标注严重程度；P0/P1/P2 未解决时不能 `APPROVE`。
- Prototype-to-spec review 必须检查 `source_prototype`、`extracted_from_prototype`、`prototype_gaps`、`prototype_verification`、mock boundary 和 spec-first guard。
- Prototype-to-spec review 发现 gaps 被提升为 requirements、mock endpoint 被写成最终 API、route readiness 被夸大、或 verification provenance 丢失时，默认 `REQUEST_CHANGES` 或 `BLOCKED`。
- Definition drift review 必须区分 `Implementation Adjustment`、`Spec Gap`、`Requirement Change` 和 `Conflict / Contradiction`。
- Definition drift review 必须输出 `mode_switch_assessment`；发现应切换模式时不能直接 `APPROVE`。
- Review 阶段必须检查 Branch State 是否 stale；需要 Branch State 但缺失或过期时，默认 `REQUEST_CHANGES`。
- 发现实现扩大范围、违背 non-goals、或把实现结果自动升级为需求时，默认 `REQUEST_CHANGES`。
- 发现定义冲突或需要业务/安全/权限/数据/发布决策时，默认 `BLOCKED` 或转 `builder-decision`。
- 不要批准只有视觉上“像真的”、但缺少交互/状态证据的 UI 工作。
- 如果证据不足，决策必须是 PARTIAL、BLOCKED 或 REQUEST_CHANGES，不能用 APPROVE 掩盖。
- 只有交付物、项目输出、资产替代、release readiness 或 source-of-truth 变更相关评审必须输出 `artifact_hygiene_audit`；quick_change_review 默认不展开该字段。
- `skill_quality_review` 必须检查 no-op、sediment、sprawl、context_load、progressive_disclosure、completion_criterion 和 source_of_truth_boundary；发现只增加文字但不改变行为时默认 `REQUEST_CHANGES`。
- `agent_navigability_review` 必须检查 agent 是否能从当前 skill、template、schema、eval、manifest 和 installed surface 找到下一步；找不到时输出 required fixes。
- `usage_metrics_v2` 默认只在 skill quality、agent navigability、release readiness 或明确审计诉求中展示；不得让小任务 quick review 输出 metrics 噪音。
- `artifact_index_update_proposal` 只允许提出建议，不得声称已经更新 index，除非 evidence packet 中有可验证证据。
- 高风险清理只能进入 `cleanup_proposal`，不得在 review 中要求自动删除；涉及 `current`、`accepted`、`source_of_truth`、`decision_record` 或 evidence 的资产必须要求人工确认。

## 交接

交给负责修复问题的 skill；如果需要接受取舍，则交给 `builder-decision`。交接时保留 findings、required_fixes、unverified_areas、decision、next_step 和当前 review_profile 要求的 profile_specific_sections。

## 参考

- `kernel/gates/builder-quality-gates.zh.md`
- `kernel/gates/fake-ui-gate.zh.md`
- `kernel/gates/design-consistency-gate.zh.md`
- `kernel/gates/product-logic-containment-gate.zh.md`
- `kernel/gates/fake-test-gate.zh.md`
- `docs/delivery-kernel.md`
- `kernel/packets/evidence-packet.schema.md`
- `references/prototype-to-spec-review.zh.md`
- `references/prototype-design-evidence-review.zh.md`
- `references/prototype-to-spec.zh.md`
- `loops/recipes/artifact-hygiene.loop.md`
- `loops/recipes/design-plan-to-prototype.loop.md`
- `loops/recipes/definition-sync.loop.md`
- `memory/policies/artifact-consistency-policy.zh.md`
- `memory/policies/artifact-cleanup-policy.zh.md`
- `templates/review-report/template.md`
- `templates/definition-drift-check/template.md`
- `templates/design-brief/template.md`
- `references/ui-ux/`
- `evals/output-contract/builder-review.schema.json`
- `references/skill-design/skill-design-playbook.zh.md`
