# B2B Table — B 端数据表格

> **场景**: B 端 Web/PC，Sovereign 姿态，高密度数据展示与操作
> **密度**: 高（行高 36-40px，字号 12-14px）
> **对应规则**: SC-02（高密度）、AP-23（表格横向滚动）、AP-41（tabular-nums）、AP-43（4 态）、P4（状态双编码）

## 可配置参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| columns | `[]` | 列定义数组 `{ key, label, width?, sortable?, align? }` |
| rowHeight | `40` | 行高 px，高密度 36-40 |
| pageSize | `20` | 每页条数 |
| selectable | `true` | 是否支持行选中 |
| sortable | `true` | 是否支持列排序 |
| striped | `true` | 斑马纹 |
| stickyHeader | `true` | 表头固定 |

## 默认态

```html
<div class="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white">
  <!-- 筛选栏 -->
  <div class="flex items-center justify-between border-b border-gray-100 px-4 py-3">
    <div class="flex items-center gap-3">
      <input type="text" placeholder="搜索客户名称..." class="h-8 w-56 rounded-md border border-gray-300 px-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" />
      <select class="h-8 rounded-md border border-gray-300 px-3 text-sm text-gray-600">
        <option>全部状态</option>
        <option>进行中</option>
        <option>已完成</option>
        <option>已取消</option>
      </select>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-xs text-gray-400">已选 2 项</span>
      <button class="h-7 rounded px-3 text-xs font-medium text-gray-600 hover:bg-gray-100">批量导出</button>
      <button class="h-7 rounded bg-sky-600 px-3 text-xs font-medium text-white hover:bg-sky-700">+ 新建</button>
    </div>
  </div>

  <!-- 表格 -->
  <table class="w-full text-left text-sm">
    <thead class="border-b border-gray-200 bg-gray-50/80">
      <tr class="text-xs font-semibold text-gray-500">
        <th class="w-10 px-4 py-2.5"><input type="checkbox" class="h-3.5 w-3.5 rounded border-gray-300" /></th>
        <th class="cursor-pointer px-4 py-2.5 font-semibold hover:text-gray-700">客户名称 ↕</th>
        <th class="px-4 py-2.5 font-semibold">负责人</th>
        <th class="cursor-pointer px-4 py-2.5 font-semibold text-right tabular-nums hover:text-gray-700">金额(万) ↕</th>
        <th class="px-4 py-2.5 font-semibold">阶段</th>
        <th class="px-4 py-2.5 font-semibold">状态</th>
        <th class="px-4 py-2.5 font-semibold">更新日期</th>
        <th class="w-12 px-4 py-2.5"></th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-100">
      <tr class="bg-sky-50/40 hover:bg-gray-50">
        <td class="px-4 py-2.5"><input type="checkbox" checked class="h-3.5 w-3.5 rounded border-gray-300" /></td>
        <td class="px-4 py-2.5 font-medium text-gray-900">瑞华会计师事务所</td>
        <td class="px-4 py-2.5 text-gray-600">张明远</td>
        <td class="px-4 py-2.5 text-right tabular-nums text-gray-900">128.50</td>
        <td class="px-4 py-2.5"><span class="text-xs text-gray-600">方案演示</span></td>
        <td class="px-4 py-2.5"><span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">● 进行中</span></td>
        <td class="px-4 py-2.5 tabular-nums text-gray-500">2026-06-07</td>
        <td class="px-4 py-2.5"><button class="text-gray-400 hover:text-gray-600">⋯</button></td>
      </tr>
      <tr class="bg-sky-50/40 hover:bg-gray-50">
        <td class="px-4 py-2.5"><input type="checkbox" checked class="h-3.5 w-3.5 rounded border-gray-300" /></td>
        <td class="px-4 py-2.5 font-medium text-gray-900">明德医疗器械</td>
        <td class="px-4 py-2.5 text-gray-600">李思琪</td>
        <td class="px-4 py-2.5 text-right tabular-nums text-gray-900">86.20</td>
        <td class="px-4 py-2.5"><span class="text-xs text-gray-600">需求确认</span></td>
        <td class="px-4 py-2.5"><span class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">● 待审批</span></td>
        <td class="px-4 py-2.5 tabular-nums text-gray-500">2026-06-05</td>
        <td class="px-4 py-2.5"><button class="text-gray-400 hover:text-gray-600">⋯</button></td>
      </tr>
      <tr class="hover:bg-gray-50">
        <td class="px-4 py-2.5"><input type="checkbox" class="h-3.5 w-3.5 rounded border-gray-300" /></td>
        <td class="px-4 py-2.5 font-medium text-gray-900">瀚海物流集团</td>
        <td class="px-4 py-2.5 text-gray-600">王建国</td>
        <td class="px-4 py-2.5 text-right tabular-nums text-gray-900">215.00</td>
        <td class="px-4 py-2.5"><span class="text-xs text-gray-600">合同签署</span></td>
        <td class="px-4 py-2.5"><span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">● 进行中</span></td>
        <td class="px-4 py-2.5 tabular-nums text-gray-500">2026-06-04</td>
        <td class="px-4 py-2.5"><button class="text-gray-400 hover:text-gray-600">⋯</button></td>
      </tr>
      <tr class="hover:bg-gray-50">
        <td class="px-4 py-2.5"><input type="checkbox" class="h-3.5 w-3.5 rounded border-gray-300" /></td>
        <td class="px-4 py-2.5 font-medium text-gray-900">启航教育科技</td>
        <td class="px-4 py-2.5 text-gray-600">陈雨涵</td>
        <td class="px-4 py-2.5 text-right tabular-nums text-gray-900">42.80</td>
        <td class="px-4 py-2.5"><span class="text-xs text-gray-600">初步接触</span></td>
        <td class="px-4 py-2.5"><span class="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">● 已取消</span></td>
        <td class="px-4 py-2.5 tabular-nums text-gray-500">2026-06-01</td>
        <td class="px-4 py-2.5"><button class="text-gray-400 hover:text-gray-600">⋯</button></td>
      </tr>
    </tbody>
  </table>

  <!-- 分页 -->
  <div class="flex items-center justify-between border-t border-gray-100 px-4 py-3">
    <span class="text-xs text-gray-500">共 156 条，第 1/8 页</span>
    <div class="flex items-center gap-1">
      <button class="h-7 w-7 rounded text-xs text-gray-400 hover:bg-gray-100" disabled>‹</button>
      <button class="h-7 w-7 rounded bg-sky-600 text-xs text-white">1</button>
      <button class="h-7 w-7 rounded text-xs text-gray-600 hover:bg-gray-100">2</button>
      <button class="h-7 w-7 rounded text-xs text-gray-600 hover:bg-gray-100">3</button>
      <span class="px-1 text-xs text-gray-400">...</span>
      <button class="h-7 w-7 rounded text-xs text-gray-600 hover:bg-gray-100">8</button>
      <button class="h-7 w-7 rounded text-xs text-gray-600 hover:bg-gray-100">›</button>
    </div>
  </div>
</div>
```

## 加载态

```html
<div class="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white">
  <div class="border-b border-gray-100 px-4 py-3">
    <div class="flex items-center gap-3">
      <div class="h-8 w-56 animate-pulse rounded-md bg-gray-200"></div>
      <div class="h-8 w-32 animate-pulse rounded-md bg-gray-200"></div>
    </div>
  </div>
  <table class="w-full text-left text-sm">
    <thead class="border-b border-gray-200 bg-gray-50/80">
      <tr class="text-xs font-semibold text-gray-500">
        <th class="w-10 px-4 py-2.5"><div class="h-3.5 w-3.5 animate-pulse rounded bg-gray-200"></div></th>
        <th class="px-4 py-2.5">客户名称</th>
        <th class="px-4 py-2.5">负责人</th>
        <th class="px-4 py-2.5 text-right">金额(万)</th>
        <th class="px-4 py-2.5">阶段</th>
        <th class="px-4 py-2.5">状态</th>
        <th class="px-4 py-2.5">更新日期</th>
        <th class="w-12 px-4 py-2.5"></th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-100">
      <tr class="h-10">
        <td class="px-4 py-2.5"><div class="h-3.5 w-3.5 animate-pulse rounded bg-gray-200"></div></td>
        <td class="px-4 py-2.5"><div class="h-4 w-32 animate-pulse rounded bg-gray-100"></div></td>
        <td class="px-4 py-2.5"><div class="h-4 w-16 animate-pulse rounded bg-gray-100"></div></td>
        <td class="px-4 py-2.5"><div class="ml-auto h-4 w-14 animate-pulse rounded bg-gray-100"></div></td>
        <td class="px-4 py-2.5"><div class="h-4 w-16 animate-pulse rounded bg-gray-100"></div></td>
        <td class="px-4 py-2.5"><div class="h-5 w-14 animate-pulse rounded-full bg-gray-100"></div></td>
        <td class="px-4 py-2.5"><div class="h-4 w-20 animate-pulse rounded bg-gray-100"></div></td>
        <td class="px-4 py-2.5"></td>
      </tr>
      <tr class="h-10">
        <td class="px-4 py-2.5"><div class="h-3.5 w-3.5 animate-pulse rounded bg-gray-200"></div></td>
        <td class="px-4 py-2.5"><div class="h-4 w-28 animate-pulse rounded bg-gray-100"></div></td>
        <td class="px-4 py-2.5"><div class="h-4 w-14 animate-pulse rounded bg-gray-100"></div></td>
        <td class="px-4 py-2.5"><div class="ml-auto h-4 w-12 animate-pulse rounded bg-gray-100"></div></td>
        <td class="px-4 py-2.5"><div class="h-4 w-20 animate-pulse rounded bg-gray-100"></div></td>
        <td class="px-4 py-2.5"><div class="h-5 w-16 animate-pulse rounded-full bg-gray-100"></div></td>
        <td class="px-4 py-2.5"><div class="h-4 w-20 animate-pulse rounded bg-gray-100"></div></td>
        <td class="px-4 py-2.5"></td>
      </tr>
      <tr class="h-10">
        <td class="px-4 py-2.5"><div class="h-3.5 w-3.5 animate-pulse rounded bg-gray-200"></div></td>
        <td class="px-4 py-2.5"><div class="h-4 w-36 animate-pulse rounded bg-gray-100"></div></td>
        <td class="px-4 py-2.5"><div class="h-4 w-16 animate-pulse rounded bg-gray-100"></div></td>
        <td class="px-4 py-2.5"><div class="ml-auto h-4 w-16 animate-pulse rounded bg-gray-100"></div></td>
        <td class="px-4 py-2.5"><div class="h-4 w-14 animate-pulse rounded bg-gray-100"></div></td>
        <td class="px-4 py-2.5"><div class="h-5 w-14 animate-pulse rounded-full bg-gray-100"></div></td>
        <td class="px-4 py-2.5"><div class="h-4 w-20 animate-pulse rounded bg-gray-100"></div></td>
        <td class="px-4 py-2.5"></td>
      </tr>
    </tbody>
  </table>
  <div class="border-t border-gray-100 px-4 py-3">
    <div class="flex items-center justify-between">
      <div class="h-3 w-28 animate-pulse rounded bg-gray-200"></div>
      <div class="flex gap-1">
        <div class="h-7 w-7 animate-pulse rounded bg-gray-200"></div>
        <div class="h-7 w-7 animate-pulse rounded bg-gray-200"></div>
        <div class="h-7 w-7 animate-pulse rounded bg-gray-200"></div>
      </div>
    </div>
  </div>
</div>
```

## 空态

```html
<div class="w-full rounded-lg border border-gray-200 bg-white">
  <div class="flex flex-col items-center justify-center px-4 py-16">
    <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
      <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    </div>
    <p class="mb-1 text-sm font-medium text-gray-900">暂无数据</p>
    <p class="mb-4 text-xs text-gray-500">当前筛选条件下没有匹配的客户记录</p>
    <div class="flex gap-2">
      <button class="h-8 rounded-md border border-gray-300 px-4 text-xs font-medium text-gray-700 hover:bg-gray-50">清除筛选</button>
      <button class="h-8 rounded-md bg-sky-600 px-4 text-xs font-medium text-white hover:bg-sky-700">+ 新建客户</button>
    </div>
  </div>
</div>
```

## 错误态

```html
<div class="w-full rounded-lg border border-red-200 bg-white">
  <div class="flex flex-col items-center justify-center px-4 py-16">
    <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
      <svg class="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    </div>
    <p class="mb-1 text-sm font-medium text-red-900">数据加载失败</p>
    <p class="mb-4 text-xs text-red-600">网络请求超时，请检查网络连接后重试</p>
    <button class="h-8 rounded-md border border-red-300 bg-white px-4 text-xs font-medium text-red-700 hover:bg-red-50">重新加载</button>
  </div>
</div>
```
