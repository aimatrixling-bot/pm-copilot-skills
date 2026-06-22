# Prototype Quality + Product Logic Containment Hardening Brief

## Objective

强化 AI Builder OS 在产品经理高保真原型场景下的输出质量：既能把业务逻辑、领域规则和状态边界表达清楚，又不让这些说明直接侵入界面本身。

## Background

近期 PMS-Dev-AIFirst 等项目暴露出两个问题：

- 业务规则说明直接写进页面主体，导致原型看起来不像真实产品界面。
- 已有 Design Brief、Design Consistency Gate 和 Builder 流程，但还不足以稳定产出可运行、可评审、可复用的高保真原型。

Qoder/QoderWork 的实践给 AI Builder OS 的启发不是新增一个庞大流程，而是把现有 builder skills 的协同质量做硬化：

- 先形成 Design Plan，再进入可运行原型生成。
- 使用类似 Nudge 的迭代入口调密度、层级、组件策略和内容组织。
- 让业务专家把判断标准、岗位流程和质量要求封装成可复用规则。
- 把原型、前端代码、Release Note、用户指南和 Review Evidence 视为同一条交付链，而不是彼此割裂的文件。

参考：

- [QoderWork Design](https://docs.qoder.com/zh/qoderwork/design)
- [QoderWork Expert Kits](https://docs.qoder.com/zh/qoderwork/expert-kits)

## Non Goals

- 不新增第 9 个核心 builder skill。
- 不重构 AI Builder OS 的核心目录结构。
- 不把 PMS 专属规则写进通用 builder skill。
- 不要求所有原型一次性达到生产代码质量。

## Minimal Implementation

1. 新增 `Product Logic Containment Gate`。
2. 新增 `Design Plan to Prototype Loop`。
3. 强化 `builder-spec`、`builder-prototype`、`builder-agent-task`、`builder-review`。
4. 更新 Design Brief、Prototype Brief、Agent Task Packet 模板和输出契约。
5. 更新 routing / trigger eval 与 `validate-builder-os.js`，把这次约束纳入自动验证。

## Product Logic Containment Rule

界面本体只放用户真正会看到、理解和操作的内容：

- 标签、按钮、导航、字段名。
- 用户可见的帮助文字、空态、错误态、权限态、成功态。
- 必须呈现给用户的业务状态、状态原因、可操作限制。

非界面解释必须进入明显隔离区域：

- 计算规则、审批规则、权限矩阵、状态机说明。
- demo/mock 数据说明。
- 领域模型映射、后端字段、接口约束。
- 仅用于评审或工程交接的业务补充。

默认隔离区域标题为：

```text
业务规则说明（非界面内容）
```

默认放在界面预览或页面原型下方。只有当产品本身确实需要规则侧栏、帮助中心或说明抽屉时，才允许以界面组件形式呈现。

## Design Plan to Prototype Rule

高保真或可运行原型不应直接从一句需求跳到页面代码。`builder-prototype` 必须先输出或读取 `design_plan`，至少包含：

- 页面目标和首屏信息层级。
- 组件策略和既有设计系统复用策略。
- 核心流程和状态覆盖。
- 响应式策略。
- mock/demo 数据边界。
- 业务规则说明放置方式。
- 可调参数：密度、布局、组件变体、内容层级、状态呈现。

当输入缺少 frame/spec/Design Brief 时，仍应回退上游，不应生成看似完整但不可验收的原型。

## Expected Behavior Changes

- UI-facing spec 会显式输出 `ui_content_boundary`、`business_rule_notes`、`rule_notes_placement` 和 `non_ui_explanations`。
- 高保真 prototype 会显式输出 `design_plan`、`runnable_prototype`、`preview_or_run_command`、`business_rule_notes`、`nudge_options` 和 Evidence Packet。
- Agent Task Packet 会把产品逻辑隔离要求传给下游 coding agent。
- Review 会新增 `product_logic_containment_audit`，发现业务说明侵入界面时默认 `REQUEST_CHANGES`。

## Acceptance

- `npm run validate:builder-os` 通过。
- `npm run validate:trigger-descriptions` 通过。
- `npm run validate:package-surface` 通过。
- `npm run validate:codex-install` 在重新安装后通过。
- Codex 安装态 skill 文件包含新增 gate、loop 和输出字段。

