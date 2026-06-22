# Design Consistency Gate

Design Consistency Gate 用于审计 spec、prototype、agent task 或 UI 实现是否遵守同一份 Design Brief 和既有项目设计约定。

## 检查项

| 检查项 | 问题 | 失败处理 |
| --- | --- | --- |
| Design Brief | 是否存在或明确引用 Design Brief？ | 补 Design Brief 或标记为未就绪 |
| 信息层级 | 主内容、次内容、主操作是否清楚？ | 调整 IA 或回到 spec |
| 组件一致性 | 是否复用现有组件和变体？ | 改用现有组件或说明新增理由 |
| 状态覆盖 | default/loading/empty/error/success/disabled/permission 是否按需覆盖？ | 补状态或明确延后原因 |
| 交互真实性 | 按钮、导航、表单是否真实可用或诚实标注 demo？ | 修复交互或降级为 mock |
| 响应式 | 桌面/移动端是否不遮挡关键内容和操作？ | 补响应式策略或截图检查 |
| 可访问性 | 标签、对比度、焦点、错误提示是否满足基础可用性？ | 标记 review 点或补充约束 |
| 数据诚实性 | mock/demo 数据是否清楚标注？ | 标注数据来源或降级完成声明 |
| 产品逻辑隔离 | 业务规则说明是否进入独立的非界面区域，而不是侵入界面主体？ | 应用 Product Logic Containment Gate，移动到 `业务规则说明（非界面内容）` |

## 使用场景

- `builder-spec`：检查规格是否足以支持 UI/UX 输出。
- `builder-prototype`：检查原型是否覆盖关键状态和交互。
- `builder-agent-task`：检查任务包是否把设计约束传给 agent。
- `builder-review`：检查输出是否可以进入下一阶段。

## 失败处理

- 如果只是轻微缺口，补充 Design Brief 或 acceptance criteria。
- 如果缺口影响用户理解或验收，降级为 `PARTIAL`。
- 如果缺口涉及 fake UI、权限误导、生产数据伪装或危险操作，标记为 `BLOCKED` 或请求人工 review。
- 如果非界面业务说明混入界面主体，默认请求调整；只有真实面向用户的帮助内容可以保留在界面中。
