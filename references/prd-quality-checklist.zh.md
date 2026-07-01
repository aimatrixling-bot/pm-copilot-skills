# PRD Quality Checklist

builder-spec 的 `full_prd` 模式（spec_output_profile: full_change_contract / full_execution_pack 或显式 full_prd）使用的质量检查清单。本文件不复制 PRD 理论，只列必填字段、反模式、profile 升级触发器。

**定位**：Builder (P1) — 兼顾 PM 场景。PRD 不是 Builder OS 的核心交付物，而是 builder-spec 在用户显式要求"交付开发团队"或"模块 ≥2 周工作量"时的输出形态。

---

## 1. 问题与用户（Problem & Users）

### 必填

- [ ] **问题陈述**：1-3 句，描述要解决的真问题（不是解决方案）
- [ ] **目标用户**：主 persona + 次 persona + 各自场景
- [ ] **JTBD**：用户雇佣这个功能/产品来完成什么任务（Job to be Done）
- [ ] **当前替代方案**：用户现在怎么解决这个问题？为什么不满意？

### 反模式

- ❌ "我们要做一个 AI 驱动的智能平台"（无问题、无用户）
- ❌ "面向所有互联网用户"（无 persona 区分）
- ❌ "用户需要一个 X 功能"（用户说解决方案，不是问题）

---

## 2. 范围与边界（Scope & Boundaries）

### 必填

- [ ] **in_scope**：v1 明确要做的事项列表
- [ ] **explicit_non_goals**：v1 明确不做的事项，每个附"为什么不做"
- [ ] **out_of_scope_but_future**：v1 不做但未来可能做的（区分 non_goals）

### 反模式

- ❌ 只有 in_scope 没有 non_goals（下游会无限扩展）
- ❌ non_goals 写"性能优化"等模糊词（应具体："v1 不支持 100 QPS 以上"）
- ❌ 把"未来想做"塞进 in_scope（应进 out_of_scope_but_future）

---

## 3. 验收与验证（Acceptance & Verification）

### 必填

- [ ] **acceptance_criteria**：每个 criterion 必须可被人工 review / 自动检查 / 证据验证
- [ ] **rejection_criteria**：明确什么情况会拒绝交付
- [ ] **verification_plan**：minimum_checks / observable_evidence / cannot_claim_done_without

### 反模式

- ❌ "用户体验良好"（不可验证）
- ❌ "性能优秀"（无数值阈值）
- ❌ "测试通过"（不说明测试范围）
- ❌ acceptance_criteria 全部 met（标准过松或评估不足）

---

## 4. 状态与流程（States & Flows）

### 必填（UI / 状态机相关 PRD）

- [ ] **核心流程**：happy path + 关键分支
- [ ] **状态覆盖**：所有 UI 状态枚举（initial / loading / empty / error / success / partial）
- [ ] **edge_cases**：边界情况列表

### 反模式

- ❌ 只画 happy path（隐含"其他不重要"）
- ❌ 状态枚举缺 loading / empty / error（实施时必然暴露）
- ❌ 把状态机藏在 UI 文案里（应单独状态表）

---

## 5. 约束与假设（Constraints & Assumptions）

### 必填

- [ ] **constraints**：技术约束（栈、性能、安全、合规、i18n、可访问性）
- [ ] **assumptions**：每个 assumption 附 `confidence` + `invalidation` 触发条件
- [ ] **dependencies**：上游依赖 / 下游被依赖

### 反模式

- ❌ 假设无验证条件（`assumption: "用户会每天用"` 缺 `invalidation`）
- ❌ 把"我们假设 X"作为未做调研的借口
- ❌ 依赖列表缺失（实施时才发现"啊原来依赖那个服务"）

---

## 6. 风险与 Open Questions（Risks & Open Questions）

### 必填

- [ ] **risks**：每个 risk `{severity, probability, mitigation, owner}`
- [ ] **open_questions**：未解决问题列表，每个附"by when 需要回答"

### 反模式

- ❌ risks 全部 low severity（评估不足）
- ❌ risks 写"市场风险"等模糊词（应具体："若竞品 X 在 Q3 推出类似功能，我们的差异化是否成立"）
- ❌ open_questions 无 deadline（会无限期悬挂）

---

## 7. 用户故事与优先级（User Stories & Priority）

### 必填

- [ ] **user_stories**：核心 stories（≥3 个），格式"As a [persona], I want [action], so that [value]"
- [ ] **priority**：MoSCoW（Must / Should / Could / Won't）或 RICE 排序

### 反模式

- ❌ stories 全部 Must（无优先级判断）
- ❌ stories 写成 task（"实现登录 API"），不是 user value（"作为用户，我想登录以便保存进度"）
- ❌ priority 缺理由（为什么 Must？为什么 Won't？）

---

## 8. 依赖关系（Dependencies）

### 必填

- [ ] **technical_dependencies**：服务 / API / 数据 / 模型依赖
- [ ] **organizational_dependencies**：团队 / 法务 / 合规 / 业务方
- [ ] **external_dependencies**：第三方服务 / 数据源 / 合规认证

### 反模式

- ❌ 把"我们假设 X 服务可用"当作 dependency（应显式列出并标注 readiness）
- ❌ 缺 organizational_dependencies（实施时才发现"啊原来需要法务审批"）

---

## 9. 干系人（Stakeholders）

### 必填

- [ ] **stakeholders**：每个 `{role, name, decision_power, communication_cadence}`
- [ ] **decision_maker**：最终拍板人
- [ ] **escalation_path**：升级路径

### 反模式

- ❌ stakeholder 列表缺决策权（"工程负责人 @X" 不说明 X 是决策还是咨询）
- ❌ 无 escalation_path（卡住时不知道找谁）

---

## 10. 上线与运营（Launch & Operations）

### 必填（发布前必填）

- [ ] **launch_plan**：分阶段发布 / 灰度 / rollback 计划
- [ ] **monitoring**：核心指标 + 告警阈值
- [ ] **support**：用户支持路径 / SLA / 文档
- [ ] **success_metrics_post_launch**：上线后 30/60/90 天的 success metrics

### 反模式

- ❌ launch_plan 写"上线"（无阶段、无 rollback）
- ❌ monitoring 缺阈值（"监控响应时间"不说明 >X 触发什么）
- ❌ 无 post-launch success_metrics（上线即完成，无持续评估）

---

## Profile 升级触发器

从 `micro_note` / `lite_change_contract` / `minimal_execution_pack` 升级到 `full_prd` 的触发条件：

### 强升级（必须升级到 full_prd）

- 用户显式要求"PRD 交付开发团队"
- 模块预估工作量 ≥ 2 周
- 跨团队协作（≥3 个团队）
- 涉及新业务领域（团队无既有经验）
- 涉及外部合规（数据隐私、医疗、金融）

### 弱升级（建议升级）

- 跨模块 / 跨仓库
- 涉及状态机或领域语义变化
- 涉及新外部依赖（第三方 API、新服务）
- 干系人 ≥ 5 人

### 不升级（保持 micro / lite / minimal）

- 1-2 个文件改动
- UI 微调、文案、样式
- 无领域语义变化
- 单团队内部决策

---

## PRD 与 Builder OS 的边界

### PRD 应该包含

- 问题与用户、范围与边界、验收与验证、状态与流程、约束与假设、风险与 open questions、用户故事与优先级、依赖、干系人、上线与运营

### PRD 不应该包含

- 具体实现代码（应在 builder-agent-task 阶段产出）
- 详细 API schema（应在 builder-spec 的 `engineering_request` profile 产出）
- 完整测试用例（应在实施阶段产出）
- UI 视觉稿（应在 builder-prototype 阶段产出）

### 与 builder-spec 其他 profile 的关系

| spec_output_profile | 用 PRD Checklist | 用 Spec Rules | 用 Acceptance Criteria Guide |
|---|---|---|---|
| micro_note | 部分 | ✅ | ✅ |
| lite_change_contract | 部分 | ✅ | ✅ |
| minimal_change_contract | 部分 | ✅ | ✅ |
| standard_change_contract | 部分 | ✅ | ✅ |
| full_change_contract | ✅ 完整 | ✅ | ✅ |
| minimal_execution_pack | 部分 | ✅ | ✅ |
| full_execution_pack | ✅ 完整 | ✅ | ✅ |
| full_prd（显式） | ✅ 完整 + 上线运营 | ✅ | ✅ |

---

## 参考

- `skills/builder-spec/SKILL.md` — `full_prd` 模式调用入口
- `templates/builder-spec.template.md` — Spec 主模板
- `references/spec-rules.zh.md` — Spec 通用规则
- `references/acceptance-criteria.zh.md` — 验收标准深度规则
- `references/prototype-to-spec.zh.md` — prototype 反向提取 spec 规则
- `docs/delivery-kernel.md` — Delivery Kernel 整体规则
- `references/skill-design/skill-design-playbook.zh.md` — 模板设计原则
