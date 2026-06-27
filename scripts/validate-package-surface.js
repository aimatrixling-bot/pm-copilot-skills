#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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
const allowedPackageDocs = [
  'docs/architecture.md',
  'docs/delivery-kernel.md',
  'docs/source-of-truth-map.md',
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

function isForbiddenPackageDoc(filePath) {
  return filePath.startsWith('docs/release-') || (filePath.startsWith('docs/') && filePath.includes('hardening-brief'));
}

function npmPackFiles() {
  const output = execSync('npm pack --dry-run --json', {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return JSON.parse(output)[0].files.map((file) => file.path).sort();
}

const packageJson = readJson('package.json');
const skillPack = readJson('skill-pack.json');
const coreManifest = readJson('bundles/core/manifest.json');
const openaiYaml = read('agents/openai.yaml');
const claudeMd = read('CLAUDE.md');
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
assert(packageJson.scripts['validate:artifact-evals'] === 'node scripts/validate-artifact-evals.js', 'package scripts 必须包含 validate:artifact-evals');
assert(packageJson.scripts['validate:onboarding-evals'] === 'node scripts/validate-onboarding-evals.js', 'package scripts 必须包含 validate:onboarding-evals');
assert(packageJson.scripts['validate:dual-package-dry-run'] === 'node scripts/validate-dual-package-dry-run.js', 'package scripts 必须包含 validate:dual-package-dry-run');
assert(packageJson.scripts['prepare:dual-package-publish'] === 'node scripts/prepare-dual-package-publish.js', 'package scripts 必须包含 prepare:dual-package-publish');

for (const requiredFileEntry of [
  'skill-pack.json',
  'AGENTS.md',
  'CLAUDE.md',
  'agents/',
  'skills/',
  'kernel/',
  'harness/',
  'memory/',
  'loops/',
  'references/README.md',
  'references/prototype-to-spec.zh.md',
  'references/legacy-pm-methods/',
  'references/skill-design/',
  'references/ui-ux/',
  'templates/',
  'adapters/',
  'evals/',
  ...allowedPackageDocs,
]) {
  assert(packageJson.files.includes(requiredFileEntry), `package files 必须包含 ${requiredFileEntry}`);
}
for (const forbiddenFileEntry of ['_archived/', 'research/', 'references/', 'references/source-blueprints/', 'docs/']) {
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
for (const sharedResource of ['kernel/', 'harness/', 'memory/', 'loops/', 'docs/', 'references/', 'templates/', 'adapters/']) {
  assert(skillPack.active_surface.shared_resources.includes(sharedResource), `skill-pack shared_resources 必须包含 ${sharedResource}`);
}
assert(coreManifest.references.includes('loops/'), 'core bundle manifest references 必须包含 loops/');
assert(coreManifest.references.includes('docs/'), 'core bundle manifest references 必须包含 docs/');
assert(installScript.includes('runtimeDocResourcePaths'), 'install.js 必须使用 runtime docs allowlist');
for (const docPath of ['docs/delivery-kernel.md', 'docs/source-of-truth-map.md']) {
  assert(installScript.includes(docPath), `install.js runtime docs allowlist 缺少 ${docPath}`);
}
assert(!/builderSharedResourceNames\s*=\s*\[[^\]]*"docs"/.test(installScript), 'install.js 不得把整个 docs/ 复制到 runtime shared resources');
assert(installScript.includes('parseArgs'), 'install.js 必须使用显式参数解析');
assert(installScript.includes('--help') && installScript.includes('--version'), 'install.js 必须支持无写入 help/version 参数');
assert(installScript.includes('path.resolve(process.cwd(), ".agents", "skills")'), 'install.js codex-project 必须安装到项目 .agents/skills');
assert(!installScript.includes('path.resolve(process.cwd(), ".codex", "skills")'), 'install.js codex-project 不得安装到旧 .codex/skills');

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
assert(skillPack.release_gates.includes('npm run validate:artifact-evals'), 'skill-pack release_gates 必须包含 validate:artifact-evals');
assert(skillPack.release_gates.includes('npm run validate:onboarding-evals'), 'skill-pack release_gates 必须包含 validate:onboarding-evals');
assert(skillPack.release_gates.includes('npm run validate:dual-package-dry-run'), 'skill-pack release_gates 必须包含 validate:dual-package-dry-run');
assert(skillPack.release_gates.includes('npm run prepare:dual-package-publish'), 'skill-pack release_gates 必须包含 prepare:dual-package-publish');

for (const excluded of ['_archived/', 'research/', 'skills/pm-*', 'skills/pdf', 'skills/pptx', 'skills/download-anything', 'skills/references', 'references/source-blueprints/']) {
  assert(skillPack.active_surface.excluded_from_package_surface.includes(excluded), `skill-pack 必须声明排除 ${excluded}`);
}
for (const excludedDoc of ['docs/release-*.md', 'docs/*hardening-brief.md']) {
  assert(skillPack.active_surface.excluded_from_package_surface.includes(excludedDoc), `skill-pack 必须声明排除 ${excludedDoc}`);
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
assert(openaiYaml.includes('npm run validate:artifact-evals'), 'agents/openai.yaml 必须声明 artifact eval gate');
assert(openaiYaml.includes('npm run validate:onboarding-evals'), 'agents/openai.yaml 必须声明 onboarding eval gate');
assert(openaiYaml.includes('npm run validate:dual-package-dry-run'), 'agents/openai.yaml 必须声明 dual package dry-run gate');
assert(openaiYaml.includes('npm run prepare:dual-package-publish'), 'agents/openai.yaml 必须声明 dual package publish prep gate');

assert(readme.includes('AI Builder OS package surface'), 'README 必须说明 AI Builder OS package surface');
assert(readme.includes('CLAUDE.md'), 'README 必须说明 Claude Code 入口 shim');
assert(claudeMd.includes('Claude Code Project Shim'), 'CLAUDE.md 必须声明 Claude Code Project Shim');
assert(claudeMd.includes('@AGENTS.md'), 'CLAUDE.md 必须导入 AGENTS.md');
assert(claudeMd.includes('只补充 Claude Code source checkout 的入口差异'), 'CLAUDE.md 必须保持 Claude Code thin shim 边界');
assert(claudeMd.includes('不是新的长期 source of truth'), 'CLAUDE.md 必须声明不是新的长期 source of truth');
assert(claudeMd.includes('AGENTS.md') && claudeMd.includes('docs/source-of-truth-map.md'), 'CLAUDE.md 必须指向 AGENTS.md 和 source-of-truth map');
assert(readme.includes('Runtime adapter/export'), 'README 必须说明 runtime adapter/export');
assert(readme.includes('Trigger description'), 'README 必须说明 Trigger description gate');
assert(readme.includes('Milestone 3.9'), 'README 必须说明当前 publish prep 阶段');
assert(readme.includes('安装未发布的当前分支最新版'), 'README 必须说明未发布前如何安装当前分支最新版');
assert(readme.includes('QoderWork 当前按 `generic-agent` 消费'), 'README 必须说明 QoderWork generic-agent 消费方式');
assert(readme.includes('Dual package dry-run'), 'README 必须说明 dual package dry-run');
assert(readme.includes('M3.9 publish prep'), 'README 必须说明 M3.9 publish prep');
assert(readme.includes('prepare:dual-package-publish'), 'README 必须说明 prepare:dual-package-publish');
assert(readme.includes('references/source-blueprints/') && readme.includes('不进入 git 或 package surface'), 'README 必须说明 source blueprints 是本地 ignored 研究资料');
assert(readme.includes('ai-builder-os'), 'README 必须说明 ai-builder-os 命令别名或产品 id');
assert(readme.includes('兼容 npm package id'), 'README 必须说明 pm-copilot-skills 是兼容 npm package id');
assert(installScript.includes('ai-builder-os'), 'install.js 必须暴露 ai-builder-os 用法或命令别名说明');
assert(syncScript.includes('validate:package-surface'), 'sync-and-publish.sh 必须运行 validate:package-surface');
assert(syncScript.includes('skill-pack.json'), 'sync-and-publish.sh pack gate 必须检查 skill-pack.json');
assert(syncScript.includes('CLAUDE.md'), 'sync-and-publish.sh pack gate 必须检查 CLAUDE.md');
assert(syncScript.includes('agents/openai.yaml'), 'sync-and-publish.sh pack gate 必须检查 agents/openai.yaml');
assert(syncScript.includes('scripts/export-ai-builder-os.js'), 'sync-and-publish.sh pack gate 必须检查 export script');
assert(syncScript.includes('validate:runtime-adapters'), 'sync-and-publish.sh 必须运行 validate:runtime-adapters');
assert(syncScript.includes('scripts/lib/markdown-reference-closure.js'), 'sync-and-publish.sh pack gate 必须检查 markdown reference closure helper');
assert(syncScript.includes('scripts/validate-trigger-descriptions.js'), 'sync-and-publish.sh pack gate 必须检查 trigger description validator');
assert(syncScript.includes('validate:trigger-descriptions'), 'sync-and-publish.sh 必须运行 validate:trigger-descriptions');
assert(syncScript.includes('scripts/validate-onboarding-evals.js'), 'sync-and-publish.sh pack gate 必须检查 onboarding eval validator');
assert(syncScript.includes('validate:onboarding-evals'), 'sync-and-publish.sh 必须运行 validate:onboarding-evals');
assert(syncScript.includes('scripts/validate-dual-package-dry-run.js'), 'sync-and-publish.sh pack gate 必须检查 dual package dry-run validator');
assert(syncScript.includes('validate:dual-package-dry-run'), 'sync-and-publish.sh 必须运行 validate:dual-package-dry-run');
assert(syncScript.includes('scripts/prepare-dual-package-publish.js'), 'sync-and-publish.sh pack gate 必须检查 dual package publish prep script');
for (const docPath of allowedPackageDocs) {
  assert(syncScript.includes(docPath), `sync-and-publish.sh pack gate 必须检查 package docs allowlist: ${docPath}`);
}
assert(syncScript.includes('docs/release-'), 'sync-and-publish.sh pack gate 必须禁止 release docs');
assert(syncScript.includes('hardening-brief'), 'sync-and-publish.sh pack gate 必须禁止 docs hardening briefs');
assert(syncScript.includes('forbiddenPrefixes'), 'sync-and-publish.sh pack gate 必须检查 forbidden package prefixes');

try {
  const packFiles = npmPackFiles();
  const packDocs = packFiles.filter((file) => file.startsWith('docs/')).sort();
  assert(
    sameSet(packDocs, allowedPackageDocs),
    `npm pack docs surface 必须只包含 ${allowedPackageDocs.join(', ')}，实际: ${packDocs.join(', ')}`,
  );
  const forbiddenPackDocs = packFiles.filter(isForbiddenPackageDoc);
  assert(
    forbiddenPackDocs.length === 0,
    `npm pack 不得包含 release/hardening docs: ${forbiddenPackDocs.join(', ')}`,
  );
  assert(
    packFiles.includes('scripts/lib/markdown-reference-closure.js'),
    'npm pack 必须包含 markdown reference closure helper',
  );
} catch (error) {
  failures.push(`npm pack --dry-run --json 执行失败: ${error.message}`);
}

if (failures.length > 0) {
  console.error('Package surface 验证失败:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Package surface 验证通过。');
console.log(`已验证 ${builderSkills.length} 个 active builder skills、skill-pack.json、agents/openai.yaml 和 package files 边界。`);
