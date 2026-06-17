---
name: pm-code-review
displayName: Code Review
displayDescription: 代码审查
description: "Review code changes for security, logic, and performance. Trigger when user says 'code review', '代码审查', '代码检查', 'review code', or after code implementation is done."
user-invocable: true
argument-hint: "[代码变更描述或文件路径]"
---

# 代码审查

<SUBAGENT-STOP>
如果是子代理派发执行此 Skill，直接按下方指令执行，不重新加载入口 Skill。
</SUBAGENT-STOP>

独立审查代码变更，发现安全、逻辑和性能问题。审查是质量最后一道门——放过的 bug 会在生产环境十倍代价地回来。

**核心原则**：审查者不等于实现者。

## Intent Packet

| 字段 | 捕获内容 | 来源 |
|---|---|---|
| **Want** | 独立审查代码变更，发现安全/逻辑/性能问题，产出 APPROVE 或 REQUEST_CHANGES 结论 | 用户输入剥离"审查代码"后的任务本质 |
| **Constraints** | 审查者 ≠ 实现者；每个问题必须有 severity + suggestion；结论只有 APPROVE / REQUEST_CHANGES | Iron Law + enforced schema |
| **Context Sources** | git diff / 用户提供的文件 + 原始需求（PRD/任务描述）+ 项目 CLAUDE.md + 上游 pm-code-implement 的 Output Packet / Evidence Packet | Glob + Read；pipeline 模式引用上游 packet |
| **Depth** | Draft（只查 critical+major）/ Review（5 维度全覆盖，默认）/ Release（含边缘场景和安全漏洞检测） | 用户声明或推断 |
| **Output Target** | 代码作者（修复 issues）+ 合并决策者（APPROVE/REQUEST_CHANGES 判断） | 用户明示或推断 |

未提供时标注 `[假设]`，交付前确认。

## Iron Law（铁律）

| 铁律 | 违反后果 |
| --- | --- |
| 审查者 ≠ 实现者 | 同一人的代码必须由另一视角审查——如果只有一个人，至少隔 30 分钟后以审查者身份重新审视 |
| 每个问题必须有 severity + suggestion | 无 severity 的问题不计入审查结果——补全后重新计数 |
| 审查结论只有 APPROVE / REQUEST_CHANGES | 没有"看起来还行"——要么通过，要么打回 |

## 反合理化

| 你可能在想的 | 真相 |
| --- | --- |
| "代码能跑就行" | 能跑 ≠ 正确——边界情况、错误处理、性能坑不会在正常流程暴露 |
| "这个问题太小了不用说" | 小问题积累成大故障——severity 区分优先级，但不说 = 不存在 |
| "我不确定这是不是问题" | 不确定也要标注为 suggestion——让作者判断，比漏掉好 |
| "实现者经验丰富，应该没问题" | 经验丰富的人也会犯低级错误——审查不看人，看代码 |

## Capability Index

| 维度 | CAN（可以做） | CANNOT → HANDOFF（不做，转交） |
|---|---|---|
| **任务类型** | 代码变更审查、安全扫描、逻辑/性能/可维护性评估、Evidence Packet 可信度审查、产出 APPROVE/REQUEST_CHANGES 结论 | 写代码 → pm-code-implement；架构设计 → pm-code-architect；写 PRD → pm-prd |
| **输出格式** | inline Markdown 审查报告（enforced schema：verdict + issues 表 + summary） | docx/pdf 审查文档 → pm-content-general |
| **深度范围** | 5 维度审查（安全/逻辑/性能/可维护性/一致性），4 级 severity 分类 | 渗透测试 / 专业安全审计 → 人工安全专家；性能基准测试 → 专项工具 |

**边界原则**：审查是质量最后一道门，但不替代测试。放过 critical = 对生产故障负责。

## 审查维度

| 维度 | 检查内容 | 重点关注 |
| --- | --- | --- |
| **安全** | 注入、XSS、认证、敏感数据泄露 | 用户输入处理、API 调用、.env 引用 |
| **逻辑** | 边界情况、错误处理、空值处理 | if/else 分支覆盖、try/catch、null check |
| **性能** | N+1 查询、内存泄漏、不必要的重渲染 | 循环内查询、useEffect 依赖、大列表渲染 |
| **可维护性** | 命名、函数长度、重复代码 | 变量命名自解释、函数 ≤ 50 行、DRY |
| **一致性** | 代码风格与项目已有代码一致 | 导入顺序、命名约定、错误处理模式 |
| **证据可信度** | Evidence Packet 是否真实、完整、可复现 | 命令是否运行、NOT_RUN 是否合理、manual smoke 是否覆盖核心路径 |

## 执行流程

```
触发 pm-code-review
    ├── 1. 获取变更
    │     ├── 读取 git diff（或用户提供的文件）
    │     ├── 读取原始需求（理解变更意图）
    │     └── 读取项目 CLAUDE.md（理解项目约束）
    ├── 2. 逐文件审查
    │     ├── 安全扫描（注入、XSS、敏感数据）
    │     ├── 逻辑审查（边界、错误处理、空值）
    │     ├── 性能检查（N+1、内存、渲染）
    │     ├── 可维护性评估（命名、长度、重复）
    │     └── 一致性比对（与项目已有风格对比）
    ├── 3. Evidence Packet 审查
    │     ├── Checks run 是否有命令和关键输出
    │     ├── NOT_RUN 是否有合理原因和替代验证
    │     ├── fake test / fake UI 是否存在
    │     └── Completion claim 是否与证据一致
    ├── 4. 问题分类
    │     ├── critical — 必须修复才能合并
    │     ├── major — 强烈建议修复
    │     ├── minor — 建议修复但不阻塞
    │     └── suggestion — 改进建议，可选
    ├── 5. 产出审查报告
    │     ├── verdict（APPROVE / REQUEST_CHANGES）
    │     ├── issues 列表（severity + file + line + description + suggestion）
    │     ├── evidence_review（证据可信度结论）
    │     └── summary（总体评价）
    └── 6. 交付
          ├── APPROVE → 建议后续行动
          └── REQUEST_CHANGES → 指向 pm-code-implement 修复
```

## Gates

| Gate | 位置 | 通过条件 | 失败处理 |
|---|---|---|---|
| **G1: 变更获取门** | Step 1 后 | 代码 diff 已获取 + 原始需求已理解 + 项目约束已读取 | Pause→无 diff 时要求用户提供变更描述或文件路径；无需求时标注 `[假设]` 继续 |
| **G2: 审查覆盖门** | Step 2 后 | 5 维度（安全/逻辑/性能/可维护性/一致性）全部覆盖；每文件逐行扫描完成 | Pause→维度遗漏必须补查；Risk→文件过多（>10）时标注抽样审查置信度 |
| **G3: 证据可信门** | Step 3 后 | Evidence Packet 存在且 Completion claim 与命令/人工验证一致；NOT_RUN 有原因 | Pause→证据缺失时要求补证；critical 风险无验证时 REQUEST_CHANGES |
| **G4: 问题分类门** | Step 4 后 | 每个问题都有 severity（critical/major/minor/suggestion）+ 可执行 suggestion | Pause→无 severity 的问题不计入审查结果，补全后重新计数 |
| **G5: Verdict 门** | Step 5 后 | 结论是 APPROVE 或 REQUEST_CHANGES 二选一；critical/major ≥ 1 时必须 REQUEST_CHANGES | Pause→critical/major 存在但结论为 APPROVE 时强制改为 REQUEST_CHANGES |

Gate 失败 ≠ 终止：标注原因 → 回到对应步骤修正 → 最多重试 2 次 → 仍失败向用户报告。

## 输出规范（enforced schema）

审查报告必须遵循以下结构：

```markdown
## 审查结论: [APPROVE / REQUEST_CHANGES]

### 问题列表

| # | Severity | 文件 | 行号 | 问题描述 | 修复建议 |
| --- | --- | --- | --- | --- | --- |
| 1 | critical | src/api/auth.ts | L42 | 密码明文存储 | 使用 bcrypt 加密后存储 |
| 2 | minor | src/hooks/useData.ts | L15 | useEffect 缺少依赖 | 添加 missing dependency |
| 3 | suggestion | src/utils/format.ts | - | 考虑提取为共享工具函数 | 移至 shared/utils/ |

### 总结

[2-3 句总体评价：变更质量、主要风险点、正面发现]

### Evidence Review

| 项目 | 结论 | 证据 |
| --- | --- | --- |
| Checks run | PASS / PARTIAL / FAIL | [命令或缺失说明] |
| Manual verification | PASS / PARTIAL / FAIL | [核心路径或缺失说明] |
| Fake test / fake UI | PASS / FAIL | [发现或未发现的证据] |
| Completion claim | PASS / PARTIAL / BLOCKED | [是否与证据一致] |
```

### Severity 定义

| Severity | 标准 | 处理要求 |
| --- | --- | --- |
| **critical** | 安全漏洞、数据丢失风险、生产故障风险 | 必须 fix 后才能合并 |
| **major** | 逻辑错误、性能问题、重要边界未处理 | 强烈建议 fix，合并前解决 |
| **minor** | 代码风格、命名、小优化 | 建议修复，不阻塞合并 |
| **suggestion** | 改进思路、架构优化方向 | 可选，供参考 |

## 交付前检查

- [ ] 每个 issue 都有 severity（critical/major/minor/suggestion 之一）
- [ ] 每个 issue 都有 suggestion（可执行的修复建议）
- [ ] 不编造代码中不存在的问题
- [ ] 审查结论是 APPROVE 或 REQUEST_CHANGES（二选一）
- [ ] summary 包含正面发现（不只列问题）
- [ ] critical 和 major 问题数量 ≥ 1 时，结论必须是 REQUEST_CHANGES
- [ ] Evidence Packet 已审查；缺失或证据不足时不允许 APPROVE
- [ ] fake test / fake UI 已检查并在 Evidence Review 中说明

## 后续推荐

| 场景 | 推荐 Skill |
| --- | --- |
| REQUEST_CHANGES 后修复 | pm-code-implement |
| 发现架构层面问题 | pm-code-architect |
| 发现安全漏洞 | 立即告知用户，不走 Skill |

## Output Packet

- **artifact_path**: inline 审查报告（对话中输出，enforced schema）
- **artifact_type**: `review_report`
- **key_decisions**: [审查结论 APPROVE/REQUEST_CHANGES + critical/major 问题数 + 主要风险点 ≤ 3 条]
- **open_assumptions**: [标注 `[假设]` 的待验证项（如某段代码的意图推测、性能影响假设）]
- **next_skill_hint**: `pm-code-implement`（若 REQUEST_CHANGES，修复后重新审查）
- **handoff_context**: 下游需要但不在审查报告中的上下文（如被标注为 minor 但建议后续重构的方向、架构层面隐患）
- **evidence_review**: [Checks run / Manual verification / Fake test or UI / Completion claim 的结论]
- **sensor_gates**: [Security / Logic / Performance / Evidence / Privacy-Security 中触发的问题]

**下游消费方式**：pm-code-implement 的 Intent Packet "Context Sources" 字段引用此 packet 的 `key_decisions`（critical/major 问题列表）。

## Sensor Gates

| Sensor | 触发条件 | 检查方式 | 失败处理 |
|---|---|---|---|
| **Evidence Completeness** | 上游来自 pm-code-implement | Evidence Packet 五项是否齐全 | Pause→缺证据时 REQUEST_CHANGES 或要求补充 |
| **Fake Test** | 上游声明测试通过 | 测试断言是否覆盖真实行为、失败路径、边界 | Major→测试空壳时 REQUEST_CHANGES |
| **Fake UI** | UI/交互变更 | 对照 diff 检查可见入口是否有真实行为 | Major→假入口阻塞合并 |
| **Privacy/Security** | 数据、权限、日志、外部 API | 检查 secret、PII、auth、敏感日志 | Critical→必须 REQUEST_CHANGES |

## Meta-Review

交付完成后对照方法论自审：

1. **方法论骨架**：是否遵循 获取变更 → 逐文件审查 → 问题分类 → 产出报告 → 交付 的完整流程？5 个审查维度是否全部覆盖？
2. **反理实化警惕**：4 条"你可能在想的"是否真的被警惕了？（重点检查"这个问题太小了不用说"、"我不确定这是不是问题"、"实现者经验丰富"）
3. **Iron Law 验证**：3 条铁律（审查者 ≠ 实现者 / 每个问题有 severity + suggestion / 结论只有 APPROVE 或 REQUEST_CHANGES）是否已验证满足？

**扩展问题（pipeline skill）**：Output Packet 的 `key_decisions` 中的 critical/major 问题是否都有对应的 file + line + suggestion？是否有遗漏的维度？

自审结果 1-2 句话附在交付物末尾。不通过时回到对应步骤修正，不在 Meta-Review 阶段打补丁。

## Evolution Writeback

执行后自问以下 3 个问题，有则记录到 `docs/evolution-log.md`：

1. **方法论偏差**：5 维度审查是否有不够贴合实际的地方？（如某维度经常无发现、某类项目需要额外维度）
2. **反理实化补充**：是否遇到了表格未覆盖的新借口模式？（如"这个是遗留代码不是本次变更"）
3. **边界调整信号**：CAN/CANNOT 是否需要调整？（如某类审查本应转交但被硬撑）

**记录格式**：

```markdown
## YYYY-MM-DD — pm-code-review — [项目/场景]
- **观察**: [一句话描述]
- **建议回写**: [回写到哪个文件/章节 / "仅记录不回写"]
- **置信度**: 高/中/低
```

无观察时跳过此章节，不强写。

## Metadata

```yaml
track: engineering
phase: 3
depends_on: [pm-code-implement]
feeds_to: [pm-code-implement]
schema_type: enforced
persist_to: []
guardrails:
  - 不编造代码中不存在的问题
  - severity 必须是 critical / major / minor / suggestion 之一
  - 每个 issue 必须包含 severity + file + line + description + suggestion
  - 审查结论只有 APPROVE 或 REQUEST_CHANGES
  - critical/major ≥ 1 时结论必须为 REQUEST_CHANGES
```
