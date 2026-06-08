# B2B Dashboard — B 端仪表盘

> **场景**: B 端 Web/PC，Sovereign 姿态，指标卡 + 图表 + 表格混排
> **密度**: 中-高（指标卡宽松，数据区紧凑）
> **对应规则**: AP-21（布局多样性）、AP-22（层级表面系统）、AP-41（tabular-nums）、P4（状态双编码）

## 可配置参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| metricCards | `4` | 指标卡数量（3-4 个） |
| charts | `2` | 图表区域数量 |
| tableRows | `5` | 表格预览行数 |
| timeRange | `本月` | 默认时间范围 |
| layout | `cards-top` | 布局模式：`cards-top` / `cards-left` |

## 默认态

```html
<div class="w-full space-y-6">
  <!-- 顶部：标题 + 时间筛选 -->
  <header class="flex items-center justify-between">
    <div>
      <h1 class="text-lg font-bold text-gray-900">销售概览</h1>
      <p class="text-xs text-gray-500">数据更新于 2026-06-08 09:00</p>
    </div>
    <div class="flex items-center gap-2 rounded-md border border-gray-200 bg-white p-0.5">
      <button class="rounded px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700">本周</button>
      <button class="rounded bg-sky-600 px-3 py-1.5 text-xs font-medium text-white">本月</button>
      <button class="rounded px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700">本季</button>
    </div>
  </header>

  <!-- 指标卡：4 列 -->
  <div class="grid grid-cols-4 gap-4">
    <div class="rounded-lg border border-gray-200 bg-white p-4">
      <p class="text-xs font-medium text-gray-500">总营收</p>
      <p class="mt-1 text-2xl font-bold tabular-nums text-gray-900">¥3,284<span class="text-sm font-normal text-gray-500">万</span></p>
      <p class="mt-1 text-xs tabular-nums text-emerald-600">↑ 12.5% <span class="text-gray-400">较上月</span></p>
    </div>
    <div class="rounded-lg border border-gray-200 bg-white p-4">
      <p class="text-xs font-medium text-gray-500">新增客户</p>
      <p class="mt-1 text-2xl font-bold tabular-nums text-gray-900">47</p>
      <p class="mt-1 text-xs tabular-nums text-emerald-600">↑ 8.2% <span class="text-gray-400">较上月</span></p>
    </div>
    <div class="rounded-lg border border-gray-200 bg-white p-4">
      <p class="text-xs font-medium text-gray-500">成交转化率</p>
      <p class="mt-1 text-2xl font-bold tabular-nums text-gray-900">32.4<span class="text-sm font-normal text-gray-500">%</span></p>
      <p class="mt-1 text-xs tabular-nums text-red-600">↓ 3.1% <span class="text-gray-400">较上月</span></p>
    </div>
    <div class="rounded-lg border border-gray-200 bg-white p-4">
      <p class="text-xs font-medium text-gray-500">平均回款周期</p>
      <p class="mt-1 text-2xl font-bold tabular-nums text-gray-900">28<span class="text-sm font-normal text-gray-500">天</span></p>
      <p class="mt-1 text-xs tabular-nums text-emerald-600">↓ 5 天 <span class="text-gray-400">较上月</span></p>
    </div>
  </div>

  <!-- 图表区：2 列 -->
  <div class="grid grid-cols-3 gap-4">
    <!-- 趋势图（占 2 列） -->
    <div class="col-span-2 rounded-lg border border-gray-200 bg-white p-4">
      <div class="mb-3 flex items-center justify-between">
        <h2 class="text-sm font-semibold text-gray-900">营收趋势</h2>
        <div class="flex items-center gap-3 text-xs text-gray-500">
          <span class="flex items-center gap-1"><span class="inline-block h-2 w-2 rounded-full bg-sky-500"></span>本年</span>
          <span class="flex items-center gap-1"><span class="inline-block h-2 w-2 rounded-full bg-gray-300"></span>去年</span>
        </div>
      </div>
      <div class="flex h-48 items-end gap-2">
        <div class="flex-1 rounded-t bg-gray-100" style="height:60%"></div>
        <div class="flex-1 rounded-t bg-gray-100" style="height:45%"></div>
        <div class="flex-1 rounded-t bg-gray-100" style="height:75%"></div>
        <div class="flex-1 rounded-t bg-sky-200" style="height:50%"></div>
        <div class="flex-1 rounded-t bg-sky-300" style="height:85%"></div>
        <div class="flex-1 rounded-t bg-sky-400" style="height:70%"></div>
        <div class="flex-1 rounded-t bg-sky-500" style="height:90%"></div>
        <div class="flex-1 rounded-t bg-sky-600" style="height:100%"></div>
      </div>
      <div class="mt-1 flex justify-between text-xs text-gray-400">
        <span>1月</span><span>2月</span><span>3月</span><span>4月</span><span>5月</span><span>6月</span><span>7月</span><span>8月</span>
      </div>
    </div>

    <!-- 阶段分布（占 1 列） -->
    <div class="rounded-lg border border-gray-200 bg-white p-4">
      <h2 class="mb-3 text-sm font-semibold text-gray-900">阶段分布</h2>
      <div class="space-y-3">
        <div>
          <div class="mb-1 flex justify-between text-xs"><span class="text-gray-600">方案演示</span><span class="tabular-nums font-medium text-gray-900">28</span></div>
          <div class="h-2 rounded-full bg-gray-100"><div class="h-2 rounded-full bg-sky-500" style="width:45%"></div></div>
        </div>
        <div>
          <div class="mb-1 flex justify-between text-xs"><span class="text-gray-600">需求确认</span><span class="tabular-nums font-medium text-gray-900">19</span></div>
          <div class="h-2 rounded-full bg-gray-100"><div class="h-2 rounded-full bg-sky-400" style="width:30%"></div></div>
        </div>
        <div>
          <div class="mb-1 flex justify-between text-xs"><span class="text-gray-600">商务谈判</span><span class="tabular-nums font-medium text-gray-900">12</span></div>
          <div class="h-2 rounded-full bg-gray-100"><div class="h-2 rounded-full bg-sky-300" style="width:19%"></div></div>
        </div>
        <div>
          <div class="mb-1 flex justify-between text-xs"><span class="text-gray-600">合同签署</span><span class="tabular-nums font-medium text-gray-900">4</span></div>
          <div class="h-2 rounded-full bg-gray-100"><div class="h-2 rounded-full bg-sky-200" style="width:6%"></div></div>
        </div>
      </div>
    </div>
  </div>

  <!-- 数据表格：最近交易 -->
  <section class="rounded-lg border border-gray-200 bg-white">
    <div class="flex items-center justify-between border-b border-gray-100 px-4 py-3">
      <h2 class="text-sm font-semibold text-gray-900">最近成交</h2>
      <button class="text-xs text-sky-600 hover:text-sky-700">查看全部 →</button>
    </div>
    <table class="w-full text-left text-sm">
      <thead class="border-b border-gray-100 bg-gray-50/50">
        <tr class="text-xs font-semibold text-gray-500">
          <th class="px-4 py-2">客户名称</th>
          <th class="px-4 py-2">负责人</th>
          <th class="px-4 py-2 text-right tabular-nums">金额(万)</th>
          <th class="px-4 py-2">成交日期</th>
          <th class="px-4 py-2">状态</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-50">
        <tr class="hover:bg-gray-50">
          <td class="px-4 py-2.5 font-medium text-gray-900">瀚海物流集团</td>
          <td class="px-4 py-2.5 text-gray-600">王建国</td>
          <td class="px-4 py-2.5 text-right tabular-nums">215.00</td>
          <td class="px-4 py-2.5 tabular-nums text-gray-500">2026-06-04</td>
          <td class="px-4 py-2.5"><span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">✓ 已回款</span></td>
        </tr>
        <tr class="hover:bg-gray-50">
          <td class="px-4 py-2.5 font-medium text-gray-900">鼎新药业</td>
          <td class="px-4 py-2.5 text-gray-600">张明远</td>
          <td class="px-4 py-2.5 text-right tabular-nums">178.50</td>
          <td class="px-4 py-2.5 tabular-nums text-gray-500">2026-05-28</td>
          <td class="px-4 py-2.5"><span class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">● 待回款</span></td>
        </tr>
        <tr class="hover:bg-gray-50">
          <td class="px-4 py-2.5 font-medium text-gray-900">华清智控</td>
          <td class="px-4 py-2.5 text-gray-600">李思琪</td>
          <td class="px-4 py-2.5 text-right tabular-nums">96.00</td>
          <td class="px-4 py-2.5 tabular-nums text-gray-500">2026-05-20</td>
          <td class="px-4 py-2.5"><span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">✓ 已回款</span></td>
        </tr>
      </tbody>
    </table>
  </section>
</div>
```

## 加载态

```html
<div class="w-full space-y-6">
  <header class="flex items-center justify-between">
    <div>
      <div class="h-5 w-24 animate-pulse rounded bg-gray-200"></div>
      <div class="mt-1 h-3 w-40 animate-pulse rounded bg-gray-100"></div>
    </div>
    <div class="h-8 w-56 animate-pulse rounded-md bg-gray-200"></div>
  </header>
  <div class="grid grid-cols-4 gap-4">
    <div class="rounded-lg border border-gray-200 bg-white p-4">
      <div class="h-3 w-12 animate-pulse rounded bg-gray-200"></div>
      <div class="mt-2 h-7 w-28 animate-pulse rounded bg-gray-100"></div>
      <div class="mt-1 h-3 w-20 animate-pulse rounded bg-gray-100"></div>
    </div>
    <div class="rounded-lg border border-gray-200 bg-white p-4">
      <div class="h-3 w-14 animate-pulse rounded bg-gray-200"></div>
      <div class="mt-2 h-7 w-16 animate-pulse rounded bg-gray-100"></div>
      <div class="mt-1 h-3 w-20 animate-pulse rounded bg-gray-100"></div>
    </div>
    <div class="rounded-lg border border-gray-200 bg-white p-4">
      <div class="h-3 w-16 animate-pulse rounded bg-gray-200"></div>
      <div class="mt-2 h-7 w-20 animate-pulse rounded bg-gray-100"></div>
      <div class="mt-1 h-3 w-20 animate-pulse rounded bg-gray-100"></div>
    </div>
    <div class="rounded-lg border border-gray-200 bg-white p-4">
      <div class="h-3 w-18 animate-pulse rounded bg-gray-200"></div>
      <div class="mt-2 h-7 w-20 animate-pulse rounded bg-gray-100"></div>
      <div class="mt-1 h-3 w-20 animate-pulse rounded bg-gray-100"></div>
    </div>
  </div>
  <div class="grid grid-cols-3 gap-4">
    <div class="col-span-2 h-64 animate-pulse rounded-lg border border-gray-200 bg-white"></div>
    <div class="h-64 animate-pulse rounded-lg border border-gray-200 bg-white"></div>
  </div>
</div>
```

## 空态

```html
<div class="w-full space-y-6">
  <header class="flex items-center justify-between">
    <h1 class="text-lg font-bold text-gray-900">销售概览</h1>
  </header>
  <div class="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50/50 py-20">
    <svg class="mb-3 h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
    <p class="mb-1 text-sm font-medium text-gray-700">暂无数据</p>
    <p class="mb-4 text-xs text-gray-500">当前时间范围内没有销售数据</p>
    <button class="h-8 rounded-md border border-gray-300 px-4 text-xs font-medium text-gray-700 hover:bg-gray-50">切换时间范围</button>
  </div>
</div>
```

## 错误态

```html
<div class="w-full space-y-6">
  <header class="flex items-center justify-between">
    <h1 class="text-lg font-bold text-gray-900">销售概览</h1>
  </header>
  <div class="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50/30 py-20">
    <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
      <svg class="h-7 w-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    </div>
    <p class="mb-1 text-sm font-medium text-red-900">数据加载失败</p>
    <p class="mb-4 text-xs text-red-600">仪表盘数据获取异常（错误码：E503）</p>
    <div class="flex gap-2">
      <button class="h-8 rounded-md bg-red-600 px-4 text-xs font-medium text-white hover:bg-red-700">重新加载</button>
      <button class="h-8 rounded-md border border-red-300 px-4 text-xs font-medium text-red-700 hover:bg-red-50">联系管理员</button>
    </div>
  </div>
</div>
```
