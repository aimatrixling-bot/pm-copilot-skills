# UI/UX Shared Contract

这个目录保存 AI Builder OS 的 UI/UX 共享设计契约。它不是独立显性 skill，而是 `builder-spec`、`builder-prototype`、`builder-agent-task`、`builder-review` 共同消费的设计输入。

## 使用方式

- `builder-spec`：在需求规格中引用或产出 Design Brief。
- `builder-prototype`：根据 Design Brief 产出原型，并覆盖核心状态和交互。
- `builder-agent-task`：把 Design Brief 和设计约束写进 Agent Task Packet。
- `builder-review`：用 Design Consistency Gate 审计输出是否一致、可用、可验证。

## 文件

- `design-principles.zh.md`：产品和界面设计原则。
- `component-guidelines.zh.md`：组件使用和一致性规则。
- `interaction-patterns.zh.md`：交互、状态、反馈和流程规则。
- `visual-style.zh.md`：视觉风格、排版、颜色、间距和响应式规则。
