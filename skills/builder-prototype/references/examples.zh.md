# Builder Prototype 示例与反模式

## 示例 1：prototype_first 低风险界面原型

输入：

> 做一个新品上市流程工作台原型，先让老板看主流程和空状态。

推荐输出：

```yaml
prototype_mode: prototype_first
artifact_path: prototypes/product-launch-workbench/index.html
fidelity: low
covered_flows:
  - 新建上市计划
  - 查看任务分组
  - 空状态引导
states_covered:
  - default
  - empty
  - disabled
gaps:
  - 未覆盖审批失败和权限不足状态
  - mock 数据未连接真实系统
verification:
  - 浏览器打开 artifact，检查主流程、空态和按钮禁用态
next: iterate
```

要点：先给可看的东西，再暴露缺口。

## 示例 2：boundary_first PMS 原型

输入：

> 基于 PMS 领域模型生成可运行高保真原型，业务规则可以补充说明，但不能写进页面主体。

推荐输出：

```yaml
prototype_mode: boundary_first
artifact_path: prototypes/pms/visit-workbench/index.html
fidelity: high
covered_flows:
  - Visit 工作台主视图
  - mock 患者列表切换
states_covered:
  - default
  - empty
  - error
gaps:
  - route readiness 仅为 demo，不代表生产路由已接入
  - 业务规则说明放在界面下方非界面内容区
  - 未验证真实 Customer/Patient/Visit 写入链路
verification:
  - 运行本地预览并截图
  - 用 Product Logic Containment Gate 检查业务规则没有侵入界面主体
next: builder-review
```

要点：先保边界诚实，再做窄 slice。

## 示例 3：spec_first 高风险工程/API 变更

输入：

> 做一个权限管理原型，顺便把角色 API、数据库表和审计逻辑都设计好。

推荐输出：

```yaml
prototype_mode: spec_first
artifact_path: not_applicable
fidelity: not_applicable
covered_flows:
  - 权限管理页面可视化范围待定
states_covered:
  - permission
gaps:
  - 缺少角色模型、权限矩阵、审计要求和 API 验收标准
  - 缺少失败路径和回滚策略
verification:
  - 先由 builder-spec 生成最小规格、验收标准和验证计划
next: builder-spec
```

要点：不要用 UI 假象替代权限、数据和审计规格。

## 示例 4：degraded_prototype 信息不足

输入：

> 帮我做一个客户管理页面原型。

推荐输出：

```yaml
prototype_mode: degraded_prototype
artifact_path: prototypes/customer-management/wireframe.md
fidelity: low
covered_flows:
  - 客户列表
  - 客户详情占位
states_covered:
  - default
  - empty
gaps:
  - 未确认目标用户和核心任务
  - 未确认客户字段、搜索筛选和权限
  - 未确认是否需要创建/编辑流程
verification:
  - 人工评审信息架构是否覆盖主要任务
next: ask_user
```

高价值问题最多 3 个：

1. 这个页面的主要用户是谁？
2. 最核心的 1 个任务是查看、创建、编辑还是跟进？
3. 是否涉及权限或敏感数据？

## 反模式

- 只输出 `not_ready_for_prototype`，没有低保真产物、缺口或下一步。
- 所有场景都走 `Frame -> Prototype -> Spec`，忽略高风险工程和 PMS boundary。
- 把业务规则、领域解释、验收标准塞进界面主体。
- 输出 20+ 字段但没有可看的 artifact、状态覆盖或验证方式。
- active skill 指向不存在的 legacy runtime references。
