# Visual Target 判断规则

## 目标

让 `builder-prototype` 区分“可以直接低保真表达的产品结构”和“必须有视觉目标才能声称高保真还原的原型”。这不是全局 `No Visual Target, No Build`，而是高保真视觉声明的证据边界。

## Visual Target 类型

- `none`：没有可用视觉来源。
- `brief_only`：只有文字 brief、Feature Frame、PRD 或自然语言方向。
- `source_image`：用户提供截图、设计稿、图片、Figma 导出或 ImageGen 选中图。
- `source_url`：用户提供可访问 URL，可通过浏览器截图作为视觉来源。
- `existing_code`：已有 app、Storybook、组件库或现有页面代码可作为视觉来源。
- `generated_option`：先生成并被用户选中的视觉方向。
- `not_required`：低保真 wireframe、screen flow、结构草图或 spec-first 降级交付不要求视觉目标。

## 判断规则

低保真可以从文字开始：

- wireframe、screen flow、信息架构、状态清单、最小可行原型计划不要求 source visual。
- 这类输出必须标记 `visual_target.type: not_required` 或 `brief_only`，并避免使用“高保真还原”“视觉一致”之类承诺。

高保真需要视觉目标：

- 高保真视觉还原、截图转代码、URL 克隆、design-system faithful prototype、redesign implementation 必须有 `source_image`、`source_url`、`existing_code` 或 `generated_option`。
- 只有文字 brief 时，不得直接声称完成高保真视觉目标；应降级为低保真/中保真，或输出 2-3 个视觉方向供用户选择。

PMS 和存量系统优先保边界：

- 即使有视觉目标，PMS、跨仓库、route readiness、mock boundary 或生产治理高风险场景仍按 `boundary_first`。
- visual target 只能证明界面参考，不能证明 API、权限、数据、审计或生产链路已确认。

## 缺失 visual target 的降级

当用户要求高保真但没有 visual target：

1. 如果目标低风险，输出 `degraded_prototype` 或 `prototype_brief`，并给 2-3 个视觉方向选项。
2. 如果目标是存量系统，先要求或定位 existing code / source URL / screenshot，并说明可先做 boundary-first 中保真 slice。
3. 如果目标涉及高风险工程边界，转 `spec_first`，只保留可视化范围和缺口。

## 输出要求

`visual_target` 至少说明：

```yaml
visual_target:
  type: none | brief_only | source_image | source_url | existing_code | generated_option | not_required
  source:
  required_for_build: true | false
  decision:
```

不要把文字 brief 写成 `source_image`，不要把用户未选择的视觉方向写成 `generated_option`。
