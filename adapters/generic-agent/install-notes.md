# Generic Agent Install Notes

Generic agent runtimes do not have a single standard install directory.

Use the package-root export when a runtime can consume prompt modules and attached context:

```bash
npm run export:runtime -- --target generic-agent --out ".\dist\ai-builder-os\generic-agent" --clean
```

Read `<target>/.ai-builder-os/export-manifest.json` first, then load the required `skills/<skill-name>/SKILL.md` and shared resources.
