---
name: pm-prototype
displayName: 交互原型
displayDescription: 从 PRD/线框图生成可交互高保真原型
description: "Create high-fidelity interactive prototypes from PRD, wireframes, or descriptions. Use this skill whenever the user wants to build a clickable product demo, says '原型', 'prototype', '可交互原型', 'demo', 'mockup', or wants to visualize a product idea. Also trigger when the user says 'show me what it would look like' or 'let me play with it' after discussing features. Even rough feature descriptions like 'a dashboard for X' should trigger this skill to create something tangible."
user-invocable: true
argument-hint: "[PRD 路径 / 线框图路径 / 自然语言描述]"
---

## Layer 0：设计原则四问（必须先回答，再生成原型）

> **为什么有这一层**：场景规则告诉 AI"做什么"，原则告诉 AI"为什么"。
> 遇到未知场景时，AI 能根据原则推理，而不是瞎猜。
> 参考：研究报告第 8.0 节（原则驱动为主，场景驱动为辅）

生成任何原型之前，依次回答四个问题，**在输出中展示回答**，不得跳过：

| # | 问题 | 答案格式 | 作用 |
|---|------|----------|------|
| Q1 | **Purpose（目的）**：这个原型让用户完成什么核心任务？ | 一句话："让用户完成 X，而不需要 Y" | 防止功能蔓延，所有设计决策必须服务此目的 |
| Q2 | **Tone（语调）**：用户带着什么情绪使用这个产品？ | 从列表选一：焦虑/急迫/随意浏览/专注任务/困惑/探索 | 决定信息密度、色彩情绪、交互节奏 |
| Q3 | **Constraints（约束）**：有什么硬性限制？ | 列出 2-5 条：设备限制/合规要求/数据限制/用户能力限制/技术栈限制 | 约束优先于美学，原型必须体现约束 |
| Q4 | **Differentiation（差异点）**：与竞品/现有方案的最大区别是什么？ | 一句话："别人做 X，我们做 Y" | 确保原型有记忆点，不是 generic 原型 |

**输出格式示例**：

```
【Layer 0 设计原则】
Q1 Purpose：让医生在 30 秒内完成患者影像报告审核，不需要切换系统
Q2 Tone：专注任务（冷静、高效，不容干扰）
Q3 Constraints：平板触控（≥44px）；医疗合规（审计日志）；离线可用（PWA）
Q4 Differentiation：竞品按时间排序，我们按风险等级排序 + 一键标记异常

→ 基于以上原则，开始生成原型。
```

**AI Prompt 规则**：
- 如果用户输入已包含这 4 个信息，直接使用
- 如果缺失，主动向用户询问（每次最多问 1 个问题，避免一次性问 4 个）
- 如果加 `--principles-confirmed` 参数，跳过本层，直接使用 Layer 0 默认值（从 PRD 提取）

# 高保真原型

<SUBAGENT-STOP>
如果是子代理派发执行此 Skill，直接按下方指令执行，不重新加载入口 Skill。
</SUBAGENT-STOP>

从多种输入源生成高保真可交互原型。可点击的原型比 100 页文档更能传达产品意图。

**输入**: PRD / 线框图 / 自然语言 / 对话上下文
**输出**: 零配置可运行的 HTML 原型 + PRD 映射表

## Iron Law

| 铁律 | 违反后果 |
| --- | --- |
| 没有 PRD 或明确意图的原型是艺术项目 | 先确认产品目标和用户再动手 |
| 原型必须可交互（点击、输入、导航） | 纯静态页面不算原型，降级为线框图 |
| 视觉服务于产品目标，不是反过来 | 产品目标 > 视觉美感，时刻回到"用户要完成什么" |
| **原则先于场景规则** | 如果场景规则与 Layer 0 原则冲突 → 以原则为准，记录冲突原因 |
| **反馈闭环不可跳过（除非显式声明）** | 未确认方向直接出完整原型 → 返工概率 >70% |

## 输入源模式

| 输入源 | 触发信号 | 处理方式 |
| --- | --- | --- |
| PRD 文件路径 | "基于这个 PRD 做原型" | Read PRD → 提取页面/流程 → 多页原型 |
| 线框图路径 | "从线框图做高保真" | Read 线框 → 增强视觉 → 添加交互 |
| 自然语言 | "做一个登录页原型" | 直接生成 → 确认细节 → 迭代 |
| 对话上下文 | PRD 讨论后说"做个原型看看" | 从对话提取需求 → 无需重新描述 |

## 四层架构

每个原型由四层构成，从产品目标到工程合规逐层递进：

### Layer 1: 产品框架（编码前必须定义）

> **原则声明**：产品框架是"为什么做"和"为谁做"，场景规则是"怎么做"的具体化。

| 维度 | 内容 | 原则驱动提示 |
| --- | --- | --- |
| **场景判断**（新增） | scene = {type: B2B\|C2C\|AI_AGENT, device: PC\|Mobile\|Tablet, posture: Sovereign\|Transient, agentParadigm: Chat\|Canvas\|Workflow\|Autonomous} | 从 Layer 0 Q1+Q2 推导；如无法确定 → 默认 B2B-PC |
| 产品目标 | 问题、目标类型（获取/激活/参与/变现）、指标 | 必须与 Layer 0 Q1 一致 |
| 用户上下文 | 主要用户、情绪状态（来自 Q2）、专业水平 | 情绪状态决定信息密度和交互节奏 |
| 操作层次 | 1. 主要操作（唯一）2. 次要操作 3. 被动信息 | 主要操作必须与 Q1 的核心任务匹配 |
| 差异化机制 | 选一个：布局/字体/动画/颜色/密度/交互 | 必须与 Layer 0 Q4 一致 |
| 产品姿态（新增） | Sovereign / Transient / Collaborative（来自 About Face） | Sovereign=高密度；Transient=极简；从场景自动推断，用户可覆盖 |

**AI 场景判断逻辑**（自动执行，结果展示给用户）：

```
输入：PRD/描述 + Layer 0 原则 + 用户指定（可选）
 │
 ├── 用户指定 scene？→ 是 → 使用指定，验证是否与 Layer 0 原则冲突
 │
 └── 否 → 从输入推断：
       │
       ├── 第一步：检测 AI Agent 关键词（优先级最高）
       │      "Agent/智能体/Copilot/对话/工作流/节点" → type=AI_AGENT
       │
       ├── 第二步：检测 B 端/C 端关键词
       │      B 端："管理/后台/CRM/ERP/SaaS/系统"
       │      C 端："商城/社区/内容/消费"
       │
       ├── 第三步：检测设备关键词
       │      "APP/小程序/手机/移动" → device=Mobile
       │      "iPad/平板/大屏" → device=Tablet
       │
       └── 默认：type=B2B, device=PC, posture=Sovereign
```

### Layer 2: 视觉系统

> **原则声明**：视觉选择必须服务 Layer 0 的 Purpose 和 Tone，不是"选一个好看的"。
> 每个美学基调背后有原则支撑，AI 在选择时必须说明"为什么选这个基调"。

选择一个美学基调并坚持执行，**不要混合**：

| 基调 | 适用场景（原则驱动） | 特征 | 原则依据 |
| --- | --- | --- | --- |
| Editorial Authority | 内容平台、媒体（Tone=探索/随意浏览） | 大标题，非对称，高对比 | 内容优先，阅读体验 |
| Brutalist Raw | 开发者工具（Tone=专注任务，用户=专业） | 单色，等宽，代码风格 | 功能优先，无干扰 |
| Industrial Utility | B2B 工具（posture=Sovereign） | 密集，结构化，实用 | 效率优先，信息密度 |
| Retro-Futuristic | 科技、Web3（Differentiation=未来感） | 深色，霓虹，网格 | 品牌表达，情感连接 |
| Luxury Minimal | 高端品牌（Tone=困惑→引导） | 细线，轻量，慷慨留白 | 信任感，克制美学 |
| Playful Modular | 教育、创意（Tone=探索/愉悦） | 鲜艳，圆润，动态 | Engagement，情感化设计 |
| Precision Enterprise | 企业软件（B2B，posture=Sovereign） | 系统化，一致，专业 | 一致性，专业可信 |

**选择逻辑**（AI 自动执行，在方向预览中展示）：

1. 从 Layer 0 Q2（Tone）映射初选
2. 从 Layer 1 场景（B2B/C2C/AI_AGENT）二次筛选
3. 从 Layer 0 Q4（Differentiation）确认差异化是否足够
4. 输出选择理由："Tone=X → 初选 Y；场景=Z → 确认 Y；差异化=W → Y 有足够记忆点"

完整视觉系统指南见 `references/visual-systems.md`。原则级设计规则见 `references/executable-rules.md`（20 条经典 UX 规则）。

### Layer 3: 原型架构

| 原则 | 说明 |
| --- | --- |
| 模块化组件 | 可复用组件，清晰层次。按场景选择 `references/component-fragments/` 中的模板（B 端: b2b-table/form/dashboard/sidebar；C 端: c2c-product-grid/checkout/mobile-feed；AI Agent: ai-chat-panel/timeline/workflow-canvas 等 9 个） |
| 数据分离 | 真实数据结构，无硬编码假指标 |
| 最小状态 | 本地状态策略，避免全局滥用 |
| API 就绪 | 数据结构匹配预期 API，最小重构可接后端 |

### Layer 4: 工程合规（内置）

| 检查项 | 要求 |
| --- | --- |
| 语义化 HTML | `<button>` 非 `<div onClick>` |
| 键盘导航 | 完整支持，清晰焦点指示 |
| 颜色对比 | WCAG AA (4.5:1 正文, 3:1 大字) |
| 触摸优化 | 按钮 ≥ 44px, `touch-action: manipulation` |

## 执行流程

```
Phase 0: Layer 0 设计原则四问（新增，不可跳过）
  ├── 回答 Q1-Q4（Purpose/Tone/Constraints/Differentiation）
  ├── 向用户展示回答，获得确认（或快速确认）
  └── 输出：【Layer 0 设计原则】摘要

Phase 1: 场景判断（新增）
  ├── 用户指定 scene？→ 是 → 使用指定，验证与 Layer 0 原则一致性
  └── 否 → 从 Layer 0 + PRD 推断（关键词检测 → 输出 scene + 理由）

Phase 2: 方向预览（新增反馈节点 🔄）
  ├── 输出（文字描述，非代码）：
  │   1. 场景选择 + 产品姿态
  │   2. 美学基调选择 + 理由（来自 Layer 2 选择逻辑）
  │   3. 信息密度级别（高/中/低）+ 布局方向
  │   4. 主要操作路径（1-2 句话）
  │   5. 差异化记忆点（来自 Q4）
  ├── 用户反馈：确认 / 修改场景 / 修改基调 / 修改密度
  └── 🔄 可跳过（加 --no-preview 参数），但首次使用建议不跳过

Phase 3: Layer 1 产品框架（编码前）
  ├── 定义目标、用户、操作层次（与 Layer 0 对齐）
  └── 输出产品框架摘要（1 段话）

Phase 4: Layer 2 视觉系统
  ├── 选择美学基调（执行 Layer 2 选择逻辑）
  ├── 定义色彩系统（主色/辅助色/语义色，参考 SC-04 五维度框架）
  ├── 定义字体系统（标题字体 + 正文字体 + 等宽字体）
  └── 输出视觉系统摘要（与 Phase 2 方向预览对齐）

Phase 5: 骨架预览（新增反馈节点 🔄）
  ├── 输出：HTML 骨架（无真实内容，用灰度占位）
  │   - 布局结构（header/nav/main/sidebar/footer）
  │   - 组件占位（[按钮] [列表] [表单]）
  │   - 交互标注（点击跳转路径）
  ├── 用户反馈：调整布局 / 调整密度 / 调整导航
  └── 🔄 可跳过（加 --no-preview 参数）

Phase 6: Layer 3 原型架构（编码）
  ├── 组件结构规划（模块化，可复用）
  ├── 数据结构设计（匹配预期 API，见 SC-04 五维度框架）
  ├── 状态管理策略（最小状态，避免全局滥用）
  └── 生成 HTML + Tailwind CSS (CDN) + 可点击导航 + 假数据

Phase 7: Layer 4 工程合规验证
  ├── 语义化 HTML 检查（<button> 非 <div onClick>）
  ├── 键盘导航检查（Tab 顺序与视觉顺序一致）
  ├── 颜色对比度检查（WCAG AA: 4.5:1 正文, 3:1 大字）
  ├── 触摸优化检查（按钮 ≥44px, touch-action: manipulation）
  └── 去 AI 味检查（见 `references/de-ai-checklist.md`，55 条）

Phase 8: 反馈确认（修改原有流程）
  ├── 展示完整原型（本地 server 或文件）
  ├── 用户反馈：修改布局 / 修改视觉 / 修改交互 / 修改数据
  └── 迭代（最多 2 轮，避免无限修改）

Phase 9: PRD 联动 + 交付
  ├── 版本标记 + User Story ↔ 页面映射 + MAPPING.md
  ├── 写入文件 + dev server 命令 + 映射表
  └── 输出：【设计决策记录】—— Layer 0 原则如何影响每个设计决策
```

**关键设计**：
- Phase 0/2/5 是新增的 Layer 0 前置 + 反馈节点
- Phase 2（方向预览）和 Phase 5（骨架预览）均可跳过，但有默认快速确认
- Phase 7（去 AI 味检查）是新增的质量关卡
- Phase 9 新增"设计决策记录"——让后续维护者理解"为什么这么做"

## 参数

| 参数 | 类型 | 必需 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| 输入源 | PRD/线框图/自然语言 | 是 | — | PRD 文件、线框图路径或自然语言描述 |
| 技术栈 | html-tailwind/react | 否 | html-tailwind | 原型技术栈；html-tailwind = 零配置 |
| **scene** | **枚举字符串** | **否** | **auto-detect** | **B2B-PC / B2B-Mobile / C2C-PC / C2C-Mobile / Tablet-Landscape / Tablet-Portrait / AI-Agent-Chat / AI-Agent-Workflow / AI-Agent-Canvas / auto** |
| **agent-paradigm** | **枚举字符串** | **否** | **auto-detect** | **仅当 scene=AI-Agent-* 时有效：Chat / Canvas / Workflow / Autonomous** |
| **principles-confirmed** | **布尔** | **否** | **false** | **true = 跳过 Layer 0 原则四问（用户已确认原则）** |
| **--no-preview** | **标志** | **否** | **（未设置）** | **设置后跳过 Phase 2 和 Phase 5 的反馈节点** |
| 美学基调 | 见 Layer 2 表格 | 否 | 自动推荐 | 覆盖自动选择 |
| 假数据量 | minimal/realistic | 否 | realistic | minimal = 各类型 1-2 条；realistic = 符合场景的真实数据 |
| 设备 | desktop/mobile/both | 否 | 从 scene 推断 | 覆盖自动推断 |

### scene 参数推断规则（AI 自动执行，用户可覆盖）

| scene 值 | 推断关键词 | 原型特征 |
|----------|-------------|----------|
| `B2B-PC` | 管理/后台/CRM/ERP/SaaS/系统 | 侧边栏 + 数据表格 + 高密度 + Precision Enterprise 基调 |
| `B2B-Mobile` | APP/小程序/手机/移动 + 管理 | 底部 Tab + 卡片列表 + 紧凑 + Industrial Utility 基调 |
| `C2C-PC` | 商城/社区/内容/消费（非管理） | 顶部导航 + 网格卡片 + 中密度 + Editorial Authority 或 Playful Modular 基调 |
| `C2C-Mobile` | APP/小程序 + 消费 | 底部 Tab + 信息流 + 低密度 + Playful Modular 基调 |
| `Tablet-Landscape` | iPad/平板 + 横屏 | 侧边栏（可收起）+ 双栏 + 高密度 |
| `Tablet-Portrait` | iPad/平板 + 竖屏 | 抽屉式侧边 + 单栏 + 中密度 |
| `AI-Agent-Chat` | Agent/智能体/Copilot/对话/Chat | 对话气泡 + 输入框 + 上下文标签 + Brutalist Raw 基调 |
| `AI-Agent-Workflow` | 工作流/节点/编排/Flow | 画布 + 节点 + 属性面板 + Industrial Utility 基调 |
| `AI-Agent-Canvas` | AI编程/代码生成/Chat+Preview | 双栏（对话+预览）+ Brutalist Raw 基调 |
| `auto` | （无关键词或无法确定） | 默认 `B2B-PC`，并在输出中标注 `[auto-detected]` |

**AI 推断优先级**：
1. 先检测 AI Agent 关键词（优先级最高，因为交互范式差异最大）
2. 再检测 B 端/C 端关键词
3. 再检测设备关键词
4. 都无法确定 → `auto` → 默认 `B2B-PC`
5. **必须在输出中展示推断结果和理由**，用户可覆盖

## 场景适配矩阵（替代原有的"设备适配"）

> **原则声明**：适配的核心是"场景决定布局"，不是"设备决定布局"。
> 同一台 iPad，横屏时是"桌面替代品"，竖屏时是"移动设备放大版"。

| 维度 | B 端 PC | B 端移动 | C 端 PC | C 端移动 | 平板横屏 | 平板竖屏 |
|------|----------|----------|---------|----------|----------|----------|
| **布局策略** | 固定宽度 1280px，侧边栏导航 | 100% 宽度，底部导航栏 | 响应式 1024-1920px，顶部导航 | 100% 宽度，底部 Tab | 响应式 768-1024px，可收起侧边栏 | 100% 宽度，抽屉式侧边 + 底部 Tab |
| **信息密度** | 高：表格为主，一屏 20+ 数据字段 | 中：卡片摘要 + 详情进入 | 中：图文混排，留白适度 | 低：单任务聚焦 | 高→中：利用宽度展示双栏 | 中→低：单栏流式 |
| **导航模式** | 持久侧边栏 + 面包屑 + Tab | 底部 Tab + 汉堡菜单 | 顶部导航 + 搜索 + Mega Menu | 底部 Tab + 顶部搜索 | 侧边栏（可收起）+ 顶部导航 | 抽屉式侧边 + 顶部导航 |
| **触控优化** | 鼠标操作为主（28×28px 最小） | ≥44×44px，按钮间距 ≥8px | 鼠标+触控混合（32×32px 最小） | ≥44×44px，全宽按钮 | ≥44×44px，分屏拖拽手柄 | ≥44×44px，全宽按钮优先 |

### AI Agent 场景适配（新增）

| 维度 | AI 对话助手 | AI 编程 Agent | AI 工作流编排 | AI 自主执行 Agent |
|------|--------------|----------------|-----------------|---------------------|
| **布局策略** | 单栏流式（消息堆叠）| 三栏：侧栏+对话+画布 | 画布+属性面板 | 对话+进度面板+结果区 |
| **信息密度** | 中（对话流+引用）| 高（代码+文件树+终端）| 高（节点+属性+日志）| 中→高（状态+进度+结果）|
| **导航模式** | 对话历史+搜索 | 文件树+对话+标签页 | 画布缩放+节点搜索 | 任务列表+状态面板 |
| **特殊适配** | 上下文标签管理 | 文件变更高亮 + Diff 预览 | 小地图 + 节点调试模式 | 实时进度时间线 + 成本计数 |

## 交互标准

- [ ] 页面间导航可点击
- [ ] 表单可输入（无需验证）
- [ ] 按钮有 hover/active 反馈
- [ ] 列表可滚动
- [ ] 空状态和加载状态展示
- [ ] 移动端: 触控友好的点击区域（≥ 44px）

## 产出结构

```
prototype/
├── index.html          # 主入口
├── page-*.html         # 其他页面
├── data.js             # 假数据（匹配预期 API 结构）
└── MAPPING.md          # PRD↔原型映射表
```

## 常见错误（反模式）

| 错误 | 后果 | 正确做法 |
|------|------|----------|
| 通用美学（紫色渐变+Inter） | 千篇一律，无记忆点 | 选择独特视觉基调，执行 Layer 2 选择逻辑 |
| 非语义 HTML | 无障碍破坏，难维护 | 使用语义化元素（`<button>` 非 `<div onClick>`） |
| 硬编码假数据 | 接后端需重写 | 匹配预期 API 结构（SC-04 五维度框架） |
| 过度动画 | 干扰用户注意力 | 只动画有意义的交互（AP-34 动效预算原则） |
| 忽视状态 | 加载/错误/空状态缺失 | 每个组件定义所有状态（AP-43） |
| **跳过 Layer 0 原则四问** | AI 盲目套用场景规则，不适应未知场景 | **必须先回答 Q1-Q4，展示后再编码** |
| **场景规则与原则冲突未处理** | 产出不符合真实需求 | **以 Layer 0 原则为准，记录冲突原因** |
| **去 AI 味检查未执行** | 产出有 AI 通用痕迹，不专业 | **交付前强制执行 55 条检查清单** |
| **反馈节点全部跳过** | 返工概率 >70% | **首次使用时不跳过 Phase 2 和 Phase 5** |

完整反模式列表见 `references/anti-patterns.md`（前 15 条）+ `references/de-ai-checklist.md`（后 40 条）。

## 交付前检查

### Layer 0 检查（新增）

- [ ] Layer 0 设计原则四问已回答并展示
- [ ] 原则与场景规则无冲突（如有冲突，以原则为准并记录）

### 场景规则检查（新增）

- [ ] 场景（scene）已判断并展示理由
- [ ] 所有设计决策符合场景差异化矩阵（第 1 章）
- [ ] 表单字段必填性按 SC-04 五维度框架判断

### 去 AI 味检查（新增）

- [ ] 已执行 `references/de-ai-checklist.md` 全部 55 条检查
- [ ] 检查报告已生成：`{文件名}-ai-issues.md`
- [ ] 所有 AI 味问题已修复（或记录为已知限制）
- [ ] 交互规范检查通过：`references/interaction-guidelines.md`（30 条 Vercel Guidelines）

### 反馈确认检查（新增）

- [ ] Phase 2（方向预览）已执行并已确认（或用户显式跳过）
- [ ] Phase 5（骨架预览）已执行并已确认（或用户显式跳过）
- [ ] 设计决策记录已生成（Layer 0 原则如何影响每个决策）

### 原有检查（保留并增强）

- [ ] 产品框架已定义（目标、用户、操作层次）
- [ ] 选择了一个美学基调并一致执行
- [ ] 使用独特字体（非 Inter/Roboto/Open Sans）
- [ ] 颜色系统使用 CSS 变量，对比度达标
- [ ] 所有交互可点击、可导航
- [ ] 数据结构匹配预期 API
- [ ] 语义化 HTML + 键盘导航
- [ ] MAPPING.md 已生成（User Story ↔ 页面映射）

## AI Agent 场景专属规则（新增）

> 当 scene 参数包含 `AI-Agent-*` 时，以下规则**强制启用**。
> 完整规则见 `references/agent-ui-rules.md`。

### AG-01：三档自主权模式（强制）

> 所有 AI Agent 原型必须支持三档自主权切换：(1) 建议模式（仅输出方案）(2) 确认模式（每个关键操作前审批）(3) 执行模式（自主运行，保留暂停入口）。
> 界面必须有可见的当前模式标识，切换入口 ≤2 次点击。

### AG-02：过程透明——Agent 状态时间线（执行时间 >5s 时强制）

> Agent 执行多步骤任务时，必须展示实时状态时间线：已完成✓ → 当前（动画）→ 待执行（灰色）。每个步骤展示：动作描述、目标对象、耗时。

### AG-03：Plan-then-Execute 分离（>3 步任务时强制）

> 必须先展示执行计划（步骤列表 + 每步影响范围 + 预估耗时），用户确认后再开始执行。用户可删除步骤/修改参数/插入人工检查点/取消执行。

### AG-04：爆炸半径可视化（高风险操作时强制）

> DELETE/PUT/POST 类操作执行前，必须展示影响范围面板（受影响文件/数据/用户列表，红色边框高亮）。不可逆操作需二次确认 + 30s 倒计时取消窗口。

### 其他规则索引

| 规则编号 | 名称 | 触发条件 |
|----------|------|----------|
| AG-05 | 错误恢复（非重置） | Agent 执行失败时 |
| AG-06 | 上下文窗口可视化 | 对话型 Agent |
| AG-07 | 渐进式披露推理过程 | 所有 AI Agent 产品 |
| AG-08 | 工作流编辑器六要素 | 工作流编排场景 |
| AG-09 | Chat Artifacts 双栏法则 | 产物 >20 行或含可交互元素 |
| AG-10 | Agent 任务队列与人工交接 | 多任务并发时 |

完整规则和检查方法见 `references/agent-ui-rules.md`。

## 与其他 Skill 的关系

| Skill | 关系 | 说明 |
|-------|------|------|
| pm-wireframe | 上游 | 快速结构沟通 → 原型增强 |
| pm-prd | 上游 | PRD → 提取页面和流程 |
| pm-comp | 参考 | 竞品 UI 可参考美学方向 |

## 残酷风险区

| 风险 | 场景 | 防御方案 |
|------|------|----------|
| 原型陷阱 | 利益相关者认为已完成 | 明确标注"原型"，加水印/边框 |
| 视觉主导 | 评审时关注颜色而非功能 | 从产品目标开始，功能 > 视觉 |
| 技术债 | 原型代码不适合生产 | 遵循框架最佳实践，记录债务 |

## Metadata

```yaml
track: pm
depends_on: []
schema_type: free
persist_to: []
guardrails: []
```
