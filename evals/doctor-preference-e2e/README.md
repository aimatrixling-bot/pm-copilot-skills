# 医生个性化推荐 E2E Builder OS 验收

这个验收用一个真实的 ClarityMedic 需求，验证 PM Copilot Skills Builder OS 是否能跑通端到端链路。

## 来源

- 来源文档：`D:/ClarityMedic-PMS/docs/prd/doctor-preference-problem-statement.md`
- 场景：预约/前台流程中的医生个性化推荐插件
- 本次验收范围：产品构想 -> PRD 交接 -> 原型证据 -> 架构 -> 参考实现 -> 代码审查证据 -> 发布门禁

## 为什么这个案例适合 E2E 验收

这个需求足够复杂，可以真实检验 Builder OS 的行为：

- 11 位医生，48+ 条个性化规则，覆盖时间、服务、地点、工作量、年龄、手术、日期等约束。
- 需要配置化规则引擎，不能继续硬编码推荐逻辑。
- 需要推荐解释，前台才能信任系统输出。
- 需要配额/工作量跟踪和冲突处理。
- 推荐错误会影响患者、医生和诊所运营，因此发布前必须有门禁。

## 验收契约

只有当产物证明以下事项时，本次 E2E 才算有价值：

1. 产品构想能区分业务判断和可自驱执行部分。
2. PRD 交接能把 P0 需求映射到验收证据。
3. 原型交接能检查 fake UI，并记录交互 smoke 路径。
4. 架构能定义数据契约和验证策略。
5. 实现能产出可执行参考逻辑和测试。
6. 审查不仅看代码形态，也检查证据质量。
7. 发布门禁在没有真实发布制品、监控、回滚、隐私/安全证据时拒绝无条件 GO。

## 证据

- 端到端输出：`outputs/`
- 参考实现：`reference-implementation/doctorRecommendationEngine.js`
- 测试：`reference-implementation/doctorRecommendationEngine.test.js`
- 原型产物：`artifacts/prototype/doctor-preference-prototype.html`
- benchmark 摘要：`benchmark.md` 和 `benchmark.json`

运行：

```bash
npm run validate:doctor-preference-e2e
npm run test:doctor-preference-e2e
```
