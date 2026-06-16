# Skill Template — SKILL.md 权威蓝本

> 所有 SKILL.md 的创建和更新参照此模板。新 skill 创建时复制此文件并填入具体内容。
> 标注 `[REQUIRED]` 的章节必须有；`[OPTIONAL]` 按需添加；`[UNIVERSAL]` = 所有 skill 必须有。

---

## 章节顺序总览

```
[YAML Frontmatter]           [REQUIRED]  所有 skill 必有
# [Skill Name]               [REQUIRED]
<SUBAGENT-STOP>              [REQUIRED]  子 Agent 派发时跳过入口逻辑
[1-2 句目的陈述]             [REQUIRED]

## Intent Packet             [14/16]     形式化用户意图捕获（reference 类豁免）
## Iron Law                  [REQUIRED]  铁律表格
## 反理实化                   [REQUIRED]  借口警惕表格
## Capability Index          [UNIVERSAL] 显式能力边界 + 转交规则
## Scope Gate                [OPTIONAL]  有硬拒绝需求的 skill
## Entry Mode                [OPTIONAL]  多模式 skill（Guided/Quick/Expert）
## 执行流程                   [REQUIRED*] 简单 skill 可省
## Gates                     [OPTIONAL]  分支多的 skill 的决策检查点
## 输出规范                   [OPTIONAL]  结构化输出 skill
## 交付前检查                 [REQUIRED]  pre-delivery 自检
## Output Packet             [8/16]      pipeline skill 专用（链式传递）
## Evidence Packet           [OPTIONAL]  Builder/Release 类完成证据
## Sensor Gates              [OPTIONAL]  确定性检查与传感器门禁
## Goal Suitability          [OPTIONAL]  是否适合自驱目标执行
## Eval Notes                [OPTIONAL]  Skill 变更评测说明
## Meta-Review               [UNIVERSAL] post-delivery 方法论自审（含 packet 审计）
## Evolution Writeback       [UNIVERSAL] 轻量观察回写
## 后续推荐                   [OPTIONAL]  被 Output Packet 部分替代
## Metadata                  [REQUIRED]  统一 YAML 字段
```

---

## YAML Frontmatter [REQUIRED]

```yaml
---
name: pm-skill-name
displayName: 显示名
displayDescription: 一句话描述
description: "英文触发词描述，含 user-invocable 的 argument-hint 和所有触发信号"
user-invocable: true
argument-hint: "[参数提示]"
---
```

**约束**：`name` 与目录名一致；`description` 含所有触发词（中英文）。

---

## Intent Packet [14/16]

形式化现有的 `**输入**` 声明。剥离解决方案描述，提取问题本质。

```markdown
## Intent Packet

| 字段 | 捕获内容 | 来源 |
|---|---|---|
| **Want** | 用户想达成什么（一句话，剥离解决方案） | 用户输入剥离方案后 |
| **Constraints** | 硬性限制（技术栈/时间/合规） | 用户明示 + 项目 CLAUDE.md 推断 |
| **Context Sources** | 上下文文件路径 | Glob + Read 项目文档 |
| **Depth** | Draft / Review / Release | 用户声明或推断 |
| **Output Target** | 产出给谁看、用于什么场景 | 用户明示或推断 |

未提供时标注 `[假设]`，交付前确认。
```

**豁免**：pm-ai-patterns, pm-agent-patterns（reference 类，无执行流程）。

---

## Iron Law [REQUIRED]

```markdown
## Iron Law

| 铁律 | 违反后果 |
|---|---|
| [不可跳过的规则] | [违反时的具体动作] |
```

**约束**：每条铁律的"违反后果"必须是可执行的动作（如"立即停止——补充 X 后继续"），不是"质量下降"等模糊后果。

---

## 反理实化 [REQUIRED]

```markdown
## 反理实化

| 你可能在想的 | 真相 |
|---|---|
| [合理化借口] | [为什么是错的] |
```

**约束**：补齐到所有 16 个 skill（当前 14/16）。

---

## Capability Index [UNIVERSAL]

显式声明 CAN / CANNOT / HANDOFF，合并 Agent boundaries（#7）。

```markdown
## Capability Index

| 维度 | CAN（可以做） | CANNOT → HANDOFF（不做，转交） |
|---|---|---|
| **任务类型** | [2-4 项核心能力] | [不做的事 + 转交目标 skill] |
| **输出格式** | [支持的产出格式] | [不支持的 + 替代方案] |
| **深度范围** | [能覆盖的范围] | [超出时如何降级或转交] |

**边界原则**：宁可显式拒绝并指向更合适的 skill，不在能力边界外硬撑。
```

---

## Scope Gate [OPTIONAL]

有硬拒绝需求的 skill 才加（如 pm-prd, pm-deconstruct, pm-discovery, pm-launch）。

```markdown
## Scope Gate

| 场景 | 处理方式 |
|---|---|
| [硬拒绝场景] | hard-refuse（第一句明确拒绝，不铺垫） |
| [软质疑场景] | soft-question（≤1 个问题确认后继续） |
```

---

## Entry Mode [OPTIONAL]

多模式 skill 才加（如 pm-prd, pm-prototype, pm-comp）。

```markdown
## Entry Mode

| 模式 | 触发条件 | 输出差异 |
|---|---|---|
| **Guided** | [触发信号] | [输出特点] |
| **Quick** | [触发信号] | [输出特点] |
| **Expert** | [触发信号] | [输出特点] |
```

---

## 执行流程 [REQUIRED*]

```markdown
## 执行流程

[ASCII 流程图或编号步骤]

Step 1: [动作]
Step 2: [动作]
Step 3: [动作]
```

简单 skill（如 pm-decision, pm-prioritize）可省，用自然语言描述代替。

---

## Gates [OPTIONAL]

分支多、有关键决策点的 skill 才加。含 Dynamic Cards（#8）的 Pause/Risk/Nudge。

```markdown
## Gates

| Gate | 位置 | 通过条件 | 失败处理 |
|---|---|---|---|
| G1: 入口验证 | Step 1 后 | [条件] | Pause→修正 / Risk→标注 / Nudge→提示 |
| G2: 中途验证 | Step N 后 | [条件] | [动作] |
| G3: 出口验证 | 交付前 | [条件] | [动作] |

Gate 失败 ≠ 终止。失败时：标注原因 → 回到对应步骤修正 → 最多重试 2 次 → 仍失败向用户报告。
```

**适用 skill**（7/16）：pm-discovery, pm-deconstruct, pm-prototype, pm-prd, pm-code-review, pm-code-implement。

---

## 输出规范 [OPTIONAL]

结构化输出 skill 才加（10/16 已有）。

```markdown
## 输出规范

[产出物的结构模板，含必需章节和字段]
```

---

## 交付前检查 [REQUIRED]

pre-delivery 自检清单。

```markdown
## 交付前检查

- [ ] [检查项 1]
- [ ] [检查项 2]
- [ ] [检查项 3]
```

**约束**：补齐到所有 16 个 skill（当前 15/16）。

---

## Output Packet [8/16]

pipeline skill 专用（有上下游链式关系的）。终端 skill（comp/launch/content/decision/prioritize/job-search）不加。

```markdown
## Output Packet

- **artifact_path**: [产出物文件路径]
- **artifact_type**: [problem_statement / feature_frame / prd / architecture / code_diff / ...]
- **key_decisions**: [本次产出的关键决策，≤ 3 条]
- **open_assumptions**: [标注 [假设] 的待验证项]
- **next_skill_hint**: [推荐的下游 skill + 触发条件]
- **handoff_context**: [下游 skill 需要知道但不在产出物中的上下文]

**下游消费方式**：下游 skill 的 Intent Packet "Context Sources" 字段应引用此 packet。
```

**适用 skill**（8/16）：pm-discovery, pm-feature-frame, pm-prototype, pm-prd, pm-code-architect, pm-code-implement, pm-code-review。

---

## Evidence Packet [OPTIONAL]

Builder / Release / Review 类 skill 在声明完成时使用。目标是把"做完了"改成"有证据证明达标"。

```markdown
## Evidence Packet

| 证据类型 | 必填 | 证据 |
|---|---|---|
| **Files changed / artifacts** | 是 | [文件路径 / artifact_path / 报告路径] |
| **Checks run** | 是 | [命令 + 关键输出；未运行则说明原因] |
| **Manual verification** | 按需 | [浏览器/截图/交互路径/人工检查项] |
| **Open risks** | 是 | [未验证项、降级项、需要人工审查点] |
| **Completion claim** | 是 | PASS / PARTIAL / BLOCKED + 1 句话理由 |
```

**使用原则**：
- 没有证据，不写 PASS。
- 不能运行检查时，必须写出具体原因和可复现的人工验证步骤。
- 对话中只摘要关键证据；详细日志可放到 artifact 或报告文件。

---

## Sensor Gates [OPTIONAL]

用于把"必须每次都对"的检查交给 checklist / script / test / hook，而不是靠模型自觉。

```markdown
## Sensor Gates

| Sensor | 触发条件 | 检查方式 | 失败处理 |
|---|---|---|---|
| **Spec Coverage** | 需求/设计/代码交付 | 对照 PRD / Feature Frame / Design Brief | Pause -> 补齐或标注缺口 |
| **Fake UI** | UI/原型/前端实现 | 检查按钮、文案、提示是否对应真实行为 | Pause -> 移除假功能或实现真实逻辑 |
| **Fake Test** | 声称已测试 | 检查断言是否证明真实行为 | Pause -> 重写测试或降级完成声明 |
| **Build/Test** | 代码变更 | typecheck / lint / unit / build / smoke | Pause -> 修复根因；3 次失败停手重审 |
| **Privacy/Security** | 发布/集成/权限变更 | secrets、PII、权限、日志、构建产物扫描 | Block -> 修复后重新验证 |
```

**约束**：Sensor Gate 不替代 Iron Law。Iron Law 定义不可破坏的原则；Sensor Gate 定义如何检查。

---

## Goal Suitability [OPTIONAL]

当 skill 支持 goal-driven execution 或整段委托时使用。目标是判断任务是否适合自驱，而不是把不清楚的产品决策交给模型猜。

```markdown
## Goal Suitability

| 条件 | 适合自驱 | 不适合自驱 |
|---|---|---|
| **目标清晰度** | 目标、范围、完成标准可写成证据 | 需求还在探索，需要用户判断 |
| **验证方式** | 有命令、文件、截图、清单可验证 | 只能靠主观满意度判断 |
| **风险边界** | 不涉及生产配置、权限、资金、隐私高风险 | 涉及高风险且无人工审批 |
| **任务耦合** | 可独立完成，不依赖并行决策 | 多方决策未定、范围持续变化 |
```

**输出要求**：适合时给出 goal packet；不适合时给出需要先澄清的产品/业务决策。

Goal packet 最小字段：
- **objective**
- **scope**
- **non_goals**
- **constraints**
- **verifiable_completion_criteria**
- **checks_to_run**
- **expected_evidence**
- **stop_conditions**

---

## Eval Notes [OPTIONAL]

修改 skill 本身、模板、触发描述、共享门禁时使用。目标是让 skill 变更有评测证据，而不是只靠感觉。

```markdown
## Eval Notes

- **Change type**: new skill / skill behavior change / trigger description change / reference update
- **Should-trigger examples**: [2-3 个真实用户请求]
- **Should-not-trigger examples**: [2-3 个相邻但不应触发的请求]
- **Quality checks**: [人工评审点或脚本断言]
- **Regression risk**: [可能影响的 skill / workflow]
```

**升级规则**：若变更会改变 skill 触发、输出契约、handoff 或安全边界，至少准备 2 个正例和 2 个反例。

---

## Meta-Review [UNIVERSAL]

post-delivery 方法论自审，区别于 pre-delivery 检查。检查方法论应用是否正确，不是再查需求。

```markdown
## Meta-Review

交付完成后，对照本 skill 的方法论自审：

1. **方法论骨架**：产出是否遵循了本 skill 声明的方法论？（非"写完了"而是"按对的方法写完了"）
2. **反理实化警惕**：表格中的"你可能在想的"是否真的被警惕了？（对照检查）
3. **Iron Law 验证**：每条铁律是否已验证满足？（非"应该满足"而是"已验证满足"）

pipeline skill 额外审计：Output Packet 的 `key_decisions` 是否真的反映了本次关键取舍？

自审结果以 1-2 句话附在交付物末尾。不通过时回到对应步骤修正。
```

---

## Evolution Writeback [UNIVERSAL]

轻量观察回写。有则记录，无则跳过。

```markdown
## Evolution Writeback

每次执行后，捕获可回写到方法论/KB 的观察。不是每条都必须回写——只捕获有复用价值的。

执行完毕时自问以下 3 个问题，有则记录到 `docs/evolution-log.md`：

1. **方法论偏差**：本次执行中，skill 的方法论骨架是否有不够贴合实际的地方？
2. **反理实化补充**：是否遇到了反理实化表格未覆盖的新借口模式？
3. **边界调整信号**：是否有应该 CAN 但做了 CANNOT 的情况（或反之）？

**记录格式**（写入 `docs/evolution-log.md`）：

\`\`\`markdown
## YYYY-MM-DD — [Skill Name] — [项目/场景]
- **观察**: [一句话描述]
- **建议回写**: [回写到哪个文件/章节 / "仅记录不回写"]
- **置信度**: 高/中/低
\`\`\`

无观察时跳过此章节，不强写。
```

---

## Metadata [REQUIRED]

统一 YAML 字段。补齐到所有 16 个 skill（当前 8/16 有，但字段不一致）。

```yaml
## Metadata

```yaml
track: pm | engineering | cross-cutting | specialized | personal
phase: 0 | 1 | 2 | 3 | 4 | null    # null = 不属于特定 phase
depends_on: [skill_name, ...]        # 上游 skill
feeds_to: [skill_name, ...]          # 下游 skill（pipeline 类才有）
schema_type: enforced | free
persist_to: [path, ...]              # 产出物持久化路径
guardrails:
  - [guardrail 1]
  - [guardrail 2]
```

**新增字段**：`phase`（从 README.md 移入 frontmatter 级别）、`feeds_to`（声明链式下游）。旧 skill 的现有字段保留，新增字段为可选补充。
