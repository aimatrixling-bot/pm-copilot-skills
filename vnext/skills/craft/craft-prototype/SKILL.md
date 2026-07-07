---
name: craft-prototype
description: "Progressive Disclosure 当 spec 或 PRD 必须变成可运行最小 scaffold 时触发，starter 复用、运行证据或范围边界缺失时失败。"
disable-model-invocation: false
can-invoke: [manage-file]
paths: ["30_Projects/**/_sandbox/**", "**/prototype/**"]
status: draft
owner_agent: builder
shared_with: [researcher]
scope: project
grade: P0
---

# craft-prototype

<!-- P0 实现范围：见蓝图 §2.21 + §2.25.1 -->
<!-- 终态扩展点：见蓝图 §2.26.3 -->

## Invocation
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.0-craft-prototype -->
- 当已接受的 spec、PRD、Engineering Request 或有边界的用户请求必须变成可运行的最小项目 scaffold 时调用。
- 用于第一版可执行形态：starter 选择、项目骨架（project skeleton）、stub implementation、仅 mock 的数据接缝（mock-only data seams）和运行证据（run evidence）。
- 不要用于文本 spec 写作、production hardening、高保真 UI polish、commit 创建或 code review；这些应路由到 `craft-spec`、后续 build work、`build-commit` 或 `review-code`。
- 在创建自定义结构前，优先使用现有项目模式（patterns）或成熟 starters，并保持每个新增项都可追溯到 source spec。
- Deletion Test：没有 `craft-prototype` 时，Builder 会失去从已接受 spec 到 executable evidence 的 P0 桥接。

## Steps
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-craft-prototype -->
1. 从 spec 中限定 prototype slice。Completion: source spec path 或制品（artifact）、target user flow、first screen 或 entrypoint、non-goals 和 acceptance evidence 已在代码变更前写明。
2. 在 scaffolding 前选择复用路径（reuse path）。Completion: 已命名 existing repo pattern、mature starter 或 no-starter decision，并给出一个理由；当存在可用 starter 时，拒绝重复 scaffold work。
3. 有意放置 scaffold。Completion: 目标目录位于 `paths` 内；当 placement、naming 或 versioning 需要决策时调用 `manage-file`，且未触碰无关项目路径。
4. 构建最小可运行 skeleton。Completion: entrypoint、route 或 command surface、stub components/services、synthetic mock data 和可见的 not-yet-implemented seams 匹配已限定的 slice。
5. 验证 scaffold 可运行。Completion: 已记录精确 install/start/test command、observed output 或 URL，以及任何 failing caveat；"looks plausible" 不被接受为 run evidence。
6. 打包 handoff。Completion: changed files、run command、starter choice、spec coverage、known gaps 和 next skill（`build-commit` 或 `review-code`）已列出供下游使用。

## Reference
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- `docs/vnext-blueprint.md §2.20` 将 prototype 和 application delivery 分配给 Builder。
- `docs/vnext-blueprint.md §2.21` 将 `craft-prototype` 定义为从 spec 到 runnable prototype output 的 P0 桥接。
- `docs/vnext-blueprint.md §2.26` 覆盖 GT-03 和 GT-07，其中 prototype output 必须包含 run evidence 并保持绑定到 spec。
- `vnext/references/skill-authoring.md §4.1` 要求 sharp completion criteria；§8 命名 Premature Completion、Variance、Context Pointer Miss 和 Bloat diagnostics。
- Runtime adapter 必须注入 patterns / testing 通用工程纪律；本 skill 只依赖这些 contract，不绑定本机绝对路径。

## Completion Criteria
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.21-craft-prototype -->
- Frontmatter 保持 9 个必填 Skill 字段加 `grade`，并保持 `status: draft`、`grade: P0`、`owner_agent: builder`，且 `shared_with` 不包含 owner。
- `description` 以 `Progressive Disclosure` 开头，遵循 `X when Y, fails when Z`，并保持一句话且少于 200 字符。
- 五个 SECTION heading 全部按顺序保留，并保留指向现有 Blueprint sections 的 `SECTION_REF` 锚点。
- 每个 step 都有 `Completion:` criterion，prototype 包含 bounded spec source、reuse decision、scoped path、runnable skeleton、run evidence 和 handoff notes。
- Deletion Test 保持 Lose：没有其他 P0 Skill 负责把已接受 spec 转换为 executable scaffold evidence。

## Failure Modes
<!-- SECTION_REF: docs/vnext-blueprint.md#§2.24 -->
- Signal: Spec Drift - scaffold screens、routes 或 stubs 无法追溯到已接受 spec 或已声明 non-goals。
- Signal: Scaffold Rebuild - 在 existing repo pattern 或 mature starter 可满足 slice 时，仍创建自定义项目结构。
- Signal: Premature Optimization - 在最小可运行 slice 需要之前，就添加 state management、auth、persistence、deployment 或 polish。
- Signal: Verification Gap - Builder 在没有精确 run command、observed output、URL 或 failure caveat 的情况下报告完成。
- Signal: Scope Creep - prototype 包含 spec 未请求的 user flows、features、data models 或 visual fidelity。
