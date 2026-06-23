# Prototype Brief

```yaml
prototype_mode: prototype_first | boundary_first | spec_first | runnable_prototype | wireframe | prototype_brief | degraded_prototype
visual_target:
  type: none | brief_only | source_image | source_url | existing_code | generated_option | not_required
  source:
  required_for_fidelity: true | false
  decision:
artifact_path:
fidelity: low | medium | high | not_applicable
covered_flows:
states_covered:
gaps:
runnable_evidence:
  run_command:
  preview_url:
  screenshot_path:
  viewport:
  state:
  design_qa: not_run | passed | blocked | not_applicable
verification:
next: builder-review | builder-agent-task | builder-spec | builder-frame | iterate | ask_user
```

## Purpose

- 原型要帮助谁做什么决策。
- 当前选择 `prototype_first`、`boundary_first` 或 `spec_first` 的原因。
- 保真度目标，以及是否需要 visual target。

## Visual Target

- `brief_only` / `not_required`：只适用于低保真、流程草图、信息架构或概念探索。
- `source_image` / `source_url` / `existing_code` / `generated_option`：适用于高保真视觉还原、设计稿转代码或 faithful redesign。
- 如果请求高保真但缺少 source visual，降级为中/低保真或提出最多 3 个高价值问题，不得声称已完成视觉一致性。

## Screens And Flows

- 主要页面 / 区块。
- 关键用户路径。
- 每个路径覆盖的状态。

## Interaction And State Coverage

- default / loading / empty / error / success / permission / disabled 等状态。
- 已实现、只规划、或刻意不覆盖的状态。

## Data And Mock Boundary

- 使用真实数据、mock 数据、demo 数据还是占位数据。
- PMS 或存量复杂系统必须标注 Target Truth、Active Demo、route readiness 和 mock honesty。
- 不要把视觉原型中的字段、权限或流程误升为生产业务规则。
- 复杂业务规则、权限矩阵、审计逻辑或生产约束必须放入 业务规则说明（非界面内容），不得侵入界面主体。

## Runnable Evidence

- `artifact_path`：原型文件、页面路径或 brief 路径。
- `run_command`：如何运行或打开。
- `preview_url`：实际预览地址；未运行时写 `not_verified`。
- `screenshot_path`：截图证据路径；未截图时写 blocker。
- `viewport` / `state`：截图对应的视口和状态。
- `design_qa`：`not_run`、`passed`、`blocked` 或 `not_applicable`。

## Gaps And Questions

- 未覆盖流程、状态、视觉证据、真实数据、权限、API、路由或生产边界。
- 最多 3 个高价值澄清问题。

## Verification

- 已完成的人工检查、截图检查、浏览器检查或代码运行检查。
- 未验证内容必须显式写入 `gaps` 或 `verification`。
- 需要正式评审时交给 `builder-review`，需要反向沉淀规格时交给 `builder-spec`。