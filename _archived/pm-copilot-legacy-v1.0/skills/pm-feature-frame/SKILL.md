---
name: pm-feature-frame
displayName: 特性构想
displayDescription: 从想法到可原型的构想，自适应复杂度
description: "From problem to prototype-ready conception. Use this skill whenever the user needs to define WHAT to build — says 'feature frame', 'feature list', '功能构想', '特性设计', 'what to build', 'user flow', 'magic moment', '画原型之前先想想', or has a problem/idea but hasn't specified what the product should do. Also trigger when the user says 'define the problem', '问题定义', '真问题', 'is this a real problem', 'we need X', or starts discussing a feature without articulating why — help validate the problem first, then conceive the feature. This skill combines problem validation (5 Whys, evidence check) with feature conception (Magic Moment, User Flow, Edge Cases). Supports three complexity tiers: Simple (200-300 words), Standard (500-800 words), Complex (1000-1500 words). Output feeds directly into pm-prototype."
user-invocable: true
argument-hint: "[问题陈述 / PRD链接 / 项目描述]"
---

# 特性构想（Feature Frame）

<SUBAGENT-STOP>
如果是子代理派发执行此 Skill，直接按下方指令执行，不重新加载入口 Skill。
</SUBAGENT-STOP>

从"知道问题"到"可以画原型"——用一个自适应构想桥接。

**为什么需要这个 Skill**：PRD 太重（动辄几千字），脑子里的想法太轻（一句话）。AI 时代的 PM 需要一个中间态：足够具体让 AI 工具生成原型，足够轻量让你不抗拒写。

## Intent Packet

| 字段 | 捕获内容 | 来源 |
|---|---|---|
| **Want** | 定义"要做什么"（WHAT），介于问题验证与原型生成之间的构想层 | 用户输入剥离"我要做 X"后的问题本质 |
| **Constraints** | 复杂度信号（单功能/多页面/多阶段）、字数上限、扩展章节需求 | 用户明示 + 描述关键词推断 |
| **Context Sources** | 上游 pm-discovery 产出（如刚完成）、项目背景、已有 PRD 片段 | 上游 Output Packet + 用户输入 |
| **Depth** | Draft（Quick 模式直觉判断）/ Review（Guided 5 问）/ Release（Expert + Complex 扩展章节） | 用户声明或 Entry Mode 推断 |
| **Output Target** | pm-prototype（直接喂入）或 pm-prd（需正式文档化时） | 用户明示或推断 |

未提供时标注 `[假设]`，交付前确认。

## 复杂度分级

生成前先判断产品复杂度，决定 Frame 的深度和字数上限：

| 复杂度 | 信号 | 字数上限 | 额外章节 |
| --- | --- | --- | --- |
| **Simple** | 单一功能/页面，<3 个用户角色，线性流程 | 200-300 字 | 无 |
| **Standard** | 多页面/视图，3-7 个核心交互，单一用户角色 | 500-800 字 | Screen Inventory |
| **Complex** | 多角色/多 Agent/多阶段，状态机驱动，>7 个视图 | 1000-1500 字 | Entity Map + Screen Inventory + State Machine |

**判断逻辑**（自动执行，在输出开头标注）：

```
输入描述
 ├── 检测到多阶段/多 Agent/状态机 → Complex
 ├── 检测到多页面但单流程 → Standard
 └── 单一功能点 → Simple
```

检测关键词（按优先级）：
- **Complex 信号**：Phase / Agent / 工作流 / 状态机 / 多角色 / Gate / 审批流 / 企业级 / 编排 / 数字孪生
- **Standard 信号**：Dashboard / 多页面 / Tab / 列表+详情 / 后台管理 / 多视图
- **Simple 信号**：单个页面 / 一个功能 / 登录页 / 表单

用户可显式指定复杂度（`--complexity=simple|standard|complex`），覆盖自动判断。

## Iron Law

| 铁律 | 违反后果 |
| --- | --- |
| 没有用户的问题不是问题 | 立即停止——明确受影响的用户群体后继续 |
| 没有 Magic Moment 的构想没有灵魂 | 停下来找——如果说不清用户什么时候会 "wow"，说明还没想透 |
| 字数超标 = 你在写 PRD | 按复杂度分级上限砍——Feature Frame 只捕获构想，不捕获实现细节 |
| 没说"不做什么" = 什么都想做 | 补充 Non-Goals——砍功能比加功能更重要 |
| 用户流 >7 步 = 你在画流程图 | 合并——核心路径只保留 3-7 步，分支放 Edge Cases |
| Complex 产品跳过扩展章节 = 原型无法覆盖全貌 | Entity Map / Screen Inventory / State Machine 至少写一个 |

## 反合理化

| 你可能在想的 | 真相 |
| --- | --- |
| "我脑子里已经有了" | 脑子里的 ≠ 可执行的。写下来才能发现漏洞 |
| "先写 PRD 再说" | PRD 是构想成熟后的文档化，不是构想本身。先想清楚再写文档 |
| "直接画原型更快" | 没构想的原型 = 反复改方向。5 分钟写 Frame 省你 2 小时返工 |
| "300 字说不清楚" | 简单功能 300 字够了。复杂产品用 Complex 模式，上限 1500 字——但每句话都要有用 |
| "功能列表就够了" | 列表 ≠ 构想。需要流程和边界，不只是名字 |
| "扩展章节太重了" | 不是每节都写——只写对原型生成最关键的 1-2 个。比 PRD 轻得多 |

## Capability Index

| 维度 | CAN（可以做） | CANNOT → HANDOFF（不做，转交） |
|---|---|---|
| **任务类型** | 问题验证（简化 5 Whys）、Magic Moment 设计、User Flow 构想、Edge Cases 识别、Non-Goals 划界 | 写 PRD → pm-prd；画原型 → pm-prototype；竞品分析 → pm-comp |
| **输出格式** | Feature Frame Markdown（Simple/Standard/Complex 三档） | HTML/React 原型 → pm-prototype；docx/pptx → pm-content-general |
| **深度范围** | 从"有想法/有问题描述"到"可喂给 pm-prototype 的结构化构想"（≤1500 字） | 已有 PRD 需要迭代 → pm-prd；需要技术可行性深挖 → pm-code-architect |

**边界原则**：Feature Frame 是构想的轻量载体，不是 PRD。一旦构想稳定且需要正式文档化，立即转交 pm-prd。

## Entry Mode

### Guided（引导模式）— 5+ 个问题，预计 3-10 分钟

**Step 0: Problem Validation（前置问题验证）**

如果用户没有经过 pm-discovery 或没有明确的问题定义，先快速验证：

1. 问："你观察到的现象是什么？（不要包含解决方案）"
   → 检查是否混入方案 → 如果混入，剥离方案，保留现象
2. 问："谁遇到了这个问题？多久一次？严重吗？"
   → 记录：用户群体 + 频率(每天/每周/偶尔) + 严重程度(阻塞/严重/轻微)
3. 简化 5 Whys（≤ 3 层追问）→ 触达根因
4. 证据强度评估：强（多源数据）/ 中（单一来源）/ 弱（仅直觉）
   → 弱证据标注 [待验证]

如果用户已经有明确的问题定义（如刚完成 pm-discovery），跳过 Step 0，直接进入 Q1。

**Q1: Problem→Outcome**
问："用户现在遇到什么问题？用了你的产品之后，什么改变了？"
→ 格式："用户现在 [痛点]，使用后 [期望结果]"
→ 检查：Outcome 是否可感知（用户能直接感受到的变化）

**Q2: Magic Moment**
问："用户在什么时候会觉得'哇，这真好用'？描述那个瞬间。"
→ 格式：Before（之前状态）→ Trigger（触发动作）→ Aha（顿悟瞬间）→ After（之后状态）
→ 检查：Aha 是否与 Outcome 直接相关
→ 如果用户说不出：追问"如果只能保留一个功能，你最想让用户体验到什么？"

**Q3: User Flow**
问："从打开产品到体验到 Magic Moment，用户需要走几步？"
→ 格式：编号步骤列表，3-7 步
→ 检查：步骤是否线性（分支单独记录到 Edge Cases）
→ 提示：第 1 步通常是"进入/打开"，最后 1 步是"完成/得到结果"

**Q4: Edge Cases**
问："什么情况下流程会不一样？（异常、分支、不同用户角色）"
→ 格式：每个分支 1 句话（条件 → 不同行为）
→ 限制：3-5 个，挑最重要的
→ 如果没有明显的：追问"新用户和老用户的体验一样吗？""网络断了怎么办？"

**Q5: Non-Goals**
问："这次明确不做的是什么？"
→ 格式：列出 2-3 个相关但排除的功能/场景
→ 检查：Non-Goals 是否真的是"相关但排除"（不是完全不相关的废话）

**Q6+（仅 Complex 模式）**：根据复杂度信号，选择性地追问：
- "系统中有哪些核心实体？它们之间什么关系？"→ Entity Map
- "用户会在哪些页面/视图之间切换？"→ Screen Inventory
- "产品有哪些关键状态？什么触发状态切换？"→ State Machine

### Quick（快速模式）— 用户给描述，AI 填充 5 要素

用户提供了项目/产品描述（一段话、bullet points、甚至口头描述），AI 从中提取并结构化为 Feature Frame。

执行：
1. 从用户描述中提取 Problem、Outcome、核心流程线索
2. 判断复杂度（Simple / Standard / Complex）
3. 补充缺失要素（Magic Moment 推断、Edge Cases 常见模式、Non-Goals 从范围推断）
4. Complex 模式下，额外提取 Entity Map / Screen Inventory / State Machine
5. 展示完整 Feature Frame
6. 标注 `[推断]` 让用户知道哪些是 AI 补充的，需要确认

### Expert（专家模式）— AI 从上下文生成

用户在对话中已讨论过需求/问题/方案（如刚完成 pm-discovery），AI 从对话上下文直接生成 Feature Frame。

执行：
1. 从对话历史提取：问题、用户、场景、关键需求
2. 判断复杂度
3. 生成完整 Feature Frame（5 要素全覆盖 + Complex 扩展章节）
4. 展示给用户确认，标注信息来源

## Feature Frame 模板

### Simple / Standard 模板

```markdown
# Feature Frame: [产品/功能名称]

> 复杂度: Simple | Standard

## Problem→Outcome
[用户现在遇到什么问题] → [使用后期望的结果]

## Magic Moment
- **Before**: [用户在使用前的状态/困扰]
- **Trigger**: [用户执行的关键动作]
- **Aha**: [那个 "wow" 的瞬间]
- **After**: [体验后的状态/改变]

## User Flow
1. [步骤1 — 通常是进入/开始]
2. [步骤2]
3. [步骤3 — 通常包含 Magic Moment 的触发]
4. [步骤4]
5. [步骤5 — 通常是完成/得到结果]

## Edge Cases
- [条件A] → [不同行为A]
- [条件B] → [不同行为B]
- [条件C] → [不同行为C]

## Non-Goals
- [相关但本次不做的 X] — [原因]
- [相关但本次不做的 Y] — [原因]

<!-- Standard 模式额外章节 -->
## Screen Inventory（Standard 及以上）
| 页面/视图 | 目的 | 核心交互 | 优先级 |
| --- | --- | --- | --- |
| [页面1] | [1 句话目的] | [关键操作] | P0/P1 |
```

### Complex 模板

```markdown
# Feature Frame: [产品/功能名称]

> 复杂度: Complex — [判断信号：多 Agent / 多阶段 / 状态机 / ...]

## Problem→Outcome
[用户现在遇到什么问题] → [使用后期望的结果]

## Magic Moment
- **Before**: [用户在使用前的状态/困扰]
- **Trigger**: [用户执行的关键动作]
- **Aha**: [那个 "wow" 的瞬间]
- **After**: [体验后的状态/改变]

## User Flow（核心路径）
1. [步骤1]
2. [步骤2]
3. ...
（核心路径 ≤7 步；分支流程放 Edge Cases 或 State Machine）

## Edge Cases
- [条件A] → [不同行为A]
- [条件B] → [不同行为B]
- [条件C] → [不同行为C]

## Non-Goals
- [相关但本次不做的 X] — [原因]
- [相关但本次不做的 Y] — [原因]

## Entity Map（Complex 可选）
核心实体及其关系——让原型生成时数据结构一致。

| 实体 | 关键字段 | 关系 | 在原型中的体现 |
| --- | --- | --- | --- |
| [实体A] | [3-5 个核心字段] | → [关联实体] | [哪个页面使用] |
| [实体B] | [3-5 个核心字段] | ← [被关联] | [哪个页面使用] |

## Screen Inventory（Complex 可选）
| 页面/视图 | 目的 | 核心交互 | 优先级 |
| --- | --- | --- | --- |
| [页面1] | [1 句话目的] | [关键操作] | P0 |
| [页面2] | ... | ... | P0 |
| [页面3] | ... | ... | P1 |

## State Machine（Complex 可选）
关键状态转换——让原型理解流程驱动的逻辑。

```
[状态A] --[触发条件]--> [状态B] --[触发条件]--> [状态C]
   ↑                                         |
   └──────────── [回退条件] ←─────────────────┘
```

| 状态 | 含义 | 进入条件 | 离开条件 | 原型中的视觉表现 |
| --- | --- | --- | --- | --- |
| [状态A] | [1 句话] | [触发] | [触发] | [颜色/标签/组件变化] |
```

## Magic Moment 设计指南

Magic Moment 是整个 Feature Frame 的灵魂——它决定了原型的差异化记忆点。

**好的 Magic Moment**：
- 可演示（Demo 时能直接展示）
- 与核心 Outcome 因果相关（不是独立的花哨功能）
- 5 秒内能感知（用户不需要学习就能感受到）

**差的 Magic Moment**：
- "整体体验很流畅" — 太模糊，没有瞬间感
- "AI 自动帮用户做了很多事" — 没有具体场景
- "界面很好看" — 这是视觉，不是体验

**推断方法**（当用户说不出时）：
1. 从 Outcome 反推：什么动作直接导致 Outcome 的实现？
2. 从竞品差异推：竞品做不到/做不好的那个点，你的产品第一次做到的瞬间
3. 从用户焦虑推：用户最担心的那个事情被消除的瞬间

## Gates

| Gate | 位置 | 通过条件 | 失败处理 |
|---|---|---|---|
| **G1: 问题验证门** | Step 0 后（仅 Guided 模式） | 问题有用户群体 + 频率 + 严重程度；根因触达（≤ 3 层 5 Whys）；证据强度 ≥ 中 | Pause→补充数据；Risk→证据弱时标注 `[待验证]` 继续 |
| **G2: Magic Moment 门** | Q2 后 | Aha 瞬间与 Outcome 因果相关 + 可在原型中演示（5 秒内可感知） | Pause→追问"只保留一个功能你最想让用户体验到什么"；Nudge→如果用户反复说不出，提示是否拆分 Frame |
| **G3: 范围完整门** | Q3-Q5 后 | User Flow ≤ 7 步 + Edge Cases ≥ 1 个"新用户/首次使用"场景 + Non-Goals ≥ 1 个"有人想要但你不做"的功能 | Pause→补齐缺失要素；Nudge→User Flow 7-10 步时提示是否拆分为多个 Frame |
| **G4: 复杂度匹配门** | 交付前 | 复杂度判断正确 + 字数在分级上限内 + Complex 模式至少完成 1 个扩展章节 | Pause→字数超标按上限砍；Risk→Complex 全部跳过扩展章节时降级为 Standard 并标注 |

Gate 失败 ≠ 终止：标注原因 → 回到对应 Step → 最多重试 2 次 → 仍失败向用户报告。

## 验证检查

生成 Feature Frame 后，逐项检查：

### 通用检查（所有复杂度）
- [ ] Problem→Outcome 有因果关系（用了产品 → 问题被解决）
- [ ] Magic Moment 的 Aha 瞬间可演示（能在原型中直接展示）
- [ ] User Flow 步骤 ≤7（超过 7 步 → 合并或拆分为多个 Frame）
- [ ] Edge Cases 包含至少 1 个"新用户/首次使用"场景
- [ ] Non-Goals 包含至少 1 个"有人可能想要但你不做"的功能
- [ ] P0 核心路径可被原型展示或 PRD 验收标准验证
- [ ] 已判断是否适合进入 goal-driven execution（不清楚时不得交给自驱实现）
- [ ] 可以直接喂给 pm-prototype（不需要额外解释）

### 字数检查（按复杂度）
- [ ] Simple: ≤300 字
- [ ] Standard: 500-800 字
- [ ] Complex: 1000-1500 字

### Complex 额外检查
- [ ] Entity Map 覆盖核心实体（遗漏 → 原型数据结构不完整）
- [ ] Screen Inventory 覆盖所有 P0 页面（遗漏 → 原型缺页）
- [ ] State Machine 覆盖关键状态转换（遗漏 → 原型流程断裂）
- [ ] 至少完成 1 个扩展章节（全部跳过 → 降级为 Standard）

## 下游衔接

Feature Frame 完成后，可直接触发：

| 下游 Skill | 衔接方式 |
| --- | --- |
| `pm-prototype` | 输入 Feature Frame → `--principles-confirmed` 跳过 Layer 0 四问 |
| `pm-prd` | 如果需要更正式的文档 → Feature Frame 作为核心输入 |

**衔接命令示例**：
```
基于这个 Feature Frame，用 /pm-prototype 生成高保真原型
```

## 与其他 Skill 的关系

```
pm-discovery (问题发现全链路)
  └── ★ pm-feature-frame (验证问题 + 构想特性) ★ ← 你在这里
        ├── pm-prototype (高保真原型)
        └── pm-prd (正式文档)

pm-prioritize (优先级排序)
  └── pm-feature-frame (可选，已有优先级后快速构想)
```

**与 pm-discovery 的关系**：pm-feature-frame 包含前置问题验证（简化版 5 Whys + 证据检查），也可以作为 discovery 链的终点。如果用户已经过 pm-discovery，Step 0 自动跳过。

**与 pm-prd 的关系**：Feature Frame 不是 PRD 的替代，是 PRD 的前身。一个小功能可能只需要 Feature Frame → 直接原型；一个复杂功能需要 Feature Frame → PRD → 原型。Complex 模式的 Feature Frame 已覆盖 PRD 约 60% 的核心内容，可以直接喂给原型工具。

## 常见错误

| 错误 | 后果 | 正确做法 |
| --- | --- | --- |
| 写成功能清单 | 有列表没构想，AI 盲目生成 | 每个功能都要回答"用户为什么要用" |
| Magic Moment 写成功能描述 | 无差异化，产出 generic 原型 | 写"体验瞬间"，不写"功能特性" |
| User Flow 包含所有分支 | 流程爆炸，不可读 | 核心路径保持线性，分支放 Edge Cases 或 State Machine |
| Non-Goals 写废话（"不做与产品无关的事"） | 等于没写 | 写"有人想要但你不做"的事 |
| 跳过 Magic Moment | 原型没有记忆点 | 宁可多花 2 分钟找，也不要没有 |
| Complex 产品只用 Simple 模板 | 原型无法覆盖全貌 | 检测到复杂信号时自动升级，至少写 1 个扩展章节 |
| Entity Map 写所有字段 | 变成数据库设计文档 | 只写 3-5 个核心字段和关系 |
| Screen Inventory 写成页面列表 | 缺乏交互信息 | 每个页面要说明"核心交互"和"优先级" |
| State Machine 画所有状态 | 流程图爆炸 | 只画关键的 3-8 个状态和转换 |

## Output Packet

- **artifact_path**: Feature Frame 直接在对话中呈现（schema_type: free，不强制持久化）；如需存档建议 `docs/conception/feature-frame-{feature-name}.md`
- **artifact_type**: `feature_frame`
- **key_decisions**: [选定的复杂度档位 + Magic Moment 设计 + Non-Goals 边界，≤ 3 条]
- **open_assumptions**: [标注 `[假设]` 或 `[推断]` 的待确认项列表，如 Quick 模式下 AI 填充的 Magic Moment]
- **next_skill_hint**: `pm-prototype`（默认）—— 输入 Feature Frame + `--principles-confirmed` 跳过 Layer 0 四问；若需正式文档化则 `pm-prd`
- **handoff_context**: 下游需要但不在 Frame 正文中的上下文（如被否决的复杂度档位、用户口头补充的约束、Step 0 验证出的根因）
- **builder_readiness**: PASS / PARTIAL / BLOCKED + [是否足够进入 prototype / PRD / architecture]
- **goal_suitability**: [是否适合 autonomous goal；不适合时列出需要人工判断的问题]

**下游消费方式**：pm-prototype 的 Intent Packet "Context Sources" 字段引用此 packet 的 `artifact_path` 和 `key_decisions`。

## Goal Suitability

Feature Frame 是 Builder OS 的最早分岔点：不是所有想法都适合立刻进入自驱实现。

| 条件 | 适合进入自驱 goal | 不适合进入自驱 goal |
|---|---|---|
| **问题清晰度** | 用户群体、频率、严重程度、Outcome 都明确 | 只有一句"我想做个 X"，真实问题未验证 |
| **体验闭环** | Magic Moment 可演示，User Flow ≤ 7 步 | Magic Moment 模糊，流程依赖未定业务判断 |
| **验证方式** | P0 路径可被原型、PRD 验收标准或测试验证 | 成功标准只能靠"感觉好不好" |
| **风险边界** | Non-Goals 清楚，不涉及不可逆/高权限动作 | 涉及生产权限、删除、资金、隐私且无人工审批 |

适合时，在 Output Packet 的 `goal_suitability` 写出可执行的 goal seed：objective / scope / non_goals / verifiable_completion_criteria。
不适合时，输出 1-3 个必须由用户或 PM 先判断的问题，不把模糊产品判断交给模型猜。

## Meta-Review

交付完成后对照方法论自审：

1. **方法论骨架**：复杂度是否正确判断？5 要素（Problem→Outcome / Magic Moment / User Flow / Edge Cases / Non-Goals）是否都按对应 Entry Mode 产出？
2. **反理实化警惕**：表格中"我脑子里已经有了"/"直接画原型更快"/"功能列表就够了"是否真的被警惕了？（对照检查）
3. **Iron Law 验证**：每条铁律（无用户问题 / 无 Magic Moment / 字数超标 / 无 Non-Goals / User Flow >7 步 / Complex 跳过扩展章节）是否已验证满足？

**扩展问题（pipeline skill）**：Output Packet 的 `key_decisions`（尤其复杂度档位和 Magic Moment 设计）是否可追溯到 G1-G4 的判定？

自审结果 1-2 句话附在交付物末尾。不通过时回到对应 Step 修正，不在 Meta-Review 阶段打补丁。

## Evolution Writeback

执行后自问以下 3 个问题，有则记录到 `docs/evolution-log.md`：

1. **方法论偏差**：复杂度判断逻辑是否贴合实际？（如某类描述经常被误判为 Simple/Standard/Complex）
2. **反理实化补充**：是否遇到了表格未覆盖的新借口模式？（如"Frame 太轻不够严肃"等）
3. **边界调整信号**：CAN/CANNOT 是否需要调整？（如某类需求本应转交 pm-prd 但被硬撑写 Frame）

**记录格式**：

```markdown
## YYYY-MM-DD — pm-feature-frame — [项目/场景]
- **观察**: [一句话描述]
- **建议回写**: [回写到哪个文件/章节 / "仅记录不回写"]
- **置信度**: 高/中/低
```

无观察时跳过此章节，不强写。

## Metadata

```yaml
track: pm
phase: 1
depends_on: [pm-discovery]
feeds_to: [pm-prototype, pm-prd]
schema_type: free
persist_to: []
guardrails:
  - Feature Frame 是构想不是 PRD——字数超标按复杂度上限砍
  - Magic Moment 必须可演示，不可是抽象描述
  - Non-Goals 至少包含 1 个"有人想要但你不做"的功能
```
