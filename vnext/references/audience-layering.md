---
title: Audience Layering Iron Law
type: design-decision
status: active
created_at: 2026-07-07
source: ADR 0003 + memory/communication-style.md
related_skills: [manage-prompt, craft-spec, craft-prototype, craft-agent-task, review-doc, review-code, manage-grill]
related_blueprint_sections: [§2.14a, §2.9, §2.13, §2.21]
---

# Audience Layering Iron Law

本 reference 是 ADR 0003 / D13 的执行参考，用于帮助 Skill 作者和 Agent 判断输出受众，并在混合受众场景强制分层：人话层先，技术层后。

## 范围

适用：
- 面向非程序员用户解释技术方案、Codex prompt、跨 Agent 交付、schema / validator / commit 相关说明。
- `output_contract.audience` 为 `human` 或 `dual` 的 Skill。
- 需要同时让用户理解方向、又让 Agent 能继续执行的输出。

不适用：
- 纯技术对谈，用户明确要求看字段、diff、命令或 validator 细节。
- `manage-grill` 单轮质询、简单问答、状态短报等单一受众输出。
- 只写给 Agent 执行器的机器可读 task pack，但必须在 Output Packet 中说明 `audience_reason`。

## 受众判断触发条件表

| audience | 场景示例 | 输出形式 |
|---|---|---|
| human | 用户要理解方案、取舍、风险或下一步，但不需要直接执行命令 | 一层中文说明；避免 schema key、commit hash、长路径和 validator 名称 |
| agent | 任务包、handoff、机器可读验收、纯执行 checklist | 结构化字段、路径、命令、验收条件；可省略人话层 |
| dual | Codex prompt、跨 Agent 交付、给非程序员解释代码/文档变更、涉及 schema 或 validator 的说明 | 人话层先说明要改什么 / 为什么 / 什么效果 / 风险；技术层再给字段、路径、命令、commit 或 validator 细节 |

## 人话层避用清单

人话层避免直接暴露以下内容，除非用户主动要求：
- `schema_key`
- `commit_hash`
- `field_name`
- `validator_name`
- `long_file_path`

这些内容应放入技术层，或压缩为"校验规则"、"提交记录"、"字段"、"文件路径"等用户可理解表达。

## dual 场景最小人话层

dual 输出的人话层至少回答 4 个问题：

1. 要改什么：本次改变的对象或行为。
2. 为什么：用户问题、风险或系统目标。
3. 什么效果：用户会看到什么变化，Agent 会获得什么约束。
4. 风险：仍需人类判断、验证或后续决策的点。

技术层随后提供可执行细节：文件、字段、命令、校验、提交、回滚路径。

## 示例

来源：`memory/communication-style.md` 记录的 Codex prompt 解释实践。

不推荐：

```text
请更新 REFERENCE_FIELDS_BY_TYPE，并在 validateReferencesByType 后接入 schema validator。
```

推荐：

```text
人话层：这次要让 references 文件也有固定格式，避免后续随便加字段导致规则漂移。用户只需要知道：我们会按文档类型分三类校验，旧 status 语义暂时保留。

技术层：在 validate-vnext.js 增加 REFERENCE_FIELDS_BY_TYPE；按 type 路由 design-decision / reviewer-feedback / spec；status 保持 open namespace。
```

## 与 D9 的对称设计

| Iron Law | 判断义务 | 执行弹性 |
|---|---|---|
| D9 Evolver Iron Law | 创建资产前必须证明不能复用 / 合并 / 降级 / 归档 / 澄清 | 不禁止创建，只禁止跳过判断 |
| D13 Audience Layering Iron Law | 输出前必须判断 human / agent / dual；dual 必须分层 | 不强制每次两层，只禁止不判断 |

D13 的核心不是"所有输出都变长"，而是让 AI 在输出前先判断受众。单一受众可以单层，混合受众必须分层。
