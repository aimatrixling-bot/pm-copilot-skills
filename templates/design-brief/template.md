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
- 如果交给 agent 实现，`acceptance_criteria` 和 `verification` 必须可执行。
