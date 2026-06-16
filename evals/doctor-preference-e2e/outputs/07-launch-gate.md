# Launch Gate（发布门禁）：医生个性化推荐插件

## Go/No-Go Claim（发布判断）

`GO-WITH-RISKS（带风险通过）`：仅针对 PM Copilot Skills E2E eval artifact。

`NO-GO（不建议发布）`：针对 ClarityMedic 生产发布。

## Release Evidence Packet（发布证据包）

| 证据类型 | 证据 |
|---|---|
| Release artifact | 仅 eval artifact：`evals/doctor-preference-e2e/` |
| Checks run | `npm run validate:doctor-preference-e2e`；`npm run test:doctor-preference-e2e`；`npm run validate:builder-os`；npm pack dry-run |
| Rollback readiness | eval rollback 是 git revert package changes；生产 rollback 未定义 |
| Monitoring readiness | eval 无 runtime monitoring；生产需要 recommendation latency、adoption、override、no-eligible rate、rule-error monitoring |
| Open risks | 无真实 schema、无生产 API、无 release package、无 PII policy、无医生规则 owner approval |
| Go/No-Go claim | eval 为 GO-WITH-RISKS；生产为 NO-GO |

## Required Production Gates Before GO（生产 GO 前必需门禁）

| Gate | 必需证据 |
|---|---|
| Release Artifact | commit/tag、build artifact、deployment 或 install package |
| Real Data Integration | schedule/service/quota adapters 和 integration tests |
| Rule Ownership | 规则变更和审批 workflow 的明确 owner |
| Privacy/Security | audit payload 完成 PII 和 access control 审查 |
| Monitoring | latency、recommendation failure、override rate、quota conflicts 的 dashboard 和 alerts |
| Rollback | feature flag 或 plugin disable switch，且 rollback path 已测试 |

## Output Packet

- **artifact_path**: `evals/doctor-preference-e2e/outputs/07-launch-gate.md`
- **artifact_type**: `launch_plan`
- **key_decisions**: eval 为 GO-WITH-RISKS；生产为 NO-GO。
- **open_assumptions**: 生产目标 repo、release artifact 和 runtime monitoring 不在本 eval 中。
- **release_evidence_packet**: 见上表
- **next_skill_hint**: `pm-code-architect` 做生产集成设计，然后 `pm-code-implement`
- **handoff_context**: 不要把这个 reference implementation 当成 production-ready 实现同步到 ClarityMedic 或下游 agents。
