---
name: pm-discovery
displayName: 产品探索
displayDescription: 端到端产品探索：从洞察到验证
description: "Orchestrate end-to-end product discovery from raw idea to validated opportunity with quality gates at every phase. Use this skill whenever the user needs to validate a product idea, says '产品发现', 'discovery', '从想法到验证', 'idea validation', '想法验证', '产品探索', 'opportunity assessment', '机会评估', '要不要做', '值不值得做', or wants to run a structured discovery process. Also trigger when the user says 'I have an idea', 'should we build this', 'validate this concept', 'explore this opportunity', '帮我验证一下这个想法', or '这个值不值得做'. Chains problem-framing, persona, competitive analysis, and go/no-go decision into a single four-phase pipeline."
user-invocable: true
argument-hint: "[产品/功能名称或想法描述]"
---

# 产品发现工作流

<SUBAGENT-STOP>
如果是子代理派发执行此 Skill，直接按下方指令执行，不重新加载入口 Skill。
</SUBAGENT-STOP>

从"有个想法"到"确认值得做"的端到端产品发现工作流。编排四个阶段，每阶段通过质量门控后进入下一阶段。

## Intent Packet

| 字段 | 捕获内容 | 来源 |
|---|---|---|
| **Want** | 判断一个想法是否值得投入资源做（验证 ≠ 实施） | 用户输入剥离"我要做 X"后的问题本质 |
| **Constraints** | 时间预算、已有数据、技术栈限制 | 用户明示 + 项目 CLAUDE.md 推断 |
| **Context Sources** | 项目 README / 决策记录 / 用户原话 / 市场资料 | Glob + Read 项目文档 |
| **Depth** | Draft（快速直觉判断）/ Review（4 阶段完整跑）/ Release（含 Loophole 检测） | 用户声明或推断，默认 Review |
| **Output Target** | 决策者（自己或团队）做 Go/No-Go 判断 | 用户明示或推断 |

未提供时标注 `[假设]`，交付前确认。

## Iron Law

| 铁律 | 违反后果 |
| --- | --- |
| 问题定义未通过门控前，禁止进入方案讨论 | 立即停止——回到 Phase 1 |
| 每个阶段产出必须通过质量门控才可进入下一阶段 | 立即停止——修正当前阶段产出 |

## 反合理化

| 你可能在想的 | 真相 |
| --- | --- |
| "先做再说，不需要验证" | 没验证的想法 = 昂贵的赌博。Discovery 防止做错事 |
| "我都知道答案了" | 你知道的是假设。假设不验证 = 偏见 |
| "4 个阶段太慢了" | 跳过阶段省的时间 < 做错产品浪费的时间 |
| "竞品分析不需要" | 不知道竞品在做什么 = 不知道差异化在哪 |
| "直接写 PRD 吧" | 没有问题定义的 PRD = 没有根基的建筑 |

## Capability Index

| 维度 | CAN（可以做） | CANNOT → HANDOFF（不做，转交） |
|---|---|---|
| **任务类型** | 问题定义、用户画像、竞品分析、Go/No-Go 决策 | 写 PRD → pm-prd；写代码 → pm-code-implement；写高保真原型 → pm-prototype |
| **输出格式** | Markdown 报告（problem-statement / personas / competitive-analysis / discovery-report） | docx/pptx/HTML 原型 → pm-content-general 或 pm-prototype |
| **深度范围** | 从"有个想法"到"明确的 Go/No-Go + 行动项" | 已有 PRD 需要迭代 → pm-prd；需要技术可行性深挖 → pm-code-architect |

**边界原则**: Discovery 的产物是"判断"而非"实施"。一旦 Go 决策做出，立即转交下游 skill；不在 Discovery 阶段编写实施级文档。

## 工作流阶段

### Phase 1: 问题定义
**调用 Skill**: pm-feature-frame
- 从对话上下文提取想法核心描述
- 产出结构化 Problem Statement
- **门控**: 问题有数据支撑 + 受影响用户已量化 + 根因已分析

### Phase 2: 用户画像
**调用 Skill**: pm-feature-frame（问题验证 + 用户定义）
- 输入 Phase 1 的 Target Users
- 产出 3-7 个用户画像，含痛点和场景
- **门控**: 画像有痛点 ≥ 1 个/画像 + Primary Persona 已识别

### Phase 3: 竞品分析
**调用 Skill**: pm-comp
- 基于问题定义和画像确定竞品搜索方向
- 产出竞品对比矩阵 + 差异化空间
- **门控**: 有差异化结论 + 每个结论有来源 + 差异化空间已识别

### Phase 4: 可行性判断
**调用 Skill**: pm-decision
- 整合 Phase 1-3 全部产出
- 评估维度：用户价值 × 市场空间 × 可行性
- 产出明确的"做/不做/暂缓"建议 + 行动项
- **门控**: 决策有依据 + ≥ 2 个方案被评估 + 行动项有负责人

## Gates

| Gate | 位置 | 通过条件 | 失败处理 |
|---|---|---|---|
| **G1: 问题定义门** | Phase 1 后 | 问题有数据支撑 + 受影响用户已量化 + 根因已分析（5 Whys 到底层） | Pause→回到 Phase 1 补充数据；Risk→标注 `[假设]` 进入 Phase 2 但交付前必须补齐 |
| **G2: 用户画像门** | Phase 2 后 | 每个画像 ≥ 1 个痛点 + Primary Persona 已识别 | Pause→补充画像访谈或二手研究；Nudge→如果画像数 < 3 提示用户确认是否继续 |
| **G3: 竞品差异化门** | Phase 3 后 | 有差异化结论 + 每个结论有来源 + 差异化空间已识别 | Pause→补充竞品样本；Risk→样本 < 3 个时标注置信度低 |
| **G4: 决策出口门** | Phase 4 后 | 决策有依据 + ≥ 2 个方案被评估 + 行动项有负责人 + Go/No-Go 明确 | Pause→必须产出明确决策，不允许"再想想" |

Gate 失败 ≠ 终止：标注原因 → 回对应 Phase → 最多重试 2 次 → 仍失败向用户报告。

## 产出物

| 产出物 | 路径 |
| --- | --- |
| 问题定义文档 | `docs/discovery/problem-statement.md` |
| 用户画像文档 | `docs/discovery/personas.md` |
| 竞品分析报告 | `docs/discovery/competitive-analysis.md` |
| 产品发现报告 | `docs/discovery/discovery-report.md` |

## Discovery 日志

每次执行后更新 `docs/discovery/discovery-log.md`：
- 结论（Go/No-Go/暂缓）
- 关键洞察（≤ 3 条）
- 待验证假设
- 下次关注信号

### 日志格式

```markdown
# Discovery Log

## 2026-04-15 — {项目名}
- **结论**: Go / No-Go / 暂缓
- **关键洞察**: {≤ 3 条}
- **待验证假设**: {列出}
- **下次关注信号**: {列出}

---
```

### 习惯追踪

每次 Discovery 执行时，自动检查日志并显示进度：

1. **读取日志** — 扫描 `docs/discovery/discovery-log.md`
2. **计算本周活跃度** — 本周完成的 Discovery 次数
3. **显示进度**：
   ```
   📊 Discovery 本周进度: X 次发现
   上次发现: {日期} — {项目名} ({结论})
   建议: {基于当前项目阶段的下一个验证动作}
   ```

---

Discovery 方法论详解（5 Whys 根因分析、门控标准、验证技巧）见 `references/discovery-methods.md`。

## 常见错误

| 错误 | 后果 | 正确做法 |
| --- | --- | --- |
| 跳过问题定义 | 做了没人要的东西 | 先验证问题存在 |
| 只看数据不看用户 | 错过真实动机 | 数据 + 用户访谈结合 |
| 竞品分析太浅 | 同质化竞争 | 深挖竞品策略和用户评价 |
| Discovery 无限循环 | 永远不开始做 | 最多 2 周完成全部 4 阶段 |
| 跳过 Go/No-Go | 稀里糊涂开始做 | 必须产出明确决策 |

## 交付前检查

- [ ] 4 个 Phase 的产出物均通过对应 Gate（G1-G4）
- [ ] Discovery Report 包含明确的 Go/No-Go/暂缓 结论（不允许"再想想"）
- [ ] 所有标注 `[假设]` 的项已在交付前与用户确认
- [ ] Discovery 日志已更新（结论 + 关键洞察 + 待验证假设）

## Output Packet

- **artifact_path**: `docs/discovery/discovery-report.md`
- **artifact_type**: `discovery-report`
- **key_decisions**: [Go/No-Go/暂缓 + 核心理由 ≤ 3 条]
- **open_assumptions**: [标注 `[假设]` 的待验证项列表]
- **next_skill_hint**: `pm-feature-frame`（若 Go）→ 把 Problem Statement 和 Primary Persona 作为下游 Context Sources
- **handoff_context**: 下游需要但不在报告正文中的上下文（如被否决的备选方案、用户口头补充的约束）

**下游消费方式**：pm-feature-frame 的 Intent Packet "Context Sources" 字段引用此 packet 的 `artifact_path` 和 `key_decisions`。

## Meta-Review

交付完成后对照方法论自审：

1. **方法论骨架**：4 个 Phase 是否都跑完了？每个 Phase 产出是否对应方法论要求（问题定义→画像→竞品→决策）？
2. **反理实化警惕**：表格中"先做再说"/"我都知道答案了"/"竞品分析不需要"等借口是否真的被警惕了？
3. **Iron Law 验证**：每条铁律（问题未通过门控前禁止方案讨论；每阶段产出必须通过质量门控）是否已验证满足？

**扩展问题（pipeline skill）**：Output Packet 的 `key_decisions` 是否可追溯到 Iron Law 和 4 个 Gate 的判定？

自审结果 1-2 句话附在交付物末尾。不通过时回到对应 Phase 修正，不在 Meta-Review 阶段打补丁。

## Evolution Writeback

执行后自问以下 3 个问题，有则记录到 `docs/evolution-log.md`：

1. **方法论偏差**：4 Phase 骨架是否有不够贴合实际的地方？（如某 Phase 经常被跳过、某 Gate 经常触发失败）
2. **反理实化补充**：是否遇到了表格未覆盖的新借口模式？
3. **边界调整信号**：CAN/CANNOT 是否需要调整？（如某类需求本应转交但被硬撑）

**记录格式**：

```markdown
## YYYY-MM-DD — pm-discovery — [项目/场景]
- **观察**: [一句话描述]
- **建议回写**: [回写到哪个文件/章节 / "仅记录不回写"]
- **置信度**: 高/中/低
```

无观察时跳过此章节，不强写。

## Metadata

```yaml
track: pm
phase: 0
depends_on: []
feeds_to: [pm-feature-frame, pm-prd, pm-decision]
schema_type: enforced
persist_to:
  - docs/discovery/problem-statement.md
  - docs/discovery/personas.md
  - docs/discovery/competitive-analysis.md
  - docs/discovery/discovery-report.md
  - docs/discovery/discovery-log.md
guardrails:
  - 问题定义未通过 G1 前禁止进入方案讨论
  - Discovery 最长 2 周，避免无限循环
  - 必须产出明确 Go/No-Go，不允许"再想想"
```
