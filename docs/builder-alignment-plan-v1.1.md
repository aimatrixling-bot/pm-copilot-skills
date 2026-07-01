---
title: AI Builder OS v1.0.6 → v1.1 Builder Alignment Plan
status: DONE
version: v1.1
source_plan: C:\Users\max.ling\.claude\plans\zippy-fluttering-knuth.md
last_updated: 2026-07-01
---

# AI Builder OS v1.0.6 → v1.1 Builder Alignment Plan

> **本文件是跨会话/跨压缩的版本执行状态锚点**。每次子任务完成后，更新对应 status 行；下次会话从这里恢复上下文。MEMORY.md 仅保留指针。本文件不承载长期规则，长期规则以 `docs/source-of-truth-map.md` 为准。

## 子任务执行状态

| Task ID | 子任务 | Status | 完成时间 |
|---|---|---|---|
| #1 | 持久化计划到 docs/ | ✅ DONE | 2026-07-01 |
| #4 | P0.4 四个 Memory Schema 升级 | ✅ DONE | 2026-07-01 |
| #3 | P0.1 八个 SKILL.md 对齐 playbook | ✅ DONE | 2026-07-01 |
| #2 | P0.2 builder-decision 深度重构 | ✅ DONE | 2026-07-01 |
| #9 | P0.3 builder-frame 嵌套 schema 示例 | ✅ DONE | 2026-07-01 |
| #5 | P1.1+P1.2 plan-brief + delivery-sign-off | ✅ DONE | 2026-07-01 |
| #7 | P1.6 Product Track / full_prd | ✅ DONE | 2026-07-01 |
| #10 | P1.4+P1.5 evals + lightweight runner | ✅ DONE | 2026-07-01 |
| #8 | P1.3 Examples 覆盖率 29% → 60% | ✅ DONE | 2026-07-01 |
| #6 | P2.2 Release Seal v1.1 + package.json bump | ✅ DONE | 2026-07-01 |

---

## 定位校正（来自 Phase 1 重读）

P0.1 不是"对齐 skill-template.md"（该文件不存在）。真正的事实源是 `references/skill-design/skill-design-playbook.zh.md`，它定义了 **Skill Hardening Brief（27 字段）+ Review Checklist（11 项）+ 8 工程检查**。当前 8 个 SKILL.md 大体能满足 Review Checklist，真正缺口是**未暴露 Skill Hardening Brief 元数据**、**缺 Meta-Review / Evolution Writeback 章节**、**未在入口引用 Intent Packet**。

## Context（为什么做这件事）

AI Builder OS v1.0.6 已具备完整的 Builder Kernel + 8 skills + 15 templates + Definition Sync Loop + Source-of-Truth Map（38 行）+ Release Seal 历史，但与用户提供的 14 节产品愿景对比仍有四类系统性差距：

1. **Skill 内核未充分吸收 playbook 标准** — 8 个 SKILL.md 缺 Skill Hardening Brief 元数据、Meta-Review、Evolution Writeback；builder-decision 仅 98 行，是最薄弱节点。
2. **Memory 系统分层不齐** — 6 个 schema 中只有 `artifact-index.schema.md` 达到"Schema + Field Rules + Minimum Example + Usage Rule"的黄金标准，其余 4 个（decision-memory / evolution-note / project-memory / user-memory）字段稀疏、无 Field Rules。
3. **Product Track（3P 的 P3）能力薄弱** — 用户明确定位为"Builder (P1) — 但兼顾 PM 场景（PRD 文档类交付）"，因此 Product/PRD 交付深度必须从 P2 提升到 P1。
4. **Examples 覆盖率 29%、evals 多为 placeholder** — 防御性 prompt engineering（anti_evasion / anti_rationalization / readiness_gate）是核心护城河，但缺乏可机器验证的 eval runner。

目标：在不破坏 8-skill 红线、不新增第 9 个 core skill、不做大规模目录重构、不实现 CLI/migrator 的前提下，把 v1.0.6 推到 v1.1，使 8 skills 真正符合 playbook 标准，Memory schema 达到黄金标准，Product Track 具备可交付能力，evals 从 placeholder 升级为可运行的最小验证。

---

## Scope Boundaries（红线）

- ✅ 修改：8 SKILL.md / 4 memory schemas / 2-3 新 template / 现有 validator / 现有 evals / 新增 lightweight eval runner / builder-alignment-plan-v1.1.md
- ❌ 不做：新增第 9 个 core skill / 大规模目录重构 / CLI / scanner / migrator / 自动写入用户项目 / 删除历史 release seal / npm 自动发布

---

## Phase P0 — Skill 内核对齐（高优先，4 个子任务）

### P0.1 八个 SKILL.md 对齐 skill-design-playbook（最大批量改动）

**事实源**：`references/skill-design/skill-design-playbook.zh.md` 的 Skill Hardening Brief 字段表（27 项）+ Review Checklist（11 项）。

**改动公式**（适用于 8 个 SKILL.md：builder-router / builder-plan-goal / builder-frame / builder-spec / builder-prototype / builder-agent-task / builder-review / builder-decision）：

1. **入口段** — 在"使命"前增加 `## 入口契约` 一节，引用 `kernel/packets/intent-packet.schema.md` 的最小字段集（intent / trigger_source / readiness / complexity_hint），明确该 skill 接收什么样的 Intent Packet。
2. **资源读取段** — 已有，按 progressive disclosure 原则审阅，删除"默认加载所有 references"语句（如有）。
3. **正文骨架不动** — 使命 / 何时使用 / 何时不要使用 / 输入 / 模式判断 / 执行流程 / 输出契约 / 质量门禁 / 交接 / 参考 — 这是现有结构，已满足 Review Checklist 第 2-7 项。
4. **新增 `## Skill Hardening Brief` 章节**（放在"参考"之前）— YAML 块，从 27 字段中挑选该 skill 真正有价值的 12-15 个字段暴露（不是全部 27 个，避免 context load）。最小必填：`primary_artifact / target_users / baseline_failure_scenarios / red_phase / green_phase / trigger_conditions / non_trigger_conditions / quality_gates / red_flags / anti_evasion_rules / done_when / open_questions`。
5. **新增 `## Meta-Review` 章节** — 该 skill 自我评审钩子，3-5 行，说明：何时该被 `builder-review` 复审 / 已知 false-positive 场景 / 已知 false-negative 场景。
6. **新增 `## Evolution Writeback` 章节** — 该 skill 的稳定决策应迁移到哪个 source-of-truth（引用 `docs/source-of-truth-map.md` 的对应行）。

**验证**：`scripts/validate-builder-os.js` 新增检查 — 每个 SKILL.md 必须包含 `## Skill Hardening Brief`、`## Meta-Review`、`## Evolution Writeback` 三个章节标题 + `## 入口契约` 章节 + `intent-packet.schema.md` 引用。

**预估改动**：每个 SKILL.md +40~60 行（净增），8 个文件共 +320~480 行。可控。

---

### P0.2 builder-decision 深度重构（最薄弱节点）

**现状**：98 行，4 模式（record_decision / compare_options / accept_tradeoff / defer_decision），输出 YAML 15 字段全标量，5 个质量门禁。

**目标**：180-220 行，仍是 8-skill 之一但成为"决策科学"标杆。

**具体改动**：

1. **`compare_options` 模式增决策框架** — 新增 references/decision-frameworks.zh.md（简版）：Multi-Criteria Decision Analysis（MCDA）+ Reversibility Matrix + Cost of Delay = Value / Time。
2. **`defer_decision` 模式增 action structure** — 输出必须包含 `evidence_needed[]`、`decision_owner`、`revisit_by` 字段。
3. **`reversal_conditions` 结构化** — 从标量升级为对象数组：`{trigger, threshold, action_on_trigger}`。
4. **质量门禁从 5 → 8** — 新增：Decision Reversibility Gate（one-way door 决策必须更高证据门槛）、Assumption Expiration Gate（assumptions 必须有 review_by 日期）、Evolution Writeback Gate（决策若进入长期记忆，必须走 memory/ 写回流程）。
5. **输出契约 YAML 升级** — 15 字段中 3 个改为对象数组（options_considered / tradeoffs / reversal_conditions），保留向后兼容（标量仍可读）。
6. **示例** — 增加 2 个 worked example（一个产品决策、一个架构决策）在 references/ 中，SKILL.md 中只放指针。
7. **应用 P0.1 公式** — 入口契约 + Skill Hardening Brief + Meta-Review + Evolution Writeback。

**验证**：`evals/output-contract/decision-record.schema.json` 同步升级；validate:builder-os 新增 builder-decision 专项 keyword 检查（MCDA / Reversibility Matrix / Cost of Delay 三个关键词至少各出现一次）。

---

### P0.3 builder-frame 嵌套 schema 示例

**现状**：builder-frame 的输出契约引用 nested schema，但 SKILL.md 中无完整 worked example。

**改动**：在 builder-frame/references/ 或 SKILL.md 内嵌一个完整的"模糊 idea → Feature Frame"端到端示例，包含：原始模糊输入 / 路由判断理由 / Feature Frame YAML 输出 / handoff packet。

**验证**：validate:builder-os 新增 builder-frame worked example 存在性检查。

---

### P0.4 四个 Memory Schema 升级到 artifact-index 黄金标准

**黄金标准**（来自 `memory/schemas/artifact-index.schema.md`）四要素：Schema (YAML) + Field Rules 表格 + Minimum Example + Usage Rule。

**改动目标**：
- `memory/schemas/decision-memory.schema.md`
- `memory/schemas/evolution-note.schema.md`
- `memory/schemas/project-memory.schema.md`
- `memory/schemas/user-memory.schema.md`

每个文件补齐四要素。Field Rules 表格至少覆盖：字段名 / 类型 / 必填 / 写入时机 / 读取时机 / 生命周期。

**验证**：validate:builder-os 新增 4 schema 文件结构检查（必须包含 `## Schema`、`## Field Rules`、`## Minimum Example`、`## Usage Rule` 四个章节标题）。

---

## Phase P1 — 交付链与验证基础设施（6 个子任务）

### P1.1 新增 templates/plan-brief/（Plan/Goal 路由的核心产物）

**现状**：builder-plan-goal 路由到 Plan/Goal 但无标准 template，导致输出漂移。

**改动**：新增 `templates/plan-brief/template.md`，字段：plan_summary / goal_statement / non_goals / assumptions / success_metrics / decision_points / handoff_target / revisit_trigger。在 builder-plan-goal/SKILL.md 的"资源读取"中引用。

**验证**：validate:builder-os 新增 plan-brief template 存在性 + builder-plan-goal SKILL.md 引用检查。

---

### P1.2 新增 templates/delivery-sign-off/（3P 通用交付确认）

**现状**：3P（PRD-Spec / Prototype / Product）无统一交付确认模板。

**改动**：新增 `templates/delivery-sign-off/template.md`，字段：delivery_track / artifact_refs / acceptance_criteria_met / evidence_packet_ref / residual_risks / sign_off_owner / next_track_handoff。

**验证**：validate:builder-os 新增存在性检查 + builder-spec / builder-prototype SKILL.md 引用检查。

---

### P1.3 Examples 覆盖率 29% → 60%

**现状**：扫描 examples/ 仅覆盖约 29% 输入场景。

**改动**：补齐 8 个 SKILL.md 的 should_trigger / should_not_trigger / 相邻 skill 分流 / high-risk ask-first 四类示例，每个 skill 至少各 1 例。优先级：builder-decision / builder-frame / builder-prototype（最薄弱三个）。

**验证**：新增 `scripts/check-examples-coverage.js` 简易脚本，统计每个 SKILL.md 的 examples 数量（keyword: `**Example**` 或 `**示例**` 标题数），阈值 ≥4。

---

### P1.4 evals placeholder 落地或归档

**现状**：evals/ 多为 .cases.json placeholder，无 LLM-as-judge runner。

**改动策略**（务实，不造大轮子）：
- 保留 `evals/**/*.cases.json` 作为 fixture 数据源
- 落地 5 个最关键 schema 检查（builder-router / builder-spec / builder-review / builder-decision / agent-task-packet）到 validate:builder-os
- 其余 placeholder 在 evals/README.md 中明确标注"v1.1 不含 LLM runner，仅 schema fixture"，避免误导

**验证**：validate:builder-os 新增 5 schema 引用存在性检查。

---

### P1.5 scripts/run-eval-suite.js 轻量 runner

**现状**：无 eval runner。

**改动**：新增 `scripts/run-eval-suite.js`，最小实现：
- 读取 `evals/**/*.cases.json`
- 对每个 case 跑 schema 验证（不跑 LLM）
- 输出 pass/fail 报告到 `dist/eval-report.json`
- npm script: `npm run validate:eval-suite`

**验证**：`npm run validate:eval-suite` 必须通过。

---

### P1.6 Product Track（从 P2 提升）— PRD 文档类交付强化

**定位校正**：用户明确"Builder (P1) — 但兼顾 PM 场景（PRD 文档类交付）"。Product Track 是 3P 的 P3，必须从原 P2.1 升级到 P1.6。

**现状**：builder-spec 偏 mini-spec，缺乏完整 PRD 交付深度。

**改动**：
1. `builder-spec/SKILL.md` 新增第 5 模式 `full_prd`（与 mini_spec / engineering_request / not_ready_for_spec 并列），明确触发条件：用户显式要求 PRD / 交付对象是开发团队 / 模块预估 ≥2 周工作量。
2. `templates/module-execution-pack/template.md` 补充 `## PRD 扩展字段` 章节（用户故事 / 验收标准 / 优先级矩阵 / 依赖关系 / 风险登记 / 干系人）。
3. `references/` 新增 `prd-quality-checklist.zh.md`（不复制 PRD 理论，只列必填字段 + 反模式）。
4. 应用 P0.1 公式（入口契约 + Skill Hardening Brief + Meta-Review + Evolution Writeback）。

**验证**：validate:builder-os 新增 builder-spec `full_prd` 模式存在性 + prd-quality-checklist.zh.md 存在性。

---

## Phase P2 — 长期演进（低优先，2 个子任务，可在 v1.2 处理）

### P2.1 L0-L4 知识分层 operational 工具

**现状**：`templates/project-memory-index/template.md` 已定义 L0-L4 概念，但缺操作工具。

**改动**（v1.2）：在 references/ 新增 `memory-layer-operations.zh.md`，定义每层写入/读取/迁移触发条件。不实现 CLI，仅作为 builder-review 的检查参考。

### P2.2 Release Seal v1.1 + 发布前验证

执行 P0/P1 全部验证后，新增 `docs/release-seal-v1.1.md`，记录：版本号、git diff 摘要、validate:builder-os / validate:runtime-adapters / validate:package-surface / validate:eval-suite 全部输出、npm preflight 证据。不自动发布 npm、不自动打 tag。

---

## Execution Order（推荐序列）

1. **P0.4** Memory schema 升级（最独立、风险最低、立即可验证）
2. **P0.1** 八个 SKILL.md 公式套用（最大批量，但机械改动）
3. **P0.2** builder-decision 全量重构（最深度，独立做）
4. **P0.3** builder-frame 示例（小改动）
5. **P1.1 + P1.2** 两个新 template（独立小改动）
6. **P1.6** Product Track / builder-spec full_prd（中等改动）
7. **P1.4 + P1.5** evals 归档 + lightweight runner（基础设施）
8. **P1.3** Examples 覆盖率（最后，因为前面 P0/P1 改动会引入新示例）
9. **P2.2** Release Seal（最后一步）

每步完成后：
- 跑 `npm run validate:builder-os`
- 更新本文件的 status 表格
- 创建下一个 TaskCreate 任务

---

## Verification（端到端）

### 每步验证

```bash
npm run validate:builder-os
```

### P0/P1 全部完成后

```bash
npm run validate:builder-os
npm run validate:runtime-adapters
npm run validate:package-surface
npm run validate:eval-suite    # 新增
npm pack --dry-run --json
```

### 行为级验证（不依赖 LLM）

- 每个 SKILL.md 包含：入口契约 / Skill Hardening Brief / Meta-Review / Evolution Writeback 四个新章节
- 4 个 memory schema 包含：Schema / Field Rules / Minimum Example / Usage Rule 四个章节
- builder-decision 包含 MCDA / Reversibility Matrix / Cost of Delay 三个关键词
- builder-spec 包含 full_prd 模式
- 8 个 SKILL.md 的 examples ≥4 个

---

## Open Questions（执行中需校准）

- Q1：P0.1 中"Skill Hardening Brief 暴露 12-15 字段"的具体子集是否需要 per-skill 定制？建议在 P0.1 第一个 skill（builder-decision）完成后由用户审阅一次模板，再批量化。
- Q2：P1.5 的 eval runner 是否需要支持 LLM-as-judge？建议 v1.1 不做，v1.2 引入；现在只做 schema 验证。
- Q3：是否在 v1.1 同步更新 `adapters/claude-code/` 和 `agents/openai.yaml`？建议同步，因为是 surface change；在 P0.1 完成后统一更新。
