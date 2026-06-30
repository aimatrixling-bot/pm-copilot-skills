# Skill Hardening Brief Template

Skill Hardening Brief 用于把一个待打磨的 builder skill，从模糊改进愿望转成可执行、可验证、可交接的改造计划。

```yaml
artifact_type: skill_hardening_brief
skill_name:
current_role:
target_role:
primary_artifact:
target_users:
source_baseline:
  current_skill_path:
  reference_skills:
  current_gaps:
baseline_failure_scenarios:
  - scenario:
    expected_failure_without_hardening:
    observed_or_expected_rationalization:
red_phase:
  pressure_prompts:
  failure_signals:
green_phase:
  intended_behavior_change:
  contract_or_validator_change:
refactor_phase:
  no_op_removed:
  context_load_reduced:
trigger_conditions:
  explicit:
  implicit:
  adjacent_skill_boundaries:
non_trigger_conditions:
mode_decision:
  modes:
  decision_order:
  ask_first_conditions:
resource_map:
  skill_md:
  references:
  templates:
  assets:
  scripts:
output_contract:
  required_fields:
  optional_fields:
  handoff_fields:
quality_gates:
red_flags:
anti_evasion_rules:
handoff_targets:
anti_patterns:
examples:
validator_eval_plan:
  output_contract_schema:
  trigger_cases:
  routing_cases:
  quality_rubric:
  deterministic_validator:
installation_resources:
  source_files:
  installed_relative_resources:
  package_files:
done_when:
verification:
open_questions:
```

## 使用规则

- 每次只为一个 skill 或一个明确 skill cluster 填写。
- `SKILL.md` 只写执行骨架；详细规则、示例和反模式放 references。
- 如果 `open_questions` 会改变 skill 边界，先不要执行 hardening。
- `baseline_failure_scenarios` 必须描述没有 hardening 时 agent 可能怎样失败或合理化；没有可观察失败场景时，不要只为了“更完整”改 skill。
- `red_phase` 记录压力输入和失败信号；`green_phase` 记录要改变的行为、契约或 validator；`refactor_phase` 记录移除 no-op、沉积规则或上下文负担。
- `anti_evasion_rules` 必须针对具体规避说法或失败路径，不能只写“更严格”“更高质量”。
- `validator_eval_plan` 至少要包含 output contract、trigger/routing case 或 quality rubric 中的一类。
- `installation_resources` 必须说明安装后相对引用是否仍可用。
