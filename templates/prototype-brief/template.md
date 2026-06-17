# Prototype Brief 模板

```yaml
prototype_mode: wireframe | high_fidelity_prototype | prototype_brief | not_ready_for_prototype
prototype_type:
artifact_path:
mapping_path:
design_brief_path:
core_flows:
states_covered:
component_usage:
interaction_requirements:
responsive_requirements:
design_decisions:
demo_data_notes:
evidence_packet:
verification:
next_skill_hint:
```

## 使用规则

- 低保真优先用于信息架构、流程和范围验证。
- 高保真或可交互原型必须说明可运行方式、mock/demo 数据和不可用交互。
- 缺少 Design Brief 时，先补 Design Brief 或在本 brief 中明确设计假设。
- 任何交给 `builder-agent-task` 的 prototype brief 都必须包含验收和验证方式。
