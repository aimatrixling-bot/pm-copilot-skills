# AI Builder OS Milestone 3.4 Release Seal

判定：`PASS_WITH_REVIEW`

## 目标

Milestone 3.4 聚焦 trigger description eval/optimization：优化 8 个 active builder skills 的 frontmatter `description`，让 Codex 在只看到 metadata 时更容易选择正确 skill，并减少相邻 skill 的误触发。

本阶段不改 runtime export layout，不重命名 npm package，不新增 builder skill，不重写 skill body。

## 优化范围

修改范围：

- `skills/builder-router/SKILL.md`
- `skills/builder-plan-goal/SKILL.md`
- `skills/builder-frame/SKILL.md`
- `skills/builder-spec/SKILL.md`
- `skills/builder-prototype/SKILL.md`
- `skills/builder-agent-task/SKILL.md`
- `skills/builder-review/SKILL.md`
- `skills/builder-decision/SKILL.md`

每个 description 必须包含：

- skill 的核心产物或动作。
- 具体 trigger 场景，使用 `适用于` 明示。
- 不触发边界，使用 `不要用于` 明示。
- 与相邻 confusing skills 的 handoff 方向。

## eval cases

新增：

```text
evals/trigger/builder-description.cases.json
```

该 eval 覆盖：

- 每个 builder skill 至少一个 expected skill case。
- 常见 confusing skills 边界，例如：
  - router vs direct artifact skill
  - plan-goal vs agent-task
  - frame vs spec
  - prototype vs review
  - review vs decision

## validator

新增：

```bash
npm run validate:trigger-descriptions
```

它会验证：

- 8 个 builder skills 的 frontmatter `description` 存在且长度受控。
- 每个 description 同时包含 `适用于` 和 `不要用于`。
- description 不使用 `->` 或尖括号，降低 frontmatter 兼容风险。
- description 不引用 legacy `pm-*` active surface。
- 每个 trigger-description case 的 expected skill description 包含必要触发术语。
- confusing skills 的 description 包含对应排除边界。

`validate:builder-os` 会调用 `validate:trigger-descriptions`，让 M3.4 进入主 release gate。

## legacy cleanup

`evals/builder-os-trigger-evals.json` 中的旧 `pm-*` expected checks 已迁移为 pure `builder-*` surface，不再把 `pm-prototype`、`pm-code-review`、`pm-launch` 等 legacy skill 作为 active trigger 目标。

## 回滚方式

如 M3.4 造成触发描述过窄或误导：

1. 回滚 8 个 builder skill 的 frontmatter `description`。
2. 移除 `evals/trigger/builder-description.cases.json`。
3. 从 `package.json`、`skill-pack.json`、`agents/openai.yaml`、`sync-and-publish.sh`、`validate-builder-os.js` 中移除 `validate:trigger-descriptions`。
4. 重新运行 M3.3 验证基线。

## M3.5 输入

M3.5 可以进入 AI Builder OS 1.0 release candidate：

- 汇总 M3.1 到 M3.4 的 archive、package surface、runtime export、trigger description gates。
- 运行完整 release baseline。
- 做 commit split 建议和 1.0 前剩余风险清单。
- 不再把旧 `pm-*` 作为 active package surface。

## 剩余风险

- 这是静态 trigger description eval，不等价于真实 Codex selector telemetry。
- 当前 validator 验证 description 是否承载边界，不验证模型一定按预期选择。
- 后续如有真实误触发样例，应追加到 `builder-description.cases.json`，再优化 description。
