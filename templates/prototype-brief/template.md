# Prototype Brief 模板

```yaml
prototype_mode: wireframe | high_fidelity_prototype | prototype_brief | not_ready_for_prototype
prototype_type:
artifact_path:
mapping_path:
design_brief_path:
design_plan:
  page_goal:
  first_view_hierarchy:
  layout_strategy:
  component_strategy:
  state_strategy:
  responsive_strategy:
  data_strategy:
  rule_notes_strategy:
core_flows:
states_covered:
component_usage:
interaction_requirements:
responsive_requirements:
design_decisions:
demo_data_notes:
runnable_prototype:
  status: runnable | static | not_available
  reason:
preview_or_run_command:
ui_content_boundary:
  interface_content:
  non_interface_content:
  user_visible_rule_exceptions:
business_rule_notes:
  placement: below_interface | side_panel | linked_doc | not_applicable
  content:
  source:
rule_notes_placement: below_interface | side_panel | linked_doc | not_applicable
non_ui_explanations:
  - topic:
    target_audience:
    placement:
evidence_packet:
verification:
nudge_options:
  density:
  layout:
  component_variants:
  content_hierarchy:
  rule_notes_placement:
quality_gates:
  product_logic_containment_gate:
  design_consistency_gate:
  fake_ui_gate:
next_skill_hint:
```

## 使用规则

- 低保真优先用于信息架构、流程和范围验证。
- 高保真或可交互原型必须说明可运行方式、mock/demo 数据和不可用交互。
- 缺少 Design Brief 时，先补 Design Brief 或在本 brief 中明确设计假设。
- 高保真或可运行原型必须先给出 `design_plan`，不要从模糊需求直接跳到页面代码。
- 业务规则说明必须进入 `业务规则说明（非界面内容）` 或等价独立区域，不能混入界面主体。
- 任何交给 `builder-agent-task` 的 prototype brief 都必须包含验收和验证方式。
