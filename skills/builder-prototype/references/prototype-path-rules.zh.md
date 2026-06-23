# Builder Prototype 路径判断规则

## 目标

让 `builder-prototype` 先判断交付路径，再决定产物形态。核心原则是：能做原型时直接做；边界高风险时先收窄；规格缺失且风险高时交给 spec；信息不足时降级交付，不让用户空手而归。

## 判断顺序

1. 先看风险边界，而不是先看用户是否说了“原型”。
2. 再看是否有足够的用户、流程、状态、数据和验证信息。
3. 最后决定保真度和 artifact 形态。

## prototype_first

适用：

- 新想法、页面流程、信息架构、低风险概念验证。
- 用户目标是评审体验、布局、状态、动线或交互。
- 业务规则、权限、生产数据和 API 边界不会因为原型误导工程交付。

交付：

- 优先给可看的 artifact：低保真 wireframe、单文件 HTML 原型、轻量 React/Vue 原型或 screen flow。
- 覆盖主流程、默认状态、空态、错误态或禁用态中的关键状态。
- 用 `gaps` 标出未覆盖的状态、数据和交互。

## boundary_first

适用：

- PMS、存量复杂系统、跨仓库、跨模块、route readiness、mock boundary、生产/治理边界高风险。
- 用户需要 active demo，但真实业务规则、数据来源或路由状态不能被 UI 原型混淆。
- 原型必须区分 Target Truth、Active Demo、mock/demo 数据和未实现能力。

交付：

- 先写清楚可做的窄 slice：目标页面、route readiness、mock honesty、状态覆盖和不能承诺的生产能力。
- 可以给低保真或高保真原型，但必须把业务规则说明放到非界面内容区。
- `verification` 必须包含人工检查、截图、浏览器检查或后续 review 要点。

## spec_first

适用：

- 请求主体是后端、权限、数据模型、API、审计、生产迁移或高风险业务规则。
- 没有最小验收标准、验证方式或业务边界。
- 做页面原型会让用户误以为工程规则已经确认。

交付：

- 不输出假完整原型。
- 输出可视化范围、规格缺口、最多 3 个澄清问题和 `builder-spec` 下一步输入。
- 如仍有 UI 价值，可给最低保真结构草图，但标记为 `degraded_prototype`。

## Visual Target 边界

- 低保真 wireframe、screen flow、信息架构和概念探索不强制 visual target；可标记 `visual_target.type: brief_only` 或 `not_required`。
- 高保真视觉还原、截图转代码、URL 克隆、design-system faithful prototype 和 redesign implementation 必须有 `source_image`、`source_url`、`existing_code` 或用户选中的 `generated_option`。
- 只有文字 brief 时，不能输出“faithful high-fidelity match”；应降级为中/低保真、给视觉方向选项，或要求用户补 source visual。
- visual target 只能证明视觉参考来源，不能证明业务规则、权限、API、数据模型或生产 route readiness。
## 降级交付阶梯

信息不足时按以下顺序降级：

1. 低保真页面结构或 screen flow。
2. 最小可行原型计划：页面、主流程、状态、mock 数据、验证方式。
3. 缺口清单：用户、流程、状态、数据、权限、路由、验收。
4. 最多 3 个高价值问题，只问会改变原型形态或风险边界的问题。

不要输出空白拒绝，也不要只说“请先补充信息”。

## 质量边界

- `prototype_first` 不是全局默认。PMS 和存量复杂系统优先检查 `boundary_first`。
- `boundary_first` 不是拖延做原型，而是把原型限定在真实边界内。
- `spec_first` 不是拒绝交付，而是保护高风险工程和业务规则不要被 UI 假象覆盖。
- review、Evidence Packet、artifact governance 和 handoff 能力保留，但日常原型输出只保留核心字段。
