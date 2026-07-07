---
name: codex-step-b-review-feedback
type: reviewer-feedback
status: stable
reviewer: claude
audience: codex
date: 2026-07-07
---

# Codex Step B Review Feedback

**评审人**: Claude Code (reviewer)
**评审对象**: Codex Step B 产出 — 28 个 P0 manifest 文件 frontmatter 填充 + SECTION 占位展开
**评审时间**: 2026-07-06
**整体裁决**: ✅ **APPROVED with conditions**（条件可立即修复，不阻塞 Step C 准入）

---

## A. 整体裁决

### A.1 通过项 (V1-V10)

| 验证项 | 结果 | 证据样本 |
| --- | --- | --- |
| V1 文件数 | ✅ 28 | `find vnext -name "*.md" \| wc -l` = 30（含 references 内部文件） |
| V2 v1 不变 | ✅ | git diff scoped to vnext/ only |
| V3 frontmatter 字段数 | ✅ | Skill=10（9+grade），Agent=8（无 grade），Root/Index/Kernel/Memory=4 |
| V4 TBD 残留 | ✅ TBD=0 | description 字段全部填充真实值 |
| V5 SECTION 展开 | ✅ | 每个 SECTION 均为 1 句话 stub + SECTION_REF 锚点 |
| V6 描述公式 | ✅ | "Leading Word when trigger, fails when failure mode" 公式严格遵守 |
| V7 owner/shared | ✅ | 与 §2.1-§2.5 Agent 角色对齐 |
| V8 scope 字段 | ✅ | shared Skills 标 `global`；project-scoped 标 `project` |
| V9 SECTION_REF | ✅ | 全部指向 docs/vnext-blueprint.md 具体章节锚点 |
| V10 validator | ✅ | `npm run validate:builder-os` 通过；fail_count 89→0 |

### A.2 description 公式样本（11/11 Skills 全抽样）

| Skill | leading word | trigger | failure mode | 公式符合 |
| --- | --- | --- | --- | --- |
| craft-spec | Spec shaping | PRD/Mini Spec/Eng Request/Requirements needed | acceptance criteria or audience absent | ✅ |
| craft-prototype | Prototype crafting | runnable high-fidelity mock requested | mock data leaks or handoff absent | ✅ |
| craft-agent-task | Task packaging | Supervisor decomposes or hands off | done criteria or stop conditions missing | ✅ |
| manage-prompt | (隐式) | input vague/overloaded | goal, scope, or context implicit | ⚠️ 缺显式 leading word |
| manage-grill | Grill | ambiguity exceeds threshold | questions assume goal or exceed scope | ✅ |
| manage-file | File placement | asset must be created/moved/versioned | target index or path unchecked | ✅ |
| discover-research | Research synthesis | topic needs evidence | claims lack source/confidence/recency | ✅ |
| review-doc | Document review | deliverable ready | HALO issues lack severity/evidence/fix path | ✅ |
| review-code | Code review | changes need self-check or review | tests/evidence/risk tier absent | ✅ |
| build-commit | Commit discipline | verified changes need commit | staging broad or hooks bypassed | ✅ |
| evolve-memory | Memory writeback | preference/feedback/project/reference signal | duplicate or unverified memory written | ✅ |

**建议（非阻塞）**: manage-prompt 的 description 改为 `Prompt shaping when input is vague or overloaded, fails when goal, scope, or context remain implicit.` — 补显式 leading word，与其他 10 Skill 一致。

---

## B. Q6 裁决（reviewer 决策点）

### B.1 裁决：非 Skill 文件退化为 3 字段

**Decision**: 移除 Kernel/Memory/Index/Root 文件的 `grade: Candidate`，保留 3 字段（name/type/status）。

### B.2 裁决依据（证据链）

| 来源 | 行号 | 原文（关键句） | 推论 |
| --- | --- | --- | --- |
| 蓝图 §2.0 | 201-203 | "Skill 分级标签（矫正 ChatGPT Risk 2）: **每个 Skill 在 frontmatter 同时带 `grade` 字段**" | grade 定义为 Skill 专属 |
| 蓝图 §2.0 | 205-211 | grade 取值表（Candidate/P0/P1/P2/P3）语义全部围绕 "Skill 候选清单/最小闭环/可选增强/长尾补完/仅记录" | 语义与 Memory/Kernel/Index 无关 |
| 蓝图 §2.22 | 999-1015 | Memory schema 字段：id/type/scope/status/source/confidence/last_verified/detail_ref/content | 无 grade |
| 蓝图 §2.23 | 1041-1083 | Kernel Packet schema 字段：raw_input/probe_depth/parsed/decision_card/routing/created_at | 无 grade |
| 蓝图 §2.20 | Agent 章节 | Agent frontmatter 8 字段定义中无 grade | Agent 与非 Skill 文件一致，均无 grade |

### B.3 validator 影响评估

- 现状：validator 已支持多类型 schema（Skill=10 / Agent=8 / 其他=4）
- 改后：validator 增加 1 类（其他=3），不影响 Skill/Agent schema 校验逻辑
- Codex 担忧"4-field 一致性简化 validator"的反论不成立：schema 变体本就是 validator 常态

### B.4 Codex 需要执行的修复动作

对以下 8 类文件（共约 14 个）移除 `grade: Candidate` 行：

1. `vnext/README.md`
2. `vnext/agents/_index.md`
3. `vnext/skills/_index.md`
4. `vnext/kernel/_index.md`（如果存在）
5. `vnext/memory/_index.md`（如果存在）
6. `vnext/kernel/*.schema.md`（4 个 Kernel Packet 文件）
7. `vnext/memory/*.schema.md`（4 个 Memory schema 文件）
8. `vnext/` 根目录其他非 Skill / 非 Agent 索引文件

**修复后**: `npm run validate:builder-os` 必须仍 PASS。

---

## C. 已识别的蓝图遗留 stale 文本（不阻塞 Step C，留待 Step D 修蓝图）

> Codex Step B 忠实复制了蓝图，但蓝图自身存在遗留点。Step D 处理蓝图时统一清理。

### C.1 `craft-test-case` 前向引用（蓝图 §2.21 line 945, 959）

- `review-doc` 和 `review-code` 的 `can-invoke: [craft-test-case, evolve-memory]` 引用了 P1 Skill `craft-test-case`
- 蓝图 line 588 明确: `craft-test-case | Reviewer 必备；缺失则 review-e2e 无输入 | Lose | P1`
- **处置**: Step B 不修（Codex 忠实复制无错）；Step D 修蓝图时决定改为 `[evolve-memory]` 或保留为前向引用标记

### C.2 `Helper` Agent 残留（蓝图 §2.21 line 992）

- 蓝图 §2.0 line 465 D8 决策: "P0 压缩为 5 Agent (Supervisor/Researcher/Builder/Reviewer/Evolver)；**Writer/Helper 降级为 Skill bucket**"
- 但蓝图 §2.21 line 992 仍保留 `shared_with: [Supervisor, Helper]`
- Codex 复制到 `evolve-memory.md` 形成 `shared_with: [supervisor, helper]`
- **处置**: Step D 清理蓝图遗留；Step C 阶段如能一并修正更好（见 D.2.2）

### C.3 处置原则

- Step B 验收不要求修复蓝图 stale 文本（蓝图是 source-of-truth，Codex 忠实复制无错）
- Step D 专门处理蓝图一致性清理
- Step C 受影响项已在 D.2 列为选做

---

## D. Step C 准入清单（Definition of Ready）

Codex 在启动 Step C 前，必须完成以下 2 项 Step B 收尾动作：

### D.1 必做（阻塞性）

- [ ] **D.1.1** 移除约 14 个非 Skill 文件的 `grade: Candidate`（见 B.4 文件清单）
- [ ] **D.1.2** 重跑 `npm run validate:builder-os` 确认 PASS

### D.2 选做（非阻塞，但建议在 Step C 启动前一并处理）

- [ ] **D.2.1** manage-prompt description 改为 `Prompt shaping when input is vague or overloaded, fails when goal, scope, or context remain implicit.`（补显式 leading word）
- [ ] **D.2.2** evolve-memory 的 `shared_with: [supervisor, helper]` 改为 `[supervisor, builder, reviewer]`（移除不存在的 helper）— 与 C.2 蓝图遗留一并处理

### D.3 不做（留待 Step D）

- 蓝图 §2.21 line 945/959/992 的 stale 文本清理
- Kernel Packet / Memory schema 的字段正式定义（Step C 仍以 stub 为主，Step D 填充）

---

## E. Step C 任务范围（kickoff 提示）

Step C 的核心目标：把 SECTION 占位 stub 展开为可执行的工作指令。

**Step C 允许**:
- ✅ 展开 SECTION 内容为 3-5 行可执行描述（非 stub）
- ✅ 添加 Reference 章节的具体引用路径（如 `skill-authoring.md §3.1`）
- ✅ 在 Completion Criteria 中给出可机器验证的判据（如 `grep -c "TBD" SKILL.md == 0`）
- ✅ 在 Failure Modes 中给出反模式的具体信号词

**Step C 禁止**:
- ❌ 新增 P1/P2/P3 Skill 文件（仅展开 11 P0）
- ❌ 修改 v1 文件（v1 进入只读冻结状态）
- ❌ 修改蓝图（蓝图修改统一在 Step D）
- ❌ 引入新的 frontmatter 字段（字段定义冻结）
- ❌ 把 SECTION 写成完整业务规则（业务规则留待 Step D 与蓝图对齐后填）
- ❌ 引入 new schema/section（5 SECTION 结构冻结）

---

## F. 给 Codex 的下一步指令

```
TASK: Step B 收尾 + Step C 准备

1. 执行 D.1.1 + D.1.2（必做，阻塞性）
2. 决定 D.2.1 + D.2.2 是否一并处理（建议都做）
3. 等 reviewer 确认 Step C kickoff

REFERENCE:
- 本文件 §B.4 文件清单
- 蓝图 §2.0 line 201-213（grade 字段定义）
- 蓝图 §2.22 / §2.23（Memory/Kernel Packet schema 无 grade）

CONSTRAINTS:
- 不修改 v1 文件
- 不修改蓝图
- 不新增 P1+ Skill 文件
- 完成后报告：修改文件清单 + validator 输出
```

---

## G. 评审签字

- 评审人: Claude Code (reviewer agent)
- 评审时间: 2026-07-06
- 下一步: 等 Codex 完成 D.1 后回复，reviewer 二次确认后启动 Step C
