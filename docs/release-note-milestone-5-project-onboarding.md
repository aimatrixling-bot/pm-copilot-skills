# Milestone 5 Release Note: Project Onboarding Protocol

## Summary

Milestone 5 为 AI Builder OS 增加了轻量 Project Onboarding Protocol，用于处理用户安装或引入 AI Builder OS 后的首次项目进入问题。

它解决两类真实场景：

- Greenfield：用户从 0 开始一个新项目或新产品。
- Brownfield：用户已有本地文档、代码、原型、脚本、日志或历史决策，中途接入 AI Builder OS。

本次迭代没有新增第 9 个 core skill，也没有实现自动扫描器、初始化器、迁移器或清理器。Project Onboarding 是 Memory / Harness / Artifact Governance / builder-router 的横切协议。

## Why It Matters

在 Milestone 4 之前，AI Builder OS 已经具备 Artifact Governance，可以管理项目运行中持续产生的资产。但仍有一个入口缺口：

> AI Builder OS 第一次进入项目时，如何知道应该从 0 建立秩序，还是先保护并理解已有资产？

如果没有这个入口协议，用户可能遇到两个问题：

- 新项目一开始就生成大量文档，却没有项目锚点、阶段和资产边界。
- 旧项目中途接入时，agent 可能误把旧 PRD、过程稿或参考文件当作当前 source of truth。

Milestone 5 的用户价值是：让 AI Builder OS 在进入项目的第一步就更稳，不急着写文件，不急着整理目录，先判断项目模式、建立上下文边界，再把工作交给合适的 builder skill。

## What Changed

### 5A: Project Onboarding 文档协议最小版

新增 project profile schema 和三份 policy：

- `memory/schemas/project-profile.schema.md`
- `harness/project-onboarding-policy.zh.md`
- `harness/project-greenfield-bootstrap-policy.zh.md`
- `harness/project-brownfield-intake-policy.zh.md`

定义了 4 种 `project_mode`：

- `greenfield`：从 0 开始的新项目。
- `brownfield`：已有资产的项目中途接入。
- `resume`：已有 `.ai-builder/`、project profile 或 artifact index，可继续。
- `unknown`：证据不足，先提问或输出最小检查清单。

### 5B: builder-router 轻接入

`builder-router` 现在在首次进入或恢复项目时，需要输出：

```yaml
project_mode:
project_profile_proposal:
recommended_next_skill:
```

典型路由：

- `greenfield` 通常推荐 `builder-frame`。
- `brownfield` 通常推荐 `builder-review`。
- `resume` 先读取既有 profile / artifact index / handoff 后再路由。
- `unknown` 先询问项目根、授权范围或关键上下文。

### 5C: Onboarding Eval Validator

新增：

- `scripts/validate-onboarding-evals.js`
- `evals/onboarding/project-onboarding.cases.json`

新增命令：

```bash
npm run validate:onboarding-evals
```

这个 validator 会检查 onboarding cases 的结构、重复 id、5 种 project mode 覆盖、`project_profile_proposal` 必需字段，以及禁止自动扫描、写入、迁移、删除的 fail-closed 条款。

`validate:builder-os` 已接入该 validator。

### 5D: Project Onboarding Examples

新增端到端样例：

- `examples/project-onboarding/README.md`
- `examples/project-onboarding/greenfield-router-output.example.md`
- `examples/project-onboarding/brownfield-router-output.example.md`

样例展示：

```text
用户自然语言请求
  -> builder-router
  -> project_mode
  -> project_profile_proposal
  -> recommended_next_skill
```

## Expected User Value

### For Greenfield Projects

用户从 0 开始时，AI Builder OS 会先建立项目锚点，而不是马上生成大而全文档。

实际效果：

- 更早明确用户、问题、目标和 non-goals。
- 更自然地进入 `builder-frame`。
- 初始资产默认是 proposal 或 draft，不会伪装成 current truth。
- `.ai-builder/` 只会被建议，不会被自动创建。

### For Brownfield Projects

用户已有本地资产时，AI Builder OS 会先做 intake 思维，而不是直接整理文件。

实际效果：

- 先识别 source-of-truth candidates，而不是直接宣布哪个文件是真相。
- 把旧 PRD、README、docs、src、tests、logs 等资产分层看待。
- 所有清理、迁移、重命名都必须 proposal-only。
- 高风险文件默认进入 `do_not_touch` 或 `needs_human_decision`。

### For Ongoing Agent Work

后续 agent handoff 会更稳定。

实际效果：

- `builder-router` 能把首次进入项目的信息传给 `builder-frame`、`builder-review` 或 `builder-agent-task`。
- Artifact Governance 有了更清楚的上游入口。
- `validate:builder-os` 能防止 onboarding cases 漂移。

## What This Does Not Do

Milestone 5 明确不做：

- 不新增第 9 个 core skill。
- 不自动创建 `.ai-builder/`。
- 不自动写入 `artifact-index.yaml`。
- 不自动扫描全仓库。
- 不自动迁移、删除、重命名或归档用户文件。
- 不实现 CLI、初始化器、扫描器、迁移器或清理器。
- 不把 source-of-truth candidate 当作已确认 source of truth。

## Product Behavior After Milestone 5

当用户说：

```text
我想从 0 开始一个项目
```

AI Builder OS 应倾向于：

```yaml
project_mode: greenfield
recommended_next_skill: builder-frame
project_profile_proposal:
  status: proposal_only
```

当用户说：

```text
这个本地项目已经有 README、docs、src 和旧 PRD，我想接入 AI Builder OS
```

AI Builder OS 应倾向于：

```yaml
project_mode: brownfield
recommended_next_skill: builder-review
project_profile_proposal:
  status: proposal_only
```

## Verification

Milestone 5 相关验证基线：

```bash
npm run validate:onboarding-evals
npm run validate:builder-os
git diff --check
```

当前验证结果：

- `validate:onboarding-evals` 通过，覆盖 5 个 project modes。
- `validate:builder-os` 通过，仍保持 8 个 active builder skills。
- `git diff --check` 通过，仅有 Windows 换行提示。

## Remaining Risks

- Onboarding eval 目前是静态 JSON 结构检查，不是模型真实路由评测。
- `project_profile_proposal` 还没有真实写入流程，仍需人工或未来明确命令确认。
- Brownfield intake 的扫描范围仍依赖用户授权和 agent 自律，尚无自动预算控制器。
- `recommended_next_skill` 与 `recommended_skill` 有语义重叠，后续可以在 Router output contract 中继续打磨。

## Next Suggested Milestone

建议下一步是 Milestone 6：做一次发布前治理 review。

重点检查：

- Artifact Governance 与 Project Onboarding 是否有字段重复或命名不一致。
- examples 是否应该全部进入 npm package。
- release gate 是否过重。
- README 是否需要一段面向用户的“首次进入项目”说明。
- 是否需要为 `project_profile_proposal` 增加模板，而不是继续停留在 schema 文档中。
