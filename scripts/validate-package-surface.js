#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const builderSkills = [
  'builder-router',
  'builder-plan-goal',
  'builder-frame',
  'builder-spec',
  'builder-prototype',
  'builder-agent-task',
  'builder-review',
  'builder-decision',
];

const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function listDirs(relativePath) {
  return fs.readdirSync(path.join(root, relativePath))
    .filter((entry) => fs.statSync(path.join(root, relativePath, entry)).isDirectory())
    .sort();
}

function sameSet(actual, expected) {
  return actual.length === expected.length && expected.every((item) => actual.includes(item));
}

const packageJson = readJson('package.json');
const skillPack = readJson('skill-pack.json');
const coreManifest = readJson('bundles/core/manifest.json');
const openaiYaml = read('agents/openai.yaml');
const readme = read('README.md');
const installScript = read('install.js');
const syncScript = read('sync-and-publish.sh');

const activeSkillDirs = listDirs('skills');
assert(sameSet(activeSkillDirs, builderSkills), `skills/ active surface 必须只包含 8 个 builder skills，实际: ${activeSkillDirs.join(', ')}`);

assert(packageJson.name === 'pm-copilot-skills', 'npm package name 必须保持 pm-copilot-skills 作为兼容 id');
assert(packageJson.description.includes('AI Builder OS'), 'package description 必须以 AI Builder OS 为产品身份');
assert(packageJson.bin['pm-copilot-skills'] === 'install.js', 'package bin 必须保留 pm-copilot-skills 兼容命令');
assert(packageJson.bin['ai-builder-os'] === 'install.js', 'package bin 必须提供 ai-builder-os 命令别名');
assert(packageJson.scripts['export:runtime'] === 'node scripts/export-ai-builder-os.js', 'package scripts 必须包含 export:runtime');
assert(packageJson.scripts['validate:package-surface'] === 'node scripts/validate-package-surface.js', 'package scripts 必须包含 validate:package-surface');
assert(packageJson.scripts['validate:runtime-adapters'] === 'node scripts/validate-runtime-adapters.js', 'package scripts 必须包含 validate:runtime-adapters');
assert(packageJson.scripts['validate:trigger-descriptions'] === 'node scripts/validate-trigger-descriptions.js', 'package scripts 必须包含 validate:trigger-descriptions');
assert(packageJson.scripts['validate:dual-package-dry-run'] === 'node scripts/validate-dual-package-dry-run.js', 'package scripts 必须包含 validate:dual-package-dry-run');
assert(packageJson.scripts['prepare:dual-package-publish'] === 'node scripts/prepare-dual-package-publish.js', 'package scripts 必须包含 prepare:dual-package-publish');

for (const requiredFileEntry of ['skill-pack.json', 'agents/', 'skills/', 'kernel/', 'references/', 'templates/', 'adapters/', 'docs/']) {
  assert(packageJson.files.includes(requiredFileEntry), `package files 必须包含 ${requiredFileEntry}`);
}
for (const forbiddenFileEntry of ['_archived/', 'research/']) {
  assert(!packageJson.files.includes(forbiddenFileEntry), `package files 不应包含 ${forbiddenFileEntry}`);
}

assert(skillPack.name === 'ai-builder-os', 'skill-pack name 必须是 ai-builder-os');
assert(skillPack.display_name === 'AI Builder OS', 'skill-pack display_name 必须是 AI Builder OS');
assert(skillPack.version === packageJson.version, 'skill-pack version 必须与 package.json version 一致');
assert(skillPack.status === 'm3.9-publish-prep-dry-run', 'skill-pack status 必须声明 m3.9-publish-prep-dry-run');
assert(skillPack.package.npm_name === packageJson.name, 'skill-pack package.npm_name 必须与 package.json name 一致');
assert(sameSet(skillPack.package.bins, Object.keys(packageJson.bin).sort()), 'skill-pack package.bins 必须与 package.json bin 一致');
assert(skillPack.active_surface.type === 'pure-builder-core', 'skill-pack active_surface.type 必须是 pure-builder-core');
assert(sameSet(skillPack.active_surface.skills, builderSkills), 'skill-pack active_surface.skills 必须等于 8 个 builder skills');
assert(sameSet(coreManifest.skills, builderSkills), 'core bundle manifest skills 必须等于 8 个 builder skills');

assert(skillPack.export.script === 'scripts/export-ai-builder-os.js', 'skill-pack export.script 必须指向 export-ai-builder-os.js');
assert(skillPack.export.validator === 'scripts/validate-runtime-adapters.js', 'skill-pack export.validator 必须指向 validate-runtime-adapters.js');
assert(Array.isArray(skillPack.export.targets), 'skill-pack export.targets 必须是数组');
if (Array.isArray(skillPack.export.targets)) {
  const targetNames = skillPack.export.targets.map((target) => target.name).sort();
  assert(sameSet(targetNames, ['claude-code', 'codex', 'generic-agent']), 'skill-pack export.targets 必须覆盖 codex、claude-code、generic-agent');
  for (const target of skillPack.export.targets) {
    assert(fs.existsSync(path.join(root, target.adapter_manifest)), `skill-pack export target 缺少 adapter manifest: ${target.adapter_manifest}`);
    assert(['flat-skill-root', 'package-root'].includes(target.layout), `skill-pack export target layout 不合法: ${target.name}`);
  }
}
assert(skillPack.release_gates.includes('npm run validate:trigger-descriptions'), 'skill-pack release_gates 必须包含 validate:trigger-descriptions');
assert(skillPack.release_gates.includes('npm run validate:dual-package-dry-run'), 'skill-pack release_gates 必须包含 validate:dual-package-dry-run');
assert(skillPack.release_gates.includes('npm run prepare:dual-package-publish'), 'skill-pack release_gates 必须包含 prepare:dual-package-publish');

for (const excluded of ['_archived/', 'research/', 'skills/pm-*', 'skills/pdf', 'skills/pptx', 'skills/download-anything', 'skills/references']) {
  assert(skillPack.active_surface.excluded_from_package_surface.includes(excluded), `skill-pack 必须声明排除 ${excluded}`);
}

for (const skillName of builderSkills) {
  assert(openaiYaml.includes(`- ${skillName}`), `agents/openai.yaml 缺少 active skill: ${skillName}`);
}
assert(openaiYaml.includes('name: ai-builder-os'), 'agents/openai.yaml 必须声明 name: ai-builder-os');
assert(openaiYaml.includes(`version: ${packageJson.version}`), 'agents/openai.yaml version 必须与 package.json 一致');
assert(openaiYaml.includes('package_name: pm-copilot-skills'), 'agents/openai.yaml 必须声明兼容 package name');
assert(openaiYaml.includes('package_surface: pure-builder-core'), 'agents/openai.yaml 必须声明 pure builder core surface');
assert(openaiYaml.includes('script: scripts/export-ai-builder-os.js'), 'agents/openai.yaml 必须声明 runtime export script');
assert(openaiYaml.includes('validator: scripts/validate-runtime-adapters.js'), 'agents/openai.yaml 必须声明 runtime adapter validator');
assert(openaiYaml.includes('npm run validate:trigger-descriptions'), 'agents/openai.yaml 必须声明 trigger description gate');
assert(openaiYaml.includes('npm run validate:dual-package-dry-run'), 'agents/openai.yaml 必须声明 dual package dry-run gate');
assert(openaiYaml.includes('npm run prepare:dual-package-publish'), 'agents/openai.yaml 必须声明 dual package publish prep gate');

assert(readme.includes('AI Builder OS package surface'), 'README 必须说明 AI Builder OS package surface');
assert(readme.includes('Runtime adapter/export'), 'README 必须说明 runtime adapter/export');
assert(readme.includes('Trigger description'), 'README 必须说明 Trigger description gate');
assert(readme.includes('Milestone 3.9'), 'README 必须说明当前 publish prep 阶段');
assert(readme.includes('安装未发布的当前分支最新版'), 'README 必须说明未发布前如何安装当前分支最新版');
assert(readme.includes('QoderWork 当前按 `generic-agent` 消费'), 'README 必须说明 QoderWork generic-agent 消费方式');
assert(readme.includes('Dual package dry-run'), 'README 必须说明 dual package dry-run');
assert(readme.includes('M3.9 publish prep'), 'README 必须说明 M3.9 publish prep');
assert(readme.includes('prepare:dual-package-publish'), 'README 必须说明 prepare:dual-package-publish');
assert(readme.includes('ai-builder-os'), 'README 必须说明 ai-builder-os 命令别名或产品 id');
assert(readme.includes('兼容 npm package id'), 'README 必须说明 pm-copilot-skills 是兼容 npm package id');
assert(installScript.includes('ai-builder-os'), 'install.js 必须暴露 ai-builder-os 用法或命令别名说明');
assert(syncScript.includes('validate:package-surface'), 'sync-and-publish.sh 必须运行 validate:package-surface');
assert(syncScript.includes('skill-pack.json'), 'sync-and-publish.sh pack gate 必须检查 skill-pack.json');
assert(syncScript.includes('agents/openai.yaml'), 'sync-and-publish.sh pack gate 必须检查 agents/openai.yaml');
assert(syncScript.includes('scripts/export-ai-builder-os.js'), 'sync-and-publish.sh pack gate 必须检查 export script');
assert(syncScript.includes('validate:runtime-adapters'), 'sync-and-publish.sh 必须运行 validate:runtime-adapters');
assert(syncScript.includes('scripts/validate-trigger-descriptions.js'), 'sync-and-publish.sh pack gate 必须检查 trigger description validator');
assert(syncScript.includes('validate:trigger-descriptions'), 'sync-and-publish.sh 必须运行 validate:trigger-descriptions');
assert(syncScript.includes('scripts/validate-dual-package-dry-run.js'), 'sync-and-publish.sh pack gate 必须检查 dual package dry-run validator');
assert(syncScript.includes('validate:dual-package-dry-run'), 'sync-and-publish.sh 必须运行 validate:dual-package-dry-run');
assert(syncScript.includes('scripts/prepare-dual-package-publish.js'), 'sync-and-publish.sh pack gate 必须检查 dual package publish prep script');
assert(syncScript.includes('docs/release-seal-m3.5.md'), 'sync-and-publish.sh pack gate 必须检查 M3.5 release seal');
assert(syncScript.includes('docs/release-seal-m3.7.md'), 'sync-and-publish.sh pack gate 必须检查 M3.7 release seal');
assert(syncScript.includes('docs/release-seal-m3.8.md'), 'sync-and-publish.sh pack gate 必须检查 M3.8 release seal');
assert(syncScript.includes('docs/release-seal-m3.8.1.md'), 'sync-and-publish.sh pack gate 必须检查 M3.8.1 release seal');
assert(syncScript.includes('docs/release-runbook-m3.9.md'), 'sync-and-publish.sh pack gate 必须检查 M3.9 release runbook');
assert(syncScript.includes('docs/release-seal-m3.9.md'), 'sync-and-publish.sh pack gate 必须检查 M3.9 release seal');
assert(syncScript.includes('docs/release-plan-1.0.md'), 'sync-and-publish.sh pack gate 必须检查 1.0 release plan');
assert(syncScript.includes('forbiddenPrefixes'), 'sync-and-publish.sh pack gate 必须检查 forbidden package prefixes');

if (failures.length > 0) {
  console.error('Package surface 验证失败:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Package surface 验证通过。');
console.log(`已验证 ${builderSkills.length} 个 active builder skills、skill-pack.json、agents/openai.yaml 和 package files 边界。`);
