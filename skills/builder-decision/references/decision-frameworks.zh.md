# Decision Frameworks

builder-decision 在 `compare_options` 与 `record_decision` 模式下推荐联合使用三个互补框架：MCDA 提供结构化评分、Reversibility Matrix 决定证据门槛、Cost of Delay 把时间紧迫性纳入权衡。三者覆盖"质量、风险、时间"三个维度，避免单一框架遮蔽判断。

本文件是 reference，不是 schema。决策记录的契约仍以 `memory/schemas/decision-memory.schema.md` 为准。

---

## 1. Multi-Criteria Decision Analysis（MCDA）

### 适用场景

- 选项数 ≥2 且各有显著取舍。
- 干系人对"什么最重要"存在分歧，需要把分歧显式化。
- 决策影响跨多个维度（用户价值、技术成本、风险、可逆性、战略契合度）。

### 步骤

1. **列出选项**：每项一句 summary，避免描述性堆砌。
2. **定义评估维度**：从用户价值、技术成本、风险、可逆性、战略契合度、运营复杂度中挑选 3-5 个最相关维度。维度之间必须相互独立（MECE 倾向）。
3. **赋权**：维度权重总和 = 100%。赋权过程本身要记录，因为权重决定结论。
4. **打分**：每个选项在每个维度上打 1-5 分，必须给一句话理由。
5. **加权汇总**：得分 = Σ（维度分数 × 权重）。
6. **敏感度检查**：挑出得分差距 <10% 的选项，验证权重微调是否会颠倒排序；若会，说明决策对权重敏感，需要升级证据门槛或拆分决策。

### 最小结构

```yaml
mcda:
  options:
    - id: A
      summary: "一句话描述"
    - id: B
      summary: "一句话描述"
  dimensions:
    - name: user_value
      weight: 35%
      rationale: "为什么这个维度占 35%"
    - name: technical_cost
      weight: 25%
      rationale: "..."
    - name: risk
      weight: 20%
      rationale: "..."
    - name: reversibility
      weight: 10%
      rationale: "..."
    - name: strategic_fit
      weight: 10%
      rationale: "..."
  scores:
    - option: A
      user_value: { score: 4, reason: "..." }
      technical_cost: { score: 3, reason: "..." }
      risk: { score: 4, reason: "..." }
      reversibility: { score: 5, reason: "..." }
      strategic_fit: { score: 3, reason: "..." }
      weighted_total: 3.65
    - option: B
      user_value: { score: 5, reason: "..." }
      technical_cost: { score: 2, reason: "..." }
      risk: { score: 2, reason: "..." }
      reversibility: { score: 2, reason: "..." }
      strategic_fit: { score: 4, reason: "..." }
      weighted_total: 3.45
  sensitivity:
    margin: 0.20
    weight_shift_reverses_ranking: false
    notes: "选项 A 在权重 ±10% 微调下排序稳定"
```

### 反模式

- **维度过多**：超过 5 个维度会让赋权变成数字游戏。砍到 3-5 个最关键维度。
- **权重隐藏**：只给总分不给权重，无法审查。权重必须显式。
- **理由缺失**：分数无理由，等于主观打分包装成客观分析。每个 score 必须配 reason。
- **MCDA 替代决策**：MCDA 是辅助工具，最终决策仍需人类判断。若 MCDA 结论与直觉强烈冲突，先调查直觉来源，不要直接服从分数。

---

## 2. Reversibility Matrix（可逆性矩阵）

### 核心区分

| 门类型 | 特征 | 证据门槛 | 决策速度 |
|---|---|---|---|
| **Two-way door（双向门）** | 可回滚、可撤销、影响范围小、试错成本低 | 低 — 少量证据即可 | 快 — 默认行动 |
| **One-way door（单向门）** | 不可逆、影响重大、撤回成本高或不可能撤回 | 高 — 必须强证据 + 多视角验证 | 慢 — 默认延迟 |

### 应用规则

1. **先判断门类型**：每个决策先问"如果我错了，多久能发现？回滚成本多大？"
2. **双向门 → 加速**：可逆决策不应过度分析。设置明确的实验窗口（如 2 周试点），直接行动。
3. **单向门 → 延迟与挑战**：不可逆决策必须：
   - 至少 3 个独立信息源
   - 列出"什么证据会让我改变主意"（falsification trigger）
   - 寻求反对意见（disagreement ritual）
   - 设置 `decision_owner` 与 `revisit_by`
4. **混合门 → 拆分**：很多决策表面上是单向门（如"重写系统"），实际可以拆成一系列双向门（"先抽一个模块重写，看效果再扩展"）。拆分能把单向门转双向门。

### 最小结构

```yaml
reversibility:
  door_type: one_way | two_way | mixed
  reasoning: "为什么这么判断"
  rollback_cost: low | medium | high | impossible
  time_to_detect_failure: "1 周 / 1 月 / 1 季度"
  if_one_way:
    independent_sources_needed: 3
    falsification_trigger: "什么证据会改变决策"
    disagreement_sought: true | false
    decision_owner: "@someone"
    revisit_by: "2026-09-30"
  if_two_way:
    experiment_window: "2 周"
    success_metric: "如何判断是否继续"
    stop_condition: "什么信号触发回滚"
```

### 反模式

- **所有决策都按单向门处理**：导致组织僵化，可逆决策被过度分析。
- **所有决策都按双向门处理**：导致草率，不可逆决策被轻率执行。
- **门类型事后才清楚**：必须事前显式判断，并在决策记录中保留判断依据。

---

## 3. Cost of Delay（CoD = Value / Time）

### 公式

```
Cost of Delay（每周）= 预期每周交付价值（用户价值 + 收入 + 战略价值）
CD3 优先级 = Cost of Delay ÷ 实现工期
```

CD3 高的项目应优先做，因为它每延迟一周损失最大。

### 适用场景

- 多个候选决策有时间维度竞争（"先做 A 还是先做 B"）。
- 候选决策的"价值实现窗口"有限（市场窗口、合规截止、用户承诺）。
- 资源约束下需要比较"做这个 vs 做那个"的机会成本。

### 不适用场景

- 决策本身不涉及时间竞争（如"产品哲学声明"）。
- 无法估算每周价值（探索性研究、基础能力建设）。此时不要伪造 CoD 数字。

### 最小结构

```yaml
cost_of_delay:
  weekly_value_estimate:
    user_value: "高 / 中 / 低 + 一句话依据"
    revenue_or_cost_saving: "数字 + 来源"
    strategic_value: "高 / 中 / 低 + 一句话依据"
    total_weekly_cod: "约 5 万 / 周（区间：3-8 万）"
  implementation_duration: "6 周（区间：4-8 周）"
  cd3_priority: 0.83
  value_window:
    type: open | time_boxed | regulatory
    deadline: "2026-09-30"
    decay_after_deadline: "deadline 后每周价值衰减 30%"
  confidence: low | medium | high
  confidence_reasoning: "依据来源"
```

### 反模式

- **伪精确**：把 CoD 写成"每周损失 12,347 元"，制造虚假精确感。CoD 估算本质是区间，必须给区间。
- **忽略 confidence**：高 CoD 但 low confidence 与中等 CoD 但 high confidence 优先级不同。必须标注置信度。
- **CoD 替代战略判断**：CoD 是排序工具，不是战略本身。高 CoD 的事情若与长期方向不符，仍不应做。

---

## 4. 三个框架的联合应用顺序

### 推荐序列

```
1. Reversibility Matrix 判断门类型
   ├─ Two-way door → 加速，跳过 MCDA（直接试错）
   ├─ One-way door → 进入步骤 2
   └─ Mixed → 拆分成多个 Two-way door 序列

2. 若 One-way door，用 MCDA 在多个选项间做结构化权衡
   ├─ 得分差距 ≥10% → 采纳高分选项（敏感度检查通过）
   └─ 得分差距 <10% → 用 Cost of Delay 作为 tiebreaker

3. 若 MCDA 平手，用 Cost of Delay 决定时间优先级
   ├─ CD3 高的优先
   └─ 若 CoD 估算 confidence 低，回退到"先做信息收集小实验"
```

### 联合结构（写入决策记录）

```yaml
decision_frameworks_applied:
  reversibility:
    door_type: one_way
    reasoning: "..."
  mcda:
    applied: true
    top_option: A
    margin: 0.05
    sensitivity_note: "权重微调可能逆转，已升级证据门槛"
  cost_of_delay:
    applied: true
    cd3_priority: 0.83
    confidence: medium
  final_decision: "选择 A，但先做 2 周小规模试点验证关键假设"
  framework_conflict_resolution: "MCDA 倾向 A，CoD 倾向 B（因 B 工期短）。决策：A，但用试点压缩不确定性"
```

### 框架冲突的处理原则

- **MCDA vs CoD 冲突**：默认以 MCDA 为主，CoD 为 tiebreaker。但若 CoD confidence 高且窗口紧迫，可逆转。
- **Reversibility vs MCDA 冲突**：若决策是单向门，Reversibility 优先——即使 MCDA 高分，单向门高风险也需要更强证据。
- **所有框架 vs 直觉冲突**：先调查直觉的来源。若直觉来自隐性知识（领域经验），可能值得推翻框架；若来自情绪（恐惧、兴奋），不应作为决策依据。

---

## 5. 与 builder-decision 输出契约的对应

| 决策记录字段 | 对应框架产出 |
|---|---|
| `options_considered` | MCDA 的 options 列表 |
| `tradeoffs` | MCDA 的 dimensions + 每个选项的 reason |
| `decision_criteria` | MCDA 的 dimensions + weights |
| `reversal_conditions` | Reversibility Matrix 的 `falsification_trigger` + `stop_condition` |
| `assumptions` | 所有框架的 `confidence` + `confidence_reasoning` |
| `revisit_by` | Reversibility 的 `revisit_by` + CoD 的 `value_window.deadline` |

---

## 参考

- `memory/schemas/decision-memory.schema.md` — 决策记录的黄金标准 schema
- `skills/builder-decision/SKILL.md` — Skill 入口与输出契约
- Amazon 的"One-way and Two-way Doors"决策框架（Jeff Bezos 2016 letter）
- CD3（Cost of Delay Divided by Duration）源自 Don Reinertsen 的《The Principles of Product Development Flow》
