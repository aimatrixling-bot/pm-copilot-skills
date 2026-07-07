---
title: Skill Authoring Spec
category: reference
scope: vnext
status: P1
owner_agent: evolver
shared_with: [reviewer, builder]
last_updated: 2026-07-06
---

# Skill Authoring Spec

> **Disclosed reference** for `craft/spec-*` 与 `evolve/refine` skill。不是 skill 本身，不可被 invoke。所有 vnext skill 作者在写 SKILL.md 前必读。

---

## 0. 文档定位

| 项 | 值 |
|---|---|
| 性质 | Tier 2 reference（in-repo disclosed） |
| 受众 | skill 作者（人 / agent） |
| 来源 | mattpocock/skills GLOSSARY（MIT） + 蓝图 §2.0/§2.20/§2.24 + 本仓库实战沉淀 |
| 上游权威 | mattpocock GLOSSARY 是 leading words 的完整定义源；本文件只做 vnext 适配 |
| 维护 | `evolver` agent；变更需触发 `review/spec-review` |
| 不做什么 | 不复制 GLOSSARY 全文，不教 PM/工程领域知识，不写 do/don't CSV（推到 Tier 1） |

---

## 1. 根本 Virtue: Predictability

一个 skill 的好坏，唯一标准是：**让 agent 每次以相同方式执行**——相同的 *过程*，不是相同的 *输出*。

- 头脑风暴 skill 应**可预测地发散**（token 变，行为不变）
- 评审 skill 应**可预测地挑错**（找到的问题集合稳定）
- 数据转换 skill 应**可预测地产出**（输入相同 → 输出相同）

成本、可维护性、token 消耗都是症状，不是目标。

**反例**：写"AI 要认真分析"——这是输出描述，不构成 predictability。

---

## 2. 三大原则（继承 mattpocock + vnext 强化）

| # | 原则 | 违反后果 |
|---|---|---|
| 1 | **Invocability 优于 Capability** | description 决定何时被调用；写得再好的 skill 调用不到就是死代码 |
| 2 | **Information Hierarchy 优于 Token 优化** | 阶梯式披露让 agent 知道何时深入；纯省 token 会丢上下文 |
| 3 | **Single Source of Truth 优于 Duplication** | 同一概念只在一处定义；复制 = 漂移起点 |

---

## 3. Frontmatter 10 字段写作规范（蓝图 §2.0：9 必填 + grade）

Skill frontmatter 共 **10 字段**：9 必填 + 1 个 `grade` 标签。蓝图 line 837 明确「9 必填字段 + grade」。

### 3.1 9 必填字段表（蓝图 line 175-187）

| 字段 | 类型 | 写法 | 反模式 |
|---|---|---|---|
| `name` | kebab-case | `craft-spec-prd` | `CraftPRD` / `prd-skill` |
| `description` | ≤200 字符 | 一句话含 leading word + 失败模式 | "这个 skill 用来..."（描述功能而非触发） |
| `disable-model-invocation` | bool | 默认 false；user-only 时 true | 留空（必填） |
| `can-invoke` | list[str] | 只列 user-invoked；model-invoked 自动可见 | 列所有 skill（噪声） |
| `paths` | list[path] | 相对路径，不用绝对 | `D:\...` 写死 |
| `status` | enum | `draft` / `beta` / `stable` / `deprecated`（默认 `draft`） | 用 Candidate/P0 作 status 值（这是 grade 的值，不是 status） |
| `owner_agent` | str | 必填，单一 agent | 空 / 多 owner |
| `shared_with` | list[str] | 显式声明共享对象 | "all"（违反 owner 单一） |
| `scope` | enum | `global` / `project` / `session`（默认 `project`） | 不写（必填） |

### 3.2 grade 字段（蓝图 line 201-213）

每个 Skill **同时**带 `grade` 字段，标记是否进入 P0 闭环。62 项 Skill 全部初始标 `Candidate`，禁止"列出 = 必须建"。

| Grade | 含义 |
|---|---|
| `Candidate` | 候选清单（默认值，**不代表必须建设**） |
| `P0` | 最小闭环必备（≤12 项，详见蓝图 §2.15） |
| `P1` | 立即可选增强（验证 P0 后再补） |
| `P2` | 长尾补完 |
| `P3` | 仅记录，不实现 |

### 3.3 status × grade 正交关系（关键澄清）

两轴**独立**，不重复：

| 组合 | 语义 | 例子 |
|---|---|---|
| `Candidate` + `draft` | 候选清单中，尚未实现 | §2.11 中 62 项的初始状态 |
| `Candidate` + `deprecated` | 候选被否决后淘汰 | §2.17 Deletion Test 通过 |
| `P0` + `draft` | 已选入 P0 闭环，代码草稿中 | Step B 刚产出 frontmatter |
| `P0` + `stable` | P0 闭环已稳定通过 review | 通过 `review/spec-review` |
| `P3` + `stable` | 已归档历史 skill，代码质量稳定 | 不再维护但保留可用 |

> **常见错误**：把 Candidate/P0 当成 status 的值。**正确**：Candidate/P0 是 grade；status 永远是 draft/beta/stable/deprecated 之一。

### description 写法

公式: `<Leading Word> when <trigger>, fails when <failure mode>`

✅ `Grill user intent when request is vague, fails when AI assumes goal`
❌ `Helps to clarify user requirements`

### can-invoke 写法

```yaml
can-invoke:
  - craft-spec              # 只列 user-invoked
  - review-spec             # 不列 model-invoked (自动可见)
```

---

## 4. Body 写作规范

### 4.1 Steps（如有）

每个 step **必须**有 completion criterion。Sharp 优于 vague:

| 类型 | 例子 |
|---|---|
| Sharp ✅ | "每条修改过的 model 都已对账（agent 能区分 done vs not-done）" |
| Vague ❌ | "产出变更清单" |

### 4.2 Reference（in-file）

- 当 skill 无 Steps 时，Reference 即全部内容（如 review 类）
- 不超过 skill 总长的 40%（超出 → progressive disclosure）

### 4.3 Progressive Disclosure

**测试**: 是否有 branch（部分场景需要、其他不需要）？
- 全 branch 都要 → inline
- 仅部分 branch 要 → disclosed（推到 `references/<topic>.md`）
- 全部不要 → 删

### 4.4 SKILL.md 长度

- 目标: ≤ 300 行
- 红线: 500 行（超过即拆 disclosed reference）

---

## 5. vnext 特有约束（在 mattpocock 之上叠加）

### 5.1 双轴 Discipline（Grade + Status）

**两轴独立演化，不可混为一谈。**

#### 5.1.1 Grade Discipline（成熟度阶梯 — 是否进入 P0 闭环）

| Grade | 含义 | 升级条件 |
|---|---|---|
| Candidate | 候选清单（默认），不在稳定 surface | 真实场景跑 ≥ 3 次且无 regression |
| P0 | 最小闭环必备（≤12 项） | 通过蓝图 §2.15 P0 上限约束 + Step B 实现 |
| P1 | 立即可选增强 | 通过 `review/spec-review` + 被多个 skill 引用 |
| P2 | 长尾补完 | 至少 1 个 user/global 项目验证 |
| P3 | 仅记录，不实现 | 历史归档或被 Deletion Test 否决 |

**禁止跳级**: Candidate → P0 直接跨级视为违规，必须回滚。

#### 5.1.2 Status Discipline（工程生命周期 — 单个 skill 的 dev → release）

| Status | 含义 | 进入条件 |
|---|---|---|
| `draft` | 默认值；frontmatter/body 未定稿 | Step B 产出后初始状态 |
| `beta` | 实现已完成，正在验证 | 通过 `review/spec-review` 但有 caveat |
| `stable` | 通过验证，可进入稳定 surface | `review/spec-review` PASS + grade 已达成 |
| `deprecated` | 已弃用，保留可用 | Deletion Test 通过（蓝图 §2.17） |

**status 流转**: `draft` → `beta` → `stable` 是正向流转；`deprecated` 是终态。`stable` → `deprecated` 是终态跳转，不可回滚（除非 fork 新 skill）。

#### 5.1.3 两轴协作

- **grade 决定优先级**：Candidate 即使 stable 也不进入 P0 闭环
- **status 决定可用性**：P0 即使 draft 也意味着进入 Step B 实现
- 一个 skill 的完整状态 = `grade` × `status` 组合（详见 §3.3）

### 5.2 Owner Anchoring

- 每个 skill 必须有 `owner_agent`，且唯一
- 漂移（owner 被多次改写）= 重新设计信号
- `shared_with` 是「读权限」，不是「共同 owner」

### 5.3 Bucket Fit

8 桶必居其一（封闭命名方案，与蓝图 §2.0 L152 一致）:

| Bucket | 干什么 | 何时 NOT 用 |
|---|---|---|
| `discover` | 信息收集 / 研究 / 调研 / 数据采集 | 已经知道做什么时 |
| `craft` | 产出可交付文档或规格（spec/wireframe/story/prototype/agent-task/decision/handoff） | 还没搞清意图时 |
| `review` | 对已成形的产物做评审 / 检查 / 测试 | 还没产出时 |
| `build` | 实际编码、构建、提交、组件开发 | 还没评审通过时 |
| `evolve` | Harness 元资产（skill/rule/agent/command/loop/workflow/component/memory）的创建与维护、熵减 | 还没产出可沉淀经验时 |
| `write` | 自媒体原创与二创（含 extract 系列） | 非内容创作场景 |
| `manage` | 跨 Agent 通用工具（prompt/file/eval-session/grill/brainstorm） | 真正执行任务时 |
| `help` | 用户引导、上下文诊断、会话迁移 | 任务已在执行中时 |

落不进 8 桶 = 桶设计或 skill 本身有问题，**不要硬塞**。

### 5.4 Scope Honesty

| Scope | 适用 | 不适用 |
|---|---|---|
| `project` | 单一项目内 | 跨项目复用 |
| `user` | 跨项目但同一用户 | 公开发布 |
| `global` | 任何用户任何项目 | 含私有案例 |

### 5.5 流转规则不可逆

**Grade 流转**（成熟度阶梯，单向）:
Candidate → P0 → P1 → P2 → P3。降级 = 归档（移到 `_archived/`）+ 新 Candidate 重启。

**Status 流转**（工程生命周期）:
`draft` → `beta` → `stable` 是正向；`stable` → `deprecated` 是终态跳转（不可回滚）。
例外：`deprecated` skill 经 Evolver 评估可重新启用 → 必须新建 Candidate（不复用旧 skill 路径）。

**两轴独立**：grade 升降不依赖 status 变更，反之亦然。一个 skill 可以 grade=P0 + status=deprecated（虽进 P0 但被弃用）。

---

## 6. 核心概念速查（精选 12 个）

> 完整定义见 mattpocock GLOSSARY。此处只列 vnext 高频使用的概念。

| 概念 | 一句话 | 在 vnext 哪里出现 |
|---|---|---|
| **Predictability** | 根本 virtue，过程可重现 | 所有 skill |
| **Model-Invoked** | 保留 description，agent 自动可见 | 大部分 skill |
| **User-Invoked** | 移除 description，只人触发 | grill / refine 类 |
| **Description** | 机器可读触发器 | frontmatter 必填 |
| **Context Pointer** | 指向 disclosed 文件的引用 | reference 引用 |
| **Context Load** | description 占的 context 成本 | 决定 model/user-invoked |
| **Cognitive Load** | user 要记多少 | 决定 router skill |
| **Granularity** | skill 拆分粒度 | 决定是否拆 skill |
| **Progressive Disclosure** | 把 reference 推到 disclosed | SKILL.md 长度控制 |
| **Completion Criterion** | step 结束条件 | 每个 step |
| **Leading Word** | 预训练已知的紧凑概念锚 | description 与 body |
| **Single Source of Truth** | 每个含义只在一处定义 | 跨 skill 复用 |

---

## 7. vnext 新增概念（在 mattpocock 之上）

| 概念 | 一句话 | 触发场景 |
|---|---|---|
| **Grade Discipline** | 候选不能跳级到稳定态 | 每次 grade 变更 |
| **Owner Anchoring** | skill 的 owner 唯一不可漂移 | frontmatter 校验 |
| **Bucket Fit** | skill 必落 8 桶之一 | 新建 skill 时 |
| **Scope Honesty** | scope 字段诚实反映可发布范围 | 公开 / 私有判断 |

---

## 8. Failure Modes

### 8.1 继承 mattpocock（4 个）

| Failure Mode | 症状 | 修复 |
|---|---|---|
| **Premature Completion** | step 还没真正完成 agent 就说 done | 锐化 completion criterion |
| **Variance** | 同输入不同输出 | 上游修（criterion / context pointer / duplication） |
| **Context Pointer Miss** | 该加载 disclosed 没加载 | 改 pointer 措辞，不内联 |
| **Bloat** | SKILL.md 超长不可读 | progressive disclosure 推到 references/ |

### 8.2 vnext 新增（4 个）

| Failure Mode | 症状 | 修复 |
|---|---|---|
| **Grade Inflation** | Candidate 直接标 P0 | 强制走 Candidate → P0 |
| **Owner Drift** | owner 被多次改写 | 重新设计 skill，而非改 owner |
| **Orphan Skill** | 没 owner_agent | reject 合并 |
| **Bucket Misfit** | skill 落不进 8 桶 | 拒收；检查桶设计或 skill 设计 |

---

## 9. 写作纪律 Checklist（提交前自检）

```
□ frontmatter 10 字段全填（9 必填 + grade）
□ description 含 leading word + 失败模式
□ status 取值 draft/beta/stable/deprecated（不是 Candidate/P0）
□ grade 取值 Candidate/P0/P1/P2/P3（不是 draft/beta）
□ status × grade 两轴独立标注（不混用）
□ grade 按 Grade Discipline 流转（无跳级）
□ status 按工程生命周期流转
□ owner_agent 唯一
□ bucket 落在 8 桶之一
□ scope 诚实（user 字段不写 global）
□ 每个 step 有 completion criterion
□ SKILL.md ≤ 300 行
□ reference 该 disclosed 的已推到 references/
□ 无 duplication（同一概念只在一处）
□ 无 no-op 句子
□ can-invoke 只列 user-invoked
□ paths 相对路径
```

---

## 10. 反模式（具体例子）

### 反模式 1: 「万能 Skill」
```yaml
name: do-everything
description: Helps with anything you need
```
**病**: description 含糊，agent 不知道何时调用；bucket 落不进；owner 不明。
**治**: 拆成多个 skill，每个有明确 leading word + failure mode。

### 反模式 2: 「跳级 Skill」
```yaml
grade: P0        # 跳过 Candidate
status: stable   # 同时跳过 draft/beta
```
**病**: 双轴同时跳级 = 没验证就进稳定 surface。
**治**: grade 回退 Candidate，status 回退 draft，跑 ≥ 3 次真实场景验证后再升 grade=P0 + status=beta。

### 反模式 2.5: 「status × grade 混用」
```yaml
status: Candidate   # 错: Candidate 是 grade 的值
grade: stable       # 错: stable 是 status 的值
```
**病**: 两轴语义混淆，validator 报错；review 时无法判断真实状态。
**治**: status 取 draft/beta/stable/deprecated；grade 取 Candidate/P0/P1/P2/P3（详见 §3.3）。

### 反模式 3: 「多 Owner Skill」
```yaml
owner_agent: [supervisor, builder]   # 错: 不是 list
shared_with: all                     # 错: 等于无 owner
```
**病**: 责任不清，谁都可以改，最终没人维护。
**治**: owner_agent 单值；shared_with 显式列。

### 反模式 4: 「Reference 堆雪人」
SKILL.md 写到 800 行，所有 reference inline。
**病**: agent 每次加载全文，context 浪费；维护时改一处牵动全文。
**治**: progressive disclosure，常用 inline、低频推到 references/。

### 反模式 5: 「Vague Step」
```
1. 分析需求
2. 设计方案
3. 产出文档
```
**病**: 没有 completion criterion，agent 不知道何时进入下一步。
**治**: 每步加可校验条件（"每条 model 已对账" / "spec frontmatter 通过 review"）。

---

## 11. 维护协议

### 11.1 谁维护
- **owner**: `evolver` agent
- **reviewer**: `reviewer` agent + 人工（重大变更）
- **触发**: 每次 skill 升级 Grade、新增/废弃时同步检视本文件

### 11.2 变更流程
1. 在 `craft/spec-*` 或 `evolve/refine` 中提出修改建议
2. 跑 `review/spec-review` 校验一致性
3. Evolver 合并到本文件
4. 同步更新受影响 skill 的 frontmatter / body

### 11.3 不做什么
- 不复制 mattpocock GLOSSARY 全文（链接即可）
- 不在本文件写 PM/工程领域知识（推到 Tier 1 CSV）
- 不把私有案例（Max Brain 12_Methodology）写入（公开发布风险）

---

## 12. 参考文献

| 文档 | 角色 | 路径 |
|---|---|---|
| mattpocock GLOSSARY | leading words 完整定义源 | `10_Library/13_Open_Source_Reference/mattpocock_skills/skills/productivity/writing-great-skills/GLOSSARY.md` |
| 蓝图 §2.0 | Frontmatter 9 必填字段 + grade 权威 | `docs/vnext-blueprint.md` |
| 蓝图 §2.20 | Agent 8 字段权威 | 同上 |
| 蓝图 §2.24 | 吸收契约 D12 | 同上 |
| 蓝图 §2.25.1 | 28 文件清单与命名 | 同上 |
| superpowers writing-skills | rigid vs flexible 区分 | `10_Library/13_Open_Source_Reference/superpowers/skills/writing-skills/` |

---

## 13. 语言策略（Language Policy）

> 适用范围：vNext P0/P1 SKILL.md 正文、Agent 契约、Reference 文件正文。Kernel Packets、Memory schemas、frontmatter 机器契约字段保持英文。

### 13.1 设计原则

vNext 以中文为主体语言，英文作为机器解析契约层。理由：
- 主要审阅者（Max）为产品经理背景，中文审阅效率高于英文
- 机器解析依赖稳定的关键字（frontmatter 字段名、Section heading、leading word），这些保持英文即可保证解析稳定性
- 大模型对中文语义理解已足够强，不因语言切换损失能力

### 13.2 英文契约层（铁律，不可中文化）

| 元素 | 示例 | 为什么保持英文 |
|---|---|---|
| Frontmatter 字段名 | `name`, `description`, `owner_agent`, `shared_with`, `scope`, `paths`, `invoked`, `when`, `then` | 机器解析契约 |
| Skill / Agent 标识符 | `manage-file`, `craft-spec`, `architect-agent` | 全局路由 key |
| Section heading | `## Invocation`, `## Steps`, `## Reference`, `## Completion Criteria`, `## Failure Modes` | 解析锚点 |
| Step 完成关键字 | `Completion:` | 解析锚点 |
| Failure Mode signal name | `Conflict Blindness`, `Scope Violation`, `False Positive`, `Discipline Decay` | 跨 Skill 引用稳定 |
| description 首词（leading word） | `Context Pointer`, `One-Click Trigger`, `User-Invokable`, `Routing Rule`, `Knowledge Gateway` | 见 §2.24.2 词表 |
| Output Packet / Intent Packet / Evidence Packet | 字段名 `packet_spec`, `fields`, `validation` | 机器契约 |
| Blueprint / Kernel / Memory / Skill / Agent | vNext namespace 术语 | 全局唯一指代 |

### 13.3 中文主体层（这些使用中文）

| 元素 | 示例 |
|---|---|
| description 主体（首词之后） | "当用户输入模糊、过载或路由错位时触发，目标、范围或 Agent 边界隐式时失败。" |
| Invocation bullets | "用户显式调用 `/manage-file`" |
| Step 正文 | "读取目标目录 `_index.md`，确认放置位置..." |
| Completion Criteria 正文 | "目标文件已创建并写入正确位置；`_index.md` 已同步（如适用）" |
| Failure Mode 描述 | "覆盖已有文件未做存在性检查，或并行 `-v1`/`-v2` 未拒绝。" |
| Reference 段说明文字 | "详见 `references/naming-rules.md`" |
| references/ 文件正文 | 全部中文 |

### 13.4 术语首次出现规则

- 首次出现：中文（English），如"渐进披露（Progressive Disclosure）"、"上下文工程（Context Engineering）"
- 后续出现：纯中文即可
- 已是英文专有名词（如 `Output Packet`、`Blueprint`）：保持英文不翻译

### 13.5 description 字段写法

公式：`<English Leading Word> 当 <trigger> 时触发，<failure mode> 时失败。`

示例：
- `Context Pointer 当用户输入模糊、过载或路由错位时触发，目标、范围或 Agent 边界隐式时失败。`
- `One-Click Trigger 当用户显式调用 /craft-spec 时触发，未提供 PRD 输入或决策记录时失败。`

### 13.6 套用范围

- P0 SKILL.md（11 个）：Batch 5-7 逐步中文化
- P1 SKILL.md：发布时直接按此策略
- Agent 契约（§2.20）：描述主体中文化，frontmatter 保持英文
- references/ 文件：正文中文，frontmatter 保持英文

### 13.7 不做什么

- 不翻译 frontmatter 字段名（`name:` 不能改成"名称:"）
- 不翻译 Section heading（`## Steps` 不能改成"## 步骤"）
- 不翻译 Skill/Agent 标识符
- 不在英文契约元素中混用中英文标点
- 不修改已发布的 Kernel Packets / Memory schemas（它们属于机器契约层）

---

## 附录 A: 模板骨架（写新 SKILL.md 时复用）

```markdown
---
name: <bucket>-<verb>-<object>
description: <Leading Word> when <trigger>, fails when <failure mode>
disable-model-invocation: false
can-invoke: []
paths:
  - <relative/path>
status: draft
owner_agent: <one-of-5-agents>
shared_with: []
scope: project
grade: Candidate
---

# <Skill Title>

## When to Use
<触发场景描述>

## Steps
1. <step> — Completion: <criterion>
2. <step> — Completion: <criterion>

## Reference
- <inline reference if any>

## Disclosed References
- `references/<topic>.md` — <when to load>
```

> Frontmatter 10 字段：9 必填（蓝图 §2.0 line 175-187）+ 1 个 `grade` 标签（蓝图 §2.0 line 201-213）。两轴独立，详见 §3.3。
