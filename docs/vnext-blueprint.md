# AI Builder OS — vNext Blueprint

**版本**: vNext 草案（未编号）
**创建日期**: 2026-07-04
**状态**: Step 1 + Step 2 完成，Step 3 + Step 4 待生成
**作者**: Max + Claude Code

---

## §0 背景与重构动机

### 0.1 v1 设计债

当前 AI Builder OS（v1.1）以 8 个 `builder-*` skill 为核心（builder-router / builder-plan-goal / builder-frame / builder-spec / builder-prototype / builder-agent-task / builder-review / builder-decision），实现 9 层工程架构（L0-L9）。Phase 4 跨项目研究（10 个开源项目 + Claude Code）指出 3 个集中弱点：

- **W1 Skill 合同不充分**：frontmatter 仅 name/description，缺 can-invoke / paths / status / disable-model-invocation / omit-context（7 个项目支撑）
- **W2 Output Packet 元数据缺失**：无 confidence / cost / format / risk / citations（6 个项目支撑）
- **W3 Memory & Evolution 仅概念层**：无 schema、无入口约束、无漂移警告（5 个项目支撑）

同时用户在 `AI Builder OS 重构规划.xlsx` 中提出：8 个 skill 的定位"似乎有的奇怪，不符合最佳实践（更像 Agent 的感觉）"，要求按角色重新组织。

### 0.2 B+C 混合路径

| 层 | 路径 | 处理方式 |
| --- | --- | --- |
| L0 Agent 入口 | **C（推倒重来）** | 7 角色化 Agent 取代 8 skill 入口 |
| L1 Kernel / Meta_Kim 7 件套 | **B（保留+再分配）** | Intent Packet → Supervisor；Output/Evidence Packet → 通用；Gates → Harness；Meta-Review → Evolver；Evolution Writeback → Memory |
| L3 Harness | **B（保留+强化）** | 加入 Swiss Cheese 5 层叠层护栏（P3-05） |
| L4 Memory | **B+C（保留+schema 重写）** | 引入 4 类分类（user/feedback/project/reference）+ MEMORY.md 双约束 + 漂移警告（P3-03, G12） |
| L5 Skills | **C（撤销独立）** | 8 个 builder-* 撤销，部分提升为 Agent 内核，部分降级为共享 Skills |
| L7 References / L8 Eval / L9 Adapters | **B（保留）** | 不动 |

### 0.3 已确认决策（D1-D5）

| # | 决策 | 状态 |
| --- | --- | --- |
| D1 | 7 Agent 架构取代 8 builder-* skills | ✅ 确认 |
| D2 | Memory 4 类分类（borrow claude-code G12） | ✅ 确认 |
| D3 | B+C 混合路径（Agent 层 clean-slate, 基础设施保留） | ✅ 确认 |
| D4 | Improver/Creator 重命名为 **Evolver**（单一职责） | ✅ 确认 |
| D5 | Phase 4 anti-bloat 底线重议定 — 原 8 skill 定位不当 → Agent-ification | ✅ 确认 |

### 0.4 7 个 Agent（FINAL）

| # | Agent | 一句话定位 |
| --- | --- | --- |
| 1 | **Supervisor** | 总控、意图识别、任务分解与分派、Prompt 优化、按需回答 |
| 2 | **Researcher** | 研究、调研、文档交付（PRD/BRD/竞品/用户画像） |
| 3 | **Builder** | 高保真原型 + 可部署全栈应用（UI/UX + FDE + 架构 + 前后端） |
| 4 | **Reviewer** | 多模式评审（文档/UI/代码/测试/AI Eval） |
| 5 | **Evolver** | Harness 自我改进、skills/rules/agents/components 创建与维护、Memory 熵减 |
| 6 | **Writer** | 自媒体原创与二创（大纲→初稿→润色→配图→发布） |
| 7 | **Helper** | 产品首席客服 + AI 上下文诊断 + eval-session |

---

## §1 Step 1 — v1 现状 + 8 builder-* 基因拆解

### 1.1 v1 现状摘要

| 维度 | v1.1 状态 |
| --- | --- |
| 入口数 | 8 个 `builder-*` skills（user-invocable） |
| Kernel | Meta_Kim 7 件套（Intent Packet / Output Packet / Evidence Packet / Gates / Meta-Review / Evolution Writeback / Iron Law） |
| Layers | L0-L9 共 10 层（L0 Intent / L1 Kernel / L2 Artifacts / L3 Harness / L4 Memory / L5 Skills / L6 Loops / L7 References / L8 Eval / L9 Adapters） |
| Memory | 概念层（无 4 类 schema、无入口约束） |
| Eval | 9 类单层评判（无 Hybrid 双层） |
| Guardrails | Branch State + Definition Drift + Change Contract（单层） |
| Skills frontmatter | 仅 name/description（缺 5 个关键字段） |

### 1.2 8 builder-* 基因拆解表

#### builder-router
| 元素 | 去向 | 备注 |
| --- | --- | --- |
| 路由决策逻辑 | 🆕 Supervisor 内核 | 升级为 Agent |
| Intent Packet 入口 | 🔁 Kernel 通用 | 已是 Meta_Kim |
| delivery_mode 判定 | 🔁 Kernel protocol | 通用契约 |
| adaptive probe_depth | 📥 borrow（T8/G8） | 新增 |

#### builder-plan-goal
| 元素 | 去向 | 备注 |
| --- | --- | --- |
| Plan/Goal 模式 | 🆕 Supervisor 内核 | 升级为 Agent |
| task decomposition | 🆕 Supervisor |  |
| grill-decision loop | 🔁 Kernel loop | 通用 |

#### builder-frame
| 元素 | 去向 | 备注 |
| --- | --- | --- |
| Feature Frame 产出 | 🆕 Researcher 内核 | 升级为 Agent |
| grill_frame 模式 | 🔁 Researcher skill |  |
| 5W2H 澄清 | 🆕 Researcher |  |

#### builder-spec
| 元素 | 去向 | 备注 |
| --- | --- | --- |
| Mini Spec / PRD / Engineering Request | 🔁 shared Skill: **spec-craft** | 降级为共享 |
| module-execution-pack | 🔁 shared Skill |  |
| change-contract | 🔁 shared Skill |  |
| prototype-to-spec 反向 | 🔁 shared Skill |  |
| profile selection | 🔁 shared Skill |  |

#### builder-prototype
| 元素 | 去向 | 备注 |
| --- | --- | --- |
| 高保真原型生成 | 🔁 shared Skill: **prototype-craft** | 降级为共享 |
| visual_target | 🔁 shared Skill |  |
| handoff document | 🔁 shared Skill |  |

#### builder-agent-task
| 元素 | 去向 | 备注 |
| --- | --- | --- |
| agent-readable spec | 🔁 shared Skill: **task-packaging** | 降级为共享 |
| stop conditions | 🔁 shared Skill |  |
| runtime handoff | 🔁 shared Skill |  |

#### builder-review
| 元素 | 去向 | 备注 |
| --- | --- | --- |
| 多模式评审 | 🆕 Reviewer 内核 | 升级为 Agent |
| Review Packet | 🔁 Kernel Evidence Packet | 已是 Meta_Kim |
| HALO 3 型诊断 | 📥 borrow（G2） | 新增 |
| Hybrid Eval 双层 | 📥 borrow（G3, T4） | 新增 |
| Rationalization Table | 📥 borrow（G7） | 新增 |
| Deletion Test | 📥 borrow（G10） | 新增 |

#### builder-decision
| 元素 | 去向 | 备注 |
| --- | --- | --- |
| Decision Log | 🔁 shared Skill: **decision-craft** | 降级为共享 |
| ADR 模板 | 🔁 shared Skill |  |
| branch state | 🔁 Kernel protocol | 通用 |

### 1.3 Kernel 协议再分配汇总

| 协议 | 原位置 | 新位置 |
| --- | --- | --- |
| Intent Packet | builder-router 入口 | 🔁 Kernel 通用（Supervisor 使用） |
| Output Packet | builder-router 出口 | 🔁 Kernel 通用（所有 Agent） |
| Evidence Packet | builder-review | 🔁 Kernel 通用（Reviewer 主用） |
| Iron Law | 全局 | 🔁 Kernel 通用 |
| delivery_mode | builder-spec | 🔁 Kernel protocol |
| branch state | builder-decision | 🔁 Kernel protocol |
| Meta-Review | 全局 | 🔁 Evolver 内核 |
| Evolution Writeback | 全局 | 🔁 Evolver + Memory |

---

## §2 Step 2 — 7 Agents × Assets × Source 映射

### 2.0 命名规范（8-Bucket Closed Scheme）

所有 vNext Skill 名必须落在以下 8 个**封闭桶**之一，桶名即前缀：

| 桶 | 语义边界 | 谁主用 |
| --- | --- | --- |
| `discover-*` | 信息收集 / 研究 / 调研 / 数据采集 | Researcher |
| `craft-*` | 产出可交付文档或规格（spec/wireframe/story/domain/architecture/test-case/prototype/agent-task/decision/handoff） | Researcher / Builder |
| `review-*` | 对已成形的产物做评审 / 检查 / 测试 | Reviewer |
| `build-*` | 实际编码、构建、提交、组件开发 | Builder |
| `evolve-*` | Harness 元资产（skill/rule/agent/command/loop/workflow/component/memory）的创建与维护、熵减 | Evolver |
| `write-*` | 自媒体原创与二创（含 extract 系列） | Writer |
| `manage-*` | 跨 Agent 通用工具（prompt/file/eval-session/grill/brainstorm） | 全部 |
| `help-*` | 用户引导、上下文诊断、会话迁移 | Helper |

**格式强约束**:
- 格式: `<bucket>-<noun>[-<modifier>]`，全 kebab-case，全英文，单数名词
- 桶名必须来自上表 8 项封闭集合，禁止新造桶
- 新建 Skill 必须回答"属于哪个桶、为什么不属于其他桶"，prefix 冲突即设计警告
- MECE 检验：跨桶重叠 = 拆分未清晰；同桶内 >10 项 = 考虑子分类

**Skill Frontmatter 必填字段（vNext 强化，矫正 W1 + D12 吸收 mattpocock）**:

每个 Skill 的 YAML frontmatter 必须包含以下 9 个字段（缺失即 validator 报错）：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `name` | string | Skill 全局唯一标识，必须与文件名一致 |
| `description` | string | 触发条件 + 一句话能力；**模型自调用入口（D12）**——见下方 description 写作规范 |
| `disable-model-invocation` | bool | **模型自调用开关（D12 提升）**：`true` = 仅用户可调（user-invoked，剥除模型发现）；`false`/缺省 = 模型可自调用（model-invoked，描述常驻 context）。两个代价的取舍见 §2.24 |
| `can-invoke` | list[string] | 可调用的 Agent / Skill / Tool 白名单 |
| `paths` | list[string] | 允许读写的路径模式（glob，缺省为 none） |
| `status` | enum | `draft` / `beta` / `stable` / `deprecated`（默认 `draft`） |
| `owner_agent` | enum | 主负责 Agent（7 个角色之一，shared Skill 标 `shared`） |
| `shared_with` | list[string] | 被哪些 Agent 共享调用（缺省为 `[]`） |
| `scope` | enum | `global` / `project` / `session`（默认 `project`） |

可选字段：`omit-context`（bool，加载时不读 body）。

**Description 写作规范（D12 — mattpocock 吸收）**:

`description` 是 model-invoked skill 的**唯一触发器**，常驻 context window（即 context load 代价）。三规则：

1. **前置 leading word** — 把 skill 的核心概念词放在 description 开头；该词同时出现在 skill body、用户 prompt、相关文档中，构成跨站点的 invocation anchor
2. **一个 branch 一个 trigger** — 同一 branch 的同义改写（"build features using TDD … asks for test-first development"）是 duplication，必须 collapse
3. **删除 body 已说的 identity** — description 只保留 trigger + "when another skill needs…" reach clause，不复述 body 内容

> Leading word = 模型预训练中已存在的紧凑概念（如 *tracer bullet* / *fog of war* / *red-green-refactor*），用一个 token 锚定一整片行为区。详见 §2.24。

**Skill 分级标签（矫正 ChatGPT Risk 2）**:

每个 Skill 在 frontmatter 同时带 `grade` 字段，标记是否进入 P0 闭环：

| Grade | 含义 |
| --- | --- |
| `Candidate` | 候选清单（§2.11 中 62 项默认值，**不代表必须建设**） |
| `P0` | 最小闭环必备（≤12 项，详见 §2.15） |
| `P1` | 立即可选增强（验证 P0 后再补） |
| `P2` | 长尾补完 |
| `P3` | 仅记录，不实现 |

> 62 项 Skill 全部初始标 `Candidate`，禁止"列出 = 必须建"。P0 上限 12 项。

**Source 标签**:
- 🟢 keep（v1 保留） / 🔁 redistribute（v1 再分配） / 🆕 new（新建） / 📥 borrow（外部借鉴） / ❌ drop（删除）

---

### 2.1 Supervisor

**核心行为**: 意图识别（Identify）/ Prompt 优化 / 任务分解 / 指派 / 协调 / 跟踪 / 按需 Answer/Ask/Grill/Plan/Goal

| 资产类型 | 资产 | Source |
| --- | --- | --- |
| Skill | manage-prompt | 📥 borrow（ECC prompt-optimizer） |
| Skill | manage-grill | 📥 borrow（mattpocock grill-me / grill-with-docs） |
| Skill | manage-brainstorm | 📥 borrow（superpowers） |
| Skill | manage-file | 🆕（共享） |
| Skill | discover-research | 🆕（共享） |
| Skill | evolve-memory | 🆕（共享） |
| Skill | manage-eval-session | 🆕（共享） |
| Kernel | Intent Packet | 🟢 keep（v1） |
| Kernel | Output Packet | 🟢 keep（v1） |
| Kernel | delivery_mode | 🟢 keep（v1） |
| Kernel | adaptive probe_depth | 📥 borrow（T8） |
| Kernel | Action-First / NO_REPLY | 📥 borrow（G9） |
| Kernel | 4 决策卡（router 前置筛选） | 📥 borrow（T8） |
| Memory | user（偏好） | 📥 borrow（claude-code G12） |
| Agent | （调用其他 6 个） | 🟢 |

### 2.2 Researcher

**核心行为**: 行业/产业链/企业研究 / 竞品分析 / 主题深研 / PRD/BRD/MRD/用户画像/用户故事/线框图 交付

| 资产类型 | 资产 | Source |
| --- | --- | --- |
| Skill | discover-research | 🆕（共享，深研主题） |
| Skill | discover-competitive | 🆕 |
| Skill | discover-persona | 🆕 |
| Skill | discover-data | 🆕（数据分析/挖掘） |
| Skill | craft-spec | 🔁 redistribute（from v1 builder-spec；含 lite/standard/ultra 三档 profile） |
| Skill | craft-wireframe | 🆕 |
| Skill | craft-stories | 🆕 |
| Skill | craft-domain | 🆕 |
| Skill | craft-architecture | 🆕 |
| Skill | craft-test-case | 🆕（共享） |
| Skill | craft-decision | 🔁 redistribute（from v1 builder-decision） |
| Skill | manage-file | 🆕（共享） |
| Kernel | Research Packet | 🆕（新） |
| Kernel | Confidence Score | 📥 borrow（pm-skills-pop T2） |
| Kernel | citations + evidence_table | 📥 borrow（agent-handbook） |

### 2.3 Builder

**核心行为**: Prototype（mock data 高保真原型）/ FullStack Application / 设计与开发规范沉淀 / SDD+TDD

| 资产类型 | 资产 | Source |
| --- | --- | --- |
| Skill | craft-spec | 🔁（共享，与 Researcher 共用同一 Skill） |
| Skill | craft-prototype | 🔁 redistribute（from v1 builder-prototype；含 visual_target + handoff） |
| Skill | craft-agent-task | 🔁 redistribute（from v1 builder-agent-task；含 stop conditions + runtime handoff） |
| Skill | craft-domain | 🆕（共享） |
| Skill | craft-architecture | 🆕（共享） |
| Skill | craft-test-case | 🆕（共享） |
| Skill | build-ui | 📥 borrow（ui-ux-pro-max） |
| Skill | build-commit | 🆕（代码提交/合并/git） |
| Skill | build-component | 🆕（共享，由 Evolver 调用沉淀组件） |
| Kernel | Branch State | 🟢 keep（v1） |
| Kernel | Change Contract | 🟢 keep（v1） |
| Kernel | Definition Drift | 🟢 keep（v1） |
| Kernel | Swiss Cheese 5 层护栏 | 📥 borrow（T5） |
| Kernel | TDD-for-Skills | 📥 borrow（G6） |
| Kernel | First Run vs Subsequent | 📥 borrow（G11） |

### 2.4 Reviewer

**核心行为**: 文档评审 / UI/UX 走查 / Code Review / 功能测试 / E2E / AI Eval；守护需求-文档-交付一致性；可改动 PRD

| 资产类型 | 资产 | Source |
| --- | --- | --- |
| Skill | review-doc | 🆕 |
| Skill | review-ui | 🆕（UI/UX 走查） |
| Skill | review-code | 🆕（代码审查） |
| Skill | review-prototype | 🆕（原型测试） |
| Skill | review-e2e | 🆕（端到端测试） |
| Skill | review-eval | 🆕（AI Eval） |
| Skill | craft-test-case | 🆕（共享） |
| Kernel | Evidence Packet | 🟢 keep（v1） |
| Kernel | HALO 3 型诊断 | 📥 borrow（G2） |
| Kernel | Hybrid Eval 双层 | 📥 borrow（G3, T4） |
| Kernel | Rationalization Table | 📥 borrow（G7） |
| Kernel | Deletion Test | 📥 borrow（G10） |
| Kernel | Triple Gate（time / sessions / lock） | 📥 borrow（claude-code） |
| Kernel | First Run vs Subsequent | 📥 borrow（G11） |
| Pattern | 模型隔离（实现者 vs 审查者不同模型） | 🆕 |

### 2.5 Evolver

**核心行为**: Harness 审计 / harness engineering 建议 / skill+rule+agent+command+loop+workflow+component 创建维护 / Memory 熵减

| 资产类型 | 资产 | Source |
| --- | --- | --- |
| Skill | evolve-skill | 🆕（共享，create + improve；**D12 吸收 mattpocock writing-great-skills**——11 个 leading words + description 规则 + completion criterion 作为 acceptance check + 审计维度，中文本地化内容沉淀至 `references/skill-authoring.md`） |
| Skill | evolve-rules | 🆕 |
| Skill | evolve-agent | 🆕 |
| Skill | evolve-command | 🆕 |
| Skill | evolve-loop | 🆕 |
| Skill | evolve-workflow | 🆕 |
| Skill | evolve-component | 🆕（共享，从已有原型/代码中提取沉淀，区别于 build-component 的新开发） |
| Skill | evolve-memory | 🆕（单一 Skill：写入 + 清理 + 熵减，含 prune 语义） |
| Skill | evolve-harness-audit | 🆕（项目/全局 harness 审计入口；含 type=docs/kb/skills/memory/full 子模式） |
| Skill | evolve-skill-health | 📥 borrow（ECC skill-health，并入 harness-audit 的 type=skills 子模式作为 reference） |
| Kernel | Meta-Review | 🔁 Kernel（来自 Meta_Kim） |
| Kernel | Evolution Writeback | 🔁 Kernel（来自 Meta_Kim） |
| Kernel | Pit-of-Success | 📥 borrow（G1） |
| Kernel | Forked Agent + Cache-piggyback | 📥 borrow（G4） |
| Kernel | Context Budget P0-P4 | 📥 borrow（G8） |

> **evolve-memory 单一化理由（D6）**：把"写入"和"清理熵减"拆成两个 Skill 会造成调用入口混乱（Agent 不知道何时调哪个）。单一 evolve-memory 内部分模式（write/cleanup/merge/archive），由 description 表达触发条件。

### 2.6 Writer

**核心行为**: 原创与二创 / 大纲→初稿→润色→打磨→配图→发布

| 资产类型 | 资产 | Source |
| --- | --- | --- |
| Skill | write-research | 🟢 keep（用户既有 pm-writer-research，rename） |
| Skill | write-outline | 🟢 keep |
| Skill | write-draft | 🟢 keep |
| Skill | write-polish | 🟢 keep |
| Skill | write-content | 🟢 keep |
| Skill | write-repurpose | 🟢 keep（原 pm-writer-evolve，暂定名 D7） |
| Skill | write-style | 🟢 keep（原 pm-writer-extract-style） |
| Skill | write-publish | 🟢 keep |
| Skill | write-extract-article | 🟢 keep（原 extract-article） |
| Skill | write-extract-book | 🟢 keep |
| Skill | write-extract-wechat | 🟢 keep |
| Skill | write-extract-youtube | 🟢 keep |
| Skill | write-extract-arxiv | 🟢 keep |
| Skill | manage-prompt | 📥 borrow（共享） |
| Skill | manage-brainstorm | 📥 borrow（共享） |
| Skill | discover-research | 📥 borrow（共享） |

> **write-repurpose 命名理由（D7）**：`write-iterate` 与 `evolve-*` 桶概念冲突（evolve 专指 harness 元资产）；`write-repurpose` 强调"把研究和实践转用为新内容"，避免桶边界模糊。暂定，待 v0+ 验证后可议。

### 2.7 Helper

**核心行为**: 产品首席客服 / AI 上下文诊断 / 会话覆盖检查 / 迁移摘要 / 压缩建议

| 资产类型 | 资产 | Source |
| --- | --- | --- |
| Skill | help-onboarding | 🆕（AI Builder OS 使用引导） |
| Skill | help-context-diagnose | 🆕（Asset 是否存在/可见/加载/触发/覆盖/执行） |
| Skill | help-session-transfer | 🆕（会话迁移摘要生成） |
| Skill | manage-eval-session | 🆕（共享） |
| Skill | evolve-memory | 🆕（共享） |
| Kernel | Memory 4 类 schema | 📥 borrow（claude-code G12） |

### 2.8 共享 Skills（cross-Agent）

| Skill | 主要使用者 | Source | 桶 |
| --- | --- | --- | --- |
| manage-prompt | Supervisor / Writer / 全部 | 📥 ECC | manage |
| manage-grill | Supervisor / Researcher | 📥 mattpocock | manage |
| manage-brainstorm | Supervisor / Researcher / Writer | 📥 superpowers | manage |
| manage-file | 全部 | 🆕 | manage |
| discover-research | 全部研究类 / Writer | 🆕 | discover |
| craft-test-case | Researcher / Builder / Reviewer | 🆕 | craft |
| evolve-memory | Supervisor / Evolver / Helper | 🆕 | evolve |
| manage-eval-session | Supervisor / Helper | 🆕 | manage |
| build-component | Builder / Evolver | 🆕 | build（新开发） |
| evolve-component | Evolver | 🆕 | evolve（沉淀复用） |
| craft-spec | Researcher / Builder | 🔁 v1 builder-spec | craft |
| craft-prototype | Builder | 🔁 v1 builder-prototype | craft |
| craft-agent-task | Builder | 🔁 v1 builder-agent-task | craft |
| craft-decision | Builder / Researcher / Supervisor | 🔁 v1 builder-decision | craft |

### 2.9 Kernel 通用 Packets / Gates / Protocols（不分 Agent）

| 元素 | Source | 备注 |
| --- | --- | --- |
| Intent Packet | 🟢 keep（v1 Meta_Kim） |  |
| Output Packet + 6 元数据 | 🟢 + 📥 P3-02 + D10 | confidence / cost / format / risk / citations / **audience** |
| Evidence Packet | 🟢 keep |  |
| Iron Law | 🟢 keep |  |
| delivery_mode | 🟢 keep |  |
| branch state | 🟢 keep |  |
| change contract | 🟢 keep |  |
| definition drift | 🟢 keep |  |
| Swiss Cheese 5 层护栏 | 📥 P3-05 |  |
| Skill frontmatter 8 字段 | 📥 P3-01 + D8 补强 | name / description / can-invoke / paths / status / owner_agent / shared_with / scope（详见 §2.0） |

**Output Packet 6 元数据契约（D10 强化）**:

| 字段 | 类型 | 允许值 | 含义 |
| --- | --- | --- | --- |
| `confidence` | enum | `low` / `medium` / `high` | Agent 对本次输出的置信度 |
| `cost` | enum | `low` / `medium` / `high` | 模型调用 + 工具调用的累计成本量级 |
| `format` | enum | `text` / `markdown` / `code` / `json` / `html` / `pdf` / `slides` | 输出载体类型 |
| `risk` | enum | `none` / `reversible` / `destructive` | 是否触及红线（Destructive 必须人类确认） |
| `citations` | list[string] | 路径或 URL | 引用的来源证据 |
| `audience` | enum | `human` / `agent` / `dual` | 输出面向对象（D10） |

> `audience` 来自灵魂特质 #10「用户思维与体验品牌」的推论：Human-facing 输出（PRD/文章/UI）需考虑用户语言；Agent-facing 输出（task pack/spec/handoff）需考虑可机读；Dual 同时满足两者。Audience 决定 Skill 调用哪个 Template 子集。

### 2.10 Memory 4 类分类（rewrite）

| 类型 | 用途 | 触发写入 |
| --- | --- | --- |
| user | 用户偏好、quirks、沟通方式 | Supervisor 检测到偏好时 |
| feedback | 纠错、用户对 AI 输出的反馈 | 任何 Agent 接受 correction 时 |
| project | 项目状态、活跃任务、关键决策 | 任务执行过程中 |
| reference | 外部链接、文档路径、Key_Models | 研究类任务完成时 |

**硬约束**:
- MEMORY.md ≤ 200 行（超出截断）
- 每条记忆带 source 标注
- 漂移警告字符串（borrow G12）
- 详细内容下沉到 topic file

### 2.11 Skill 桶分布与 Source 统计

*按桶分布（共 55 项候选 Skill；Step 3-B 后实际建设 48 项，差异为合并：craft-requirements→craft-spec / write-extract- 5→1 / evolve-doc-check+evolve-kb-check→evolve-harness-audit 子模式）**:

| 桶 | 数量 | 代表 Skill |
| --- | --- | --- |
| discover-* | 4 | discover-research / competitive / persona / data |
| craft-* | 11 | craft-spec / prototype / agent-task / wireframe / stories / domain / architecture / test-case / decision / handoff / requirements |
| review-* | 6 | review-doc / code / ui / prototype / e2e / eval |
| build-* | 3 | build-ui / commit / component |
| evolve-* | 10 | evolve-skill / rules / agent / command / loop / workflow / component / memory / harness-audit（含 type=docs/kb/skills/memory/full）/ skill-health |
| write-* | 13 | write-research / outline / draft / polish / content / repurpose / style / publish / extract-article / extract-book / extract-wechat / extract-youtube / extract-arxiv |
| manage-* | 5 | manage-prompt / grill / brainstorm / file / eval-session |
| help-* | 3 | help-onboarding / context-diagnose / session-transfer |

> **矫正 ChatGPT Risk 2**：62 项是"候选全集"，**P0 实际只落地 ≤12 项**（见 §2.15）。任何 Skill 必须先通过 Deletion Test（"不做会怎样？"）才能升 P0。

**按 Source 分布**:

| Source | 数量 | 备注 |
| --- | --- | --- |
| 🟢 keep（v1 保留，rename） | 23 | 含 pm-writer-* rename 为 write-* |
| 🔁 redistribute（v1 再分配） | 11 | builder-* 拆解后重新归桶 |
| 🆕 new（新建） | 14 | 含 help-* 3 项 + evolve-harness-audit 等 |
| 📥 borrow（外部借鉴） | 14 | ECC / mattpocock / superpowers / claude-code |
| ❌ drop（删除） | 0 |  |

### 2.12 已确认决策补录（D6-D10）

| # | 决策 | 状态 |
| --- | --- | --- |
| D6 | evolve-memory 单一 Skill（写入 + 熵减合一），不拆 | ✅ 确认 |
| D7 | pm-writer-evolve → write-repurpose（暂定，避免与 evolve-* 桶冲突） | ⏳ 暂定 |
| D8 | **P0 压缩为 5 Agent**（Supervisor / Researcher / Builder / Reviewer / Evolver）；Writer / Helper 降级为 Skill bucket（manage-write / help-*），由 Supervisor 按需路由调用 | ✅ 确认 |
| D9 | **Evolver Iron Law** 采纳（全文见 §2.14） | ✅ 采纳 |
| D10 | **Output Packet 元数据 5 → 6 项**，新增 `audience: human/agent/dual` | ✅ 确认 |
| D11 | **evolve-doc-check + evolve-kb-check 合并入 evolve-harness-audit 子模式**（type=docs / type=kb）；既有 doc-consistency-check / kb-health-check skill 内容保留为 references/{doc,kb}-checklist.md；与 D6 evolve-memory 单一化逻辑一致 | ✅ 确认 |
| D12 | **吸收 mattpocock writing-great-skills 为 vNext skill 写作规范 source of truth**：§2.0 `disable-model-invocation` 升级为第 9 必填字段 + description 三规则（前置 leading word / 一个 branch 一个 trigger / 删 body 重复 identity）；§2.21 step-based skill 必含 completion criterion；§2.18 新增 B15 borrow；§2.5 evolve-skill 把 11 leading words + 4 failure modes 作为 acceptance check + 审计维度；中文细则沉淀 `references/skill-authoring.md`（Step 3-D 后）；新增 §2.24 完整落地 | ✅ 确认 |

### 2.13 灵魂特质 → 架构层级落地映射

来源于用户提供的"灵魂特质"图（14 项产品哲学），按"应在哪里被强制执行"映射到 5 层：

| # | 灵魂特质 | 落地层 | 实现方式 |
| --- | --- | --- | --- |
| 1 | 默认最小可行路径 | L1 Iron Law | Iron Law 第 1 条；复杂方案必须解释必要性 |
| 2 | 目标更新（执行 > 展示） | L1 Iron Law + L9 Adapter | Iron Law 第 2 条；Adapter 提供 "执行型" 默认 mode |
| 3 | 真相优先（质问不清晰） | L0 Supervisor 入口 + manage-grill Skill | 不清晰意图进入 grill 模式 |
| 4 | 目标驱动（以终为始） | L1 Kernel Intent Packet | Intent Packet 必填 `goal` + `done_criteria` |
| 5 | 结构化思考（麦肯锡 7 步法 + MECE） | L0 Supervisor + 所有 Skill body 模板 | Output 强制结构化字段（背景/目标/范围/约束/风险/决策/任务/验收/下一步） |
| 6 | Document 交付（md 优先，可转 word/pdf/excel/html） | L9 Adapter + Output Packet.format | format 字段允许 markdown/word/pdf/excel/html/slides |
| 7 | Prototype 交付 | L0 Builder Agent + craft-prototype Skill | Builder 默认 P0 能力 |
| 8 | Product 交付（11 子项：Frontend/Backend/API/Database/Auth/Storage/Deployment/Env Config/Observability/Test-QA/Release Notes） | L0 Builder Agent + build-* 桶 | 11 子项作为 build-* 桶子分类的检查清单，非 11 个 Skill |
| 9 | PPT（不常用） | Output Packet.format=slides | 不独立成桶 |
| 10 | 用户思维与品牌体验（Taste / Human-facing vs Agent-facing） | L1 Output Packet.audience 字段（D10） | audience=human 走用户语言模板；agent 走可机读模板 |
| 11 | 认真负责 | L3 Harness Swiss Cheese 5 层护栏 | 多层叠层防御 |
| 12 | 自动识别吸收 | L0 Supervisor 路由 + L4 Memory feedback 类 | Supervisor 主动识别可用 borrow；feedback memory 触发沉淀 |
| 13 | 持续自我改进 | L0 Evolver Agent + Meta-Review Loop | Evolver 主职责 |
| 14 | 可用体例（AGENTS.md / CLAUDE.md / Instructions） | L1 Kernel 协议 + L7 References | Kernel 协议写为 AGENTS.md；Instructions 由 Skill body 承载 |

**P0 落地优先级**: #1, #4, #5, #10 是 P0 必须显性化的灵魂特质；#6-#8 通过 Builder/Researcher Skill 间接实现；#11 由 Harness 兜底；其余在 P1 渐进。

### 2.14 Evolver Iron Law（D9）

> **Evolver 在创建任何新资产（skill / rule / agent / command / loop / workflow / component / memory）之前，必须先证明：**
>
> 1. **不能复用** — 现有资产已经覆盖了哪些场景？为什么不直接调用？
> 2. **不能合并** — 是否可以并入某个已有资产？
> 3. **不能降级** — 是否可以作为某个 Skill 的子模式（sub-mode），而非独立 Skill？
> 4. **不能归档** — 是否可以触发 archive 流程，先清理再决定？
> 5. **不能澄清** — 是否因为意图不清才觉得需要新资产？澄清后是否还必要？
>
> **任何 global 级别（影响多个项目或全局 harness）的改动，必须人类确认后才执行。**
>
> 违反任意一条即应拒绝创建。Evolver 自检表（写入 Skill body）：

```yaml
create_gate:
  - prove_no_reuse: [列出已有候选 + 不满足的理由]
  - prove_no_merge: [列出可并入资产 + 不能并入的理由]
  - prove_no_demote: [子模式化尝试 + 失败原因]
  - prove_no_archive: [归档清单检查结果]
  - prove_no_clarify: [意图澄清对话记录]
  - scope: project | global   # global 必须 human-confirm
```

### 2.15 P0 最小闭环定义

**P0 目标**: 用户一句话请求 → Supervisor 路由 → 某个 Agent 执行 → 输出符合 6 元数据契约的 Packet → 写回 Memory（如有 feedback）。验证 7 个 Agent 设计的"骨架能跑通"。

**P0 Agent 列表（5 个）**:

| # | Agent | P0 职责 |
| --- | --- | --- |
| 1 | Supervisor | 意图识别 / 路由 / Answer/Ask/Grill |
| 2 | Researcher | craft-spec + discover-research |
| 3 | Builder | craft-prototype + build-commit |
| 4 | Reviewer | review-doc + review-code |
| 5 | Evolver | evolve-memory + evolve-skill（含 Iron Law D9） |

> Writer / Helper 不进入 P0，其能力暂时由 Supervisor 通过 manage-write / help-* Skill 兜底（grade=P2）。

**P0 Skill 候选清单（≤12 项，每项必须通过 Deletion Test）**:

| 桶 | Skill | grade | 必要性 |
| --- | --- | --- | --- |
| manage | manage-prompt | P0 | 所有 Agent 共用，提升输入质量 |
| manage | manage-grill | P0 | Supervisor 澄清意图必备 |
| manage | manage-file | P0 | 所有 Agent 共用 |
| discover | discover-research | P0 | Researcher 核心 |
| craft | craft-spec | P0 | Researcher/Builder 共用，最高频产出 |
| craft | craft-prototype | P0 | Builder 核心 |
| craft | craft-agent-task | P0 | Supervisor 任务分派必备 |
| review | review-doc | P0 | Reviewer 核心 |
| review | review-code | P0 | Builder 自检 + Reviewer 主用 |
| build | build-commit | P0 | Builder 闭环必备 |
| evolve | evolve-memory | P0 | Memory 4 类回写 |
| evolve | evolve-skill | P0 | Iron Law D9 已就位；ADR 0002 事实纳入（2026-07-07） |

> 实际 P0 = 12 项 Skill + 5 Agent + 1 套 Kernel Packet（Intent/Output/Evidence/Iron Law/4 类 Memory schema）。

### 2.16 ChatGPT 评估采纳清单

ChatGPT 给出 8 项风险 + 7 项立即修正建议。逐项处理：

| # | ChatGPT 风险/建议 | 处理 | 落地位置 |
| --- | --- | --- | --- |
| C1 | Builder god-agent 风险（11 子项太重） | ✅ 采纳 | Builder 拆为 build-* 桶 + 多 Skill；Product 11 子项作为 build-* checklist 而非 11 个 Skill |
| C2 | 62 Skills 不应全部 P0 | ✅ 采纳 | §2.0 加 grade；§2.15 P0 上限 12 项 |
| C3 | craft / build / evolve 边界模糊 | ✅ 采纳 | §2.0 桶定义已明确：craft=产出文档/规格；build=实际编码；evolve=元资产沉淀 |
| C4 | Evolver 易失控 | ✅ 采纳 | §2.14 Iron Law（D9） |
| C5 | Memory ≤200 行不够 | ⏳ 部分采纳 | MEMORY.md 仍 200 行（索引）；扩展 schema 字段（type/scope/status/source/confidence/last_verified/detail_ref）下沉到 topic file |
| C6 | Output Packet 元数据无验收标准 | ✅ 采纳 | §2.9 给出 enum 值 |
| C7 | 14 项 borrow 需本地化验收 | ✅ 采纳 | Step 3-B 验证（每 borrow 项一张验收表） |
| C8 | 缺 Golden Task Suite | ✅ 采纳 | Step 4 启动 8 项 GT |

### 2.17 Step 3-B 验证 ① — Deletion Test（57 项 Skill）

> 先校正统计：§2.5 实际列 12 项 evolve-*（含 skill-health），§2.11 误写 11；总计实际 **57 项**（非 62）。本节做"不做会怎样"测试。
>
> 后果类别：**Lose**=删了核心能力损失；**Workaround**=可由其他 Skill 兜底；**Safe-drop**=可直接删。
> 推荐 grade 与 §2.15 P0 上限对齐。

| Skill | 不做会怎样 | 后果 | 推荐 grade |
| --- | --- | --- | --- |
| **discover-research** | Researcher 无研究入口；craft-spec 缺输入 | Lose | **P0** |
| discover-competitive | 竞品分析走 discover-research 兜底，质量降 | Workaround | P1 |
| discover-persona | 用户画像走 craft-spec 的子模式 | Workaround | P1 |
| discover-data | 数据分析走外部工具，Evolver 无数据基础 | Workaround | P2 |
| **craft-spec** | PRD/Mini Spec/Eng Request 全失效；Supervisor 任务分派无合同 | Lose | **P0** |
| **craft-prototype** | Builder 失去核心交付能力 | Lose | **P0** |
| **craft-agent-task** | Supervisor 任务分派无 agent-readable spec | Lose | **P0** |
| craft-wireframe | 并入 craft-spec 子模式（low-fidelity profile） | Workaround | P2 |
| craft-stories | 用户故事作为 craft-spec 子模板 | Workaround | P2 |
| craft-domain | 领域建模走 craft-architecture 兜底 | Workaround | P1 |
| craft-architecture | Builder 必备；缺失则技术方案无结构 | Lose | P1 |
| craft-test-case | Reviewer 必备；缺失则 review-e2e 无输入 | Lose | P1 |
| craft-decision | 决策记录走 evolve-memory 兜底（feedback 类） | Workaround | P2 |
| craft-handoff | runtime handoff 并入 craft-agent-task | Workaround | P3 |
| craft-requirements | **与 craft-spec 高度重叠** → 合并入 craft-spec 的 requirements profile | Workaround | **Drop / 合并** |
| **review-doc** | Reviewer 核心能力缺失 | Lose | **P0** |
| **review-code** | Builder 自检 + Code Review 失效 | Lose | **P0** |
| review-ui | 走 review-doc + 视觉规则补丁 | Workaround | P1 |
| review-prototype | 走 review-ui + review-e2e 组合 | Workaround | P1 |
| review-e2e | 启动期可由 review-code 兜底；P1 补 | Workaround | P1 |
| review-eval | AI Eval 是 P2 增强；启动期不做 | Workaround | P2 |
| build-ui | UI 实现 = Builder 主职责；缺失则只能 craft-prototype | Lose | P1 |
| **build-commit** | Builder 闭环（commit/merge/git）失效 | Lose | **P0** |
| build-component | 组件开发走 evolve-component 反向（先有代码再沉淀） | Workaround | P2 |
| evolve-skill | Evolver 失去核心元能力；Iron Law D9 无执行入口 | Lose | P0（ADR 0002 纳入） |
| evolve-rules | rules 创建走 evolve-skill 子模式 | Workaround | P2 |
| evolve-agent | agent 创建走 evolve-skill 子模式 | Workaround | P2 |
| evolve-command | command 创建走 evolve-skill 子模式 | Workaround | P3 |
| evolve-loop | loop 创建走 evolve-skill 子模式 | Workaround | P3 |
| evolve-workflow | workflow 创建走 evolve-skill 子模式 | Workaround | P3 |
| evolve-component | 组件沉淀走 evolve-skill + craft-test-case 兜底 | Workaround | P2 |
| **evolve-memory** | Memory 4 类无写入入口；feedback 类无法回写 | Lose | **P0** |
| evolve-harness-audit | harness 审计走 evolve-skill + manage-eval-session 组合 | Lose | P1（**含 doc-check/kb-check 子模式**） |
| evolve-skill-health | 借鉴 ECC skill-health；可推迟 | Workaround | P2 |
| write-research | Writer 流水线入口 | Lose | P2（Writer 在 P0 不上线） |
| write-outline | 写作流水线 | Lose | P2 |
| write-draft | 写作流水线 | Lose | P2 |
| write-polish | 写作流水线 | Lose | P2 |
| write-content | 写作流水线 | Lose | P2 |
| write-repurpose | 二创流水线 | Workaround | P3（暂定 D7） |
| write-style | 风格提取走 write-polish 子模式 | Workaround | P3 |
| write-publish | 发布流水线 | Lose | P2 |
| write-extract-article | 与 extract-book/wechat/youtube/arxiv 同类 → **合并为 write-extract** | Workaround | **Drop / 合并** |
| write-extract-book | 合并入 write-extract（type=book） | Workaround | **Drop / 合并** |
| write-extract-wechat | 合并入 write-extract（type=wechat） | Workaround | **Drop / 合并** |
| write-extract-youtube | 合并入 write-extract（type=youtube） | Workaround | **Drop / 合并** |
| write-extract-arxiv | 合并入 write-extract（type=arxiv） | Workaround | **Drop / 合并** |
| **manage-prompt** | 所有 Agent 输入质量降级 | Lose | **P0** |
| **manage-grill** | Supervisor 澄清意图失效 | Lose | **P0** |
| manage-brainstorm | 早期 idea 阶段走 manage-grill 兜底 | Workaround | P1 |
| **manage-file** | 所有 Agent 文件操作降级 | Lose | **P0** |
| manage-eval-session | 会话评估走 evolve-harness-audit 兜底 | Workaround | P1 |
| help-onboarding | Helper 不在 P0；走 README + AGENTS.md 兜底 | Workaround | P2 |
| help-context-diagnose | 走 evolve-doc-check 子模式 | Workaround | P2 |
| help-session-transfer | 走 evolve-memory 兜底（project 类） | Workaround | P2 |

**Deletion Test 结论**:

| 推荐 grade | 数量 | 说明 |
| --- | --- | --- |
| **P0** | 12 | 与 §2.15 一致 ✅ |
| P1 | 12 | 验证 P0 后立即补（含合并后的 evolve-harness-audit） |
| P2 | 17 | 长尾补完 |
| P3 | 6 | 仅记录 |
| **Drop / 合并** | 7 | craft-requirements → craft-spec；write-extract-* (5) → write-extract；evolve-doc-check + evolve-kb-check → evolve-harness-audit 子模式 |
| **校正后总数** | 55 - 7 = **48 项实际建设** | 7 项合并消减 |

> ChatGPT C2 风险（原标 62 项）经过 Deletion Test + doc/kb 合并已压缩到 **48 项实际建设 + 12 项 P0**。

### 2.18 Step 3-B 验证 ② — 14 项 borrow 验收表

> 每项 borrow 必须列出：来源 / 本地化改写要点 / 验证用例。未通过验收即降级或移除。

| # | borrow 项 | 来源 | 本地化改写要点 | 验证用例 |
| --- | --- | --- | --- | --- |
| B1 | adaptive probe_depth | T8 (Tessl) | 改写为 Intent Packet 字段 `probe_depth: shallow/medium/deep`；Supervisor 默认 shallow，2 轮无果升 medium | GT-01 模糊请求触发 deep probe |
| B2 | Action-First / NO_REPLY | G9 | Output Packet 增加 `reply_mode: action/no_reply`；no_reply 时只写 Memory 不回复 | 后台写 memory 场景 |
| B3 | 4 决策卡（router 前置） | T8 | Supervisor 入口先过 4 卡：scope/deadline/ambiguity/reversibility | GT-01 + GT-04 |
| B4 | Memory 4 类 schema | claude-code G12 | user/feedback/project/reference；扩展字段 type/scope/status/source/confidence/last_verified/detail_ref | evolve-memory 写 feedback 类 |
| B5 | Confidence Score | pm-skills-pop T2 | 输出 Packet.confidence enum（low/medium/high）+ 评分依据说明 | Researcher 输出 PRD 时必填 |
| B6 | citations + evidence_table | agent-handbook | Researcher / Writer 必须在文档末附 evidence_table（claim → 来源 URL/文件 + 可信度） | GT-02 PRD 必须有 citations |
| B7 | build-ui（UI 实现规范） | ui-ux-pro-max | 蒸馏为 ui-reasoning.csv 六元组（Pattern/Style Priority/Color Mood/Effects/Anti-Patterns/Decision Rules） | Builder P1 验证 |
| B8 | Swiss Cheese 5 层护栏 | P3-05 / T5 | 5 层：Intent / Plan / Output / Evidence / Meta-Review；每层至少 1 个 gate | P1 落地，先跑 Layer 1+3 |
| B9 | TDD-for-Skills | G6 | 每个 Skill 必须带 1+ 测试用例（Given/When/Then）；validator 在 skill load 时跑 | evolve-skill 创建时强制 |
| B10 | First Run vs Subsequent | G11 | Skill frontmatter 加 `first_run_behavior` 字段；首次调用走 onboarding 路径 | help-onboarding P2 验证 |
| B11 | HALO 3 型诊断 | G2 | Reviewer 输出 review 时分类：hallucination/omission/misalignment | review-doc / review-eval |
| B12 | Hybrid Eval 双层 | G3 / T4 | 双层：Layer A 单 Skill 评判 / Layer B 跨 Skill 评判；P1 落地 | review-eval P2 |
| B13 | Rationalization Table | G7 | Reviewer 必须给出"如果否决，理由映射到哪个 HALO 类" | GT-05 review gate |
| B14 | Deletion Test | G10 | 已应用于 §2.17（每 Skill 必填"不做会怎样"） | evolve-skill 创建时强制 |
| B15 | writing-great-skills 11 leading words + frontmatter/description/completion-criterion 规范 | mattpocock/skills | 吸收为 skill 写作规范的 source of truth（D12）；§2.0 已落地 9 字段 + description 三规则；中文细节沉淀至 `references/skill-authoring.md`；evolve-skill 把这 11 项作为 acceptance check 与审计维度 | 新建/审计任意 skill 时强制对齐；evolve-skill 调用时引用 |

> **矫正 ChatGPT C7**：14 项 borrow 已全部列验收用例，未通过的降级或移除。B8 / B12 标记为 P1（不在 P0 强制）。

### 2.19 Step 3-B 验证 ③ — MECE 反向测试

> 找跨桶 / 同桶内的边界反例，提出合并或拆分建议。

| # | 反例候选 | 类型 | 边界差异分析 | 修正建议 |
| --- | --- | --- | --- | --- |
| M1 | craft-spec vs craft-requirements | 同桶冗余 | 二者都是"产出文档/规格"。requirements 更偏用户需求收集，spec 偏技术规格 | **合并**：craft-requirements → craft-spec 的 profile=requirements |
| M2 | write-extract-* (5 项) | 同桶冗余 | 5 个 extract 仅 type 参数不同（article/book/wechat/youtube/arxiv） | **合并**：单 `write-extract` + type 参数；body 内分支 |
| M3 | evolve-doc-check vs evolve-kb-check vs evolve-harness-audit | 同桶三层冗余 | doc-check 检查文档/代码一致性；kb-check 检查知识库索引完整性；harness-audit 是宏观审计。doc/kb 是 harness 的子维度 | **合并**：evolve-doc-check + evolve-kb-check → evolve-harness-audit 的 type=docs / type=kb 子模式；既有 skill 内容保留为 references/{doc,kb}-checklist.md（D11 采纳） |
| M4 | evolve-component vs build-component | 跨桶模糊 | build=新开发组件；evolve=从已有代码沉淀。理论上方向相反 | **保留分离**：clear direction-difference，符合 §2.0 桶定义 |
| M5 | craft-prototype vs build-ui | 跨桶模糊 | craft-prototype 产出 mock-data 高保真原型；build-ui 产出可部署 UI 代码 | **保留分离**：是否带 mock data 是分界线（prototype=yes, build=no） |
| M6 | craft-test-case vs review-e2e | 跨桶模糊 | craft-test-case=设计测试用例；review-e2e=执行 e2e 测试 | **保留分离**：design vs execution，符合 craft vs review 桶定义 |
| M7 | evolve-memory vs evolve-skill | 同桶模糊 | memory 写入知识/反馈；skill 创建能力。可能"记忆即隐式 skill" | **保留分离**：触发条件不同（事件驱动 vs 显式创建），合并违背 D9 Iron Law |
| M8 | craft-handoff vs craft-agent-task | 同桶冗余 | handoff=任务交接文档；agent-task=agent-readable spec | **合并**：craft-handoff → craft-agent-task 的 phase=handoff 子模式 |
| M9 | §2.5 (12 项 evolve-*) vs §2.11 (11 项) | 文档不一致 | evolve-skill-health 在 §2.5 列出但 §2.11 漏数 | **校正 §2.11 为 12 项；总数 57**（已在 §2.17 标注） |
| M10 | manage-eval-session vs evolve-harness-audit | 跨桶模糊 | eval-session=会话级评估；harness-audit=项目级审计 | **保留分离**：scope 不同（session vs project），符合 §2.0 桶定义 |

**MECE 测试结论**:
- **3 项合并**：M1 craft-requirements → craft-spec；M2 write-extract-* (5) → write-extract；M8 craft-handoff → craft-agent-task
- **5 项保留分离**（边界清晰，符合 §2.0 桶定义）
- **1 项校正**：§2.11 数量与 §2.5 不一致，需修正
- **校正后实际建设 = 57 - 5（M2 合并省 4 + M1/M8 合并省 2 + 新增 write-extract 1） = 51 项**

> **Step 3-B 总结论**：Deletion Test + MECE 合并消减，从 57 项 → 51 项实际建设；P0 仍 11 项稳定；14 项 borrow 全部带验收用例。可以进入 Step 3-C P0 闭环契约定义。

### 2.20 Step 3-C ① — P0 Agent 契约（5 个）

**通用契约字段**（每个 Agent frontmatter 必填）：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `name` | string | Agent 唯一标识 |
| `role` | string | 一句话定位 |
| `intent_triggers` | list | 触发条件（关键词/显式调用/默认路由） |
| `can_invoke` | list | 可调用的 Agent / Skill / Tool 白名单 |
| `output_contract` | ref | 输出 Packet 契约（Intent/Output/Evidence） |
| `on_fail` | object | 失败兜底（澄清/spec 缺失/能力边界） |
| `handoff_to` | list | 完成后可交接的 Agent |
| `forbidden` | list | 禁止行为（边界约束） |

#### Agent 1 — Supervisor

```yaml
name: supervisor
role: 总控、意图识别、任务分解与分派、按需 Answer/Ask/Grill/Plan/Goal
intent_triggers:
  - default_route: true          # 用户未显式指定 Agent 时默认入口
  - keywords: [help, 调研, 实现, 审查, 改进, 写]
can_invoke:
  - Researcher
  - Builder
  - Reviewer
  - Evolver
  - manage-prompt
  - manage-grill
  - manage-file
  - manage-eval-session
  - evolve-memory                # 写 user/feedback 类
output_contract: Output Packet (audience=human, format=markdown)
on_fail:
  intent_unclear: enter manage-grill
  no_target_agent: fallback to Answer mode
handoff_to: [Researcher, Builder, Reviewer, Evolver]
forbidden:
  - 直接执行 craft-* / build-* / review-*  # 必须分派给专责 Agent
  - 跳过 Intent Packet 直接产出
```

#### Agent 2 — Researcher

```yaml
name: researcher
role: 研究、调研、文档交付（PRD/Mini Spec/Eng Request/竞品/用户画像）
intent_triggers:
  - keywords: [研究, 调研, 竞品, 画像, PRD, spec, 需求文档]
can_invoke:
  - discover-research
  - craft-spec
  - manage-file
  - manage-grill                 # 用于澄清 spec scope
  - evolve-memory                # 写 reference 类
output_contract: Output Packet (audience=dual, format=markdown, citations=required)
on_fail:
  info_insufficient: handoff to Supervisor for grill
  scope_too_large: split into multiple craft-spec calls
handoff_to: [Builder, Reviewer]
forbidden:
  - build-*                      # 不写代码
  - review-*                     # 不评审
  - write project 类 Memory      # 仅 user/feedback/reference 类
```

#### Agent 3 — Builder

```yaml
name: builder
role: 高保真原型 + 全栈应用 + commit；UI/UX + FDE + 架构 + 前后端
intent_triggers:
  - keywords: [原型, prototype, 实现, 编码, build, 提交, commit, 组件]
  - received_craft_spec: true    # 接收 Researcher 的 spec 后触发
can_invoke:
  - craft-prototype
  - build-commit
  - craft-agent-task             # 接收（用于理解任务）
  - manage-file
  - evolve-memory                # 写 project 类（branch state）
output_contract: Output Packet (audience=dual, format=code, risk=reversible|destructive)
on_fail:
  spec_unclear: handoff back to Researcher via Supervisor
  capability_limit: handoff to Supervisor for human-escalation
handoff_to: [Reviewer, Supervisor]
forbidden:
  - 主动 craft-spec              # 必须由 Researcher 产出
  - review-* 主动                # 仅允许 self-check
  - skip build-commit on completion
```

#### Agent 4 — Reviewer

```yaml
name: reviewer
role: 文档/代码评审；守护需求-文档-交付一致性；可触发 PRD 更新
intent_triggers:
  - keywords: [审查, review, 检查, 测试, 走查]
can_invoke:
  - review-doc
  - review-code
  - craft-test-case              # 接收（生成测试用例）
  - evolve-memory                # 写 feedback 类
output_contract: Evidence Packet (HALO 分类 + Rationalization Table)
on_fail:
  spec_missing: handoff to Supervisor → Researcher for craft-spec
  conflict_with_decision_log: escalate to human
handoff_to: [原交付 Agent（Builder/Researcher）, Supervisor]
forbidden:
  - craft-* 主动                 # 不写交付物
  - build-*                      # 不写代码
  - 直接合并代码                  # 仅给 merge 建议，由 Builder 执行 build-commit
```

#### Agent 5 — Evolver

```yaml
name: evolver
role: Harness 元资产（skill/rule/agent/command/loop/workflow/component/memory）维护 + Memory 熵减
intent_triggers:
  - keywords: [创建 skill, 改进, 沉淀, audit, 健康检查, memory 清理]
can_invoke:
  - evolve-skill
  - evolve-memory
  - evolve-harness-audit         # 含 type=docs/kb/skills/memory/full
  - manage-eval-session
output_contract:
  - Output Packet (audience=agent)
  - Iron_Law_Self_Check: required YAML  # §2.14 D9
on_fail:
  iron_law_violation: refuse creation, output reject_reason
  global_scope_change: MUST wait for human confirmation
handoff_to: [Supervisor]
forbidden:
  - 跳过 Iron Law 自检
  - 未经人类确认改 global scope 资产
  - 删除 _index.md / _glossary.md / _memory.md 等系统文件
```

### 2.21 Step 3-C ② — P0 Skill Frontmatter（12 项）

> 每项填齐 §2.0 规定的 9 必填字段 + grade。`status` 默认 `draft`，验证后升 `stable`。
>
> **D12 硬要求**：含 step 的 skill 必须为每个 step 标注 `completion-criterion`（可检查 + 必要时穷尽）；纯 reference 类 skill 可豁免。详情见 §2.24。
>
> **Step D 清理说明（追溯：`vnext/references/codex-step-b-review-feedback.md` §C.1 / §C.2）**：P0 目录树只生成 12 个 P0 Skill 文件；`can-invoke` 可以保留已分级的 P1+ Skill 前向引用作为演化钩子，但不得把该引用计入 P0 文件清单。Writer / Helper 已按 D8 降级为 Skill bucket，不再作为 P0 Agent 出现在 `shared_with`。
>
> **语言策略说明**：P0 SKILL 正文以中文为主；英文契约层（frontmatter 字段名、Section heading、leading word、Failure Mode signal name 等）规格见 `vnext/references/skill-authoring.md §13`。下方 description 字段采用"英文首词 + 中文主体"格式，遵循 §13.5 公式。

```yaml
# 1. manage-prompt
name: manage-prompt
description: "Context Pointer 当用户输入模糊、过载或路由错位时触发；目标、范围或 Agent 边界隐式时失败。"
can-invoke: []
paths: []
status: draft
owner_agent: shared
shared_with: [Supervisor, Researcher, Builder, Reviewer, Evolver]
scope: global
grade: P0

# 2. manage-grill
name: manage-grill
description: "User-Invokable 当用户调用 /manage-grill、或要求对方案/决策进行苏格拉底式挑战时触发；挑战未覆盖 5 类问题维度、或给出结论性判断时失败。"
can-invoke: [manage-prompt]
paths: []
status: draft
owner_agent: Supervisor
shared_with: [Researcher]
scope: global
grade: P0

# 3. manage-file
name: manage-file
description: "Context Pointer 当文件操作请求落在 30_Projects/ 或 40_Content/ 范围、涉及创建/移动/重命名/归档时触发；目标路径越界、命名违规或并行 active 版本未拒绝时失败。"
can-invoke: []
paths: ["**"]                    # 受 Agent can_invoke paths 二次约束
status: draft
owner_agent: shared
shared_with: [Supervisor, Researcher, Builder, Reviewer, Evolver]
scope: project
grade: P0

# 4. discover-research
name: discover-research
description: "Knowledge Gateway 当用户引用的方法论/案例/工具在 10_Library 中可能存在对应条目时触发；未检索直接输出方案、或检索到但未引用时失败。"
can-invoke: [manage-file]
paths: []
status: draft
owner_agent: Researcher
shared_with: [Writer, Supervisor]
scope: project
grade: P0

# 5. craft-spec
name: craft-spec
description: "One-Click Trigger 当用户显式调用 /craft-spec 或要求产出 PRD/tech-spec/spec 时触发；缺少决策记录、或产出未遵循 §2.21 frontmatter 规范时失败。"
can-invoke: [discover-research, manage-file]
paths: ["30_Projects/**", "40_Content/**"]
status: draft
owner_agent: Researcher
shared_with: [Builder]
scope: project
grade: P0

# 6. craft-prototype
name: craft-prototype
description: "One-Click Trigger 当用户要求产出高保真原型、可交互 demo 时触发；原型不可运行、或未配套验证步骤时失败。"
can-invoke: [manage-file, craft-spec]
paths: ["30_Projects/**/_sandbox/**", "**/prototype/**"]
status: draft
owner_agent: Builder
shared_with: []
scope: project
grade: P0

# 7. craft-agent-task
name: craft-agent-task
description: "One-Click Trigger 当用户要求为 Agent 产出可执行任务包（task pack）时触发；任务包缺少 Intent/Evidence/Output Packet、或未通过验收时失败。"
can-invoke: [manage-file]
paths: []
status: draft
owner_agent: Supervisor
shared_with: [Builder]
scope: project
grade: P0

# 8. review-doc
name: review-doc
description: "Routing Rule 当产出文档（PRD/spec/decision log）请求评审时触发；评审未对照项目 decision_log、或未输出结构化意见时失败。"
can-invoke: [craft-test-case, evolve-memory]
paths: []
status: draft
owner_agent: Reviewer
shared_with: []
scope: project
grade: P0

# 9. review-code
name: review-code
description: "Routing Rule 当代码变更请求评审、或 commit 前自检时触发；未对照 spec 验收、或忽略红线时失败。"
can-invoke: [craft-test-case, evolve-memory]
paths: ["**/*.{ts,tsx,js,jsx,py,go,rs,java}"]
status: draft
owner_agent: Reviewer
shared_with: [Builder]
scope: project
grade: P0

# 10. build-commit
name: build-commit
description: "Routing Rule 当用户请求代码实现、功能开发、bug 修复时触发；实现未匹配 spec、或未通过 typecheck/lint/test 时失败。"
can-invoke: [manage-file]
paths: ["**"]
status: draft
owner_agent: Builder
shared_with: []
scope: project
grade: P0

# 11. evolve-memory
name: evolve-memory
description: "Routing Rule 当用户任务完成、Session 接近 compact、或产出含可复用模式信号时触发；未写回 memory、或写入违反 §2.26 schema 时失败。"
can-invoke: []
paths: ["**/memory/**", "**/MEMORY.md"]
status: draft
owner_agent: Evolver
shared_with: [Supervisor, Builder, Reviewer]
scope: global
grade: P0
```

### 2.22 Step 3-C ③ — Memory 4 类 Schema

**通用 schema**（每条 Memory 必填，缺失即 reject）：

```yaml
# Memory 通用 schema
id: mem_<timestamp>_<short_hash>   # 全局唯一
type: user | feedback | project | reference
scope: global | project | session
status: active | superseded | archived
source:
  session_id: <uuid>
  timestamp: <ISO 8601>
  agent: <Agent name>
confidence: low | medium | high
last_verified: <ISO date>
detail_ref: <path to topic file>  # 必填，超出 1 行的内容下沉
content: <≤1 行摘要，≤200 chars>
```

**4 类触发与示例**：

| type | 触发 | 示例 | 写入 Agent |
| --- | --- | --- | --- |
| **user** | 检测到用户偏好/quirks/沟通方式 | "用户偏好表格 > 列表 > 段落" | Supervisor（主） / 任何 Agent |
| **feedback** | 用户纠正 AI 输出 / 显式反馈 | "上次输出的 X 方案有 Y 问题，应改 Z" | 任何 Agent 接收 correction 时 |
| **project** | 项目状态变更 / 关键决策 / 里程碑 | "PMS Phase 3D 完成，文件拆分 2381→235+7" | Builder / Supervisor |
| **reference** | 研究完成 / 外部链接发现 | "FDE Cookbook 路径：10_Library/..." | Researcher（主） / Writer |

**硬约束**:
- `MEMORY.md` ≤200 行（超出截断）；详细内容必须 `detail_ref` 指向 topic file
- 同主题已有 Memory 时 → merge / supersede，不重复创建
- `global` scope 改动必须人类确认（与 D9 Iron Law 一致）
- 漂移警告：`last_verified` 超 90 天 → Evolver 标 stale，提醒验证

**反模式（Evolver 自检 reject）**:
- ❌ 把 session 临时状态写 project 类（应直接对话回复）
- ❌ detail_ref 缺失（超出 1 行内容直接塞 content）
- ❌ 同主题创建第 2 条而非 merge（违反 D9 复用原则）

### 2.23 Step 3-C ④ — Kernel Packet 模板

#### Intent Packet（Supervisor 入口必填）

```yaml
intent_packet:
  raw_input: <用户原始输入>
  probe_depth: shallow | medium | deep   # B1 borrow: adaptive probe_depth
  parsed:
    goal: <一句话目标>
    done_criteria:                       # 灵魂特质 #4: 目标驱动
      - <可验证条件 1>
      - <可验证条件 2>
    scope: project | session | global
    ambiguity_flags: [...]               # 触发 manage-grill 的标志
  decision_card:                         # B3 borrow: 4 决策卡
    scope_fit: in_scope | out_of_scope | needs_clarify
    deadline: none | <ISO date>
    reversibility: reversible | destructive  # 决定是否需人类确认
  reply_mode: action | no_reply          # B2 borrow: Action-First / NO_REPLY
  routing:
    target_agent: <Agent name>
    skills_needed: [...]
  created_at: <ISO 8601>
```

#### Output Packet（所有 Agent 出口必填）

```yaml
output_packet:
  agent: <Agent name>
  intent_packet_id: <ref>
  content: <输出主体>
  metadata:                              # §2.9 D10: 6 元数据
    confidence: low | medium | high      # B5 borrow
    cost: low | medium | high
    format: text | markdown | code | json | html | pdf | slides
    risk: none | reversible | destructive
    citations: [<path or URL>, ...]      # B6 borrow
    audience: human | agent | dual       # D10
  evidence_packet_id: <ref, 可选>        # Reviewer 必填
  next_actions:                          # handoff 提示
    - agent: <Agent name>
      skill: <skill name>
      reason: <一句话>
  created_at: <ISO 8601>
```

#### Evidence Packet（Reviewer 主用）

```yaml
evidence_packet:
  reviewer_agent: <Reviewer name>
  target_output_id: <ref>
  halo_diagnosis:                        # B11 borrow: HALO 3 型
    hallucination: [<issue>...]
    omission: [<issue>...]
    misalignment: [<issue>...]
  rationalization_table:                 # B13 borrow
    - issue: <描述>
      halo_type: hallucination | omission | misalignment
      severity: P0 | P1 | P2
      fix_suggestion: <建议>
  deletion_test_applied: bool            # B14 borrow
  model_isolation: bool                  # §2.4 模型隔离原则
  created_at: <ISO 8601>
```

#### Iron Law（L1 全局，每个 Agent 入口校验）

```yaml
iron_law:
  version: vnext-1.0
  rules:
    - id: IL-01
      rule: 默认最小可行路径；复杂方案必须解释必要性
      soul_trait_ref: "#1 默认最小可行路径"
    - id: IL-02
      rule: 没有目标，不进入计划；没有验收标准，不进入实现；没有证据，不宣称完成
      soul_trait_ref: "#4 目标驱动 + #11 认真负责"
    - id: IL-03
      rule: 不静默吞错；不绕过 hook（绝不 --no-verify）；找根本原因
      soul_trait_ref: "#11 认真负责"
    - id: IL-04
      rule: 同一问题连续修复失败 3 次后停手，等人决策
      soul_trait_ref: "#11 认真负责"
    - id: IL-05
      rule: 文档交付必须有摘要；方案交付必须说明取舍；代码交付必须有验证
      soul_trait_ref: "#5 结构化思考 + #6 Document 交付"
    - id: IL-06
      rule: 输出必须带 6 元数据（含 audience）；缺失元数据视为未完成
      soul_trait_ref: "#10 用户思维（D10）"
    - id: IL-07
      rule: Evolver 创建新资产前必须通过 5 道自检（D9）
      soul_trait_ref: "#13 持续自我改进"
    - id: IL-08
      rule: global scope 改动必须人类确认（与 D9 一致）
      soul_trait_ref: "#11 认真负责"
  enforcement: harness_gate             # 由 L3 Swiss Cheese 5 层护栏强制
```

> **闭环验证**：5 Agent + 12 P0 Skill + Memory 4 类 + 4 Kernel Packet = P0 最小闭环可执行。下一步 Step 3-D 基于此生成 P0 目录树。

---

### 2.24 Step 3-C ⑤ — Skill 写作规范（mattpocock 吸收 / D12）

> **来源**：`10_Library/13_Open_Source_Reference/mattpocock_skills/skills/productivity/writing-great-skills/`（SKILL.md + GLOSSARY.md，2026-07-05 本地化）
> **决策**：D12 — 吸收为 vNext skill 写作规范的 source of truth。本节是工作语言的浓缩；细节中文释义沉淀至 `references/skill-authoring.md`，由 evolve-skill 维护。

#### 2.24.1 根 virtue — Predictability

Skill 的存在是为了从随机系统中挤出确定性。**Predictability** = agent 每次跑同一个 skill 走同一个 *process*，而不是产出同一个 output（brainstorming skill 应该 predictably 发散——token 变，行为不变）。下面所有 11 个 leading word 都是 Predictability 的杠杆；cost 与 maintainability 是它的症状，不是对手。

#### 2.24.2 11 个 leading words（按 4 轴）

| 轴 | Leading word | 一句话定义 | 在 vNext 的落地 |
| --- | --- | --- | --- |
| **Invocation** | Model-Invoked | 保留 `description`，模型可自调用；付 **context load**（描述常驻窗口） | vNext 默认；`disable-model-invocation: false` 或缺省 |
| **Invocation** | User-Invoked | 剥除 description 对模型的可见性，仅人类可调；零 context load，付 **cognitive load** | vNext 设 `disable-model-invocation: true` |
| **Invocation** | Description | 模型可读触发器；model-invoked skill 唯一强制常驻 context 的字段 | §2.0 第 9 必填字段；写作三规则见 §2.0 |
| **Invocation** | Context Pointer | 在 context 中持有的"指向外部资料 + 触发条件"的引用；**指向目标的措辞**（不是目标本身）决定到达可靠性 | references/*.md 的 in-skill 引用句；措辞失败先改措辞，其次才内联 |
| **Invocation** | Router Skill | user-invoked 的"指向其他 user-invoked skills"的导航 skill；治 cognitive load | vNext Supervisor Agent（路由层）；P0 闭环 5 Agent 中的 Supervisor |
| **Information Hierarchy** | Information Hierarchy | skill 内容按"agent 立即需要程度"排序的单梯；三 rung：in-skill step / in-skill reference / external reference | vNext Skill body 结构；`references/*.md` 是第三 rung 的容器 |
| **Information Hierarchy** | Steps | 有序动作；每步结束于 **completion criterion** | step-based skill 的主轴 |
| **Information Hierarchy** | Completion Criterion | 步骤结束条件；可检查（agent 能区分 done vs not-done）+ 必要时穷尽（"every modified model accounted for"，不是"produce a change list"） | §2.21 D12 硬要求；防 premature completion |
| **Information Hierarchy** | Progressive Disclosure | 把 reference 推下梯（出 SKILL.md 进 linked 文件）；目的是顶部的可读性，不是 token 优化 | `references/*.md` 机制；branching 测试：分支共享内联，分支独占 pointer-gate |
| **Steering** | Leading Word | 模型预训练中已存在的紧凑概念，锚定一整片行为区；body 中锚 *execution*，description 中锚 *invocation* | description 写作第一规则；evolve-skill 审计维度之一 |
| **Pruning** | Pruning | 三个纪律的合称：single source of truth / relevance 检查 / 句级 no-op 测试 | evolve-skill 改动 skill 时强制走一遍 |

> 完整定义（含 `_Avoid_` 别名表与 failure mode 标签）见 `mattpocock_skills/.../GLOSSARY.md`。本表是工作语言快照。

#### 2.24.3 4 个 failure modes（诊断用）

| Failure mode | 症状 | 一线修复 |
| --- | --- | --- |
| **Premature Completion** | step 没真做完注意力就跳到"完成姿态" | 先 sharpen completion criterion；若 fuzzy 且 in-sequence 才 split |
| **Variance** | 多次跑产出形态不同 | 上游修复：criterion / context pointer 措辞 / collapse duplication |
| **Context Pointer Miss** | agent 漏掉了 disclosed 文件 | 改 pointer 措辞，不是改目标；只有 sharpen 失败才内联 |
| **Bloat** | SKILL.md 长到不可读 | progressive disclosure 推下梯 |

#### 2.24.4 6 个落地点（D12 contract）

| # | 落地点 | 已应用 |
| --- | --- | --- |
| 1 | §2.0 frontmatter：`disable-model-invocation` 升级为第 9 必填字段 | ✅ §2.0 |
| 2 | §2.0 description 写作三规则（前置 leading word / 一个 branch 一个 trigger / 删 body 重复 identity） | ✅ §2.0 |
| 3 | §2.21 P0 Skill：step-based skill 必含 `completion-criterion` | ✅ §2.21 |
| 4 | §2.18 B15：新增 borrow 项，writing-great-skills 列入验收表 | ✅ §2.18 |
| 5 | §2.5 evolve-skill：吸收 11 leading words + 4 failure modes 作为 acceptance check + 审计维度；中文细则沉淀 `references/skill-authoring.md` | ✅ §2.5 |
| 6 | §2.12 D12 决策 + §2.24（本节） | ✅ §2.12 + §2.24 |

#### 2.24.5 evolve-skill 吸收契约

evolve-skill 在 **创建 / 修改 / 审计**任意 skill 时，强制执行：

- **Acceptance check（创建/修改）**：9 字段齐全 + description 三规则 + step-based skill 含 completion criterion + leading word 出现在 description
- **Audit dimensions（审计）**：4 failure modes 自查 + pruning 三纪律 + information hierarchy ladder 完整性
- **Reference 沉淀**：中文细则、case study、checklist 模板写入 `references/skill-authoring.md`（Step 3-D 之后由 evolve-skill 维护；不在 P0 必交付清单）

> 本节是 vNext skill 写作的"宪法"；与 §2.14 Evolver Iron Law 互补——Iron Law 是 Evolver 自身行为约束，§2.24 是 Evolver 评判 skill 质量的标尺。

---

### 2.25 Step 3-D — P0 目录树草案（仅 P0 资产）

> **决策**：vNext P0 资产使用 **`vnext/` 隔离命名空间**，与 v1 (`skills/builder-*` / `agents/openai.yaml` / `kernel/` / `memory/`) 共存，零侵入、易回滚。Step 4 迁移完成 + 8 GT 验证通过后再决定是否 merge 到根。
>
> **硬约束**：本节目录树**仅含 P0 资产**，禁止提前生成 P1/P2/P3 占位目录（违反 §2.0 grade 标签的"列出 ≠ 必须建"原则）。

#### 2.25.1 P0 目录树（literal）

```
vnext/                                    # P0 隔离命名空间（与 v1 共存）
├── README.md                             # 入口：本目录边界 + v1 共存策略 + 回滚方案
│
├── agents/                               # 5 Agent 契约（§2.20）
│   ├── _index.md                         # Agent 路由表（intent → agent 分派规则）
│   ├── supervisor.md                     # Agent 1：意图识别 / 路由 / Answer-Ask-Grill
│   ├── researcher.md                     # Agent 2：craft-spec + discover-research
│   ├── builder.md                        # Agent 3：craft-prototype + build-commit
│   ├── reviewer.md                       # Agent 4：review-doc + review-code
│   └── evolver.md                        # Agent 5：evolve-memory + evolve-skill（Iron Law §2.14）
│
├── skills/                               # 12 P0 Skill（§2.21）
│   ├── _index.md                         # Skill 路由表（按桶分组，含 leading word 索引）
│   │
│   ├── manage/                           # 桶：manage-*（3 项 P0）
│   │   ├── manage-prompt/
│   │   │   └── SKILL.md
│   │   ├── manage-grill/
│   │   │   └── SKILL.md
│   │   └── manage-file/
│   │       └── SKILL.md
│   │
│   ├── discover/                         # 桶：discover-*（1 项 P0）
│   │   └── discover-research/
│   │       └── SKILL.md
│   │
│   ├── craft/                            # 桶：craft-*（3 项 P0）
│   │   ├── craft-spec/
│   │   │   └── SKILL.md
│   │   ├── craft-prototype/
│   │   │   └── SKILL.md
│   │   └── craft-agent-task/
│   │       └── SKILL.md
│   │
│   ├── review/                           # 桶：review-*（2 项 P0）
│   │   ├── review-doc/
│   │   │   └── SKILL.md
│   │   └── review-code/
│   │       └── SKILL.md
│   │
│   ├── build/                            # 桶：build-*（1 项 P0）
│   │   └── build-commit/
│   │       └── SKILL.md
│   │
│   └── evolve/                           # 桶：evolve-*（2 项 P0）
│       ├── evolve-memory/
│       │   └── SKILL.md
│       └── evolve-skill/
│           └── SKILL.md
│
├── kernel/                               # P0 Kernel Packet（§2.23，4 项必交付）
│   ├── intent-packet.schema.md           # Intent Packet（Supervisor 入口必填）
│   ├── output-packet.schema.md           # Output Packet（6 元数据 / D10）
│   ├── evidence-packet.schema.md         # Evidence Packet（Reviewer 主用）
│   └── iron-law.schema.md                # Iron Law（L1 全局，每 Agent 入口校验）
│
└── memory/                               # 4 类 Memory schema（§2.22）
    ├── _index.md                         # 4 类导航 + 共用扩展字段说明
    ├── user.schema.md                    # 用户偏好 / 反馈累计
    ├── feedback.schema.md                # 触发沉淀的反馈信号
    ├── project.schema.md                 # 项目级状态 / 决策快照
    └── reference.schema.md               # 外部资料 / 已验证链接
```

**P0 文件总数**：1 README + 6 agent specs（含 _index）+ 12 skill SKILL.md + 1 skill _index + 4 kernel schemas + 5 memory files（含 _index）= **29 个文件**

#### 2.25.2 与 v1 的共存策略

| 维度 | v1 现状 | vNext P0 | 共存策略 |
| --- | --- | --- | --- |
| `skills/` | 8 个 `builder-*` 目录 + `skill-template.md` | 11 个 bucket-organized skill 在 `vnext/skills/` | **物理隔离**：v1 不动，vNext 独立目录 |
| `agents/` | `openai.yaml`（runtime stub） | 5 个 `.md` Agent 契约在 `vnext/agents/` | **物理隔离**：v1 runtime stub 保留根目录 |
| `kernel/` | `packets/`（5 个 v1 schema）+ `gates/` + `protocols/` + `routing/` | 4 个 P0 packet schema 在 `vnext/kernel/` | **物理隔离**：v1 全保留，vNext P0 只放 4 个 packet |
| `memory/` | 6 个 v1 schema（artifact-index / decision-memory / evolution-note / project-memory / project-profile / user-memory）+ `policies/` | 4 类 schema 在 `vnext/memory/`（user / feedback / project / reference） | **物理隔离**：v1 schema 不动；vNext 4 类独立 |
| `harness/` / `references/` / `templates/` / `adapters/` | v1 全部保留 | **不进 P0 目录树**（属 P1+ 或 runtime 层） | P0 不动这些目录 |

> **回滚策略**：vNext P0 验证失败 → 直接 `rm -rf vnext/`，v1 完全无损。

#### 2.25.3 放置规则（约束先行）

1. **P0 文件必须落在 `vnext/` 命名空间内**——禁止在根目录的 `skills/` / `agents/` / `kernel/` / `memory/` 直接新建 vNext 资产（避免与 v1 混淆）
2. **Skill 目录结构固定**：`vnext/skills/<bucket>/<skill-name>/SKILL.md`——桶中转层（不扁平），便于 P1/P2 增项时桶内聚合
3. **Agent 契约文件名 = Agent 角色名**（`supervisor.md` / `researcher.md` / `builder.md` / `reviewer.md` / `evolver.md`），不加前缀
4. **Kernel packet 文件名沿用 v1 命名**（`intent-packet.schema.md` 等）——保持术语一致性，便于 Step 4 索引映射
5. **Memory 4 类文件名 = 类型名**（`user.schema.md` 等），不用 `memory-user` 这类冗余前缀（已在 `vnext/memory/` 命名空间内）
6. **每个目录必有 `_index.md`**——遵循 Max Brain `_index.md` 导航协议（CLAUDE.md §"导航协议"）；`agents/_index.md` 与 `skills/_index.md` 是 P0 必交付
7. **P0 不创建**：`harness/` / `references/` / `templates/` / `adapters/` 的 vNext 对应物；`vnext/skills/*/references/` 子目录（mattpocock 风格的 disclosed reference 是 P1+ 才用）

#### 2.25.4 与 §2.24（D12）的契约对齐

每个 P0 `SKILL.md` 必须满足：
- §2.0 9 必填字段齐全（含 `disable-model-invocation`）
- description 三规则（前置 leading word / 一 branch 一 trigger / 删 body 重复 identity）
- step-based skill 每个 step 含 `completion-criterion`
- 文件首部含 source-of-truth 锚点：`> 本 SKILL 是 §2.21 第 N 项 P0 候选；契约见 blueprint §2.X`

每个 P0 Agent 契约（`agents/*.md`）必须满足 §2.20 模板：intent / can-invoke / output / on-fail / handoff 五字段。

#### 2.25.5 Step 3-D 完成验收清单

- [x] `vnext/` 目录树按本节创建（29 个文件骨架，文件可为 stub）
- [ ] 每个 stub 文件含 frontmatter（9 字段）+ §2.X 锚点引用
- [ ] `vnext/README.md` 写明：边界 / v1 共存策略 / 回滚方案 / P0 验收路径
- [ ] `vnext/agents/_index.md` + `vnext/skills/_index.md` + `vnext/memory/_index.md` 完整可导航
- [ ] validator（如有）能识别 `vnext/` 命名空间并跳过 v1 检查
- [ ] Step 4 GT-01 ~ GT-08 在 P0 目录树基础上能跑通（实际跑通 = Step 4 任务，非 3-D 范围）

> Step 3-D 完成后进入 Step 4：8 Golden Tasks + v1 → vNext 索引映射表 + 迁移路线图（落地：§2.26）。

---

### 2.26 Step 4 — Golden Tasks + v1 → vNext 索引映射表 + 渐进开放路线图

> **本节目的**：把 §2.15 P0 闭环（5 Agent + 12 Skill + 4 Kernel Packet + 4 类 Memory schema）落到 8 条端到端"金标准"路径上；为 v1 → vNext 迁移给出索引级映射；为 P1/P2 候选给出"何时开放"的客观触发条件。三者共同构成 P0 上线前的"验收三件套"。

#### 2.26.1 8 Golden Tasks（GT-01 ~ GT-08）

**设计原则**：
1. 每个 GT 必须覆盖 ≥1 个 Agent + ≥1 个 Skill + ≥1 个 Kernel Packet
2. 8 个 GT 并集必须覆盖全部 5 Agent / 12 P0 Skill / 4 Packet / 4 类 Memory schema
3. 每个 GT 给出：触发语 / Agent 链 / Skill 链 / 涉及 Packet / 涉及 borrow / pass 准则 / fail 信号
4. GT 用于"骨架跑通"验证，不验证质量上限（质量上限由 P1 evolve-skill + evolve-harness-audit 后续验证）

**覆盖矩阵**（行=GT，列=P0 资产；✓=主路径覆盖，△=间接路径覆盖）：

| GT | Supervisor | Researcher | Builder | Reviewer | Evolver |
| --- | --- | --- | --- | --- | --- |
| GT-01 模糊请求澄清 | ✓ |  |  |  |  |
| GT-02 PRD 产出 | △ | ✓ |  |  |  |
| GT-03 高保真原型 | △ |  | ✓ |  |  |
| GT-04 review-doc 否决 | △ |  |  | ✓ |  |
| GT-05 review-code 自检 | △ |  | ✓ | △ |  |
| GT-06 evolve-memory feedback | △ |  |  |  | ✓ |
| GT-07 端到端小型 feature | △ | ✓ | ✓ | ✓ |  |
| GT-08 evolve-memory project + Iron Law | △ |  |  |  | ✓ |

| GT | 涉及 Skill | 涉及 Packet | 涉及 borrow |
| --- | --- | --- | --- |
| GT-01 | manage-grill / craft-agent-task / manage-prompt | Intent (probe_depth) | B1 / B3 |
| GT-02 | discover-research / craft-spec | Output (citations) | B5 / B6 |
| GT-03 | craft-prototype / build-commit / manage-file | Output (evidence) | — |
| GT-04 | review-doc | Output (decision=reject) | B11 / B13 |
| GT-05 | review-code / build-commit | Output (decision=request-changes) | B11 |
| GT-06 | evolve-memory | Output (reply_mode=no_reply) | B2 / B4 |
| GT-07 | craft-spec / review-doc / craft-prototype / build-commit / review-code | Intent + Output + Evidence | B8 (Layer 1+3) |
| GT-08 | evolve-memory / evolve-skill (Iron Law) | Output (evidence=iron-law-yaml) | B4 / D9 |

> 12 P0 Skill 全部被至少 1 个 GT 主路径覆盖 ✓；4 Packet 全覆盖；4 类 Memory（user/feedback/project/reference）由 GT-06（feedback）+ GT-08（project）+ GT-02（reference，discover-research 输出）+ GT-01（user，manage-grill 输出 user 假设）覆盖。

---

**GT-01 — 模糊请求澄清**

| 字段 | 内容 |
| --- | --- |
| Trigger | 用户输入：「我想做个 AI 产品」（高歧义、无 scope、无 audience） |
| Agent 链 | Supervisor（独立完成） |
| Skill 链 | manage-prompt（输入归一）→ B3 4 决策卡（scope/deadline/ambiguity/reversibility）→ manage-grill（ambiguity=high → probe_depth=deep，B1）→ craft-agent-task（输出 agent-readable spec，但**不派发**，待用户确认） |
| Packet | Intent Packet：`probe_depth=deep` + 触发理由；Output Packet：`reply_mode=ask` + 3 个澄清问题 |
| Pass | (1) 4 决策卡 4 字段全填；(2) probe_depth 升级有歧义证据支撑；(3) 输出 ≤3 个澄清问题，且每个问题可被用户一句话回答；(4) craft-agent-task spec 已生成但 status=draft，未派发 |
| Fail | Supervisor 直接给方案（越权）/ 提问 >3 个 / 问题封闭（是/否） |

**GT-02 — Researcher craft-spec 产出 PRD（含 citations）**

| 字段 | 内容 |
| --- | --- |
| Trigger | GT-01 收敛后的目标 + 用户指令「为这个目标写 PRD」 |
| Agent 链 | Supervisor（路由）→ Researcher（执行） |
| Skill 链 | discover-research（收集 evidence）→ craft-spec（profile=prd） |
| Packet | Output Packet：`type=spec` / `audience=eng` / `confidence ∈ {low,medium,high}` / `evidence_table ≥ 3 citations`（B6） |
| Pass | (1) PRD 含 6 元数据全填；(2) confidence 字段附评分依据；(3) evidence_table 每条 claim 可溯源；(4) GT-04 review-doc 跑 Layer 1 通过 |
| Fail | 无 citations / confidence 缺依据 / 无 acceptance criteria |

**GT-03 — Builder craft-prototype 高保真原型**

| 字段 | 内容 |
| --- | --- |
| Trigger | GT-02 spec + 用户指令「做高保真原型」 |
| Agent 链 | Supervisor → Builder |
| Skill 链 | craft-prototype（profile=hi-fi, mock-data=yes）→ build-commit（commit 到新分支）→ manage-file（产物路径登记） |
| Packet | Output Packet：`type=artifact` / `audience=user` / `evidence={diff, commit_hash, run_command}` |
| Pass | (1) `pnpm dev`（或等价）能跑通；(2) git commit 信息符合 conventional commits；(3) Output evidence 字段含 commit_hash；(4) mock-data 隔离不污染真实数据 |
| Fail | 原型跑不通 / 无 commit / mock 数据写入生产路径 |

**GT-04 — Reviewer review-doc 否决路径（含 HALO + Rationalization）**

| 字段 | 内容 |
| --- | --- |
| Trigger | 故意构造有缺陷的 PRD（缺验收标准 + 含未验证数据 + 与 project decision_log 冲突） |
| Agent 链 | Supervisor → Reviewer |
| Skill 链 | review-doc（HALO 三型诊断 B11 + Rationalization Table B13） |
| Packet | Output Packet：`type=review` / `decision=reject` / `halo ∈ {hallucination, omission, misalignment}` |
| Pass | (1) 3 类缺陷全被 flag；(2) 每条 flag 映射到 HALO 类（Rationalization Table 非空）；(3) Builder **未**被派发任务（否决 gate 生效） |
| Fail | 直接放行 / HALO 未分类 / Builder 仍被派发 |

**GT-05 — Builder 自检 review-code**

| 字段 | 内容 |
| --- | --- |
| Trigger | GT-03 prototype 代码故意引入 1 处 type-error + 1 处 mock 残留 |
| Agent 链 | Builder（自检）→ Builder（修复） |
| Skill 链 | review-code（自检）→ build-commit（修复后新 commit，非 amend） |
| Packet | Output Packet：`type=review` / `decision=request-changes` / `halo=omission` |
| Pass | (1) 2 处缺陷都被 flag；(2) 修复后 typecheck/lint 通过；(3) 新 commit 而非 amend；(4) Output evidence 含修复前后 commit_hash |
| Fail | 漏报 / amend 旧 commit / 跳过 typecheck |

**GT-06 — Evolver evolve-memory 写 feedback 类（Action-First / no&#95;reply）**

| 字段 | 内容 |
| --- | --- |
| Trigger | GT-04 后用户输入：「我以后希望 PRD 默认带验收标准」 |
| Agent 链 | Supervisor → Evolver |
| Skill 链 | evolve-memory（type=feedback，写入 feedback.schema.md） |
| Packet | Output Packet：`type=memory-write` / `reply_mode=no_reply`（B2 Action-First） |
| Pass | (1) feedback row 写入 memory；schema 字段全填（type/scope/status/source/confidence/last_verified/detail_ref）；(2) **不对用户产生对话回复**（仅写盘）；(3) 不破坏其他 3 类 memory schema |
| Fail | 给用户输出冗余确认语 / schema 字段缺 / 写入错误类型 |

**GT-07 — 端到端小型 feature（Swiss Cheese Layer 1+3）**

| 字段 | 内容 |
| --- | --- |
| Trigger | 「为我加一个 dark mode toggle 按钮」（小型完整 feature） |
| Agent 链 | Supervisor → Researcher → Reviewer（doc Layer 1）→ Builder → Reviewer（code Layer 1） |
| Skill 链 | craft-spec（mini）→ review-doc → craft-prototype → build-commit → review-code |
| Packet | Intent + Output + Evidence 三 Packet 全程贯通；Evidence Packet 含 spec/diff/review-log |
| Pass | (1) 端到端一次跑通；(2) B8 Swiss Cheese Layer 1（Intent）+ Layer 3（Output）每层至少 1 gate 通过；(3) commit_hash 进 Output；(4) 无人工介入兜底 |
| Fail | 任一 Agent 卡住 / 任一 Layer 跳过 / 需人工修补 |

**GT-08 — Evolver evolve-memory 写 project 类 + evolve-skill Iron Law 自检**

| 字段 | 内容 |
| --- | --- |
| Trigger | 「记录本次迭代的决策」（project 类 memory 写入） |
| Agent 链 | Supervisor → Evolver |
| Skill 链 | evolve-memory（type=project）→ evolve-skill 执行 §2.14 Iron Law D9 YAML 自检 → 全 pass → 写入 project.schema.md |
| Packet | Output Packet：`type=memory-write` / `evidence=iron-law-yaml-passed` |
| Pass | (1) project row 写入；(2) Iron Law YAML 全字段 pass（含 `hazard_signal` 字段为空）；(3) 不触发 Evolver 失控信号（无自动批量重写） |
| Fail | Iron Law 字段缺失 / 触发 hazard 但仍写入 / Evolver 越权改其他文件 |

#### 2.26.2 v1 → vNext 索引映射表

> **目的**：v1 的 8 个 builder-* skill 必须在 vNext 找到明确归属（Agent + Skill 双层）。映射必须可回滚（vNext 失败时可回退 v1）。

| v1 Skill | v1 职责 | → vNext Agent | → vNext Skill(s) | 拆分理由 / 备注 |
| --- | --- | --- | --- | --- |
| `builder-router` | 入口路由 / 4 决策卡 / Answer/Ask/Grill | **Supervisor** | `manage-grill` + `craft-agent-task` + `manage-prompt` | 路由逻辑分散到 Supervisor 入口；4 决策卡作为 manage-prompt 前置 |
| `builder-plan-goal` | 目标对齐 / 模糊请求澄清 | **Supervisor + Researcher** | `manage-grill`（澄清）+ `craft-spec`（goal → PRD 合同） | 边界：grill = 意图收敛；spec = 合同产出（避免越权） |
| `builder-frame` | 问题框定 / Context 模式 | **Supervisor** | `manage-grill` 子模式（framing profile） | frame 作为 grill 前置步骤，避免新增第 12 个 P0 Skill |
| `builder-spec` | PRD / Mini Spec / Eng Request | **Researcher** | `craft-spec`（含 prd/mini/eng-request 三 profile） | 直接对应，桶名变更（builder→craft） |
| `builder-prototype` | 高保真原型 + commit | **Builder** | `craft-prototype`（产出）+ `build-commit`（落地） | 拆分：craft=文档/规格产出 vs build=实际编码/落地（§2.0 桶定义） |
| `builder-agent-task` | agent-readable spec 派发 | **Supervisor + 各 Agent** | `craft-agent-task`（通用 spec 派发） | 通用化：不再 builder-* 专属，所有 Agent 可消费 |
| `builder-review` | doc review + code review | **Reviewer** | `review-doc` + `review-code` | 拆分：doc/code 关注点不同（B11 HALO 应用方式不同） |
| `builder-decision` | 决策记录 / 决策卡 | **Supervisor + Evolver** | `craft-agent-task`（decision 子模式）+ `evolve-memory`（project 类） | 决策本身 = spec 子模式；决策记录 = memory 写入 |

**迁移原则**（约束先行）：
1. **零侵入 v1**：v1 的 `skills/builder-*` 目录不删；vNext 在 `vnext/` 命名空间下平行存在（§2.25 共存策略）
2. **回滚安全**：`rm -rf vnext/` 即恢复 v1 行为
3. **映射可追溯**：每个 v1 skill 必须在映射表中找到 ≥1 个 vNext Skill 对应；不能"蒸发"
4. **不可重复映射**：每个 v1 skill 的核心职责只能落到 1 个主 Agent（其他 Agent 标 △ 副路径）
5. **vNext skill-grade ≥ v1**：迁移过程中不允许"降级"——v1 已有的能力不能在 vNext 标 grade=P3/Drop（除非 §2.17 Deletion Test 已确认 Drop）

#### 2.26.3 P1/P2/P3 渐进开放触发条件

> **原则**：P0 不一次性扩到 P1+P2+P3。每个候选升级必须满足客观触发条件，避免"看着挺好就加上"的人治风险。

**T1 — P0 → P1 升级触发条件**（全部满足）：

| 触发条件 | 客观判定方式 | 工具 |
| --- | --- | --- |
| GT-01 ~ GT-08 全部 pass | 一次端到端跑通 ≥ 80%（≥6 GT pass） | Golden Task Suite |
| P0 实际使用 ≥ 2 周 | git log / commit history 时间戳 | build-commit 记录 |
| 某 P1 候选被"workaround 兜底"≥ 3 次 | evolve-harness-audit 检测（type=skills 子模式） | evolve-harness-audit P1 候选 |
| 无 P0 级 Sev-1 缺陷 | Iron Law YAML 全 pass + 用户反馈无阻塞 | §2.14 Iron Law |

**P1 候选优先级**（基于 §2.17 Deletion Test，逐项解锁）：

1. `evolve-harness-audit`（含 doc/kb 子模式；GT-01~08 的 audit 基础设施）
2. `craft-architecture` + `craft-test-case`（Builder/Reviewer 高频依赖）
3. `build-ui`（UI 实现核心；B7 ui-reasoning.csv 落地）
4. `review-e2e` + `review-ui` + `review-prototype`（Reviewer 完整能力）
5. `manage-brainstorm` + `manage-eval-session`（早期 idea + 会话评估）
6. `discover-competitive` + `discover-persona` + `craft-domain`（Researcher 增强）

**T2 — P1 → P2 升级触发条件**：

- P1 上线 ≥ 4 周
- 某 P2 候选被"workaround 兜底"≥ 5 次（阈值高于 T1，因 P2 是长尾）
- evolve-skill-health 健康度评分 = green（确保 P1 稳定再扩 P2）

**T3 — P2 → P3 / Drop 降级触发条件**：

- 长期无调用记录（≥ 6 个月）
- evolve-skill-health 健康度 = red 连续 2 次 audit
- §2.17 Deletion Test 复检：后果类别从 Workaround 升级为 Safe-drop

**T4 — 紧急回滚条件**（P1+ 立即降级回 P0）：

- evolve-skill-health 检测到 Sev-1 缺陷
- Iron Law YAML 出现 `hazard_signal` 但未被拦截
- 用户明示"这个 skill 不要了"

**升级路径可视化**：

```
P0 (12 Skill + 5 Agent)
  ↓ T1 全满足
P1 (+6 Skill 候选，分批解锁)
  ↓ T2 全满足
P2 (+17 Skill 长尾补完)
  ↓ T3
P3 (仅记录) / Drop (合并或删除)
```

**P1/P2 候选不做提前目录生成**（遵守 §2.25"列出 ≠ 必须建"原则）；触发条件满足时，由 `evolve-skill` 创建对应 `vnext/skills/<bucket>/<name>/SKILL.md`。

#### 2.26.4 Step 4 完成验收清单

- [ ] GT-01 ~ GT-08 每条 5 字段全填（Trigger / Agent 链 / Skill 链 / Packet / Pass-Fail）
- [ ] 5 Agent 全覆盖；12 P0 Skill 全覆盖；4 Packet 全覆盖；4 类 Memory schema 全覆盖
- [ ] v1 8 个 builder-* skill 在映射表中全部找到归属，无"蒸发"
- [ ] T1/T2/T3/T4 四组触发条件全部客观可判定（无"看着挺好"主观词）
- [ ] P1 候选优先级列表与 §2.17 Deletion Test 推荐一致

---

## §3 待完成步骤（按 ChatGPT 5 层验证法调整）

### Step 3-A — 灵魂特质显性化（已在 §2.13 完成）

### Step 3-B — Blueprint Validation（先于目录生成）
- 62 Skill Deletion Test：每个 Skill 回答"不做会怎样？"，删除 P3
- 14 项 borrow 验收表：每项 borrow 列来源 + 本地化改写 + 验证用例
- MECE 反向测试：跨桶找反例（例如 craft-spec vs craft-requirements 是否冗余）

### Step 3-C — P0 最小闭环（已在 §2.15 定义）
- 5 Agent 契约模板（intent / can-invoke / output / on-fail / handoff）
- 12 Skill P0 候选模板（含 frontmatter 8 字段 + grade=P0）
- Memory 4 类 schema（含扩展字段 type/scope/status/source/confidence/last_verified/detail_ref）
- Kernel Packet 模板（Intent / Output 6 字段 / Evidence / Iron Law）

### Step 3-D — P0 目录树草案（仅 P0 资产）✅
基于 §2.15 的 5 Agent + 12 Skill + Kernel，生成最小目录树。**禁止提前生成 P1/P2/P3 目录**。
- 落地：§2.25（vnext/ 隔离命名空间 + 29 个 P0 文件骨架 + 共存策略 + 放置规则 + D12 契约对齐 + 验收清单）

### Step 4 — Golden Tasks + 迁移路线图 ✅
- 8 Golden Tasks（GT-01 ~ GT-08）测试 P0 闭环
- v1 → vNext 迁移：builder-* → Agent + Skill 的索引映射表
- 渐进开放 P1/P2 资产的触发条件
- 落地：§2.26（8 GT 完整定义 + 覆盖矩阵 + v1→vNext 8 项映射 + 5 条迁移原则 + T1/T2/T3/T4 四组触发条件 + P1 候选 7 项优先级）

---

## Changelog

| 日期 | 变更 |
| --- | --- |
| 2026-07-04 | 创建文档；§0-§2 完整起草（Step 1 + Step 2 输出） |
| 2026-07-04 | §2 重写：应用 8-bucket 封闭命名方案（discover/craft/review/build/evolve/write/manage/help）；D6 evolve-memory 单一化；D7 write-repurpose 暂定；新增 §2.0 命名规范、§2.11 桶分布、§2.12 决策补录 |
| 2026-07-05 | **D8/D9/D10 落地 + 灵魂特质映射 + ChatGPT 修正采纳**：§2.0 补 Skill frontmatter 8 字段 + grade 分级（矫正 C2）；§2.9 Output Packet 5→6 元数据（D10 audience 字段，含 enum 契约）；新增 §2.13 灵魂特质 14 项→层映射；新增 §2.14 Evolver Iron Law（D9 全文 + 自检 YAML）；新增 §2.15 P0 最小闭环定义（5 Agent + 11 Skill）；新增 §2.16 ChatGPT 8 项风险采纳清单；§3 调整 roadmap 为 3-A/3-B/3-C/3-D + Step 4 Golden Tasks |
| 2026-07-05 | **Step 3-B Blueprint Validation 完成**：新增 §2.17 Deletion Test（57 项 Skill 全检；P0=11/P1=14/P2=17/P3=6/Drop=5）；新增 §2.18 14 项 borrow 验收表（B1-B14 全部带验证用例）；新增 §2.19 MECE 反向测试（10 反例 → 3 项合并 + 5 项保留 + 1 项校正）；总数从 57 → 51 项实际建设；§2.5 与 §2.11 数量不一致已识别（evolve-skill-health 漏数） |
| 2026-07-05 | **D11 采纳**：evolve-doc-check + evolve-kb-check 合并入 evolve-harness-audit 子模式（type=docs/kb/skills/memory/full）；既有 doc-consistency-check / kb-health-check 内容保留为 references；§2.5 Evolver 列 12→10；§2.11 总数 57→55；Deletion Test 实际建设 51→48 |
| 2026-07-05 | **D12 采纳 — mattpocock writing-great-skills 吸收（Plan B）**：本地化 mattpocock SKILL.md + GLOSSARY.md 至 `10_Library/13_Open_Source_Reference/mattpocock_skills/`；§2.0 frontmatter 8→9 必填字段（`disable-model-invocation` 升级）+ description 三规则；§2.21 step-based skill 必含 completion criterion；§2.18 新增 B15；§2.5 evolve-skill 注明吸收 11 leading words + 4 failure modes；新增 §2.24 完整落地（4 轴 11 词 + 6 落地点 + evolve-skill 吸收契约） |
| 2026-07-05 | **Step 3-D 完成**：新增 §2.25 — P0 目录树草案；vNext P0 资产采用 `vnext/` 隔离命名空间（与 v1 物理隔离，零侵入易回滚）；29 个 P0 文件骨架（1 README + 6 agents + 12 skills + 4 kernel + 5 memory + 3 _index）；共存策略表 + 7 条放置规则 + D12 契约对齐 + 5 项验收清单；Step 3-D 状态 ✅ |
| 2026-07-05 | **Step 4 完成**：新增 §2.26 — Golden Tasks + 索引映射 + 渐进开放路线图；定义 8 个 GT（GT-01~08，每个含 Trigger/Agent 链/Skill 链/Packet/Pass-Fail 五字段）；覆盖矩阵证明 5 Agent + 12 P0 Skill + 4 Packet + 4 类 Memory schema 全覆盖；v1 → vNext 8 项 builder-* 映射（无"蒸发"，零侵入 v1）；5 条迁移原则；T1/T2/T3/T4 四组客观触发条件；P1 候选 6 项优先级（基于 §2.17 Deletion Test）；Step 4 状态 ✅ |
| 2026-07-07 | **ADR 0002 采纳**：evolve-skill 从 P1 提升至 P0（事实纳入）；P0 Skill 11→12，P1 候选 13→12，P0 文件总数 28→29；17 处行级同步见 ADR 0002 Part A |
