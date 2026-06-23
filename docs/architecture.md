# AI Builder OS 架构说明

## 当前状态

- 阶段：AI Builder OS 1.0 系列；Milestone 5 Project Onboarding 已接入，后续 patch release 使用显式版本/tag 的 dry-run 发布准备流程
- 本地研究归档：`references/source-blueprints/`（git ignored，不进入 package surface）
- 当前 npm 包名：`pm-copilot-skills`
- 产品身份：AI Builder OS

这个仓库已经从 PM skill 包收敛为 AI Builder OS。源 `package.json` 仍保留 `pm-copilot-skills` 兼容 npm package id，目的是保留既有安装方式、验证命令和下游消费链路；active skill surface 和 package surface 已收敛为 AI Builder OS。

## 产品定义

AI Builder OS 是一套 AI 原生构建操作系统，服务于产品经理、企业数字化从业者、AI 产品构建者、非程序员和独立创造者。

它帮助用户把想法、需求、业务问题和项目上下文，转化为 Codex、Claude Code、Qoder、Cursor、Trae、Workbuddy 以及通用 agent runtime 可以执行、验证和复用的构建流程。

核心工作流：

```text
想法 -> 判断路径 -> 规格 -> 原型 -> Agent Task Packet -> 执行 -> 证据 -> 发布/评审 -> 演进
```

M6 Delivery Kernel 在该链路中提供轻量交付内核：

```text
新建 create -> Module Execution Pack -> Agent Task / Prototype / Review
迭代 improve -> Change Contract -> 实现 -> Definition Drift Check
重塑 reframe -> Asset Digestion + Target Shape -> Execution Pack -> 实现/评审
```

Delivery Kernel 是横切协议，不是新的 core skill。它用中文优先的“新建 / 迭代 / 重塑”模式约束复杂构建任务的开工准备、范围冻结、状态续接和定义同步。

首次进入项目时，AI Builder OS 先通过 Project Onboarding Protocol 判断项目模式：

```text
greenfield | brownfield | resume | unknown
  -> project profile proposal
  -> artifact index initialization proposal
  -> builder-router / builder-frame / builder-review / builder-agent-task
```

Project Onboarding 是 Memory / Harness / Artifact Governance 的横切协议，不是新的 core skill。它不在安装时自动写入用户项目，不自动创建 `.ai-builder/`，不自动扫描全盘，也不自动迁移、删除或重命名已有资产。

## 九层架构

```text
AI Builder OS
├── 1. Builder Kernel          # 路由、协议、门禁、证据和交接规则
├── 2. Loop Recipes            # 可重复、可验证、可停止的工作循环
├── 3. Execution Harness       # 执行指南、传感器、门禁、运行报告
├── 4. Memory & Evolution      # 用户/项目/产物/决策/skill 演进记忆
├── 5. Core Skills             # builder-router、builder-plan-goal 等核心能力
├── 6. Scenario Bundles        # 按场景组合的可安装能力包
├── 7. References & Templates  # 方法、清单、模板和示例
├── 8. Eval System             # 触发、路由、契约、质量、证据、artifact、onboarding 和回归评测
└── 9. Runtime Adapters        # 面向不同 agent runtime 的投影说明
```

## 分层职责

| 层 | 职责 | 当前产物 |
| --- | --- | --- |
| Builder Kernel | 路由、Plan/Goal 判断、packet、门禁、证据协议、交接规则 | `kernel/` |
| Loop Recipes | 描述可重复、可验证、可停止的周期工作流，不替代 skill | `loops/` |
| Execution Harness | 执行指南、传感器、门禁、steering loop、工具策略、project onboarding、运行报告 | `harness/` |
| Memory & Evolution | 用户记忆、项目记忆、project profile、产物索引、决策记忆、skill 演进 | `memory/` |
| Core Skills | 面向构建工作的核心 workflow，带明确输出契约 | `skills/builder-*` |
| Scenario Bundles | 按使用场景组织的可安装 skill 组合 | `bundles/core/` |
| References & Templates | 方法论、检查清单、产物模板、示例；M6 增加 Module Execution Pack、Change Contract、Branch State、Definition Drift Check | `references/`, `templates/` |
| Eval System | 触发、路由、契约、质量、证据、artifact、onboarding、e2e、回归和个性化评测 | `evals/` |
| Runtime Adapters | 面向不同 runtime 的投影说明，不复制方法论 | `adapters/` |

## Package Surface

M3.2 后，AI Builder OS 的对外 package surface 由以下文件共同定义：

| 文件 | 作用 |
| --- | --- |
| `package.json` | 保留 `pm-copilot-skills` 兼容 npm package id，并提供 `ai-builder-os` 命令别名 |
| `skill-pack.json` | 机器可读的 AI Builder OS manifest，声明 active surface、bundle、adapter、release gate 和 legacy 排除边界 |
| `agents/openai.yaml` | 面向 OpenAI/Codex 生态的 package-level metadata |
| `bundles/core/manifest.json` | AI Builder OS core bundle 定义 |
| `install.js` | Runtime 安装入口，默认只安装 8 个 `builder-*` active skills，并投影共享 `kernel/harness/memory/loops/references/templates/adapters` |
| `scripts/export-ai-builder-os.js` | Runtime projection 工具，导出 Codex、Claude Code、generic-agent 目标目录 |
| `adapters/*/adapter.json` | Runtime adapter manifest，声明 export layout、默认目标和 invocation prefix |
| `scripts/validate-trigger-descriptions.js` | Trigger description gate，验证 skill frontmatter 触发描述和 confusing skill 边界 |
| `scripts/validate-artifact-evals.js` | Artifact eval gate，验证 `evals/artifact/*.cases.json` 的结构、fail-closed 约束和 proposal-only 关键词 |
| `scripts/validate-onboarding-evals.js` | Project onboarding eval gate，验证 `evals/onboarding/project-onboarding.cases.json` 的首次进入项目路由样例 |
| `scripts/validate-dual-package-dry-run.js` | 双包 dry-run gate，验证 `ai-builder-os` 主包和 `pm-copilot-skills` 兼容包的 pack/install 可行性 |

## Runtime Adapter / Export

M3.3 支持三类 runtime projection：

| Target | Layout | 说明 |
| --- | --- | --- |
| `codex` | `flat-skill-root` | 直接导出到 Codex skill root，每个 builder skill 自包含共享资源 |
| `claude-code` | `flat-skill-root` | 直接导出到 Claude Code skill root，每个 builder skill 自包含共享资源 |
| `generic-agent` | `package-root` | 导出为通用 package root，`skills/` 与共享资源分层存放 |

`npm run validate:runtime-adapters` 会在临时目录中执行三类 export 并验证 projection contract。

## Trigger Description

M3.4 后，8 个 builder skills 的 frontmatter `description` 是 active trigger surface。它必须承载：

- `适用于`：明确 should-trigger 场景。
- `不要用于`：明确 should-not-trigger 边界。
- 相邻 skill handoff：例如 frame 到 spec、prototype 到 review、review 到 decision。

`evals/trigger/builder-description.cases.json` 是静态 trigger description eval；`npm run validate:trigger-descriptions` 是对应 release gate。

## Core Skills v0.1

| Skill | 用途 | 主要产物 |
| --- | --- | --- |
| `builder-router` | 判断当前请求应该走哪条构建路径 | 模式建议 + 下一 skill |
| `builder-plan-goal` | 判断 Prompt / Plan / Goal / Plan -> Goal | 可复制的 Plan/Goal 提示词 |
| `builder-frame` | 把模糊意图转成 Feature Frame | Feature Frame |
| `builder-spec` | 把 Frame 或上下文转成可构建规格 | Mini Spec / PRD / Acceptance Criteria |
| `builder-prototype` | 创建线框图或可交互原型 | Prototype Brief / prototype / mapping |
| `builder-agent-task` | 把人类意图转成 agent 可执行任务 | Agent Task Packet |
| `builder-review` | 评审输出、证据、规格、原型和代码 | Review Report / Evidence Audit |
| `builder-decision` | 保存重要取舍，避免后续反复争论 | Decision Record |

## 迁移边界

Milestone 3.1 已把旧 `pm-*` skills 和 legacy utilities 从 active `skills/` 目录移入可回滚归档：

```text
_archived/pm-copilot-legacy-v1.0/
```

当前 active `skills/` 目录只包含 8 个 `builder-*` core skills。

它不做这些事：

- 不重命名 npm 包；
- 不删除旧 `pm-*` 内容；
- 不把归档内容默认安装为 active skill；
- 不实现 workspace app；
- 不引入 MCP 或部署集成；
- Milestone 3.1 本身不做 trigger description optimization；该工作已在 Milestone 3.4 完成。

## 真相源边界

当前真相源边界：

1. 本仓库仍是 AI Builder OS canonical source；`pm-copilot-skills` 是兼容 npm package id。
2. AI Builder OS 是产品身份、目标架构和 package surface 主叙事。
3. `builder-plan-goal`、`builder-frame`、`builder-spec` 已在 Milestone 2 提升为 v0.1 核心契约，拥有本地 references、templates 和 output-contract evals。
4. Milestone 2.2 新增 UI/UX shared contract、Design Brief template 和 Design Consistency Gate；它们是跨 skill 共享契约，不是新的用户显性 skill。
5. Milestone 2.4 新增 Skill Design Playbook 和 Skill Hardening Brief；它们是后续打磨 `builder-*` skills 的 skill 编写参考和计划模板，不是新的用户显性 skill。
6. `builder-router`、`builder-frame`、`builder-spec`、`builder-prototype`、`builder-agent-task`、`builder-review`、`builder-decision` 已补强触发边界、模式判断、handoff、模板和 output-contract validator。
7. Milestone 2.5 的 release boundary seal 记录在 `docs/release-seal-m2.5.md`，用于提交前 review、commit 拆分、回滚和 M2.6 输入基线。
8. Milestone 3.1 的 archive seal 记录在 `docs/release-seal-m3.1.md`，用于说明 active surface、legacy archive、installer 行为和回滚方式。
9. Milestone 3.2 的 package surface seal 记录在 `docs/release-seal-m3.2.md`，用于说明 manifest、package metadata、command alias、pack gate 和 M3.3 输入。
10. Milestone 3.3 的 runtime adapter/export seal 记录在 `docs/release-seal-m3.3.md`，用于说明 export tooling、adapter manifests、projection contract 和 M3.4 输入。
11. Milestone 3.4 的 trigger description seal 记录在 `docs/release-seal-m3.4.md`，用于说明 frontmatter description、confusing skills 和 M3.5 输入。
12. Milestone 3.5 的 Release Candidate seal 记录在 `docs/release-seal-m3.5.md`，用于说明 1.0 RC 的 git 状态、package surface、install surface、archive surface、release gates、tag/push/package rename 建议和剩余风险。
13. Milestone 3.7 的 package/repo migration dry-run seal 记录在 `docs/release-seal-m3.7.md`，用于说明 `ai-builder-os` 主包和 `pm-copilot-skills` 兼容包的 dry-run contract。
14. Milestone 3.8 的 final 1.0 release seal 记录在 `docs/release-seal-m3.8.md`，用于冻结正式 package names、versions、release tag、publish 顺序和 post-release verification。
15. Milestone 3.8.1 的 multi-runtime smoke seal 记录在 `docs/release-seal-m3.8.1.md`，用于确认 Codex、Claude Code 和 generic-agent/QoderWork 的安装、导出和加载边界。
16. Milestone 3.9 的 publish prep seal 和 runbook 记录在 `docs/release-seal-m3.9.md` 与 `docs/release-runbook-m3.9.md`，用于生成 dry-run-only 双包发布投影，不执行真实 publish 或 final tag；post-1.0 patch release 必须显式传入未发布版本和 tag。
17. `docs/release-plan-1.0.md` 是 1.0 命名、迁移、发布顺序和兼容策略的当前计划。
18. Runtime adapters 是投影说明，不是独立源头。
19. Project Onboarding Protocol 用于首次进入或恢复项目时生成 project profile 和 artifact index 初始化建议；它只输出 proposal，不自动写入、扫描、迁移、删除或重命名用户项目资产。
20. `docs/release-note-milestone-5-project-onboarding.md` 是 Milestone 5 Project Onboarding 的用户价值和交付摘要，不替代架构说明或发布 runbook。
21. `references/source-blueprints/` 只作为本地研究归档存在，已被 git ignore；它可保存早期源蓝图、历史设计输入和 benchmark synthesis，但不覆盖当前协议、schema、loop、skill、eval，也不得进入 package surface 或 runtime export。
22. M6 Delivery Kernel 记录在 `docs/delivery-kernel.md`；它新增 `create`、`improve`、`reframe` 三种交付模式和 Definition Sync Loop，但仍保持 8 个 active builder skills，不新增用户显性 skill。

## 验证策略

当前验证基线必须持续通过：

```bash
npm run validate:builder-os
npm run validate:package-surface
npm run validate:runtime-adapters
npm run validate:trigger-descriptions
npm run validate:artifact-evals
npm run validate:onboarding-evals
npm run validate:dual-package-dry-run
npm run validate:codex-install
npm run validate:doctor-preference-e2e
npm run test:doctor-preference-e2e
```

随着骨架成熟，`validate:builder-os` 应逐步覆盖 AI Builder OS 目录、packet schema、bundle manifest、adapter notes 和 builder skill 契约。
