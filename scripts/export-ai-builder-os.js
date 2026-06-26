#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');

const root = path.resolve(__dirname, '..');
const markerName = '.ai-builder-os-export-target';
const metadataDirName = '.ai-builder-os';
const excludedLocalResourcePrefixes = ['references/source-blueprints'];
const sharedResourceNames = ['adapters', 'kernel', 'harness', 'memory', 'loops', 'references', 'templates'];
const runtimeDocResourcePaths = [
  'docs/delivery-kernel.md',
  'docs/source-of-truth-map.md',
];
const packageDocResourcePaths = [
  'docs/architecture.md',
  ...runtimeDocResourcePaths,
];

function usage() {
  console.log(`Usage:
  node scripts/export-ai-builder-os.js --target <codex|claude-code|generic-agent> --out <dir> [--clean] [--json]
  node scripts/export-ai-builder-os.js --list-targets

Examples:
  node scripts/export-ai-builder-os.js --target codex --out "%USERPROFILE%\\.agents\\skills" --clean
  node scripts/export-ai-builder-os.js --target generic-agent --out ".\\dist\\ai-builder-os\\generic-agent" --clean
`);
}

function parseArgs(argv) {
  const parsed = {
    target: null,
    out: null,
    clean: false,
    json: false,
    listTargets: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--target') {
      parsed.target = argv[index + 1];
      index += 1;
    } else if (arg === '--out') {
      parsed.out = argv[index + 1];
      index += 1;
    } else if (arg === '--clean') {
      parsed.clean = true;
    } else if (arg === '--json') {
      parsed.json = true;
    } else if (arg === '--list-targets') {
      parsed.listTargets = true;
    } else if (arg === '--help' || arg === '-h') {
      parsed.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return parsed;
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

function copyRecursive(src, dest) {
  const relativeSource = path.relative(root, src).split(path.sep).join('/');
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
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function removeContentsSafely(targetDir) {
  const resolved = path.resolve(targetDir);
  const marker = path.join(resolved, markerName);
  const isTemp = resolved.startsWith(path.resolve(os.tmpdir()));
  const isRepoDist = resolved.startsWith(path.join(root, 'dist'));
  const exists = fs.existsSync(resolved);

  if (!exists) {
    fs.mkdirSync(resolved, { recursive: true });
    return;
  }

  const entries = fs.readdirSync(resolved);
  const hasMarker = fs.existsSync(marker);
  if (entries.length > 0 && !hasMarker && !isTemp && !isRepoDist) {
    throw new Error(
      `Refusing to clean non-export directory without ${markerName}: ${resolved}`,
    );
  }

  for (const entry of entries) {
    fs.rmSync(path.join(resolved, entry), { recursive: true, force: true });
  }
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function copyMetadata(targetDir, targetName, adapter, skillPack, activeSkills) {
  const metadataDir = path.join(targetDir, metadataDirName);
  fs.mkdirSync(metadataDir, { recursive: true });
  copyRecursive(path.join(root, 'skill-pack.json'), path.join(metadataDir, 'skill-pack.json'));
  copyRecursive(path.join(root, 'agents'), path.join(metadataDir, 'agents'));
  copyRecursive(path.join(root, 'bundles'), path.join(metadataDir, 'bundles'));
  copyRecursive(path.join(root, 'adapters', targetName), path.join(metadataDir, 'adapter'));

  const manifest = {
    export_schema_version: '0.1.0',
    package_name: skillPack.name,
    package_version: skillPack.version,
    npm_package_name: skillPack.package.npm_name,
    target: targetName,
    export_layout: adapter.export_layout,
    active_skills: activeSkills,
    metadata_directory: metadataDirName,
    generated_by: 'scripts/export-ai-builder-os.js',
  };
  writeJson(path.join(metadataDir, 'export-manifest.json'), manifest);
}

function copySharedResources(dest) {
  for (const resourceName of sharedResourceNames) {
    copyRecursive(path.join(root, resourceName), path.join(dest, resourceName));
  }
  for (const relativePath of runtimeDocResourcePaths) {
    copyRecursive(path.join(root, relativePath), path.join(dest, relativePath));
  }
}

function exportFlatSkillRoot(targetDir, targetName, activeSkills) {
  for (const skillName of activeSkills) {
    const skillDest = path.join(targetDir, skillName);
    copyRecursive(path.join(root, 'skills', skillName), skillDest);
    copySharedResources(skillDest);
    writeJson(path.join(skillDest, metadataDirName, 'runtime.json'), {
      target: targetName,
      skill: skillName,
      layout: 'flat-skill-root',
      embedded_shared_resources: true,
    });
  }
}

function exportPackageRoot(targetDir, targetName, activeSkills) {
  for (const skillName of activeSkills) {
    copyRecursive(path.join(root, 'skills', skillName), path.join(targetDir, 'skills', skillName));
  }

  for (const resourceName of [...sharedResourceNames, 'evals']) {
    copyRecursive(path.join(root, resourceName), path.join(targetDir, resourceName));
  }
  for (const relativePath of packageDocResourcePaths) {
    copyRecursive(path.join(root, relativePath), path.join(targetDir, relativePath));
  }

  fs.writeFileSync(
    path.join(targetDir, 'README.md'),
    [
      '# AI Builder OS Generic Agent Export',
      '',
      'This export contains the pure AI Builder OS builder core surface.',
      '',
      'Read `.ai-builder-os/export-manifest.json` first, then load the required skill and shared resources.',
      '',
    ].join('\n'),
    'utf8',
  );

  writeJson(path.join(targetDir, metadataDirName, 'runtime.json'), {
    target: targetName,
    layout: 'package-root',
    embedded_shared_resources: false,
  });
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const adapters = Object.fromEntries(
    fs.readdirSync(path.join(root, 'adapters'))
      .filter((entry) => fs.existsSync(path.join(root, 'adapters', entry, 'adapter.json')))
      .map((entry) => [entry, readJson(path.join('adapters', entry, 'adapter.json'))]),
  );

  if (args.help) {
    usage();
    return;
  }

  if (args.listTargets) {
    const targetNames = Object.keys(adapters).sort();
    if (args.json) {
      console.log(JSON.stringify(targetNames, null, 2));
    } else {
      console.log(targetNames.join('\n'));
    }
    return;
  }

  if (!args.target || !args.out) {
    usage();
    process.exit(1);
  }

  if (!adapters[args.target]) {
    throw new Error(`Unsupported target: ${args.target}`);
  }

  const adapter = adapters[args.target];
  const targetDir = path.resolve(args.out);
  const skillPack = readJson('skill-pack.json');
  const activeSkills = skillPack.active_surface.skills;

  if (args.clean) {
    removeContentsSafely(targetDir);
  } else {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  if (adapter.export_layout === 'flat-skill-root') {
    exportFlatSkillRoot(targetDir, args.target, activeSkills);
  } else if (adapter.export_layout === 'package-root') {
    exportPackageRoot(targetDir, args.target, activeSkills);
  } else {
    throw new Error(`Unsupported export layout for ${args.target}: ${adapter.export_layout}`);
  }

  copyMetadata(targetDir, args.target, adapter, skillPack, activeSkills);
  fs.writeFileSync(path.join(targetDir, markerName), `${new Date().toISOString()}\n`, 'utf8');

  const result = {
    target: args.target,
    out: targetDir,
    layout: adapter.export_layout,
    active_skill_count: activeSkills.length,
    metadata_directory: metadataDirName,
  };

  if (args.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Exported AI Builder OS ${args.target} runtime surface to ${targetDir}`);
    console.log(`Active skills: ${activeSkills.length}`);
  }
}

try {
  main();
} catch (error) {
  console.error(`Export failed: ${error.message}`);
  process.exit(1);
}
