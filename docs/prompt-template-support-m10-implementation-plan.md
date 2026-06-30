# M10 Prompt And Template Support Implementation Plan

**Goal:** 补齐 M10 Builder Delivery Harness 所需的少量高价值 Prompt / Template 支持，让 research、evidence、memory、retrospective 和入口提示都能被 agent 稳定消费。

**Architecture:** 不新增 core skill，不重构目录。新增模板只放在 `templates/`，长期归属写入 `docs/source-of-truth-map.md`，入口 Prompt 只增强 `builder-plan-goal` 的现有 references，验证由 `scripts/validate-builder-os.js` 和 runtime/package validator 接住。

**Tech Stack:** Markdown templates、JSON/JS validator、AI Builder OS 现有 package/runtime validation。

---

## File Structure

- Create `templates/evidence-packet/template.md`：可复制证据包格式，承接 `kernel/packets/evidence-packet.schema.md`。
- Create `templates/research-brief/template.md`：轻量 research cache，服务复杂方案探索和后续决策。
- Create `templates/delivery-retrospective/template.md`：每轮交付复盘和恢复入口，承接 L4 需求演进。
- Create `templates/project-memory-index/template.md`：L0-L4 项目记忆入口提案，不自动创建用户项目结构。
- Modify `skills/builder-plan-goal/references/plan-template.zh.md`：加入 M10 router-first copy-ready prompts。
- Modify `templates/README.md`、`docs/source-of-truth-map.md`、`memory/README.md`、`kernel/packets/evidence-packet.schema.md`、`skills/builder-review/SKILL.md`：同步说明和引用关系。
- Modify validators：让新增模板进入 required file、runtime export、install 和 dual-package dry-run 检查。

## Tasks

### Task 1: Artifact Templates

- Add Evidence Packet, Research Brief, Delivery Retrospective and Project Memory Index templates.
- Keep templates compact and field-based.
- Do not add new visible skills or automatic project writes.

### Task 2: Prompt Entry Points

- Add M10 router-first prompts for:
  - `from_idea`
  - `from_visual_or_prototype`
  - `from_existing_code`
  - `spec_to_agent_task_pack`
  - `review_readiness`
- Prompts must route through existing builder skills and avoid bypassing Frame / Spec / Review gates.

### Task 3: Source-Of-Truth And Runtime Sync

- Register new template ownership in source-of-truth map.
- Tie Evidence Packet template to review/evidence gates.
- Tie Project Memory Index to L0-L4 governance.
- Ensure validators require the new templates in source and runtime/package surfaces.

### Task 4: Verification

- Run `npm run validate:builder-os`.
- Run `git diff --check`.
- If install/runtime sync matters after review, run `node install.js codex --overwrite` and `npm run validate:codex-install`.
