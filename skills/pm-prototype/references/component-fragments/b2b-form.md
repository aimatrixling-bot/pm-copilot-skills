# B2B Form — B 端表单

> **场景**: B 端 Web/PC，Sovereign 姿态，多列布局 + Tab 分组 + 行内编辑
> **密度**: 高（间距 gap-2~4，紧凑布局）
> **对应规则**: SC-04（必填性判断）、AP-42（语义化 HTML）、AP-31（B 端紧凑间距）、P3（枚举优先）

## 可配置参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| layout | `2-col` | 列数：`1-col` / `2-col` / `3-col` / `4-col` |
| grouped | `true` | 是否按 Tab/Section 分组 |
| inlineEdit | `false` | 行内编辑模式（非弹窗） |
| batchActions | `false` | 批量操作栏 |
| fieldSize | `sm` | 字段尺寸 `sm`(h-8) / `md`(h-9) / `lg`(h-10) |

## 默认态

```html
<form class="w-full max-w-4xl rounded-lg border border-gray-200 bg-white">
  <!-- Tab 分组 -->
  <nav class="flex border-b border-gray-200 px-6">
    <button class="border-b-2 border-sky-600 px-4 py-3 text-sm font-medium text-sky-600">基本信息</button>
    <button class="px-4 py-3 text-sm text-gray-500 hover:text-gray-700">联系信息</button>
    <button class="px-4 py-3 text-sm text-gray-500 hover:text-gray-700">合同条款</button>
  </nav>

  <!-- 基本信息 Tab 内容 -->
  <div class="space-y-4 p-6">
    <!-- 第一行：2 列 -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="mb-1.5 flex items-center gap-1 text-xs font-medium text-gray-700">
          客户名称 <span class="text-red-500">*</span>
        </label>
        <input type="text" value="瑞华会计师事务所" class="h-8 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" />
      </div>
      <div>
        <label class="mb-1.5 flex items-center gap-1 text-xs font-medium text-gray-700">
          客户类型 <span class="text-red-500">*</span>
        </label>
        <select class="h-8 w-full rounded-md border border-gray-300 px-3 text-sm text-gray-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500">
          <option>企业客户</option>
          <option>政府机构</option>
          <option>个人客户</option>
        </select>
      </div>
    </div>

    <!-- 第二行：3 列 -->
    <div class="grid grid-cols-3 gap-4">
      <div>
        <label class="mb-1.5 text-xs font-medium text-gray-700">行业领域 <span class="text-red-500">*</span></label>
        <select class="h-8 w-full rounded-md border border-gray-300 px-3 text-sm text-gray-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500">
          <option>金融/会计</option>
          <option>医疗健康</option>
          <option>制造业</option>
          <option>教育</option>
        </select>
      </div>
      <div>
        <label class="mb-1.5 text-xs font-medium text-gray-700">预计金额(万)</label>
        <input type="number" value="128.50" class="h-8 w-full rounded-md border border-gray-300 px-3 text-sm tabular-nums focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" />
      </div>
      <div>
        <label class="mb-1.5 text-xs font-medium text-gray-700">销售阶段 <span class="text-red-500">*</span></label>
        <select class="h-8 w-full rounded-md border border-gray-300 px-3 text-sm text-gray-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500">
          <option>初步接触</option>
          <option>需求确认</option>
          <option selected>方案演示</option>
          <option>商务谈判</option>
          <option>合同签署</option>
        </select>
      </div>
    </div>

    <!-- 第三行：负责人 + 日期 -->
    <div class="grid grid-cols-3 gap-4">
      <div>
        <label class="mb-1.5 text-xs font-medium text-gray-700">负责人 <span class="text-red-500">*</span></label>
        <select class="h-8 w-full rounded-md border border-gray-300 px-3 text-sm text-gray-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500">
          <option selected>张明远</option>
          <option>李思琪</option>
          <option>王建国</option>
        </select>
      </div>
      <div>
        <label class="mb-1.5 text-xs font-medium text-gray-700">预计成交日期</label>
        <input type="date" value="2026-07-15" class="h-8 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" />
      </div>
      <div>
        <label class="mb-1.5 text-xs font-medium text-gray-700">成交概率</label>
        <div class="flex h-8 items-center gap-2">
          <input type="range" min="0" max="100" value="60" class="h-1.5 flex-1 appearance-none rounded-full bg-gray-200 accent-sky-600" />
          <span class="w-8 text-right text-xs tabular-nums text-gray-600">60%</span>
        </div>
      </div>
    </div>

    <!-- 备注：跨列 -->
    <div>
      <label class="mb-1.5 text-xs font-medium text-gray-700">备注</label>
      <textarea rows="3" placeholder="输入备注信息..." class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500">客户对数据迁移方案有顾虑，需要安排技术团队做一次 PoC 演示。下次跟进安排在 6 月 12 日。</textarea>
    </div>
  </div>

  <!-- 底部操作栏 -->
  <div class="flex items-center justify-between border-t border-gray-100 px-6 py-4">
    <span class="text-xs text-gray-400">最后编辑：张明远 2026-06-07 14:32</span>
    <div class="flex gap-2">
      <button type="button" class="h-8 rounded-md border border-gray-300 px-4 text-sm text-gray-700 hover:bg-gray-50">取消</button>
      <button type="submit" class="h-8 rounded-md bg-sky-600 px-4 text-sm font-medium text-white hover:bg-sky-700">保存</button>
    </div>
  </div>
</form>
```

## 加载态

```html
<div class="w-full max-w-4xl rounded-lg border border-gray-200 bg-white">
  <nav class="flex border-b border-gray-200 px-6">
    <div class="h-10 w-20 animate-pulse rounded bg-gray-200"></div>
    <div class="ml-2 h-10 w-20 animate-pulse rounded bg-gray-100"></div>
    <div class="ml-2 h-10 w-20 animate-pulse rounded bg-gray-100"></div>
  </nav>
  <div class="space-y-4 p-6">
    <div class="grid grid-cols-2 gap-4">
      <div>
        <div class="mb-1.5 h-3 w-16 animate-pulse rounded bg-gray-200"></div>
        <div class="h-8 w-full animate-pulse rounded-md bg-gray-100"></div>
      </div>
      <div>
        <div class="mb-1.5 h-3 w-16 animate-pulse rounded bg-gray-200"></div>
        <div class="h-8 w-full animate-pulse rounded-md bg-gray-100"></div>
      </div>
    </div>
    <div class="grid grid-cols-3 gap-4">
      <div>
        <div class="mb-1.5 h-3 w-16 animate-pulse rounded bg-gray-200"></div>
        <div class="h-8 w-full animate-pulse rounded-md bg-gray-100"></div>
      </div>
      <div>
        <div class="mb-1.5 h-3 w-20 animate-pulse rounded bg-gray-200"></div>
        <div class="h-8 w-full animate-pulse rounded-md bg-gray-100"></div>
      </div>
      <div>
        <div class="mb-1.5 h-3 w-16 animate-pulse rounded bg-gray-200"></div>
        <div class="h-8 w-full animate-pulse rounded-md bg-gray-100"></div>
      </div>
    </div>
    <div>
      <div class="mb-1.5 h-3 w-8 animate-pulse rounded bg-gray-200"></div>
      <div class="h-20 w-full animate-pulse rounded-md bg-gray-100"></div>
    </div>
  </div>
</div>
```

## 空态

```html
<form class="w-full max-w-4xl rounded-lg border border-gray-200 bg-white">
  <nav class="flex border-b border-gray-200 px-6">
    <button class="border-b-2 border-sky-600 px-4 py-3 text-sm font-medium text-sky-600">基本信息</button>
    <button class="px-4 py-3 text-sm text-gray-500">联系信息</button>
    <button class="px-4 py-3 text-sm text-gray-500">合同条款</button>
  </nav>
  <div class="flex flex-col items-center justify-center px-6 py-12">
    <svg class="mb-3 h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
    <p class="mb-1 text-sm font-medium text-gray-700">新建客户档案</p>
    <p class="mb-3 text-xs text-gray-500">填写基本信息以创建客户记录</p>
    <button type="button" class="h-8 rounded-md bg-sky-600 px-4 text-xs font-medium text-white hover:bg-sky-700">开始填写</button>
  </div>
</form>
```

## 错误态

```html
<form class="w-full max-w-4xl rounded-lg border border-red-200 bg-white">
  <nav class="flex border-b border-gray-200 px-6">
    <button class="border-b-2 border-red-500 px-4 py-3 text-sm font-medium text-red-600">基本信息</button>
    <button class="px-4 py-3 text-sm text-gray-500">联系信息</button>
  </nav>
  <div class="space-y-4 p-6">
    <!-- 错误提示条 -->
    <div class="flex items-center gap-2 rounded-md bg-red-50 px-3 py-2">
      <svg class="h-4 w-4 shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
      </svg>
      <span class="text-xs text-red-700">表单提交失败：客户名称已存在，请修改后重试</span>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="mb-1.5 flex items-center gap-1 text-xs font-medium text-red-700">
          客户名称 <span class="text-red-500">*</span>
        </label>
        <input type="text" value="瑞华会计师事务所" class="h-8 w-full rounded-md border border-red-300 bg-red-50 px-3 text-sm text-red-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" />
        <p class="mt-1 text-xs text-red-600">该客户名称已存在于系统中</p>
      </div>
      <div>
        <label class="mb-1.5 flex items-center gap-1 text-xs font-medium text-gray-700">
          客户类型 <span class="text-red-500">*</span>
        </label>
        <select class="h-8 w-full rounded-md border border-gray-300 px-3 text-sm text-gray-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500">
          <option>企业客户</option>
        </select>
      </div>
    </div>
  </div>
  <div class="flex items-center justify-end gap-2 border-t border-gray-100 px-6 py-4">
    <button type="button" class="h-8 rounded-md border border-gray-300 px-4 text-sm text-gray-700 hover:bg-gray-50">取消</button>
    <button type="submit" class="h-8 rounded-md bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700">重新提交</button>
  </div>
</form>
```
