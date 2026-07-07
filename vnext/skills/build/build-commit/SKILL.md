---
name: build-commit
description: "Context Pointer 当已验证的工作树变更必须变成范围化 commits 时触发，staging、message、hooks 或 push 授权漂移时失败。"
disable-model-invocation: false
can-invoke: []
paths: ["**"]
status: draft
owner_agent: builder
shared_with: [supervisor]
scope: project
grade: P0
---

# build-commit

<!-- P0 实现范围：见蓝图 §2.21 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Invocation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.0-build-commit -->
- 在代码、文档或 vNext asset 变更已有 review/self-check evidence，并需要一个或多个 local commits 后调用。
- 用于工作树检查（working tree inspection）、commit 拆分规划（commit split planning）、精确 staging、conventional message drafting、尊重 hooks 的 commit 执行，以及 commit 后报告（post-commit reporting）。
- 不要用于 push、rebase、force operations、branch deletion、release tagging 或 broad cleanup，除非用户显式授权该独立动作。
- 将 dirty worktrees 视为正常状态：保留无关用户文件和 untracked assets，除非它们被写入 commit plan。
- Deletion Test：没有 `build-commit` 时，Builder 会失去把已验证变更转换为可审计历史的 P0 closeout step。

## Steps
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-build-commit -->
1. 检查 working tree 和基础上下文。Completion: current branch、`git status --short`、相关 diff/stat 和已知 untracked files 已在 staging 前记录。
2. 按单一目的决定 commit boundaries。Completion: 每个 planned commit 都有一个 concern、file list 和 rationale；混合的 feat/fix/refactor/docs changes 已拆分或显式证明合理。
3. 筛查 staging 泄漏（staging leaks）。Completion: `.env`、secrets、credentials、generated archives、large binaries、unrelated user changes 和 broad wildcard paths 已在 `git add` 前检查。
4. 只 stage 精确路径。Completion: staged paths 来自已批准 file list，且 `git diff --cached --name-only` 在 commit 前匹配该列表。
5. 编写合规 commit message。Completion: subject 遵循本地 type/scope convention，命名已变更的 behavior 或 artifact，并避免通用 "update" 措辞。
6. 不绕过 hooks 地 commit。Completion: commit 成功并生成 hash，或 hook failure 已随 command output 和 next fix path 报告；未使用 `--no-verify`。
7. 报告 local-only outcome。Completion: commit hash、files committed、checks run、remaining untracked files 和 push status 都是显式的；未经授权不执行 remote push。

## Reference
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- `docs/vnext-blueprint.md §2.20` 将 implementation 和 git closeout work 分配给 Builder。
- `docs/vnext-blueprint.md §2.21` 将 `build-commit` 定义为 review 或 self-check 之后的 P0 git closeout Skill。
- `docs/vnext-blueprint.md §2.23` 定义 Output Packet evidence expectations，例如 command output、commit hash 和 next actions。
- `docs/vnext-blueprint.md §2.26` 在 GT-03、GT-05 和 GT-07 中使用 `build-commit` 作为可审计 handoff point。
- Runtime adapter 必须注入 git-workflow / security / coding-style 通用工程纪律；本 skill 只依赖这些 contract，不绑定本机绝对路径。

## Completion Criteria
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-build-commit -->
- Frontmatter 保持 9 个必填 Skill 字段加 `grade`，并保持 `status: draft`、`grade: P0`、`owner_agent: builder`、`can-invoke: []`，且 `shared_with` 不包含 owner。
- `description` 以 `Context Pointer` 开头，遵循 `X when Y, fails when Z`，并保持一句话且少于 200 字符。
- 五个 SECTION heading 全部按顺序保留，并保留指向现有 Blueprint sections 的 `SECTION_REF` 锚点。
- 每个 step 都有 `Completion:` criterion，commit path 证明已做精确 status inspection、single-purpose boundary、leak screening、exact staging、hook-respecting commit 和 local-only report。
- Deletion Test 保持 Lose：没有其他 P0 Skill 负责 verified-change-to-commit transition。

## Failure Modes
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- Signal: Mixed Concern - 一个 commit 组合了无关的 feature、fix、refactor、docs 或 generated-output changes。
- Signal: Message Drift - commit subject 省略 type/scope intent，使用含糊的 "update" 措辞，或误述已变更 behavior。
- Signal: Staging Leak - `.env`、secrets、large binaries、generated archives 或无关用户文件进入 index。
- Signal: Hook Bypass - 使用 `--no-verify`、disabled hooks 或 ignored pre-commit failures 强行推进历史。
- Signal: Unauthorized Push - 在没有显式用户授权时，local commit work 静默扩展为 push、tag、branch deletion 或 remote mutation。
