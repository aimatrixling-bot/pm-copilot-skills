# Prototype Brief 模板

```yaml
prototype_mode: prototype_first | boundary_first | spec_first | runnable_prototype | wireframe | prototype_brief | degraded_prototype
artifact_path:
fidelity: low | medium | high | not_applicable
covered_flows:
states_covered:
gaps:
verification:
next: builder-review | builder-agent-task | builder-spec | builder-frame | iterate | ask_user
```

## 使用规则

- 先判断 `prototype_first`、`boundary_first` 或 `spec_first`，再决定是可运行原型、低保真线框图还是 brief。
- 低风险界面和流程评审优先交付可看的 artifact；不要只写原型说明。
- PMS、存量复杂系统、mock boundary、route readiness 或生产治理高风险场景使用 `boundary_first`，必须说明 Target Truth、Active Demo、mock honesty 和未覆盖能力。
- 后端、权限、数据、API、工程交付和高风险业务规则变更使用 `spec_first`，先交给 `builder-spec` 补齐最小规格和验收。
- 信息不足时输出 `degraded_prototype`：低保真结构、最小可行原型计划、缺口清单和最多 3 个高价值问题。
- 高保真或可运行原型必须说明运行/预览方式、mock/demo 数据、不可用交互和未覆盖状态。
- 业务规则说明必须进入 `业务规则说明（非界面内容）` 或等价独立区域，不能混入界面主体。
- 任何交给 `builder-agent-task` 或 `builder-review` 的 brief 都必须包含验证方式。
