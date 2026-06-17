# AI 产物双栏预览

> **场景**: Agent 生成产物（代码/文档/图表）超过对话气泡合理展示范围时，左右双栏展示
> **对应规则**: AG-09（Chat Artifacts 双栏法则）
> **交叉引用**: agent-ui-rules.md, de-ai-checklist.md

## 可配置参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| split_ratio | "50/50" | 左右分栏比例 |
| artifact_type | "code" | 产物类型：code / document / chart / prototype |
| independent_scroll | true | 右侧产物是否独立滚动 |
| show_fullscreen | true | 是否支持全屏切换 |
| show_copy | true | 是否显示复制按钮 |

## 默认态

```html
<div class="flex h-full">
  <!-- 左侧对话流 (50%) -->
  <div class="flex w-1/2 flex-col border-r border-zinc-200 bg-white">
    <div class="flex items-center justify-between border-b border-zinc-200 px-4 py-2.5">
      <span class="text-sm font-semibold text-zinc-900">对话</span>
      <span class="text-xs text-zinc-400">3 轮</span>
    </div>
    <div class="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      <!-- 用户消息 -->
      <div class="flex justify-end">
        <div class="max-w-[85%] rounded-2xl rounded-br-md bg-sky-500 px-3.5 py-2
                    text-sm text-white">
          用 Python 写一个 CSV 数据清洗脚本
        </div>
      </div>
      <!-- AI 消息（含产物引用标记） -->
      <div class="flex justify-start">
        <div class="max-w-[85%] space-y-2">
          <div class="rounded-2xl rounded-bl-md bg-zinc-100 px-3.5 py-2 text-sm text-zinc-800">
            已生成数据清洗脚本，右侧可预览完整代码。
            <p class="mt-1.5 text-zinc-500">主要功能：</p>
            <ul class="mt-1 space-y-0.5 text-zinc-600 text-xs list-disc list-inside">
              <li>去除重复行</li>
              <li>日期格式标准化</li>
              <li>空值填充策略</li>
            </ul>
          </div>
          <!-- 产物引用锚点 -->
          <div class="flex items-center gap-1.5 rounded-lg bg-violet-50 border border-violet-200
                      px-2.5 py-1.5 cursor-pointer hover:bg-violet-100
                      transition-colors duration-150">
            <svg class="h-3.5 w-3.5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
            </svg>
            <span class="text-xs font-medium text-violet-700">data_cleaner.py</span>
            <span class="text-xs text-violet-400">· 45 行</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 输入框 -->
    <div class="border-t border-zinc-200 px-4 py-3">
      <div class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
        <input type="text" placeholder="继续对话…"
               class="flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none" />
        <button class="rounded-md bg-sky-500 px-2.5 py-1 text-xs font-medium text-white
                       hover:bg-sky-600">发送</button>
      </div>
    </div>
  </div>

  <!-- 右侧产物预览 (50%) AG-09 -->
  <div class="flex w-1/2 flex-col bg-zinc-900">
    <!-- 产物工具栏 -->
    <div class="flex items-center justify-between border-b border-zinc-700/50 px-4 py-2.5">
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium text-zinc-300">data_cleaner.py</span>
        <span class="rounded bg-zinc-700/50 px-1.5 py-0.5 text-xs text-zinc-500">Python</span>
      </div>
      <div class="flex items-center gap-1.5">
        <button class="rounded-md p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800
                       transition-colors duration-150" aria-label="复制代码">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
          </svg>
        </button>
        <button class="rounded-md p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800
                       transition-colors duration-150" aria-label="全屏预览">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
          </svg>
        </button>
      </div>
    </div>
    <!-- 代码预览（独立滚动） -->
    <div class="flex-1 overflow-y-auto p-4">
      <pre class="text-sm leading-relaxed font-mono"><code><span class="text-zinc-500"># data_cleaner.py — CSV 数据清洗脚本</span>
<span class="text-violet-400">import</span> <span class="text-emerald-400">pandas</span> <span class="text-violet-400">as</span> pd
<span class="text-violet-400">from</span> <span class="text-emerald-400">datetime</span> <span class="text-violet-400">import</span> datetime

<span class="text-violet-400">def</span> <span class="text-sky-300">clean_csv</span>(file_path: <span class="text-amber-300">str</span>) -> pd.DataFrame:
    <span class="text-zinc-500">"""读取并清洗 CSV 数据"""</span>
    df = pd.read_csv(file_path)

    <span class="text-zinc-500"># 去除重复行</span>
    df = df.drop_duplicates()

    <span class="text-zinc-500"># 日期格式标准化</span>
    df[<span class="text-emerald-300">'date'</span>] = pd.to_datetime(
        df[<span class="text-emerald-300">'date'</span>], errors=<span class="text-emerald-300">'coerce'</span>
    )

    <span class="text-zinc-500"># 空值填充</span>
    df[<span class="text-emerald-300">'name'</span>] = df[<span class="text-emerald-300">'name'</span>].fillna(<span class="text-emerald-300">'未知'</span>)
    df[<span class="text-emerald-300">'amount'</span>] = df[<span class="text-emerald-300">'amount'</span>].fillna(<span class="text-amber-300">0</span>)

    <span class="text-violet-400">return</span> df

<span class="text-violet-400">if</span> __name__ == <span class="text-emerald-300">"__main__"</span>:
    result = clean_csv(<span class="text-emerald-300">"data.csv"</span>)
    result.to_csv(<span class="text-emerald-300">"cleaned.csv"</span>, index=<span class="text-amber-300">False</span>)
    <span class="text-sky-300">print</span>(<span class="text-emerald-300">f"清洗完成，共 </span><span class="text-amber-300">{len(result)}</span><span class="text-emerald-300"> 条记录"</span>)</code></pre>
    </div>
  </div>
</div>
```

## 加载态

```html
<div class="flex h-full">
  <div class="flex w-1/2 flex-col border-r border-zinc-200 bg-white">
    <div class="border-b border-zinc-200 px-4 py-2.5">
      <div class="h-4 w-12 animate-pulse rounded bg-zinc-200"></div>
    </div>
    <div class="flex-1 px-4 py-4 space-y-4">
      <div class="flex justify-end">
        <div class="max-w-[70%] h-8 animate-pulse rounded-2xl rounded-br-md bg-zinc-100"></div>
      </div>
      <div class="flex justify-start">
        <div class="max-w-[70%] space-y-2">
          <div class="h-20 animate-pulse rounded-2xl rounded-bl-md bg-zinc-50"></div>
          <div class="h-6 animate-pulse rounded-lg bg-zinc-50"></div>
        </div>
      </div>
    </div>
  </div>
  <div class="flex w-1/2 flex-col bg-zinc-900">
    <div class="border-b border-zinc-700/50 px-4 py-2.5">
      <div class="flex items-center gap-2">
        <div class="h-4 w-24 animate-pulse rounded bg-zinc-700"></div>
        <div class="h-4 w-12 animate-pulse rounded bg-zinc-800"></div>
      </div>
    </div>
    <div class="flex-1 p-4 space-y-2">
      <div class="h-3 w-3/4 animate-pulse rounded bg-zinc-800"></div>
      <div class="h-3 w-1/2 animate-pulse rounded bg-zinc-800"></div>
      <div class="h-3 w-2/3 animate-pulse rounded bg-zinc-800"></div>
      <div class="h-3 w-full animate-pulse rounded bg-zinc-800"></div>
      <div class="h-3 w-1/3 animate-pulse rounded bg-zinc-800"></div>
    </div>
  </div>
</div>
```

## 空态

```html
<div class="flex h-full">
  <div class="flex w-1/2 flex-col border-r border-zinc-200 bg-white">
    <div class="border-b border-zinc-200 px-4 py-2.5">
      <span class="text-sm font-semibold text-zinc-900">对话</span>
    </div>
    <div class="flex-1 px-4 py-4 space-y-4">
      <div class="flex justify-end">
        <div class="max-w-[85%] rounded-2xl rounded-br-md bg-sky-500 px-3.5 py-2 text-sm text-white">
          用 Python 写一个 CSV 数据清洗脚本
        </div>
      </div>
    </div>
    <div class="border-t border-zinc-200 px-4 py-3">
      <div class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
        <input type="text" placeholder="继续对话…"
               class="flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none" />
        <button class="rounded-md bg-sky-500 px-2.5 py-1 text-xs font-medium text-white">发送</button>
      </div>
    </div>
  </div>
  <div class="flex w-1/2 flex-col items-center justify-center bg-zinc-50">
    <svg class="h-10 w-10 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
    </svg>
    <p class="mt-3 text-sm font-medium text-zinc-500">等待 AI 生成产物</p>
    <p class="mt-1 text-xs text-zinc-400">代码、文档、图表等将在此预览</p>
  </div>
</div>
```

## 错误态

```html
<div class="flex h-full">
  <div class="flex w-1/2 flex-col border-r border-zinc-200 bg-white">
    <div class="border-b border-zinc-200 px-4 py-2.5">
      <span class="text-sm font-semibold text-zinc-900">对话</span>
    </div>
    <div class="flex-1 px-4 py-4 space-y-4">
      <div class="flex justify-end">
        <div class="max-w-[85%] rounded-2xl rounded-br-md bg-sky-500 px-3.5 py-2 text-sm text-white">
          用 Python 写一个 CSV 数据清洗脚本
        </div>
      </div>
      <div class="flex justify-start">
        <div class="max-w-[85%] rounded-2xl rounded-bl-md bg-red-50 border border-red-200
                    px-3.5 py-2 text-sm text-red-700">
          代码生成失败：语法检查未通过
        </div>
      </div>
    </div>
    <div class="border-t border-zinc-200 px-4 py-3">
      <div class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
        <input type="text" placeholder="继续对话…"
               class="flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none" />
        <button class="rounded-md bg-sky-500 px-2.5 py-1 text-xs font-medium text-white">发送</button>
      </div>
    </div>
  </div>
  <div class="flex w-1/2 flex-col bg-zinc-900">
    <div class="border-b border-zinc-700/50 px-4 py-2.5">
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium text-red-400">data_cleaner.py</span>
        <span class="rounded bg-red-900/50 px-1.5 py-0.5 text-xs text-red-400">语法错误</span>
      </div>
    </div>
    <div class="flex-1 overflow-y-auto p-4">
      <pre class="text-sm leading-relaxed font-mono"><code><span class="text-violet-400">import</span> <span class="text-emerald-400">pandas</span> <span class="text-violet-400">as</span> pd

<span class="text-violet-400">def</span> <span class="text-sky-300">clean_csv</span>(file_path):
    df = pd.read_csv(file_path)
    df = df.drop_duplicates()
<span class="bg-red-900/30 text-red-300 px-1">    df['date'] = pd.to_datetime(df['date']  </span><span class="text-red-400">← 缺少右括号</span>
    <span class="text-violet-400">return</span> df</code></pre>
    </div>
    <div class="border-t border-zinc-700/50 px-4 py-3 flex gap-2">
      <button class="rounded-md bg-violet-600 px-3 py-1.5 text-xs font-medium text-white
                     hover:bg-violet-700 transition-colors duration-150">AI 自动修复</button>
      <button class="rounded-md border border-zinc-600 px-3 py-1.5 text-xs text-zinc-300
                     hover:bg-zinc-800 transition-colors duration-150">重新生成</button>
    </div>
  </div>
</div>
```
