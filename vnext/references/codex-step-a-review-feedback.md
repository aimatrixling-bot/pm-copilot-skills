---
title: Codex Step A Review Feedback
audience: codex
reviewer: claude
date: 2026-07-06
status: APPROVED for Step B (conditional)
---

# Codex Step A Skeleton — Review Feedback

> **结论**: APPROVED for Step B conditional on Q1/Q2/Q3 clarification（详见下文）。整体质量优秀，28 文件结构符合蓝图 §2.25.1，frontmatter/section 占位规范一致。

---

## A. RESOLVED（不再待澄清）

### Q1 — RESOLVED：双字段（status + grade）保留

**结论**: Codex 当前 10 字段（9 必填 + grade）设计**正确**，蓝图权威。

**证据链**:
- 蓝图 line 175：「9 个字段（缺失即 validator 报错）」
- 蓝图 line 184：`status` enum = `draft` / `beta` / `stable` / `deprecated`
- 蓝图 line 203-211：每个 Skill **同时**带 `grade` 字段（Candidate/P0/P1/P2/P3）
- 蓝图 line 837：「9 必填字段 + grade」
- 蓝图 line 854-994：11 个 P0 skill 示例**全部**带 `status` + `grade`

**两轴独立（正交）**:

| 字段 | enum | 语义 |
|---|---|---|
| `status` | draft/beta/stable/deprecated | 工程生命周期 |
| `grade` | Candidate/P0/P1/P2/P3 | 闭环成熟度 |

**Step B 动作**:
- 11 个 P0 skill → `grade: P0` + `status: draft`
- 4 个 Kernel packet + 4 个 Memory schema → 跟随 Skill 节奏（Kernel 没有 grade 概念，但 status 字段照填）
- 5 个 Agent → 8 字段（无 grade）

---

## B. 待 Codex Step B 澄清/修正

### Q2 — `description` 字段空字符串 vs TBD

**Codex 当前**: `description: ""`（其他字段都是 `TBD`）。

**问题**: Step A 是否应该统一用 `TBD`，等 Step B 再写真正的 description？还是 `""` 是 Codex 显式标记「Step B 必填但当前故意空」？

**Step B 动作**: 直接按蓝图 §2.0 的 description 三规则（leading word 前置 / 一个 branch 一个 trigger / 删除 body 已说的 identity）写出真实 description。Step A 的占位值不影响。

### Q3 — frontmatter list 字段（`can-invoke` / `paths` / `shared_with`）TBD vs 空列表

**Codex 当前**: `can-invoke: TBD` / `paths: TBD` / `shared_with: TBD`。

**问题**: list 字段用 `TBD`（字符串）会让 validator 报类型错。建议 Step A 改用 `[]`（空 list），Step B 再填值。

**Step B 动作**: 把所有 `TBD` 改为符合类型的占位值：
- list 字段 → `[]`
- bool 字段 → `false`（或基于 disable-model-invocation 默认值）
- enum 字段（status/grade）→ `draft` / `Candidate`
- string 字段（name/description/owner_agent）→ 真实值

### Q4 — Agent 8 字段中的 `intent_triggers` / `output_contract` / `handoff_to` 类型

**Codex 当前**: 全标 `TBD`。

**问题**: 这三个字段在蓝图 §2.20 是 list 还是 string？Step B 应给出具体类型与示例。

**Step B 动作**: 参考蓝图 §2.20（具体行号需查），给出 5 个 Agent 各自的真实值（不是占位）。

### Q5 — Section 占位的 SECTION_REF 锚点一致性

**Codex 当前**: 每节用 `<!-- SECTION_REF: docs/vnext-blueprint.md#§2.0-craft-spec -->` 格式。

**问题**: 蓝图内部锚点是 `### 2.0 命名规范（8-Bucket Closed Scheme）`——Markdown 锚点会变成 `#20-命名规范8-bucket-closed-scheme`，不是 `#§2.0-craft-spec`。

**Step B 动作**: 二选一——
- (A) 保留 `§2.0-craft-spec` 这种语义化锚点（人类可读，但点击不跳转）
- (B) 改用蓝图真实 Markdown 锚点（点击可跳转，但可读性差）
- **我的建议**: A，因为 Step B 的 body 内容会展开，SECTION_REF 只是审计追溯用

### Q6 — Kernel/Memory/Agent 文件的 `grade` 字段

**Codex 当前**: Kernel packet 和 Memory schema 用 4 字段（name/type/status/grade）。

**问题**: 蓝图 §2.0 line 201-213 明确 grade 是「Skill 分级标签」。Kernel packet / Memory schema / Agent 是否也需要 grade？

**Step B 动作**:
- Skill: 10 字段（9 + grade） — 已对齐
- Agent: 8 字段（无 grade） — 验证蓝图 §2.20 是否需要
- Kernel / Memory: 4 字段（含 grade） — 验证蓝图 §2.22/§2.23 是否需要，还是退化为 3 字段

---

## C. Reviewer 建议（非阻塞）

### R1 — 蓝图 commit 到 master

**当前状态**: 蓝图 `docs/vnext-blueprint.md` 是 source of truth，但似乎只在 vnext/ 工作树中，未 commit 到 master。

**建议**: Step B 之前先把蓝图 commit 到 master 分支，避免后续 review 引用「未来文件」。

### R2 — `vnext/skills/craft/craft-spec/references/` 子目录是否预创建

**当前状态**: Codex Step A 创建了 11 个 Skill 目录，每个只有 SKILL.md，没有 `references/` 子目录。

**建议**: progressive disclosure 的 `references/` 子目录建议 Step A 阶段预创建（空目录 + `.gitkeep`），让 Step B 直接生成 disclosed 文件。

**反例**: 如果 Step B 才创建，会出现「skill 引用 references/xxx.md 但文件不存在」的临时状态，触发 Context Pointer Miss。

---

## D. skill-authoring.md 同步状态

我已根据 Q1 解决结论同步修订了 `vnext/references/skill-authoring.md`（P1 reference，预准备给 craft/spec-* / evolve/refine / review/spec-review 引用）。

**修订要点**:
1. §3 标题改为「Frontmatter 10 字段写作规范（蓝图 §2.0：9 必填 + grade）」
2. §3 拆为 3.1（9 必填字段表）+ 3.2（grade 字段表）+ 3.3（status × grade 正交关系表）
3. §5.1 改为「双轴 Discipline」，含 5.1.1 Grade / 5.1.2 Status / 5.1.3 两轴协作
4. §5.5 拆为 grade 流转 + status 流转两条规则
5. §9 Checklist 新增「status 取值不混淆」「grade 取值不混淆」两条
6. §10 反模式新增「2.5: status × grade 混用」
7. 附录 A 模板默认值改为 `status: draft` + `grade: Candidate`
8. §6/§11/§12 一致性同步（Grade Discipline 触发条件描述、参考文献描述）

**Codex Step B 可参考此文件作为 Skill 写作规范的 source of truth**（mattpocock GLOSSARY 中文沉淀 + vnext 适配）。

---

## E. Step B 准入条件（Codex 可启动 Step B 的 check）

- [x] Q1 已 RESOLVED（本文档 §A）
- [ ] Q2/Q3 由 Codex Step B 直接修正（无需 reviewer 再确认）
- [ ] Q4/Q5/Q6 由 Codex Step B 给出具体值后，reviewer 在 Step B 评审中验证
- [ ] R1 蓝图 commit 到 master（建议 Step B 前完成）
- [ ] R2 `references/` 子目录预创建（建议 Step B 前完成）

**Reviewer 签名**: Claude (2026-07-06)
