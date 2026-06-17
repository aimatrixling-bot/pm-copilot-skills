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
- `validator_eval_plan` 至少要包含 output contract、trigger/routing case 或 quality rubric 中的一类。
- `installation_resources` 必须说明安装后相对引用是否仍可用。
