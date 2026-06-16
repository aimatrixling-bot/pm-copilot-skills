# PM Copilot Skills

[![npm version](https://img.shields.io/npm/v/pm-copilot-skills.svg)](https://www.npmjs.com/package/pm-copilot-skills)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![Skills](https://img.shields.io/badge/skills-16_PM_%2B_3_utilities-green.svg)](skills/)

面向产品经理、AI 产品经理和全栈产品构建者的 **AI Product Builder OS**：16 个产品/构建类 skills + 3 个工具类 skills，按从探索到发布的产品交付流水线组织。

> `pm-copilot-skills` 是 canonical source（权威源）。`pm-copilot-agent` 等下游 Agent 或应用，应在本包版本被接受后再从这里消费、镜像或投影。
>
> 默认输出语言：用户可见报告、检查结果、原型文案、交接材料以**中文为主**；代码、字段名、命令、API、包名、行业通用缩写和固定术语可保留英文。
>
> v0.7.0 方向：综合 Meta_Kim、毒舌产品经理 5.0、andrej-karpathy-skills、VibeCodingPromptTemplate、Superpowers、Everything Claude Code，以及 OpenAI / Anthropic skill/plugin 最佳实践，形成克制、可靠、可扩展的 Builder OS。详见 [`skills/references/builder-os/blueprint.md`](skills/references/builder-os/blueprint.md)。
>
> v0.6.0 已把 Meta_Kim 方法论层（Intent Packet / Capability Index / Gates / Meta-Review / Output Packet / Evolution Writeback）集成到全部 16 个 skills。统一结构见 [Skill 结构](#skill-结构)。
>
> v0.5.0 基于内部 AI Native PM 真实工作流研究，把原 36 个 skills 收敛为 16 个 pipeline-aligned skills。

## 为什么需要 PM Copilot Skills？

- **面向 Builder**：覆盖 Product + Design + Build + Review + Release + Evolution，不只写 PRD。
- **按流水线组织**：skill 以工作阶段组织，而不是按文档类型堆叠。
- **知识库支撑**：内置来自 23 本经典产品书的方法论 KB，并按需引用。
- **质量门禁**：每个 skill 都包含 Iron Law、交付前检查和输出质量标准。
- **证据驱动**：Builder 工作流必须给出验证证据，而不是声称“应该能跑”。
- **权威源优先**：本包先迭代，满意后再同步到下游 Agent。
- **中文优先输出**：用户可见内容默认中文；必要的代码/API/产品术语保留英文。
- **低配置使用**：安装一次，即可在 Claude Code 等 skill runtime 中使用。

## Benchmark Synthesis（标杆综合）

PM Copilot Skills 不复制任何单一标杆项目，而是把其中最强的思想归一化为一套紧凑的操作系统：

| 来源 | 在 PM Copilot Skills 中的角色 | 吸收 | 不吸收 |
| --- | --- | --- | --- |
| Meta_Kim | 治理主干 | 意图澄清、能力路由、review/meta-review、验证、经验回写、canonical-to-runtime projection | 完整九角色治理复杂度 |
| 毒舌产品经理 5.0 | 轻量 Harness 参考 | Guides、Sensors、Steering Loop、标准驱动执行、目标驱动执行、hook/gate 思维 | 让单一 harness 支配整个系统 |
| andrej-karpathy-skills | 行为纪律 | 不隐藏假设、显式取舍、最小变更、成功标准、验证循环 | 把同一套全局规则在每个 skill 中重复堆叠 |
| VibeCodingPromptTemplate | 模板资产库 | PRD、MVP、研究、设计、架构、自文档化功能、营销模板作为 reference 或 optional pack | 把每个模板都升级为 core skill |
| Superpowers | 工程交付文化 | design-before-code、approval gates、TDD/review 纪律、subagent 执行模式、skill 变更 eval 证据 | 全量搬运工程 workflow |
| Everything Claude Code | Plugin 系统地图 | agents/skills/commands/hooks/MCP/rules/memory/context architecture | 大规模 agent/skill/command 膨胀 |
| OpenAI / Anthropic docs | 平台边界 | progressive disclosure、skill-first iteration、稳定分发后 plugin packaging、trigger-focused descriptions | 工作流未稳定前过早 plugin 化 |

## 快速安装

```bash
# 安装到 Claude Code 全局 skills 目录
npx pm-copilot-skills

# 安装到当前项目的 Claude Code skills 目录
npx pm-copilot-skills project

# 安装到 Codex 全局 skills 目录
npx pm-copilot-skills codex

# 安装到当前项目的 Codex skills 目录
npx pm-copilot-skills codex-project
```

默认不会覆盖目标目录中已有、且不是由 `pm-copilot-skills` 安装的 skill。确实需要覆盖时显式追加 `--overwrite`。

## 验证

发布或镜像到下游 Agent 前，先运行结构化 Builder OS 检查和真实 E2E 验收：

```bash
npm run validate:builder-os
npm run validate:codex-install
npm run validate:doctor-preference-e2e
npm run test:doctor-preference-e2e
```

这些检查会验证 canonical source 边界、Codex 本地安装完整性、Builder OS 核心结构、trigger eval 种子覆盖，以及一个真实医生偏好推荐需求的端到端场景。

## Pipeline 架构

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

## Skills by Phase

### Phase 0: Discovery（2 个 skills）

| Skill | 触发方式 | 作用 |
|-------|---------|------|
| `pm-discovery` | `/pm-discovery` | 端到端产品发现：从 idea 到 validated opportunity |
| `pm-deconstruct` | `/pm-deconstruct` | 反向拆解产品：从交互层还原到战略意图 |

### Phase 1: Design & Build（2 个 skills）

| Skill | 触发方式 | 作用 |
|-------|---------|------|
| `pm-feature-frame` | `/pm-feature-frame` | 问题验证 + 功能构想：从问题到原型的桥梁 |
| `pm-prototype` | `/pm-prototype` | 高保真交互原型 + 低保真线框图（`--fidelity=low|high`） |

### Phase 2: Quality & PRD（2 个 skills）

| Skill | 触发方式 | 作用 |
|-------|---------|------|
| `pm-code-review` | `/pm-code-review` | 审查代码的安全、逻辑、性能和证据可信度 |
| `pm-prd` | `/pm-prd` | PRD + acceptance criteria（`--include-acceptance`）+ engineering request（`--eng-request`） |

### Phase 3: Construct（2 个 skills）

| Skill | 触发方式 | 作用 |
|-------|---------|------|
| `pm-code-architect` | `/pm-code-architect` | 基于 PRD / Tech Spec 设计系统架构 |
| `pm-code-implement` | `/pm-code-implement` | 基于架构方案执行代码实现 |

### Phase 4: Ship & Decide（3 个 skills）

| Skill | 触发方式 | 作用 |
|-------|---------|------|
| `pm-comp` | `/pm-comp` | 竞品分析（`--mode=analysis`）+ 产品批判（`--mode=critique`） |
| `pm-launch` | `/pm-launch` | 发布计划、Go/No-Go 和 release checklist |
| `pm-content-general` | `/pm-content-general` | 生成 blog、landing page、release notes、产品文档 |

### Cross-cutting（2 个 skills）

| Skill | 触发方式 | 作用 |
|-------|---------|------|
| `pm-decision` | `/pm-decision` | 结构化决策：记录理由、取舍和后续影响 |
| `pm-prioritize` | `/pm-prioritize` | RICE 打分 + roadmap planning + sprint backlog（`--mode=prioritize|roadmap|backlog`） |

### Specialized: AI Products（2 个 skills）

| Skill | 触发方式 | 作用 |
|-------|---------|------|
| `pm-ai-patterns` | `/pm-ai-patterns` | AI 产品设计模式：交互、信任、个性化、评估 |
| `pm-agent-patterns` | `/pm-agent-patterns` | AI Agent 架构与安全模式：identity、memory、tools、safety |

### Personal（1 个 skill）

| Skill | 触发方式 | 作用 |
|-------|---------|------|
| `pm-job-search` | `/pm-job-search` | PM 求职材料：JD 分析、简历、面试准备 |

### Bundled Utilities（3 个 skills）

| Skill | 作用 | License |
|-------|------|---------|
| `pdf` | PDF 处理：extract、create、merge、split | Proprietary (c) Anthropic, PBC |
| `pptx` | 演示文稿创建和编辑（.pptx） | Proprietary (c) Anthropic, PBC |
| `download-anything` | 查找和下载数字资源 | No license declared |

## 知识库

每个 skill 都可以引用 `skills/references/` 中的共享知识库：

- **Methodology KB**：23 本经典 PM 书籍沉淀出的可执行模式。
- **Quality Gates**：Iron Law、输出质量标准、Builder OS 证据协议和中文优先语言协议。
- **Design KB**：UI patterns 和 component references。
- **Builder OS Blueprint**：多来源综合、反膨胀规则和 runtime adapter 边界，位于 `skills/references/builder-os/`。

## Skill 结构

每个 `SKILL.md` 遵循 [`skills/skill-template.md`](skills/skill-template.md) 中定义的统一蓝图。该蓝图吸收了 Meta_Kim 方法论层（v0.6.0）和 v0.7 Builder OS 追加结构：

| Section | 覆盖范围 | 目的 |
|---------|----------|------|
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

权威结构和格式以 `skills/skill-template.md` 为准；共享协议见 `skills/references/quality-gates-shared.md`。

## 使用方式

安装后，在 Claude Code 等支持 skill 的 runtime 中调用：

```text
/pm-discovery Validate the idea of an AI-powered daily news digest
/pm-feature-frame I want to build a CRM for dental clinics
/pm-prototype --fidelity=low Dashboard layout for patient management
/pm-prd --include-acceptance CRM appointment scheduling module
/pm-comp --mode=critique Review this landing page design
/pm-prioritize --mode=roadmap Q3 2026 product roadmap
```

## 项目结构

```text
pm-copilot-skills/
+-- skills/                    # 16 个 PM skills + 3 个 utilities
|   +-- pm-prd/                # 每个 skill 独立目录
|   |   +-- SKILL.md           # Skill 定义（YAML + instructions）
|   +-- references/            # 共享知识库
|   |   +-- builder-os/        # Builder OS 权威综合和边界
|   |   +-- design-kb/
|   |   +-- pm-theory-kb/
|   |   +-- quality-gates-shared.md
|   +-- ...
+-- scripts/                   # package validation scripts
+-- evals/                     # trigger 和质量 eval seed cases
|   +-- doctor-preference-e2e/ # 真实 ClarityMedic 需求 E2E 验收案例
+-- _archived/                 # 已归档 skills（v0.4.x -> v0.5.0）
|   +-- skills-removed-v0.5.0/
+-- research/                  # 本地升级分析，不随 npm package 发布
+-- install.js                 # npm installer script
+-- sync-and-publish.sh        # 从本 canonical source 发布；不反向同步 agent
+-- package.json
+-- README.md
```

## 兼容性

- **Claude Code CLI**：当前主要目标 runtime。
- **Codex / plugin runtimes**：skill/rules surface 稳定后的 planned adapter targets。
- **SKILL.md format**：标准 YAML frontmatter，兼容 [skills.sh](https://skills.sh)、[awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) 和 [agentskills.io](https://agentskills.io) 生态。
- **Cross-platform**：macOS、Linux、Windows（bash）。

## 许可证

- **PM Skills**（16 个）：[Apache-2.0](LICENSE)
- **pdf & pptx utilities**：Proprietary, (c) Anthropic, PBC，详见 `skills/pdf/LICENSE.txt` 和 `skills/pptx/LICENSE.txt`

## 链接

- [GitHub](https://github.com/aimatrixling-bot/pm-copilot-skills)
- [npm](https://www.npmjs.com/package/pm-copilot-skills)
- [PM Copilot Agent](https://github.com/aimatrixling-bot/pm-copilot-agent)：下游 Tauri desktop app
