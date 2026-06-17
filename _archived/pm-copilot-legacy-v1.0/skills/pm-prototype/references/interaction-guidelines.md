# 交互规范（Vercel Guidelines 精选 30 条）

> **来源**：Vercel Web Interface Guidelines（80+ 条规则中精选 30 条最关键规则）
> **与 de-ai-checklist.md 的关系**：本文件聚焦交互实现规范；de-ai-checklist.md 聚焦去 AI 味检查。两者互补，交叉引用标注 `(↗ AP-XX)`。
> **与 executable-rules.md 的关系**：本文件是交互维度的实现级规范；executable-rules.md 是原则级的可执行规则。

---

## 维度 1：交互反馈（IG-01~06）

### IG-01：按钮加载延迟 150-300ms

> 来源：Vercel Guidelines — Button Loading | 交叉：executable-rules.md ID-09

按钮点击后，不要立即显示 loading 状态。延迟 150-300ms 再切换——避免快速响应时的闪烁。如果操作在 150ms 内完成，则直接显示结果。

```html
<!-- 正确：延迟 loading 指示 -->
<button class="bg-blue-600 text-white px-4 py-2 rounded-md"
        onclick="handleClick(this)">
  提交
</button>

<script>
function handleClick(btn) {
  const timer = setTimeout(() => {
    btn.disabled = true;
    btn.innerHTML = '<span class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> 处理中...';
  }, 200); // 150-300ms 延迟
  submitForm().then(() => {
    clearTimeout(timer);
    btn.disabled = false;
    btn.textContent = '提交';
  });
}
</script>
```

---

### IG-02：空状态必须有引导操作

> 来源：Vercel Guidelines — Empty States | 交叉：(↗ AP-43)

空状态不是"什么都没有"，是引导用户完成首次操作的窗口。必须包含：图标 + 说明文字 + 行动按钮。

```html
<!-- B 端空状态 -->
<div class="flex flex-col items-center justify-center py-12 text-center">
  <svg class="w-12 h-12 text-gray-300 mb-4"><!-- inbox icon --></svg>
  <h3 class="text-sm font-medium text-gray-900">暂无患者记录</h3>
  <p class="text-xs text-gray-500 mt-1">点击下方按钮添加第一位患者</p>
  <button class="mt-4 bg-blue-600 text-white text-sm px-4 py-2 rounded-md">
    + 新增患者
  </button>
</div>
```

---

### IG-03：命令面板 ⌘K

> 来源：Vercel Guidelines — Command Menu

B 端产品（Sovereign 姿态）必须支持 ⌘K / Ctrl+K 命令面板。用于：导航、搜索、操作快捷入口。

```html
<!-- 命令面板触发器 -->
<div class="relative">
  <button class="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400
                 border border-gray-200 rounded-md hover:border-gray-300
                 transition-colors w-64">
    <svg class="w-4 h-4"><!-- search icon --></svg>
    <span>搜索命令...</span>
    <kbd class="ml-auto text-xs bg-gray-100 px-1.5 py-0.5 rounded">⌘K</kbd>
  </button>
</div>
```

---

### IG-04：批量操作进度条

> 来源：Vercel Guidelines — Batch Operations

批量操作（删除、导出、状态变更）必须展示进度条，而非仅显示 spinner。

```html
<!-- 批量操作进度 -->
<div class="fixed bottom-4 right-4 bg-white border border-gray-200
            rounded-lg shadow-lg p-4 w-80">
  <div class="flex items-center justify-between mb-2">
    <span class="text-sm font-medium">正在处理 25 条记录...</span>
    <span class="text-xs text-gray-500">12/25</span>
  </div>
  <div class="w-full bg-gray-100 rounded-full h-1.5">
    <div class="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
         style="width: 48%"></div>
  </div>
  <button class="mt-2 text-xs text-red-500 hover:text-red-700">取消</button>
</div>
```

---

### IG-05：表单提交防重复

> 来源：Vercel Guidelines — Form Submission

表单提交期间禁用提交按钮并改变视觉状态。防止用户重复点击导致多次提交。

```html
<!-- 提交中状态 -->
<button type="submit" disabled
        class="bg-gray-400 text-white px-4 py-2 rounded-md cursor-not-allowed
               flex items-center gap-2">
  <span class="animate-spin inline-block w-4 h-4 border-2 border-white
               border-t-transparent rounded-full"></span>
  提交中...
</button>
```

---

### IG-06：行内反馈优先于弹窗

> 来源：executable-rules.md ID-02 | 交叉：(↗ AP-43)

非紧急反馈用行内消息（表单下方、操作区域附近），不用 Modal。紧急反馈（数据丢失风险）才用 Modal。

```html
<!-- 行内成功反馈 -->
<div class="flex items-center gap-2 text-sm text-green-600 mt-2
            animate-[fade-in_200ms_ease-out]">
  <svg class="w-4 h-4"><!-- check icon --></svg>
  <span>保存成功</span>
</div>

<!-- 行内错误反馈（紧贴字段） -->
<div class="mt-1 text-sm text-red-500 flex items-center gap-1">
  <svg class="w-3.5 h-3.5"><!-- error icon --></svg>
  <span>手机号格式不正确</span>
</div>
```

---

## 维度 2：动画规范（IG-07~11）

### IG-07：动画时长三档

> 来源：Vercel Guidelines — Animation Duration | 交叉：(↗ AP-35)

| 类型 | 时长 | 示例 |
|------|------|------|
| 微交互 | 150ms | Hover/focus 状态变化 |
| 状态切换 | 200-300ms | 展开/折叠、Tab 切换 |
| 页面过渡 | 300-500ms | 路由切换、Modal 出现 |

超过 500ms 的动画必须有用户主动触发。

```css
/* 时长变量 */
:root {
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;
}
```

---

### IG-08：必须支持 prefers-reduced-motion

> 来源：Vercel Guidelines — Reduced Motion | 交叉：(↗ AP-36)

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

### IG-09：CSS 动画优先于 JS

> 来源：Vercel Guidelines — Animation Performance | 交叉：(↗ AP-37)

优先级：CSS `animation` > Web Animations API > JS 库。禁止 `transition: all`，只列需要动画的属性。

```css
/* 正确：只动画需要的属性 */
.button { transition: background-color 150ms ease, box-shadow 150ms ease; }

/* 错误：transition: all 导致性能问题 */
/* .button { transition: all 150ms; } */
```

---

### IG-10：骨架屏用 Shimmer 效果

> 来源：Vercel Guidelines — Skeleton Loading | 交叉：(↗ AP-43)

骨架屏 > Spinner。使用 shimmer 动画暗示数据即将到来。

```html
<!-- Shimmer 骨架屏 -->
<div class="animate-pulse space-y-3">
  <div class="h-4 bg-gray-200 rounded w-3/4"></div>
  <div class="h-4 bg-gray-200 rounded w-1/2"></div>
  <div class="h-4 bg-gray-200 rounded w-5/6"></div>
</div>
```

---

### IG-11：共享元素过渡

> 来源：Vercel Guidelines — Shared Element Transitions

列表→详情的页面过渡，保持视觉元素连续性。使用 View Transitions API 或 CSS `@starting-style`。

```css
/* View Transitions API 基础用法 */
::view-transition-old(root) {
  animation: 300ms ease-out both fade-out;
}
::view-transition-new(root) {
  animation: 300ms ease-in both fade-in;
}
```

---

## 维度 3：布局规范（IG-12~16）

### IG-12：层级表面系统

> 来源：Vercel Guidelines — Surface Layers | 交叉：(↗ AP-22)

至少 3 层表面，每层用不同深度的背景色区分：

```
background → foreground → panels → dialogs → modals
  bg-white    bg-white     bg-gray-50   bg-white    bg-white
                           shadow-sm    shadow-md   shadow-xl
                                        border       backdrop-blur
```

```html
<!-- 3 层表面示例 -->
<div class="bg-gray-50 min-h-screen">           <!-- Layer 1: background -->
  <div class="bg-white shadow-sm">              <!-- Layer 2: foreground -->
    <header>导航栏</header>
  </div>
  <main class="p-6">
    <div class="bg-white border rounded-lg shadow-sm p-4">  <!-- Layer 3: panel -->
      内容区域
    </div>
  </main>
</div>
```

---

### IG-13：圆角一致性

> 来源：Vercel Guidelines — Border Radius | 交叉：(↗ AP-24)

全站圆角统一为 3 个档位。子元素圆角 ≤ 父元素圆角。

| 元素类型 | 圆角 | Tailwind |
|----------|------|----------|
| 大容器（卡片、面板） | 8-12px | `rounded-lg` |
| 按钮、输入框 | 6px | `rounded-md` |
| 标签、Badge | 4px | `rounded` |

---

### IG-14：表格禁止强制压缩

> 来源：Vercel Guidelines — Table Layout | 交叉：(↗ AP-23)

窄屏下保留横向滚动（`overflow-x: auto`），不缩小字号到不可读。移动端改用卡片列表。

```html
<!-- 桌面端：可滚动表格 -->
<div class="overflow-x-auto">
  <table class="w-full text-sm">
    <thead>
      <tr class="border-b text-left">
        <th class="py-2 px-3 font-medium text-gray-500 whitespace-nowrap">患者姓名</th>
        <th class="py-2 px-3 font-medium text-gray-500 whitespace-nowrap">预约日期</th>
        <th class="py-2 px-3 font-medium text-gray-500 whitespace-nowrap">治疗类型</th>
      </tr>
    </thead>
    <tbody><!-- rows --></tbody>
  </table>
</div>
```

---

### IG-15：侧边栏动画折叠

> 来源：Vercel Guidelines — Sidebar Animation

B 端侧边栏折叠/展开使用 `width` 过渡，不使用 `transform`（避免内容闪烁）。

```css
.sidebar {
  width: 240px;
  transition: width 200ms ease;
}
.sidebar.collapsed {
  width: 60px;
}
```

---

### IG-16：基于内容的断点

> 来源：Vercel Guidelines — Responsive Breakpoints

断点不应基于设备宽度，而基于内容能否舒适展示。核心规则：当一行放不下最少 3 列时切换到堆叠布局。

```css
/* 基于内容的布局切换 */
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}
```

---

## 维度 4：表单规范（IG-17~22）

### IG-17：移动端输入框字号 ≥16px

> 来源：Vercel Guidelines — Mobile Input Font Size | 交叉：(↗ AP-44)

iOS Safari 会自动缩放小于 16px 的输入框，导致布局偏移。

```html
<!-- 移动端输入框 -->
<input type="text"
       class="w-full px-3 py-2 text-base border border-gray-300 rounded-md
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
       style="font-size: 16px" />
```

---

### IG-18：Blur 验证优于 Submit 验证

> 来源：Vercel Guidelines — Form Validation

表单验证时机优先级：`onBlur`（离开字段时）> `onChange`（实时）> `onSubmit`（提交时）。不在用户输入过程中打断。

```html
<!-- Blur 验证示例 -->
<div class="space-y-1">
  <label class="text-sm font-medium text-gray-700">邮箱</label>
  <input type="email" required
         class="w-full px-3 py-2 border border-gray-300 rounded-md
                focus:ring-2 focus:ring-blue-500"
         onblur="validateEmail(this)" />
  <p class="text-sm text-red-500 hidden" id="email-error">
    请输入有效的邮箱地址
  </p>
</div>
```

---

### IG-19：错误信息紧贴字段

> 来源：Vercel Guidelines — Error Placement

错误信息放在字段正下方，不用 Toast 或页面顶部汇总。用红色文字 + 图标，不用弹窗。

```html
<!-- 错误紧贴字段 -->
<div>
  <input class="border-red-500 focus:ring-red-500 ..." />
  <p class="mt-1 text-sm text-red-500 flex items-center gap-1">
    <svg class="w-3.5 h-3.5 shrink-0"><!-- error icon --></svg>
    此字段为必填项
  </p>
</div>
```

---

### IG-20：自定义 Select 替代原生

> 来源：Vercel Guidelines — Custom Select

原生 `<select>` 在不同浏览器表现不一致。B 端产品使用自定义下拉组件。

```html
<!-- 自定义 Select 基础结构 -->
<div class="relative" x-data="{ open: false, selected: '请选择' }">
  <button @click="open = !open"
          class="w-full flex items-center justify-between px-3 py-2
                 border border-gray-300 rounded-md text-sm text-left">
    <span x-text="selected"></span>
    <svg class="w-4 h-4 text-gray-400"><!-- chevron icon --></svg>
  </button>
  <div x-show="open" class="absolute z-10 mt-1 w-full bg-white border
                            border-gray-200 rounded-md shadow-lg max-h-60
                            overflow-auto">
    <!-- options -->
  </div>
</div>
```

---

### IG-21：日期输入用 type="date"

> 来源：Vercel Guidelines — Date Input

日期字段使用 `<input type="date">`，不使用自定义日期选择器（除非有明确的范围选择需求）。

```html
<input type="date"
       class="px-3 py-2 border border-gray-300 rounded-md text-sm" />
```

---

### IG-22：表单分组用标题+间距

> 来源：Vercel Guidelines — Form Grouping | 交叉：(↗ AP-33)

长表单（>6 字段）必须分组。强分组用边框卡片 + 标题；弱分组用间距增大 + 细线分隔。

```html
<!-- 强分组 -->
<fieldset class="border border-gray-200 rounded-lg p-4">
  <legend class="text-xs font-bold text-gray-500 px-2">基本信息</legend>
  <div class="grid grid-cols-2 gap-4">
    <!-- 字段 -->
  </div>
</fieldset>

<!-- 弱分组 -->
<div class="border-t pt-3 mt-4">
  <h4 class="text-xs font-bold text-gray-500 mb-3">联系方式</h4>
  <!-- 字段 -->
</div>
```

---

## 维度 5：性能规范（IG-23~26）

### IG-23：图片懒加载

> 来源：Vercel Guidelines — Image Optimization

所有非首屏图片使用 `loading="lazy"`。首屏关键图片用 `fetchpriority="high"`。

```html
<!-- 非首屏图片 -->
<img src="product.jpg" loading="lazy" alt="商品图片"
     class="w-full h-48 object-cover rounded-md" />

<!-- 首屏关键图片 -->
<img src="hero.jpg" fetchpriority="high" alt="主图"
     class="w-full h-64 object-cover" />
```

---

### IG-24：异步脚本加载

> 来源：Vercel Guidelines — Script Loading

第三方脚本使用 `async` 或 `defer`。分析脚本放在 `<head>` + `defer`，交互脚本放在 `</body>` 前。

```html
<!-- 分析脚本：defer -->
<script src="analytics.js" defer></script>

<!-- 交互脚本：body 末尾 -->
<script src="app.js" type="module"></script>
```

---

### IG-25：路由预加载

> 来源：Vercel Guidelines — Route Prefetching

鼠标 hover 到导航链接时预加载目标页面资源。

```html
<!-- Link prefetch -->
<a href="/dashboard" class="hover:bg-gray-50 px-3 py-2 rounded-md"
   onmouseover="prefetch('/dashboard')">
  仪表盘
</a>
```

---

### IG-26：状态三重编码

> 来源：Vercel Guidelines — Status Encoding | 交叉：(↗ AP-29)、executable-rules.md VD-02

状态必须同时用颜色 + 文字 + 图标三重编码。颜色不能是唯一区分手段。

```html
<!-- 状态三重编码 -->
<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs
             bg-green-50 text-green-700">
  <svg class="w-3.5 h-3.5"><!-- check-circle icon --></svg>
  已完成
</span>

<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs
             bg-amber-50 text-amber-700">
  <svg class="w-3.5 h-3.5"><!-- clock icon --></svg>
  待处理
</span>

<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs
             bg-red-50 text-red-700">
  <svg class="w-3.5 h-3.5"><!-- x-circle icon --></svg>
  已取消
</span>
```

---

## 维度 6：可访问性规范（IG-27~30）

### IG-27：焦点用 :focus-visible

> 来源：Vercel Guidelines — Focus Styles | 交叉：(↗ AP-45)

使用 `:focus-visible` 而非 `:focus`，避免鼠标用户看到焦点环。焦点环宽度 ≥2px，对比度 ≥3:1。

```css
/* 正确：focus-visible */
button:focus-visible,
a:focus-visible,
input:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* 错误：:focus 会在鼠标点击时也显示焦点环 */
/* button:focus { outline: 2px solid blue; } */
```

---

### IG-28：交互元素必须语义化

> 来源：Vercel Guidelines — Semantic HTML | 交叉：(↗ AP-42)

导航用 `<a>` 或 `<Link>`，按钮用 `<button>`，表单用 `<form>`。`<div onClick>` 一律禁止。

```html
<!-- 正确 -->
<button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md">
  提交
</button>

<!-- 错误 -->
<!-- <div class="button" onclick="submit()">提交</div> -->
```

---

### IG-29：图标必须有可访问标签

> 来源：Vercel Guidelines — Icon Accessibility

纯图标按钮必须有 `aria-label`。装饰性图标用 `aria-hidden="true"`。

```html
<!-- 可操作图标按钮 -->
<button aria-label="关闭" class="p-1 hover:bg-gray-100 rounded">
  <svg class="w-5 h-5" aria-hidden="true"><!-- x icon --></svg>
</button>

<!-- 装饰性图标 -->
<span class="inline-flex items-center gap-1">
  <svg class="w-4 h-4" aria-hidden="true"><!-- info icon --></svg>
  <span>提示信息</span>
</span>
```

---

### IG-30：颜色对比度 ≥4.5:1

> 来源：Vercel Guidelines — Color Contrast | WCAG AA

正文文字与背景的对比度 ≥4.5:1（AA 级）。大标题（≥18px 或 ≥14px bold）≥3:1。

```html
<!-- 安全的文字颜色组合 -->
<p class="text-gray-900">主文字（#111827 on white, 对比度 16.7:1）</p>
<p class="text-gray-600">次要文字（#4B5563 on white, 对比度 7.1:1）</p>
<p class="text-gray-400">禁用/占位符（#9CA3AF on white, 对比度 3.0:1，仅用于大文字）</p>
```

---

## 检查流程

```
原型生成完成后：
1. 逐条检查 IG-01~IG-30
2. 每条标注 [✓通过 / ✗未通过 / ○不适用]
3. 不通过的项必须在交付前修复
4. 不适用的项标注原因（如：移动端不适用侧边栏规则）
```

---

## 与其他参考文件的关系

| 文件 | 关系 |
|------|------|
| `de-ai-checklist.md` | 互补——本文件是正向规范，de-ai-checklist 是反向检查 |
| `executable-rules.md` | 上游——本文件是 ID-09/VD-02 等规则的实现级展开 |
| `scene-rules.md` | 上游——场景决定本文件规则的适用范围和参数 |
| `anti-patterns.md` | 反面参考——本文件的部分规则直接来自反模式的修复方案 |
| `agent-ui-rules.md` | 扩展——AI Agent 交互在 AG 规则中有额外要求 |

---

**Version**: 1.0.0
**Last Updated**: 2026-06-08
