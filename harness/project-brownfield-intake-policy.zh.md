# 既有项目接入策略（Brownfield Intake Policy）

本策略定义用户在已有本地项目资产的情况下，中途引入 AI Builder OS 时的最小 intake 行为。目标是先理解和保护已有资产，再决定是否初始化 AI Builder OS runtime 或 artifact index。

## 触发信号（Trigger）

使用 `brownfield` 的典型信号：

- 当前目录已有代码、文档、原型、脚本、测试、日志或配置。
- 用户说“接管这个项目”“帮我继续”“已有项目资产”“先理解现状”。
- 存在多个历史文档、旧 PRD、设计稿、脚本或输出物。
- Artifact Hygiene Loop 发现 artifact index 不存在，但项目已有可复用资产。

## 最小输入（Minimum Inputs）

Brownfield intake 至少需要：

- 项目根目录或用户授权的扫描范围。
- 用户希望 AI Builder OS 解决的问题：理解、整理、继续开发、评审、迁移或清理。
- 禁止触碰的目录或文件，如生产配置、真实数据、私密文档。
- 当前认为最可信的入口，如 README、AGENTS、docs、spec、tests 或代码模块。

如果缺少项目根目录或授权范围，必须使用 `unknown` 或停止提问。

## 最小输出（Minimum Output）

Brownfield intake 至少输出：

```yaml
brownfield_intake:
  project_mode: brownfield
  project_root:
  scanned_scope:
    - path:
  asset_map:
    source_of_truth_candidates:
      - path:
        truth_scope:
        reason:
        confidence: confirmed | inferred | unknown
    working_assets:
      - path:
        reason:
    legacy_or_stale_candidates:
      - path:
        reason:
    temp_or_process_assets:
      - path:
        reason:
  conflicts:
    - paths:
        - path:
      issue:
      severity: P0 | P1 | P2 | P3
  missing_context:
    - item:
      blocks:
  artifact_index_update_proposal:
    status: proposal_only
    proposed_entries:
      - path:
        artifact_type:
        proposed_status:
        reason:
  cleanup_proposal:
    safe_to_delete:
      - path:
        reason:
    archive_instead:
      - path:
        reason:
    needs_human_decision:
      - path:
        question:
    do_not_touch:
      - path:
        reason:
  recommended_next_skill: builder-review | builder-frame | builder-spec | builder-agent-task
  next_action:
```

## 接入规则（Intake Rules）

- 默认只读取用户指定范围和低风险入口文件，不做全仓库深扫。
- 先区分事实、推断和未知项，再提出行动建议。
- `source_of_truth_candidates` 只是候选；必须由 Evidence、Decision 或用户确认后才能成为 `current`。
- 旧文档默认不是垃圾；先判断是否有决策、验收、回滚或历史解释价值。
- 任何清理、迁移、重命名都必须进入 proposal。
- 删除目录、批量删除、删除代码/脚本/HTML/测试/配置必须停止并请求人工确认。
- 对不确定用途但可能影响业务判断的文件，默认进入 `needs_human_decision` 或 `do_not_touch`。

## 事实源接入顺序（Source-of-truth Intake Order）

Brownfield 中建议按以下顺序寻找候选真相源：

```text
用户明确指定
> AGENTS.md / README / 项目约定
> Decision Record / ADR
> current Spec / PRD
> Tests / Evidence
> 当前实现
> 历史文档 / 临时分析 / 日志
```

这个顺序是 intake 起点，不是绝对规则。发现冲突时必须显式列出，不得擅自合并。

## 清理提案规则（Cleanup Proposal Rules）

Brownfield intake 不能直接清理文件。cleanup proposal 必须引用 `memory/policies/artifact-cleanup-policy.zh.md`，并说明：

- 扫描范围。
- 为什么认为可删除、应归档、需人工判断或禁止触碰。
- 是否存在下游引用。
- 是否涉及 current、keep、Decision、Evidence、代码、脚本、HTML、测试或配置。

证据不足时，结论必须是 `needs_human_decision`。

## 停止条件（Stop Conditions）

遇到以下情况必须停止：

- 无法确认扫描范围。
- 多个候选 source of truth 对同一业务规则冲突。
- 用户要求“直接整理/删掉/搬走”但未确认清理 proposal。
- 涉及生产配置、真实数据、权限、认证、合规、安全或发布风险。
- 项目规模过大，需要先制定 intake Plan。

## 交接（Handoff）

Brownfield intake 的 handoff 必须保留：

- scanned scope。
- asset map。
- source-of-truth candidates。
- conflicts 和 missing context。
- artifact index update proposal。
- cleanup proposal。
- recommended next skill。
