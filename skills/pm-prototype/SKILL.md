---
name: pm-prototype
displayName: 原型与线框图
displayDescription: 低保真线框图（快速对齐结构）或高保真可交互原型（演示和用户测试）
description: "Create wireframes or interactive prototypes from PRD, wireframes, or descriptions. Use this skill whenever the user wants to visualize a product idea, says '原型', 'prototype', '线框图', 'wireframe', '页面布局', 'layout', '页面结构', 'sketch', '可交互原型', 'demo', 'mockup'. Also trigger when the user says 'show me what it would look like', 'what should this page look like', or 'how should we lay out X'. For quick structural alignment use --fidelity=low (wireframe mode); for clickable demos use --fidelity=high (default). Even rough feature descriptions like 'a dashboard for X' should trigger this skill to create something tangible."
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

<SUBAGENT-STOP>
如果是子代理派发执行此 Skill，直接按下方指令执行，不重新加载入口 Skill。
</SUBAGENT-STOP>

## Intent Packet

| 字段 | 捕获内容 | 来源 |
|---|---|---|
| **Want** | 将构想/PRD 转化为可感知的视觉产物（线框或可交互原型） | 用户输入"做个原型"/"画线框" |
| **Constraints** | 保真度（low/high）、技术栈（html-tailwind/react）、scene、设备、合规 | 用户明示 + `--fidelity`/`--scene` 参数 + PRD 推断 |
| **Context Sources** | 上游 pm-feature-frame 的 Output Packet / pm-prd / 项目背景 / 已有线框图 | 上游 packet + 用户输入路径 |
| **Depth** | Draft（low-fidelity 快速对齐）/ Review（high-fidelity 默认）/ Release（high-fidelity + Layer 4 合规 + 去AI味检查） | 用户声明或 `--fidelity` 推断 |
| **Output Target** | 团队对齐（low）/ 用户测试或外部演示（high） | 用户明示或场景推断 |

未提供时标注 `[假设]`，交付前确认。

## 保真度模式

通过 `--fidelity` 参数选择输出模式：

| 维度 | `--fidelity=low`（线框图） | `--fidelity=high`（可交互原型，默认） |
| --- | --- | --- |
| 输出 | ASCII/灰度 HTML | 可交互 HTML + Tailwind CSS + JS |
| 制作时间 | ~5 分钟 | ~30 分钟 |
| 用途 | 团队内部快速对齐结构 | 用户测试、外部演示 |
| 保真度 | 低保真结构图 | 中保真可交互 |
| 可点击 | 否（标注跳转路径） | 是 |
| 视觉设计 | 灰度，无品牌色/字体 | 完整美学基调 + 色彩系统 |

**选择规则**: 先 low-fidelity 对齐结构 → 再 high-fidelity 做交互演示。

## Iron Law

| 铁律 | 违反后果 |
| --- | --- |
| 没有 PRD 或明确意图的原型是艺术项目 | 先确认产品目标和用户再动手 |
| 高保真原型必须可交互（点击、输入、导航） | 纯静态页面不算原型，降级为线框图 |
| 低保真线框不包含视觉设计 | 如果有颜色/字体/图标 → 降级为设计稿，重新做线框 |
| 视觉服务于产品目标，不是反过来 | 产品目标 > 视觉美感，时刻回到"用户要完成什么" |
| **原则先于场景规则** | 如果场景规则与 Layer 0 原则冲突 → 以原则为准，记录冲突原因 |
| **反馈闭环不可跳过（除非显式声明）** | 未确认方向直接出完整原型 → 返工概率 >70% |

## Capability Index

| 维度 | CAN（可以做） | CANNOT → HANDOFF（不做，转交） |
|---|---|---|
| **任务类型** | Layer 0 设计原则推理、场景判断（B2B/C2C/AI-Agent × 设备）、低保真线框、高保真可交互原型、IA 信息架构分析、AI Agent 场景 UI | 写 PRD → pm-prd；定义 WHAT → pm-feature-frame；视觉品牌系统 → 设计师 |
| **输出格式** | HTML + Tailwind CSS（CDN）/ React / ASCII 线框 / MAPPING.md | Figma/Sketch 文件 → 设计师；docx/pptx → pm-content-general；后端代码 → pm-code-implement |
| **深度范围** | 从"PRD/构想/描述"到"可点击演示的 HTML 原型"（含 Layer 1-4 全栈）；最多 2 轮迭代 | 复杂 3D/动画/WebGL → 专业前端；真实后端集成 → pm-code-implement |

**边界原则**：原型是"可感知的产品构想"，不是生产代码。Layer 3 的 API 就绪指数据结构匹配，不是真实接口实现。

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
| **场景判断** | scene = {type: B2B\|C2C\|AI_AGENT, device: PC\|Mobile\|Tablet, posture: Sovereign\|Transient, agentParadigm: Chat\|Canvas\|Workflow\|Autonomous} | 从 Layer 0 Q1+Q2 推导；如无法确定 → 默认 B2B-PC |
| 产品目标 | 问题、目标类型（获取/激活/参与/变现）、指标 | 必须与 Layer 0 Q1 一致 |
| 用户上下文 | 主要用户、情绪状态（来自 Q2）、专业水平 | 情绪状态决定信息密度和交互节奏 |
| 操作层次 | 1. 主要操作（唯一）2. 次要操作 3. 被动信息 | 主要操作必须与 Q1 的核心任务匹配 |
| 差异化机制 | 选一个：布局/字体/动画/颜色/密度/交互 | 必须与 Layer 0 Q4 一致 |
| 产品姿态 | Sovereign / Transient / Collaborative（来自 About Face） | Sovereign=高密度；Transient=极简；从场景自动推断，用户可覆盖 |

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

### Layer 2: 视觉系统（仅 high-fidelity 模式）

> **原则声明**：视觉选择必须服务 Layer 0 的 Purpose 和 Tone，不是"选一个好看的"。
> **low-fidelity 模式跳过此层**，直接使用灰度配色（#333/#666/#999/#eee）。

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

完整视觉系统指南见 `references/visual-systems.md`。原则级设计规则见 `references/executable-rules.md`。

### Layer 3: 原型架构

| 原则 | 说明 |
| --- | --- |
| 模块化组件 | 可复用组件，清晰层次。按场景选择 `references/component-fragments/` 中的模板 |
| 数据分离 | 真实数据结构，无硬编码假指标 |
| 最小状态 | 本地状态策略，避免全局滥用 |
| API 就绪 | 数据结构匹配预期 API，最小重构可接后端 |

### Layer 4: 工程合规（仅 high-fidelity 模式内置检查）

| 检查项 | 要求 |
| --- | --- |
| 语义化 HTML | `<button>` 非 `<div onClick>` |
| 键盘导航 | 完整支持，清晰焦点指示 |
| 颜色对比 | WCAG AA (4.5:1 正文, 3:1 大字) |
| 触摸优化 | 按钮 ≥ 44px, `touch-action: manipulation` |

## 执行流程

### High-Fidelity 流程（默认，--fidelity=high）

```
Phase 0: Layer 0 设计原则四问（不可跳过）
  ├── 回答 Q1-Q4 → 展示 → 确认

Phase 1: 场景判断
  ├── 用户指定 scene？→ 使用指定 → 验证一致性
  └── 否 → 从 Layer 0 + PRD 推断

Phase 2: 方向预览（反馈节点 🔄）
  ├── 场景 + 产品姿态 + 美学基调 + 信息密度 + 差异化记忆点
  └── 🔄 可跳过（--no-preview），首次使用建议不跳过

Phase 3: Layer 1 产品框架（编码前）
  └── 定义目标、用户、操作层次

Phase 4: Layer 2 视觉系统
  └── 美学基调 + 色彩系统 + 字体系统

Phase 5: 骨架预览（反馈节点 🔄）
  ├── HTML 骨架（灰度占位，布局+组件+交互标注）
  └── 🔄 可跳过（--no-preview）

Phase 6: Layer 3 原型架构（编码）
  └── HTML + Tailwind CSS (CDN) + 可点击导航 + 假数据

Phase 7: Layer 4 工程合规验证
  └── 语义化 HTML + 键盘导航 + 颜色对比度 + 去AI味检查

Phase 8: 反馈确认
  └── 展示完整原型 → 用户反馈 → 迭代（最多2轮）

Phase 9: PRD 联动 + 交付
  └── MAPPING.md + 设计决策记录
```

### Low-Fidelity 流程（--fidelity=low）

```
Phase 0: Layer 0 设计原则四问（不可跳过）
  ├── 回答 Q1-Q4 → 展示 → 确认

Phase 1: 场景判断
  └── 同 high-fidelity 推断逻辑

Phase 2: 方向预览（反馈节点 🔄）
  ├── 场景 + 产品姿态 + 信息密度 + 导航模式
  └── 🔄 可跳过（--no-preview）

Phase 3: 输入分析 + IA 提取
  ├── Read PRD 或接收页面描述
  ├── 提取关键屏幕和导航关系
  └── （如启用 IA Analysis Mode）执行卡片分类 + 导航结构

Phase 4: 用户流程定义
  └── 入口 → 屏幕1 → 屏幕2 → 目标（检查流程完整性）

Phase 5: 线框生成（逐屏幕）
  ├── 绘制布局（header/nav/main/sidebar/footer）
  ├── 标注组件（[按钮] [列表] [表单] [图片]）
  ├── 标注交互（点击跳转路径、弹窗说明）
  └── 考虑状态（正常/空/加载/错误）

Phase 6: 线框预览（反馈节点 🔄）
  ├── 展示所有屏幕 ASCII 或灰度 HTML
  └── 🔄 可跳过（--no-preview）

Phase 7: 交付
  └── 写入线框文件 + Layer 0 摘要 + 推荐下一步（--fidelity=high）
```

### IA Analysis Mode（信息架构优先，low-fidelity 专属）

当用户关注信息组织、导航结构、内容分类时启用：

1. **内容盘点** — 列出所有需要组织的内容/功能
2. **卡片分类** — 建议开放式或封闭式分类方法
3. **导航结构** — 输出站点地图（Max 3 层）
4. **内容模型** — 定义内容类型和关系
5. **验证方法** — 建议树状测试或首次点击测试

## 参数

| 参数 | 类型 | 必需 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| 输入源 | PRD/线框图/自然语言 | 是 | — | PRD 文件、线框图路径或自然语言描述 |
| **--fidelity** | **low/high** | **否** | **high** | **low = 低保真线框图（灰度/ASCII）；high = 可交互原型（默认）** |
| 输出格式 | ascii/html | 否 | html | 仅 low-fidelity 时有效，线框输出格式 |
| 技术栈 | html-tailwind/react | 否 | html-tailwind | 仅 high-fidelity 时有效；html-tailwind = 零配置 |
| **scene** | **枚举字符串** | **否** | **auto-detect** | **B2B-PC / B2B-Mobile / C2C-PC / C2C-Mobile / Tablet-Landscape / Tablet-Portrait / AI-Agent-Chat / AI-Agent-Workflow / AI-Agent-Canvas / auto** |
| **agent-paradigm** | **枚举字符串** | **否** | **auto-detect** | **仅当 scene=AI-Agent-* 时有效：Chat / Canvas / Workflow / Autonomous** |
| **principles-confirmed** | **布尔** | **否** | **false** | **true = 跳过 Layer 0 原则四问** |
| **--no-preview** | **标志** | **否** | **（未设置）** | **设置后跳过反馈节点** |
| 美学基调 | 见 Layer 2 表格 | 否 | 自动推荐 | 仅 high-fidelity；覆盖自动选择 |
| 假数据量 | minimal/realistic | 否 | realistic | 仅 high-fidelity |
| 页面列表 | 文本 | 否 | 从 PRD 提取 | 仅 low-fidelity；指定要生成的页面 |

### scene 参数推断规则

| scene 值 | 推断关键词 | low-fidelity 特征 | high-fidelity 特征 |
|----------|-------------|-------------------|-------------------|
| `B2B-PC` | 管理/后台/CRM/ERP/SaaS/系统 | 侧边栏 + 数据表格 + 高密度 | + Precision Enterprise 基调 |
| `B2B-Mobile` | APP/小程序/手机/移动 + 管理 | 底部 Tab + 卡片列表 + compact | + Industrial Utility 基调 |
| `C2C-PC` | 商城/社区/内容/消费 | 顶部导航 + 网格卡片 + 中密度 | + Editorial Authority/Playful Modular |
| `C2C-Mobile` | APP/小程序 + 消费 | 底部 Tab + 信息流 + 低密度 | + Playful Modular 基调 |
| `Tablet-Landscape` | iPad/平板 + 横屏 | 侧边栏（可收起）+ 双栏 | 高密度 |
| `Tablet-Portrait` | iPad/平板 + 竖屏 | 抽屉式侧边 + 单栏 | 中密度 |
| `AI-Agent-Chat` | Agent/智能体/Copilot/对话/Chat | 对话气泡 + 输入框 + 上下文标签 | + Brutalist Raw 基调 |
| `AI-Agent-Workflow` | 工作流/节点/编排/Flow | 画布 + 节点 + 属性面板 | + Industrial Utility 基调 |
| `AI-Agent-Canvas` | AI编程/代码生成/Chat+Preview | 双栏（对话+预览） | + Brutalist Raw 基调 |
| `auto` | （无法确定） | 默认 `B2B-PC` + `[auto-detected]` | 同左 |

## Low-Fidelity 线框标准

> **原则**：线框的核心是"结构清晰，而非美观"。灰度配色（#333/#666/#999/#eee），无品牌色。
> 组件占位（`[按钮]` `[列表]` `[表单]`），交互标注（点击跳转路径、弹窗触发说明）。

### 场景差异化要点

| 场景 | 布局要点 | 必选标注 |
|------|---------|---------|
| B2B-PC | 侧边栏(200-260px) + 表格；行高 36-40px；一屏 ≥20 字段 | 必填`[标签]*`/选填`[标签]~`；批量操作栏；筛选器 |
| B2B-Mobile | 底部 Tab + 卡片摘要；行高 48-56px | 全宽按钮 ≥44px；优先`[选择]`而非`[输入框]` |
| C2C-PC | 顶部导航 + Hero + 内容网格 | CTA 标注（Hero + 每块 ≥1）；社交证明 |
| C2C-Mobile | 底部 Tab + 单任务流 | 手势标注（`[左滑删除]` `[下拉刷新]`）；全宽按钮 |
| AI-Agent-Chat | 对话历史 + 输入框 | `[建议操作]` `[引用来源]`；自主权指示 |
| AI-Agent-Workflow | 画布 + 属性面板 | `[节点]` `[连线]`；每节点状态标注 |

### ASCII 线框模板（通用）

```
┌─────────────────────────────────────┐
│ Header: Logo    Nav    [Login]     │
├─────────┬─────────────────────────┤
│ Sidebar  │  Main Content           │
│ [Menu]   │  ┌─────────────────┐   │
│ [Item1]  │  │ [Hero Section]  │   │
│ [Item2]  │  │ [CTA Button]    │   │
│           │  └─────────────────┘   │
├─────────┴─────────────────────────┤
│ Footer: Links   Copyright         │
└─────────────────────────────────────┘
```

场景变体见 `references/scene-templates.md`。

## High-Fidelity 交互标准

- [ ] 页面间导航可点击
- [ ] 表单可输入（无需验证）
- [ ] 按钮有 hover/active 反馈
- [ ] 列表可滚动
- [ ] 空状态和加载状态展示
- [ ] 移动端: 触控友好的点击区域（≥ 44px）

## 场景适配矩阵

| 维度 | B 端 PC | B 端移动 | C 端 PC | C 端移动 | 平板横屏 | 平板竖屏 |
|------|----------|----------|---------|----------|----------|----------|
| **布局** | 固定 1280px，侧边栏 | 100%，底部导航 | 响应式 1024-1920，顶部导航 | 100%，底部 Tab | 响应式 768-1024，可收起侧边 | 100%，抽屉侧边+底部 Tab |
| **密度** | 高：表格，20+字段 | 中：卡片+详情 | 中：图文混排 | 低：单任务聚焦 | 高→中：双栏 | 中→低：单栏 |
| **触控** | 鼠标为主（28px） | ≥44px，间距≥8px | 混合（32px） | ≥44px，全宽 | ≥44px，拖拽手柄 | ≥44px，全宽 |

### AI Agent 场景适配

| 维度 | AI 对话助手 | AI 编程 Agent | AI 工作流编排 | AI 自主执行 |
|------|-------------|---------------|---------------|-------------|
| **布局** | 单栏消息堆叠 | 三栏：侧栏+对话+画布 | 画布+属性面板 | 对话+进度+结果 |
| **密度** | 中（对话+引用） | 高（代码+文件树+终端） | 高（节点+属性+日志） | 中→高 |
| **特殊** | 上下文标签管理 | 文件变更 Diff 预览 | 小地图+节点调试 | 实时进度+成本计数 |

## 产出结构

```
# High-fidelity
prototype/
├── index.html          # 主入口
├── page-*.html         # 其他页面
├── data.js             # 假数据（匹配预期 API）
└── MAPPING.md          # PRD↔原型映射表

# Low-fidelity
wireframe/
├── wireframe.html      # 灰度 HTML 线框（或 ASCII 内嵌）
└── user-flow.md        # 用户流程图
```

## 常见错误

| 错误 | 后果 | 正确做法 |
|------|------|----------|
| 通用美学（紫色渐变+Inter） | 千篇一律，无记忆点 | 选择独特视觉基调（high-fidelity） |
| 线框包含颜色/字体/图标 | 偏离线框目的，变设计稿 | 只用灰度+占位符（low-fidelity） |
| 硬编码假数据 | 接后端需重写 | 匹配预期 API 结构 |
| 忽视状态 | 只考虑正常态 | 每个组件定义正常/空/加载/错误 |
| **跳过 Layer 0 原则四问** | AI 盲目套规则 | **必须先回答 Q1-Q4** |
| **反馈节点全部跳过** | 返工概率 >70% | **首次使用不跳过** |

## Gates

| Gate | 位置 | 通过条件 | 失败处理 |
|---|---|---|---|
| **G1: Layer 0 原则门** | Phase 0 后 | Q1-Q4 全部回答 + 展示 + 原则与场景规则无冲突 | Pause→补齐缺失问题；Nudge→`--principles-confirmed` 时跳过但标注 `[默认值]` |
| **G2: 场景判断门** | Phase 1 后 | scene 已确定（用户指定或推断）+ 推断理由已展示 | Risk→无法确定时默认 `B2B-PC` 并标注 `[auto-detected]`；Nudge→推断置信度低时提示用户确认 |
| **G3: 方向预览门**（仅 high-fidelity） | Phase 2 后 | 场景 + 产品姿态 + 美学基调 + 信息密度 + 差异化记忆点已展示并确认 | Pause→未确认不进入编码；Nudge→`--no-preview` 时跳过但首次使用建议不跳过 |
| **G4: 骨架预览门**（反馈节点） | Phase 5 后（high）/ Phase 6 后（low） | HTML 骨架/线框已展示 + 用户反馈已收集 | Pause→未收集反馈不进入完整实现；Risk→`--no-preview` 时跳过但返工风险标注 |
| **G5: 合规验证门**（仅 high-fidelity） | Phase 7 后 | Layer 4 检查全通过（语义化 HTML + 键盘导航 + WCAG AA + 触摸 ≥44px）+ 去AI味检查完成 | Pause→合规项失败必须修复；Nudge→去AI味检查可标注 `[手动复查]` 继续 |
| **G6: PRD 联动门** | Phase 9 后 | MAPPING.md 已生成（User Story ↔ 页面映射）+ 设计决策记录已生成 | Risk→无 PRD 输入时跳过 MAPPING 并标注；Nudge→仅生成设计决策记录 |

Gate 失败 ≠ 终止：标注原因 → 回到对应 Phase → 最多重试 2 次 → 仍失败向用户报告。

## 交付前检查

### 通用检查（两种模式）

- [ ] Layer 0 设计原则四问已回答并展示
- [ ] 原则与场景规则无冲突
- [ ] 场景（scene）已判断并展示理由

### Low-Fidelity 专项检查

- [ ] 每个页面有目的声明（Purpose）
- [ ] 用户流程完整（入口到目标，无跳步）
- [ ] 页面间导航关系已标注
- [ ] 所有关键状态已考虑（正常/空/加载/错误）
- [ ] 组件用占位符，无视觉设计

### High-Fidelity 专项检查

- [ ] 产品框架已定义（目标、用户、操作层次）
- [ ] 选择了一个美学基调并一致执行
- [ ] 使用独特字体（非 Inter/Roboto/Open Sans）
- [ ] 颜色系统使用 CSS 变量，对比度达标
- [ ] 所有交互可点击、可导航
- [ ] 语义化 HTML + 键盘导航
- [ ] 去 AI 味检查已执行（`references/de-ai-checklist.md`）
- [ ] MAPPING.md 已生成（User Story ↔ 页面映射）
- [ ] 设计决策记录已生成

## AI Agent 场景专属规则

> 当 scene 参数包含 `AI-Agent-*` 时，以下规则**强制启用**。
> 完整规则见 `references/agent-ui-rules.md`。

| 规则 | 名称 | 触发条件 |
|------|------|----------|
| AG-01 | 三档自主权模式（建议/确认/执行） | 所有 AI Agent 原型 |
| AG-02 | Agent 状态时间线 | 执行时间 >5s |
| AG-03 | Plan-then-Execute 分离 | >3 步任务 |
| AG-04 | 爆炸半径可视化 | 高风险操作（DELETE/PUT/POST） |
| AG-05~10 | 错误恢复/上下文可视化/渐进披露/工作流编辑器/Artifacts 双栏/任务队列 | 按条件触发 |

## 与其他 Skill 的关系

| Skill | 关系 | 说明 |
|-------|------|------|
| pm-prd | 上游 | PRD → 提取页面和流程 |
| pm-comp | 参考 | 竞品 UI 可参考美学方向 |

## Output Packet

- **artifact_path**: High-fidelity → `prototype/{index.html, page-*.html, data.js, MAPPING.md}`；Low-fidelity → `wireframe/{wireframe.html, user-flow.md}`
- **artifact_type**: `prototype`（high-fidelity）或 `wireframe`（low-fidelity）
- **key_decisions**: [scene 选定值 + 美学基调 + Layer 0 四问核心答案，≤ 3 条]
- **open_assumptions**: [标注 `[假设]` 或 `[auto-detected]` 的待确认项，如 scene 推断、美学基调自动推荐]
- **next_skill_hint**: `pm-prd`（若原型验证后需正式文档化）或 `pm-code-architect`（若直接进入技术架构设计）
- **handoff_context**: 下游需要但不在产出物中的上下文（如被否决的美学方向、用户口头补充的合规要求、Layer 0 原则推导过程）

**下游消费方式**：pm-prd 的 Intent Packet "Context Sources" 字段引用此 packet 的 `artifact_path`（特别是 MAPPING.md）和 `key_decisions`（Layer 0 原则）。

## Meta-Review

交付完成后对照方法论自审：

1. **方法论骨架**：Layer 0 → 场景判断 → 视觉系统 → 原型架构 → 工程合规，五层是否都执行了？反馈节点是否按用户意愿处理？
2. **反理实化警惕**：常见错误表中"通用美学（紫色渐变+Inter）"/"跳过 Layer 0 原则四问"/"反馈节点全部跳过"是否真的被警惕了？（对照检查）
3. **Iron Law 验证**：每条铁律（无 PRD/意图、高保真必须可交互、低保真不含视觉、视觉服务目标、原则先于场景、反馈闭环）是否已验证满足？

**扩展问题（pipeline skill）**：Output Packet 的 `key_decisions`（scene + 美学基调）是否可追溯到 G1（Layer 0 原则门）和 G2（场景判断门）的判定？

自审结果 1-2 句话附在交付物末尾。不通过时回到对应 Phase 修正，不在 Meta-Review 阶段打补丁。

## Evolution Writeback

执行后自问以下 3 个问题，有则记录到 `docs/evolution-log.md`：

1. **方法论偏差**：Layer 0-4 五层架构是否有不够贴合实际的地方？（如某场景经常跳过 Layer 2 视觉系统）
2. **反理实化补充**：是否遇到了常见错误表未覆盖的新模式？（如"AI 味检查太严"等）
3. **边界调整信号**：CAN/CANNOT 是否需要调整？（如某类原型本应转交设计师但被硬撑）

**记录格式**：

```markdown
## YYYY-MM-DD — pm-prototype — [项目/场景]
- **观察**: [一句话描述]
- **建议回写**: [回写到哪个文件/章节 / "仅记录不回写"]
- **置信度**: 高/中/低
```

无观察时跳过此章节，不强写。

## Metadata

```yaml
track: pm
phase: 1
depends_on: [pm-feature-frame, pm-prd]
feeds_to: [pm-prd, pm-code-architect]
schema_type: free
persist_to:
  - prototype/
  - wireframe/
guardrails:
  - Layer 0 设计原则四问不可跳过（除非 --principles-confirmed）
  - 高保真原型必须可交互，纯静态降级为线框图
  - 反馈节点首次使用不跳过（返工概率 >70%）
```
