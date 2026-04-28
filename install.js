#!/usr/bin/env node

/**
 * PM Copilot Skills Installer
 *
 * Copies 29 PM Skills to Claude Code's skills directory.
 * Usage: npx pm-copilot-skills [target]
 *   target: "global" (default) → ~/.claude/skills/
 *          "project"            → ./.claude/skills/
 */

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const mode = args[0] === "project" ? "project" : "global";

const pkgDir = path.resolve(__dirname, "skills");

// Determine target directory
let targetDir;
if (mode === "project") {
  targetDir = path.resolve(process.cwd(), ".claude", "skills");
} else {
  const home =
    process.env.HOME ||
    process.env.USERPROFILE ||
    process.env.HOMEPATH;
  targetDir = path.join(home, ".claude", "skills");
}

console.log(`\n  PM Copilot Skills Installer v0.2.3`);
console.log(`  Mode: ${mode}`);
console.log(`  Target: ${targetDir}\n`);

// Ensure target directory exists
fs.mkdirSync(targetDir, { recursive: true });

// Copy function
function copyRecursive(src, dest) {
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

// Install each skill
const entries = fs.readdirSync(pkgDir).filter((e) => {
  return fs.statSync(path.join(pkgDir, e)).isDirectory();
});

let installed = 0;
let updated = 0;

for (const entry of entries) {
  const src = path.join(pkgDir, entry);
  const dest = path.join(targetDir, entry);

  if (fs.existsSync(dest)) {
    updated++;
  } else {
    installed++;
  }

  copyRecursive(src, dest);
}

console.log(
  `  ✓ ${entries.length} Skills processed (${installed} new, ${updated} updated)\n`
);

// List installed skills
const skillNames = entries
  .filter((e) => e.startsWith("pm-"))
  .sort();
console.log("  Installed skills:");
for (const name of skillNames) {
  // Try to read display name from SKILL.md
  const skillFile = path.join(pkgDir, name, "SKILL.md");
  let displayName = name;
  if (fs.existsSync(skillFile)) {
    const content = fs.readFileSync(skillFile, "utf-8");
    const match = content.match(/^displayName:\s*(.+)$/m);
    if (match) displayName = match[1];
  }
  console.log(`    /${name.padEnd(22)} ${displayName}`);
}

console.log(`\n  Shared references: ${entries.includes("references") ? "✓" : "✗"}`);
console.log(`\n  Ready! Use any skill in Claude Code, e.g.: /pm-prd\n`);
