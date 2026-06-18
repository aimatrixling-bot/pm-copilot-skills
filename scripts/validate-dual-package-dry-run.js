#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-builder-os-dual-package-'));

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

const requiredPackFiles = [
  'README.md',
  'install.js',
  'package.json',
  'skill-pack.json',
  'agents/openai.yaml',
  'scripts/prepare-dual-package-publish.js',
  'scripts/validate-builder-os.js',
  'scripts/validate-package-surface.js',
  'scripts/validate-dual-package-dry-run.js',
  'scripts/export-ai-builder-os.js',
  'scripts/validate-runtime-adapters.js',
  'scripts/validate-trigger-descriptions.js',
  'scripts/validate-artifact-evals.js',
  'scripts/validate-onboarding-evals.js',
  'evals/trigger/builder-description.cases.json',
  'evals/onboarding/project-onboarding.cases.json',
  'evals/artifact/artifact-index-sync.cases.json',
  'evals/artifact/artifact-cleanup-proposal.cases.json',
  'evals/artifact/artifact-consistency-audit.cases.json',
  'harness/artifact-write-policy.zh.md',
  'loops/README.md',
  'loops/recipes/artifact-hygiene.loop.md',
  'docs/release-plan-1.0.md',
  'docs/release-seal-m3.5.md',
  'docs/release-seal-m3.7.md',
  'docs/release-seal-m3.8.md',
  'docs/release-seal-m3.8.1.md',
  'docs/release-note-milestone-5-project-onboarding.md',
  'docs/release-runbook-m3.9.md',
  'docs/release-seal-m3.9.md',
  ...builderSkills.map((skillName) => `skills/${skillName}/SKILL.md`),
];

const forbiddenPrefixes = [
  '_archived/',
  'research/',
  'skills/pm-',
  'skills/pdf',
  'skills/pptx',
  'skills/download-anything',
  'skills/references',
];

const packageTargets = [
  {
    id: 'primary',
    packageName: 'ai-builder-os',
    version: '1.0.0-dry-run.0',
    description: 'AI Builder OS primary package dry run for agent-executable builder workflows',
    compatibilityPolicy: 'primary 1.0 package name; keep pm-copilot-skills as compatibility package during migration',
    installCommands: [
      'npx ai-builder-os codex',
      'npx ai-builder-os',
      'npx -p ai-builder-os ai-builder-os codex',
    ],
  },
  {
    id: 'compatibility',
    packageName: 'pm-copilot-skills',
    version: '1.0.0-compat-dry-run.0',
    description: 'Compatibility package dry run for AI Builder OS users migrating from pm-copilot-skills',
    compatibilityPolicy: 'compatibility package; keep existing install paths while documenting ai-builder-os as the primary package',
    installCommands: [
      'npx pm-copilot-skills codex',
      'npx pm-copilot-skills',
      'npx -p pm-copilot-skills ai-builder-os codex',
    ],
  },
];

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || root,
    encoding: 'utf8',
    shell: options.shell ?? (process.platform === 'win32' && command === 'npm'),
    stdio: options.stdio || ['ignore', 'pipe', 'pipe'],
  });

  if (result.status !== 0) {
    const stdout = result.stdout ? `\nSTDOUT:\n${result.stdout}` : '';
    const stderr = result.stderr ? `\nSTDERR:\n${result.stderr}` : '';
    throw new Error(`${command} ${args.join(' ')} failed with exit ${result.status}${stdout}${stderr}`);
  }

  return result.stdout;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function copyFile(relativePath, targetRoot) {
  const sourcePath = path.join(root, relativePath);
  const targetPath = path.join(targetRoot, relativePath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
}

function sourcePackFiles() {
  const output = run('npm', ['pack', '--dry-run', '--json']);
  const pack = JSON.parse(output)[0];
  return pack.files.map((file) => file.path);
}

function projectPackageFiles(targetRoot, files) {
  for (const file of files) {
    copyFile(file, targetRoot);
  }
}

function rewriteProjectionMetadata(targetRoot, target) {
  const pkgPath = path.join(targetRoot, 'package.json');
  const pkg = readJson(pkgPath);
  pkg.name = target.packageName;
  pkg.version = target.version;
  pkg.description = target.description;
  pkg.bin = {
    [target.packageName]: 'install.js',
    'ai-builder-os': 'install.js',
  };
  if (target.packageName !== 'pm-copilot-skills') {
    pkg.bin['pm-copilot-skills'] = 'install.js';
  }
  pkg.keywords = Array.from(new Set(['ai-builder-os', 'builder-skills', 'agentic-workflows', ...pkg.keywords]));
  writeJson(pkgPath, pkg);

  const skillPackPath = path.join(targetRoot, 'skill-pack.json');
  const skillPack = readJson(skillPackPath);
  skillPack.version = target.version;
  skillPack.status = 'm3.7-package-repo-migration-dry-run';
  skillPack.package.npm_name = target.packageName;
  skillPack.package.compatibility_policy = target.compatibilityPolicy;
  skillPack.package.bins = Object.keys(pkg.bin);
  if (!skillPack.release_gates.includes('npm run validate:dual-package-dry-run')) {
    skillPack.release_gates.splice(4, 0, 'npm run validate:dual-package-dry-run');
  }
  writeJson(skillPackPath, skillPack);

  const openaiPath = path.join(targetRoot, 'agents', 'openai.yaml');
  let openaiYaml = fs.readFileSync(openaiPath, 'utf8');
  openaiYaml = openaiYaml.replace(/^version: .+$/m, `version: ${target.version}`);
  openaiYaml = openaiYaml.replace(/^package_name: .+$/m, `package_name: ${target.packageName}`);
  openaiYaml = openaiYaml.replace(/npm_package_name: .+$/m, `npm_package_name: ${target.packageName}`);
  if (!openaiYaml.includes('  - npm run validate:dual-package-dry-run')) {
    openaiYaml = openaiYaml.replace(
      '  - npm run validate:trigger-descriptions\n',
      '  - npm run validate:trigger-descriptions\n  - npm run validate:dual-package-dry-run\n',
    );
  }
  fs.writeFileSync(openaiPath, openaiYaml, 'utf8');
}

function validatePack(targetRoot, target) {
  const output = run('npm', ['pack', '--dry-run', '--json'], { cwd: targetRoot });
  const pack = JSON.parse(output)[0];
  const files = pack.files.map((file) => file.path);
  const missing = requiredPackFiles.filter((file) => !files.includes(file));
  const forbidden = files.filter((file) => forbiddenPrefixes.some((prefix) => file.startsWith(prefix)));

  if (pack.name !== target.packageName) {
    throw new Error(`${target.id} package name mismatch: expected ${target.packageName}, got ${pack.name}`);
  }
  if (missing.length > 0) {
    throw new Error(`${target.id} package missing required files: ${missing.join(', ')}`);
  }
  if (forbidden.length > 0) {
    throw new Error(`${target.id} package contains forbidden files: ${forbidden.join(', ')}`);
  }

  return pack;
}

function validateInstallProjection(targetRoot, target) {
  run(process.execPath, ['install.js', 'codex-project', '--overwrite'], { cwd: targetRoot });
  const installRoot = path.join(targetRoot, '.codex', 'skills');
  const installedDirs = fs.readdirSync(installRoot)
    .filter((entry) => fs.statSync(path.join(installRoot, entry)).isDirectory())
    .sort();
  const unexpected = installedDirs.filter((entry) => !builderSkills.includes(entry));
  const missing = builderSkills.filter((skillName) => !installedDirs.includes(skillName));

  if (unexpected.length > 0 || missing.length > 0) {
    throw new Error(
      `${target.id} install projection mismatch. unexpected=${unexpected.join(', ')} missing=${missing.join(', ')}`,
    );
  }

  for (const commandText of target.installCommands) {
    if (!commandText.includes(target.packageName) && target.id === 'primary') {
      throw new Error(`${target.id} install command does not reference primary package: ${commandText}`);
    }
  }
}

try {
  const files = sourcePackFiles();
  const results = [];

  for (const target of packageTargets) {
    const targetRoot = path.join(tempRoot, target.id);
    fs.mkdirSync(targetRoot, { recursive: true });
    projectPackageFiles(targetRoot, files);
    rewriteProjectionMetadata(targetRoot, target);
    const pack = validatePack(targetRoot, target);
    validateInstallProjection(targetRoot, target);
    results.push({
      target: target.id,
      packageName: pack.name,
      version: pack.version,
      filename: pack.filename,
      entryCount: pack.entryCount,
      installCommands: target.installCommands,
    });
  }

  console.log('Dual package dry-run 验证通过。');
  for (const result of results) {
    console.log(`- ${result.target}: ${result.packageName}@${result.version}, ${result.entryCount} files, ${result.filename}`);
    for (const commandText of result.installCommands) {
      console.log(`  install: ${commandText}`);
    }
  }
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
