# C2C Mobile Feed — C 端移动端信息流

> **场景**: C 端移动端，Transient 姿态，单栏流式 + 大图 + 下拉刷新 + 无限滚动
> **密度**: 低（单任务聚焦，大图少文字，间距宽松）
> **对应规则**: SC-02（C 端低密度）、AP-32（移动端间距 1.5x）、AP-44（输入框 ≥16px）、P2（触控 ≥44px）

## 可配置参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| cardStyle | `image-top` | 卡片样式：`image-top` / `image-grid` / `video` |
| imageRatio | `16:9` | 图片比例：`16:9` / `1:1` / `3:4` |
| showAvatar | `true` | 显示发布者头像 |
| showLike | `true` | 显示点赞/收藏 |
| pullRefresh | `true` | 下拉刷新指示器 |
| infiniteScroll | `true` | 无限滚动加载指示器 |

## 默认态

```html
<div class="mx-auto w-full max-w-md bg-white">
  <!-- 顶部导航栏 -->
  <header class="sticky top-0 z-10 border-b border-gray-100 bg-white/95 px-4 py-3 backdrop-blur">
    <div class="flex items-center justify-between">
      <h1 class="text-lg font-bold text-gray-900">发现</h1>
      <button class="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </button>
    </div>
    <nav class="mt-2 flex gap-6">
      <button class="border-b-2 border-orange-600 pb-2 text-sm font-semibold text-gray-900">推荐</button>
      <button class="pb-2 text-sm text-gray-500">关注</button>
      <button class="pb-2 text-sm text-gray-500">热门</button>
    </nav>
  </header>

  <!-- 下拉刷新指示 -->
  <div class="flex items-center justify-center py-2">
    <div class="flex items-center gap-1.5 text-xs text-gray-400">
      <svg class="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
      正在刷新...
    </div>
  </div>

  <!-- Feed 卡片列表 -->
  <div class="divide-y divide-gray-100">
    <!-- 卡片 1：图文 -->
    <article class="px-4 py-5">
      <div class="mb-3 flex items-center gap-2.5">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600">设</div>
        <div>
          <p class="text-sm font-medium text-gray-900">设计师小林</p>
          <p class="text-xs text-gray-500">2 小时前 · 深圳</p>
        </div>
        <button class="ml-auto rounded-full border border-orange-200 px-3 py-1 text-xs font-medium text-orange-600 hover:bg-orange-50">+ 关注</button>
      </div>
      <p class="mb-3 text-sm leading-relaxed text-gray-800">新家装修终于完工了！坚持了半年的极简风，把 120 平装出了 150 平的感觉。客厅大面积留白配合暖光灯带，晚上回家真的很治愈。</p>
      <div class="mb-3 overflow-hidden rounded-xl">
        <div class="aspect-[16/9] bg-gradient-to-br from-orange-100 to-amber-100"></div>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-5">
          <button class="flex items-center gap-1.5 text-gray-500">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
            <span class="text-xs tabular-nums">2,386</span>
          </button>
          <button class="flex items-center gap-1.5 text-gray-500">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" /></svg>
            <span class="text-xs tabular-nums">186</span>
          </button>
        </div>
        <button class="text-gray-400">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg>
        </button>
      </div>
    </article>

    <!-- 卡片 2：纯文字 -->
    <article class="px-4 py-5">
      <div class="mb-3 flex items-center gap-2.5">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-700">咖</div>
        <div>
          <p class="text-sm font-medium text-gray-900">咖啡探店王</p>
          <p class="text-xs text-gray-500">5 小时前 · 上海</p>
        </div>
      </div>
      <p class="mb-3 text-sm leading-relaxed text-gray-800">在静安寺附近发现一家宝藏手冲咖啡店，豆子来自云南保山产区，浅烘焙带点柑橘酸调。店主说豆子是直接跟庄园合作的，批次可溯源。推荐试他们的日晒处理款，一杯 ¥38 性价比很高。</p>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-5">
          <button class="flex items-center gap-1.5 text-red-500">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>
            <span class="text-xs tabular-nums">892</span>
          </button>
          <button class="flex items-center gap-1.5 text-gray-500">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" /></svg>
            <span class="text-xs tabular-nums">67</span>
          </button>
        </div>
        <button class="text-gray-400">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg>
        </button>
      </div>
    </article>

    <!-- 卡片 3：多图网格 -->
    <article class="px-4 py-5">
      <div class="mb-3 flex items-center gap-2.5">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700">旅</div>
        <div>
          <p class="text-sm font-medium text-gray-900">旅行日记</p>
          <p class="text-xs text-gray-500">昨天 · 大理</p>
        </div>
      </div>
      <p class="mb-3 text-sm leading-relaxed text-gray-800">大理第三天，洱海边骑行了 20 公里。路过一个白族古村落，当地阿婆在织扎染布，颜色好看极了。</p>
      <div class="mb-3 grid grid-cols-3 gap-1.5">
        <div class="aspect-square rounded-lg bg-gradient-to-br from-sky-100 to-blue-200"></div>
        <div class="aspect-square rounded-lg bg-gradient-to-br from-teal-100 to-emerald-200"></div>
        <div class="aspect-square rounded-lg bg-gradient-to-br from-amber-100 to-orange-200"></div>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-5">
          <button class="flex items-center gap-1.5 text-gray-500">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
            <span class="text-xs tabular-nums">1,456</span>
          </button>
          <button class="flex items-center gap-1.5 text-gray-500">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" /></svg>
            <span class="text-xs tabular-nums">234</span>
          </button>
        </div>
        <button class="text-gray-400">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg>
        </button>
      </div>
    </article>
  </div>

  <!-- 无限滚动加载 -->
  <div class="flex items-center justify-center py-6">
    <div class="flex items-center gap-2 text-sm text-gray-400">
      <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
      加载更多内容...
    </div>
  </div>
</div>
```

## 加载态

```html
<div class="mx-auto w-full max-w-md bg-white">
  <header class="border-b border-gray-100 px-4 py-3">
    <div class="flex items-center justify-between">
      <div class="h-6 w-14 animate-pulse rounded bg-gray-200"></div>
      <div class="h-9 w-9 animate-pulse rounded-full bg-gray-200"></div>
    </div>
    <div class="mt-2 flex gap-6">
      <div class="h-5 w-10 animate-pulse rounded bg-gray-200"></div>
      <div class="h-5 w-10 animate-pulse rounded bg-gray-100"></div>
      <div class="h-5 w-10 animate-pulse rounded bg-gray-100"></div>
    </div>
  </header>
  <div class="divide-y divide-gray-100">
    <div class="px-4 py-5">
      <div class="mb-3 flex items-center gap-2.5">
        <div class="h-10 w-10 animate-pulse rounded-full bg-gray-200"></div>
        <div>
          <div class="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
          <div class="mt-1 h-3 w-24 animate-pulse rounded bg-gray-100"></div>
        </div>
      </div>
      <div class="mb-3 space-y-1.5">
        <div class="h-4 w-full animate-pulse rounded bg-gray-100"></div>
        <div class="h-4 w-3/4 animate-pulse rounded bg-gray-100"></div>
      </div>
      <div class="mb-3 aspect-[16/9] animate-pulse rounded-xl bg-gray-100"></div>
      <div class="flex gap-5">
        <div class="h-5 w-14 animate-pulse rounded bg-gray-100"></div>
        <div class="h-5 w-12 animate-pulse rounded bg-gray-100"></div>
      </div>
    </div>
    <div class="px-4 py-5">
      <div class="mb-3 flex items-center gap-2.5">
        <div class="h-10 w-10 animate-pulse rounded-full bg-gray-200"></div>
        <div>
          <div class="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
          <div class="mt-1 h-3 w-20 animate-pulse rounded bg-gray-100"></div>
        </div>
      </div>
      <div class="mb-3 space-y-1.5">
        <div class="h-4 w-full animate-pulse rounded bg-gray-100"></div>
        <div class="h-4 w-5/6 animate-pulse rounded bg-gray-100"></div>
        <div class="h-4 w-2/3 animate-pulse rounded bg-gray-100"></div>
      </div>
      <div class="grid grid-cols-3 gap-1.5">
        <div class="aspect-square animate-pulse rounded-lg bg-gray-100"></div>
        <div class="aspect-square animate-pulse rounded-lg bg-gray-100"></div>
        <div class="aspect-square animate-pulse rounded-lg bg-gray-100"></div>
      </div>
    </div>
  </div>
</div>
```

## 空态

```html
<div class="mx-auto w-full max-w-md bg-white">
  <header class="sticky top-0 z-10 border-b border-gray-100 bg-white px-4 py-3">
    <h1 class="text-lg font-bold text-gray-900">发现</h1>
  </header>
  <div class="flex flex-col items-center justify-center px-6 py-24">
    <div class="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
      <svg class="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    </div>
    <p class="mb-1 text-base font-medium text-gray-900">还没有内容</p>
    <p class="mb-4 text-center text-sm text-gray-500">关注更多人，这里会更精彩</p>
    <button class="rounded-full bg-orange-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-orange-700">去发现更多</button>
  </div>
</div>
```

## 错误态

```html
<div class="mx-auto w-full max-w-md bg-white">
  <header class="sticky top-0 z-10 border-b border-gray-100 bg-white px-4 py-3">
    <h1 class="text-lg font-bold text-gray-900">发现</h1>
  </header>
  <div class="flex flex-col items-center justify-center px-6 py-24">
    <div class="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
      <svg class="h-10 w-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    </div>
    <p class="mb-1 text-base font-medium text-red-900">加载失败</p>
    <p class="mb-4 text-center text-sm text-red-600">网络似乎不太稳定，请检查网络后重试</p>
    <button class="rounded-full border border-red-300 px-6 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50">重新加载</button>
  </div>
</div>
```
