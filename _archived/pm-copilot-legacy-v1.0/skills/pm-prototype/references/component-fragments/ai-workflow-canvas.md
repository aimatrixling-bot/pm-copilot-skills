# AI 工作流画布

> **场景**: 节点式工作流编辑器，画布区 + 属性面板 + 小地图，用于可视化编排 AI 工作流
> **对应规则**: AG-08（工作流编辑器六要素）
> **交叉引用**: agent-ui-rules.md, de-ai-checklist.md

## 可配置参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| show_minimap | true | 是否显示小地图（>5 节点时） |
| show_debug | false | 是否开启调试模式（逐步执行高亮） |
| node_types | ["trigger","process","condition","output"] | 可用节点类型 |
| snap_to_grid | true | 是否启用网格对齐 |

## 默认态

```html
<div class="flex h-full bg-zinc-50">
  <!-- 左侧节点列表 -->
  <div class="w-52 border-r border-zinc-200 bg-white p-3 space-y-3 overflow-y-auto">
    <p class="text-xs font-semibold text-zinc-500 uppercase tracking-wider">节点</p>
    <div class="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2
                cursor-grab hover:border-violet-300 hover:bg-violet-50/50
                transition-colors duration-150">
      <div class="h-3 w-3 rounded-full bg-emerald-400"></div>
      <span class="text-sm text-zinc-700">触发器</span>
    </div>
    <div class="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2
                cursor-grab hover:border-violet-300 hover:bg-violet-50/50
                transition-colors duration-150">
      <div class="h-3 w-3 rounded-full bg-sky-400"></div>
      <span class="text-sm text-zinc-700">数据处理</span>
    </div>
    <div class="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2
                cursor-grab hover:border-violet-300 hover:bg-violet-50/50
                transition-colors duration-150">
      <div class="h-3 w-3 rounded-sm bg-amber-400"></div>
      <span class="text-sm text-zinc-700">条件判断</span>
    </div>
    <div class="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2
                cursor-grab hover:border-violet-300 hover:bg-violet-50/50
                transition-colors duration-150">
      <div class="h-3 w-3 rounded-full bg-violet-400"></div>
      <span class="text-sm text-zinc-700">AI 模型</span>
    </div>
    <div class="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2
                cursor-grab hover:border-violet-300 hover:bg-violet-50/50
                transition-colors duration-150">
      <div class="h-3 w-3 rounded-full bg-rose-400"></div>
      <span class="text-sm text-zinc-700">输出</span>
    </div>
  </div>

  <!-- 中间画布区 -->
  <div class="relative flex-1 overflow-hidden">
    <div class="h-full w-full bg-[linear-gradient(to_right,#f4f4f5_1px,transparent_1px),linear-gradient(to_bottom,#f4f4f5_1px,transparent_1px)] bg-[size:20px_20px]">
      <!-- 画布上的节点（选中态） -->
      <div class="absolute left-32 top-16 w-44 rounded-lg border-2 border-violet-400
                  bg-white shadow-md shadow-violet-100/50">
        <div class="flex items-center gap-2 border-b border-zinc-100 px-3 py-2">
          <div class="h-2.5 w-2.5 rounded-full bg-sky-400"></div>
          <span class="text-xs font-semibold text-zinc-800">数据清洗</span>
        </div>
        <div class="px-3 py-2">
          <p class="text-xs text-zinc-500">去除重复 + 格式标准化</p>
        </div>
        <div class="absolute -left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2
                    border-sky-400 bg-white"></div>
        <div class="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2
                    border-sky-400 bg-white"></div>
      </div>
    </div>
    <!-- 小地图 AG-08 -->
    <div class="absolute bottom-3 right-3 h-24 w-36 rounded-lg border border-zinc-200
                bg-white/90 shadow-sm backdrop-blur-sm">
      <div class="h-full w-full p-2">
        <div class="h-full w-full rounded border border-zinc-200 bg-zinc-50 relative">
          <div class="absolute left-[20%] top-[25%] h-1.5 w-3 rounded-sm bg-sky-300"></div>
          <div class="absolute left-[45%] top-[50%] h-1.5 w-4 rounded-sm bg-violet-300"></div>
          <div class="absolute left-[60%] top-[30%] h-1.5 w-3 rounded-sm bg-rose-300"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- 右侧属性面板 AG-08 -->
  <div class="w-64 border-l border-zinc-200 bg-white overflow-y-auto">
    <div class="border-b border-zinc-200 px-4 py-3">
      <div class="flex items-center gap-2">
        <div class="h-3 w-3 rounded-full bg-sky-400"></div>
        <span class="text-sm font-semibold text-zinc-900">数据清洗</span>
      </div>
    </div>
    <div class="space-y-4 p-4">
      <div class="space-y-1.5">
        <label class="text-xs font-medium text-zinc-600">输入源</label>
        <select class="w-full rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-sm
                       text-zinc-900 focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20
                       focus:outline-none">
          <option>客户名单.xlsx</option>
          <option>订单数据库</option>
        </select>
      </div>
      <div class="space-y-1.5">
        <label class="text-xs font-medium text-zinc-600">操作</label>
        <div class="space-y-1.5">
          <label class="flex items-center gap-2">
            <input type="checkbox" checked class="rounded border-zinc-300 text-violet-600 focus:ring-violet-500/20" />
            <span class="text-sm text-zinc-700">去除重复</span>
          </label>
          <label class="flex items-center gap-2">
            <input type="checkbox" checked class="rounded border-zinc-300 text-violet-600 focus:ring-violet-500/20" />
            <span class="text-sm text-zinc-700">格式标准化</span>
          </label>
          <label class="flex items-center gap-2">
            <input type="checkbox" class="rounded border-zinc-300 text-violet-600 focus:ring-violet-500/20" />
            <span class="text-sm text-zinc-700">空值填充</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</div>
```

## 加载态

```html
<div class="flex h-full bg-zinc-50">
  <div class="w-52 border-r border-zinc-200 bg-white p-3 space-y-3">
    <div class="h-3 w-10 animate-pulse rounded bg-zinc-200"></div>
    <div class="h-9 animate-pulse rounded-lg bg-zinc-100"></div>
    <div class="h-9 animate-pulse rounded-lg bg-zinc-100"></div>
    <div class="h-9 animate-pulse rounded-lg bg-zinc-100"></div>
  </div>
  <div class="flex-1 flex items-center justify-center">
    <div class="text-center">
      <div class="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-violet-500"></div>
      <p class="mt-3 text-sm text-zinc-500">加载工作流…</p>
    </div>
  </div>
  <div class="w-64 border-l border-zinc-200 bg-white p-4 space-y-4">
    <div class="h-5 w-20 animate-pulse rounded bg-zinc-200"></div>
    <div class="h-8 animate-pulse rounded-md bg-zinc-100"></div>
    <div class="h-8 animate-pulse rounded-md bg-zinc-100"></div>
  </div>
</div>
```

## 空态

```html
<div class="flex h-full bg-zinc-50">
  <div class="w-52 border-r border-zinc-200 bg-white p-3 space-y-3">
    <p class="text-xs font-semibold text-zinc-500 uppercase tracking-wider">节点</p>
    <div class="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 cursor-grab">
      <div class="h-3 w-3 rounded-full bg-emerald-400"></div>
      <span class="text-sm text-zinc-700">触发器</span>
    </div>
    <div class="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 cursor-grab">
      <div class="h-3 w-3 rounded-full bg-sky-400"></div>
      <span class="text-sm text-zinc-700">数据处理</span>
    </div>
  </div>
  <div class="flex flex-1 flex-col items-center justify-center">
    <svg class="h-12 w-12 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6Z" />
    </svg>
    <p class="mt-3 text-sm font-medium text-zinc-500">从左侧拖入节点开始编排</p>
    <p class="mt-1 text-xs text-zinc-400">或使用模板快速创建工作流</p>
    <button class="mt-4 rounded-lg border border-violet-200 bg-violet-50 px-4 py-2 text-sm
                   font-medium text-violet-600 hover:bg-violet-100 transition-colors duration-150">
      从模板创建
    </button>
  </div>
  <div class="w-64 border-l border-zinc-200 bg-white"></div>
</div>
```

## 错误态

```html
<div class="flex h-full bg-zinc-50">
  <div class="w-52 border-r border-zinc-200 bg-white p-3 space-y-3">
    <p class="text-xs font-semibold text-zinc-500 uppercase tracking-wider">节点</p>
    <div class="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 cursor-grab">
      <div class="h-3 w-3 rounded-full bg-sky-400"></div>
      <span class="text-sm text-zinc-700">数据处理</span>
    </div>
  </div>
  <div class="flex flex-1 flex-col">
    <div class="relative flex-1">
      <!-- 错误节点标红 -->
      <div class="absolute left-32 top-16 w-44 rounded-lg border-2 border-red-400
                  bg-white shadow-md shadow-red-100/50">
        <div class="flex items-center justify-between border-b border-red-100 px-3 py-2">
          <div class="flex items-center gap-2">
            <div class="h-2.5 w-2.5 rounded-full bg-red-400"></div>
            <span class="text-xs font-semibold text-red-700">API 调用</span>
          </div>
          <span class="text-xs text-red-400">超时</span>
        </div>
        <div class="px-3 py-2">
          <p class="text-xs text-red-500">连接外部服务失败</p>
          <button class="mt-1.5 text-xs font-medium text-red-600 hover:underline">重试此节点</button>
        </div>
      </div>
    </div>
    <div class="flex items-center justify-between border-t border-red-200 bg-red-50 px-4 py-2">
      <span class="text-sm text-red-600">工作流执行中断：节点「API 调用」连接超时</span>
      <div class="flex items-center gap-2">
        <button class="rounded-md border border-red-300 px-3 py-1 text-xs font-medium
                       text-red-600 hover:bg-red-100 transition-colors duration-150">跳过此节点</button>
        <button class="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white
                       hover:bg-red-700 transition-colors duration-150">重新执行</button>
      </div>
    </div>
  </div>
  <div class="w-64 border-l border-zinc-200 bg-white p-4">
    <div class="rounded-lg border border-red-200 bg-red-50 p-3">
      <p class="text-sm font-medium text-red-700">API 调用失败</p>
      <p class="mt-1 text-xs text-red-500">连接超时（30s）</p>
      <p class="mt-1 text-xs text-red-400">目标：https://api.example.com/data</p>
      <button class="mt-2 rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white
                     hover:bg-red-700">重试</button>
    </div>
  </div>
</div>
```
