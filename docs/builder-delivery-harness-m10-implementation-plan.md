# M10 Builder Delivery Harness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 M10 的 Builder Delivery Harness 方向落到现有 AI Builder OS 内核、记忆、任务包契约和验证器中。

**Architecture:** 不新增 core skill，不重构目录。通过 architecture、delivery-kernel、memory、source-of-truth map、Agent Task Packet 模板、output-contract schema 和 validator 增量增强现有 surface。

**Tech Stack:** Markdown source docs、JSON output contracts、Node.js validator、npm validation scripts。

---

## File Structure

- Modify `docs/architecture.md`：增加 Builder Delivery Harness、3P 交付轨道、Human View / Agent View 定位。
- Modify `docs/delivery-kernel.md`：说明 3P 轨道如何叠加 `create | improve | reframe`，并把 issue 升级为 Agent Task Pack。
- Modify `docs/source-of-truth-map.md`：新增 3P、L0-L4、Agent Task Pack、Self Improvement 的事实源归属。
- Modify `memory/README.md`：新增 L0-L4 项目知识分层和治理规则。
- Modify `templates/agent-task-packet/template.md`：新增 `task_pack_identity`、`human_view`、`agent_view`、`knowledge_context`、`self_improvement_triggers`。
- Modify `kernel/packets/agent-task-packet.schema.md`：同步任务包字段说明和质量门禁。
- Modify `evals/output-contract/agent-task-packet.schema.json`：把新增字段纳入 required，并声明子字段 required arrays。
- Modify `skills/builder-agent-task/SKILL.md`：轻量接入新增字段，不复制长解释。
- Modify `scripts/validate-builder-os.js`：检查新增文档术语、schema 字段和子字段。

### Task 1: Source Docs

- [ ] **Step 1: Update architecture**

Add M10 positioning after the product definition:

```markdown
M10 Builder Delivery Harness 将 AI Builder OS 定义为产品判断与 Agent 执行之间的交付内核...
```

- [ ] **Step 2: Update Delivery Kernel**

Add a section after the three delivery modes:

```markdown
## M10 Builder Delivery Harness
3P 是交付深度，不是线性阶段...
```

- [ ] **Step 3: Update Source-of-Truth Map**

Add rows for 3P tracks, L0-L4 memory, Agent Task Pack, and Self Improvement.

- [ ] **Step 4: Update Memory README**

Add L0-L4 knowledge stratification and governance rules.

### Task 2: Agent Task Pack Contract

- [ ] **Step 1: Update template**

Add required fields:

```yaml
task_pack_identity:
  id:
  source_artifact:
  delivery_track: prd_spec | prototype | product
human_view:
  summary:
  decision_points:
agent_view:
  execution_contract:
  context_pack:
knowledge_context:
  required_layers:
  read_policy:
self_improvement_triggers:
  repeated_failure:
  template_gap:
  script_or_eval_candidate:
```

- [ ] **Step 2: Update Markdown schema**

Mirror the template and add the gate: traditional issues are not enough for agent execution.

- [ ] **Step 3: Update JSON schema**

Add the fields to `required` and add child required arrays:

```json
"task_pack_identity_required": ["id", "source_artifact", "delivery_track"]
```

- [ ] **Step 4: Update builder-agent-task skill**

Add minimal process steps and quality gates that require the new fields.

### Task 3: Validator

- [ ] **Step 1: Extend expectations**

Add new terms to `builderCoreExpectations`, `packetSchemaExpectations`, `deliveryKernelV02Expectations`, and `outputContractExpectations`.

- [ ] **Step 2: Add schema assertions**

Assert that the new required arrays exist and include their required child fields.

- [ ] **Step 3: Run validation**

Run:

```bash
npm run validate:builder-os
```

Expected: `Builder OS 验证通过。`

### Task 4: Review

- [ ] **Step 1: Check diff**

Run:

```bash
git diff --stat
git diff --check
```

Expected: no whitespace errors; Windows LF/CRLF warnings may appear and are not blockers.

- [ ] **Step 2: Summarize**

Report files changed, behavior changed, checks run, risks, and human review points.
