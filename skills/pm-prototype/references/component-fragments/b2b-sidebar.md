# B2B Sidebar — B 端侧边栏导航

> **场景**: B 端 Web/PC，Sovereign 姿态，持久侧边栏 + 当前项高亮
> **密度**: 高（紧凑菜单项，图标+文字）
> **对应规则**: SC-01（场景判断）、AP-20（侧边栏固定宽度 200-260px）、AP-22（层级表面）

## 可配置参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| width | `240` | 侧边栏宽度 px（200-260） |
| collapsible | `true` | 是否可折叠（折叠后仅图标） |
| navItems | `[]` | 导航项数组 `{ icon, label, badge?, active? }` |
| showUser | `true` | 底部用户信息 |
| groups | `[]` | 导航分组 `{ title, items[] }` |

## 默认态

```html
<aside class="flex h-screen w-60 flex-col border-r border-gray-200 bg-gray-50">
  <!-- Logo 区域 -->
  <div class="flex h-14 items-center gap-2.5 border-b border-gray-200 px-5">
    <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 text-sm font-bold text-white">S</div>
    <span class="text-sm font-semibold text-gray-900">SalesPro CRM</span>
    <button class="ml-auto text-gray-400 hover:text-gray-600" title="收起侧边栏">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
    </button>
  </div>

  <!-- 导航分组：核心 -->
  <nav class="flex-1 overflow-y-auto px-3 py-3">
    <p class="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">核心</p>
    <ul class="space-y-0.5">
      <li>
        <a href="#" class="flex items-center gap-2.5 rounded-md bg-sky-50 px-3 py-2 text-sm font-medium text-sky-700">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          工作台
        </a>
      </li>
      <li>
        <a href="#" class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          客户管理
          <span class="ml-auto rounded-full bg-sky-100 px-1.5 py-0.5 text-[10px] font-medium text-sky-700">156</span>
        </a>
      </li>
      <li>
        <a href="#" class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          商机跟踪
          <span class="ml-auto rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">12</span>
        </a>
      </li>
      <li>
        <a href="#" class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          日程安排
        </a>
      </li>
    </ul>

    <!-- 导航分组：分析 -->
    <p class="mb-1.5 mt-4 px-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">分析</p>
    <ul class="space-y-0.5">
      <li>
        <a href="#" class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          数据报表
        </a>
      </li>
      <li>
        <a href="#" class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          系统设置
        </a>
      </li>
    </ul>
  </nav>

  <!-- 底部用户信息 -->
  <div class="border-t border-gray-200 px-4 py-3">
    <div class="flex items-center gap-2.5">
      <div class="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700">张</div>
      <div class="flex-1 truncate">
        <p class="truncate text-sm font-medium text-gray-900">张明远</p>
        <p class="truncate text-[11px] text-gray-500">销售总监</p>
      </div>
      <button class="text-gray-400 hover:text-gray-600" title="退出登录">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
      </button>
    </div>
  </div>
</aside>
```

## 加载态

```html
<aside class="flex h-screen w-60 flex-col border-r border-gray-200 bg-gray-50">
  <div class="flex h-14 items-center gap-2.5 border-b border-gray-200 px-5">
    <div class="h-8 w-8 animate-pulse rounded-lg bg-gray-200"></div>
    <div class="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
  </div>
  <nav class="flex-1 px-3 py-3">
    <div class="mb-1.5 h-2.5 w-8 animate-pulse rounded bg-gray-200"></div>
    <ul class="space-y-1.5">
      <li><div class="h-8 w-full animate-pulse rounded-md bg-gray-100"></div></li>
      <li><div class="h-8 w-full animate-pulse rounded-md bg-gray-100"></div></li>
      <li><div class="h-8 w-full animate-pulse rounded-md bg-gray-100"></div></li>
      <li><div class="h-8 w-full animate-pulse rounded-md bg-gray-100"></div></li>
    </ul>
    <div class="mb-1.5 mt-4 h-2.5 w-8 animate-pulse rounded bg-gray-200"></div>
    <ul class="space-y-1.5">
      <li><div class="h-8 w-full animate-pulse rounded-md bg-gray-100"></div></li>
      <li><div class="h-8 w-full animate-pulse rounded-md bg-gray-100"></div></li>
    </ul>
  </nav>
  <div class="border-t border-gray-200 px-4 py-3">
    <div class="flex items-center gap-2.5">
      <div class="h-8 w-8 animate-pulse rounded-full bg-gray-200"></div>
      <div class="flex-1">
        <div class="h-3.5 w-14 animate-pulse rounded bg-gray-200"></div>
        <div class="mt-1 h-2.5 w-10 animate-pulse rounded bg-gray-100"></div>
      </div>
    </div>
  </div>
</aside>
```

## 空态

```html
<aside class="flex h-screen w-60 flex-col border-r border-gray-200 bg-gray-50">
  <div class="flex h-14 items-center gap-2.5 border-b border-gray-200 px-5">
    <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 text-sm font-bold text-white">S</div>
    <span class="text-sm font-semibold text-gray-900">SalesPro CRM</span>
  </div>
  <div class="flex flex-1 flex-col items-center justify-center px-4">
    <svg class="mb-3 h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
    <p class="mb-1 text-sm font-medium text-gray-700">暂无导航菜单</p>
    <p class="mb-3 text-center text-xs text-gray-500">请联系管理员配置权限和菜单</p>
    <button class="h-7 rounded border border-gray-300 px-3 text-xs font-medium text-gray-700 hover:bg-gray-100">刷新</button>
  </div>
</aside>
```

## 错误态

```html
<aside class="flex h-screen w-60 flex-col border-r border-gray-200 bg-gray-50">
  <div class="flex h-14 items-center gap-2.5 border-b border-gray-200 px-5">
    <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 text-sm font-bold text-white">S</div>
    <span class="text-sm font-semibold text-gray-900">SalesPro CRM</span>
  </div>
  <div class="flex flex-1 flex-col items-center justify-center px-4">
    <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
      <svg class="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    </div>
    <p class="mb-1 text-sm font-medium text-red-900">菜单加载失败</p>
    <p class="mb-3 text-center text-xs text-red-600">权限服务不可用，请稍后重试</p>
    <button class="h-7 rounded border border-red-300 px-3 text-xs font-medium text-red-700 hover:bg-red-50">重新加载</button>
  </div>
</aside>
```
