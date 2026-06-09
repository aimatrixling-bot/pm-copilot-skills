---
name: pm-feature-frame
displayName: 特性构想
displayDescription: 从想法到可原型的构想，自适应复杂度
description: "Bridge the gap between validated problem and prototype. Use this skill whenever the user needs to define WHAT to build before prototyping — says 'feature frame', 'feature list', '功能构想', '特性设计', 'what to build', 'user flow', 'magic moment', '画原型之前先想想', or has a validated problem/idea but hasn't specified what the product should actually do. Also trigger when the user says 'skip PRD' or 'go straight to prototype' — help them capture the conception first. This is the missing step between problem validation (pm-problem-frame) and visual output (pm-wireframe/pm-prototype). Supports three complexity tiers: Simple (single feature, 200-300 words), Standard (multi-screen app, 500-800 words), and Complex (enterprise/multi-agent/multi-phase, 1000-1500 words). Output feeds directly into pm-prototype with --principles-confirmed."
user-invocable: true
argument-hint: "[问题陈述 / PRD链接 / 项目描述]"
---

# 特性构想（Feature Frame）

<SUBAGENT-STOP>
如果是子代理派发执行此 Skill，直接按下方指令执行，不重新加载入口 Skill。
</SUBAGENT-STOP>

从"知道问题"到"可以画原型"——用一个自适应构想桥接。

**为什么需要这个 Skill**：PRD 太重（动辄几千字），脑子里的想法太轻（一句话）。AI 时代的 PM 需要一个中间态：足够具体让 AI 工具生成原型，足够轻量让你不抗拒写。

**输入**: 已验证的问题 / 粗略想法 / 项目背景 / PRD 片段
**输出**: Feature Frame（5 个核心要素 + 可选扩展章节）

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

## Entry Mode

### Guided（引导模式）— 5+ 个问题，预计 3-10 分钟

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

用户在对话中已讨论过需求/问题/方案（如刚完成 pm-problem-frame 或 pm-discovery），AI 从对话上下文直接生成 Feature Frame。

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

## 验证检查

生成 Feature Frame 后，逐项检查：

### 通用检查（所有复杂度）
- [ ] Problem→Outcome 有因果关系（用了产品 → 问题被解决）
- [ ] Magic Moment 的 Aha 瞬间可演示（能在原型中直接展示）
- [ ] User Flow 步骤 ≤7（超过 7 步 → 合并或拆分为多个 Frame）
- [ ] Edge Cases 包含至少 1 个"新用户/首次使用"场景
- [ ] Non-Goals 包含至少 1 个"有人可能想要但你不做"的功能
- [ ] 可以直接喂给 pm-prototype/pm-wireframe（不需要额外解释）

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
| `pm-wireframe` | 输入 Feature Frame → `--principles-confirmed` 跳过 Layer 0 四问 |
| `pm-prototype` | 输入 Feature Frame → `--principles-confirmed` 跳过 Layer 0 四问 |
| `pm-prd` | 如果需要更正式的文档 → Feature Frame 作为核心输入 |
| `pm-solution-brief` | 如果需要向干系人汇报 → 从 Feature Frame 提炼一页纸 |

**衔接命令示例**：
```
基于这个 Feature Frame，用 /pm-prototype 生成高保真原型
```

## 与其他 Skill 的关系

```
pm-discovery (问题发现全链路)
  └── pm-problem-frame (定义问题)
        └── ★ pm-feature-frame (构想特性) ★ ← 你在这里
              ├── pm-wireframe (线框图)
              ├── pm-prototype (高保真原型)
              └── pm-prd (正式文档)

pm-feature-cycle (功能开发全周期)
  └── pm-rice (优先级排序)
        └── pm-feature-frame (可选，已有优先级后快速构想)
```

**与 pm-discovery 的关系**：pm-feature-frame 是 discovery 链的终点——问题验证完后，用它定义"做什么"。

**与 pm-feature-cycle 的关系**：pm-feature-cycle 是工程交付链（rice→prd→tech-spec→eng-request），pm-feature-frame 是更轻量的构想工具。当已有明确的功能列表时，feature-cycle 更合适；当还在"想做什么"阶段时，feature-frame 更合适。

**与 pm-prd 的关系**：Feature Frame 不是 PRD 的替代，是 PRD 的前身。一个小功能可能只需要 Feature Frame → 直接原型；一个复杂功能需要 Feature Frame → PRD → 原型。Complex 模式的 Feature Frame 已覆盖 PRD 约 60% 的核心内容，可以直接喂给原型工具。

**与 pm-solution-brief 的关系**：solution-brief 是对外汇报工具（给老板/客户看），feature-frame 是对内构想工具（给自己/AI 工具看）。方向不同，内容可以复用。

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

## Metadata

```yaml
track: pm
depends_on: []
schema_type: free
persist_to: []
guardrails: []
```
