---
name: pm-prd
displayName: PRD
displayDescription: 撰写或改进产品需求文档，支持测试计划和工程需求单
description: "Write or improve Product Requirements Documents, with optional test plans and engineering requests. Use this skill whenever the user wants to create, review, refine, or iterate on a PRD — including saying 'write PRD', 'help with PRD', '需求文档', '写PRD', 'product requirements', 'feature spec', or describing a product feature they want to build. Also trigger on: 'test plan', '测试计划', '验收测试', 'QA plan', '用户测试', '可用性测试', 'engineering request', '开发任务', 'Jira ticket', '工程需求', '需求单'. Use --include-acceptance flag to add a Test Plan & Acceptance Criteria section. Use --eng-request flag to output an Engineering Request instead of a full PRD."
user-invocable: true
argument-hint: "[产品/功能名称或描述] [--include-acceptance] [--eng-request]"
---

# PRD 编写

<SUBAGENT-STOP>
如果是子代理派发执行此 Skill，直接按下方指令执行，不重新加载入口 Skill。
</SUBAGENT-STOP>

引导产出结构化的产品需求文档。PRD 不是文档，是合约——它连接 PM 的思考和工程的执行。

**核心原则**：模糊的 PRD 比没有 PRD 更危险。

**输出模式**（通过参数或触发词自动选择）：
- **默认**：标准 PRD 文档
- `--include-acceptance`：PRD 附加测试计划与验收标准章节
- `--eng-request`：工程需求单（替代完整 PRD，面向开发交付）

## Intent Packet

| 字段 | 捕获内容 | 来源 |
|---|---|---|
| **Want** | 把产品想法转化为开发可执行的需求合约（PRD / 工程需求单） | 用户输入剥离"写文档"后的问题本质 |
| **Constraints** | 技术栈限制、时间窗口、合规边界、已有系统依赖 | 用户明示 + 项目 CLAUDE.md 推断 |
| **Context Sources** | 上游 PRD / Feature Frame / Discovery Report / Roadmap / 用户原话 | Glob + Read 项目文档；pipeline 模式引用上游 Output Packet |
| **Depth** | Low-fi（2-4 页，对齐用）/ High-fi（8-15 页，交付用）| 用户声明或从使用场景推断，默认 High-fi |
| **Output Target** | PRD 模式 → 全干系人；`--eng-request` → 开发团队；`--include-acceptance` → QA + 开发 | 用户明示或从 flag 推断 |

未提供时标注 `[假设]`，交付前确认。

## Iron Law（铁律）

| 铁律 | 违反后果 |
| --- | --- |
| 没有"为什么"的 PRD 不是 PRD | 立即停止——补充 Problem Statement 和 Why Now 后继续 |
| 每个 User Story 必须有验收标准 | 立即停止——补全 Given-When-Then 后继续 |
| 没有成功指标的 PRD 无法验证 | 立即停止——定义 >= 1 个可量化成功指标 **及其测量方法**后继续 |
| P0 功能验收标准必须 100% 有测试覆盖 | 立即停止——P0 不能有测试缺口 |

## 反合理化

| 你可能在想的 | 真相 |
| --- | --- |
| "用户说了需求，直接写" | 用户说的是解决方案，不是问题——先验证问题存在 |
| "这个功能大家都需要" | "大家都需要" != "大家愿意付钱/花时间"——用数据证明 |
| "PRD 写完就交" | 写完 -> Iron Law 检查 -> 标注 -> 交付，缺一不可 |
| "技术细节让开发自己决定" | PM 必须定义约束边界，否则开发会按最容易的方式实现 |
| "竞品这么做，我们也应该" | 竞品这么做 != 对你的用户正确——回归用户问题验证 |
| "开发者自己测过了" | 开发者测的是"能跑"，不是"用户能用" |
| "时间紧，跳过测试" | 上线后发现的 bug 修复成本是测试的 10-100 倍 |
| "验收标准写太细了" | 越细越不容易做偏。"功能正常" 不是验收标准 |

## Capability Index

| 维度 | CAN（可以做） | CANNOT → HANDOFF（不做，转交） |
|---|---|---|
| **任务类型** | 撰写 PRD、生成工程需求单、派生测试计划与验收标准 | 竞品对比分析 → pm-comp；优先级排序 → pm-prioritize；可视化原型 → pm-prototype |
| **输出格式** | Markdown PRD 文档（默认 / `--include-acceptance` / `--eng-request`） | docx/pdf/pptx → pm-content-general；高保真交互原型 → pm-prototype |
| **深度范围** | 从 Problem Statement 到 User Stories + 验收标准 + 依赖风险 | 技术架构深挖 → pm-code-architect；Go/No-Go 决策 → pm-decision |

**边界原则**：PRD 是合约不是愿望清单。一旦需求确认进入实施级细节，立即转交 pm-code-architect。

## 保真度级别

根据使用场景选择 PRD 深度，不同保真度影响输出结构和详细程度：

| Level | 适用场景 | 预期篇幅 | 受众 |
|-------|---------|---------|------|
| **Low-fi** | 团队讨论、快速对齐、早期想法验证 | 2-4 页 | 产品、设计 |
| **High-fi** | 工程开发、正式交付、干系人评审 | 8-15 页 | 全部干系人 |

保真度选择逻辑：
- 用户明确指定 -> 按指定
- 对话上下文表明在探索阶段 -> Low-fi
- 对话上下文表明准备开发 -> High-fi
- 不确定 -> 先问

## Entry Mode

### Guided（引导模式）— 预计 8-10 个问题

**Step 1: 产品背景** — "这个产品/功能解决什么问题？谁会用它？"
-> 记录 Problem、Target User

**Step 2: 为什么是现在** — "为什么现在做这个而不是 6 个月后？有什么外部变化？"
-> 记录 Why Now、Market Context

**Step 3: 成功指标** — "你怎么知道这个产品成功了？请选择：A. 用户增长 B. 收入增长 C. 用户留存 D. 运营效率 E. 其他"
-> 记录 Success Metrics + 测量方法（数据来源、计算方式、频率）

**Step 4: 目标用户** — "核心用户是谁？他们的典型场景是什么？"
-> 记录 Target User、Use Cases

**Step 5: 功能范围** — "第一期需要哪些功能？（逐个列出，我会帮你区分 P0/P1/P2）"
-> 记录 Features、优先级

**Step 6: 非功能需求** — "有性能、安全、合规方面的特殊要求吗？（如无特殊要求，将使用默认值）"
-> 记录 NFR（默认：响应 < 2s，99.9% 可用）

**Step 7: 依赖与风险** — "这个功能依赖哪些外部系统或团队？你知道哪些风险？"
-> 记录 Dependencies、Risks

**Step 8-9: User Stories + 验收标准**
基于前 7 步自动生成 User Stories（As a... I want to... So that...）+ Given-When-Then 验收标准 -> 用户确认

**Step 10: 评审确认**
展示完整 PRD -> 用户最终确认 -> 交付

### Quick（快速模式）— <= 3 个问题后直接产出

**问题 1**: "产品/功能名称和一句话描述？"
**问题 2**: "核心用户和他们的主要问题？"
**问题 3**: "第一期最重要的 3 个功能？"

然后：
- 自动推断 Problem Statement、Why Now、NFR
- 自动生成 User Stories + 验收标准
- 所有推断标注 [假设]，自动填充标注 [默认]
- 产出 PRD 草稿，包含 [待确认] 标记

### Expert（专家模式）— 直接产出 + 方法论推理骨架

基于上下文直接产出完整 PRD。根据产品类型自动选择推理骨架：

| 产品类型 | 推理骨架 | 推理逻辑 |
| --- | --- | --- |
| B2B 企业功能 | Working Backwards | 从客户新闻稿 -> FAQ -> User Stories。强迫先想客户怎么描述价值 |
| B2C 消费端功能 | JTBD | 从用户要完成的"任务"出发。防止"功能堆砌" |
| 平台/基础设施 | Lean Canvas | 从问题-解决方案-独特价值开始。验证商业逻辑先于功能设计 |
| AI 原生功能 | 假设驱动 | 先列"如果 AI 能做 X"的假设 -> 验证方法 -> 再写需求 |
| 不确定 | 标准 PRD | 默认模板，包含所有最小必要字段 |

**高级选项**（用户可覆盖自动选择）：
A. Amazon Working Backwards | B. Lean Canvas PRD | C. JTBD PRD | D. 假设驱动 PRD | E. 标准 PRD | F. 自定义模板

推理骨架如何影响产出：
- Working Backwards -> PRD 先写 Press Release 和 FAQ，User Stories 从 FAQ 衍生
- JTBD -> PRD 先写 Job Statements，功能列表是 Job 的解决方案
- Lean Canvas -> PRD 以 9 格画布为骨架，填充后再展开
- 假设驱动 -> PRD 嵌入假设列表和验证计划，每个功能关联一个假设

每种骨架的详细定义和使用方法，见 `references/methodology-skeletons.md`。

## Scope Gate（范围门控）— 在任何执行之前必须先通过

**此检查在模式判断、保真度选择、任何输出之前执行。违反以下任一规则时，不得进入任何模式，不得生成任何 PRD 内容。**

### 硬拒绝（立即停止，不生成任何 PRD 内容）

| 请求类型 | 信号词/特征 | 正确响应 |
| --- | --- | --- |
| 用 AI 替代某个职业的全部工作 | "替代PM"、"替代产品经理"、"AI取代"、"不要PM了"、"全自动" | **硬拒绝**："这个请求超出了 PRD 的范畴。AI 无法替代产品经理的全部工作——PM 的核心价值在于理解用户、做取舍决策、跨团队协调。我可以帮你设计'AI辅助PM提升效率'的具体功能，但不能帮你设计'让PM下岗'的系统。" |
| 从零设计完整系统（前端+后端+数据库+支付+...） | 10+ 功能模块 + "一期全部上线" | **硬拒绝**："这个范围不是单个PRD能覆盖的——这是一个完整产品矩阵。我帮你从最核心的3个模块开始定义MVP，其余进入backlog分阶段规划。" |
| 荒谬/不现实的前提 | "火星上的"、"永动机"、"预测股票"、"读心术" | **硬拒绝**：指出前提不现实，回到可行的产品定义范围 |
| 生成代码、部署系统、黑客攻击 | "写代码"、"部署"、"攻击" | 拒绝 -> 回到产品定义层面讨论 |
| 包含违法、不道德内容的请求 | | 明确拒绝 |

**硬拒绝的执行方式**：
1. **第一句话就拒绝**，不说"我来帮你"或"好的"
2. 解释为什么拒绝（1-2句话）
3. 提供替代方向（1个可行的重新框定）
4. **不生成任何 PRD 内容**

### 软质疑（先质疑，用户确认后才继续）

| 请求类型 | 质疑方向 |
| --- | --- |
| 功能多但范围合理（5-9个模块） | 质疑是否可以分阶段，建议MVP聚焦 |
| 小规模场景用重型 AI 方案 | 质疑 ROI，提供替代方案 |
| 没有明确用户/场景的"帮我写个PRD" | 反问澄清，不直接假设 |

### 判断流程

```
收到请求
  -> 硬拒绝检查（第1优先级）
    -> 匹配硬拒绝 -> 立即拒绝 + 解释 + 替代方向 -> 结束（不进入任何模式）
    -> 不匹配 -> 软质疑检查
      -> 匹配软质疑 -> 先质疑 -> 用户确认后才继续
      -> 不匹配 -> 正常进入模式判断
```

**关键原则**：
- **先拒绝再讨论**，不是"先说好的再质疑"
- 拒绝的第一句话必须是否定，不能以肯定开头
- 每次拒绝后提供 1 个可行的替代方向

## 执行流程

```
触发 pm-prd
    |-- 0. Scope Gate（范围门控）
    |     |-- 检测请求是否在 PM 工作范畴内
    |     |-- 超范围 -> 拒绝并解释原因，建议替代路径
    |     +-- 在范围内 -> 继续
    |-- 1. 输出模式判断
    |     |-- --eng-request 或触发词匹配 -> 工程需求单模式
    |     +-- 默认或 --include-acceptance -> PRD 模式
    |-- 2. 模式判断（Guided/Quick/Expert）
    |     +-- 根据用户输入量和明确度自动判断
    |-- 3. 确定保真度（Low-fi/High-fi）
    |     +-- 根据使用场景和受众判断
    |-- 4. 读取上下文
    |     |-- Glob 搜索项目已有文档
    |     |-- Read 相关 PRD/Roadmap/Research
    |     +-- 提取对话中的关键信息
    |-- 5. 按模式 x 保真度 x 输出模式执行
    |     |-- PRD 模式: 按 PRD 模板产出
    |     |-- --include-acceptance: 附加测试计划章节（见附录 A）
    |     +-- --eng-request: 按工程需求单模板产出（见附录 B）
    |-- 6. Iron Law 检查
    |     |-- Problem Statement + Why Now 是否存在？
    |     |-- 每个 User Story 是否有验收标准？
    |     |-- 是否有可量化成功指标？
    |     +-- P0 功能验收标准是否有测试覆盖？
    |-- 7. 标注检查（[默认] [假设] [待确认]）
    +-- 8. 交付 + 后续推荐
          |-- pm-comp（竞品分析）、pm-prioritize（优先级细化）
          +-- pm-prototype（原型，--fidelity=low 可做线框图）
```

## 输出规范

**格式铁律**：PRD 作为文档类产出，在对话中直接输出为 Markdown。不得包含 `<generative-ui-widget>`、`<style>` 等无法在 Markdown 渲染中正确显示的标签。不将 PRD 包裹在代码围栏（```` ```markdown ``` ````）中。所有可视化内容用 Markdown 原生语法（表格、列表、引用块）表达。Agent 的解释性说明放在 PRD 内容之前或之后，与 PRD 正文明确分隔。若用户要求导出为 docx/pdf 等格式，按目标格式处理。

PRD 必须使用 `references/prd-template.md` 中的模板结构。核心章节：

### 必填章节（所有保真度）

1. **TL;DR** — 3 句话：核心问题、解决方案、成功指标
2. **问题陈述** — 谁、什么、为什么现在、不解决的后果
3. **目标和成功指标** — 指标表格（指标/基线/目标/时间框架/测量方式）+ 护栏指标
4. **解决方案概述** — 方案描述 + 关键功能列表 + 用户旅程
5. **范围边界** -- 范围内 / 范围外 / 未来迭代
6. **残酷风险区** — 牺牲了什么 + 最大失败风险 + 防御方案

### 高保真额外章节

7. **功能需求** — 用户故事 + Given-When-Then 验收标准 + 边缘情况
8. **技术考虑** — 性能/平台/集成/数据要求
9. **依赖和风险** — 依赖表 + 风险缓解表
10. **时间线和里程碑** — 分阶段里程碑
11. **FAQ** — 挑战关键假设的问答

### 标注系统

| 标注 | 含义 |
|------|------|
| `[假设]` | 基于推断的内容，需要用户确认 |
| `[默认]` | 自动填充的默认值，用户可覆盖 |
| `[待确认]` | 需要进一步讨论的开放问题 |

---

## 附录 A：测试计划与验收标准（--include-acceptance）

当使用 `--include-acceptance` 标志时，在 PRD 的功能需求章节后附加以下测试计划章节。从 PRD 的 User Stories 和 Acceptance Criteria 派生测试用例。

### 测试覆盖策略

| 优先级 | 覆盖范围 | 测试类型 |
| --- | --- | --- |
| P0 | 100% 全覆盖 | 手动 + 自动 |
| P1 | 核心路径覆盖 | 手动为主 |
| P2 | 探索性抽检 | 探索性测试 |

### 附加章节模板

```markdown
## 测试计划

> **关联 PRD**: [PRD 路径]
> **测试范围**: P0 全覆盖，P1 核心路径，P2 抽检
> **通过标准**: P0 全部通过 + P1 >=90% 通过

### 测试用例
| # | User Story | 测试项 | 类型 | 前置条件 | 测试步骤 | 预期结果 | 优先级 |
|---|------------|--------|------|----------|----------|----------|--------|
| 1 | US-01 | 正向：正常流程 | 手动 | [条件] | [步骤] | [结果] | P0 |
| 2 | US-01 | 边界：空输入 | 自动 | [条件] | [步骤] | [结果] | P0 |
| 3 | US-01 | 异常：网络断开 | 手动 | [条件] | [步骤] | [结果] | P1 |

### 测试环境
| 环境 | 要求 |
|------|------|
| 测试数据 | [描述] |
| 账号 | [描述] |

### 测试风险
| 风险 | 影响 | 缓解 |
|------|------|------|
```

### 测试计划交付前检查

- [ ] 每个 User Story 有对应测试用例
- [ ] 包含正向 + 边界 + 异常测试
- [ ] 测试用例有明确的前置条件和预期结果
- [ ] 按 P0/P1/P2 排序
- [ ] 通过标准已定义
- [ ] P0 功能 100% 测试覆盖

---

## 附录 B：工程需求单模式（--eng-request）

当使用 `--eng-request` 标志时，**不输出完整 PRD**，而是输出以下工程需求单。从已有的 PRD 或用户输入中提取需求，生成面向开发的结构化需求单。

### 需求类型

| 类型 | 说明 | 优先级范围 |
| --- | --- | --- |
| Feature | 新功能 | P0-P2 |
| Bugfix | 缺陷修复 | P0-P1 |
| Spike | 技术调研 | P1-P2 |
| Investigation | 问题排查 | P0-P2 |

### 工程需求单模板

```markdown
# 工程需求: [功能名]

**Request ID**: ENG-[XXX]
**Priority**: P0/P1/P2
**Type**: Feature/Bugfix/Spike/Investigation
**Requested By**: [PM]

## 元数据
| 字段 | 值 |
|------|-----|
| 优先级 | P0/P1/P2 |
| 关联 PRD | [路径] |
| Sprint | [目标 Sprint] |
| 标签 | [功能标签] |

## 背景
[为什么做这个需求，用户问题是什么。自包含，不依赖 PRD]

## 需求描述
[做什么，功能范围。具体到开发可执行]

## 验收标准
- [ ] Given [前置条件] When [操作] Then [预期结果]
- [ ] Given [前置条件] When [操作] Then [预期结果]
- [ ] Given [异常场景] When [操作] Then [预期错误处理]

## 技术约束
| 约束 | 要求 |
|------|------|
| 性能 | [响应时间/吞吐量] |
| 安全 | [认证/授权] |
| 兼容 | [浏览器/版本] |

## 依赖
| 依赖 | 团队 | 状态 |
|------|------|------|
| [依赖 1] | [团队] | 已沟通/待沟通 |

## 估时
| 任务 | 估时 | 置信度 |
|------|------|--------|
| [任务 1] | [X 天] | 高/中/低 |

**[待确认]** [需要开发确认的估时和技术方案]
**[假设]** [推断的内容，需要验证]
```

### 工程需求单交付前检查

- [ ] 背景说明清晰（为什么做）— 自包含，不依赖 PRD
- [ ] 需求描述具体（做什么）— 开发可执行
- [ ] 验收标准 Given-When-Then 可直接测试
- [ ] 依赖已列出且标注沟通状态
- [ ] 推断项标注 [假设]
- [ ] 估时标注置信度

---

## Gates

| Gate | 位置 | 通过条件 | 失败处理 |
|---|---|---|---|
| **G1: 范围门** | Scope Gate 后（Step 0） | 请求不匹配硬拒绝场景；软质疑已用户确认或排除 | Pause→硬拒绝场景停止；Nudge→软质疑场景 1 问确认后继续 |
| **G2: 模式匹配门** | Step 1-2 后 | 输出模式（PRD/eng-request/include-acceptance）+ Entry Mode + 保真度三者已确定 | Pause→模式不确定时必须先问，不默认 Expert |
| **G3: 上下文完整门** | Step 4 后 | 已读上游 packet / 项目已有 PRD / 用户提供的背景；Problem Statement 有数据或用户原话支撑 | Risk→缺失标注 `[假设]`；Pause→完全无上下文时回到 Step 2 Guided |
| **G4: Iron Law 门** | Step 6 后 | 4 条铁律全部验证：Why 存在、User Story 有验收标准、成功指标可量化、P0 测试覆盖 | Pause→缺哪条补哪条，不进入标注检查 |
| **G5: 标注门** | Step 7 后 | 所有推断标 `[假设]`、自动填充标 `[默认]`、开放问题标 `[待确认]` | Pause→未标注项必须补标 |
| **G6: 一致性门** | 交付前 | User Journey ⊆ In Scope；功能引用自洽；指标可追溯；风险缓解可执行（对照 quality-gates-shared.md §一） | Pause→违反任一条立即修正后才能交付 |

Gate 失败 ≠ 终止：标注原因 → 回到对应步骤修正 → 最多重试 2 次 → 仍失败向用户报告。

## 交付前检查（通用）

- [ ] Problem Statement 清晰且基于用户问题（非解决方案）
- [ ] Why Now 有具体的外部变化或数据支撑
- [ ] 成功指标可量化（数字 + 时间范围）且有明确测量方法
- [ ] User Stories 使用标准格式（As a... I want to... So that...）
- [ ] 每个 User Story 有 >= 1 个 Given-When-Then 验收标准
- [ ] 功能范围有明确的 P0/P1/P2 优先级
- [ ] 依赖和风险已列出
- [ ] 所有推断已标注 [假设]，自动填充已标注 [默认]
- [ ] 后续推荐已列出（基于 PRD 内容的上下文感知推荐）
- [ ] **User Journey / 使用流程中每个步骤都在 In Scope 有对应功能**
- [ ] **输出中无 Magic Step**（对照 `references/quality-gates-shared.md` 触发词表检查）
- [ ] **如有触发词，【技术实现猜想】已补充**
- [ ] **每个风险项的缓解措施 >= 1 句可执行描述**（不是"持续监控"）

更完整的质量检查标准见 `references/quality-checklist.md`。
实际 PRD 案例参考见 `references/examples.md`。

## 常见错误

| 错误 | 后果 | 正确做法 |
| --- | --- | --- |
| 只测正常流程 | 遗漏边界和异常 | 每个功能 3 类测试（正向+边界+异常） |
| 验收标准模糊 | "功能正常"不可测试 | 用 Given-When-Then |
| 无背景说明 | 开发不理解 Why | 需求单自包含背景 |
| 不标注依赖 | 被阻塞才知道 | 列出所有外部依赖 |
| 估时太乐观 | 排期不准 | 粗估 + 标注置信度 |
| 测试用例太笼统 | 无法执行 | 具体：步骤+预期结果 |
| 自己测自己 | 盲点遗漏 | 交叉测试或找非开发人员 |

## 后续推荐

根据 PRD 内容推荐下一步行动：

| 场景 | 推荐 Skill |
|------|-----------|
| 需要竞品参考 | pm-comp |
| 需要优先级排序 | pm-prioritize |
| 需要可视化 | pm-prototype (--fidelity=low 可做线框图) |
| 需要技术方案 | pm-code-architect |
| 需要决策记录 | pm-decision |

## Output Packet

- **artifact_path**: `docs/prd/[feature-name].md`（或工程需求单路径）
- **artifact_type**: `prd` / `eng_request` / `prd_with_acceptance`
- **key_decisions**: [Why Now 结论 + P0 功能集 + 成功指标 ≤ 3 条]
- **open_assumptions**: [标注 `[假设]` 的待验证项列表]
- **next_skill_hint**: `pm-code-architect`（需要技术方案拆解）/ `pm-prototype`（需要可视化）/ `pm-prioritize`（需要优先级细化）
- **handoff_context**: 下游需要但不在 PRD 正文中的上下文（如被否决的备选方案、Scope Gate 拒绝记录、用户口头补充的约束）

**下游消费方式**：pm-code-architect 的 Intent Packet "Context Sources" 字段引用此 packet 的 `artifact_path` 和 `key_decisions`。

## Meta-Review

交付完成后对照方法论自审：

1. **方法论骨架**：是否遵循 Scope Gate → 模式判断 → 上下文读取 → 执行 → Iron Law → 标注 → 交付的完整流程？所选 Entry Mode 和推理骨架是否贴合产品类型？
2. **反理实化警惕**：8 条"你可能在想的"是否真的被警惕了？（重点检查"用户说了需求直接写"、"这个功能大家都需要"、"技术细节让开发自己决定"）
3. **Iron Law 验证**：4 条铁律（Why / 验收标准 / 成功指标 / P0 测试覆盖）是否已验证满足？

**扩展问题（pipeline skill）**：Output Packet 的 `key_decisions` 是否可追溯到 Iron Law 和 Scope Gate 的判定？

自审结果 1-2 句话附在交付物末尾。不通过时回到对应步骤修正，不在 Meta-Review 阶段打补丁。

## Evolution Writeback

执行后自问以下 3 个问题，有则记录到 `docs/evolution-log.md`：

1. **方法论偏差**：Scope Gate / Entry Mode / 推理骨架选择是否有不够贴合实际的地方？（如某 Entry Mode 经常被跳过、某类产品类型没有合适的骨架）
2. **反理实化补充**：是否遇到了表格未覆盖的新借口模式？
3. **边界调整信号**：CAN/CANNOT 是否需要调整？（如某类需求本应转交但被硬撑）

**记录格式**：

```markdown
## YYYY-MM-DD — pm-prd — [项目/场景]
- **观察**: [一句话描述]
- **建议回写**: [回写到哪个文件/章节 / "仅记录不回写"]
- **置信度**: 高/中/低
```

无观察时跳过此章节，不强写。

## Metadata

```yaml
track: pm
phase: 2
depends_on: [pm-feature-frame, pm-prototype]
feeds_to: [pm-code-architect]
schema_type: free
persist_to:
  - docs/prd/
guardrails:
  - 没有"为什么"的 PRD 不是 PRD——必须先有 Problem Statement + Why Now
  - P0 功能验收标准必须 100% 有测试覆盖
  - Scope Gate 硬拒绝场景不生成任何 PRD 内容
```
