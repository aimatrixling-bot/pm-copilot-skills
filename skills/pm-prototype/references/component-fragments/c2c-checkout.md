# C2C Checkout — C 端结算流程

> **场景**: C 端 Web/PC，Transient 姿态，分步向导 + 进度条 + 底部固定操作栏
> **密度**: 中（宽松间距，步骤清晰）
> **对应规则**: SC-03（枚举优先）、P5（流程完整性）、AP-25（C 端电商橙红主色）

## 可配置参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| steps | `3` | 步骤数：地址 → 确认 → 支付 |
| currentStep | `1` | 当前步骤（1-based） |
| showOrderSummary | `true` | 侧边订单摘要 |
| paymentMethods | `['wechat', 'alipay', 'card']` | 支付方式 |
| fixedFooter | `true` | 底部操作栏固定 |

## 默认态

```html
<div class="mx-auto flex max-w-5xl gap-8 py-6">
  <!-- 左侧：步骤主区域 -->
  <div class="flex-1">
    <!-- 进度条 -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="flex h-7 w-7 items-center justify-center rounded-full bg-orange-600 text-xs font-bold text-white">1</span>
          <span class="text-sm font-medium text-gray-900">收货地址</span>
        </div>
        <div class="h-px flex-1 bg-gray-200 mx-3"></div>
        <div class="flex items-center gap-2">
          <span class="flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-300 text-xs font-medium text-gray-400">2</span>
          <span class="text-sm text-gray-400">确认订单</span>
        </div>
        <div class="h-px flex-1 bg-gray-200 mx-3"></div>
        <div class="flex items-center gap-2">
          <span class="flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-300 text-xs font-medium text-gray-400">3</span>
          <span class="text-sm text-gray-400">支付</span>
        </div>
      </div>
    </div>

    <!-- Step 1：收货地址 -->
    <section>
      <h2 class="mb-4 text-base font-semibold text-gray-900">选择收货地址</h2>
      <div class="space-y-3">
        <label class="flex cursor-pointer items-start gap-3 rounded-lg border-2 border-orange-500 bg-orange-50/30 p-4">
          <input type="radio" name="address" checked class="mt-0.5 h-4 w-4 accent-orange-600" />
          <div class="flex-1">
            <div class="mb-1 flex items-center gap-2">
              <span class="text-sm font-medium text-gray-900">张明远</span>
              <span class="text-sm text-gray-500">138****6789</span>
              <span class="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-medium text-orange-700">默认</span>
            </div>
            <p class="text-sm text-gray-600">广东省深圳市南山区科技园南区 飞亚达科技大厦 15楼 1502室</p>
          </div>
        </label>
        <label class="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 hover:border-gray-300">
          <input type="radio" name="address" class="mt-0.5 h-4 w-4 accent-orange-600" />
          <div class="flex-1">
            <div class="mb-1 flex items-center gap-2">
              <span class="text-sm font-medium text-gray-900">李思琪</span>
              <span class="text-sm text-gray-500">139****1234</span>
            </div>
            <p class="text-sm text-gray-600">北京市朝阳区建国路 88 号 SOHO 现代城 A座 1208</p>
          </div>
        </label>
      </div>
      <button class="mt-3 text-sm text-orange-600 hover:text-orange-700">+ 新增收货地址</button>
    </section>

    <!-- 配送方式 -->
    <section class="mt-6">
      <h2 class="mb-3 text-base font-semibold text-gray-900">配送方式</h2>
      <div class="flex gap-3">
        <label class="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-300">
          <input type="radio" name="shipping" checked class="h-4 w-4 accent-orange-600" />
          <span class="text-sm text-gray-700">标准快递</span>
          <span class="text-sm tabular-nums text-gray-500">¥0</span>
        </label>
        <label class="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-300">
          <input type="radio" name="shipping" class="h-4 w-4 accent-orange-600" />
          <span class="text-sm text-gray-700">次日达</span>
          <span class="text-sm tabular-nums text-gray-500">¥12</span>
        </label>
      </div>
    </section>
  </div>

  <!-- 右侧：订单摘要 -->
  <aside class="w-72 shrink-0">
    <div class="sticky top-6 rounded-lg border border-gray-200 bg-gray-50 p-5">
      <h3 class="mb-4 text-sm font-semibold text-gray-900">订单摘要</h3>
      <div class="space-y-3">
        <div class="flex gap-3">
          <div class="h-14 w-14 shrink-0 rounded bg-gray-200"></div>
          <div class="flex-1">
            <p class="text-sm text-gray-900">日式陶瓷马克杯</p>
            <p class="text-xs text-gray-500">x1</p>
          </div>
          <span class="text-sm tabular-nums text-gray-900">¥89</span>
        </div>
        <div class="flex gap-3">
          <div class="h-14 w-14 shrink-0 rounded bg-gray-200"></div>
          <div class="flex-1">
            <p class="text-sm text-gray-900">无线蓝牙降噪耳机</p>
            <p class="text-xs text-gray-500">x1</p>
          </div>
          <span class="text-sm tabular-nums text-gray-900">¥599</span>
        </div>
      </div>
      <div class="mt-4 border-t border-gray-200 pt-3">
        <div class="flex justify-between text-sm">
          <span class="text-gray-500">商品小计</span><span class="tabular-nums text-gray-900">¥688</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-500">运费</span><span class="tabular-nums text-gray-900">¥0</span>
        </div>
      </div>
      <div class="mt-3 border-t border-gray-200 pt-3">
        <div class="flex justify-between">
          <span class="text-sm font-semibold text-gray-900">合计</span>
          <span class="text-lg font-bold tabular-nums text-orange-600">¥688</span>
        </div>
      </div>
      <button class="mt-4 w-full rounded-full bg-orange-600 py-2.5 text-sm font-medium text-white hover:bg-orange-700">下一步：确认订单</button>
    </div>
  </aside>
</div>
```

## 加载态

```html
<div class="mx-auto flex max-w-5xl gap-8 py-6">
  <div class="flex-1">
    <div class="mb-8 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="h-7 w-7 animate-pulse rounded-full bg-gray-200"></div>
        <div class="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
      </div>
      <div class="h-px flex-1 bg-gray-200 mx-3"></div>
      <div class="flex items-center gap-2">
        <div class="h-7 w-7 animate-pulse rounded-full bg-gray-200"></div>
        <div class="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
      </div>
      <div class="h-px flex-1 bg-gray-200 mx-3"></div>
      <div class="flex items-center gap-2">
        <div class="h-7 w-7 animate-pulse rounded-full bg-gray-200"></div>
        <div class="h-4 w-8 animate-pulse rounded bg-gray-200"></div>
      </div>
    </div>
    <div class="space-y-3">
      <div class="h-24 animate-pulse rounded-lg border border-gray-200 bg-gray-50"></div>
      <div class="h-24 animate-pulse rounded-lg border border-gray-200 bg-gray-50"></div>
    </div>
  </div>
  <aside class="w-72 shrink-0">
    <div class="rounded-lg border border-gray-200 bg-gray-50 p-5">
      <div class="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
      <div class="mt-4 space-y-3">
        <div class="flex gap-3">
          <div class="h-14 w-14 animate-pulse rounded bg-gray-200"></div>
          <div class="flex-1">
            <div class="h-4 w-full animate-pulse rounded bg-gray-100"></div>
            <div class="mt-1 h-3 w-8 animate-pulse rounded bg-gray-100"></div>
          </div>
        </div>
      </div>
      <div class="mt-6 h-10 w-full animate-pulse rounded-full bg-gray-200"></div>
    </div>
  </aside>
</div>
```

## 空态

```html
<div class="flex flex-col items-center justify-center py-20">
  <div class="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
    <svg class="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  </div>
  <p class="mb-1 text-base font-medium text-gray-900">购物车是空的</p>
  <p class="mb-4 text-sm text-gray-500">去逛逛，发现心仪好物吧</p>
  <button class="rounded-full bg-orange-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-orange-700">去购物</button>
</div>
```

## 错误态

```html
<div class="mx-auto flex max-w-5xl gap-8 py-6">
  <div class="flex-1">
    <div class="flex flex-col items-center justify-center py-16">
      <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <svg class="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <p class="mb-1 text-sm font-medium text-red-900">订单提交失败</p>
      <p class="mb-4 text-xs text-red-600">库存变动，部分商品已售罄，请返回购物车确认</p>
      <div class="flex gap-2">
        <button class="rounded-full border border-red-300 px-5 py-2 text-sm text-red-700 hover:bg-red-50">返回购物车</button>
        <button class="rounded-full bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700">重试提交</button>
      </div>
    </div>
  </div>
</div>
```
