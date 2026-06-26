# Generic Agent 安装说明（Generic Agent Install Notes）

通用 agent runtime 没有统一的标准安装目录。

当 runtime 可以消费 prompt modules 和附加上下文时，使用 package-root 导出：

```bash
npm run export:runtime -- --target generic-agent --out ".\dist\ai-builder-os\generic-agent" --clean
```

先读取 `<target>/.ai-builder-os/export-manifest.json`，再加载所需的 `skills/<skill-name>/SKILL.md` 和共享资源。
