# Design Brief Template

Design Brief 是 AI Builder OS 中连接 spec、prototype、agent task 和 review 的 UI/UX 设计契约。

```yaml
artifact_type: design_brief
title:
source_context:
  project:
  upstream_artifact:
  target_surface:
users:
  primary:
  secondary:
task_context:
  user_goal:
  business_goal:
  scenario:
information_architecture:
  primary_content:
  secondary_content:
  navigation:
  hierarchy_notes:
flows:
  primary_flow:
  alternate_flows:
components:
  existing_components:
  new_components:
  component_constraints:
interaction_requirements:
  primary_actions:
  secondary_actions:
  feedback:
  destructive_actions:
states:
  default:
  loading:
  empty:
  error:
  success:
  disabled:
  permission:
responsive_requirements:
  desktop:
  tablet:
  mobile:
accessibility_notes:
visual_style:
  typography:
  color_semantics:
  spacing:
  density:
data_notes:
  real_data:
  mock_data:
  demo_limitations:
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
acceptance_criteria:
verification:
  automated_checks:
  manual_checks:
  screenshot_or_browser_checks:
open_questions:
handoff_targets:
```

## 使用规则

- 如果已有项目组件或风格，Design Brief 必须优先引用它。
- 如果使用 mock/demo 数据，必须在 `data_notes` 中标注。
- 如果某个状态暂不覆盖，必须说明原因。
- 业务规则、权限矩阵、计算逻辑、状态机、接口或评审说明不得写进界面主体；默认写入 `业务规则说明（非界面内容）`。
- 如果业务规则说明确实是用户可见功能，必须在 `ui_content_boundary.user_visible_rule_exceptions` 中说明。
- 如果交给 agent 实现，`acceptance_criteria` 和 `verification` 必须可执行。
