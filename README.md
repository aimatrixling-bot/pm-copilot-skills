# AI Builder OS

[![npm version](https://img.shields.io/npm/v/pm-copilot-skills.svg)](https://www.npmjs.com/package/pm-copilot-skills)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![Skills](https://img.shields.io/badge/active_skills-8_builder_core-green.svg)](skills/)

**AI Builder OS** 是一套面向产品经理、企业数字化从业者、AI 产品构建者、非程序员和独立创造者的 AI 原生构建操作系统。它帮助用户把模糊想法、业务问题、产品需求或个人项目，转化为 Agentic 工具可以理解、执行、验证和沉淀的构建流程。

> 本仓库是 AI Builder OS 的 canonical source（权威源）。`pm-copilot-skills` 仍是兼容 npm package id；`ai-builder-os` 是产品身份和安装命令别名。
>
> 默认输出语言：用户可见报告、检查结果、原型文案、交接材料以**中文为主**；代码、字段名、命令、API、包名、行业通用缩写和固定术语可保留英文。
>
> 1.0 系列发布机制：真实 `package.json` 仍保留 `pm-copilot-skills` 兼容 npm package id；双包发布准备脚本用于生成 `ai-builder-os` 主包与 `pm-copilot-skills` 兼容包的 release projection、tarball 和 manifest。准备脚本只做 dry-run，不执行 npm publish，不创建 final tag；真实发布必须基于干净的 release commit 和明确的版本/tag。
>
> legacy archive：旧 `pm-*` skills、legacy utilities 和原 `skills/references/` 已归档到 [`_archived/pm-copilot-legacy-v1.0/`](_archived/pm-copilot-legacy-v1.0/)，不再默认安装为 active skills。
>
> v0.7.0 方向：形成克制、可靠、可扩展的 Builder OS。旧 PM 蓝图保留在 [`blueprint.md`](./_archived/pm-copilot-legacy-v1.0/skills/references/builder-os/blueprint.md)；AI Builder OS 早期研究源蓝图可保留在本地 ignored `references/source-blueprints/`，不进入 git 或 package surface。
>
> v0.6.0 已把 Meta_Kim 方法论层（Intent Packet / Capability Index / Gates / Meta-Review / Output Packet / Evolution Writeback）集成到全部 16 个 skills。统一结构见 [Skill 结构](#skill-结构)。
>
> v0.5.0 基于内部 AI Native PM 真实工作流研究，把原 36 个 skills 收敛为 16 个 pipeline-aligned skills。

## 为什么需要 AI Builder OS？

- **Builder First**：所有能力都服务于产出可执行、可验证、可复用的构建资产，而不是泛泛建议。
- **Asset-Oriented**：核心产物包括 Feature Frame、Spec、Prototype、Agent Task Packet、Review Report、Decision Record。
- **Router First**：用户不需要先知道 skill 名称，系统先判断 Prompt / Plan / Goal / builder workflow。
- **Plan before Goal**：模糊和复杂任务先 Plan；清晰、可验收、有边界的任务才进入 Goal。
- **Evidence over Claim**：Builder 工作流必须给出验证证据，而不是声称“应该能跑”。
- **Runtime-Agnostic**：canonical source 不绑定 Codex 或 Claude Code，通过 adapters 投影到不同 Agentic 工具。
- **Eval-Driven Evolution**：skill、router、template、gate 的变更应有 eval 或 regression case 支撑。
- **归档旧资产**：旧 `pm-*` skills、legacy utilities 和原 `skills/references/` 已进入可回滚 archive，后续按需迁移为 references、templates 或 eval cases。
- **知识库支撑**：旧 PM theory KB 已归档为方法资产；AI Builder OS active references 只保留当前 builder workflow 需要消费的共享契约。
- **权威源优先**：本包先迭代，满意后再同步到下游 Agent。
- **中文优先输出**：用户可见内容默认中文；必要的代码/API/产品术语保留英文。
- **低配置使用**：安装一次，即可在 Claude Code 等 skill runtime 中使用。
- **Delivery Kernel**：M6-M9 增加“新建 / 迭代 / 重塑”三种中文优先交付模式，用 Module Execution Pack、Change Contract、Branch State、Definition Drift Check、schema/eval/validator 和运行时安装同步减少复杂构建任务的定义漂移。

## AI Builder OS 1.0 目标骨架

Milestone 3.1 已将 active surface 收敛为 8 个 `builder-*` core skills。旧 `pm-*` 内容保留在 legacy archive，用于回滚和方法迁移，不再作为默认安装入口。

```text
AI Builder OS
├── Builder Kernel          # routing, packets, gates, protocols
├── Loop Recipes            # 可重复、可验证、可停止的工作循环
├── Execution Harness       # guides, sensors, gates, steering loop, tool policy
├── Memory & Evolution      # user/project/artifact/decision/skill evolution memory
├── Core Skills             # builder-router、builder-plan-goal、builder-frame 等
├── Scenario Bundles        # bundles/core
├── References & Templates  # 共享方法和产物模板
├── Eval System             # trigger, routing, contract, quality, evidence, artifact, e2e
└── Runtime Adapters        # Codex, Claude Code, generic agent
```

详见 [architecture.md](./docs/architecture.md)。

### Core Builder Skills

当前 active skill surface：

| Skill | 作用 | 核心产物 |
| --- | --- | --- |
| `builder-router` | 判断用户当前该走哪条构建路径 | 模式建议 + 下一步 |
| `builder-plan-goal` | 判断 Prompt / Plan / Goal / Plan -> Goal | 可复制 Plan / Goal 提示词 |
| `builder-frame` | 把模糊需求转成 Feature Frame | Feature Frame |
| `builder-spec` | 把 Frame / 需求转成可交付规格 | Spec / PRD / Acceptance Criteria |
| `builder-prototype` | 产出线框图或可交互原型 | Prototype / Mapping / Evidence Packet |
| `builder-agent-task` | 把人类需求转成 Agent 可执行任务包 | Agent Task Packet |
| `builder-review` | 评审规格、原型、Agent 输出和证据 | Review Report / Evidence Audit |
| `builder-decision` | 记录关键取舍 | Decision Record |

Milestone 2 已将 `builder-plan-goal`、`builder-frame`、`builder-spec` 提升为 v0.1 核心契约：每个 skill 都有本地 references/templates/output-contract evals，不再只依赖旧 `pm-*` skill 或外部安装路径。Milestone 2.2 补充了 UI/UX shared contract、Design Brief template 和 Design Consistency Gate，供 `builder-spec`、`builder-prototype`、`builder-agent-task`、`builder-review` 共同消费。Milestone 2.4 新增 Skill Design Playbook 和 Skill Hardening Brief；随后 `builder-router`、`builder-frame`、`builder-spec`、`builder-prototype`、`builder-agent-task`、`builder-review`、`builder-decision` 已按该 playbook 补强触发边界、模式判断、handoff、模板和 output-contract validator。Milestone 3.2 新增 `skill-pack.json` 和 `agents/openai.yaml`，让 package surface 可被机器读取和验证。Milestone 3.4 新增 Trigger description gate，约束 8 个 builder skills 的 frontmatter 触发描述和 confusing skill 边界。Milestone 3.5 形成 AI Builder OS 1.0 Release Candidate seal，用于最终确认当前 package surface 可评审、可安装、可打包、可回滚。Milestone 3.7 新增 dual package dry-run gate，用于验证 `ai-builder-os` 主包和 `pm-copilot-skills` 兼容包的 pack/install 可行性。Milestone 3.8 冻结 AI Builder OS 1.0 final release seal，用于确认正式 tag、publish 顺序和 post-release verification。Milestone 3.8.1 验证 Codex、Claude Code 和 generic-agent/QoderWork 的多 runtime 安装与加载路径。Milestone 3.9 新增发布 runbook 和 dry-run-only 双包发布准备脚本；真实发布仍需用户再次明确批准。Milestone 4/5 新增 Artifact Governance 与 Project Onboarding 的轻量横切协议、回归样例和专用 validator，仍保持 8 个 active builder skills。Milestone 6-M9 新增 Delivery Kernel v0.1，以“新建 / 迭代 / 重塑”三种模式补齐 Execution Pack、Change Contract、Branch State、Definition Drift Check、output-contract schema、routing/trigger/delivery eval、validator 和 Codex runtime 安装同步。

## 快速安装

```bash
# 安装到 Claude Code 全局 skills 目录
npx pm-copilot-skills

# 安装到当前项目的 Claude Code skills 目录
npx pm-copilot-skills project

# 安装到 Codex 用户级 skills 目录（~/.agents/skills）
npx pm-copilot-skills codex

# 安装到当前项目的 Codex skills 目录（./.agents/skills）
npx pm-copilot-skills codex-project

# 安装到 Codex home skills 目录（兼容/排查用途）
npx pm-copilot-skills codex-home

# 使用 AI Builder OS 命令别名（package id 仍是 pm-copilot-skills）
npx -p pm-copilot-skills ai-builder-os codex
```

默认不会覆盖目标目录中已有、且不是由 `pm-copilot-skills` 安装的 skill。确实需要覆盖时显式追加 `--overwrite`。

安装器默认只安装 8 个 `builder-*` active skills，并为每个 builder skill 投影共享 `kernel`、`references`、`templates`、`adapters` 资源。旧 `pm-*`、`download-anything`、`pdf`、`pptx` 和旧 `skills/references` 不再默认安装；若目标目录中存在由本包旧版本安装的 legacy 副本，安装器会根据 `.pm-copilot-skills-source.json` marker 清理它们。

### 安装未发布的当前分支最新版

在 M3.9 正式 npm publish 前，`npx ai-builder-os` 还不能代表最新主包。需要把当前分支安装到其他 runtime 时，从本地 checkout 执行：

```bash
cd "D:\Max Brain for AI Copilot\30_Projects\personal\pm-copilot-skills"

# Codex 用户级
node install.js codex --overwrite

# Claude Code 全局
node install.js global --overwrite

# generic-agent / QoderWork 文件投影
npm run export:runtime -- --target generic-agent --out "<runtime-readable-dir>" --clean
```

Claude Code 项目级安装需要在目标项目目录执行：

```bash
cd "<target-project>"
node "D:\Max Brain for AI Copilot\30_Projects\personal\pm-copilot-skills\install.js" project --overwrite
```

QoderWork 当前按 `generic-agent` 消费：读取 `<runtime-readable-dir>/.ai-builder-os/export-manifest.json`，默认入口使用 `skills/builder-router/SKILL.md`，需要 Plan/Goal 决策时使用 `skills/builder-plan-goal/SKILL.md`。

## AI Builder OS package surface

M3.2 后，对外 package surface 由这些文件共同定义：

- `package.json`：保留 `pm-copilot-skills` 兼容 npm package id，并提供 `ai-builder-os` 命令别名。
- `skill-pack.json`：机器可读的 AI Builder OS manifest，声明 active skills、共享资源、runtime adapters、release gates 和 legacy 排除边界。
- `agents/openai.yaml`：面向 OpenAI/Codex 生态的轻量 metadata，声明 pure builder core surface。
- `bundles/core/manifest.json`：AI Builder OS core bundle。
- `install.js`：把 8 个 active builder skills、共享 `kernel/harness/memory/loops/references/templates/adapters`，以及运行时必需的 `docs/delivery-kernel.md`、`docs/source-of-truth-map.md` 投影到 Claude Code / Codex / generic skill 目录。
- `scripts/export-ai-builder-os.js`：把 active builder core 导出到 Codex、Claude Code 或 generic-agent 目标目录。
- `adapters/*/adapter.json`：声明 runtime target 的 export layout、默认目标和 invocation prefix。
- `scripts/validate-trigger-descriptions.js` 与 `evals/trigger/builder-description.cases.json`：验证 8 个 builder skills 的 frontmatter trigger description。
- `scripts/validate-artifact-evals.js` 与 `evals/artifact/*.cases.json`：验证 Artifact Governance 回归样例的结构、fail-closed 约束和 proposal-only 关键词。
- `scripts/validate-onboarding-evals.js` 与 `evals/onboarding/project-onboarding.cases.json`：验证 Project Onboarding 的 greenfield、brownfield、resume、unknown 路由样例。
- `docs/delivery-kernel.md`、`loops/recipes/definition-sync.loop.md`、`templates/*execution* / *contract* / *drift*` 与 `evals/delivery-kernel/delivery-kernel.cases.json`：验证复杂交付任务的新建、迭代、重塑和 definition drift 闭环。
- `scripts/validate-dual-package-dry-run.js`：在临时目录验证 `ai-builder-os` 主包和 `pm-copilot-skills` 兼容包都能 pack dry-run 和安装 dry-run。

`_archived/`、`research/`、本地 ignored `references/source-blueprints/`、`docs/release-*` 和 `docs/*hardening-brief.md` 不进入 npm package surface 或 runtime export；它们只作为审阅、回滚、研究、发布证据或后续迁移材料。npm package 仅发布长期可复用的 `docs/architecture.md`、`docs/delivery-kernel.md`、`docs/source-of-truth-map.md`。

## Dual package dry-run

M3.7 后，正式 publish 前先验证双包投影：

```bash
npm run validate:dual-package-dry-run
```

该检查不会 publish npm，也不会修改真实 `package.json` 的 `name`。它会在临时目录生成两个 projection：

- `ai-builder-os`：1.0 正式主包候选。
- `pm-copilot-skills`：兼容包候选。

两个 projection 都必须通过 `npm pack --dry-run --json`，并在临时项目中运行 `node install.js codex-project --overwrite`，确认项目 `.agents/skills` 中只安装 8 个 active builder skills。

M3.8 之后，`sync-and-publish.sh` 仍只能视为 canonical source 的 release gate helper 和历史单包发布脚本；它不是 `ai-builder-os` / `pm-copilot-skills` 正式双包发布器。M3.9 发布时必须按 [`docs/release-runbook-m3.9.md`](./docs/release-runbook-m3.9.md) 的顺序执行，并先通过专用双包发布准备脚本的 dry-run。

## M3.9 publish prep

正式发布前使用专用 dry-run-only 工具生成双包 projection 和 tarball：

```bash
npm run prepare:dual-package-publish -- --out ".release/ai-builder-os-v1.0.0" --clean --check-registry --npm-publish-dry-run
```

post-1.0 patch release 必须显式传入未发布版本和 tag，例如：

```bash
npm run prepare:dual-package-publish -- --version 1.0.2 --tag ai-builder-os-v1.0.2 --out ".release/ai-builder-os-v1.0.2" --clean --check-registry --npm-publish-dry-run
```

该脚本拒绝 `--publish`，不会执行真实 `npm publish`。真实发布必须按 [`docs/release-runbook-m3.9.md`](./docs/release-runbook-m3.9.md) 手工执行，并在执行 tag、npm publish 或 GitHub Release 前再次获得用户明确批准。

## Runtime adapter/export

M3.3 后，可用离线 export tooling 验证并生成 runtime projection：

```bash
# 查看支持的 runtime targets
npm run export:runtime -- --list-targets

# Codex / Claude Code：flat skill root layout
npm run export:runtime -- --target codex --out .\dist\ai-builder-os\codex --clean
npm run export:runtime -- --target claude-code --out .\dist\ai-builder-os\claude-code --clean

# Generic agent：package root layout
npm run export:runtime -- --target generic-agent --out .\dist\ai-builder-os\generic-agent --clean
```

`--clean` 只会清理空目录、临时目录、repo `dist/` 下目录，或已有 `.ai-builder-os-export-target` marker 的目录。

Codex / Claude Code exports 会在每个 builder skill 内嵌共享 `kernel`、`references`、`templates` 和 `adapters`，保证 skill 目录自包含。Generic agent export 会把共享资源放在 package root。

## Trigger description gate

M3.4 后，8 个 builder skills 的 YAML frontmatter `description` 必须同时说明：

- 何时触发：使用 `适用于` 承载具体场景。
- 何时不要触发：使用 `不要用于` 标出相邻 skill 的边界。
- 关键产物：例如 Feature Frame、Mini Spec、prototype、Agent Task Packet、Review Report、Decision Record。

```bash
npm run validate:trigger-descriptions
```

该 gate 会检查 `evals/trigger/builder-description.cases.json` 中的 expected skill 和 confusing skills，避免 router/spec/prototype/review/decision 等相邻能力互相吞掉请求。

## 验证

发布或镜像到下游 Agent 前，先运行结构化 Builder OS 检查和真实 E2E 验收：

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

这些检查会验证 canonical source 边界、package surface、runtime adapter/export、Codex 本地安装完整性、Builder OS 核心结构、trigger eval 种子覆盖、Artifact Governance / Project Onboarding 回归样例，以及一个真实医生偏好推荐需求的端到端场景。

## Legacy PM Pipeline（已归档）

以下内容来自旧 `pm-copilot` pipeline，已归档到 `_archived/pm-copilot-legacy-v1.0/`。它不再是 AI Builder OS 1.0 的 active skill surface，只作为方法迁移和回滚参考。

```text
Phase 0: Discovery          Phase 1: Design & Build
+------------------+        +------------------+
| pm-discovery     |------->| pm-feature-frame |
| pm-deconstruct   | packet | pm-prototype     |
+------------------+  +---> +--------+---------+
                             |
Phase 2: Quality & PRD       | packet
+------------------+         v
| pm-code-review   |<-------| pm-prd           |
+------------------+ packet +--------+---------+
                             |
Phase 3: Construct           | packet
+------------------+         v
| pm-code-architect|<-------| pm-code-implement|
+------------------+ packet +------------------+

Phase 4: Ship & Decide
+------------------+
| pm-comp          |  (analysis + critique modes)
| pm-launch        |
| pm-content-general|
+------------------+

Cross-cutting: pm-decision | pm-prioritize (RICE + roadmap + backlog)
Special: pm-ai-patterns | pm-agent-patterns
Personal: pm-job-search
```

**Packet flow**：流水线型 skills 输出 `Output Packet`（artifact_path + key_decisions + next_skill_hint + handoff_context），下游 skill 通过 Intent Packet 的 `Context Sources` 字段消费。Phase 4 和横切型终端 skills 不输出 packet。

## Legacy Skills by Phase（已归档）

### Phase 0: Discovery（2 个 skills）

| Skill | 触发方式 | 作用 |
| --- | --- | --- |
| `pm-discovery` | `/pm-discovery` | 端到端产品发现：从 idea 到 validated opportunity |
| `pm-deconstruct` | `/pm-deconstruct` | 反向拆解产品：从交互层还原到战略意图 |

### Phase 1: Design & Build（2 个 skills）

| Skill | 触发方式 | 作用 |
| --- | --- | --- |
| `pm-feature-frame` | `/pm-feature-frame` | 问题验证 + 功能构想：从问题到原型的桥梁 |
| `pm-prototype` | `/pm-prototype` | 高保真交互原型 + 低保真线框图（`--fidelity=low | high`） |

### Phase 2: Quality & PRD（2 个 skills）

| Skill | 触发方式 | 作用 |
| --- | --- | --- |
| `pm-code-review` | `/pm-code-review` | 审查代码的安全、逻辑、性能和证据可信度 |
| `pm-prd` | `/pm-prd` | PRD + acceptance criteria（`--include-acceptance`）+ engineering request（`--eng-request`） |

### Phase 3: Construct（2 个 skills）

| Skill | 触发方式 | 作用 |
| --- | --- | --- |
| `pm-code-architect` | `/pm-code-architect` | 基于 PRD / Tech Spec 设计系统架构 |
| `pm-code-implement` | `/pm-code-implement` | 基于架构方案执行代码实现 |

### Phase 4: Ship & Decide（3 个 skills）

| Skill | 触发方式 | 作用 |
| --- | --- | --- |
| `pm-comp` | `/pm-comp` | 竞品分析（`--mode=analysis`）+ 产品批判（`--mode=critique`） |
| `pm-launch` | `/pm-launch` | 发布计划、Go/No-Go 和 release checklist |
| `pm-content-general` | `/pm-content-general` | 生成 blog、landing page、release notes、产品文档 |

### Cross-cutting（2 个 skills）

| Skill | 触发方式 | 作用 |
| --- | --- | --- |
| `pm-decision` | `/pm-decision` | 结构化决策：记录理由、取舍和后续影响 |
| `pm-prioritize` | `/pm-prioritize` | RICE 打分 + roadmap planning + sprint backlog（`--mode=prioritize | roadmap | backlog`） |

### Specialized: AI Products（2 个 skills）

| Skill | 触发方式 | 作用 |
| --- | --- | --- |
| `pm-ai-patterns` | `/pm-ai-patterns` | AI 产品设计模式：交互、信任、个性化、评估 |
| `pm-agent-patterns` | `/pm-agent-patterns` | AI Agent 架构与安全模式：identity、memory、tools、safety |

### Personal（1 个 skill）

| Skill | 触发方式 | 作用 |
| --- | --- | --- |
| `pm-job-search` | `/pm-job-search` | PM 求职材料：JD 分析、简历、面试准备 |

### Legacy Utilities（已归档）

| Skill | 作用 | License |
| --- | --- | --- |
| `pdf` | PDF 处理：extract、create、merge、split | Proprietary (c) Anthropic, PBC |
| `pptx` | 演示文稿创建和编辑（.pptx） | Proprietary (c) Anthropic, PBC |
| `download-anything` | 查找和下载数字资源 | No license declared |

## 知识库

旧 `pm-*` skills 曾引用 `skills/references/` 中的共享知识库；这些资料现在位于 `_archived/pm-copilot-legacy-v1.0/skills/references/`，可作为迁移来源。AI Builder OS active references 位于顶层 `references/`：

- **Methodology KB**：23 本经典 PM 书籍沉淀出的可执行模式。
- **Quality Gates**：Iron Law、输出质量标准、Builder OS 证据协议和中文优先语言协议。
- **Design KB**：UI patterns 和 component references。
- **Builder OS Blueprint（历史版）**：多来源综合、反膨胀规则和 runtime adapter 边界，位于 `_archived/pm-copilot-legacy-v1.0/skills/references/builder-os/`。
- **Local Research Blueprints（本地研究源蓝图）**：AI Builder OS 早期重建总纲、Loop Engineering 输入和 benchmark synthesis 可保留在本地 ignored `references/source-blueprints/`；它们不进入 git、npm package 或 runtime export。

## Skill 结构

每个 `SKILL.md` 遵循 [skill-template.md](./skills/skill-template.md) 中定义的统一蓝图。该蓝图吸收了 Meta_Kim 方法论层（v0.6.0）和 v0.7 Builder OS 追加结构：

| Section | 覆盖范围 | 目的 |
| --- | --- | --- |
| **Intent Packet** | 14/16（reference 类豁免） | 正式捕获用户意图：Want / Constraints / Context / Depth / Output Target |
| **Capability Index** | 16/16 | 明确 CAN / CANNOT / HANDOFF 边界，合并 Agent boundaries |
| **Gates** | 7/16 | 决策检查点，包含 Pause / Risk / Nudge 失败处理 |
| **Output Packet** | pipeline skills | 面向下游 skill 的链式 artifact handoff |
| **Evidence Packet** | Builder workflows | 可验证完成证据：commands、outputs、files、screenshots 或 manual checks |
| **Sensor Gates** | Builder/release workflows | Review/test/build/privacy/fake-UI/fake-test gates，声明完成前应检查 |
| **Goal Suitability** | goal-driven workflows | 判断任务是否适合交给自主 goal execution |
| **Eval Notes** | skill changes | 记录 skill 变更在晋级前应如何测试或 review |
| **Meta-Review** | 16/16 | 交付后的方法论自审查，不重复查需求 |
| **Evolution Writeback** | 16/16 | 轻量记录可复用观察，供下一轮迭代 |

此外还继承 v0.5.0 的通用部分：Iron Law / 反理实化 / 交付前检查 / Metadata。

权威结构和格式以 `skills/skill-template.md` 为准；active shared references 位于 `references/`，旧质量门禁保留在 `_archived/pm-copilot-legacy-v1.0/skills/references/quality-gates-shared.md`。

## 使用方式

安装后，在 Claude Code 中使用 slash command 风格调用：

```text
/builder-router 我有一个模糊想法，不确定该先写 spec 还是先做 prototype
/builder-plan-goal 请判断这个仓库收敛任务应该用 plan 还是 goal
/builder-frame 帮我把医生偏好推荐这个问题整理成 Feature Frame
/builder-spec 基于这个 Feature Frame 写可交付规格和验收标准
/builder-prototype 基于这个 spec 生成可交互原型 brief
/builder-agent-task 把这个 spec 转成 Codex 可执行任务包
/builder-review 评审这个 agent 输出和 evidence packet
```

在 Codex 中，skills 不是 slash commands；请用 `$skill-name` 显式提及，或直接描述任务让 Codex 根据 `description` 隐式选择：

```text
$builder-frame 帮我把医生偏好推荐这个问题整理成可原型化的功能构想
$builder-spec 为预约推荐模块写规格和验收标准
```

## 项目结构

```text
pm-copilot-skills/
+-- kernel/                    # Builder Kernel: routing / packets / gates / protocols
+-- harness/                   # Execution Harness
+-- memory/                    # Memory & Evolution 的 schema 和策略
+-- loops/                     # Loop Recipes: 可停止的周期治理流程
+-- skills/                    # active surface: 8 个 builder core skills
|   +-- builder-router/        # AI Builder OS core drafts
|   +-- builder-agent-task/
|   +-- ...
+-- bundles/                   # Scenario bundles; includes core
+-- references/                # Runtime-neutral 的 Builder OS references 新位置
+-- templates/                 # Reusable asset templates
+-- adapters/                  # Codex / Claude Code / generic-agent projection notes
+-- docs/                      # 架构、交付协议和 source-only 发布证据
+-- scripts/                   # package validation scripts
+-- evals/                     # trigger/routing/contract/quality/evidence/e2e/regression cases
|   +-- artifact/              # Artifact Governance 回归样例
|   +-- onboarding/            # Project Onboarding 回归样例
|   +-- doctor-preference-e2e/ # 真实 ClarityMedic 需求 E2E 验收案例
+-- agents/                    # package-level runtime metadata
+-- skill-pack.json            # AI Builder OS machine-readable package manifest
+-- _archived/                 # 已归档 legacy 内容
|   +-- pm-copilot-legacy-v1.0/
|   +-- skills-removed-v0.5.0/
+-- research/                  # 本地升级分析，不随 npm package 发布
+-- references/source-blueprints/ # 本地研究归档，git ignored，不随 npm package 发布
+-- install.js                 # npm installer script
+-- sync-and-publish.sh        # 从本 canonical source 发布；不反向同步 agent
+-- package.json
+-- README.md
```

## 兼容性

- **Claude Code CLI**：通过 `npx pm-copilot-skills` 或全局 `ai-builder-os` 命令别名安装。
- **Codex**：通过 `npx pm-copilot-skills codex` 或 `npx -p pm-copilot-skills ai-builder-os codex` 安装到用户级 skills。
- **Generic agent runtimes**：消费 `skill-pack.json`、`agents/openai.yaml`、`adapters/` 和 `bundles/core/manifest.json`。
- **SKILL.md format**：标准 YAML frontmatter，兼容 [skills.sh](https://skills.sh)、[awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) 和 [agentskills.io](https://agentskills.io) 生态。
- **Cross-platform**：macOS、Linux、Windows（bash）。

## 许可证

- **AI Builder OS active skills**（8 个）：[Apache-2.0](LICENSE)
- **Legacy PM Skills**：已归档到 `_archived/pm-copilot-legacy-v1.0/skills/`
- **pdf & pptx utilities**：Proprietary, (c) Anthropic, PBC，详见 `_archived/pm-copilot-legacy-v1.0/skills/pdf/LICENSE.txt` 和 `_archived/pm-copilot-legacy-v1.0/skills/pptx/LICENSE.txt`

## 链接

- [GitHub](https://github.com/aimatrixling-bot/pm-copilot-skills)
- [npm](https://www.npmjs.com/package/pm-copilot-skills)
- [PM Copilot Agent](https://github.com/aimatrixling-bot/pm-copilot-agent)：历史下游 Tauri desktop app；AI Builder OS 1.0 收敛期只作为兼容消费方看待
