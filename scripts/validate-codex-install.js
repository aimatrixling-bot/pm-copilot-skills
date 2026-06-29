#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { TextDecoder } = require('util');
const { validateMarkdownReferenceClosure } = require('./lib/markdown-reference-closure');
const { validateRuntimeBehaviorFixtures } = require('./lib/runtime-behavior-fixtures');
const { validateInvocationMetadata } = require('./lib/runtime-invocation-metadata');

const root = path.resolve(__dirname, '..');
const home = process.env.HOME || process.env.USERPROFILE || process.env.HOMEPATH;
const targetDir = path.join(home, '.agents', 'skills');
const markerName = '.pm-copilot-skills-source.json';
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const skillPack = JSON.parse(fs.readFileSync(path.join(root, 'skill-pack.json'), 'utf8'));
const coreManifest = JSON.parse(fs.readFileSync(path.join(root, 'bundles', 'core', 'manifest.json'), 'utf8'));
const codexAdapter = JSON.parse(fs.readFileSync(path.join(root, 'adapters', 'codex', 'adapter.json'), 'utf8'));
const allowedMarkerPackages = new Set(['ai-builder-os', 'pm-copilot-skills', packageJson.name]);

const sourceEntries = fs.readdirSync(path.join(root, 'skills')).filter((entry) => {
  return fs.statSync(path.join(root, 'skills', entry)).isDirectory();
});
const expectedEntries = sourceEntries.filter((entry) => entry.startsWith('builder-'));

const pmSkills = sourceEntries.filter((entry) => entry.startsWith('pm-'));
const builderSkills = sourceEntries.filter((entry) => entry.startsWith('builder-'));
const legacyInstalledNames = new Set(['download-anything', 'pdf', 'pptx', 'references']);
const failures = [];
const warnings = [];
const allowedRuntimeDocs = [
  'docs/delivery-kernel.md',
  'docs/source-of-truth-map.md',
];
const utf8Decoder = new TextDecoder('utf-8', { fatal: true });
const mojibakeTokens = ['�', '锛', '銆', '鐢', '浠', '璧', '杈', '妯', '璐', '浜', '鎶', '鏄', '闇'];
const builderSharedResources = [
  'kernel/README.md',
  'kernel/gates/design-consistency-gate.zh.md',
  'kernel/gates/product-logic-containment-gate.zh.md',
  'harness/README.md',
  'harness/artifact-write-policy.zh.md',
  'memory/README.md',
  'memory/policies/artifact-lifecycle-policy.zh.md',
  'memory/policies/artifact-cleanup-policy.zh.md',
  'memory/policies/artifact-consistency-policy.zh.md',
  'loops/README.md',
  'loops/recipes/artifact-hygiene.loop.md',
  'loops/recipes/design-plan-to-prototype.loop.md',
  'loops/recipes/definition-sync.loop.md',
  'docs/delivery-kernel.md',
  'docs/source-of-truth-map.md',
  'references/README.md',
  'references/prototype-to-spec.zh.md',
  'references/skill-design/README.md',
  'references/skill-design/skill-design-playbook.zh.md',
  'references/ui-ux/design-principles.zh.md',
  'references/ui-ux/component-guidelines.zh.md',
  'references/ui-ux/interaction-patterns.zh.md',
  'references/ui-ux/visual-style.zh.md',
  'templates/README.md',
  'templates/agent-task-packet/template.md',
  'templates/decision-record/template.md',
  'templates/prototype-brief/template.md',
  'templates/review-report/template.md',
  'templates/skill-hardening-brief/template.md',
  'templates/design-brief/template.md',
  'templates/module-execution-pack/template.md',
  'templates/change-contract/template.md',
  'templates/branch-state/template.md',
  'templates/definition-drift-check/template.md',
];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function hashFile(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function assertCleanUtf8(filePath, label) {
  if (!fs.existsSync(filePath)) return;
  const buffer = fs.readFileSync(filePath);
  try {
    utf8Decoder.decode(buffer);
  } catch (error) {
    failures.push(`${label} 不是合法 UTF-8: ${error.message}`);
    return;
  }

  const text = fs.readFileSync(filePath, 'utf8');
  const suspiciousTokens = mojibakeTokens.filter((token) => text.includes(token));
  assert(
    suspiciousTokens.length === 0,
    `${label} 包含疑似乱码 token: ${suspiciousTokens.join(', ')}`,
  );
}

function markerPackageIsAllowed(packageName) {
  return allowedMarkerPackages.has(packageName);
}

function allowedMarkerPackageLabel() {
  return Array.from(allowedMarkerPackages).sort().join(' / ');
}

function listFiles(dirPath, baseDir = dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dirPath)) {
    const fullPath = path.join(dirPath, entry);
    if (fs.statSync(fullPath).isDirectory()) {
      files.push(...listFiles(fullPath, baseDir));
    } else {
      files.push(path.relative(baseDir, fullPath).split(path.sep).join('/'));
    }
  }
  return files.sort();
}

function sameSet(actual, expected) {
  return actual.length === expected.length && expected.every((item) => actual.includes(item));
}

assert(fs.existsSync(targetDir), `Codex 用户级 skills 目录不存在: ${targetDir}`);
assert(pmSkills.length === 0, `源目录 active surface 不应包含 PM skills，实际为 ${pmSkills.length}`);
assert(builderSkills.length === 8, `源目录中 builder skills 数量应为 8，实际为 ${builderSkills.length}`);
assert(expectedEntries.length === 8, `Codex active install surface 应为 8 个 builder skills，实际为 ${expectedEntries.length}`);

for (const entry of expectedEntries) {
  const dest = path.join(targetDir, entry);
  const source = path.join(root, 'skills', entry);
  const sourceHasSkill = fs.existsSync(path.join(source, 'SKILL.md'));
  const markerFile = path.join(dest, markerName);

  assert(fs.existsSync(dest), `Codex 目标目录缺少: ${entry}`);
  if (!fs.existsSync(dest)) continue;

  if (sourceHasSkill) {
    const sourceSkillFile = path.join(source, 'SKILL.md');
    const installedSkillFile = path.join(dest, 'SKILL.md');
    assert(fs.existsSync(installedSkillFile), `${entry} 缺少 SKILL.md`);
    assertCleanUtf8(sourceSkillFile, `${entry} source SKILL.md`);
    assertCleanUtf8(installedSkillFile, `${entry} installed SKILL.md`);
    if (fs.existsSync(installedSkillFile)) {
      assert(
        hashFile(sourceSkillFile) === hashFile(installedSkillFile),
        `${entry} 安装副本 SKILL.md 与源码不一致；请重新运行 npx pm-copilot-skills codex 或 node install.js codex`,
      );
    }
  }

  if (fs.existsSync(markerFile)) {
    try {
      const marker = JSON.parse(fs.readFileSync(markerFile, 'utf8'));
      assert(
        markerPackageIsAllowed(marker.package),
        `${entry} 的安装标记 package 不匹配: ${marker.package || '<missing>'}；允许 ${allowedMarkerPackageLabel()}`,
      );
      assert(marker.skill === entry, `${entry} 的安装标记 skill 不匹配`);
    } catch (error) {
      failures.push(`${entry} 的安装标记不是合法 JSON: ${error.message}`);
    }
  } else {
    failures.push(`${entry} 缺少 ${markerName} 安装标记`);
  }
}

const installedBuilderSkills = fs.readdirSync(targetDir).filter((entry) => {
  return entry.startsWith('builder-') && fs.statSync(path.join(targetDir, entry)).isDirectory();
});
assert(installedBuilderSkills.length >= 8, `Codex 用户级目录中的 builder skills 少于 8，实际为 ${installedBuilderSkills.length}`);

function isPackageOwned(dest) {
  const markerFile = path.join(dest, markerName);
  if (!fs.existsSync(markerFile)) return false;
  try {
    const marker = JSON.parse(fs.readFileSync(markerFile, 'utf8'));
    return markerPackageIsAllowed(marker.package);
  } catch {
    return false;
  }
}

const packageOwnedLegacyEntries = fs.readdirSync(targetDir).filter((entry) => {
  const dest = path.join(targetDir, entry);
  if (!fs.statSync(dest).isDirectory()) return false;
  if (!entry.startsWith('pm-') && !legacyInstalledNames.has(entry)) return false;
  return isPackageOwned(dest);
});
assert(
  packageOwnedLegacyEntries.length === 0,
  `Codex 用户级目录仍存在本包安装过的 legacy active surface: ${packageOwnedLegacyEntries.join(', ')}`,
);

for (const skillName of installedBuilderSkills) {
  const dest = path.join(targetDir, skillName);
  if (!isPackageOwned(dest)) continue;
  assert(
    builderSkills.includes(skillName),
    `Codex 用户级目录存在非 active builder skill 且由本包安装: ${skillName}`,
  );
}

for (const skillName of builderSkills) {
  const skillDir = path.join(targetDir, skillName);
  if (!fs.existsSync(skillDir)) continue;

  for (const relativePath of builderSharedResources) {
    assert(
      fs.existsSync(path.join(skillDir, relativePath)),
      `${skillName} 缺少共享资源 ${relativePath}`,
    );
  }

  const docs = listFiles(path.join(skillDir, 'docs')).map((file) => `docs/${file}`).sort();
  assert(
    sameSet(docs, allowedRuntimeDocs),
    `${skillName} docs runtime surface 必须只包含 ${allowedRuntimeDocs.join(', ')}，实际: ${docs.join(', ')}`,
  );

  failures.push(...validateMarkdownReferenceClosure({
    rootDir: skillDir,
    label: `codex install/${skillName} markdown reference closure`,
  }));

  validateInvocationMetadata({
    failures,
    skillDir,
    skillName,
    targetName: 'codex',
    adapter: codexAdapter,
    skillPack,
    coreManifest,
    label: 'codex install',
  });
}

validateRuntimeBehaviorFixtures({
  root,
  failures,
  label: 'codex installed runtime behavior fixture',
  routerSkillFiles: [
    {
      label: 'codex install/builder-router',
      path: path.join(targetDir, 'builder-router', 'SKILL.md'),
    },
  ],
});

if (failures.length > 0) {
  console.error('Codex 安装验证失败:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Codex 安装验证通过。');
console.log(`目标目录: ${targetDir}`);
console.log(`已验证 ${expectedEntries.length} 个 AI Builder OS active builder skills。`);
console.log(`允许的安装标记 package: ${allowedMarkerPackageLabel()}。`);
console.log('提示: legacy pm-copilot skills、pdf、pptx、download-anything 和 skills/references 不再默认安装。');
for (const warning of warnings) {
  console.log(`提示: ${warning}`);
}
