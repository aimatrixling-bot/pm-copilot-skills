---
type: manifest
name: vnext-surface
version: 1
generated_at: 2026-07-07
source_of_truth: docs/vnext-blueprint.md §2.25.1
validator_consumes: scripts/validate-vnext.js
total_assets: 29
breakdown: "agent=5; skill=12; kernel=4; memory=4; reference=4"
grade_enforced_for: skill
status_enforced_for: "skill, kernel, memory"
---

# vNext Surface Manifest

本文件是 vNext P0 资产的**允许存在清单**（machine-readable）。任何不在此清单的资产 = 越界。

- 蓝图 SoT：`docs/vnext-blueprint.md` §2.25.1
- ADR：`docs/vnext-decisions/0002-evolve-skill-promotion-to-p0.md`
- 校验方：`scripts/validate-vnext.js`（TD-14 升级后消费本文件）

**观测器原则**：manifest 仅记录实际状态，不修改任何资产文件的 frontmatter。
- `grade` 严格校验范围：仅 `asset_type=skill`
- `status` 严格校验范围：`skill` / `kernel` / `memory`（agent/reference 不强制 enum）
- agent 无 grade/status 字段是 `validate-vnext.js` frontmatter freeze 设计决策

结构性文件（不计入 total_assets，由 validator 单独处理）：`README.md`、`agents/_index.md`、`skills/_index.md`、`memory/_index.md`、`_surface.md`。

## Schema

| 列 | 类型 | 取值 | 适用 |
|---|---|---|---|
| asset_type | enum | `agent` / `skill` / `kernel` / `memory` / `reference` | 全部 |
| name | string | frontmatter.name | 全部 |
| path | string | 相对 vnext/ 路径 | 全部 |
| grade | enum or `n/a` | `Candidate` / `P0` / `P1` / `P2` / `P3` / `n/a` | skill 必填；其他 n/a |
| status | string or `n/a` | `draft` / `stable` / `deprecated`（skill/kernel/memory）；actual 值（reference）；`n/a`（agent） | 全部 |
| owner_agent | string or `n/a` | agent name；agent/kernel/memory/reference 填 `n/a` 或 actual | skill 必填；其他 n/a 或 actual |
| runtime_visible | bool | 是否对 runtime consumer 可见 | 全部 |
| bucket | enum or `n/a` | 8-Bucket；agent/kernel/memory/reference 填 `n/a` | skill 必填；其他 n/a |

## Assets（29 项）

<!-- Codex: 从实际 vnext/ 文件派生 actual 值。grade 仅 skill 类需要从 frontmatter 读取；其他类按 n/a 填入。 -->

| asset_type | name | path | grade | status | owner_agent | runtime_visible | bucket |
|---|---|---|---|---|---|---|---|
| agent | builder | agents/builder.md | n/a | n/a | n/a | true | n/a |
| agent | evolver | agents/evolver.md | n/a | n/a | n/a | true | n/a |
| agent | researcher | agents/researcher.md | n/a | n/a | n/a | true | n/a |
| agent | reviewer | agents/reviewer.md | n/a | n/a | n/a | true | n/a |
| agent | supervisor | agents/supervisor.md | n/a | n/a | n/a | true | n/a |
| skill | build-commit | skills/build/build-commit/SKILL.md | P0 | draft | builder | true | build |
| skill | craft-agent-task | skills/craft/craft-agent-task/SKILL.md | P0 | draft | supervisor | true | craft |
| skill | craft-prototype | skills/craft/craft-prototype/SKILL.md | P0 | draft | builder | true | craft |
| skill | craft-spec | skills/craft/craft-spec/SKILL.md | P0 | draft | researcher | true | craft |
| skill | discover-research | skills/discover/discover-research/SKILL.md | P0 | draft | researcher | true | discover |
| skill | evolve-memory | skills/evolve/evolve-memory/SKILL.md | P0 | draft | evolver | true | evolve |
| skill | evolve-skill | skills/evolve/evolve-skill/SKILL.md | P0 | draft | evolver | true | evolve |
| skill | manage-file | skills/manage/manage-file/SKILL.md | P0 | draft | builder | true | manage |
| skill | manage-grill | skills/manage/manage-grill/SKILL.md | P0 | draft | supervisor | true | manage |
| skill | manage-prompt | skills/manage/manage-prompt/SKILL.md | P0 | draft | supervisor | true | manage |
| skill | review-code | skills/review/review-code/SKILL.md | P0 | draft | reviewer | true | review |
| skill | review-doc | skills/review/review-doc/SKILL.md | P0 | draft | reviewer | true | review |
| kernel | intent-packet | kernel/intent-packet.schema.md | n/a | draft | n/a | true | n/a |
| kernel | evidence-packet | kernel/evidence-packet.schema.md | n/a | draft | n/a | true | n/a |
| kernel | output-packet | kernel/output-packet.schema.md | n/a | draft | n/a | true | n/a |
| kernel | iron-law | kernel/iron-law.schema.md | n/a | draft | n/a | true | n/a |
| memory | user | memory/user.schema.md | n/a | draft | n/a | true | n/a |
| memory | project | memory/project.schema.md | n/a | draft | n/a | true | n/a |
| memory | reference | memory/reference.schema.md | n/a | draft | n/a | true | n/a |
| memory | feedback | memory/feedback.schema.md | n/a | draft | n/a | true | n/a |
| reference | skill-authoring | references/skill-authoring.md | n/a | P1 | evolver | false | n/a |
| reference | manage-file-scope-decision | references/manage-file-scope-decision.md | n/a | active | n/a | false | n/a |
| reference | codex-step-a-review-feedback | references/codex-step-a-review-feedback.md | n/a | APPROVED for Step B (conditional) | n/a | false | n/a |
| reference | codex-step-b-review-feedback | references/codex-step-b-review-feedback.md | n/a | stable | n/a | false | n/a |

## Total 约束

- asset_type=agent: **5**
- asset_type=skill: **12**（与 ADR 0002 P0 范围一致；含 evolve-skill P0）
- asset_type=kernel: **4**
- asset_type=memory: **4**
- asset_type=reference: **4**
- 总计：**29**

任何增减必须先在 ADR 中取得用户确认，然后更新本 manifest，然后才能动 vnext/ 文件。
