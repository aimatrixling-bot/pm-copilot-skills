# AI 执行计划审阅面板

> **场景**: 复杂任务（>3 步）执行前的计划审阅，用户可编辑/删除步骤后确认
> **对应规则**: AG-03（Plan-then-Execute 分离）
> **交叉引用**: agent-ui-rules.md, de-ai-checklist.md

## 可配置参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| editable | true | 是否允许编辑/删除步骤 |
| show_impact | true | 是否展示每步影响范围 |
| show_estimate | true | 是否展示预估耗时 |
| require_confirm | true | 是否需要用户确认后执行 |

## 默认态

```html
<div class="rounded-xl border border-zinc-200 bg-white">
  <div class="border-b border-zinc-200 px-5 py-4">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-sm font-semibold text-zinc-900">执行计划</h3>
        <p class="mt-0.5 text-xs text-zinc-500">共 4 个步骤 · 预估耗时 12s</p>
      </div>
      <span class="inline-flex items-center rounded-full bg-violet-100 px-2 py-0.5
                   text-xs font-medium text-violet-700">确认模式</span>
    </div>
  </div>

  <!-- 步骤列表 -->
  <div class="divide-y divide-zinc-100">
    <div class="flex items-start gap-3 px-5 py-3.5">
      <span class="flex h-5 w-5 items-center justify-center rounded-full bg-sky-100
                   text-xs font-semibold text-sky-700 shrink-0">1</span>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-zinc-900">备份当前客户数据</p>
          <button class="text-zinc-400 hover:text-red-500 transition-colors duration-150"
                  aria-label="删除步骤">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="mt-1.5 flex flex-wrap gap-1.5">
          <span class="inline-flex items-center rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-500">客户名单.xlsx</span>
        </div>
      </div>
    </div>
    <div class="flex items-start gap-3 px-5 py-3.5">
      <span class="flex h-5 w-5 items-center justify-center rounded-full bg-sky-100
                   text-xs font-semibold text-sky-700 shrink-0">2</span>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-zinc-900">合并新增客户记录</p>
          <button class="text-zinc-400 hover:text-red-500 transition-colors duration-150"
                  aria-label="删除步骤">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="mt-1.5 flex flex-wrap gap-1.5">
          <span class="inline-flex items-center rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-500">新增.xlsx</span>
          <span class="inline-flex items-center rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-500">客户名单.xlsx</span>
        </div>
      </div>
    </div>
    <div class="flex items-start gap-3 px-5 py-3.5">
      <span class="flex h-5 w-5 items-center justify-center rounded-full bg-sky-100
                   text-xs font-semibold text-sky-700 shrink-0">3</span>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-zinc-900">执行去重逻辑</p>
          <button class="text-zinc-400 hover:text-red-500 transition-colors duration-150"
                  aria-label="删除步骤">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="mt-1.5 flex flex-wrap gap-1.5">
          <span class="inline-flex items-center rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-500">匹配规则：手机号+姓名</span>
        </div>
      </div>
    </div>
    <!-- 高风险步骤（影响范围警示 AG-04） -->
    <div class="flex items-start gap-3 px-5 py-3.5 bg-red-50/50 border-l-2 border-red-400">
      <span class="flex h-5 w-5 items-center justify-center rounded-full bg-red-100
                   text-xs font-semibold text-red-700 shrink-0">4</span>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <p class="text-sm font-medium text-red-700">删除重复记录</p>
            <span class="rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-600">不可逆</span>
          </div>
          <button class="text-zinc-400 hover:text-red-500 transition-colors duration-150"
                  aria-label="删除步骤">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="mt-1.5 flex flex-wrap gap-1.5">
          <span class="inline-flex items-center rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-600">将删除 23 条记录</span>
          <span class="inline-flex items-center rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-600">影响：客户名单.xlsx</span>
        </div>
      </div>
    </div>
  </div>

  <!-- 底部操作栏 -->
  <div class="flex items-center justify-between border-t border-zinc-200 px-5 py-3">
    <button class="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600
                   hover:bg-zinc-50 transition-colors duration-150">取消</button>
    <button class="rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white
                   hover:bg-sky-600 transition-colors duration-150">确认执行</button>
  </div>
</div>
```

## 加载态

```html
<div class="rounded-xl border border-zinc-200 bg-white">
  <div class="border-b border-zinc-200 px-5 py-4">
    <div class="h-4 w-24 animate-pulse rounded bg-zinc-200"></div>
    <div class="mt-1 h-3 w-40 animate-pulse rounded bg-zinc-100"></div>
  </div>
  <div class="divide-y divide-zinc-100">
    <div class="flex items-start gap-3 px-5 py-3.5">
      <div class="h-5 w-5 animate-pulse rounded-full bg-zinc-200 shrink-0"></div>
      <div class="flex-1 space-y-1.5">
        <div class="h-4 w-32 animate-pulse rounded bg-zinc-100"></div>
        <div class="h-5 w-20 animate-pulse rounded bg-zinc-50"></div>
      </div>
    </div>
    <div class="flex items-start gap-3 px-5 py-3.5">
      <div class="h-5 w-5 animate-pulse rounded-full bg-zinc-200 shrink-0"></div>
      <div class="flex-1 space-y-1.5">
        <div class="h-4 w-28 animate-pulse rounded bg-zinc-100"></div>
        <div class="flex gap-1.5">
          <div class="h-5 w-20 animate-pulse rounded bg-zinc-50"></div>
          <div class="h-5 w-16 animate-pulse rounded bg-zinc-50"></div>
        </div>
      </div>
    </div>
  </div>
  <div class="flex items-center justify-between border-t border-zinc-200 px-5 py-3">
    <div class="h-9 w-16 animate-pulse rounded-lg bg-zinc-100"></div>
    <div class="h-9 w-24 animate-pulse rounded-lg bg-zinc-100"></div>
  </div>
</div>
```

## 空态

```html
<div class="rounded-xl border border-zinc-200 bg-white">
  <div class="border-b border-zinc-200 px-5 py-4">
    <h3 class="text-sm font-semibold text-zinc-900">执行计划</h3>
  </div>
  <div class="flex flex-col items-center justify-center py-12">
    <svg class="h-10 w-10 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
    </svg>
    <p class="mt-3 text-sm font-medium text-zinc-500">暂无执行计划</p>
    <p class="mt-1 text-xs text-zinc-400">向 AI 提交任务后，执行计划将在此展示</p>
  </div>
</div>
```

## 错误态

```html
<div class="rounded-xl border border-zinc-200 bg-white">
  <div class="border-b border-zinc-200 px-5 py-4">
    <div class="flex items-center gap-2">
      <h3 class="text-sm font-semibold text-zinc-900">执行计划</h3>
      <span class="text-xs text-red-500">生成失败</span>
    </div>
  </div>
  <div class="flex flex-col items-center justify-center py-12">
    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
      <svg class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
      </svg>
    </div>
    <p class="mt-3 text-sm font-medium text-zinc-700">无法生成执行计划</p>
    <p class="mt-1 text-xs text-zinc-500">数据格式异常，无法解析操作步骤</p>
    <div class="mt-4 flex gap-2">
      <button class="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-600
                     hover:bg-zinc-50 transition-colors duration-150">更换数据源</button>
      <button class="rounded-lg bg-sky-500 px-3 py-1.5 text-sm font-medium text-white
                     hover:bg-sky-600 transition-colors duration-150">重新生成</button>
    </div>
  </div>
</div>
```
