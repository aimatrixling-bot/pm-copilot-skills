#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const defaultReleaseVersion = '1.0.0';
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
const allowedRuntimeDocs = [
  'docs/delivery-kernel.md',
  'docs/source-of-truth-map.md',
];
const allowedPackageDocs = [
  'docs/architecture.md',
  ...allowedRuntimeDocs,
];

const requiredPackFiles = [
  'README.md',
  'AGENTS.md',
  'CLAUDE.md',
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
  'scripts/lib/markdown-reference-closure.js',
  'scripts/validate-trigger-descriptions.js',
  'scripts/validate-artifact-evals.js',
  'scripts/validate-onboarding-evals.js',
  'harness/artifact-write-policy.zh.md',
  'loops/README.md',
  'loops/recipes/artifact-hygiene.loop.md',
  'loops/recipes/definition-sync.loop.md',
  'docs/architecture.md',
  'docs/delivery-kernel.md',
  'docs/source-of-truth-map.md',
  'evals/artifact/artifact-index-sync.cases.json',
  'evals/artifact/artifact-cleanup-proposal.cases.json',
  'evals/artifact/artifact-consistency-audit.cases.json',
  'evals/onboarding/project-onboarding.cases.json',
  'evals/runtime/lite-runtime-conformance.cases.json',
  'references/README.md',
  'references/prototype-to-spec.zh.md',
  'references/legacy-pm-methods/README.md',
  'references/skill-design/README.md',
  'references/skill-design/skill-design-playbook.zh.md',
  'references/ui-ux/README.md',
  'references/ui-ux/design-principles.zh.md',
  'references/ui-ux/component-guidelines.zh.md',
  'references/ui-ux/interaction-patterns.zh.md',
  'references/ui-ux/visual-style.zh.md',
  'templates/module-execution-pack/template.md',
  'templates/change-contract/template.md',
  'templates/branch-state/template.md',
  'templates/definition-drift-check/template.md',
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
  'docs/release-',
  'references/source-blueprints/',
];

function usage() {
  console.log(`Usage:
  node scripts/prepare-dual-package-publish.js [--version <semver>] [--tag <git-tag>] [--out <dir>] [--clean] [--check-registry] [--npm-publish-dry-run]

Safety:
  This script never runs npm publish without --dry-run.
  Passing --publish is rejected. Real publish must be a separate human-approved step.
`);
}

function parseArgs(argv) {
  const args = {
    version: defaultReleaseVersion,
    tag: null,
    out: null,
    clean: false,
    checkRegistry: false,
    npmPublishDryRun: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (arg === '--publish') {
      throw new Error('Refusing --publish. This script only supports dry-run release preparation.');
    }
    if (arg === '--clean') {
      args.clean = true;
    } else if (arg === '--check-registry') {
      args.checkRegistry = true;
    } else if (arg === '--npm-publish-dry-run') {
      args.npmPublishDryRun = true;
    } else if (arg === '--out') {
      index += 1;
      if (!argv[index]) throw new Error('--out requires a directory');
      args.out = argv[index];
    } else if (arg === '--version') {
      index += 1;
      if (!argv[index]) throw new Error('--version requires a semver value');
      args.version = argv[index];
    } else if (arg === '--tag') {
      index += 1;
      if (!argv[index]) throw new Error('--tag requires a git tag value');
      args.tag = argv[index];
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(args.version)) {
    throw new Error(`Invalid --version value: ${args.version}`);
  }
  if (!args.tag) args.tag = `ai-builder-os-v${args.version}`;

  return args;
}

function createTargets(releaseVersion) {
  return [
    {
      id: 'primary',
      packageName: 'ai-builder-os',
      version: releaseVersion,
      status: 'm3.9-primary-release-projection',
      description: 'AI Builder OS primary package for executable, verifiable agentic builder workflows',
      compatibilityPolicy: 'primary 1.0 package name; keep pm-copilot-skills as compatibility package during migration',
    },
    {
      id: 'compatibility',
      packageName: 'pm-copilot-skills',
      version: releaseVersion,
      status: 'm3.9-compatibility-release-projection',
      description: 'Compatibility package for AI Builder OS users migrating from pm-copilot-skills',
      compatibilityPolicy: 'compatibility package; install the pure AI Builder OS builder core and document ai-builder-os as the primary package',
    },
  ];
}

function run(command, args, options = {}) {
  const useWindowsNpmShell = process.platform === 'win32' && command === 'npm';
  const shellArgs = useWindowsNpmShell
    ? args.map((arg) => (/[ \t]/.test(arg) ? `"${arg.replace(/"/g, '\\"')}"` : arg))
    : args;
  const result = spawnSync(command, shellArgs, {
    cwd: options.cwd || root,
    encoding: 'utf8',
    shell: options.shell ?? useWindowsNpmShell,
    stdio: options.stdio || ['ignore', 'pipe', 'pipe'],
  });

  if (options.allowFailure) return result;

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

function isForbiddenPackFile(filePath) {
  return forbiddenPrefixes.some((prefix) => filePath.startsWith(prefix)) ||
    (filePath.startsWith('docs/') && filePath.includes('hardening-brief'));
}

function sha512(filePath) {
  return crypto.createHash('sha512').update(fs.readFileSync(filePath)).digest('hex');
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(relativePath, targetRoot) {
  const sourcePath = path.join(root, relativePath);
  const targetPath = path.join(targetRoot, relativePath);
  ensureDir(path.dirname(targetPath));
  fs.copyFileSync(sourcePath, targetPath);
}

function sourcePackFiles() {
  const output = run('npm', ['pack', '--dry-run', '--json']);
  const pack = JSON.parse(output)[0];
  return pack.files.map((file) => file.path);
}

function projectPackageFiles(targetRoot, files) {
  for (const file of files) copyFile(file, targetRoot);
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
    'pm-copilot-skills': 'install.js',
  };
  pkg.keywords = Array.from(new Set(['ai-builder-os', 'builder-skills', 'agentic-workflows', ...pkg.keywords]));
  writeJson(pkgPath, pkg);

  const skillPackPath = path.join(targetRoot, 'skill-pack.json');
  const skillPack = readJson(skillPackPath);
  skillPack.version = target.version;
  skillPack.status = target.status;
  skillPack.package.npm_name = target.packageName;
  skillPack.package.compatibility_policy = target.compatibilityPolicy;
  skillPack.package.bins = Object.keys(pkg.bin);
  writeJson(skillPackPath, skillPack);

  const openaiPath = path.join(targetRoot, 'agents', 'openai.yaml');
  let openaiYaml = fs.readFileSync(openaiPath, 'utf8');
  openaiYaml = openaiYaml.replace(/^version: .+$/m, `version: ${target.version}`);
  openaiYaml = openaiYaml.replace(/^package_name: .+$/m, `package_name: ${target.packageName}`);
  openaiYaml = openaiYaml.replace(/npm_package_name: .+$/m, `npm_package_name: ${target.packageName}`);
  fs.writeFileSync(openaiPath, openaiYaml, 'utf8');
}

function validatePack(pack, target) {
  const files = pack.files.map((file) => file.path);
  const missing = requiredPackFiles.filter((file) => !files.includes(file));
  const forbidden = files.filter(isForbiddenPackFile);
  const docs = files.filter((file) => file.startsWith('docs/')).sort();

  if (pack.name !== target.packageName) {
    throw new Error(`${target.id} package name mismatch: expected ${target.packageName}, got ${pack.name}`);
  }
  if (pack.version !== target.version) {
    throw new Error(`${target.id} package version mismatch: expected ${target.version}, got ${pack.version}`);
  }
  if (missing.length > 0) {
    throw new Error(`${target.id} package missing required files: ${missing.join(', ')}`);
  }
  if (forbidden.length > 0) {
    throw new Error(`${target.id} package contains forbidden files: ${forbidden.join(', ')}`);
  }
  if (!sameSet(docs, allowedPackageDocs)) {
    throw new Error(`${target.id} package docs surface mismatch. expected=${allowedPackageDocs.join(', ')} actual=${docs.join(', ')}`);
  }
}

function validateInstallProjection(targetRoot, target) {
  run(process.execPath, ['install.js', 'codex-project', '--overwrite'], { cwd: targetRoot });
  const installRoot = path.join(targetRoot, '.agents', 'skills');
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

  for (const skillName of builderSkills) {
    const docs = listFiles(path.join(installRoot, skillName, 'docs')).map((file) => `docs/${file}`).sort();
    if (!sameSet(docs, allowedRuntimeDocs)) {
      throw new Error(`${target.id}/${skillName} installed docs surface mismatch. expected=${allowedRuntimeDocs.join(', ')} actual=${docs.join(', ')}`);
    }
  }
}

function packProjection(targetRoot, target, tarballDir) {
  const dryRunOutput = run('npm', ['pack', '--dry-run', '--json'], { cwd: targetRoot });
  const dryRunPack = JSON.parse(dryRunOutput)[0];
  validatePack(dryRunPack, target);

  const packOutput = run('npm', ['pack', '--json', '--pack-destination', tarballDir], { cwd: targetRoot });
  const pack = JSON.parse(packOutput)[0];
  validatePack(pack, target);

  const tarballPath = path.join(tarballDir, pack.filename);
  if (!fs.existsSync(tarballPath)) {
    throw new Error(`${target.id} tarball was not created: ${tarballPath}`);
  }

  return { pack, tarballPath };
}

function readPublishedVersions(packageName) {
  const view = run('npm', ['view', packageName, 'versions', '--json'], { allowFailure: true });
  if (view.status !== 0) {
    if (`${view.stderr}\n${view.stdout}`.includes('E404')) return [];
    throw new Error(`Unexpected npm view ${packageName} result: ${view.stderr || view.stdout}`);
  }

  const parsed = JSON.parse(view.stdout);
  return Array.isArray(parsed) ? parsed : [parsed];
}

function registryPreflight(targets) {
  const npmUser = run('npm', ['whoami']).trim();
  const packages = {};
  for (const target of targets) {
    const versions = readPublishedVersions(target.packageName);
    if (versions.includes(target.version)) {
      throw new Error(`${target.packageName}@${target.version} is already published`);
    }
    packages[target.packageName] = {
      latest: versions[versions.length - 1] || null,
      targetVersionAvailable: true,
    };
  }

  return {
    npmUser,
    packages,
  };
}

function publishDryRun(targetRoot) {
  run('npm', ['publish', '--dry-run', '--access', 'public'], { cwd: targetRoot, stdio: 'inherit' });
}

function gitHead() {
  const result = run('git', ['rev-parse', 'HEAD'], { allowFailure: true });
  return result.status === 0 ? result.stdout.trim() : null;
}

function gitStatusShort() {
  const result = run('git', ['status', '--short'], { allowFailure: true });
  if (result.status !== 0) return null;
  return result.stdout
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(Boolean);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const targets = createTargets(args.version);
  const outputRoot = args.out
    ? path.resolve(root, args.out)
    : fs.mkdtempSync(path.join(os.tmpdir(), 'ai-builder-os-m3-9-release-'));
  const temporaryOutput = !args.out;

  if (args.clean && fs.existsSync(outputRoot)) {
    fs.rmSync(outputRoot, { recursive: true, force: true });
  }
  ensureDir(outputRoot);

  const projectionRoot = path.join(outputRoot, 'projections');
  const tarballDir = path.join(outputRoot, 'tarballs');
  ensureDir(projectionRoot);
  ensureDir(tarballDir);

  const registry = args.checkRegistry ? registryPreflight(targets) : null;
  const files = sourcePackFiles();
  const packages = [];
  const sourceWorktreeStatus = gitStatusShort();

  for (const target of targets) {
    const targetRoot = path.join(projectionRoot, target.id);
    ensureDir(targetRoot);
    projectPackageFiles(targetRoot, files);
    rewriteProjectionMetadata(targetRoot, target);
    validateInstallProjection(targetRoot, target);
    const { pack, tarballPath } = packProjection(targetRoot, target, tarballDir);
    if (args.npmPublishDryRun) publishDryRun(targetRoot);

    packages.push({
      id: target.id,
      name: pack.name,
      version: pack.version,
      filename: pack.filename,
      entryCount: pack.entryCount,
      tarballPath,
      sha512: sha512(tarballPath),
      publishCommand: `npm publish "${tarballPath}" --access public`,
    });
  }

  const manifest = {
    schema_version: '0.1.0',
    milestone: 'M3.9',
    mode: 'dry-run-only',
    finalTag: args.tag,
    generatedAt: new Date().toISOString(),
    sourceCommit: gitHead(),
    sourceWorktreeStatus,
    sourcePackage: readJson(path.join(root, 'package.json')),
    registry,
    packages,
    publishOrder: packages.map((pkg) => pkg.id),
    postReleaseVerification: [
      'npm view ai-builder-os version',
      'npm view pm-copilot-skills version',
      'npx ai-builder-os codex --overwrite',
      'npm run validate:codex-install',
      'npx pm-copilot-skills codex --overwrite',
      'npm run validate:codex-install',
    ],
    safety: [
      'This script did not run npm publish.',
      'This script rejects --publish.',
      'Use publishCommand entries only after explicit human approval.',
    ],
  };
  const manifestPath = path.join(outputRoot, 'release-manifest.json');
  writeJson(manifestPath, manifest);

  console.log('M3.9 dual package publish preparation passed.');
  console.log(`Output: ${outputRoot}`);
  console.log(`Manifest: ${manifestPath}`);
  if (Array.isArray(sourceWorktreeStatus) && sourceWorktreeStatus.length > 0) {
    console.warn(`WARNING: source worktree has ${sourceWorktreeStatus.length} uncommitted entries. Commit before real publish.`);
  }
  for (const pkg of packages) {
    console.log(`- ${pkg.id}: ${pkg.name}@${pkg.version}, ${pkg.entryCount} files`);
    console.log(`  tarball: ${pkg.tarballPath}`);
  }
  if (temporaryOutput) {
    fs.rmSync(outputRoot, { recursive: true, force: true });
    console.log('Temporary output cleaned.');
  }
}

try {
  main();
} catch (error) {
  console.error(`ERROR: ${error.message}`);
  process.exit(1);
}
