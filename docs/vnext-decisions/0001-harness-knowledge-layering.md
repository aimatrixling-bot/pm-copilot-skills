---
title: Harness Knowledge Layering — Skill Kernel vs Product Manifest vs Knowledge Layer
adr_id: 0001
status: Proposed
phase_target: vNext v1.1+
created: 2026-07-07
deciders: [max.ling, claude]
related_blueprint_sections: [§2.21 craft-spec, §2.21 craft-prototype, §2.21 discover-research, §2.20 Researcher, §2.20 Builder]
supersedes: []
---

# ADR 0001 — Harness 知识分层与产品形态维度处理

## Status

**Proposed** — 2026-07-07 由 Max 与 Claude 在 Batch 7 等待期间讨论形成。等 vNext v1.0（Batch 7 + ID-1 + TD queue 完成）落地后进入 Accepted。

## Context（为什么需要这个决策）

### 触发问题

craft-spec / craft-prototype 作为 vNext P0 Skill，其流程必须能感知"这是 B 端 SaaS / 中后台 / 应用层 AI / 桌面+移动 / 医疗行业"这类**产品形态维度**，否则 spec 与 prototype 会走偏。但直接把行业/设备/类型硬编码进 Skill 内核，会引入三类问题：

1. **Skill 内核膨胀** — 每个新行业、新设备都要改 Skill
2. **泛化失败** — Skill 无法在公开版本中给非 Max Brain 用户使用（见 Batch 4.5 用户提出的"无法泛化"担忧）
3. **腐烂加速** — 行业知识比流程变化快，绑在一起维护成本指数级

### 维度本质的差异

用户列举的维度并非同质，混淆处理会导致架构失败：

| 类型 | 维度例子 | 本质 | 正确归属 |
|---|---|---|---|
| **结构性** | B/C 端、客户端/中后台、AI 应用/模型/基础层 | 影响架构与流程 | Profile Manifest 字段 |
| **领域性** | 医疗、电商、金融、手机、机器人 | 影响约束与术语 | Knowledge Layer reference |
| **工程方法** | i18n、容错、隐私、单一数据源 | 跨维度通用 | 项目 CLAUDE.md / principles.md |
| **职能范围** | 功能/数据/增长/策略/AI | 项目 scope 选择 | spec 内 non-goals |

> **关键洞察**：把领域性维度误当结构性维度塞进 manifest，或把结构性维度误当知识塞进 KB，都会让 Harness 失去接缝。

## Decision（决策）

### D1 — Harness 四层分层模型

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 3: Pattern Library（远期，P2）                          │
│   按行业/设备/AI 层组织的方法论引用索引                        │
│   本质：知识库的"维度导航层"，非 Skill 内核                   │
├─────────────────────────────────────────────────────────────┤
│ Layer 2: Knowledge Layer（已有，无需重做）                    │
│   Max Brain 10_Library/11_classic_books/ Key_Models         │
│   Max Brain 10_Library/12_Methodology/                      │
│   Max Brain 10_Library/81_Hypotheses/                       │
│   项目级 CLAUDE.md / principles.md                           │
├─────────────────────────────────────────────────────────────┤
│ Layer 1: Product Manifest（P1 该建）                         │
│   项目根 product_manifest.md（或 .yaml）                      │
│   声明结构性维度：B/C, client/admin, AI 层, 设备, 行业 key     │
│   通过 manage-grill 在 prototype 开工前逐步涌现               │
├─────────────────────────────────────────────────────────────┤
│ Layer 0: Skill Kernel（P0，已完成）                          │
│   craft-spec / craft-prototype / discover-research 通用流程  │
│   不感知任何具体行业/设备                                      │
└─────────────────────────────────────────────────────────────┘
```

### D2 — Skill 内核纪律（铁律）

- **Skill 内核不感知任何具体行业/设备/AI 层**
- Skill 只感知**结构性抽象字段**（已存在的 `profile: lite/standard/ultra`、`audience: human/agent/dual`、本决策新增的 `product_manifest_ref`）
- 行业/设备差异通过 **Layer 1 manifest 字段** + **Layer 2 discover-research 调用**进入流程，不进入 Skill body

### D3 — Product Manifest 的字段边界

**应该进 manifest 的结构性维度**：

| 字段 | 取值示例 | 用途 |
|---|---|---|
| `audience_type` | `B / C / B2B2C` | 区分受众结构 |
| `surface` | `client / admin / embedded / kiosk` | 区分前端形态 |
| `ai_layer` | `application / model / infra` | 区分 AI 价值链位置 |
| `devices` | `[desktop, mobile, tablet, watch, ...]` | 区分设备约束 |
| `domain_key` | `healthcare / fintech / ecommerce / ...` | KB 检索 key（仅作指针，不承载内容） |

**不应进 manifest**：

- 工程方法（i18n、容错） → 进项目 `CLAUDE.md`
- 通用方法论（Hook 模型、JTBD） → 进 `10_Library/`
- 项目 scope（做不做支付） → 进 spec 的 non-goals
- 行业具体规则（医疗 HIPAA） → 进项目 `principles.md`

### D4 — Manifest 不是预填的，是涌现的

**触发时机**：早期阶段（创意形成 → spec 起草之间）。

**填写机制**：通过 `manage-grill` 在项目仓库构建过程中、Prototype 开工之前，与用户交互逐步填写。**不是一次性手填，而是 grill 出来的**。

**关键纪律**：
- `builder-plan-goal` 或 `craft-spec` 的 Step 1 检查 manifest 缺哪些字段
- 缺失字段路由到 `manage-grill`，grill 单次最多问 1-2 个维度
- manifest 字段在 `craft-spec` 完成 source boundary 时必须完整

### D5 — 维护策略

- **持续更新**：项目演进中维度可能变化（例如 C 端转 B2B2C），manifest 跟随更新
- **不强制清理**：如果项目停止维护，manifest 保持最后状态，不腐烂处理
- **不引入 stale gate**：Layer 1 manifest 不进 `review-doc` 的 blocker 检查，只作为 source-of-truth 引用

## Consequences（影响）

### 正面

- craft-spec / craft-prototype 内核保持稳定，不随行业扩展膨胀
- vNext 公开版本可在任何行业/设备上工作（解决 Batch 4.5 用户提出的泛化担忧）
- Max Brain 知识库无需重做，通过 `discover-research` 自然接入
- 新增行业只需扩展 Layer 2 KB + Layer 3 Pattern Library，不动 Skill

### 负面

- Layer 1 manifest 是新增 schema，引入 vNext 表面增量（需评估是否触发 source-of-truth-map 更新）
- manifest 缺失时 craft-spec 需要回退路径（fallback：通过项目 CLAUDE.md 兜底）
- Pattern Library（Layer 3）远期才建，短期用户仍需在 prompt 里携带行业信号

### 中性

- ID-1 batch 的 `ref_impl_specificity` 字段（Phase 2 泛化策略）与本决策正交，不冲突
- 8 个 P0 Skill 数量不变，不违反 source repo `AGENTS.md` 的 8-skill 红线

## Phase Path（实施路径）

| Phase | 动作 | 触发条件 |
|---|---|---|
| **P0（当前）** | 不动。`discover-research` 兜底，行业信号靠项目 CLAUDE.md + 用户 prompt 携带 | vNext v1.0 release |
| **P1（v1.1）** | 引入 `product_manifest.md` schema；craft-spec / discover-research / builder-router 在 Step 1 读它；manage-grill 新增"维度询问"模式 | 8 个 P0 Skill 全部稳定 + ≥3 个真实项目验证 + 出现"AI 老忘记这是 X 行业"的痛感重复 3 次以上 |
| **P2（远期）** | Pattern Library — 行业/设备/类型的"维度导航层"，本质是 KB 的 navigation index | P1 落地后 ≥6 个月，且出现"每个项目都要重新 grill 一遍基础维度"的痛感 |

## Open Questions（待 P1 启动时回答）

1. **manifest schema 落点**：进 `vnext/memory/schemas/` 还是 `vnext/templates/` 还是独立目录？
   - 倾向：`vnext/templates/product-manifest/template.md`（与 source-of-truth-map 第 13/14 行的模板纪律一致）
2. **manage-grill 维度询问模式**：是新增 `mode: manifest_probe` 还是复用现有 5 步流程？
   - 倾向：复用，在 Step 2「每次只探测一个假设的问题」中加入"维度假设"作为合法 probe target
3. **fallback 路径**：manifest 缺失时 craft-spec 是 BLOCKED 还是 PASS_WITH_CAVEAT？
   - 倾向：PASS_WITH_CAVEAT + 在 spec body 显式标 `manifest_field: <missing>` 让下游可见
4. **Pattern Library 是否独立目录**：`vnext/patterns/` 还是 `10_Library/14_Pattern_Library/`？
   - 倾向：后者，保持 Max Brain 知识库边界，不让 vNext 表面扩张
5. **manifest 与 source-of-truth-map 关系**：是否需要新增 SoT 行？
   - 倾向：P1 启动时新增，行内容："Where does product form factor live? → `templates/product-manifest/template.md`"

## Red Lines（红线，P1 启动时不能违反）

- 不给 craft-spec 加 `industry` 字段（字段值列表会腐烂）
- 不把 `81_Hypotheses/` 内容塞进 Skill body（数据不是逻辑）
- 不为"泛化"提前建抽象（等具体痛点出现）
- 不在 vNext v1.0 落地前动这件事（Batch 7 / ID-1 / TD queue 优先）
- 不让 manifest 字段膨胀超过 10 个（超过即腐烂数据）

## References

- `docs/vnext-blueprint.md §2.21` — 11 个 P0 Skill 定义（craft-spec / craft-prototype / discover-research）
- `docs/vnext-blueprint.md §2.20` — Researcher / Builder Agent 职责
- `docs/vnext-blueprint.md §2.24` — Progressive Disclosure / Context Pointer / Failure Modes
- `docs/source-of-truth-map.md` — 长期规则归属地图
- `vnext/skills/craft/craft-spec/SKILL.md` — 已存在的 profile/audience 字段（Layer 0 抽象层）
- `vnext/skills/manage/manage-grill/SKILL.md` — Step 2 单假设询问（P1 时复用为维度 probe）
- `C:\Users\max.ling\.claude\rules\common\principles.md` — P-03 约束先行 / T-04 抽象边界 / W-02 大改动先 Plan
- `10_Library/81_Hypotheses/` — 跨项目验证过的判断原则（Layer 2 主体）

## Change Log

| 日期 | 变更 | 决策者 |
|---|---|---|
| 2026-07-07 | 初版形成，status: Proposed | max.ling + claude |
