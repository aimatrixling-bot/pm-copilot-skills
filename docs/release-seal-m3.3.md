# AI Builder OS Milestone 3.3 Release Seal

判定：`PASS_WITH_REVIEW`

## 目标

Milestone 3.3 完成 runtime adapter/export hardening：让 AI Builder OS 的 active builder core 不只存在于源码和 npm package surface 中，也能被确定性投影到 Codex、Claude Code 和 generic-agent 三类 runtime 目标。

本阶段不做 trigger description optimization，不重命名 npm package，不发布，不 commit/push。

## runtime targets

当前支持 3 个 export target：

| Target | Adapter manifest | Export layout | 目标形态 |
| --- | --- | --- | --- |
| `codex` | `adapters/codex/adapter.json` | `flat-skill-root` | `<target>/<skill-name>/SKILL.md` |
| `claude-code` | `adapters/claude-code/adapter.json` | `flat-skill-root` | `<target>/<skill-name>/SKILL.md` |
| `generic-agent` | `adapters/generic-agent/adapter.json` | `package-root` | `<target>/skills/<skill-name>/SKILL.md` + top-level shared resources |

## export tooling

新增脚本：

```bash
node scripts/export-ai-builder-os.js --target codex --out <dir> --clean
node scripts/export-ai-builder-os.js --target claude-code --out <dir> --clean
node scripts/export-ai-builder-os.js --target generic-agent --out <dir> --clean
```

`--clean` 有安全限制：只有空目录、临时目录、repo `dist/` 下目录，或已有 `.ai-builder-os-export-target` marker 的目录允许清理。这样避免把用户任意目录误删。

## projection contract

Flat skill root targets（Codex / Claude Code）：

- 导出 8 个 `builder-*` 目录到 target root。
- 每个 skill 内嵌 `kernel/`、`references/`、`templates/`、`adapters/`。
- 每个 skill 写入 `.ai-builder-os/runtime.json`。
- target root 写入 `.ai-builder-os/skill-pack.json`、`agents/openai.yaml`、`bundles/`、adapter metadata 和 `export-manifest.json`。

Generic agent target：

- 导出 8 个 `builder-*` 到 `<target>/skills/`。
- 顶层包含 `kernel/`、`harness/`、`memory/`、`references/`、`templates/`、`adapters/`、`evals/`。
- 写入 `.ai-builder-os/export-manifest.json` 和 runtime metadata。

所有 export target 都不得包含：

- `_archived/`
- `research/`
- `skills/pm-*`
- `skills/pdf`
- `skills/pptx`
- `skills/download-anything`
- `skills/references`

## validator

新增：

```bash
npm run validate:runtime-adapters
```

该 validator 会在系统临时目录中分别导出 `codex`、`claude-code`、`generic-agent`，然后验证：

- adapter manifest 存在且 target/layout 正确。
- 8 个 active builder skills 全部导出。
- Codex / Claude Code flat exports 的每个 skill 都有 embedded shared resources。
- generic-agent export 有 top-level shared resources。
- `.ai-builder-os/export-manifest.json` 与 target/layout/active skills 一致。
- 不存在 legacy active surface。

`validate:builder-os` 会调用 `validate:runtime-adapters`，让 M3.3 进入主 release gate。

## package surface impact

`skill-pack.json` 新增 `export` section，声明：

- export script
- runtime validator
- 3 个 target
- adapter manifest path
- export layout

`agents/openai.yaml` 新增 runtime export metadata。

`sync-and-publish.sh` 应运行 `validate:runtime-adapters`，并在 `npm pack --dry-run --json` gate 中要求 export script、runtime validator、adapter manifests 和 `docs/release-seal-m3.3.md`。

## 回滚方式

如 M3.3 export tooling 造成问题：

1. 从 `package.json` 移除 `export:runtime` 和 `validate:runtime-adapters`。
2. 从 `skill-pack.json` 移除 `export` section，并从 release gates 移除 `npm run validate:runtime-adapters`。
3. 从 `agents/openai.yaml` 移除 `runtime_export`。
4. 删除 `scripts/export-ai-builder-os.js`、`scripts/validate-runtime-adapters.js` 和 `adapters/*/adapter.json`。
5. 从 `validate:builder-os` 和 `sync-and-publish.sh` 移除 M3.3 gate。
6. 重新运行 M3.2 验证基线。

## M3.4 输入

M3.4 可以专注 trigger description eval/optimization：

- 不需要再处理 runtime projection 基础设施。
- 可以直接基于当前 active skill surface、adapter metadata 和 eval cases 优化 skill descriptions。
- 应新增 trigger/routing eval，而不是修改 export layout。

## 剩余风险

- 当前 export 是离线文件投影，不代表 Codex 或 Claude Code 官方 runtime 已执行端到端加载测试。
- Flat skill root 会复制共享资源到每个 builder skill，保证自包含，但会增加导出体积。
- Generic agent export 是通用 package，不规定具体 agent 的加载 API。
