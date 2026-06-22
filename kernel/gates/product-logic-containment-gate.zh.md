# Product Logic Containment Gate

Product Logic Containment Gate 用于防止业务规则说明、领域模型解释和工程交接说明直接侵入产品界面。

## 核心原则

界面本体应该像真实产品一样服务用户任务。业务规则可以被解释，但非用户界面内容必须进入明显隔离区域，不能混在页面主体、卡片、表单、表格或操作区里。

## 允许出现在界面本体的内容

- 用户可见的字段名、按钮、导航、筛选、状态和操作。
- 用户需要理解的空态、错误态、权限态、校验提示和成功反馈。
- 用户做决定时必须看到的状态原因、限制原因或下一步动作。
- 产品中真实存在的说明组件，例如帮助抽屉、规则提示、详情页说明；但必须在 Design Brief 中说明它是产品功能，而不是评审备注。

## 必须移出界面本体的内容

- 计算公式、审批规则、权限矩阵、状态机、领域模型映射。
- 后端字段、接口说明、数据库、埋点、测试说明。
- 仅供 PM、设计、工程或评审人员理解的业务补充。
- demo/mock 数据来源、原型限制、未实现交互说明。
- “为什么这样设计”的分析性文字，除非它是产品中真实存在的用户帮助内容。

## 推荐呈现方式

默认在原型或页面预览下方使用独立区域：

```text
业务规则说明（非界面内容）
```

该区域应与界面本体有清楚视觉区隔，并标明它不是产品界面内容。可选位置：

- `below_interface`：默认选择，放在界面预览下方。
- `side_panel`：仅当评审工具或原型容器支持独立侧栏时使用。
- `linked_doc`：规则很长或属于 durable artifact 时，链接到 spec、Design Brief 或业务规则文档。
- `not_applicable`：当前产物不涉及非界面业务说明。

## 输出字段

```yaml
ui_content_boundary:
  interface_content:
  non_interface_content:
  user_visible_rule_exceptions:
business_rule_notes:
  placement: below_interface | side_panel | linked_doc | not_applicable
  content:
  source:
rule_notes_placement: below_interface | side_panel | linked_doc | not_applicable
non_ui_explanations:
  - topic:
    target_audience:
    placement:
```

## 失败处理

| 情况 | 处理 |
| --- | --- |
| 业务说明混入页面主体，但不影响用户任务理解 | `PARTIAL` 或 `REQUEST_CHANGES` |
| 规则说明让原型不像真实产品界面 | `REQUEST_CHANGES` |
| 权限、数据、状态或操作被说明文字掩盖或误导 | `BLOCKED` |
| 无法判断哪些说明是用户可见内容 | 回退 Design Brief 或要求补 `ui_content_boundary` |

## 适用 skill

- `builder-spec`：UI-facing spec 必须说明界面内容边界。
- `builder-prototype`：prototype brief 和高保真原型必须隔离非界面说明。
- `builder-agent-task`：任务包必须把隔离要求传给下游 agent。
- `builder-review`：UI/prototype review 必须审计业务说明是否侵入界面。

