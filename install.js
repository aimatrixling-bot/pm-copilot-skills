#!/usr/bin/env node

/**
 * AI Builder OS Installer
 *
 * Copies AI Builder OS active builder skills to a local agent runtime.
 * Usage:
 *   npx pm-copilot-skills [target] [--overwrite]
 *   npx -p pm-copilot-skills ai-builder-os [target] [--overwrite]
 *   target: "global" | "claude" (default) -> ~/.claude/skills/
 *          "project" | "claude-project"  -> ./.claude/skills/
 *          "codex" | "codex-user"        -> ~/.agents/skills/
 *          "codex-project"               -> ./.codex/skills/
 *          "codex-home"                  -> ~/.codex/skills/ (legacy/system-adjacent)
 */

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const overwrite = args.includes("--overwrite");
const targetArg = args.find((arg) => !arg.startsWith("--")) || "global";

function normalizeMode(value) {
  switch (value) {
    case "global":
    case "claude":
    case "claude-global":
      return "claude-global";
    case "project":
    case "claude-project":
      return "claude-project";
    case "codex":
    case "codex-user":
      return "codex-user";
    case "codex-project":
      return "codex-project";
    case "codex-home":
      return "codex-home";
    default:
      console.error(`未知 target: ${value}`);
      console.error("可用 target: global, project, codex, codex-project, codex-home");
      process.exit(1);
  }
}

const mode = normalizeMode(targetArg);

const pkgDir = path.resolve(__dirname, "skills");

// Determine target directory
const home =
  process.env.HOME ||
  process.env.USERPROFILE ||
  process.env.HOMEPATH;

let targetDir;
if (mode === "claude-project") {
  targetDir = path.resolve(process.cwd(), ".claude", "skills");
} else if (mode === "codex-user") {
  targetDir = path.join(home, ".agents", "skills");
} else if (mode === "codex-home") {
  const codexHome = process.env.CODEX_HOME || path.join(home, ".codex");
  targetDir = path.join(codexHome, "skills");
} else if (mode === "codex-project") {
  targetDir = path.resolve(process.cwd(), ".codex", "skills");
} else {
  targetDir = path.join(home, ".claude", "skills");
}

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"), "utf-8"));
const markerName = ".pm-copilot-skills-source.json";
const allowedMarkerPackages = new Set(["ai-builder-os", "pm-copilot-skills", pkg.name]);
const builderSharedResourceNames = ["adapters", "kernel", "harness", "memory", "loops", "references", "templates"];
const legacyUtilityNames = new Set(["download-anything", "pdf", "pptx", "references"]);
const excludedLocalResourcePrefixes = ["references/source-blueprints"];

console.log(`\n  AI Builder OS Installer v${pkg.version}`);
console.log(`  兼容 npm package id: ${pkg.name}`);
console.log("  命令别名: pm-copilot-skills, ai-builder-os");
console.log(`  模式: ${mode}`);
console.log(`  目标目录: ${targetDir}`);
console.log(`  覆盖外部已有 skill: ${overwrite ? "是" : "否"}\n`);

// Ensure target directory exists
fs.mkdirSync(targetDir, { recursive: true });

// Copy function
function copyRecursive(src, dest) {
  const relativeSource = path.relative(__dirname, src).split(path.sep).join("/");
  if (excludedLocalResourcePrefixes.some((prefix) => relativeSource === prefix || relativeSource.startsWith(`${prefix}/`))) {
    return;
  }

  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

function writeMarker(dest, skillName) {
  const marker = {
    package: pkg.name,
    version: pkg.version,
    skill: skillName,
    installedAt: new Date().toISOString(),
    mode,
  };
  fs.writeFileSync(
    path.join(dest, markerName),
    `${JSON.stringify(marker, null, 2)}\n`,
    "utf-8",
  );
}

function markerPackageIsAllowed(packageName) {
  return allowedMarkerPackages.has(packageName);
}

function isPackageOwned(dest) {
  if (!fs.existsSync(dest)) return false;
  const markerFile = path.join(dest, markerName);
  if (!fs.existsSync(markerFile)) return false;
  try {
    const marker = JSON.parse(fs.readFileSync(markerFile, "utf-8"));
    return markerPackageIsAllowed(marker.package);
  } catch {
    return false;
  }
}

function isLegacyInstalledEntry(entryName) {
  return entryName.startsWith("pm-") || legacyUtilityNames.has(entryName);
}

function cleanupPackageOwnedLegacyEntries() {
  let removed = 0;
  const removedNames = [];

  for (const entry of fs.readdirSync(targetDir)) {
    const dest = path.join(targetDir, entry);
    if (!fs.statSync(dest).isDirectory()) continue;
    if (!isLegacyInstalledEntry(entry)) continue;
    if (!isPackageOwned(dest)) continue;

    fs.rmSync(dest, { recursive: true, force: true });
    removed++;
    removedNames.push(entry);
  }

  return { removed, removedNames };
}

function copyBuilderSharedResources(dest) {
  for (const resourceName of builderSharedResourceNames) {
    const src = path.join(__dirname, resourceName);
    if (fs.existsSync(src)) {
      copyRecursive(src, path.join(dest, resourceName));
    }
  }
}

const legacyCleanup = cleanupPackageOwnedLegacyEntries();

// Install active AI Builder OS skills only.
const entries = fs.readdirSync(pkgDir).filter((e) => {
  return fs.statSync(path.join(pkgDir, e)).isDirectory();
}).filter((e) => e.startsWith("builder-"));

let installed = 0;
let updated = 0;
let skipped = 0;
const skippedNames = [];

for (const entry of entries) {
  const src = path.join(pkgDir, entry);
  const dest = path.join(targetDir, entry);

  if (fs.existsSync(dest)) {
    if (!overwrite && !isPackageOwned(dest)) {
      skipped++;
      skippedNames.push(entry);
      continue;
    }
    fs.rmSync(dest, { recursive: true, force: true });
    copyRecursive(src, dest);
    if (entry.startsWith("builder-")) copyBuilderSharedResources(dest);
    writeMarker(dest, entry);
    updated++;
  } else {
    copyRecursive(src, dest);
    if (entry.startsWith("builder-")) copyBuilderSharedResources(dest);
    writeMarker(dest, entry);
    installed++;
  }
}

console.log(
  `  ✓ ${entries.length} 个目录已处理（${installed} 个新增，${updated} 个更新，${skipped} 个跳过）\n`
);

if (legacyCleanup.removed > 0) {
  console.log("  已移除本包旧版本安装过的 legacy active surface:");
  for (const name of legacyCleanup.removedNames.sort()) {
    console.log(`    - ${name}`);
  }
  console.log("");
}

if (skippedNames.length > 0) {
  console.log("  已跳过外部已有 skill（使用 --overwrite 可显式覆盖）:");
  for (const name of skippedNames.sort()) {
    console.log(`    - ${name}`);
  }
  console.log("");
}

// List installed skills
const skillNames = entries
  .sort();
console.log("  AI Builder OS active skills:");
for (const name of skillNames) {
  // Try to read display name from SKILL.md
  const skillFile = path.join(pkgDir, name, "SKILL.md");
  let displayName = name;
  if (fs.existsSync(skillFile)) {
    const content = fs.readFileSync(skillFile, "utf-8");
    const match = content.match(/^displayName:\s*(.+)$/m);
    if (match) displayName = match[1];
  }
  const invocationPrefix = mode.startsWith("codex") ? "$" : "/";
  console.log(`    ${invocationPrefix}${name.padEnd(22)} ${displayName}`);
}

console.log("\n  Legacy pm-copilot skills 已归档，不再默认安装为 active skills。");

if (mode.startsWith("codex")) {
  console.log("\n  已安装到 Codex。请重启 Codex 或开启新线程以加载新 skills，例如：$builder-router 或 $builder-spec\n");
} else {
  console.log("\n  已安装到 Claude Code。可使用任一 skill，例如：/builder-router 或 /builder-spec\n");
}
