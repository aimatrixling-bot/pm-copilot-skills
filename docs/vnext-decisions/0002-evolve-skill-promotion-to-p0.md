---
title: evolve-skill 提升至 P0（事实纳入）
adr_id: 2
status: Accepted
phase_target: vnext-p0
created: 2026-07-07T00:00:00.000Z
deciders:
  - max.ling
  - claude
related_blueprint_sections:
  - §2.17
  - §2.21
  - §2.25.1
  - §2.25.5
  - §2.26.2
  - §2.26.3
  - §2.26.4
related_td: TD-08
supersedes: []
---
# ADR 0002 — evolve-skill 提升至 P0（事实纳入）

## Status

Accepted — 用户 2026-07-07 决策选 Option B（显式纳入 P0），并指示本 ADR 同时作为 Codex 执行 spec。

用户原话：
> "我倾向于B，纳入P0——既然已经实现、并且我们确实是按这个skill在设计其他P0的skill，我们也应该尊重事实（蓝图并非完全不可调整，只要朝着正确的目标前进而不是走偏就行）"

## Context

### 触发事件

Batch 7 reviewer 发现 `vnext/skills/` 实际有 12 个 SKILL.md，但蓝图 §2.25.1 声明的 P0 manifest 是 28 文件（含 11 skill）。`evolve-skill` 在 P0 阶段被实现，导致 manifest 计数从 28 → 29。

### Evidence chain（独立来源 ≥3）

1. **蓝图三处独立标记 P1**（一致性高，非笔误）：
  - L549 §2.26.2：`| evolve | evolve-skill | P1 | Iron Law D9 已就位...`
  - L601 §2.17 Deletion Test：`| evolve-skill | Evolver 失去核心元能力... | Lose | P1（D9 已就位可后补） |`
  - L1225-1227 §2.25.1：evolve 桶 P0 仅列 `evolve-memory`

2. **P0 阶段被实现的 3 个 commit**：
  - `2c7f1c2` — 标题自标 `P1 meta-skill`（commit message 自认 P1）
  - `2eb3f5a` — evolve-skill 内容扩展
  - `d537a5a` — evolve-skill 引用接入

3. **prior session commit message 误用 TD 编号**：
  - `58887af` message 标注 "(TD-08, TD-03)"，实际改动是 `manage-file/craft-spec` 的 `shared_with` 字段（属 TD-02/TD-03 范畴），与 evolve-skill 无关
  - 此误用污染了审计 trail，本 ADR 一并纠正

### 为什么必须现在决策

- `vnext/skills/evolve-skill/SKILL.md` 已被 `vnext/agents/evolver.md` L43 引用："P0 可调用 evolve-memory；evolve-skill、evolve-harness-audit、manage-eval-session 作为后续能力保留契约引用"
- 蓝图 §2.26.3 P1 候选列表第 1 项即 `evolve-skill（D9 Iron Law 已就位，仅缺执行入口；最高 ROI）`
- 事实状态：evolve-skill 已被当作其他 P0 skill 的设计模板使用（manage-* / craft-* 系列参考其元能力结构）
- schema freeze 纪律要求 manifest count 漂移必须立即处理，不得积累

## Decision

### D1 — 选择 Option B（显式纳入 P0），否决 Option A（回退到 P1）

**Option A（回退）**：删除 `vnext/skills/evolve-skill/SKILL.md`，保留蓝图 P1 标记，等 T1 gate 后再升级。
- 否决理由：(1) 已实现的资产被事实使用为设计模板，删除违背工程现实；(2) 回退会让其他 P0 skill 的设计参考失去根据；(3) 蓝图 §2.26.3 已自证"最高 ROI"，提前纳入只是把 T1 gate 的结论前置。

**Option B（纳入）**：保留 `vnext/skills/evolve-skill/SKILL.md`，全量同步蓝图（17 处）+ vnext/ 文件（4 处）+ 本 ADR。
- 采纳理由：尊重"代码先行+蓝图跟进"的工程现实；用户明确表态"蓝图并非完全不可调整，只要朝着正确的目标前进而不是走偏就行"；evolve-skill 升级路径本就确定，只是时间提前。

### D2 — 五条红线缓解措施（防止"先上车后补票"演变为漂移惯例）

| # | 措施 | 操作 |
| --- | --- | --- |
| M1 | 本 ADR 必须先落地，再允许 Codex 执行 blueprint 同步 | ADR Accepted → Codex 按 Implementation Manifesto 修改 |
| M2 | 17 处蓝图变更必须一次性全量同步，禁止分批 | Part A 表格作为 Codex 单次 commit 的 checklist |
| M3 | 同步完成后立即跑 `npm run validate:builder-os` | Part G 列出验证命令 |
| M4 | validator 若有 manifest count 断言，一并更新 | Part E 列出 validator 改动点 |
| M5 | TD-08 关闭条件全部满足后在 td-queue.md §5 记录一行 | 关闭日附 commit SHA |

### D3 — P0 Skill 计数 11 → 12

- 蓝图 §2.25.1：`11 P0 Skill` → `12 P0 Skill`
- 蓝图 §2.25.5 acceptance：`11 P0 Skill 全覆盖` → `12 P0 Skill 全覆盖`
- P0 manifest 文件总数：28 → 29（11 skill → 12 skill）

### D4 — P1 候选 13 → 12

- 蓝图 §2.26.3 P1 priority list 第 1 项 `evolve-skill` 移除
- §2.17 Deletion Test 中 `evolve-skill | P1` 改 `P0`
- §2.26.2 L549 表格行 `evolve-skill | P1` 改 `P0`

## Consequences

### 正向

- ✅ 蓝图与代码一致，manifest count 漂移归零
- ✅ 其他 P0 skill 的设计参考链得到正式承认
- ✅ Evolver agent 在 P0 阶段可合法调用 evolve-skill（与 evolver.md L43 对齐方式升级为正式 P0）
- ✅ P1 解锁路径更清晰（少一个候选 = 少一个未来的歧义点）

### 负向 / 风险

- ⚠️ P0 范围扩大 1 个 skill，Step C 工作量增加约 8%（1/12）
- ⚠️ "先上车后补票"模式若被复用为惯例，会侵蚀 schema freeze 纪律 — 由 M1-M5 红线措施对抗
- ⚠️ 历史文档（review packet / 老版本 release seal）仍会引用"11 P0 Skill"，不可能回改 — 通过本 ADR footnote 留痕

### Neutral

- ADR 0001（Harness Knowledge Layering）不受影响，evolve-skill 在 Layer 1/2/3 的归属不变

## Implementation Manifesto

> Codex 按 Parts A-H 在**单次 commit** 中完成全量同步。任何"分批落地"都要先回本 ADR 增加 D5 决策。

### Part A — 蓝图 17 处行级变更 checklist

| # | 行号 | 章节 | 旧 | 新 |
| --- | --- | --- | --- | --- |
| 1 | L549 | §2.26.2 | `\ | evolve \ | evolve-skill \ | P1 \ | Iron Law D9 已就位...` | `\ | evolve \ | evolve-skill \ | P0 \ | Iron Law D9 已就位，已事实纳入（ADR 0002） \ | ` |
| 2 | L601 | §2.17 | `\ | evolve-skill \ | Evolver 失去核心元能力... \ | Lose \ | P1（D9 已就位可后补） \ | ` | `\ | evolve-skill \ | Evolver 失去核心元能力... \ | Lose \ | P0（ADR 0002 纳入） \ | ` |
| 3 | L638 | §2.17 末 | `\ | P1 \ | 13 \ | 验证 P0 后立即补...` | `\ | P1 \ | 12 \ | 验证 P0 后立即补...` |
| 4 | L835 | §2.21 Step 3-C ② 标题 | `### 2.21 Step 3-C ② — P0 Skill Frontmatter（11 项）` | `### 2.21 Step 3-C ② — P0 Skill Frontmatter（12 项）` |
| 5 | L1109 | §2.25 intro | `5 Agent + 11 P0 Skill + Memory 4 类 + 4 Kernel Packet = P0 最小闭环可执行` | `5 Agent + 12 P0 Skill + Memory 4 类 + 4 Kernel Packet = P0 最小闭环可执行` |
| 6 | L1192 | §2.25 目录树注释 | `# 11 P0 Skill（§2.21）` | `# 12 P0 Skill（§2.21）` |
| 7 | L1225-1227 | §2.25.1 evolve 桶 | P0 仅 `evolve-memory` | P0 = `evolve-memory` + `evolve-skill` |
| 8 | L1243 | §2.25 文件总数 | `1 README + 6 agent specs + 11 skill SKILL.md + 1 skill _index + 4 kernel schemas + 5 memory files = 28 个文件` | `... + 12 skill SKILL.md + ... = 29 个文件` |
| 9 | L1279 | §2.25.5 acceptance | `[ ] vnext/ 目录树按本节创建（28 个文件骨架...）` | `[x] vnext/ 目录树按本节创建（29 个文件骨架...）` |
| 10 | L1298 | §2.26 GT 覆盖 | `8 个 GT 并集必须覆盖全部 5 Agent / 11 P0 Skill / 4 Packet / 4 类 Memory schema` | `... 12 P0 Skill ...` |
| 11 | L1326 | §2.26.1 | `11 P0 Skill 全部被至少 1 个 GT 主路径覆盖 ✓` | `12 P0 Skill 全部被至少 1 个 GT 主路径覆盖 ✓` |
| 12 | L1455 | §2.26.3 P1 候选 | `1. evolve-skill（D9 Iron Law 已就位，仅缺执行入口；最高 ROI）` | 移除该项，原 #2 升为 #1，依次重排 |
| 13 | L1484 | §2.26 升级图 | `P0 (11 Skill + 5 Agent)` | `P0 (12 Skill + 5 Agent)` |
| 14 | L1486 | §2.26 升级图 | `P1 (+7 Skill 候选，分批解锁，最高优先 evolve-skill)` | `P1 (+6 Skill 候选，分批解锁）` |
| 15 | L1498 | §2.26.4 acceptance | `5 Agent 全覆盖；11 P0 Skill 全覆盖` | `5 Agent 全覆盖；12 P0 Skill 全覆盖` |
| 16 | L1522 | §2.26.4 landing | `28 个 P0 文件骨架 + 11 skills` | `29 个 P0 文件骨架 + 12 skills` |
| 17 | L1542 | §2.26.4 landing 备注 | 同 #16 模式 | 同 #16 模式 |

> Codex 执行时若发现行号偏移（因其他变更），按章节锚点 + 旧文本匹配定位；不允许"找不到就跳过"。

### Part B — 蓝图新增 Changelog 条目

在蓝图末尾或 changelog 区追加：
```
- 2026-07-07 — ADR 0002：evolve-skill 从 P1 提升至 P0（事实纳入）。P0 Skill 11→12，文件总数 28→29。17 处行级同步见 ADR 0002 Part A。
```

### Part C — §2.26.2 L549 表格行替换（展开版）

旧：
```markdown
| evolve | evolve-skill | P1 | Iron Law D9 已就位，仅缺执行入口；最高 ROI |
```
新：
```markdown
| evolve | evolve-skill | P0 | Iron Law D9 已就位；ADR 0002 事实纳入（2026-07-07） |
```

### Part D — §2.17 L601 表格行替换（展开版）

旧：
```markdown
| evolve-skill | Evolver 失去核心元能力，无法根据 Delivery Retrospective 升级 skill | Lose | P1（D9 已就位可后补） |
```
新：
```markdown
| evolve-skill | Evolver 失去核心元能力，无法根据 Delivery Retrospective 升级 skill | Lose | P0（ADR 0002 纳入） |
```

### Part E — vnext/ 文件变更（6 处）

| # | 文件 | 旧 | 新 |
| --- | --- | --- | --- |
| E1 | `vnext/README.md` L15 | `P0 范围包含 5 Agent、11 Skill、4 Kernel Packet、4 Memory schema` | `P0 范围包含 5 Agent、12 Skill、4 Kernel Packet、4 Memory schema` |
| E2 | `vnext/README.md` L32 | `结构性检查：28 个清单文件保持存在` | `结构性检查：29 个清单文件保持存在` |
| E3 | `vnext/skills/_index.md` L14 | `vnext/skills/ 索引（index）11 个为最小闭环选择的 P0 Skill` | `... 12 个 ...` |
| E4 | `vnext/skills/_index.md` L24 | `build/evolve：build-commit、evolve-memory` | `build/evolve：build-commit、evolve-memory、evolve-skill` |
| E5 | `vnext/agents/evolver.md` L43 | `P0 可调用 evolve-memory；evolve-skill、evolve-harness-audit、manage-eval-session 作为后续能力保留契约` | `P0 可调用 evolve-memory、evolve-skill；evolve-harness-audit、manage-eval-session 作为后续能力保留契约引用` |
| E6 | validator 脚本（若含 manifest count 断言） | 检查 `scripts/validate-vnext.js` 是否硬编码 28 / 11；若有，更新为 29 / 12 并在 commit message 标注 | — |

### Part F — 历史文档 footnote

- `docs/release-seal-*.md`、Review Packet 等历史文档**不回改**
- 本 ADR §Status 已留痕"事实纳入"，未来 reader 通过 ADR 0002 桥接历史"11 P0 Skill" → "12 P0 Skill"

### Part G — 验证命令

Codex 执行完 Parts A-F 后，必须依次跑：
```bash
npm run validate:builder-os
npm run validate:runtime-adapters   # 若受影响
npm pack --dry-run --json           # 确认 package surface 未意外变化
```
全部通过才算 D2-M3 满足。

### Part H — Commit message 与分支策略

- Branch：`vnext/p1.4-batch9-adr0002`（或 Codex 当前惯例命名，遵循 `vnext/p1.4-batch*` 模式）
- Commit message 模板：
```
  refactor(vnext): promote evolve-skill to P0 per ADR 0002 (TD-08)

  - Blueprint: 17 line-level sync (Part A)
  - vnext/: 5 file changes (Part E)
  - Manifest count: 28→29, P0 Skill 11→12, P1 candidates 13→12
  - Validation: npm run validate:builder-os passed

  Refs: ADR 0002, TD-08
```
- Merge：ff-only merge to `vnext/main`（Codex 标准流程）

## Execution Checklist

Codex 单次执行流程（按序）：

- [ ] 1. 读取本 ADR Parts A-H，确认行号/章节锚点对齐当前蓝图
- [ ] 2. 创建分支 `vnext/p1.4-batch9-adr0002`
- [ ] 3. 执行 Part A 17 处蓝图行级变更（单 commit）
- [ ] 4. 执行 Part B（追加 changelog 条目）
- [ ] 5. 执行 Part E 6 处 vnext/ 文件变更（含 validator 检查）
- [ ] 6. 跑 Part G 三条验证命令，截取输出
- [ ] 7. 全绿后按 Part H 模板提交 commit
- [ ] 8. ff-only merge 到 `vnext/main`
- [ ] 9. 回 `docs/td-queue.md` TD-08：状态 `in_progress` → `done`，附 commit SHA + merge SHA + validator 输出摘要作为 Evidence
- [ ] 10. 在 td-queue.md §5 追加一行 Change Log

## Rollback

若 Codex 执行后发现非预期影响（例如 validator 持续失败、P0 acceptance 检查出新的不一致）：

1. **代码层面回滚**：`git revert <merge-sha>` on `vnext/main`（保留 ADR 0002 文件本身作为决策留痕）
2. **状态降级**：TD-08 从 `in_progress` 回到 `open`，本 ADR Status 从 `Accepted` 改 `Superseded` 或 `Withdrawn`
3. **重新决策**：回 ADR 重新讨论 Option A vs Option C（例如"P0 保留但禁止 Evolver 在 P0 调用"等中间态）

## References

- `docs/td-queue.md` TD-08（执行追踪）
- `docs/vnext-blueprint.md` §2.17 / §2.21 / §2.25.1 / §2.25.5 / §2.26.2 / §2.26.3 / §2.26.4
- `docs/vnext-decisions/0001-harness-knowledge-layering.md`（ADR 模板参考）
- 相关 commits：`2c7f1c2` / `2eb3f5a` / `d537a5a` / `58887af`（误用 TD-08 编号，本 ADR 纠正）

## Change Log

| 日期 | 变更 | 操作者 |
| --- | --- | --- |
| 2026-07-07 | 初始版本，用户 Accept Option B，作为 Codex 执行 spec | claude + max.ling |
