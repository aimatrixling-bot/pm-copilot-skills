# AI Builder OS Agent Contract

## Repository Purpose

本仓库是 AI Builder OS 的 source repo，用于维护 8 个 builder core skills、共享 kernel / loop / template / eval / runtime adapter，以及发布前验证脚本。

## Agent Role

Agent 应先读取真实仓库文件，再提出或执行修改。默认中文优先，代码标识符、schema key、命令、runtime 名称可保留英文。

## Source-of-Truth Discipline

- 长期规则以 `docs/source-of-truth-map.md` 指定的唯一事实源为准。
- `Release Seal（`docs/release-seal-*.md`）只记录某个版本的证据和结论，不能作为长期规则来源。
- Branch State 只记录当前分支运行状态，不能替代 spec、template、loop、schema、eval 或 docs。
- PMS 等具体业务领域规则只能留在对应业务仓库，不进入通用 AI Builder OS。

## Core Rules

- 保持 active core skills 为 8 个：`builder-router`、`builder-plan-goal`、`builder-frame`、`builder-spec`、`builder-prototype`、`builder-agent-task`、`builder-review`、`builder-decision`。
- 优先修改既有 template、loop、schema、eval、validator 或 skill 的入口规则；避免新增 skill、template 或 loop。
- 修改 Delivery Kernel 时，必须同步检查 router、spec、agent-task、review、definition sync、schema、eval 和 validator 是否一致。
- 文档只放本层职责需要的规则，不复制其他 source-of-truth 的长解释。

## Do Not

- 不新增第 9 个 core skill。
- 不新增 PMS 专用 skill。
- 不做大规模目录重构。
- 不实现 CLI、scanner、migrator 或自动写入用户项目状态。
- 不把 Review Packet、聊天记录或 release seal 当作长期事实源。
- 不自动发布 npm、不创建 tag、不删除历史 release seal。

## Done Means

Delivery Kernel 相关修改完成必须满足：

- source-of-truth 归属清楚，未制造重复长期规则。
- Branch State、Definition Sync、router delivery decision、模板 profile 和 review gate 的行为一致。
- schema、eval、validator 覆盖新增纪律。
- `npm run validate:builder-os` 和相关最小验证通过，或明确说明无法运行的原因与手动替代检查。
