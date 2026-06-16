# PRD Handoff（PRD 交接）：医生个性化推荐插件 MVP

## TL;DR

前台需要一个配置化医生推荐插件，在预约时自动应用医生个性化规则。MVP 应能推荐 1-3 位医生，解释推荐和阻塞原因，支持规则配置，并记录审计证据。成功标准是预约更快、错误推荐更少、规则变更无需改代码。

## P0 Requirements（P0 需求）

| ID | 需求 | 验收标准 | 证据 |
|---|---|---|---|
| P0-1 | 评估医生个性化规则 | Given 服务/时间/地点/患者资料，When 提交推荐请求，Then 被阻塞医生包含准确规则原因 | Dr Sin / Dr Tang / Dr Ho / Dr Leung / quota 单元测试 |
| P0-2 | 返回可解释推荐 | Given 存在合格医生，When 推荐运行，Then 每个推荐都有 reasons 和 warnings | 参考引擎输出 + 原型 smoke |
| P0-3 | 支持配置化规则模型 | Given 医生规则变更，When 新版本生效，Then 决策引用规则版本 | 架构数据模型 + 后续集成测试 |
| P0-4 | 跟踪配额/工作量 | Given 医生配额已满，When 推荐运行，Then 医生被阻塞并显示配额原因 | 单元测试 + 后续 DB 集成测试 |
| P0-5 | 审计推荐决策 | Given 前台选择或 override 推荐，When 预约继续，Then 记录请求、命中规则、选择医生和 override 原因 | 架构契约 + manual smoke |

## P1 Requirements（P1 需求）

- 无安全推荐时提供冲突升级视图。
- 按医生、规则类型和状态搜索/过滤规则。
- 推荐质量看板。

## Non-Goals（不做）

- 不做机器学习规则优化。
- 不做患者端预约。
- 不自动改排班。
- 没有真实排班和服务代码集成前，不做生产发布。

## Risks（风险）

| 风险 | 缓解 |
|---|---|
| 规则冲突导致没有合格医生 | 返回 blocked list 和升级路径；不随机 fallback |
| 规则数据过期 | 设置规则 owner、版本、生效时间和审计日志 |
| 前台过度相信推荐 | 展示原因、warning 和 override 路径 |
| 医生配额来源不清楚 | 生产前把配额设为显式集成依赖 |

## acceptance_evidence_plan

| P0 | 测试/原型/人工/监控证据 |
|---|---|
| P0-1 | `npm run test:doctor-preference-e2e` 覆盖 hard-block 规则 |
| P0-2 | 原型 smoke：SMILE + Dr Sin -> 推荐 Dr Kwok 并解释原因 |
| P0-3 | 架构模型包含 DoctorRule.version 和 effective windows |
| P0-4 | 单元测试阻塞 quota-full 医生 |
| P0-5 | 架构定义 RecommendationAudit contract；生产需要 DB test |

## builder_handoff

`architecture_first`。不能直接跳到生产实现，因为还缺真实服务代码、排班表、配额政策、规则责任人和审计持久化。参考实现仍然有价值，用于验证规则语义和测试策略。

## Sensor Gates

| Sensor | 结果 |
|---|---|
| Spec Coverage | PASS（通过）：本 eval 覆盖 MVP P0；生产数据依赖仍开放 |
| Magic Step | PASS（通过）：推荐被定义为显式约束评估，不是模糊 AI magic |
| Builder Handoff | PASS（通过）：architecture_first + reference implementation |
| Goal Suitability | PARTIAL（部分通过）：eval artifacts 安全，生产自驱执行不安全 |

## Output Packet

- **artifact_path**: `evals/doctor-preference-e2e/outputs/02-prd-handoff.md`
- **artifact_type**: `prd_with_acceptance`
- **key_decisions**: MVP 聚焦配置化规则引擎、解释、配额和审计。
- **open_assumptions**: 真实 schedule/service/quota schema；规则审批 owner；公众假期数据。
- **next_skill_hint**: `pm-prototype` 和 `pm-code-architect`
- **handoff_context**: 先构建参考引擎验证语义；生产集成等待真实 schema 确认。
- **acceptance_evidence_plan**: 见上表
- **builder_handoff**: architecture_first
