---
name: pm-code-architect
displayName: Code Architect
displayDescription: 消费 PRD/Tech Spec，产出系统架构设计
description: "Design system architecture from PRD and Tech Spec. Trigger when user says 'architect', 'system design', '目录结构', '组件拆分', '架构设计', 'component design', or needs to translate requirements into code structure."
user-invocable: true
argument-hint: "[功能/模块名称]"
---

# 架构设计

<SUBAGENT-STOP>
如果是子代理派发执行此 Skill，直接按下方指令执行，不重新加载入口 Skill。
</SUBAGENT-STOP>

从 PRD/Tech Spec 到可执行的代码结构。架构是需求到工程的第一道翻译——翻译错了，后面全错。

**核心原则**：没有目录树的架构不是架构。

## Intent Packet

| 字段 | 捕获内容 | 来源 |
|---|---|---|
| **Want** | 把 PRD/需求翻译为可执行的代码结构（目录树 + 组件关系 + 数据模型 + 接口契约 + 验证路径） | 用户输入剥离"设计架构"后的问题本质 |
| **Constraints** | 项目已有框架（Next.js / Tauri / 等）、已有依赖清单、团队熟悉度、最小可验证实现边界 | 项目 CLAUDE.md + package.json/Cargo.toml 推断 |
| **Context Sources** | 上游 PRD / Tech Spec / Feature Frame / 项目已有代码结构 / 项目 CLAUDE.md | Glob + Read；pipeline 模式引用上游 Output Packet |
| **Depth** | Draft（目录骨架）/ Review（完整 6 章节输出，默认）/ Release（含边缘场景和降级方案） | 用户声明或推断 |
| **Output Target** | 开发团队（执行 pm-code-implement 的工程师） | 用户明示或推断 |

未提供时标注 `[假设]`，交付前确认。

## Iron Law（铁律）

| 铁律 | 违反后果 |
| --- | --- |
| 没有目录树的架构不是架构 | 立即停止——产出完整目录结构后继续 |
| 架构必须兼容现有项目框架 | 立即停止——检查项目 CLAUDE.md 和已有结构后重新设计 |
| 不评估技术取舍的架构是空中楼阁 | 立即停止——每个关键决策必须有取舍分析 |

## 反合理化

| 你可能在想的 | 真相 |
| --- | --- |
| "先写代码再说架构" | 没有架构的代码 = 技术债的种子——改动越晚成本越高 |
| "这个功能很简单，不需要架构" | 简单功能也需要知道放在哪里、和谁交互、数据怎么流 |
| "用最流行的技术栈" | 技术栈选项目已有的，不引入新依赖——除非有充分的取舍论证 |
| "架构设计要覆盖所有细节" | 架构定方向和边界，细节留给实现——但边界必须清晰 |

## Capability Index

| 维度 | CAN（可以做） | CANNOT → HANDOFF（不做，转交） |
|---|---|---|
| **任务类型** | 系统架构设计、目录结构规划、组件拆分、数据模型定义、API 契约、技术取舍分析、验证策略定义 | 写 PRD → pm-prd；写代码 → pm-code-implement；代码审查 → pm-code-review；性能压测/安全审计 → 专项工具或专家 |
| **输出格式** | Markdown 架构文档（6 章节：overview / directory / component / data / api / tech_choices） | 可运行代码 → pm-code-implement；高保真原型 → pm-prototype |
| **深度范围** | 从 PRD 到可执行代码结构（架构级，不到实现级） | 单文件实现细节 → pm-code-implement；架构级取舍决策记录 → pm-decision |

**边界原则**：架构定方向和边界，实现细节留给 pm-code-implement。但边界必须清晰——下游工程师能照此搭骨架。

## 执行流程

```
触发 pm-code-architect
    ├── 1. 读取上下文
    │     ├── 读取项目 CLAUDE.md（确认框架约束）
    │     ├── Glob 项目目录结构（理解现有架构）
    │     ├── Read 相关 PRD / Tech Spec
    │     └── 识别已有组件和依赖
    ├── 2. 架构分析
    │     ├── 确认技术栈（从项目已有，不引入新依赖）
    │     ├── 识别模块边界和数据流向
    │     └── 列出关键架构决策点
    ├── 3. 技术取舍分析
    │     ├── 每个关键决策列出 ≥ 2 个选项
    │     ├── 对比维度：复杂度/可维护性/性能/团队熟悉度
    │     └── 给出推荐 + 理由
    ├── 4. 产出架构设计
    │     ├── architecture_overview
    │     ├── directory_structure（目录树）
    │     ├── component_tree（组件/模块关系）
    │     ├── data_models（数据模型）
    │     ├── api_contracts（接口契约）
    │     ├── tech_choices（技术选型 + 取舍理由）
    │     └── verification_strategy（测试/构建/人工验证路径）
    ├── 5. Sensor Gate 规划
    │     ├── Spec Coverage：PRD 条目如何映射到模块/测试？
    │     ├── Build/Test：下游应运行哪些命令？
    │     └── Privacy/Security：是否涉及权限、PII、日志、secret？
    ├── 6. Iron Law 检查
    │     ├── 目录树是否完整？
    │     ├── 是否兼容现有框架？
    │     └── 每个技术选型是否有取舍分析？
    └── 7. 交付 + 后续推荐
          ├── pm-code-implement（执行实现）
          └── pm-code-review（代码审查）
```

## 输出规范

### 1. Architecture Overview

3-5 句话描述整体架构风格（SPA / SSR / Desktop / 微服务 / 单体等）和核心设计决策。

### 2. Directory Structure

使用树形格式展示新增/变更的目录和文件。标注每个目录的职责。

```
src/
├── features/{module}/     # 新增模块
│   ├── components/        # UI 组件
│   ├── hooks/             # 业务逻辑 hooks
│   ├── types.ts           # 类型定义
│   └── index.ts           # 模块入口
├── shared/                # 共享资源（已有）
│   └── api/               # API 层
└── ...
```

### 3. Component Tree

模块/组件间的依赖关系。用列表或 Mermaid 图表达。

### 4. Data Models

核心数据结构定义（TypeScript interface / SQL schema / 等）。

### 5. API Contracts

接口定义：路径、方法、请求/响应体、错误码。

### 6. Tech Choices

| 决策点 | 选项 A | 选项 B | 选择 | 理由 |
| --- | --- | --- | --- | --- |
| 状态管理 | Zustand | Context | ... | ... |

### 7. Verification Strategy

| 验证项 | 命令/方式 | 覆盖的需求或风险 | 负责人 |
| --- | --- | --- | --- |
| typecheck | `npm run typecheck` / `[项目实际命令]` | 类型契约、接口变更 | engineer |
| unit / integration | `[项目实际命令]` | P0 验收标准、边界场景 | engineer |
| manual smoke | `[核心路径步骤]` | 原型/PRD 的关键用户路径 | PM/QA |

## 交付前检查

- [ ] 目录树完整且兼容现有项目框架
- [ ] 每个新增目录有职责说明
- [ ] 技术选型全部来自项目已有依赖（或已论证新依赖的必要性）
- [ ] 数据模型覆盖 PRD 中的核心实体
- [ ] API 契约包含错误处理
- [ ] 关键技术取舍已列出（≥ 2 选项 + 理由）
- [ ] Verification Strategy 明确到命令/人工步骤，不只写"后续测试"
- [ ] Spec Coverage 映射已覆盖 P0 需求或明确标注缺口
- [ ] Privacy/Security 影响已判断（secrets、PII、权限、日志）
- [ ] 无模糊表述（"后续优化"、"按需添加"等）

## 后续推荐

| 场景 | 推荐 Skill |
| --- | --- |
| 开始编码实现 | pm-code-implement |
| 架构需要先验证技术可行性 | pm-prd（需求文档） |
| 架构涉及重大取舍 | pm-decision |

## Output Packet

- **artifact_path**: `projects/{project}/docs/architecture.md`
- **artifact_type**: `architecture`
- **key_decisions**: [技术栈选择 + 关键取舍结论 + 目录结构核心决策 ≤ 3 条]
- **open_assumptions**: [标注 `[假设]` 的待验证项（如团队对新依赖的熟悉度）]
- **next_skill_hint**: `pm-code-implement`（按架构开始编码）
- **handoff_context**: 下游需要但不在架构正文中的上下文（如被否决的备选架构、性能预算约束、团队技术债背景）
- **verification_strategy**: [下游必须运行或人工验证的命令/步骤；不能确定时标注 `[待确认]`]
- **sensor_gates**: [Spec Coverage / Build-Test / Privacy-Security / Overengineering 中命中的检查]

**下游消费方式**：pm-code-implement 的 Intent Packet "Context Sources" 字段引用此 packet 的 `artifact_path` 和 `key_decisions`。

## Sensor Gates

| Sensor | 触发条件 | 检查方式 | 失败处理 |
|---|---|---|---|
| **Spec Coverage** | PRD / Feature Frame 输入存在 | 每个 P0 需求映射到目录、数据模型、API 或验证项 | Pause→补映射；无法覆盖则在 open_assumptions 标注 |
| **Build/Test** | 下游会进入实现 | 列出项目实际 typecheck/lint/test/build 命令或说明缺失 | Pause→无命令时写人工 smoke 路径，不得写"测试后补" |
| **Privacy/Security** | 涉及用户数据、权限、日志、外部 API | 标记 PII、secret、auth、audit/log 风险 | Block→高风险无策略时转人工安全/架构评审 |
| **Overengineering** | 引入新层、新依赖、新服务 | 说明为何现有结构不能覆盖 | Pause→无必要性时退回现有模式 |

Release 保真度必须把 Sensor Gate 结论写入 Output Packet；Draft/Review 至少记录命中的 gate 和未验证项。

## Meta-Review

交付完成后对照方法论自审：

1. **方法论骨架**：是否遵循 上下文读取 → 架构分析 → 技术取舍 → 6 章节产出 → Iron Law 检查 的完整流程？技术选型是否来自项目已有依赖？
2. **反理实化警惕**：4 条"你可能在想的"是否真的被警惕了？（重点检查"先写代码再说架构"、"用最流行的技术栈"、"架构设计要覆盖所有细节"）
3. **Iron Law 验证**：3 条铁律（目录树完整 / 兼容现有框架 / 每个决策有取舍分析）是否已验证满足？

**扩展问题（pipeline skill）**：Output Packet 的 `key_decisions` 是否可追溯到技术取舍分析表？

自审结果 1-2 句话附在交付物末尾。不通过时回到对应步骤修正，不在 Meta-Review 阶段打补丁。

## Evolution Writeback

执行后自问以下 3 个问题，有则记录到 `docs/evolution-log.md`：

1. **方法论偏差**：6 章节输出结构是否有不够贴合实际的地方？（如某章节经常空、某类项目需要额外章节）
2. **反理实化补充**：是否遇到了表格未覆盖的新借口模式？
3. **边界调整信号**：CAN/CANNOT 是否需要调整？（如某类架构本应转交但被硬撑）

**记录格式**：

```markdown
## YYYY-MM-DD — pm-code-architect — [项目/场景]
- **观察**: [一句话描述]
- **建议回写**: [回写到哪个文件/章节 / "仅记录不回写"]
- **置信度**: 高/中/低
```

无观察时跳过此章节，不强写。

## Metadata

```yaml
track: engineering
phase: 3
depends_on: [pm-prd]
feeds_to: [pm-code-implement]
schema_type: enforced
persist_to:
  - projects/{project}/docs/architecture.md
guardrails:
  - 目录结构必须兼容现有项目框架（Next.js / Tauri / 等）
  - 不引入项目未使用的新依赖，除非有充分论证
  - 架构设计必须包含技术取舍分析
```
