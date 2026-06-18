#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const exportScript = path.join(root, 'scripts', 'export-ai-builder-os.js');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-builder-os-runtime-'));
const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function exists(relativePath) {
  return fs.existsSync(path.join(tempRoot, relativePath));
}

function listDirs(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath)
    .filter((entry) => fs.statSync(path.join(dirPath, entry)).isDirectory())
    .sort();
}

function sameSet(actual, expected) {
  return actual.length === expected.length && expected.every((item) => actual.includes(item));
}

const skillPack = readJson(path.join(root, 'skill-pack.json'));
const expectedSkills = skillPack.active_surface.skills;
const targets = ['codex', 'claude-code', 'generic-agent'];

function validateMetadata(targetName, targetDir, expectedLayout) {
  const metadataDir = path.join(targetDir, '.ai-builder-os');
  assert(fs.existsSync(path.join(metadataDir, 'skill-pack.json')), `${targetName} export 缺少 skill-pack metadata`);
  assert(fs.existsSync(path.join(metadataDir, 'agents', 'openai.yaml')), `${targetName} export 缺少 agents/openai.yaml metadata`);
  assert(fs.existsSync(path.join(metadataDir, 'bundles', 'core', 'manifest.json')), `${targetName} export 缺少 core bundle metadata`);
  assert(fs.existsSync(path.join(metadataDir, 'adapter', 'adapter.json')), `${targetName} export 缺少 adapter manifest`);
  assert(fs.existsSync(path.join(metadataDir, 'export-manifest.json')), `${targetName} export 缺少 export-manifest.json`);

  if (fs.existsSync(path.join(metadataDir, 'export-manifest.json'))) {
    const manifest = readJson(path.join(metadataDir, 'export-manifest.json'));
    assert(manifest.target === targetName, `${targetName} export manifest target 不匹配`);
    assert(manifest.export_layout === expectedLayout, `${targetName} export manifest layout 不匹配`);
    assert(sameSet(manifest.active_skills, expectedSkills), `${targetName} export manifest active skills 不匹配`);
  }
}

function validateNoLegacy(targetName, targetDir) {
  const forbidden = [
    '_archived',
    'research',
    'pm-prd',
    'pm-feature-frame',
    'pm-prototype',
    'pdf',
    'pptx',
    'download-anything',
  ];

  for (const entry of forbidden) {
    assert(!fs.existsSync(path.join(targetDir, entry)), `${targetName} export 不应包含 legacy path: ${entry}`);
    assert(!fs.existsSync(path.join(targetDir, 'skills', entry)), `${targetName} export 不应包含 legacy skill: ${entry}`);
  }

  assert(
    !fs.existsSync(path.join(targetDir, 'references', 'source-blueprints')),
    `${targetName} export 不应包含本地研究归档 references/source-blueprints`,
  );
}

function validateFlatTarget(targetName, targetDir) {
  const skillDirs = listDirs(targetDir).filter((entry) => entry.startsWith('builder-'));
  assert(sameSet(skillDirs, expectedSkills), `${targetName} flat export 的 skill dirs 不匹配: ${skillDirs.join(', ')}`);

  for (const skillName of expectedSkills) {
    const skillDir = path.join(targetDir, skillName);
    assert(fs.existsSync(path.join(skillDir, 'SKILL.md')), `${targetName}/${skillName} 缺少 SKILL.md`);
    assert(fs.existsSync(path.join(skillDir, 'kernel', 'README.md')), `${targetName}/${skillName} 缺少 embedded kernel`);
    assert(fs.existsSync(path.join(skillDir, 'harness', 'artifact-write-policy.zh.md')), `${targetName}/${skillName} 缺少 embedded artifact write policy`);
    assert(fs.existsSync(path.join(skillDir, 'memory', 'policies', 'artifact-lifecycle-policy.zh.md')), `${targetName}/${skillName} 缺少 embedded artifact lifecycle policy`);
    assert(fs.existsSync(path.join(skillDir, 'loops', 'recipes', 'artifact-hygiene.loop.md')), `${targetName}/${skillName} 缺少 embedded artifact hygiene loop`);
    assert(fs.existsSync(path.join(skillDir, 'references', 'README.md')), `${targetName}/${skillName} 缺少 embedded references`);
    assert(fs.existsSync(path.join(skillDir, 'templates', 'README.md')), `${targetName}/${skillName} 缺少 embedded templates`);
    assert(fs.existsSync(path.join(skillDir, 'adapters', targetName, 'README.md')), `${targetName}/${skillName} 缺少 target adapter docs`);
    assert(fs.existsSync(path.join(skillDir, '.ai-builder-os', 'runtime.json')), `${targetName}/${skillName} 缺少 runtime metadata`);
  }
}

function validateGenericTarget(targetDir) {
  const skillRoot = path.join(targetDir, 'skills');
  const skillDirs = listDirs(skillRoot).filter((entry) => entry.startsWith('builder-'));
  assert(sameSet(skillDirs, expectedSkills), `generic-agent package export 的 skill dirs 不匹配: ${skillDirs.join(', ')}`);

  for (const skillName of expectedSkills) {
    assert(fs.existsSync(path.join(skillRoot, skillName, 'SKILL.md')), `generic-agent/${skillName} 缺少 SKILL.md`);
  }

  for (const resourcePath of [
    'kernel/README.md',
    'harness/README.md',
    'memory/README.md',
    'loops/README.md',
    'loops/recipes/artifact-hygiene.loop.md',
    'references/README.md',
    'templates/README.md',
    'adapters/generic-agent/README.md',
    'evals/builder-os-trigger-evals.json',
    'README.md',
  ]) {
    assert(fs.existsSync(path.join(targetDir, resourcePath)), `generic-agent export 缺少 ${resourcePath}`);
  }
}

try {
  for (const targetName of targets) {
    const adapter = readJson(path.join(root, 'adapters', targetName, 'adapter.json'));
    assert(adapter.name === targetName, `${targetName} adapter name 不匹配`);
    assert(adapter.expected_active_skill_count === expectedSkills.length, `${targetName} adapter active skill count 不匹配`);
    assert(['flat-skill-root', 'package-root'].includes(adapter.export_layout), `${targetName} adapter layout 不合法`);

    const targetDir = path.join(tempRoot, targetName);
    execFileSync(
      process.execPath,
      [exportScript, '--target', targetName, '--out', targetDir, '--clean', '--json'],
      { cwd: root, stdio: 'pipe' },
    );

    assert(fs.existsSync(path.join(targetDir, '.ai-builder-os-export-target')), `${targetName} export 缺少清理安全 marker`);
    validateMetadata(targetName, targetDir, adapter.export_layout);
    validateNoLegacy(targetName, targetDir);

    if (adapter.export_layout === 'flat-skill-root') {
      validateFlatTarget(targetName, targetDir);
    } else {
      validateGenericTarget(targetDir);
    }
  }
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

if (failures.length > 0) {
  console.error('Runtime adapter/export 验证失败:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Runtime adapter/export 验证通过。');
console.log(`已验证 ${targets.length} 个 runtime target 和 ${expectedSkills.length} 个 active builder skills 的 projection。`);
