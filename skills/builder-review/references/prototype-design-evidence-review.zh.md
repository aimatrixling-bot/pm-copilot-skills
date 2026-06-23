# Prototype Design Evidence Review

用于 `builder-review` 的 `prototype_design_evidence_review` 或 UI/prototype `design_review`。目标是检查原型是否有足够视觉、运行和截图证据进入下一步，而不是只凭“看起来像真的”批准。

## 必查项

1. Visual target
   - 是否说明 `visual_target.type` 和 source。
   - 高保真视觉还原是否有 source image、URL capture、existing code 或已选中的 generated option。
   - 只有文字 brief 时，是否避免声称 faithful visual match。

2. Rendered implementation
   - 是否有 `artifact_path`。
   - runnable 原型是否有 `run_command` 或打开方式。
   - 本地或部署预览是否有 `preview_url`，或明确说明不适用。

3. Screenshot evidence
   - 是否保留 `screenshot_path`、viewport 和 state。
   - source visual 与实现截图是否代表同一 viewport、route、theme、content 和 interaction state。
   - 是否覆盖关键状态：default、empty、loading、error、disabled、permission 中与目标相关的状态。

4. Fidelity surfaces
   - 信息架构和页面层级。
   - 间距、布局节奏和响应式。
   - 颜色和视觉 token。
   - 字体、字号、字重、行高和文本截断。
   - 图像、图标、logo、非标准视觉资产。
   - copy/content 是否与设计目标或 Design Brief 一致。

5. Boundary honesty
   - mock/demo 数据是否标注。
   - route readiness 是否保持真实状态。
   - PMS 或存量系统是否保留 Target Truth / Active Demo / production gap。
   - 原型证据是否没有替代 API、权限、数据、审计或生产验证。

## Severity

- `P0`：核心任务不可用、严重可访问性失败、布局破坏或证据完全缺失。
- `P1`：主要视觉/交互不匹配，用户或评审人会明显感知。
- `P2`：中等视觉漂移、状态不一致、响应式问题或可修复 polish gap。
- `P3`：不阻塞接受的轻微优化。

## 输出建议

```yaml
prototype_design_evidence_audit:
  visual_target: pass | partial | fail | not_applicable
  rendered_implementation: pass | partial | fail | not_applicable
  screenshot_evidence: pass | partial | fail | not_applicable
  fidelity_surfaces: pass | partial | fail | not_applicable
  boundary_honesty: pass | partial | fail | not_applicable
  p0_p2_findings:
  p3_followups:
  decision_driver:
```

## 决策规则

- 缺少 high-fidelity source visual，却声称视觉还原：`REQUEST_CHANGES`。
- runnable 原型没有 run command 或 screenshot plan：至少 `PARTIAL`。
- P0/P1/P2 未修复：`REQUEST_CHANGES` 或 `BLOCKED`。
- 只有 P3 polish：可以 `PASS`，但必须列入 follow-up。
- PMS boundary、mock boundary 或 route readiness 被夸大：`REQUEST_CHANGES`。
