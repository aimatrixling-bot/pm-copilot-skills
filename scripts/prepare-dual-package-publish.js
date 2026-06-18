#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const releaseVersion = '1.0.0';
const finalTag = 'ai-builder-os-v1.0.0';
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
  'docs/release-runbook-m3.9.md',
  'docs/release-seal-m3.9.md',
  'docs/release-plan-1.0.md',
  'docs/release-seal-m3.8.md',
  'docs/release-seal-m3.8.1.md',
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

const targets = [
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

function usage() {
  console.log(`Usage:
  node scripts/prepare-dual-package-publish.js [--out <dir>] [--clean] [--check-registry] [--npm-publish-dry-run]

Safety:
  This script never runs npm publish without --dry-run.
  Passing --publish is rejected. Real publish must be a separate human-approved step.
`);
}

function parseArgs(argv) {
  const args = {
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
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
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
  const forbidden = files.filter((file) => forbiddenPrefixes.some((prefix) => file.startsWith(prefix)));

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

function registryPreflight() {
  const npmUser = run('npm', ['whoami']).trim();
  const primaryView = run('npm', ['view', 'ai-builder-os', 'version'], { allowFailure: true });
  if (primaryView.status === 0) {
    throw new Error(`ai-builder-os already has a published version: ${primaryView.stdout.trim()}`);
  }
  if (!`${primaryView.stderr}\n${primaryView.stdout}`.includes('E404')) {
    throw new Error(`Unexpected npm view ai-builder-os result: ${primaryView.stderr || primaryView.stdout}`);
  }

  const compatVersionsOutput = run('npm', ['view', 'pm-copilot-skills', 'versions', '--json']);
  const compatVersions = JSON.parse(compatVersionsOutput);
  if (compatVersions.includes(releaseVersion)) {
    throw new Error(`pm-copilot-skills@${releaseVersion} is already published`);
  }

  return {
    npmUser,
    primary: 'E404',
    compatibilityLatest: compatVersions[compatVersions.length - 1],
  };
}

function publishDryRun(targetRoot) {
  run('npm', ['publish', '--dry-run', '--access', 'public'], { cwd: targetRoot, stdio: 'inherit' });
}

function gitHead() {
  const result = run('git', ['rev-parse', 'HEAD'], { allowFailure: true });
  return result.status === 0 ? result.stdout.trim() : null;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
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

  const registry = args.checkRegistry ? registryPreflight() : null;
  const files = sourcePackFiles();
  const packages = [];

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
    finalTag,
    generatedAt: new Date().toISOString(),
    sourceCommit: gitHead(),
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
