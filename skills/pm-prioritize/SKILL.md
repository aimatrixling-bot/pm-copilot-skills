---
name: pm-prioritize
displayName: 优先级与规划
displayDescription: RICE排序 + 路线图 + Sprint规划
description: "Prioritize features, plan roadmaps, and manage backlogs in one skill. Use this skill whenever the user needs to rank features, plan timelines, or organize work items. Triggers on: 'prioritize', 'RICE', '优先级', '排优先级', 'what to build first', 'roadmap', '路线图', '季度规划', '排期', 'timeline', 'backlog', '待办', '需求池', 'sprint planning', '迭代规划', 'feature ranking', 'Now-Next-Later', '里程碑'. Three modes — Prioritize (RICE scoring), Roadmap (timeline planning), Backlog (Sprint planning) — auto-detected from user intent or specified via --mode=prioritize|roadmap|backlog."
user-invocable: true
argument-hint: "[功能列表 / PRD链接 / 项目描述]"
---

# 优先级与规划

<SUBAGENT-STOP>
如果是子代理派发执行此 Skill，直接按下方指令执行，不重新加载入口 Skill。
</SUBAGENT-STOP>

一站式优先级管理：排序 → 路线图 → Sprint 规划。三个模式，按需触发。

**模式自动检测规则**：

| 用户意图 | 模式 | 关键词示例 |
| --- | --- | --- |
| 排序/评分/选择做什么 | **Prioritize** | 优先级、RICE、排名、先做哪个 |
| 时间线/阶段/季度规划 | **Roadmap** | 路线图、季度规划、排期、里程碑 |
| 拆任务/迭代/执行计划 | **Backlog** | Sprint、需求池、待办、任务拆分 |

用户也可通过 `--mode=prioritize|roadmap|backlog` 显式指定。

---

## Intent Packet

| 字段 | 捕获内容 | 来源 |
|---|---|---|
| **Want** | 对功能/需求做优先级排序、路线图规划或 Sprint 任务拆分 | 用户输入剥离"先做什么"后的任务本质 |
| **Constraints** | RICE 四维度必填、Effort ≥ 0.5、路线图预留 10-20% 缓冲、Sprint 只承诺 80% 容量、任务 ≤ 2 天 | Iron Law（全局 + 模式专属） |
| **Context Sources** | 功能列表/PRD 链接 + 时间范围 + 团队规模 + 已有 RICE/Roadmap 数据 | 用户提供 + Glob + Read |
| **Depth** | Prioritize（RICE 评分排序）/ Roadmap（时间线+里程碑）/ Backlog（Sprint 任务拆分）— 三选一或链式 | 用户声明（--mode）或关键词推断 |
| **Output Target** | 产品团队（PM/工程/设计）+ 规划决策者 | 用户明示或推断 |

未提供时标注 `[假设]`，交付前确认。

---

## Iron Law（铁律）

**全局铁律（所有模式共用）**：

| 铁律 | 违反后果 |
| --- | --- |
| 没有数据支撑的优先级 = 猜测 | 所有推断标注 [假设]，低置信度项建议验证 |
| 过度承诺 = 必定失败 | 路线图预留 10-20% 缓冲，Sprint 只承诺 80% 容量 |

**Prioritize 模式铁律**：

| 铁律 | 违反后果 |
| --- | --- |
| 四个维度必须全部填写 | 缺失维度估算为默认值后继续，但必须标注 |
| Effort 不能为 0 | 最小值 0.5 人月 |
| 单维度排序无效 | 必须展示综合 RICE 分数 |

**Roadmap 模式铁律**：

| 铁律 | 违反后果 |
| --- | --- |
| 没有目标的路线图不是路线图 | 立即停止——补充时间范围和阶段目标 |
| 没有优先级的里程碑无法执行 | 每个里程碑标注 P0/P1/P2 |
| 没有依赖标注的路线图会卡住 | 列出跨团队/系统依赖 |

**Backlog 模式铁律**：

| 铁律 | 违反后果 |
| --- | --- |
| 任务 > 2 天 = 拆分不够 | 每个任务必须 ≤ 2 天 |
| 无来源的需求不是需求 | 每个需求注明来源（PRD/RICE/Roadmap） |

---

## 反合理化

| 你可能在想的 | 真相 |
| --- | --- |
| "这个功能肯定最重要" | "肯定"不是数据——用 RICE 分数证明 |
| "Impact 打 3 分没问题" | Impact 3 分 = 改变用户生活——90% 功能 ≤ 2 分 |
| "Confidence 都打 80%" | 无用户数据 = 50%，有访谈 = 80%，有 A/B = 100% |
| "路线图就是 Gantt 图" | 路线图是沟通工具，Gantt 是执行工具 |
| "每个功能都要精确日期" | 精确日期 = 虚假确定性。用范围（Q2、3月） |
| "这个任务大概 3-5 天" | "大概" = 没想清楚。拆到 ≤2 天 |
| "所有 P0 都这周做" | 容量不够时，P0 里也要排优先级 |

---

## Capability Index

| 维度 | CAN（可以做） | CANNOT → HANDOFF（不做，转交） |
|---|---|---|
| **任务类型** | RICE 评分排序、路线图规划（Timeline/Portfolio/Now-Next-Later）、Sprint Backlog 任务拆分、容量估算、INVEST 检查 | 战略目标设定 → pm-strategy-session；PRD 撰写 → pm-prd；决策权衡 → pm-decision；发布计划 → pm-launch |
| **输出格式** | inline Markdown（RICE 排序表 / 路线图三段式 / Sprint Backlog 表） | Gantt 图/项目管理工具导入 → 用户自行导出；甘特图可视化 → 可视化工具 |
| **深度范围** | 单次处理 1 个产品的 1 个模式；功能列表 ≤ 20 个（> 20 建议分批）；可链式 Prioritize → Roadmap → Backlog | 多产品组合规划 → 用户自行管理；跨团队资源协调 → 项目管理工具 |

**边界原则**：优先级是"数据驱动取舍"，不是"什么都重要"。所有估算标注 [假设]，低置信度项建议先验证。

---

## Mode 1: Prioritize — RICE 评分排序

**公式**: `RICE Score = (Reach × Impact × Confidence) / Effort`

### 维度定义与校准

| 维度 | 单位 | 评分范围 | 常见偏差 | 纠正规则 |
| --- | --- | --- | --- | --- |
| Reach | 人/季度 | 正整数 | 高估 | 用实际用户数，不是"潜在用户数" |
| Impact | 分数 | 3=Massive, 2=High, 1=Medium, 0.5=Low, 0.25=Minimal | 全打 2-3 | 3分="改变用户生活"，90% 功能 ≤ 2 |
| Confidence | 百分比 | 100%=High, 80%=Medium, 50%=Low | 全打 80% | 无数据=50%，有访谈=80%，有 A/B=100% |
| Effort | 人月 | 正数（最小 0.5） | 低估 | 宁可高估。0.5人月 = 1人2周 |

### 执行流程

1. 解析功能列表（≤ 20 个，> 10 个建议分批）
2. 对每个功能估算四维度（遵循校准规则）
3. 所有推断标注 [假设]
4. 计算 RICE 分数并排序
5. **自动检查**：Impact 全 ≥ 2 或 Confidence 全 ≥ 80% → 警告并建议校准

### 产出格式

| 排名 | 功能 | Reach | Impact | Confidence | Effort | RICE Score | 标注 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 功能 A | 5000 | 2 | 80% | 2 | 4000 | |
| 2 | 功能 B | 10000 | 1 | 50% | 3 | 1667 | [假设:Effort] |

### 高级选项（Expert 模式）

- **加权模式** — 自定义维度权重（如 Impact × 1.5）
- **对比模式** — 与上次排序对比，标注变化
- **敏感度分析** — Confidence ±20% 后排名是否变化
- **批量支持** — PRD 文件 → 提取功能列表 → 批量评分

---

## Mode 2: Roadmap — 路线图规划

路线图不是 Gantt 图，是沟通工具。核心原则：**路线图是承诺的边界，不是精确的时间表**。

### Entry Mode

**Quick（快速模式）** — ≤ 3 个问题：

1. "产品名称和时间范围？"
2. "最重要的 3-5 个功能或目标？"
3. （可选）"有什么硬约束？"

然后自动推断里程碑 → 标注 [假设] → 产出路线图。

**Guided（引导模式）** — 8 步：

1. 路线图目的（对齐/汇报/执行/沟通）
2. 时间范围（1Q/2Q/1Y/自定义）
3. 战略目标（1-3 个阶段目标）
4. 功能来源（PRD/RICE/直接输入/战略规划 → 自动启用 3H+OKR）
5. 资源约束（团队规模）
6. 依赖识别（跨团队/外部）
7. 里程碑划分（自动 → 用户确认）
8. 产出确认

**Expert 高级选项**：

| 选项 | 说明 |
| --- | --- |
| A. OKR 对齐 | 里程碑关联 Objective 和 Key Results |
| B. Now-Next-Later | 轻量三段式，不承诺时间 |
| C. 季度路线图 | 按季度 1-3 个主题 |
| D. 主题路线图 | 按主题（性能/体验/增长）组织 |
| E. 战略路线图 | 3H 模型 + OKR 对齐 |

### 路线图视图

| 视图 | 适用场景 | 结构 |
| --- | --- | --- |
| Timeline | 沟通节奏 | 按季度/月展示功能 |
| Portfolio | 战略对齐 | 按战略支柱分组 |
| Now-Next-Later | 敏捷团队 | 只表达相对顺序 |

### 产出格式

```markdown
# 产品路线图: [产品名]

> **时间范围**: [Q1-Q4 YYYY]
> **战略目标**: [1-3 个]

## Now（本季度）
| 功能 | 优先级 | 依赖 | 风险 |
| --- | --- | --- | --- |
| [功能 A] | P0 | [依赖] | [风险] |

## Next（下季度）
| 功能 | 优先级 | 依赖 | 风险 |
| --- | --- | --- | --- |
| [功能 B] | P1 | [依赖] | [风险] |

## Later（未来）
| 功能 | 优先级 | 备注 |
| --- | --- | --- |
| [功能 C] | P2 | [待验证] |
```

### Roadmap 常见错误

| 错误 | 正确做法 |
| --- | --- |
| 固定承诺 | 强调方向性，标注会调整 |
| 过度详细 | 近细远粗（Q1 月度，Q2+ 季度） |
| 缺少战略对齐 | 每项追溯到战略支柱 |
| 忽略维护 | 预留 15-20% 维护容量 |

---

## Mode 3: Backlog — Sprint 规划

从 PRD/RICE/Roadmap 提取需求，拆分为 Sprint backlog。

### INVEST 原则

| 字母 | 含义 | 检查 |
| --- | --- | --- |
| I | Independent | 可独立交付 |
| N | Negotiable | 实现方式可讨论 |
| V | Valuable | 对用户有价值 |
| E | Estimable | 团队能估算 |
| S | Small | ≤ 2 天 |
| T | Testable | 有完成标准 |

### 执行流程

1. 读取 PRD/RICE/Roadmap 中的需求项
2. 按优先级排序（P0 → P1 → P2）
3. 拆分为可执行任务（≤ 2 天，符合 INVEST，有明确完成标准）
4. 识别依赖关系
5. 估算 Sprint 容量：`人数 × 天数 × 70% 有效 × 80% 承诺`
6. 分配到 Sprint（按容量）
7. Iron Law 检查 + 产出

### 产出格式

```markdown
# Sprint Backlog: [产品名] - Sprint [N]

> **Sprint 周期**: [起止日期]
> **Sprint 目标**: [1-3 个目标]
> **容量**: [X] 人天（承诺 [Y] 人天）

## Sprint 目标
1. [目标 1]

## Backlog
| # | 任务 | 来源 | 优先级 | 估算(天) | 依赖 | 状态 |
|---|------|------|--------|----------|------|------|
| 1 | [任务描述] | PRD-US01 | P0 | 1 | 无 | Todo |

## 依赖关系
| 任务 | 依赖 | 阻塞风险 |
|------|------|----------|

## 风险
| 风险 | 缓解 |
|------|------|
```

---

## 总体执行流程

```
触发 pm-prioritize
    ├── 1. 模式检测（关键词 / --mode / 上下文推断）
    ├── 2. 模式路由
    │     ├── Prioritize → RICE 评分 → 排序表
    │     ├── Roadmap → 里程碑划分 → 路线图
    │     └── Backlog → 任务拆分 → Sprint 表
    ├── 3. Iron Law 检查（全局 + 模式专属）
    ├── 4. 标注检查（[假设] [待确认]）
    └── 5. 交付 + 建议下一步
          ├── Prioritize 结果 → 可进 Roadmap 或 Backlog
          ├── Roadmap 结果 → 可进 Backlog 拆任务
          └── Backlog 结果 → 可进 pm-launch 或 pm-prd
```

## 交付前检查（全局）

- [ ] 所有推断标注 [假设]，待确认项标注 [待确认]
- [ ] 功能列表来源已标注
- [ ] 依赖关系已列出
- [ ] 风险已标注（高/中/低）

### Prioritize 额外检查

- [ ] 四维度全部填写，RICE 分数计算正确
- [ ] Impact 未全部 ≥ 2（已校准）
- [ ] Confidence 未全部 ≥ 80%（已校准）

### Roadmap 额外检查

- [ ] 有明确时间范围，每个里程碑 1-3 个目标 + 优先级
- [ ] 里程碑依赖的技术路径已验证（非 Magic Step）

### Backlog 额外检查

- [ ] 每个任务 ≤ 2 天，符合 INVEST
- [ ] Sprint 容量合理（承诺 ≤ 80%），有 1-3 个 Sprint 目标

## Meta-Review

交付完成后对照方法论自审：

1. **方法论骨架**：是否遵循 模式检测 → 模式路由 → Iron Law 检查 → 标注检查 → 交付 的完整流程？
2. **反理实化警惕**：7 条"你可能在想的"（肯定最重要/Impact 打 3/Confidence 全 80%/路线图=Gantt/精确日期/大概 3-5 天/所有 P0 这周）是否真的被警惕了？
3. **Iron Law 验证**：全局 + 模式专属铁律是否已验证满足（数据支撑/缓冲预留/四维度填写/Effort ≥ 0.5/任务 ≤ 2 天）？

自审结果 1-2 句话附在交付物末尾。不通过时回到对应步骤修正。

## Evolution Writeback

执行后自问以下 3 个问题，有则记录到 `docs/evolution-log.md`：

1. **方法论偏差**：三模式（Prioritize/Roadmap/Backlog）的自动检测规则是否准确？校准规则（Impact/Confidence）是否贴合实际？
2. **反理实化补充**：是否发现新的"虚假确定性"借口模式？
3. **边界调整信号**：CAN/CANNOT 边界是否需要调整（如某模式频繁被转交）？

记录格式：`## YYYY-MM-DD — pm-prioritize — [模式/场景]`

无观察时跳过此章节，不强写。

## Metadata

```yaml
track: pm
phase: null
depends_on: []
feeds_to: []
schema_type: structured
persist_to: []
guardrails:
  - RICE 四维度必填，Effort ≥ 0.5 人月
  - Impact 校准：90% 功能 ≤ 2 分
  - Confidence 校准：无数据=50%，访谈=80%，A/B=100%
  - 路线图预留 10-20% 缓冲，Sprint 承诺 ≤ 80% 容量
  - Backlog 任务 ≤ 2 天，符合 INVEST
  - 所有推断标注 [假设]，低置信度建议验证
```
