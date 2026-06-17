# AI Copilot 侧边面板

> **场景**: 内嵌于主界面右侧的 AI 辅助面板，支持三档自主权切换，不离开当前页面
> **对应规则**: AG-01（三档自主权模式）
> **交叉引用**: agent-ui-rules.md, ai-chat-panel.md

## 可配置参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| width | "360px" | 面板宽度（320-400px） |
| default_mode | "suggest" | 默认自主权模式 |
| resizable | false | 是否允许拖拽调整宽度 |
| show_input | true | 是否显示底部输入框 |

## 默认态

```html
<aside class="flex h-full w-[360px] flex-col border-l border-zinc-200 bg-white">
  <!-- 顶部标题 + 模式切换 AG-01 -->
  <div class="border-b border-zinc-200 px-4 py-3">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="flex h-6 w-6 items-center justify-center rounded-md bg-violet-100">
          <svg class="h-3.5 w-3.5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
          </svg>
        </div>
        <span class="text-sm font-semibold text-zinc-900">AI Copilot</span>
      </div>
      <button class="text-zinc-400 hover:text-zinc-600 transition-colors duration-150"
              aria-label="关闭面板">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <!-- 三档模式切换 -->
    <div class="mt-3 flex rounded-lg bg-zinc-100 p-0.5">
      <button class="flex-1 rounded-md bg-white px-2 py-1.5 text-xs font-medium text-zinc-900 shadow-sm">建议</button>
      <button class="flex-1 rounded-md px-2 py-1.5 text-xs font-medium text-zinc-500
                     hover:text-zinc-700 transition-colors duration-150">确认</button>
      <button class="flex-1 rounded-md px-2 py-1.5 text-xs font-medium text-zinc-500
                     hover:text-zinc-700 transition-colors duration-150">执行</button>
    </div>
  </div>

  <!-- AI 输出区域 -->
  <div class="flex-1 overflow-y-auto px-4 py-4 space-y-3">
    <div class="rounded-xl bg-zinc-50 border border-zinc-100 p-3">
      <p class="text-sm text-zinc-700">
        当前页面有 <strong>3 条未跟进的客户记录</strong>。建议优先处理「张明远」的询价需求，已等待 2 天。
      </p>
    </div>
    <div class="rounded-xl bg-zinc-50 border border-zinc-100 p-3">
      <p class="text-sm text-zinc-700">
        本周预约完成率 87%，较上周下降 5%。主要因为周三上午的 3 个爽约。
      </p>
    </div>
  </div>

  <!-- 底部输入框 -->
  <div class="border-t border-zinc-200 px-4 py-3">
    <div class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2
                focus-within:border-violet-300 focus-within:ring-2 focus-within:ring-violet-500/20
                transition-all duration-150">
      <input type="text" placeholder="向 Copilot 提问…"
             class="flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400
                    focus:outline-none" />
      <button class="rounded-md bg-violet-600 px-2.5 py-1 text-xs font-medium text-white
                     hover:bg-violet-700 transition-colors duration-150">发送</button>
    </div>
  </div>
</aside>
```

## 加载态

```html
<aside class="flex h-full w-[360px] flex-col border-l border-zinc-200 bg-white">
  <div class="border-b border-zinc-200 px-4 py-3">
    <div class="flex items-center justify-between">
      <div class="h-5 w-24 animate-pulse rounded bg-zinc-200"></div>
      <div class="h-4 w-4 animate-pulse rounded bg-zinc-100"></div>
    </div>
    <div class="mt-3 h-8 animate-pulse rounded-lg bg-zinc-100"></div>
  </div>
  <div class="flex-1 px-4 py-4 space-y-3">
    <div class="h-20 animate-pulse rounded-xl bg-zinc-50 border border-zinc-100"></div>
    <div class="h-16 animate-pulse rounded-xl bg-zinc-50 border border-zinc-100"></div>
  </div>
  <div class="border-t border-zinc-200 px-4 py-3">
    <div class="h-9 animate-pulse rounded-lg bg-zinc-100"></div>
  </div>
</aside>
```

## 空态

```html
<aside class="flex h-full w-[360px] flex-col border-l border-zinc-200 bg-white">
  <div class="border-b border-zinc-200 px-4 py-3">
    <div class="flex items-center gap-2">
      <div class="flex h-6 w-6 items-center justify-center rounded-md bg-violet-100">
        <svg class="h-3.5 w-3.5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
        </svg>
      </div>
      <span class="text-sm font-semibold text-zinc-900">AI Copilot</span>
    </div>
    <div class="mt-3 flex rounded-lg bg-zinc-100 p-0.5">
      <button class="flex-1 rounded-md bg-white px-2 py-1.5 text-xs font-medium text-zinc-900 shadow-sm">建议</button>
      <button class="flex-1 rounded-md px-2 py-1.5 text-xs font-medium text-zinc-500">确认</button>
      <button class="flex-1 rounded-md px-2 py-1.5 text-xs font-medium text-zinc-500">执行</button>
    </div>
  </div>
  <div class="flex flex-1 flex-col items-center justify-center px-4">
    <p class="text-sm text-zinc-500">开始使用 Copilot</p>
    <p class="mt-1 text-xs text-zinc-400">在当前页面操作时，AI 将自动提供辅助建议</p>
  </div>
  <div class="border-t border-zinc-200 px-4 py-3">
    <div class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
      <input type="text" placeholder="向 Copilot 提问…"
             class="flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none" />
      <button class="rounded-md bg-violet-600 px-2.5 py-1 text-xs font-medium text-white">发送</button>
    </div>
  </div>
</aside>
```

## 错误态

```html
<aside class="flex h-full w-[360px] flex-col border-l border-zinc-200 bg-white">
  <div class="border-b border-zinc-200 px-4 py-3">
    <div class="flex items-center gap-2">
      <div class="flex h-6 w-6 items-center justify-center rounded-md bg-red-100">
        <svg class="h-3.5 w-3.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
                d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                clip-rule="evenodd" />
        </svg>
      </div>
      <span class="text-sm font-semibold text-zinc-900">AI Copilot</span>
      <span class="text-xs text-red-500">服务不可用</span>
    </div>
  </div>
  <div class="flex flex-1 flex-col items-center justify-center px-4">
    <div class="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
      <p class="text-sm text-red-700">AI 服务暂时不可用</p>
      <p class="mt-1 text-xs text-red-500">请稍后重试或联系管理员</p>
      <button class="mt-3 rounded-lg bg-red-600 px-4 py-1.5 text-xs font-medium text-white
                     hover:bg-red-700 transition-colors duration-150">重新连接</button>
    </div>
  </div>
  <div class="border-t border-zinc-200 px-4 py-3">
    <div class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
      <input type="text" disabled placeholder="等待重新连接…"
             class="flex-1 bg-transparent text-sm text-zinc-400 focus:outline-none" />
      <button disabled class="rounded-md bg-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-500">发送</button>
    </div>
  </div>
</aside>
```
