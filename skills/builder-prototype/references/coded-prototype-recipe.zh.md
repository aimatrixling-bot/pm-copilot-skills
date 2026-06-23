# Coded Prototype Evidence Recipe

## 目标

让可运行原型不只停留在 `artifact_path`，而是能被 reviewer 复现、截图和判断。日常原型保持轻量，但凡声称 runnable 或 high fidelity，都必须留下最小运行证据。

## 最小可运行证据

`runnable_evidence` 至少包含：

```yaml
runnable_evidence:
  run_command:
  preview_url:
  screenshot_path:
  viewport:
  state:
  design_qa:
```

字段含义：

- `run_command`：如何运行或打开原型；单文件 HTML 可写 `open artifact_path`。
- `preview_url`：本地或部署 URL；如果没有服务，写 `not_applicable`。
- `screenshot_path`：截图证据路径；如果尚未截图，写 `not_captured` 并放入 `gaps` 或 `verification`。
- `viewport`：截图或人工检查使用的视口，例如 `desktop 1440x1024`、`mobile 390x844`。
- `state`：截图状态，例如 `default`、`empty`、`error`、`permission`。
- `design_qa`：`not_run`、`passed`、`blocked` 或 review artifact 路径。

## 执行步骤

1. 选择产物形态：单文件 HTML、小型 React/Vue、已有 app slice、prototype brief 或 wireframe。
2. 确认 visual target 和保真度。高保真视觉还原必须有 source visual；低保真不要求。
3. 生成或更新 artifact，并避免引入新依赖，除非目标仓库已有对应工具链。
4. 标注 mock/demo 数据、不可用交互、未接路由和未覆盖状态。
5. 如果环境允许，运行或打开原型，记录 `run_command`、`preview_url` 和截图路径。
6. 如果不能运行或截图，在 `runnable_evidence` 中写明 blocker，不要声称已验证。

## 高保真证据边界

- 有 source visual 时：检查 source visual、rendered implementation、viewport、state 和 screenshot。
- 没有 source visual 时：只能评审结构、状态和交互合理性，不得声称 faithful visual match。
- 有 Design Brief 但没有视觉目标时：Design Brief 是约束，不是视觉还原证据。

## 降级规则

- 不能运行：保留 artifact，`runnable_evidence.run_command` 写推荐命令，`preview_url` 写 `not_verified`。
- 不能截图：`screenshot_path: not_captured`，`verification` 写人工检查缺口。
- 不能访问 source visual：降级为 `degraded_prototype` 或 `prototype_brief`，列出需要的 source visual。

## 反模式

- 只写“可运行”但没有 run command、URL 或截图计划。
- 高保真原型没有 source visual，却声称视觉一致。
- 截图只有 happy path，未说明状态和 viewport。
- 把 mock-only 或 demo-only 行为写成生产链路。
