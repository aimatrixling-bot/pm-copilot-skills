# AI 错误恢复面板

> **场景**: Agent 执行失败时，提供错误原因、修复建议和从失败点恢复的入口
> **对应规则**: AG-05（错误恢复而非错误重置）
> **交叉引用**: agent-ui-rules.md, de-ai-checklist.md

## 可配置参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| show_suggestions | true | 是否展示可操作的修复建议 |
| show_resume | true | 是否展示"从失败点恢复"入口 |
| show_log | true | 是否展示可展开的完整错误日志 |
| max_suggestions | 3 | 修复建议按钮最大数量 |

## 默认态

```html
<div class="rounded-xl border border-red-200 bg-white">
  <!-- 错误头部：人类语言描述 -->
  <div class="border-b border-red-100 px-5 py-4">
    <div class="flex items-start gap-3">
      <div class="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 shrink-0">
        <svg class="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
      </div>
      <div>
        <h3 class="text-sm font-semibold text-red-700">数据导入失败</h3>
        <p class="mt-0.5 text-sm text-zinc-600">
          文件第 147 行包含无法解析的日期格式「2024/13/32」，导致整行数据无法写入数据库。
        </p>
      </div>
    </div>
  </div>

  <!-- 修复建议 AG-05 -->
  <div class="px-5 py-4 space-y-2.5">
    <p class="text-xs font-semibold text-zinc-500 uppercase tracking-wider">修复建议</p>
    <div class="flex flex-wrap gap-2">
      <button class="inline-flex items-center gap-1.5 rounded-lg border border-sky-200
                     bg-sky-50 px-3 py-2 text-sm text-sky-700 hover:bg-sky-100
                     transition-colors duration-150">
        <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
        </svg>
        自动修正日期格式
      </button>
      <button class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200
                     bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50
                     transition-colors duration-150">
        跳过错误行继续导入
      </button>
      <button class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200
                     bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50
                     transition-colors duration-150">
        标记异常行手动处理
      </button>
    </div>
  </div>

  <!-- 从失败点恢复 AG-05 -->
  <div class="border-t border-zinc-100 px-5 py-3">
    <button class="flex items-center gap-2 text-sm font-medium text-violet-600
                   hover:text-violet-700 transition-colors duration-150">
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
      </svg>
      从第 147 行恢复导入
    </button>
    <p class="mt-1 text-xs text-zinc-400">前 146 行数据已成功写入，无需重新导入</p>
  </div>

  <!-- 完整错误日志（可展开） -->
  <div class="border-t border-zinc-100 px-5 py-3">
    <details>
      <summary class="cursor-pointer text-xs text-zinc-400 hover:text-zinc-500
                     transition-colors duration-150">查看完整错误日志</summary>
      <pre class="mt-2 rounded-lg bg-zinc-900 p-3 text-xs text-zinc-300 overflow-x-auto
                  font-mono leading-relaxed">Error: DateParseError at row 147
  at parseDate (importer.js:42)
  at processRow (importer.js:128)
  Input: "2024/13/32"
  Expected: YYYY/MM/DD or YYYY-MM-DD
  Context: customer_id=C-00847, name="李思琪"</pre>
    </details>
  </div>
</div>
```

## 加载态

```html
<div class="rounded-xl border border-zinc-200 bg-white">
  <div class="px-5 py-4">
    <div class="flex items-start gap-3">
      <div class="h-8 w-8 animate-pulse rounded-full bg-zinc-200 shrink-0"></div>
      <div class="flex-1 space-y-2">
        <div class="h-4 w-32 animate-pulse rounded bg-zinc-200"></div>
        <div class="h-3 w-full animate-pulse rounded bg-zinc-100"></div>
        <div class="h-3 w-3/4 animate-pulse rounded bg-zinc-100"></div>
      </div>
    </div>
  </div>
  <div class="px-5 py-4 space-y-2">
    <div class="h-3 w-16 animate-pulse rounded bg-zinc-200"></div>
    <div class="flex gap-2">
      <div class="h-9 w-32 animate-pulse rounded-lg bg-zinc-100"></div>
      <div class="h-9 w-36 animate-pulse rounded-lg bg-zinc-100"></div>
    </div>
  </div>
</div>
```

## 空态

```html
<div class="rounded-xl border border-zinc-200 bg-white">
  <div class="flex flex-col items-center justify-center py-12">
    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
      <svg class="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m4.5 12.75 6 6 9-13.5" />
      </svg>
    </div>
    <p class="mt-3 text-sm font-medium text-zinc-600">一切正常</p>
    <p class="mt-1 text-xs text-zinc-400">当前没有执行错误</p>
  </div>
</div>
```

## 错误态

```html
<!-- 错误态即默认态。此处展示"恢复也失败"的极端场景 -->
<div class="rounded-xl border-2 border-red-300 bg-red-50/50">
  <div class="px-5 py-4">
    <div class="flex items-start gap-3">
      <div class="flex h-8 w-8 items-center justify-center rounded-full bg-red-200 shrink-0">
        <svg class="h-4 w-4 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
      </div>
      <div>
        <h3 class="text-sm font-semibold text-red-800">恢复失败</h3>
        <p class="mt-0.5 text-sm text-red-700">
          自动修正日期格式后仍然失败。数据源文件可能存在多处格式异常，建议手动检查后重新导入。
        </p>
      </div>
    </div>
  </div>
  <div class="border-t border-red-200 px-5 py-3">
    <p class="text-xs font-semibold text-red-600 mb-2">建议操作</p>
    <div class="flex flex-wrap gap-2">
      <button class="rounded-lg bg-white border border-red-300 px-3 py-2 text-sm
                     text-red-700 hover:bg-red-50 transition-colors duration-150">
        下载异常行报告
      </button>
      <button class="rounded-lg bg-white border border-red-300 px-3 py-2 text-sm
                     text-red-700 hover:bg-red-50 transition-colors duration-150">
        回退到备份版本
      </button>
      <button class="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white
                     hover:bg-red-700 transition-colors duration-150">
        联系技术支持
      </button>
    </div>
  </div>
</div>
```
