# AI 上下文管理面板

> **场景**: 对话型 Agent 的上下文边界可视化——Token 用量、已引用文件、压缩提醒
> **对应规则**: AG-06（上下文窗口可视化）
> **交叉引用**: agent-ui-rules.md, de-ai-checklist.md

## 可配置参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| max_tokens | 128000 | 上下文窗口总 Token 数 |
| show_sources | true | 是否展示已引用文件列表 |
| show_compress | true | 是否展示压缩提醒 |
| warn_threshold | 0.75 | 触发压缩提醒的用量百分比 |

## 默认态

```html
<div class="rounded-xl border border-zinc-200 bg-white">
  <!-- Token 使用量进度条 -->
  <div class="border-b border-zinc-200 px-5 py-4">
    <div class="flex items-center justify-between mb-2">
      <span class="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Token 使用量</span>
      <span class="text-xs text-zinc-500">86,400 / 128,000</span>
    </div>
    <div class="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
      <div class="h-full rounded-full bg-amber-400" style="width: 67.5%"></div>
    </div>
    <p class="mt-1.5 text-xs text-amber-600">
      已使用 67.5%，建议精简上下文以保持响应质量
    </p>
  </div>

  <!-- 已引用文件/数据源（可展开/删除） -->
  <div class="px-5 py-4">
    <div class="flex items-center justify-between mb-3">
      <span class="text-xs font-semibold text-zinc-500 uppercase tracking-wider">已引用资源</span>
      <span class="text-xs text-zinc-400">4 项</span>
    </div>
    <ul class="space-y-2">
      <li class="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2">
        <div class="flex items-center gap-2 min-w-0">
          <svg class="h-4 w-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          <div class="min-w-0">
            <p class="text-sm text-zinc-800 truncate">客户名单.xlsx</p>
            <p class="text-xs text-zinc-400">12,400 tokens</p>
          </div>
        </div>
        <button class="text-zinc-400 hover:text-red-500 transition-colors duration-150 shrink-0"
                aria-label="移除引用">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </li>
      <li class="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2">
        <div class="flex items-center gap-2 min-w-0">
          <svg class="h-4 w-4 text-sky-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          <div class="min-w-0">
            <p class="text-sm text-zinc-800 truncate">产品需求文档 v2.3</p>
            <p class="text-xs text-zinc-400">28,600 tokens</p>
          </div>
        </div>
        <button class="text-zinc-400 hover:text-red-500 transition-colors duration-150 shrink-0"
                aria-label="移除引用">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </li>
      <li class="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2">
        <div class="flex items-center gap-2 min-w-0">
          <svg class="h-4 w-4 text-violet-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
          </svg>
          <div class="min-w-0">
            <p class="text-sm text-zinc-800 truncate">Supabase: ods.appointments_raw</p>
            <p class="text-xs text-zinc-400">35,200 tokens</p>
          </div>
        </div>
        <button class="text-zinc-400 hover:text-red-500 transition-colors duration-150 shrink-0"
                aria-label="移除引用">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </li>
    </ul>
  </div>

  <!-- 上下文压缩提醒 -->
  <div class="border-t border-amber-200 bg-amber-50/50 px-5 py-3">
    <div class="flex items-center gap-2">
      <svg class="h-4 w-4 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.168 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
              clip-rule="evenodd" />
      </svg>
      <p class="text-xs text-amber-700">上下文使用量较高，AI 可能遗漏早期对话内容。</p>
    </div>
    <button class="mt-2 rounded-md bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-800
                   hover:bg-amber-200 transition-colors duration-150">
      压缩上下文（保留关键信息）
    </button>
  </div>
</div>
```

## 加载态

```html
<div class="rounded-xl border border-zinc-200 bg-white">
  <div class="border-b border-zinc-200 px-5 py-4">
    <div class="flex justify-between mb-2">
      <div class="h-3 w-20 animate-pulse rounded bg-zinc-200"></div>
      <div class="h-3 w-24 animate-pulse rounded bg-zinc-100"></div>
    </div>
    <div class="h-2 w-full animate-pulse rounded-full bg-zinc-100"></div>
  </div>
  <div class="px-5 py-4 space-y-2">
    <div class="h-9 animate-pulse rounded-lg bg-zinc-50"></div>
    <div class="h-9 animate-pulse rounded-lg bg-zinc-50"></div>
    <div class="h-9 animate-pulse rounded-lg bg-zinc-50"></div>
  </div>
</div>
```

## 空态

```html
<div class="rounded-xl border border-zinc-200 bg-white">
  <div class="border-b border-zinc-200 px-5 py-4">
    <div class="flex items-center justify-between mb-2">
      <span class="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Token 使用量</span>
      <span class="text-xs text-zinc-400">0 / 128,000</span>
    </div>
    <div class="h-2 w-full rounded-full bg-zinc-100">
      <div class="h-full rounded-full bg-emerald-400" style="width: 0%"></div>
    </div>
  </div>
  <div class="flex flex-col items-center justify-center py-8">
    <p class="text-sm text-zinc-500">尚未引用任何资源</p>
    <p class="mt-1 text-xs text-zinc-400">对话中引用的文件和数据将在此展示</p>
  </div>
</div>
```

## 错误态

```html
<div class="rounded-xl border border-zinc-200 bg-white">
  <div class="border-b border-red-100 bg-red-50/50 px-5 py-4">
    <div class="flex items-center justify-between mb-2">
      <span class="text-xs font-semibold text-red-600 uppercase tracking-wider">Token 溢出</span>
      <span class="text-xs text-red-600 font-medium">132,800 / 128,000</span>
    </div>
    <div class="h-2 w-full rounded-full bg-red-100 overflow-hidden">
      <div class="h-full rounded-full bg-red-500" style="width: 100%"></div>
    </div>
    <p class="mt-1.5 text-xs text-red-600">上下文已超出窗口限制，AI 将无法接收新信息。</p>
  </div>
  <div class="px-5 py-4">
    <p class="text-xs font-semibold text-zinc-600 mb-2">必须移除部分引用以继续对话</p>
    <ul class="space-y-2">
      <li class="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-3 py-2">
        <div class="flex items-center gap-2">
          <svg class="h-4 w-4 text-violet-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
          </svg>
          <div>
            <p class="text-sm text-zinc-800">Supabase: ods.appointments_raw</p>
            <p class="text-xs text-red-500">最大占用 35,200 tokens</p>
          </div>
        </div>
        <button class="rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white
                       hover:bg-red-700 transition-colors duration-150">移除</button>
      </li>
    </ul>
    <button class="mt-3 w-full rounded-lg bg-amber-100 px-3 py-2 text-sm font-medium text-amber-800
                   hover:bg-amber-200 transition-colors duration-150">
      自动压缩（保留摘要）
    </button>
  </div>
</div>
```
