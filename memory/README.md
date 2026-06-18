# Memory & Evolution

Memory 让 AI Builder OS 从一次性回答变成可延续的构建系统。

Memory 只记录未来任务有复用价值的上下文、偏好、资产、决策和 skill 进化信号；它不保存全部聊天记录，也不把临时过程材料默认升级为长期资产。

## Memory Types

| Type | Purpose |
| --- | --- |
| User Memory | 用户长期工作偏好和输出偏好 |
| Project Memory | 项目目标、约束、阶段、已知资产和下一步 |
| Artifact Memory | Feature Frame、Spec、Prototype、Agent Task Packet、Review、Decision 等资产索引 |
| Decision Memory | 关键取舍、反转条件和后续检查点 |
| Skill Evolution Memory | trigger miss、模板问题、缺失 gate、缺失 eval |

## Project Onboarding

Project Onboarding 是 AI Builder OS 首次进入或恢复一个项目时的横切协议，不是第 9 个核心 skill。它负责判断项目进入模式，并在不自动写入用户项目的前提下，生成 project profile、artifact index 初始化建议和下一步 handoff。

最小协议由以下文件组成：

```text
memory/schemas/project-profile.schema.md
harness/project-onboarding-policy.zh.md
harness/project-greenfield-bootstrap-policy.zh.md
harness/project-brownfield-intake-policy.zh.md
```

项目模式：

- `greenfield`：从 0 开始的新项目，先建立项目锚点，通常交给 `builder-frame`。
- `brownfield`：已有文档、代码、原型、脚本或历史决策，先做资产盘点和 source-of-truth 候选，通常交给 `builder-review`。
- `resume`：已有 `.ai-builder/`、project profile 或 artifact index，可基于既有状态继续。
- `unknown`：证据不足，先输出最小澄清问题。

执行原则：

- 不在安装或 onboarding 时自动创建 `.ai-builder/`。
- 不自动扫描全盘。
- 不自动迁移、删除、重命名或归档已有资产。
- 所有 brownfield 清理、迁移、重命名都必须先生成 proposal。
- Project Onboarding 生成的是进入项目的 proposal；Artifact Governance 负责后续资产生命周期和一致性治理。

## Artifact Governance

Artifact Governance 是 Memory / Harness / Loop / Eval 的横切协议，不是第 9 个核心 skill。它负责让项目产物具备身份、状态、来源、依赖、保留策略和一致性检查。

最小协议由以下文件组成：

```text
memory/schemas/artifact-index.schema.md
memory/policies/artifact-lifecycle-policy.zh.md
memory/policies/artifact-cleanup-policy.zh.md
memory/policies/artifact-consistency-policy.zh.md
```

执行原则：

- 所有可复用产物必须登记到 `artifact-index.yaml` 或在 Output Packet 中给出登记建议。
- `current` 资产是默认可信入口；`draft`、`working` 和 `temp` 不能作为下游唯一依据。
- 清理动作必须先生成 cleanup proposal；AI Builder OS 不自动删除高风险资产。
- 一致性审计优先检查 Decision Record、current Spec、Prototype Mapping、Agent Task Packet、代码/脚本/HTML 和 Evidence Packet 的链路是否冲突。

## Project Runtime Draft

```text
.ai-builder/
├── PROJECT.md
├── MEMORY.md
├── artifact-index.yaml
├── decision-log.md
├── run-log.md
└── evolution-log.md
```

This project runtime is a future consumer-facing convention. Phase 1 only defines it. Project Onboarding may propose this runtime, but must not create it automatically.
