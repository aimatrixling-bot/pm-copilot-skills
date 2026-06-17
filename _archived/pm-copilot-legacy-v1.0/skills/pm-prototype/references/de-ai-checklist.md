# 去 AI 味检查清单（55 条）

> **使用说明**：生成原型后，逐条检查。每条标注来源，便于追溯。
> 前 15 条（AP-01~AP-15）见 `anti-patterns.md`，本文件不重复写入，仅作索引。

---

## 已有规则（来自 anti-patterns.md，不重复，仅引用）

| # | 规则摘要 | 来源 |
|---|----------|------|
| AP-01~AP-15 | （见 `anti-patterns.md`） | 已有资产 |

> **检查流程**：AP-01~AP-15 在 `anti-patterns.md` 中已有详细说明，直接查阅。本文件从 AP-16 开始。

---

## 字体问题（AP-16~AP-19，4 条）

| # | AI 默认行为 | 修复规则 | 来源 |
|---|------------|----------|------|
| AP-16 | AI 默认用 Inter/Roboto/Open Sans 作为唯一字体 | **字体必须配对使用**：展示字体(标题) + 正文字体 + 代码字体(如有)。B 端推荐：Space Grotesk + Work Sans + JetBrains Mono；C 端推荐：Playfair Display + Source Serif 3 + Fira Code | Anthropic frontend-design skill |
| AP-17 | AI 字重对比不够（400 vs 600） | **字重要用极端值**：100/200 对比 800/900，而非 400 对比 600。标题至少 700，正文 400，辅助 300 | Refactoring UI |
| AP-18 | AI 字号跳跃太小（1.5x） | **字号跳跃至少 3 倍**：H1(48-72px) → H2(24-36px) → Body(16px)，不要用渐进式 24→20→18→16 | Anthropic frontend-design skill |
| AP-19 | AI 中文字体缺失回退方案 | **中文必须声明回退链**：`"Source Han Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif`。不要依赖系统默认 | 实践经验 |

---

## 布局问题（AP-20~AP-24，5 条）

| # | AI 默认行为 | 修复规则 | 来源 |
|---|------------|----------|------|
| AP-20 | AI 倾向于居中布局所有内容 | **B 端侧边栏布局禁止居中**：内容区左对齐，侧边栏固定宽度(200-260px)。C 端首页可以居中，内页左对齐 | Linear UI redesign |
| AP-21 | AI 卡片网格千篇一律 | **布局多样性检查**：B 端列表页 → 表格为主而非卡片；Dashboard → 指标卡+图表+表格混排；C 端首页 → Hero+特性网格+社会证明 | B 端设计规范 |
| AP-22 | AI 忽略层级表面系统 | **层级表面系统**：background → foreground → panels → dialogs → modals，每层表面用不同深度的颜色区分。至少 3 层表面 | Linear UI redesign |
| AP-23 | AI 在窄屏下压缩表格 | **表格禁止强制压缩**：保留横向滚动(`overflow-x: auto`)，不缩小字号到不可读。移动端改用卡片列表替代 | Vercel Guidelines |
| AP-24 | AI 忽略布局对齐精度 | **光学对齐 > 几何对齐**：图标与文字并排时，图标视觉中心对齐文字基线。圆角容器内子元素圆角 ≤ 父元素圆角 | Vercel Guidelines |

---

## 颜色问题（AP-25~AP-29，5 条）

| # | AI 默认行为 | 修复规则 | 来源 |
|---|------------|----------|------|
| AP-25 | AI 倾向于蓝色渐变(蓝→紫)作为主色 | **主色决定规则**：B 端医疗 → 青蓝(#0EA5E9)；B 端金融 → 深蓝(#1E40AF)；C 端电商 → 橙红(#EA580C)；C 端社交 → 品红(#DB2777)。禁止无脑蓝色渐变 | 实践+行业惯例 |
| AP-26 | AI 语义色不分层 | **语义色分工**：主色(Primary)=操作/选中/链接；辅助色(Accent)=AI 功能专属(紫色)；成功/警告/错误各一色。禁止主色做装饰 | 企业级 SaaS 设计规范 |
| AP-27 | AI 忽略非中性色背景的对比度 | **非白背景必须调整边框/文字色调**：在浅蓝背景上，边框应为蓝色调而非灰色调；在深色背景上，文字必须保持 4.5:1 对比度 | Vercel Guidelines |
| AP-28 | AI 深色模式只是简单反转 | **深色模式是独立主题**：表面层级重新定义(bg→panel→dialog)，文字色不能纯白(#E5E7EB 而非 #FFFFFF)，边框用低对比度分隔(#374151) | Linear UI redesign |
| AP-29 | AI 状态只用颜色区分 | **状态必须颜色+文字+图标三重编码**：成功=绿色✓"已完成"；警告=橙色⚠"待处理"；错误=红色✕"已取消"。颜色不能是唯一区分手段 | WCAG AA / Vercel Guidelines |

---

## 间距问题（AP-30~AP-33，4 条）

| # | AI 默认行为 | 修复规则 | 来源 |
|---|------------|----------|------|
| AP-30 | AI 均匀间距，无节奏感 | **间距节奏公式**：页面级(24-32px) > 区域级(16-24px) > 组件级(8-16px) > 元素级(4-8px)。相邻层级间距差至少 2 倍 | Refactoring UI |
| AP-31 | AI 卡片内 padding 一刀切 | **B 端紧凑间距**：表单行 gap-2~4，筛选器 gap-2~3，列表卡片 space-y-2.5，信息行 gap-1.5。C 端宽松间距翻倍 | DESIGN_SPEC.md |
| AP-32 | AI 移动端间距不够大 | **移动端间距放大约 1.5x**：桌面 gap-4 → 移动端 gap-6；桌面 p-4 → 移动端 p-6。移动端留白是功能不是浪费 | Apple HIG |
| AP-33 | AI 分组/分隔不够清晰 | **分组用两种手法**：强分组=带标题的边框卡片+标题；弱分组=间距增大+细线分隔。Section 标题使用 `border-t` + `pt-3` + `text-xs font-bold` | DESIGN_SPEC.md |

---

## 动效问题（AP-34~AP-37，4 条）

| # | AI 默认行为 | 修复规则 | 来源 |
|---|------------|----------|------|
| AP-34 | AI 过度动画（所有元素都在动） | **动效预算原则**：每个页面最多 3 个动画效果。1 个页面级(加载动画)，1 个组件级(状态切换)，1 个微交互(hover/focus)。超过 3 个就是噪音 | Anthropic frontend-design skill |
| AP-35 | AI 动画时长过长 | **动画时长规则**：微交互 150ms，状态切换 200-300ms，页面过渡 300-500ms。超过 500ms 的动画必须有用户主动触发 | Vercel Guidelines |
| AP-36 | AI 忽略 prefers-reduced-motion | **必须支持 reduced-motion**：`@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition-duration: 0.01ms !important; } }` | Vercel Guidelines |
| AP-37 | AI 动画使用 JS 驱动 | **动画优先级**：CSS animation > Web Animations API > JS 库。React 场景才使用 Motion 库。禁止 `transition: all`，只列需要动画的属性 | Vercel Guidelines |

---

## 数据问题（AP-38~AP-41，4 条）

| # | AI 默认行为 | 修复规则 | 来源 |
|---|------------|----------|------|
| AP-38 | AI 使用 "Lorem ipsum" 或假数据 | **数据必须语义化**：人名用真实中文姓名(张明远、李思琪)，金额用合理数字(¥12,800)，日期用近期日期。医疗场景用标准术语(IOL、SPU) | H-ID02 信息完整性 |
| AP-39 | AI 数据全是正样本 | **数据必须包含边界情况**：长文本(标题 50 字+)，零值(余额 ¥0)，负值(欠款)，特殊字符(O'Brien)，空状态列表 | anti-patterns.md #10 扩展 |
| AP-40 | AI 数据结构与 API 脱节 | **数据结构必须可映射到 API**：字段名用 camelCase(`patientName` 而非 `患者姓名`)，数据类型匹配后端(integer 不写 string)，嵌套结构不超过 3 层 | pm-prototype Layer 3 |
| AP-41 | AI 忽略数据展示的等宽对齐 | **数字列必须等宽对齐**：金额、数量、编号使用 `font-variant-numeric: tabular-nums`。表格数字列右对齐，表头也右对齐 | Vercel Guidelines + DESIGN_SPEC.md |

---

## 交互/可访问性问题（AP-42~AP-45，4 条）

| # | AI 默认行为 | 修复规则 | 来源 |
|---|------------|----------|------|
| AP-42 | AI 使用 div 做按钮/链接 | **交互元素必须语义化**：导航链接用 `<a>` 或 `<Link>`，按钮用 `<button>`，表单用 `<form>`。`<div onClick>` 一律禁止 | Vercel Guidelines + anti-patterns.md #4 |
| AP-43 | AI 不处理加载/空/错误状态 | **每个组件必须定义 4 态**：默认态、加载态(skeleton/spinner)、空态(图标+说明文字)、错误态(错误信息+重试按钮)。B 端额外增加：批量选中态、筛选态 | anti-patterns.md #5 扩展 |
| AP-44 | AI 移动端输入框字号 <16px | **移动端输入框字号 ≥16px**：iOS Safari 会自动缩放小于 16px 的输入框，导致布局偏移。设置 `font-size: 16px` 或 `maximum-scale=1` | Vercel Guidelines |
| AP-45 | AI 焦点样式缺失或不明显 | **焦点必须清晰可见**：使用 `:focus-visible` 而非 `:focus`(避免鼠标用户看到焦点环)。焦点环宽度 ≥2px，对比度 ≥3:1。Tab 导航顺序与视觉顺序一致 | Vercel Guidelines |

---

## AI Agent 专属问题（AP-46~AP-55，10 条）

| # | AI 默认行为 | 修复规则 | 来源 |
|---|------------|----------|------|
| AP-46 | AI 不展示 Agent 自主权模式 | 必须展示当前模式（建议/确认/执行），且切换入口 ≤2 次点击 | AG-01 |
| AP-47 | AI 长时执行无进度反馈 | 执行时间 >5s 必须展示实时状态时间线（已完成/当前/待执行） | AG-02 |
| AP-48 | AI 复杂任务不展示执行计划 | >3 步任务必须先展示计划，用户确认后再执行 | AG-03 |
| AP-49 | AI 高风险操作无影响范围预览 | DELETE/PUT/POST 类操作必须展示爆炸半径（受影响数据列表） | AG-04 |
| AP-50 | AI 执行失败后回到初始状态 | 必须提供"从失败点恢复"入口，不得重头开始 | AG-05 |
| AP-51 | AI 对话型 Agent 不展示上下文边界 | 必须展示 Token 使用量 + 已引用文件列表 | AG-06 |
| AP-52 | AI 推理过程全量输出 | 默认折叠，逐层展开（结论→关键推理→完整思考） | AG-07 |
| AP-53 | AI 工作流编辑器无小地图 | 节点 >5 个时必须有小地图 + 节点搜索（Cmd/Ctrl+K） | AG-08 |
| AP-54 | AI Chat+Canvas 产物未双栏展示 | 产物 >20 行或含可交互元素时，必须左右双栏 | AG-09 |
| AP-55 | AI 多任务无队列管理 | 必须展示任务队列（状态+优先级+预估剩余时间） | AG-10 |

---

## 检查流程

```
原型生成完成后：
1. 逐条检查 AP-01~AP-55（AP-01~15 见 anti-patterns.md）
2. 每发现一个 AI 味问题 → 记录到 {文件名}-ai-issues.md
3. 修复后重新检查，直到 0 个问题
4. 在交付文件中附加检查报告
```

---

**Version**: 1.0.0
**Last Updated**: 2026-06-08
