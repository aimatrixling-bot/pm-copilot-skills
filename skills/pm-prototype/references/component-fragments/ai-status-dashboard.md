# AI Agent 状态监控仪表盘

> **场景**: 多任务并发时的任务队列管理 + 人工交接面板
> **对应规则**: AG-10（Agent 任务队列与人工交接）
> **交叉引用**: agent-ui-rules.md, de-ai-checklist.md

## 可配置参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| show_eta | true | 是否展示预估剩余时间 |
| show_handoff | true | 是否展示人工交接区域 |
| sortable | true | 是否支持拖拽重排序 |
| priority_levels | 3 | 优先级档位数（1-5） |

## 默认态

```html
<div class="rounded-xl border border-zinc-200 bg-white">
  <div class="border-b border-zinc-200 px-5 py-3">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold text-zinc-900">任务队列</h3>
      <span class="text-xs text-zinc-500">4 个任务</span>
    </div>
  </div>

  <!-- 任务列表 -->
  <div class="divide-y divide-zinc-100">
    <!-- 执行中 -->
    <div class="flex items-center gap-3 px-5 py-3">
      <div class="flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 shrink-0">
        <div class="h-2 w-2 animate-pulse rounded-full bg-sky-500"></div>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <p class="text-sm font-medium text-zinc-900 truncate">客户数据清洗</p>
          <span class="rounded bg-sky-100 px-1.5 py-0.5 text-xs font-medium text-sky-700">执行中</span>
        </div>
        <p class="mt-0.5 text-xs text-zinc-400">预计剩余 8s</p>
      </div>
      <span class="rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-600">P1</span>
    </div>
    <!-- 等待审批 -->
    <div class="flex items-center gap-3 px-5 py-3 bg-amber-50/50">
      <div class="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 shrink-0">
        <svg class="h-3 w-3 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.168 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                clip-rule="evenodd" />
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <p class="text-sm font-medium text-zinc-900 truncate">发送催缴通知</p>
          <span class="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700">待审批</span>
        </div>
        <p class="mt-0.5 text-xs text-zinc-400">需要您确认后执行</p>
      </div>
      <span class="rounded bg-orange-100 px-1.5 py-0.5 text-xs font-medium text-orange-600">P2</span>
    </div>
    <!-- 排队中 -->
    <div class="flex items-center gap-3 px-5 py-3">
      <div class="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 shrink-0">
        <div class="h-1.5 w-1.5 rounded-full bg-zinc-400"></div>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-zinc-500 truncate">生成月度报告</p>
        <p class="mt-0.5 text-xs text-zinc-400">排队中 · 等待前序任务完成</p>
      </div>
      <span class="rounded bg-zinc-100 px-1.5 py-0.5 text-xs font-medium text-zinc-500">P3</span>
    </div>
    <!-- 已完成 -->
    <div class="flex items-center gap-3 px-5 py-3">
      <div class="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 shrink-0">
        <svg class="h-3 w-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-zinc-400 truncate">数据备份</p>
        <p class="mt-0.5 text-xs text-zinc-300">已完成 · 耗时 2.1s</p>
      </div>
      <span class="rounded bg-zinc-100 px-1.5 py-0.5 text-xs font-medium text-zinc-400">P1</span>
    </div>
  </div>

  <!-- 人工交接区域 AG-10 -->
  <div class="border-t border-zinc-200 px-5 py-3 bg-zinc-50/50">
    <div class="flex items-center gap-2 mb-2">
      <svg class="h-4 w-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
      </svg>
      <span class="text-xs font-semibold text-zinc-700">需要人工介入</span>
    </div>
    <p class="text-xs text-zinc-500">任务「发送催缴通知」需要确认收件人名单（12 人）</p>
    <div class="mt-2 flex gap-2">
      <button class="rounded-md bg-sky-500 px-3 py-1 text-xs font-medium text-white
                     hover:bg-sky-600 transition-colors duration-150">确认执行</button>
      <button class="rounded-md border border-zinc-200 px-3 py-1 text-xs text-zinc-600
                     hover:bg-white transition-colors duration-150">查看详情</button>
    </div>
  </div>
</div>
```

## 加载态

```html
<div class="rounded-xl border border-zinc-200 bg-white">
  <div class="border-b border-zinc-200 px-5 py-3">
    <div class="h-4 w-20 animate-pulse rounded bg-zinc-200"></div>
  </div>
  <div class="divide-y divide-zinc-100">
    <div class="flex items-center gap-3 px-5 py-3">
      <div class="h-5 w-5 animate-pulse rounded-full bg-zinc-200 shrink-0"></div>
      <div class="flex-1 space-y-1.5">
        <div class="h-4 w-28 animate-pulse rounded bg-zinc-100"></div>
        <div class="h-3 w-20 animate-pulse rounded bg-zinc-50"></div>
      </div>
      <div class="h-5 w-8 animate-pulse rounded bg-zinc-100"></div>
    </div>
    <div class="flex items-center gap-3 px-5 py-3">
      <div class="h-5 w-5 animate-pulse rounded-full bg-zinc-200 shrink-0"></div>
      <div class="flex-1 space-y-1.5">
        <div class="h-4 w-24 animate-pulse rounded bg-zinc-100"></div>
        <div class="h-3 w-32 animate-pulse rounded bg-zinc-50"></div>
      </div>
      <div class="h-5 w-8 animate-pulse rounded bg-zinc-100"></div>
    </div>
  </div>
</div>
```

## 空态

```html
<div class="rounded-xl border border-zinc-200 bg-white">
  <div class="border-b border-zinc-200 px-5 py-3">
    <h3 class="text-sm font-semibold text-zinc-900">任务队列</h3>
  </div>
  <div class="flex flex-col items-center justify-center py-12">
    <svg class="h-10 w-10 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859" />
    </svg>
    <p class="mt-3 text-sm font-medium text-zinc-500">暂无任务</p>
    <p class="mt-1 text-xs text-zinc-400">向 Agent 提交任务后，队列将在此展示</p>
  </div>
</div>
```

## 错误态

```html
<div class="rounded-xl border border-zinc-200 bg-white">
  <div class="border-b border-zinc-200 px-5 py-3">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold text-zinc-900">任务队列</h3>
      <span class="text-xs text-red-500">1 个任务失败</span>
    </div>
  </div>
  <div class="divide-y divide-zinc-100">
    <div class="flex items-start gap-3 px-5 py-3 bg-red-50/50 border-l-2 border-red-400">
      <div class="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 shrink-0 mt-0.5">
        <svg class="h-3 w-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-red-700">同步外部数据</p>
        <p class="mt-0.5 text-xs text-red-400">连接超时 · API 返回 504</p>
        <div class="mt-2 flex gap-2">
          <button class="rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white
                         hover:bg-red-700 transition-colors duration-150">重试</button>
          <button class="rounded-md border border-red-200 px-2.5 py-1 text-xs text-red-600
                         hover:bg-red-50 transition-colors duration-150">查看日志</button>
        </div>
      </div>
    </div>
    <div class="flex items-center gap-3 px-5 py-3">
      <div class="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 shrink-0">
        <div class="h-1.5 w-1.5 rounded-full bg-zinc-400"></div>
      </div>
      <div class="flex-1">
        <p class="text-sm font-medium text-zinc-500">生成月度报告</p>
        <p class="mt-0.5 text-xs text-zinc-400">排队中 · 等待前序任务完成</p>
      </div>
    </div>
  </div>
</div>
```
