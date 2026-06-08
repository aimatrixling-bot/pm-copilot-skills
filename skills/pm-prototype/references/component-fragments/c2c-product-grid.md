# C2C Product Grid — C 端商品网格

> **场景**: C 端 Web/PC，Transient 姿态，3-4 列商品卡片 + Hover 效果
> **密度**: 中（间距 16-24px，适度留白）
> **对应规则**: SC-02（C 端间距）、AP-25（C 端电商橙红主色 #EA580C）、P4（状态双编码）

## 可配置参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| columns | `4` | 列数（3 或 4） |
| cardStyle | `image-top` | 卡片样式：`image-top` / `image-left` |
| showPrice | `true` | 显示价格 |
| showRating | `true` | 显示评分 |
| showQuickBuy | `true` | Hover 时快捷购买按钮 |
| aspectRatio | `1:1` | 图片比例：`1:1` / `3:4` / `4:3` |

## 默认态

```html
<div class="w-full">
  <!-- 顶部筛选栏 -->
  <div class="mb-6 flex items-center justify-between">
    <p class="text-sm text-gray-500">找到 <span class="font-medium text-gray-900">328</span> 件商品</p>
    <select class="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600">
      <option>综合排序</option>
      <option>销量优先</option>
      <option>价格从低到高</option>
      <option>价格从高到低</option>
      <option>最新上架</option>
    </select>
  </div>

  <!-- 商品网格 -->
  <div class="grid grid-cols-4 gap-5">
    <!-- 商品卡片 1 -->
    <article class="group cursor-pointer">
      <div class="relative mb-3 overflow-hidden rounded-lg bg-gray-100 aspect-square">
        <div class="h-full w-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
        <div class="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-200 group-hover:bg-black/10">
          <button class="translate-y-2 rounded-full bg-orange-600 px-5 py-2 text-sm font-medium text-white opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-orange-700">加入购物车</button>
        </div>
        <span class="absolute left-2 top-2 rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">限时</span>
      </div>
      <h3 class="mb-1 line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-orange-600">日式简约陶瓷马克杯 手工复古粗陶杯 大容量咖啡杯 350ml</h3>
      <div class="flex items-baseline gap-1.5">
        <span class="text-lg font-bold tabular-nums text-orange-600">¥89</span>
        <span class="text-xs tabular-nums text-gray-400 line-through">¥168</span>
      </div>
      <p class="mt-1 text-xs text-gray-500">已售 2,340+</p>
    </article>

    <!-- 商品卡片 2 -->
    <article class="group cursor-pointer">
      <div class="relative mb-3 overflow-hidden rounded-lg bg-gray-100 aspect-square">
        <div class="h-full w-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
        <div class="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-200 group-hover:bg-black/10">
          <button class="translate-y-2 rounded-full bg-orange-600 px-5 py-2 text-sm font-medium text-white opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-orange-700">加入购物车</button>
        </div>
      </div>
      <h3 class="mb-1 line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-orange-600">北欧实木书架落地置物架 四层开放式收纳架 卧室客厅储物架</h3>
      <div class="flex items-baseline gap-1.5">
        <span class="text-lg font-bold tabular-nums text-gray-900">¥459</span>
      </div>
      <div class="mt-1 flex items-center gap-1">
        <div class="flex text-amber-400">
          <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
        </div>
        <span class="text-xs text-gray-500">4.9 (876条评价)</span>
      </div>
    </article>

    <!-- 商品卡片 3 -->
    <article class="group cursor-pointer">
      <div class="relative mb-3 overflow-hidden rounded-lg bg-gray-100 aspect-square">
        <div class="h-full w-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
        <div class="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-200 group-hover:bg-black/10">
          <button class="translate-y-2 rounded-full bg-orange-600 px-5 py-2 text-sm font-medium text-white opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-orange-700">加入购物车</button>
        </div>
        <span class="absolute left-2 top-2 rounded bg-orange-600 px-1.5 py-0.5 text-[10px] font-bold text-white">新品</span>
      </div>
      <h3 class="mb-1 line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-orange-600">无线蓝牙降噪耳机 头戴式 Hi-Res 高解析度音频 40h续航</h3>
      <div class="flex items-baseline gap-1.5">
        <span class="text-lg font-bold tabular-nums text-orange-600">¥599</span>
        <span class="text-xs tabular-nums text-gray-400 line-through">¥899</span>
      </div>
      <p class="mt-1 text-xs text-gray-500">已售 1,205</p>
    </article>

    <!-- 商品卡片 4 -->
    <article class="group cursor-pointer">
      <div class="relative mb-3 overflow-hidden rounded-lg bg-gray-100 aspect-square">
        <div class="h-full w-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
        <div class="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-200 group-hover:bg-black/10">
          <button class="translate-y-2 rounded-full bg-orange-600 px-5 py-2 text-sm font-medium text-white opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-orange-700">加入购物车</button>
        </div>
      </div>
      <h3 class="mb-1 line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-orange-600">有机纯棉四件套 60支长绒棉 全棉贡缎床上用品 1.8m床适用</h3>
      <div class="flex items-baseline gap-1.5">
        <span class="text-lg font-bold tabular-nums text-gray-900">¥368</span>
      </div>
      <p class="mt-1 text-xs text-gray-500">已售 568</p>
    </article>
  </div>
</div>
```

## 加载态

```html
<div class="w-full">
  <div class="mb-6 flex items-center justify-between">
    <div class="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
    <div class="h-8 w-28 animate-pulse rounded-md bg-gray-200"></div>
  </div>
  <div class="grid grid-cols-4 gap-5">
    <div>
      <div class="mb-3 aspect-square animate-pulse rounded-lg bg-gray-100"></div>
      <div class="mb-2 h-4 w-full animate-pulse rounded bg-gray-100"></div>
      <div class="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
    </div>
    <div>
      <div class="mb-3 aspect-square animate-pulse rounded-lg bg-gray-100"></div>
      <div class="mb-2 h-4 w-3/4 animate-pulse rounded bg-gray-100"></div>
      <div class="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
    </div>
    <div>
      <div class="mb-3 aspect-square animate-pulse rounded-lg bg-gray-100"></div>
      <div class="mb-2 h-4 w-full animate-pulse rounded bg-gray-100"></div>
      <div class="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
    </div>
    <div>
      <div class="mb-3 aspect-square animate-pulse rounded-lg bg-gray-100"></div>
      <div class="mb-2 h-4 w-4/5 animate-pulse rounded bg-gray-100"></div>
      <div class="h-4 w-14 animate-pulse rounded bg-gray-200"></div>
    </div>
  </div>
</div>
```

## 空态

```html
<div class="flex flex-col items-center justify-center py-20">
  <div class="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
    <svg class="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  </div>
  <p class="mb-1 text-base font-medium text-gray-900">没有找到相关商品</p>
  <p class="mb-4 text-sm text-gray-500">试试换个关键词或调整筛选条件</p>
  <button class="rounded-full bg-orange-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-orange-700">清空筛选</button>
</div>
```

## 错误态

```html
<div class="flex flex-col items-center justify-center py-20">
  <div class="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
    <svg class="h-10 w-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  </div>
  <p class="mb-1 text-base font-medium text-red-900">商品加载失败</p>
  <p class="mb-4 text-sm text-red-600">服务器开小差了，请稍后再试</p>
  <button class="rounded-full border border-red-300 px-6 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50">重新加载</button>
</div>
```
