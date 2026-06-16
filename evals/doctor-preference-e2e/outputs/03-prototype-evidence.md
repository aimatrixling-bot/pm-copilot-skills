# Prototype Evidence（原型证据）：医生推荐面板

## Artifact（产物）

- 原型文件：`evals/doctor-preference-e2e/artifacts/prototype/doctor-preference-prototype.html`
- 保真度：低到中保真交互原型，用于 smoke 验证，不是生产 UI。

## Screen Mapping（页面映射）

| PRD 项 | 原型元素 | 状态 |
|---|---|---|
| P0-1 规则评估 | 请求表单 + 推荐结果面板 | 已覆盖 |
| P0-2 可解释推荐 | 推荐/阻塞医生卡片及原因 | 已覆盖 |
| P0-4 配额/工作量 | 配额满 checkbox 和阻塞原因 | 已覆盖 |
| P0-5 审计证据 | 审计预览面板 | 作为 UI preview 覆盖，未持久化 |

## Interaction smoke（交互冒烟）

1. 打开原型。
2. 选择服务 `SMILE`。
3. 指定医生 `Dr Sin`。
4. 点击"生成推荐"。
5. 预期：Dr Kwok 出现在推荐列表；Dr Sin 出现在阻塞列表，原因是"Dr Sin 不接 SMILE"。
6. 检查审计预览包含请求字段和命中规则文本。

## Fake UI Check（假交互检查）

| 元素 | 行为 | 结果 |
|---|---|---|
| 生成推荐按钮 | 运行本地确定性推荐函数 | PASS（通过） |
| 重置按钮 | 重置请求字段并清空结果 | PASS（通过） |
| 指定医生选择器 | 影响推荐和阻塞原因 | PASS（通过） |
| 配额满 checkbox | 模拟 Dr Ho 配额满并触发阻塞 | PASS（通过） |
| 审计预览 | 推荐后更新 | PASS（通过），但只是非持久化 preview |

## Evidence Packet（证据包）

| 证据类型 | 证据 |
|---|---|
| Artifacts | `artifacts/prototype/doctor-preference-prototype.html` |
| Interaction smoke | SMILE + Dr Sin -> 推荐 Dr Kwok；Dr Sin 被阻塞 |
| Mapping evidence | P0-1/P0-2/P0-4/P0-5 映射见上表 |
| Open risks | 未捕获真实浏览器截图；没有生产持久化；视觉不是最终设计系统 |
| Completion claim | PARTIAL（部分通过）：原型证明流程和 fake-UI gate，但不代表生产 UI |

## Sensor Gates

| Sensor | 结果 |
|---|---|
| Fake UI | PASS（通过），在原型范围内 |
| Spec Coverage | PASS（通过），覆盖 MVP smoke path |
| Accessibility | PARTIAL（部分通过）；包含语义 HTML，但未跑完整 WCAG/browser 检查 |
| Visual Consistency | PARTIAL（部分通过）；采用诊所工作流风格，但不是最终设计系统 |

## Output Packet

- **artifact_path**: `evals/doctor-preference-e2e/artifacts/prototype/doctor-preference-prototype.html`
- **artifact_type**: `prototype`
- **key_decisions**: 使用解释卡片、显示被阻塞替代项、包含审计预览。
- **open_assumptions**: 本 eval 未取得最终 ClarityMedic UI system。
- **next_skill_hint**: `pm-code-architect`
- **handoff_context**: 原型应反哺 request/response API 和 audit model。
- **evidence_packet**: 见 Evidence Packet 表格
- **sensor_gates**: Fake UI PASS；Accessibility PARTIAL；Visual Consistency PARTIAL
