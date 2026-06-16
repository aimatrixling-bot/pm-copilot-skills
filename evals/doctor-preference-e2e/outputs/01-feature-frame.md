# Feature Frame（特性构想）：医生个性化推荐插件

## Problem -> Outcome（问题到结果）

前台当前需要记住并手动应用 11 位医生的 48+ 条个性化规则。预约时既要考虑服务、时间、地点、医生偏好，又要处理配额、手术组合和特殊例外，导致预约处理慢、推荐不稳定、新员工培训成本高。

目标结果：在预约流程中，前台输入服务、日期时间、地点、患者资料和指定医生后，系统在 2 秒内返回 1-3 位推荐医生、被阻塞医生和清晰原因，把预约处理时间从 5-10 分钟降到 1-2 分钟，同时尊重医生个性化约束。

## Magic Moment（关键体验瞬间）

前台选择 `SMILE`，并输入患者指定 `Dr Sin`。系统立刻提示：

> 推荐：Dr Kwok。Dr Sin 被阻塞，因为 Dr Sin 不接 SMILE；根据规则应安排 Dr Kwok。

真正的 Magic Moment 不是"AI 推荐医生"，而是"系统记住了新员工最容易漏掉的例外规则，并用诊所能理解的语言解释原因"。

## User Flow（用户流程）

1. 前台打开预约推荐面板，输入服务、日期时间、地点、患者年龄、新症/复诊、是否指定医生。
2. 系统读取医生服务标签、排班、个性化规则、配额/工作量和冲突规则。
3. 推荐引擎逐个评估医生：硬阻塞移除候选，软规则生成 warning，匹配项生成推荐理由。
4. 系统返回推荐医生、被阻塞医生、推荐原因和阻塞原因。
5. 前台选择推荐医生，或在冲突场景中走升级处理。
6. 系统记录请求、命中规则、最终选择、人工 override 原因和规则版本。

## Edge Cases（边界场景）

- 患者指定 Dr Sin 做 SMILE：Dr Sin 被阻塞，Dr Kwok 被推荐为替代医生。
- Dr Tang 周四中环手术不是 17:00：阻塞，除非时间为 17:00。
- Dr Ho 周六/公众假期前做 LASIK/CAT：阻塞，因为次日复诊不可保障。
- 医生配额已满：即使服务和时间匹配，也要阻塞。
- 没有合适医生：显示冲突原因和升级路径，不随机 fallback。

## Non-Goals（不做）

- MVP 不做机器学习自动优化。
- MVP 不做患者自助预约。
- MVP 不自动改排班或重平衡医生工作量。
- 不替代 Patient -> Appointment -> Check-in -> Visit 生命周期。

## Entity Map（实体映射）

| 实体 | 核心字段 | 用途 |
|---|---|---|
| Doctor | id, name, services, locations, active | 推荐候选医生 |
| DoctorRule | id, doctorId, type, condition, effect, severity, version | 配置化医生个性化规则 |
| RecommendationRequest | service, datetime, location, patientAge, visitType, preferredDoctor | 推荐请求契约 |
| RecommendationDecision | recommended, blocked, warnings, explanation, ruleVersion | 推荐输出契约 |
| RecommendationAudit | request, appliedRules, selectedDoctor, overrideReason | 推荐决策追溯 |
| DoctorQuota | doctorId, period, used, limit | 工作量/接收上限 |

## Screen Inventory（页面清单）

| 页面 | 优先级 | 核心交互 |
|---|---|---|
| 预约推荐面板 | P0 | 输入请求并查看推荐/阻塞原因 |
| 规则配置列表 | P0 | 按医生、规则类型、状态查看和搜索 |
| 规则编辑表单 | P0 | 新增/更新规则版本和生效时间 |
| 冲突升级视图 | P1 | 解释为什么没有安全推荐 |
| 审计日志视图 | P1 | 追溯推荐决策历史 |

## builder_readiness

`PARTIAL（部分通过）`。问题和 MVP 核心已经清楚，足以进入 PRD、原型和架构设计；但还不能直接生产实现，因为真实医生排班、服务代码、地点代码、配额政策和规则责任人仍需确认。

## goal_suitability

仅适合在 artifact / reference implementation 层面自驱执行，不适合直接自驱生产上线。

- objective: 为医生推荐插件创建可验证 MVP 规格和参考约束引擎
- scope: 配置化规则、推荐、解释、阻塞、配额检查、审计日志
- non_goals: 机器学习优化、患者自助预约、自动改排班
- verifiable_completion_criteria: P0 规则映射到测试；参考引擎通过确定性用例；发布门禁在缺少生产证据时保持 GO-WITH-RISKS 或 NO-GO
- stop_conditions: 缺少真实排班 schema、服务代码映射或生产集成批准时停止

## Output Packet

- **artifact_path**: `evals/doctor-preference-e2e/outputs/01-feature-frame.md`
- **artifact_type**: `feature_frame`
- **key_decisions**: Complex feature；Magic Moment 是可解释例外处理；MVP 排除 ML 和自助预约。
- **open_assumptions**: 真实排班 schema、公众假期日历和医生配额来源不在本 eval 中。
- **next_skill_hint**: `pm-prd`
- **handoff_context**: 这是围绕现有预约流程的推荐插件，不替代 Patient -> Appointment -> Check-in -> Visit。
- **builder_readiness**: PARTIAL
- **goal_suitability**: 仅限 artifact/reference implementation；生产集成需要业务确认。
