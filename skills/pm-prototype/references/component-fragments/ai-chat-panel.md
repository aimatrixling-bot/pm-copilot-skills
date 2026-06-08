# AI 对话面板

> **场景**: Chat-first 范式的 AI 对话界面，支持消息流、输入框、上下文标签和推理折叠
> **对应规则**: AG-01（三档自主权）, AG-06（上下文可视化）, AG-07（渐进式披露）
> **交叉引用**: agent-ui-rules.md, de-ai-checklist.md

## 可配置参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| mode | "suggest" | 当前自主权模式：suggest / confirm / execute |
| max_messages | 50 | 消息列表最大条数 |
| show_context | true | 是否显示上下文标签区 |
| collapsible_reasoning | true | 是否支持折叠推理过程 |

## 默认态

```html
<div class="flex h-full flex-col bg-white">
  <!-- 顶部模式栏 -->
  <div class="flex items-center justify-between border-b border-zinc-200 px-4 py-2.5">
    <div class="flex items-center gap-2">
      <span class="text-sm font-semibold text-zinc-900">AI 助手</span>
      <span class="inline-flex items-center rounded-full bg-violet-100 px-2 py-0.5
                   text-xs font-medium text-violet-700">建议模式</span>
    </div>
    <button class="text-xs text-zinc-500 hover:text-zinc-700 transition-colors duration-150">
      切换模式
    </button>
  </div>

  <!-- 上下文标签 AG-06 -->
  <div class="flex items-center gap-1.5 border-b border-zinc-100 px-4 py-2">
    <span class="text-xs text-zinc-400">引用：</span>
    <span class="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600">
      客户名单.xlsx
      <button class="text-zinc-400 hover:text-zinc-600" aria-label="移除引用">×</button>
    </span>
    <span class="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600">
      产品需求文档
      <button class="text-zinc-400 hover:text-zinc-600" aria-label="移除引用">×</button>
    </span>
  </div>

  <!-- 消息列表 -->
  <div class="flex-1 overflow-y-auto px-4 py-4 space-y-4">
    <!-- 用户消息 -->
    <div class="flex justify-end">
      <div class="max-w-[75%] rounded-2xl rounded-br-md bg-sky-500 px-4 py-2.5 text-sm text-white">
        帮我分析这个月的客户转化率
      </div>
    </div>
    <!-- AI 消息（含折叠推理 AG-07） -->
    <div class="flex justify-start">
      <div class="max-w-[75%] space-y-2">
        <details class="group">
          <summary class="cursor-pointer text-xs text-zinc-400 hover:text-zinc-500
                         transition-colors duration-150">
            查看推理过程（3 步）
          </summary>
          <div class="mt-1.5 rounded-lg bg-zinc-50 border border-zinc-100 p-3
                      text-xs text-zinc-500 space-y-1">
            <p>1. 读取客户名单.xlsx，筛选本月新增客户</p>
            <p>2. 对比上月转化率基准值 12.3%</p>
            <p>3. 按来源渠道分组统计</p>
          </div>
        </details>
        <div class="rounded-2xl rounded-bl-md bg-zinc-100 px-4 py-2.5 text-sm text-zinc-800">
          本月客户转化率为 <strong>15.7%</strong>，较上月提升 3.4 个百分点。
          其中线上渠道表现最优（18.2%），线下渠道为 11.5%。
        </div>
      </div>
    </div>
  </div>

  <!-- 输入框 -->
  <div class="border-t border-zinc-200 px-4 py-3">
    <div class="flex items-center gap-2 rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2
                focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20
                transition-all duration-150">
      <input type="text" placeholder="输入消息…"
             class="flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400
                    focus:outline-none" />
      <button class="rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-medium text-white
                     hover:bg-sky-600 transition-colors duration-150">发送</button>
    </div>
  </div>
</div>
```

## 加载态

```html
<div class="flex h-full flex-col bg-white">
  <div class="flex items-center justify-between border-b border-zinc-200 px-4 py-2.5">
    <div class="h-4 w-20 animate-pulse rounded bg-zinc-200"></div>
    <div class="h-4 w-16 animate-pulse rounded bg-zinc-100"></div>
  </div>
  <div class="flex-1 px-4 py-4 space-y-4">
    <div class="flex justify-end">
      <div class="max-w-[60%] h-10 animate-pulse rounded-2xl rounded-br-md bg-zinc-100"></div>
    </div>
    <div class="flex justify-start">
      <div class="flex items-center gap-1.5">
        <div class="h-2 w-2 animate-pulse rounded-full bg-sky-400"></div>
        <div class="h-2 w-2 animate-pulse rounded-full bg-sky-400 [animation-delay:150ms]"></div>
        <div class="h-2 w-2 animate-pulse rounded-full bg-sky-400 [animation-delay:300ms]"></div>
        <span class="text-xs text-zinc-400 ml-1">AI 正在思考…</span>
      </div>
    </div>
  </div>
  <div class="border-t border-zinc-200 px-4 py-3">
    <div class="h-10 animate-pulse rounded-xl bg-zinc-100"></div>
  </div>
</div>
```

## 空态

```html
<div class="flex h-full flex-col bg-white">
  <div class="flex items-center justify-between border-b border-zinc-200 px-4 py-2.5">
    <span class="text-sm font-semibold text-zinc-900">AI 助手</span>
    <span class="inline-flex items-center rounded-full bg-violet-100 px-2 py-0.5
                 text-xs font-medium text-violet-700">建议模式</span>
  </div>
  <div class="flex flex-1 flex-col items-center justify-center px-4">
    <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100">
      <svg class="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0
                 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375" />
      </svg>
    </div>
    <p class="mt-3 text-sm font-medium text-zinc-600">开始一段新对话</p>
    <p class="mt-1 text-xs text-zinc-400">输入你的问题，AI 将为你提供建议</p>
    <div class="mt-4 flex flex-wrap justify-center gap-2">
      <button class="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs
                     text-zinc-600 hover:bg-zinc-50 transition-colors duration-150">
        分析本月数据
      </button>
      <button class="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs
                     text-zinc-600 hover:bg-zinc-50 transition-colors duration-150">
        生成周报摘要
      </button>
    </div>
  </div>
  <div class="border-t border-zinc-200 px-4 py-3">
    <div class="flex items-center gap-2 rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2">
      <input type="text" placeholder="输入消息…"
             class="flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400
                    focus:outline-none" />
      <button class="rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-medium text-white">发送</button>
    </div>
  </div>
</div>
```

## 错误态

```html
<div class="flex h-full flex-col bg-white">
  <div class="flex items-center justify-between border-b border-zinc-200 px-4 py-2.5">
    <span class="text-sm font-semibold text-zinc-900">AI 助手</span>
    <span class="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5
                 text-xs font-medium text-red-600">连接中断</span>
  </div>
  <div class="flex-1 px-4 py-4 space-y-4">
    <div class="flex justify-end">
      <div class="max-w-[75%] rounded-2xl rounded-br-md bg-sky-500 px-4 py-2.5 text-sm text-white">
        帮我分析这个月的客户转化率
      </div>
    </div>
    <div class="flex justify-start">
      <div class="max-w-[75%] rounded-2xl rounded-bl-md border border-red-200
                  bg-red-50 px-4 py-3">
        <p class="text-sm text-red-700">AI 响应超时，请检查网络连接后重试</p>
        <details class="mt-2">
          <summary class="text-xs text-red-500 cursor-pointer">查看详细错误</summary>
          <p class="mt-1 text-xs text-red-400 font-mono">TimeoutError: Request exceeded 30s limit</p>
        </details>
        <button class="mt-3 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white
                       hover:bg-red-700 transition-colors duration-150">重新发送</button>
      </div>
    </div>
  </div>
  <div class="border-t border-zinc-200 px-4 py-3">
    <div class="flex items-center gap-2 rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2">
      <input type="text" disabled placeholder="等待重新连接…"
             class="flex-1 bg-transparent text-sm text-zinc-400 focus:outline-none" />
      <button disabled class="rounded-lg bg-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-500">
        发送
      </button>
    </div>
  </div>
</div>
```
