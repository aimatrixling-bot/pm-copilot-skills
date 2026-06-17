---
name: pm-code-implement
displayName: Code Implement
displayDescription: 执行代码实现
description: "Execute code implementation from architecture design and task breakdown. Trigger when user says 'implement', 'code', '写代码', '开发', '代码实现', or needs to write actual code for a specific task."
user-invocable: true
argument-hint: "[任务描述]"
---

# 代码实现

<SUBAGENT-STOP>
如果是子代理派发执行此 Skill，直接按下方指令执行，不重新加载入口 Skill。
</SUBAGENT-STOP>

从架构设计到可运行的代码。实现是架构的精确执行——偏差越小，返工越少。

**核心原则**：没有架构设计的代码不写。

## Intent Packet

| 字段 | 捕获内容 | 来源 |
|---|---|---|
| **Want** | 按架构设计精确执行代码变更（新增/修改文件，可 typecheck+lint+build 通过） | 用户输入剥离"写代码"后的任务本质 |
| **Constraints** | 项目框架、变更文件数 ≤ 10、不修改 .env、不 force push、必须给出证据包 | 项目 CLAUDE.md + 全局安全红线 |
| **Context Sources** | 上游 architecture.md / Feature Frame / PRD / 项目已有代码 / 项目 CLAUDE.md | Glob + Read；pipeline 模式引用 pm-code-architect 的 Output Packet |
| **Depth** | Draft（能跑通即可）/ Review（符合项目规范 + typecheck+lint 通过，默认）/ Release（含边缘场景处理 + 测试覆盖） | 用户声明或推断 |
| **Output Target** | 开发团队（提交 PR 前的代码变更 + 变更报告） | 用户明示或推断 |

未提供时标注 `[假设]`，交付前确认。

## Iron Law（铁律）

| 铁律 | 违反后果 |
| --- | --- |
| 没有架构设计的代码不写 | 立即停止——先执行 pm-code-architect 或确认架构存在 |
| 变更文件数 ≤ 10 | 超过时拆分为多次实现，每次聚焦一个子任务 |
| 不修改 .env / 不 force push | 触发全局安全红线——必须用户确认 |

## 反合理化

| 你可能在想的 | 真相 |
| --- | --- |
| "顺手多改几个文件" | 每个额外变更都是风险——聚焦当前任务，其余记入 backlog |
| "这个 bug 顺手修了" | 修 bug 是独立任务——先记录，不混入当前实现 |
| "代码写完就行，测试之后再说" | 写完 → typecheck/lint → 验证 → 报告完成，缺一不可 |
| "先让代码跑起来，之后重构" | 跑起来 + 代码质量不矛盾——写的时候就该对齐项目规范 |

## Capability Index

| 维度 | CAN（可以做） | CANNOT → HANDOFF（不做，转交） |
|---|---|---|
| **任务类型** | 按架构执行代码变更、新增/修改文件、运行验证（typecheck/lint/build）、产出变更报告 | 架构设计 → pm-code-architect；代码审查 → pm-code-review；写 PRD → pm-prd |
| **输出格式** | 实际代码文件修改 + inline Markdown 变更报告 | 独立架构文档 → pm-code-architect；docx/pdf → pm-content-general |
| **深度范围** | 单次实现 ≤ 10 文件，聚焦一个子任务 | 超过 10 文件的大范围重构 → 拆分为多次实现；跨仓库变更 → 人工协调 |

**边界原则**：实现是架构的精确执行。发现架构有缺漏时停下来回到 pm-code-architect，不在实现阶段即兴改架构。

## 执行流程

```
触发 pm-code-implement
    ├── 1. 前置检查
    │     ├── 架构设计是否存在？
    │     │     └── 不存在 → 建议先执行 pm-code-architect → 停止
    │     ├── 读取项目 CLAUDE.md（确认框架约束和验证命令）
    │     └── 确认任务范围（单次实现 ≤ 10 个文件）
    ├── 2. 读取上下文
    │     ├── Read 架构设计文档
    │     ├── Glob 项目目录结构
    │     └── Read 相关已有代码（理解现有模式）
    ├── 3. 实现规划
    │     ├── 列出本次变更的文件清单（≤ 10）
    │     ├── 每个文件的变更类型（新增/修改）
    │     └── 变更顺序（减少依赖冲突）
    ├── 4. 执行代码变更
    │     ├── 按规划顺序逐文件修改
    │     ├── 遵循项目已有代码风格
    │     └── 关键变更加行内注释说明意图
    ├── 5. 验证
    │     ├── 运行 typecheck（如有配置）
    │     ├── 运行 lint（如有配置）
    │     ├── 构建通过（如有配置）
    │     └── 执行架构 Output Packet 中的 verification_strategy
    ├── 6. Sensor Gate 检查
    │     ├── Build/Test：命令是否真实运行或明确说明未运行原因
    │     ├── Fake Test：测试是否验证真实行为，而非只测空壳
    │     ├── Privacy/Security：是否误改 secrets、PII、权限、日志
    │     └── Overengineering：是否超出架构边界或引入多余抽象
    └── 7. 交付报告
          ├── 变更文件清单 + 每个文件的变更摘要
          ├── 验证结果 + Evidence Packet
          └── 后续推荐
```

## Gates

| Gate | 位置 | 通过条件 | 失败处理 |
|---|---|---|---|
| **G1: 架构前置门** | Step 1 后 | 架构设计存在（pm-code-architect 产出或用户提供的 architecture.md） | Pause→无架构时建议先执行 pm-code-architect，停止当前实现 |
| **G2: 范围控制门** | Step 3 后 | 变更文件清单 ≤ 10 个；每个文件有明确的变更类型和说明 | Pause→超过 10 文件必须拆分；Nudge→关联但非必要的变更记入 backlog |
| **G3: 规范对齐门** | Step 4 后 | 代码风格与项目已有代码一致；无硬编码值；错误已处理；无静默吞错 | Pause→不规范项必须修正后才能进入验证 |
| **G4: 验证门** | Step 5 后 | typecheck 通过 + lint 通过 + build 通过（或项目无此配置） | Pause→验证失败必须修复根因，不为通过而绕过报错（全局规范：同一问题失败 3 次停手） |

Gate 失败 ≠ 终止：标注原因 → 回到对应步骤修正 → 最多重试 2 次 → 仍失败向用户报告。

## 输出规范

### 变更报告（Markdown）

每次实现完成后产出变更报告：

```markdown
## 变更摘要

### 变更文件

| 文件 | 类型 | 变更说明 |
| --- | --- | --- |
| src/features/xxx/index.ts | 新增 | 模块入口，导出公共 API |
| src/features/xxx/hooks.ts | 新增 | 业务逻辑 hook |
| src/app/xxx/page.tsx | 修改 | 集成新模块到页面 |

### 验证结果

- typecheck: PASS / FAIL / NOT_RUN — [命令 + 关键输出或原因]
- lint: PASS / FAIL / NOT_RUN — [命令 + 关键输出或原因]
- test: PASS / FAIL / NOT_RUN — [命令 + 关键输出或原因]
- build: PASS / FAIL / NOT_RUN — [命令 + 关键输出或原因]
- manual smoke: PASS / FAIL / NOT_RUN — [核心路径步骤或原因]

### 注意事项

- [如有需要用户关注的点]

### Evidence Packet

| 证据类型 | 证据 |
|---|---|
| Files changed / artifacts | [文件路径清单] |
| Checks run | [命令 + 关键输出；未运行写 NOT_RUN + 原因] |
| Manual verification | [浏览器/CLI/截图/人工 smoke 步骤；无则说明原因] |
| Open risks | [未验证项、架构偏差、需要人工审查点] |
| Completion claim | PASS / PARTIAL / BLOCKED + 理由 |
```

### 代码变更（实际文件修改）

直接修改/创建文件，不将代码包裹在代码块中作为输出。

## 交付前检查

- [ ] 变更文件数 ≤ 10
- [ ] 无 .env 修改
- [ ] 无 force push
- [ ] typecheck 通过（或项目无此配置）
- [ ] lint 通过（或项目无此配置）
- [ ] tests/build/manual smoke 已按 verification_strategy 执行或明确 NOT_RUN 原因
- [ ] 无 fake test（测试断言证明真实行为，不只是函数存在/页面渲染）
- [ ] 无 fake UI（新增按钮/状态/文案有真实行为或明确标注不可用）
- [ ] Privacy/Security 影响已检查（secrets、PII、权限、日志）
- [ ] 代码风格与项目已有代码一致
- [ ] 无硬编码值（应提取为常量的已提取）
- [ ] 错误已处理（不静默吞错）
- [ ] 变更报告和 Evidence Packet 已产出

## 后续推荐

| 场景 | 推荐 Skill |
| --- | --- |
| 实现完成，需要审查 | pm-code-review |
| 发现架构需要调整 | pm-code-architect |
| 发现技术决策需要记录 | pm-decision |

## Output Packet

- **artifact_path**: inline 变更报告（对话中输出）+ 实际代码文件变更
- **artifact_type**: `code_diff`
- **key_decisions**: [本次实现的关键决策 ≤ 3 条（如选了哪个库、用了哪种模式）]
- **open_assumptions**: [标注 `[假设]` 的待验证项（如性能影响、兼容性假设）]
- **next_skill_hint**: `pm-code-review`（实现完成后审查代码质量）
- **handoff_context**: 下游需要但不在变更报告中的上下文（如被推迟到 backlog 的关联变更、已知的边缘场景缺口、架构偏差的原因）
- **evidence_packet**: [Files changed / Checks run / Manual verification / Open risks / Completion claim]
- **sensor_gates**: [Build-Test / Fake-Test / Fake-UI / Privacy-Security / Overengineering 的结果]

**下游消费方式**：pm-code-review 的 Intent Packet "Context Sources" 字段引用此 packet 的 `artifact_path` 和 `key_decisions`。

## Sensor Gates

| Sensor | 触发条件 | 检查方式 | 失败处理 |
|---|---|---|---|
| **Build/Test** | 任意代码变更 | 运行项目实际命令；无命令时写 NOT_RUN + 原因 + manual smoke | Pause→失败先修根因；同一问题 3 次失败停手重审 |
| **Fake Test** | 新增/修改测试或声称测试通过 | 断言是否覆盖真实行为、边界和失败路径 | Pause→补测试；无法补则 Completion claim 降为 PARTIAL |
| **Fake UI** | 新增 UI、按钮、状态、提示 | 每个可见操作是否有真实行为/状态处理 | Pause→实现真实行为或移除/标注不可用入口 |
| **Privacy/Security** | 数据、权限、日志、外部集成 | 扫描 secrets、PII、权限变化、敏感日志 | Block→修复后重新验证 |
| **Overengineering** | 新依赖、新抽象、跨模块改动 | 与架构 Output Packet 对照，解释必要性 | Pause→回退多余抽象或请求架构更新 |

## Meta-Review

交付完成后对照方法论自审：

1. **方法论骨架**：是否遵循 前置检查 → 读取上下文 → 实现规划 → 执行变更 → 验证 → 交付报告 的完整流程？变更文件数是否 ≤ 10？
2. **反理实化警惕**：4 条"你可能在想的"是否真的被警惕了？（重点检查"顺手多改几个文件"、"这个 bug 顺手修了"、"先让代码跑起来之后重构"）
3. **Iron Law 验证**：3 条铁律（无架构不写 / ≤ 10 文件 / 不改 .env 不 force push）是否已验证满足？

**扩展问题（pipeline skill）**：Output Packet 的 `key_decisions` 是否可追溯到架构设计？是否有偏离架构的即兴决策？

自审结果 1-2 句话附在交付物末尾。不通过时回到对应步骤修正，不在 Meta-Review 阶段打补丁。

## Evolution Writeback

执行后自问以下 3 个问题，有则记录到 `docs/evolution-log.md`：

1. **方法论偏差**：6 步执行流程是否有不够贴合实际的地方？（如某步骤经常被跳过、10 文件限制是否合理）
2. **反理实化补充**：是否遇到了表格未覆盖的新借口模式？（如"这个变更很小不需要验证"）
3. **边界调整信号**：CAN/CANNOT 是否需要调整？（如某类实现本应转交但被硬撑）

**记录格式**：

```markdown
## YYYY-MM-DD — pm-code-implement — [项目/场景]
- **观察**: [一句话描述]
- **建议回写**: [回写到哪个文件/章节 / "仅记录不回写"]
- **置信度**: 高/中/低
```

无观察时跳过此章节，不强写。

## Metadata

```yaml
track: engineering
phase: 3
depends_on: [pm-code-architect]
feeds_to: [pm-code-review]
schema_type: free
persist_to: []
guardrails:
  - 变更文件数 ≤ 10
  - 不修改 .env 文件
  - 不执行 force push
  - 代码变更后必须运行 typecheck / lint（如有配置）
  - 无架构设计时拒绝执行
```
