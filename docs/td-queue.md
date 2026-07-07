---
title: AI Builder OS Harness TODO Queue (TD Queue)
type: harness-state
status: active
created_at: 2026-07-07
owners: [max.ling, claude]
source_of_truth_row: docs/source-of-truth-map.md#row-40
---

# AI Builder OS Harness TODO Queue

> 本文件是 AI Builder OS 的 Harness State 第二层：ID-stable、可关闭可清理、不可丢编号。
> 任何 TD/ID 编号首次出现必须同一 turn 写入本文件，不得只停在对话里。

## §0 Purpose & Principle

### 三层 Harness State Layering

| 层级 | 性质 | 示例 | 失效条件 |
| --- | --- | --- | --- |
| L1 决策记录 | 永久（permanent） | `docs/vnext-decisions/*.md`、Decision Record | 仅在 hard-to-reverse / surprising / real tradeoff 时创建 |
| L2 Harness State | 半持久（semi-durable） | **本文件**、Branch State | ID-stable、可关闭、可清理、不可丢编号 |
| L3 对话 | 临时（ephemeral） | 聊天记录、compaction summary | 不承载任何长期规则 |

### 本文件边界

- **承载**：TD-XX（TODO）、ID-XX（Issue/Diagnosis）编号、状态、来源、关闭条件。
- **不承载**：决策的完整论证（→ ADR）、字段定义（→ template）、模板正文（→ skills/）。
- **重启声明**：2026-07-07 从 TD-01 重启；旧编号映射见 §2。

### 核心原则

1. **ID-stable** — 编号一旦分配，即使 void 也保留行（不得回收）。
2. **可关闭可清理** — done/void 可定期 archive，但编号占位保留。
3. **不可丢编号** — 任何 TD/ID 首次出现在对话，必须同一 turn 落入本文件。
4. **来源必填** — 每个 TD 必须能追溯到 ADR / 蓝图章节 / 用户指令 / 文件 evidence。
5. **不复制长期规则** — 本文件只索引编号和状态，不复制 source-of-truth 内容。

---

## §1 Active TODOs

> 状态枚举：`open`（待办）/ `in_progress`（进行中）/ `gated`（被前置条件阻塞）/ `done`（完成）/ `void`（无效）

### TD-01 — validator 支持 vnext/ 跳过（DONE）

| 字段 | 值 |
| --- | --- |
| 类别 | validator-fix |
| 状态 | done |
| 添加日 | 2026-07-07 |
| 关闭日 | 2026-07-07 |
| 来源 | 用户 Plan C 决策（2026-07-07 会话） |
| 关闭条件 | `npm run validate:builder-os` 通过且 vnext/ 不触发 manifest count mismatch ✅ |
| Evidence | (1) `scripts/validate-vnext.js` 已存在，独立校验 vnext/ 的 frontmatter/section/SECTION_REF。(2) `scripts/validate-builder-os.js:3125-3134` 已用 `if (fs.existsSync(path.join(root, 'vnext')))` 条件挂接 vnext validator，独立块输出 `--- vnext 验证 ---`。(3) 主 validator line 1839 `fs.readdirSync(path.join(root, 'skills'))` 只扫顶层 skills/，不会误扫 vnext/skills/。(4) line 1844-1855 严格保持 8 个 builder core。(5) `npm run validate:builder-os` 实跑通过，输出 `vnext 验证通过` + `Builder OS 验证通过`。 |
| 教训 | Prior session 注册 TD-01 时未读 validate-vnext.js，假设 vnext 未被处理。实际 vnext/ 已被"分开处理"（dedicated validator + 条件挂接），不需要再"跳过"。下次注册 TD 前必须先读相关脚本。 |

### TD-02 — manage-file 修复 `shared_with` 移除 owner builder

| 字段 | 值 |
| --- | --- |
| 类别 | skill-fix |
| 状态 | done |
| 添加日 | 2026-07-07 |
| 关闭日 | 2026-07-07 |
| 来源 | `vnext/references/manage-file-scope-decision.md` §5（旧 TD-08） |
| 关闭条件 | `vnext/skills/manage-file/SKILL.md` 中 `shared_with` 字段移除 owner builder 语义；validator 通过 ✅ |
| 描述 | `manage-file` 当前规则允许 owner 通过 `shared_with` 写入自己的 builder scope，导致 scope 边界被绕过。需移除该 fallback。 |
| Evidence | `manage-file/SKILL.md` frontmatter 为 `owner_agent: builder` + `shared_with: [supervisor, researcher, reviewer, evolver]`，builder 不在 `shared_with` 中；body 无"owner 通过 shared_with 写入自己 scope"的 fallback 文字。 |

### TD-03 — references 術语统一（evolve-skill Step 6 + manage-file Tier 2 references/）

| 字段 | 值 |
| --- | --- |
| 类别 | references-cleanup |
| 状态 | open |
| 添加日 | 2026-07-07 |
| 来源 | `vnext/references/manage-file-scope-decision.md` §5/§7（旧 TD-06） |
| 关闭条件 | `vnext/skills/evolve-memory/SKILL.md` Step 6 与 `vnext/skills/manage-file/SKILL.md` Tier 2 中 `references/` 指向一致；无歧义 |
| 描述 | 两处 skill 对 `references/` 目录的引用语义不一致（一处指 vnext/references/，一处指项目级 references/）。需统一术语并加 SECTION_REF。 |

### TD-04 — blueprint drift（manage-grill & craft-agent-task 章节命名）

| 字段 | 值 |
| --- | --- |
| 类别 | blueprint-drift |
| 状态 | done |
| 添加日 | 2026-07-07 |
| 关闭日 | 2026-07-07 |
| 来源 | 蓝图 §2.21；当前 skill 正文 |
| 关闭条件 | `manage-grill` 的 'Progressive Disclosure' 与蓝图 §2.21 'User-Invokable' 对齐 ✅；`craft-agent-task` 的 'Information Hierarchy' 与蓝图 §2.21 'One-Click Trigger' 对齐 ✅ |
| 描述 | 两个 skill 的正文 section 名与蓝图章节不一致，导致 SECTION_REF 指向模糊。属于 ID-1 batch（蓝图漂移）。 |
| Evidence | `manage-grill` description 首词 `Progressive Disclosure` → `User-Invokable`；`craft-agent-task` description 首词 `Information Hierarchy` → `One-Click Trigger`；Reference 与 Completion Criteria 内部引用同步；与蓝图 §2.21 一致。 |

### TD-05 — references 中 `ref_impl_specificity` frontmatter 字段

| 字段 | 值 |
| --- | --- |
| 类别 | references-cleanup |
| 状态 | done (obsolete) |
| 添加日 | 2026-07-07 |
| 关闭日 | 2026-07-07 |
| 来源 | vnext/references/ 检查发现 |
| 关闭条件 | 字段已不存在；未来 references 新字段须先进入 REFERENCE_FIELDS schema（TD-16）✅ |
| 描述 | 该字段在部分 references 文件出现但无 schema 定义，也无写作规范。属于 ID-1 batch。 |
| Evidence | 当前 `vnext/references/*.md` 4 个 P0 references 文件（codex-step-a/b、manage-file-scope-decision、skill-authoring）均无 `ref_impl_specificity` 字段；该字段为 ID-1 batch 时代遗留，已被 references frontmatter 重整（TD-16）覆盖。 |
| Note | 该字段在 P0 references 4 文件中已不存在；若未来 references 引入新字段，须先入 REFERENCE_FIELDS schema (TD-16)。 |

### TD-06 — 蓝图 §2.25.5 acceptance gap（DONE — 实为 5/6 PASS + 1 自然 defer）

| 字段 | 值 |
| --- | --- |
| 类别 | acceptance-gap |
| 状态 | done |
| 添加日 | 2026-07-07 |
| 关闭日 | 2026-07-07 |
| 来源 | `docs/vnext-blueprint.md` §2.25.5 |
| 关闭条件 | §2.25.5 的 6 条验收标准逐项验证 ✅ |
| Evidence | 2026-07-07 walkthrough：(1) vnext 目录 28 文件骨架 ✅ (2) frontmatter 9 字段 + SECTION_REF 由 validate-vnext.js 实证 ✅ (3) vnext/README.md 5 sections ✅ (4) 三 _index.md 完整可导航 ✅ (5) validator 已挂接 vnext/（TD-01 evidence）✅ (6) GT-01~08 跑通 = Step 4 任务，蓝图原文标注"非 3-D 范围"，自然 defer 到 Step 4 ⏸ |
| 教训 | prior session summary 描述"2/6 ❌"未经实证即登记；实际只有 checkbox 字符未改，内容已全部满足。注册 acceptance-gap TD 必须先逐项 walkthrough。 |
| 残留 | 已由 TD-10/TD-11 在 Batch 9 Commit 2 关闭：蓝图 §2.25.5 的 6 个 checkbox 字符已同步为 `[x]`。 |

### TD-07 — 蓝图 §2.26.4 Step 4 acceptance gap（DONE — 实为 5/5 PASS）

| 字段 | 值 |
| --- | --- |
| 类别 | acceptance-gap |
| 状态 | done |
| 添加日 | 2026-07-07 |
| 关闭日 | 2026-07-07 |
| 来源 | `docs/vnext-blueprint.md` §2.26.4 |
| 关闭条件 | §2.26.4 的 5 条验收标准逐项验证 ✅ |
| Evidence | 2026-07-07 walkthrough：(1) GT-01~08 每条 5 字段（Trigger/Agent 链/Skill 链/Packet/Pass-Fail）全填 ✅（蓝图 line 1330-1416）(2) 5 Agent / 11 Skill / 4 Packet / 4 Memory schema 全覆盖 ✅（line 1326 明确声明）(3) v1 8 个 builder-* 在 §2.26.2 映射表全部找到归属 ✅（line 1424-1431）(4) T1/T2/T3/T4 四组触发条件均有"客观判定方式"列，无主观词 ✅（line 1444-1479）(5) §2.26.3 P1 候选 13 项与 §2.17 Deletion Test 推荐数量一致、顺序一致 ✅ |
| 教训 | 与 TD-06 同 — prior session summary 描述"全部未勾选"基于 checkbox 字符状态而非内容状态。蓝图 checkbox 是文档惯例，验收应以内容实证为准。 |
| 残留 | 已由 TD-10/TD-11 在 Batch 9 Commit 2 关闭：蓝图 §2.26.4 的 5 个 checkbox 字符已同步为 `[x]`。 |

### TD-08 — evolve-skill 提升至 P0（原"越界 29 vs 28 files"，决策为 Option B 纳入）

| 字段 | 值 |
| --- | --- |
| 类别 | scope-adjustment（原 scope-violation） |
| 状态 | done |
| 添加日 | 2026-07-07 |
| 关闭日 | 2026-07-07 |
| 来源 | Batch 7 reviewer 发现（29 vs 28 manifest）；commit `2c7f1c2` + `2eb3f5a` + `d537a5a` |
| 关闭条件 | (1) ADR 0002 落地 ✅；(2) 蓝图全量同步（17 处 + 直接派生覆盖同步）✅；(3) vnext/ 文件同步（README / skills index / evolver）✅；(4) `npm run validate:builder-os` 通过 ✅ |
| 描述 | evolve-skill 蓝图原标 P1（§2.25.1/§2.26.2/§2.17 三处一致），但 P0 阶段被提前实现（commit 2c7f1c2/2eb3f5a/d537a5a），导致 manifest 从 28 → 29。prior session commit 58887af message 误用 TD-08 编号（实际改的是 manage-file shared_with，属 TD-02 范畴）。 |
| 决策 | 用户 2026-07-07 选 Option B（显式纳入 P0）— 理由：evolve-skill 已被事实使用为其他 P0 skill 的设计模板，代码先行+蓝图跟进比强行回退更尊重工程现实。 |
| Evidence | (1) 蓝图 L549 §2.26.2 `evolve-skill \| P1`；(2) L601 §2.17 Deletion Test `evolve-skill \| Lose \| P1`；(3) L1225-1227 §2.25.1 evolve 桶 P0 仅 evolve-memory；(4) commit 2c7f1c2 标题自标 `P1 meta-skill`；(5) commit 58887af message 误用 TD-08 编号（实际改 manage-file shared_with） |
| 关闭 Evidence | Batch 9 Commit 1：`docs/vnext-decisions/0002-evolve-skill-promotion-to-p0.md` 落地；`docs/vnext-blueprint.md` 同步 P0 12 / P1 12 / manifest 29 / GT-08 覆盖；`vnext/README.md`、`vnext/skills/_index.md`、`vnext/agents/evolver.md` 同步；验证摘要见本批最终报告。 |
| 执行 spec | `docs/vnext-decisions/0002-evolve-skill-promotion-to-p0.md` |
| 教训 | (1) prior session 把 P1 越界当作"小修小补"做了 3 个 commit 未触发 reviewer 注意；(2) commit message 误用 TD 编号会污染审计 trail — 必须严格按 td-queue 当前条目对齐；(3) "schema freeze" 纪律需要 reviewer 在每个 manifest count 变化时强制 evidence check |

### TD-09 — Epic: ADR 0001 Harness Knowledge Layering P1 实现

| 字段 | 值 |
| --- | --- |
| 类别 | epic |
| 状态 | gated |
| 添加日 | 2026-07-07 |
| 来源 | `docs/vnext-decisions/0001-harness-knowledge-layering.md`；用户 2026-07-07 提醒（"产品维度 Harness 处理"） |
| 关闭条件 | T1 触发条件满足（8 P0 稳定 + 3 真实项目 + pain×3）后启动 P1 实现 |
| 描述 | 用户曾讨论：不同产品维度（B 端 VS C 端、客户端 VS 中后台、功能 VS 数据 VS 增长运营 VS 策略 VS AI）需要不同的 Harness 知识分层。映射到 ADR 0001 的 4 层模型（Skill Kernel / Product Manifest / Knowledge Layer / Pattern Library）。本 TD 是 epic，拆解为 5 个子项： |
| 子项 1 | Layer 1 Product Manifest schema 设计 |
| 子项 2 | Layer 2 Knowledge Layer 接入协议（Max Brain 复用） |
| 子项 3 | 不同产品维度的 Manifest 模板变体（B 端 / C 端 / 中后台 / 数据 / AI） |
| 子项 4 | T1 触发条件验证机制 |
| 子项 5 | Layer 3 Pattern Library 占位设计 |

### TD-10 — 蓝图 §2.25.5 / §2.26.4 checkbox 字符同步（合并至 TD-11）

| 字段 | 值 |
| --- | --- |
| 类别 | doc-drift |
| 状态 | done |
| 添加日 | 2026-07-07 |
| 关闭日 | 2026-07-07 |
| 来源 | TD-06 / TD-07 walkthrough 残留（合并） |
| 关闭条件 | 蓝图 §2.25.5（6 项）与 §2.26.4（5 项）的 `[ ]` checkbox 字符全部更新为 `[x]`，且与内容实证状态一致 ✅ |
| 描述 | TD-06/TD-07 walkthrough 已实证两节内容全部 PASS。本 TD 与 TD-11（蓝图文件头状态陈旧）合并为单一 doc-drift 任务，在 Batch 9 Commit 2 一次性处理。 |
| Evidence | Batch 9 Commit 2：`docs/vnext-blueprint.md` §2.25.5 6 项 checkbox 与 §2.26.4 5 项 checkbox 已同步为 `[x]`；验证摘要见本批最终报告。 |

### TD-11 — 蓝图 doc-drift 集中清理（文件头状态 + §2.25.5/§2.26.4 checkbox）

| 字段 | 值 |
| --- | --- |
| 类别 | doc-drift |
| 状态 | done |
| 添加日 | 2026-07-07 |
| 关闭日 | 2026-07-07 |
| 来源 | Codex Batch 7 review 反馈 + TD-06/TD-07 walkthrough 残留 |
| 关闭条件 | (1) 蓝图 L5 `**状态**` 字段更新为 `Step 1-4 完成（详见 §3 Change Log）` ✅；(2) §2.25.5 acceptance 6 个 `[ ]` → `[x]` ✅；(3) §2.26.4 acceptance 5 个 `[ ]` → `[x]` ✅；(4) 与内容实证状态一致 ✅ |
| 描述 | Codex 反馈指出：蓝图 L5 `Step 1 + Step 2 完成，Step 3 + Step 4 待生成` 与 L1542-1543 changelog 标注的 `Step 3-D ✅ / Step 4 ✅` 矛盾。同时 TD-06/TD-07 walkthrough 已实证 §2.25.5/§2.26.4 内容全部 PASS，但 checkbox 字符仍为 `[ ]`。本 TD 合并处理。 |
| 执行 spec | Batch 9 Commit 2（ADR 0002 + TD-11 + TD-13 同次 Codex 执行） |
| 关联 | 合并 TD-10（关闭 TD-10 时同步关闭本 TD） |
| Evidence | Batch 9 Commit 2：`docs/vnext-blueprint.md` L5、§2.25.5、§2.26.4、§3 Change Log 已同步；`npm run validate:builder-os` 通过。 |

### TD-12 — taxonomy 不一致（蓝图 §2.0 8-Bucket vs skill-authoring.md L188 6 桶）

| 字段 | 值 |
| --- | --- |
| 类别 | references-cleanup |
| 状态 | done |
| 添加日 | 2026-07-07 |
| 关闭日 | 2026-07-07 |
| 来源 | Codex Batch 7 review 反馈 |
| 关闭条件 | (1) 确认 8-Bucket（蓝图）为 source of truth ✅；(2) `vnext/references/skill-authoring.md` L188 "6 桶必居其一" 改为 "8 桶必居其一"，补 `write-*` / `help-*` 两桶 ✅；(3) 扫描其他 references/skill 文件确保一致 ✅ |
| 描述 | 蓝图 §2.0 L152 声明 `8-Bucket Closed Scheme`（discover/craft/review/build/evolve/write/manage/help）；但 skill-authoring.md L188 写 `6 桶必居其一`，缺 write/help 两桶。Codex 反馈指出这是"实质问题，不是措辞问题"。倾向：蓝图 8 桶为 SoT（理由：8 桶是 Step 2 封闭命名方案、§2.11 桶分布表支撑、L1537 changelog 明确"封闭"）。 |
| 决策 | 蓝图 §2.0 的 8-Bucket 为 source of truth |
| Evidence | Batch 10 Commit 1 (`d8d1ffd`): `skill-authoring.md` L188 6 桶 → 8 桶（含 write/help 两桶），Bucket Fit/Misfit/Checklist 同步；与蓝图 §2.0 L152 一致。 |
| 执行 batch | Batch 10（独立 Codex 执行，不与 ADR 0002 同批） |

### TD-13 — 移除 vnext/skills/ 中 3 处本机绝对路径硬编码

| 字段 | 值 |
| --- | --- |
| 类别 | portability-fix |
| 状态 | done |
| 添加日 | 2026-07-07 |
| 关闭日 | 2026-07-07 |
| 来源 | Codex Batch 7 review 反馈（portability 风险） |
| 关闭条件 | (1) 3 个 SKILL.md 中 `C:\Users\max.ling\.claude\rules\common\*.md` 引用改为 runtime-neutral 表述 ✅；(2) 全 vnext/ 目录 `rg -n "C:\\Users\\max.ling" vnext` 返回 0 结果 ✅；(3) validator 通过 ✅ |
| 描述 | 3 个 skill 的 references section 硬编码本机绝对路径，违反"vNext 是通用 runtime surface"原则：<br>• `vnext/skills/review/review-code/SKILL.md` L44-47（coding-style/security/testing/performance）<br>• `vnext/skills/build/build-commit/SKILL.md` L43-45（git-workflow/security/coding-style）<br>• `vnext/skills/craft/craft-prototype/SKILL.md` L42-43（patterns/testing） |
| 替换策略 | 改为 runtime contract reference 表述（不绑具体路径），例如："本 skill 假设 runtime 提供 coding-style / security / testing 等通用工程纪律；具体规则路径由 runtime adapter 注入"。保留纪律契约，去掉本机路径。 |
| 执行 spec | Batch 9 Commit 3（与 ADR 0002 / TD-11 同次 Codex 执行，独立 commit） |
| Evidence | Batch 9 Commit 3：`review-code`、`build-commit`、`craft-prototype` 的本机绝对路径已替换为 runtime adapter contract；`rg -n "C:\\Users\\max.ling" vnext` 无结果；`npm run validate:builder-os` 通过。 |

### TD-14 — validate-vnext.js validator 能力升级

| 字段 | 值 |
| --- | --- |
| 类别 | validator-hardening |
| 状态 | done |
| 添加日 | 2026-07-07 |
| 关闭日 | 2026-07-07 |
| 来源 | Codex Batch 7 review 反馈 |
| 关闭条件 | validate-vnext.js 新增 5 类校验：(1) exact file list（manifest 一致性）✅；(2) P0/P1 允许清单（无未声明 P1/P2/P3）✅；(3) grade/status enum 校验 ✅；(4) can-invoke 前向引用必须指向存在资产 ✅；(5) 本机绝对路径扫描禁入 ✅ |
| 描述 | Codex 反馈：当前 validator 只校验 frontmatter/section/SECTION_REF 存在，能证明"格式像"，不能证明"vNext 可运行"。P0 acceptance 的可机器证明性依赖此升级。需要单独 spec（可能 ADR 0003）。 |
| 阻塞条件 | TD-15 manifest 文件已落地（exact file list 校验依赖 manifest）✅ |
| Evidence | Batch 10-revised-v2 Commit 4 (`1ba0a60`): `validate-vnext.js` 新增 5 类 surface check (C1-C5)，C4 按方案 a 仅校验 skill `can-invoke`，agent `can_invoke` 作为契约锚点 by design 跳过。 |
| 执行 batch | Batch 10-revised-v2 |

### TD-15 — 新增 vnext/_surface.md manifest（vNext 资产允许清单）

| 字段 | 值 |
| --- | --- |
| 类别 | manifest-establishment |
| 状态 | done |
| 添加日 | 2026-07-07 |
| 关闭日 | 2026-07-07 |
| 来源 | Codex Batch 7 review 建议 2 |
| 关闭条件 | (1) 新增 `vnext/_surface.md`（或 JSON manifest）— 列允许存在的 Agent / Skill / Kernel / Memory / Reference、grade、status、owner、是否 runtime-visible ✅；(2) 与 ADR 0002 后的 P0 范围一致（12 Skill + 5 Agent + 4 Packet + 4 Memory schema + references）✅；(3) validator 升级（TD-14）依赖此文件作为 source of truth ✅ |
| 描述 | Codex 建议：当前 vNext 没有明确的"允许存在清单"，所有 manifest count 检查都依赖蓝图章节隐式断言。建立 `_surface.md` 作为机器可读 manifest，是 TD-14 validator 升级的前置条件。 |
| Evidence | Batch 10-revised Commit 3 (`ad3efc6`): `vnext/_surface.md` 新增，29 行 P0 资产清单（agent=5/skill=12/kernel=4/memory=4/reference=4），observer-only schema，由 TD-14 validator 消费。 |
| 执行 batch | Batch 10-revised（先于 TD-14） |

### TD-16 — references status 语义偏离（references/*.md 用 P0/P1/active 而非 draft/stable/deprecated）

| 字段 | 值 |
| --- | --- |
| 类别 | references-cleanup |
| 状态 | open |
| 添加日 | 2026-07-07 |
| 来源 | Codex Batch 10-revised Commit 2 review 发现（Bug-3） |
| 关闭条件 | (1) 决策 references/*.md frontmatter `status` 字段是否纳入 validator enum 校验；(2) 若纳入，扫描所有 references/*.md 把非 enum 值（P0/P1/active 等）改为 draft/stable/deprecated；(3) 若不纳入，在 _surface.md 注释中明确"references status 是 open namespace"；(4) validator（TD-14 C3）相应调整 |
| 描述 | references/*.md 当前 status 字段值不统一（部分 P0/P1 表示优先级，部分 active 表示状态），与 skill/kernel/memory 的 draft/stable/deprecated enum 不同语义。TD-14 C3 暂跳过 reference 的 status 校验，需独立 ticket 评估：(a) 强制 references 也用 enum；(b) references status 走开放命名（允许 P0/P1/active 等），只在 _surface.md 注释说明 |
| 决策待确认 | 需要用户决策 |
| 执行 batch | Batch 11 |

### TD-17 — agent / kernel / memory 是否需要 grade 字段（ROI 评估）

| 字段 | 值 |
| --- | --- |
| 类别 | schema-decision |
| 状态 | done (wontfix) |
| 添加日 | 2026-07-07 |
| 关闭日 | 2026-07-07 |
| 来源 | Codex Batch 10-revised Commit 2 review 发现（Bug-2 by design） |
| 关闭条件 | (1) 评估"agent/kernel/memory 加 grade 字段"的收益（可被 validator C2 强制）vs 成本（frontmatter freeze 扩展、影响所有现有文件）✅；(2) 决策不加，记录结论与理由 ✅ |
| 描述 | 当前 frontmatter freeze: SKILL_FIELDS 含 grade，AGENT_FIELDS / THREE_FIELD_MANIFEST 不含。Bug-2 是 by design（agent/kernel/memory 不分级，只 skill 分级）。Batch 10-revised 暂保持现状；TD-17 是回头看是否需要扩展的 ROI 评估 ticket |
| 决策 | 保持现状，不为 agent/kernel/memory 增加 `grade` frontmatter 字段。Agent 是契约锚点（不分级），kernel/memory 是被动 schema（被 agent 消费，不需要自评 grade）。需要分级时通过 `_surface.md` 的 grade 列临时标注（observer-only，不进 frontmatter）。frontmatter freeze 成本 > 强制收益。 |
| Evidence | TD-14 C2 已强制 skill grade ∈ {P0, P1}；agent/kernel/memory 分级无运营场景。未来若需要，走 `_surface.md` observer，不进 frontmatter。 |
| 执行 batch | Batch 11（评估，可能 close 为 wontfix） |

### TD-18 — vNext 文档语言约定（heading 英 / content 中）

| 字段 | 值 |
| --- | --- |
| 类别 | docs-convention |
| 状态 | done |
| 添加日 | 2026-07-07 |
| 关闭日 | 2026-07-07 |
| 来源 | Batch 11A user decision + Batch 10-revised language audit |
| 关闭条件 | 新增 `vnext/references/doc-style.md`，明确 heading 英 / content 中的分类冻结决策 ✅ |
| 描述 | 保留 parser-friendly 英文结构锚点（frontmatter key、section heading、SECTION_REF），正文内容中文优先，防止 heading 中英混用扩散。 |
| Evidence | 新增 `vnext/references/doc-style.md`，明确 heading 英 / content 中的分类冻结决策。当前 `vnext/kernel/*.md` / `vnext/memory/*.md` 现状符合约定，无需改动。 |
| 执行 batch | Batch 11B |

---

## §2 Closed / Voided

### 旧 TD 编号映射（重启前）

| 旧编号 | 旧状态 | 新编号 | 说明 |
| --- | --- | --- | --- |
| 旧 TD-01 | void | — | 无文件 evidence，无 ADR，纯对话产物 |
| 旧 TD-04 | void | — | 无文件 evidence，无 ADR |
| 旧 TD-06 | 已迁移 | **TD-03** | 见 `manage-file-scope-decision.md` §5 |
| 旧 TD-08 | 已迁移 | **TD-02** | 见 `manage-file-scope-decision.md` §5 |
| 旧 TD-09 | void | — | 无文件 evidence |
| 旧 TD-10 | void | — | 无文件 evidence |
| 旧 TD-11 | 已迁移 | **TD-01** | 等价于当前 TD-01（validator skip） |

> 重启原因：旧 TD-01/04/09/10 在仓库和 memory 中均无 evidence，只在 compaction summary 中存在；用户 2026-07-07 决定从 TD-01 重启，清掉 void 行但保留编号映射作为审计 trail。

---

## §3 Maintenance Protocol

### Add（新增 TD）

1. 同一 turn 内必须完成：分配编号 → 写入 §1 → 提交 source evidence（ADR / 蓝图章节 / 文件路径 / 用户指令引用）。
2. 编号单调递增，不复用 void 编号。
3. 状态默认 `open`，`gated` 必须在描述中说明阻塞条件。

### Update（状态变更）

- `open` → `in_progress`：开始处理时更新，并在对话中说明。
- `in_progress` → `done`：必须附 commit SHA 或文件路径作为 evidence。
- 任何状态 → `void`：必须说明理由并保留行（不得删除）。
- 任何状态 → `gated`：必须说明阻塞条件，并在描述中链接前置 TD。

### Close（完成）

- `done` 状态的 TD 在下次 release seal 后可清理编号占位（但编号永不回收）。
- 关闭时建议在 §5 Change Log 记录一行。

### Archive（归档）

- 每个版本发布后（release seal 后），将 `done` TD 移至 `docs/td-queue-archive/<version>.md`。
- void TD 保留在本文件 §2，不归档。

### Audit（审计）

- 每次会话开始：读取本文件 §1，确认当前 active TD 列表。
- 每次 release seal 前：遍历所有 `open` TD，确认是否仍 relevant；若否，标记为 void 或 close。
- Reviewer agent 在 review 时必须检查：本次变更是否引入了未登记的 TD/ID。

---

## §4 Relationships with Other Files

| 文件 | 关系 |
| --- | --- |
| `docs/source-of-truth-map.md` row 40 | 本文件是 row 40 的 SoT；row 40 是本文件的索引 |
| `docs/vnext-decisions/*.md` | ADR 引用 TD 编号（不复制内容）；TD-09 epic 是 ADR 0001 的执行追踪 |
| `docs/release-seal-*.md` | Release seal 记录当前版本的 TD 关闭状态快照 |
| `vnext/references/manage-file-scope-decision.md` | §5/§7 引用 TD-02/TD-03（旧 TD-08/TD-06） |
| Branch State | 临时运行状态；本文件是 ID-stable 持久层 |
| 对话 / compaction summary | 临时；任何 TD 必须落入本文件才算存在 |

---

## §5 Change Log

| 日期 | 变更 | 操作者 |
| --- | --- | --- |
| 2026-07-07 | 初始化本文件；从 TD-01 重启；登记 9 个 active TD（含 TD-09 epic）；建立旧编号映射 | claude + max.ling |
| 2026-07-07 | TD-01 关闭为 done — 实证 vnext validator 已存在并已挂接（validate-vnext.js + line 3125-3134），npm run validate:builder-os 通过 | claude |
| 2026-07-07 | TD-06 关闭为 done — §2.25.5 walkthrough 实证 5/6 PASS + 1 自然 defer（item 6 蓝图原文标注属 Step 4 范围） | claude |
| 2026-07-07 | TD-07 关闭为 done — §2.26.4 walkthrough 实证 5/5 PASS（内容全部满足，仅 checkbox 字符未勾选） | claude |
| 2026-07-07 | 登记 TD-10 — 合并 TD-06/TD-07 残留为单一蓝图 checkbox 字符同步任务（doc-drift） | claude |
| 2026-07-07 | TD-08 决策为 Option B（用户选择）— ADR 0002 落地，作为 Codex 执行 spec；状态 open → in_progress | claude + max.ling |
| 2026-07-07 | 登记 TD-11~TD-15（Codex Batch 7 review 反馈拆解）：TD-11 doc-drift / TD-12 taxonomy / TD-13 portability / TD-14 validator-hardening / TD-15 manifest；TD-10 合并至 TD-11 | claude + max.ling |
| 2026-07-07 | 用户同意 Batch 9 三 commit 一起交 Codex（ADR 0002 / TD-11 / TD-13）；TD-12/14/15 进 Batch 10 | max.ling |
| 2026-07-07 | TD-08 关闭为 done — ADR 0002 事实纳入：evolve-skill 提升至 P0，P0 Skill 11→12，manifest 28→29；验证输出见 Batch 9 Commit 1 记录 | codex |
| 2026-07-07 | TD-10 关闭为 done — 蓝图 §2.25.5 / §2.26.4 checkbox 字符与 walkthrough 实证状态同步 | codex |
| 2026-07-07 | TD-11 关闭为 done — 蓝图 L5 状态字段对齐 Step 3-D / Step 4 已完成事实，合并关闭 TD-10 | codex |
| 2026-07-07 | TD-13 关闭为 done — 移除 vnext/skills/ 中 3 处本机绝对路径硬编码，改为 runtime adapter contract；validator 通过 | codex |
| 2026-07-07 | TD-12 关闭为 done — skill-authoring.md L188 6→8 桶，Bucket Fit/Misfit/Checklist 同步（d8d1ffd） | codex |
| 2026-07-07 | TD-15 关闭为 done — vnext/_surface.md 新增 29 行 P0 manifest（ad3efc6） | codex |
| 2026-07-07 | TD-14 关闭为 done — validate-vnext.js 新增 C1-C5 surface check，C4 方案 a 仅校验 skill can-invoke（1ba0a60） | codex |
| 2026-07-07 | 登记 TD-16（references status 语义偏离）+ TD-17（agent/kernel/memory grade ROI），进 Batch 11 评估 | codex |
| 2026-07-07 | TD-05 close obsolete — ref_impl_specificity 字段在 P0 references 已不存在，被 TD-16 重整覆盖 | codex |
| 2026-07-07 | TD-17 close wontfix — agent/kernel/memory 不分级；frontmatter freeze 成本 > 收益；需要时走 _surface.md observer | codex |
| 2026-07-07 | TD-18 close done — vnext/references/doc-style.md 落地，heading 英 / content 中约定成型 | codex |
| 2026-07-07 | TD-02 close done — manage-file frontmatter 已符合 "shared_with 移除 owner builder"，无需 body 修改 | codex |
| 2026-07-07 | TD-04 close done — manage-grill/craft-agent-task description 首词对齐蓝图 §2.21 (User-Invokable / One-Click Trigger) | codex |
