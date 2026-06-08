# 通用表单 4 态模板

> **场景**: 任何表单字段的 4 种状态（默认/加载/空/错误），作为所有表单组件的基础模板
> **对应规则**: AP-43（4 态必定义）
> **交叉引用**: anti-patterns.md, de-ai-checklist.md

## 可配置参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| label | "姓名" | 字段标签文本 |
| placeholder | "请输入姓名" | 占位提示文字 |
| required | true | 是否必填 |
| error_msg | "请输入有效的姓名" | 错误提示文本 |
| empty_desc | "尚未填写" | 空态说明文字 |

## 默认态

```html
<div class="space-y-1.5">
  <label for="name" class="block text-sm font-medium text-zinc-700">
    姓名
    <span class="text-red-500 ml-0.5">*</span>
  </label>
  <input
    id="name"
    type="text"
    placeholder="请输入姓名"
    class="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm
           text-zinc-900 placeholder:text-zinc-400
           hover:border-zinc-400
           focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none
           transition-colors duration-150"
  />
  <p class="text-xs text-zinc-500">2-20 个字符，支持中英文</p>
</div>
```

## 加载态

```html
<div class="space-y-1.5" aria-busy="true">
  <div class="h-4 w-12 animate-pulse rounded bg-zinc-200"></div>
  <div class="h-9 w-full animate-pulse rounded-lg bg-zinc-100 border border-zinc-200"></div>
  <div class="h-3 w-32 animate-pulse rounded bg-zinc-100"></div>
</div>
```

## 空态

```html
<div class="space-y-1.5">
  <label class="block text-sm font-medium text-zinc-700">
    姓名
    <span class="text-red-500 ml-0.5">*</span>
  </label>
  <div class="flex flex-col items-center justify-center rounded-lg border border-dashed
              border-zinc-300 bg-zinc-50/50 py-6 text-center">
    <svg class="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z
               M4.501 20.118a7.5 7.5 0 0 1 14.998 0" />
    </svg>
    <p class="mt-2 text-sm text-zinc-500">尚未填写</p>
    <button class="mt-2 text-xs font-medium text-sky-600 hover:text-sky-700
                   transition-colors duration-150">
      点击填写
    </button>
  </div>
</div>
```

## 错误态

```html
<div class="space-y-1.5">
  <label for="name-error" class="block text-sm font-medium text-red-600">
    姓名
    <span class="ml-0.5">*</span>
  </label>
  <div class="relative">
    <input
      id="name-error"
      type="text"
      value="1"
      class="w-full rounded-lg border border-red-300 bg-red-50/50 px-3 py-2 pr-9
             text-sm text-zinc-900 placeholder:text-zinc-400
             focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none
             transition-colors duration-150"
      aria-invalid="true"
      aria-describedby="name-error-msg"
    />
    <svg class="absolute right-2.5 top-2.5 h-4 w-4 text-red-500 pointer-events-none"
         fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd"
            d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
            clip-rule="evenodd" />
    </svg>
  </div>
  <div class="flex items-center justify-between">
    <p id="name-error-msg" class="text-xs text-red-600" role="alert">
      请输入有效的姓名（2-20 个字符）
    </p>
    <button class="text-xs font-medium text-zinc-500 hover:text-zinc-700
                   transition-colors duration-150">
      重试
    </button>
  </div>
</div>
```
