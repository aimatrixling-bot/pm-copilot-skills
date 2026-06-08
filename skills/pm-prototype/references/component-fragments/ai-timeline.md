# AI 任务时间线

> **场景**: Agent 执行多步骤任务时的实时状态展示，让用户"看着 Agent 干活"
> **对应规则**: AG-02（过程透明——Agent 状态时间线）
> **交叉引用**: agent-ui-rules.md, de-ai-checklist.md

## 可配置参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| orientation | "vertical" | 时间线方向：vertical / horizontal |
| show_duration | true | 是否显示每步耗时 |
| animated | true | 当前步骤是否显示脉冲动画 |
| max_visible | 10 | 可见步骤数上限 |

## 默认态

```html
<div class="rounded-xl border border-zinc-200 bg-white p-4">
  <h3 class="text-sm font-semibold text-zinc-900 mb-4">执行进度</h3>
  <ol class="relative space-y-0">
    <!-- 已完成步骤 -->
    <li class="flex gap-3 pb-5">
      <div class="flex flex-col items-center">
        <div class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
          <svg class="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <div class="w-px flex-1 bg-emerald-200"></div>
      </div>
      <div class="pb-1">
        <p class="text-sm font-medium text-zinc-900">读取客户数据</p>
        <p class="text-xs text-zinc-400">客户名单.xlsx · 耗时 1.2s</p>
      </div>
    </li>
    <!-- 已完成步骤 2 -->
    <li class="flex gap-3 pb-5">
      <div class="flex flex-col items-center">
        <div class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
          <svg class="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <div class="w-px flex-1 bg-emerald-200"></div>
      </div>
      <div class="pb-1">
        <p class="text-sm font-medium text-zinc-900">数据清洗与去重</p>
        <p class="text-xs text-zinc-400">去除 23 条重复记录 · 耗时 2.8s</p>
      </div>
    </li>
    <!-- 当前步骤（脉冲动画） -->
    <li class="flex gap-3 pb-5">
      <div class="flex flex-col items-center">
        <div class="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500
                    animate-pulse shadow-md shadow-sky-500/30">
          <div class="h-2 w-2 rounded-full bg-white"></div>
        </div>
        <div class="w-px flex-1 bg-zinc-200"></div>
      </div>
      <div class="pb-1">
        <p class="text-sm font-medium text-sky-600">正在计算转化率…</p>
        <p class="text-xs text-zinc-400">按来源渠道分组统计</p>
      </div>
    </li>
    <!-- 待执行步骤 -->
    <li class="flex gap-3 pb-5">
      <div class="flex flex-col items-center">
        <div class="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100">
          <div class="h-2 w-2 rounded-full bg-zinc-300"></div>
        </div>
        <div class="w-px flex-1 bg-zinc-100"></div>
      </div>
      <div class="pb-1">
        <p class="text-sm font-medium text-zinc-400">生成可视化图表</p>
        <p class="text-xs text-zinc-300">预估耗时 3s</p>
      </div>
    </li>
    <li class="flex gap-3">
      <div class="flex flex-col items-center">
        <div class="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100">
          <div class="h-2 w-2 rounded-full bg-zinc-300"></div>
        </div>
      </div>
      <div>
        <p class="text-sm font-medium text-zinc-400">输出分析报告</p>
        <p class="text-xs text-zinc-300">预估耗时 1s</p>
      </div>
    </li>
  </ol>
</div>
```

## 加载态

```html
<div class="rounded-xl border border-zinc-200 bg-white p-4">
  <div class="h-4 w-20 animate-pulse rounded bg-zinc-200 mb-4"></div>
  <div class="space-y-5">
    <div class="flex gap-3">
      <div class="h-6 w-6 animate-pulse rounded-full bg-zinc-200"></div>
      <div class="space-y-1.5 flex-1">
        <div class="h-4 w-32 animate-pulse rounded bg-zinc-100"></div>
        <div class="h-3 w-48 animate-pulse rounded bg-zinc-50"></div>
      </div>
    </div>
    <div class="flex gap-3">
      <div class="h-6 w-6 animate-pulse rounded-full bg-zinc-200"></div>
      <div class="space-y-1.5 flex-1">
        <div class="h-4 w-28 animate-pulse rounded bg-zinc-100"></div>
        <div class="h-3 w-40 animate-pulse rounded bg-zinc-50"></div>
      </div>
    </div>
    <div class="flex gap-3">
      <div class="h-6 w-6 animate-pulse rounded-full bg-zinc-200"></div>
      <div class="space-y-1.5 flex-1">
        <div class="h-4 w-36 animate-pulse rounded bg-zinc-100"></div>
        <div class="h-3 w-44 animate-pulse rounded bg-zinc-50"></div>
      </div>
    </div>
  </div>
</div>
```

## 空态

```html
<div class="rounded-xl border border-zinc-200 bg-white p-4">
  <h3 class="text-sm font-semibold text-zinc-900 mb-4">执行进度</h3>
  <div class="flex flex-col items-center justify-center py-8">
    <svg class="h-10 w-10 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75Z
               M9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625Z
               M16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
    <p class="mt-2 text-sm text-zinc-500">暂无执行中的任务</p>
    <p class="text-xs text-zinc-400">发起一个任务后，执行进度将在此展示</p>
  </div>
</div>
```

## 错误态

```html
<div class="rounded-xl border border-zinc-200 bg-white p-4">
  <h3 class="text-sm font-semibold text-zinc-900 mb-4">执行进度</h3>
  <ol class="relative space-y-0">
    <li class="flex gap-3 pb-5">
      <div class="flex flex-col items-center">
        <div class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
          <svg class="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <div class="w-px flex-1 bg-emerald-200"></div>
      </div>
      <div class="pb-1">
        <p class="text-sm font-medium text-zinc-900">读取客户数据</p>
        <p class="text-xs text-zinc-400">耗时 1.2s</p>
      </div>
    </li>
    <!-- 失败步骤 -->
    <li class="flex gap-3">
      <div class="flex flex-col items-center">
        <div class="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
          <svg class="h-3.5 w-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </div>
      </div>
      <div>
        <p class="text-sm font-medium text-red-600">数据清洗失败</p>
        <p class="text-xs text-red-400">日期格式解析错误：第 147 行</p>
        <button class="mt-2 rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium
                       text-red-600 hover:bg-red-50 transition-colors duration-150">
          从此步骤恢复
        </button>
      </div>
    </li>
  </ol>
</div>
```
