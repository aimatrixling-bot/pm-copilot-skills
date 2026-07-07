---
name: review-code
description: "Information Hierarchy 当 code changes 需要 review 或 Builder self-check 时触发，测试、安全、严重度或修复归属不清晰时失败。"
disable-model-invocation: false
can-invoke: [evolve-memory]
paths: ["**/*.{ts,tsx,js,jsx,py,go,rs,java}"]
status: draft
owner_agent: reviewer
shared_with: [builder]
scope: project
grade: P0
---

# review-code

<!-- P0 实现范围：见蓝图 §2.21 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Invocation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.0-review-code -->
- 当 PR、commit、branch diff 或 Builder self-check 在 acceptance、handoff 或 commit closeout 前需要 code review 时调用。
- 用于行为变更代码（behavior-changing code）、tests、refactors、security-sensitive work、generated scaffold review 和 post-fix verification。
- 按正确性（correctness）、安全性（security）、风格（style）、性能（performance）和可维护性（maintainability）审查代码；在 PASS 前包含 test evidence。
- 返回 PASS、PASS_WITH_CAVEAT 或 BLOCKED，并附带有序且可执行的 fixes；不要就地重写代码，也不要从 Reviewer 调用 build/craft work。
- 只有当 finding 在当前 diff 之外仍具有持久性时，才通过 `evolve-memory` 持久化可复用反馈（reusable feedback）。

## Steps
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-review-code -->
1. 限定 review target。Completion: branch/commit/PR/diff range、changed files、intended behavior、source spec 和 reviewer role boundary 都是显式的。
2. 在判断前加载相关上下文。Completion: touched code、nearby tests、public API/schema/auth paths 和 project rules 已检查，或已带理由排除。
3. 审查五个维度。Completion: correctness、security、style、performance 和 maintainability 均有 PASS、caveat 或带 evidence 的 finding。
4. 验证 tests 和 commands。Completion: 已记录相关 test/typecheck/lint/build outputs，或将缺失 verification 标记为 caveat 或 blocker 并说明理由。
5. 按 severity 分类 findings。Completion: 每个 finding 都标记为 `blocker`、`major`、`minor` 或 `nit`，并将 nits 与 merge-blocking issues 分离。
6. 产出可执行 review output。Completion: final state 是 PASS、PASS_WITH_CAVEAT 或 BLOCKED，并带有有序 fix list、owner、evidence pointer 和 suggested verification command。
7. 只有在理由充分时路由持久学习（durable learning）。Completion: `evolve-memory` 仅为 reusable review patterns 调用，而不是为 transient diff comments 调用。

## Reference
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- `docs/vnext-blueprint.md §2.20` 定义 Reviewer responsibilities、Evidence Packet output 和 no-build/no-merge boundary。
- `docs/vnext-blueprint.md §2.21` 将 `review-code` 定义为 Reviewer 和 Builder self-check 使用的 P0 code review Skill。
- `docs/vnext-blueprint.md §2.23` 定义用于 findings、severity、risk 和 next actions 的 Evidence Packet 字段。
- `docs/vnext-blueprint.md §2.26` 在 GT-05 和 GT-07 中使用 `review-code` 作为 code quality 和 self-check gate。
- `vnext/references/skill-authoring.md §4.1` 要求 sharp completion criteria；§8 覆盖 premature completion 和 context pointer misses。
- `C:\Users\max.ling\.claude\rules\common\coding-style.md` 定义 exact-change 和 readability expectations。
- `C:\Users\max.ling\.claude\rules\common\security.md` 定义对 secrets、injection、XSS、authorization 和 sensitive error leakage 的 mandatory checks。
- `C:\Users\max.ling\.claude\rules\common\testing.md` 定义 critical paths 和 bug fixes 的 pragmatic verification expectations。
- `C:\Users\max.ling\.claude\rules\common\performance.md` 在 diff 触碰 hot paths、data volume、rendering 或 IO 时查阅。

## Completion Criteria
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-review-code -->
- Frontmatter 保持 9 个必填 Skill 字段加 `grade`，并保持 `status: draft`、`grade: P0`、`owner_agent: reviewer`，且 `shared_with` 不包含 owner。
- `description` 以 `Information Hierarchy` 开头，遵循 `X when Y, fails when Z`，并保持一句话且少于 200 字符。
- 五个 SECTION heading 全部按顺序保留，并保留指向现有 Blueprint sections 的 `SECTION_REF` 锚点。
- 每个 step 都有 `Completion:` criterion，review 覆盖 bounded scope、context load、five dimensions、verification evidence、severity split、executable fix list 和 durable-feedback routing。
- Final decision 是 PASS、PASS_WITH_CAVEAT 或 BLOCKED；blockers 和 nits 已分离，且 Reviewer 不直接编辑代码。

## Failure Modes
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- Signal: Premature PASS - review 在没有 fresh test/typecheck/lint/build evidence 或显式 not-run caveat 的情况下批准。
- Signal: Security Blindness - 在相关时未检查 injection、XSS、secret exposure、authz/authn、path traversal 或 sensitive error leakage。
- Signal: Style Nitpicking - 尽管没有 correctness、security、performance 或 maintainability risk，formatting 或 preference comments 仍阻塞 acceptance。
- Signal: Context Loss - review 在未加载 surrounding code、tests、spec、schema 或 public API impact 的情况下检查孤立 hunk。
- Signal: Role Drift - Reviewer 重写代码、stage fixes、调用 craft/build work，或隐藏 ownership，而不是返回 executable fixes。
