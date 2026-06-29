const fs = require('fs');
const path = require('path');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeText(filePath, text) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, text, 'utf8');
}

function writeJson(filePath, value) {
  writeText(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function parseFrontmatter(skillFile) {
  const text = fs.readFileSync(skillFile, 'utf8');
  if (!text.startsWith('---\n')) return {};
  const end = text.indexOf('\n---', 4);
  if (end === -1) return {};
  const parsed = {};
  for (const line of text.slice(4, end).trim().split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    parsed[match[1]] = value;
  }
  return parsed;
}

function boolYaml(value) {
  return value ? 'true' : 'false';
}

function scalar(value) {
  return String(value || '').replace(/"/g, '\\"');
}

function commandFor(adapter, skillName) {
  return `${adapter.invocation_prefix || ''}${skillName}`;
}

function buildInvocationMetadata({ skillDir, skillName, targetName, adapter, skillPack, coreManifest }) {
  const policy = coreManifest.skill_load_policy?.[skillName] || skillPack.skill_load_policy?.[skillName];
  if (!policy) throw new Error(`Missing skill_load_policy for ${skillName}`);

  const frontmatter = parseFrontmatter(path.join(skillDir, 'SKILL.md'));
  const manualOnly = policy.invocation_mode === 'user_invoked';
  return {
    schema_version: '0.1.0',
    product: skillPack.name,
    package_version: skillPack.version,
    bundle: coreManifest.name,
    bundle_version: coreManifest.version,
    target: targetName,
    skill: skillName,
    display_name: frontmatter.displayName || skillName,
    description: frontmatter.description || '',
    invocation: {
      command: commandFor(adapter, skillName),
      prefix: adapter.invocation_prefix || '',
      invocation_mode: policy.invocation_mode,
      context_load_class: policy.context_load_class,
      references_loaded_by_default: policy.references_loaded_by_default,
      manual_only: manualOnly,
      implicit_invocation_allowed: !manualOnly,
    },
  };
}

function openaiYaml(metadata) {
  return [
    `name: ${metadata.skill}`,
    `display_name: ${metadata.display_name}`,
    `runtime: ${metadata.target}`,
    `package_version: ${metadata.package_version}`,
    `bundle: ${metadata.bundle}`,
    `bundle_version: ${metadata.bundle_version}`,
    `invocation: ${metadata.invocation.command}`,
    `invocation_mode: ${metadata.invocation.invocation_mode}`,
    `context_load_class: ${metadata.invocation.context_load_class}`,
    `manual_only: ${boolYaml(metadata.invocation.manual_only)}`,
    `implicit_invocation_allowed: ${boolYaml(metadata.invocation.implicit_invocation_allowed)}`,
    `references_loaded_by_default: ${boolYaml(metadata.invocation.references_loaded_by_default)}`,
    'description: >',
    `  ${scalar(metadata.description)}`,
    '',
  ].join('\n');
}

function claudeFrontmatter(metadata) {
  return [
    '---',
    `name: ${metadata.skill}`,
    `display_name: ${metadata.display_name}`,
    `runtime: ${metadata.target}`,
    `package_version: ${metadata.package_version}`,
    `bundle: ${metadata.bundle}`,
    `bundle_version: ${metadata.bundle_version}`,
    `invocation: ${metadata.invocation.command}`,
    `invocation_mode: ${metadata.invocation.invocation_mode}`,
    `context_load_class: ${metadata.invocation.context_load_class}`,
    `manual_only: ${boolYaml(metadata.invocation.manual_only)}`,
    `implicit_invocation_allowed: ${boolYaml(metadata.invocation.implicit_invocation_allowed)}`,
    `references_loaded_by_default: ${boolYaml(metadata.invocation.references_loaded_by_default)}`,
    `description: "${scalar(metadata.description)}"`,
    '---',
    '',
    'Claude Code invocation metadata generated from AI Builder OS manifests.',
    '',
  ].join('\n');
}

function writeInvocationMetadata(options) {
  const metadata = buildInvocationMetadata(options);
  const metadataDir = path.join(options.skillDir, '.ai-builder-os');
  writeJson(path.join(metadataDir, 'invocation.json'), metadata);

  if (options.targetName === 'codex') {
    writeText(path.join(options.skillDir, 'agents', 'openai.yaml'), openaiYaml(metadata));
  }
  if (options.targetName === 'claude-code') {
    writeText(path.join(metadataDir, 'claude-invocation.md'), claudeFrontmatter(metadata));
  }

  return metadata;
}

function assertInto(failures, condition, message) {
  if (!condition) failures.push(message);
}

function validateInvocationMetadata({ failures, skillDir, skillName, targetName, adapter, skillPack, coreManifest, label }) {
  const invocationPath = path.join(skillDir, '.ai-builder-os', 'invocation.json');
  assertInto(failures, fs.existsSync(invocationPath), `${label}/${skillName} 缺少 invocation metadata`);
  if (!fs.existsSync(invocationPath)) return;

  const metadata = readJson(invocationPath);
  const policy = coreManifest.skill_load_policy[skillName];
  const manualOnly = policy.invocation_mode === 'user_invoked';
  const expectedCommand = commandFor(adapter, skillName);

  assertInto(failures, metadata.schema_version === '0.1.0', `${label}/${skillName} invocation schema_version 不匹配`);
  assertInto(failures, metadata.product === skillPack.name, `${label}/${skillName} invocation product 不匹配`);
  assertInto(failures, metadata.package_version === skillPack.version, `${label}/${skillName} invocation package_version 不匹配`);
  assertInto(failures, metadata.bundle === coreManifest.name, `${label}/${skillName} invocation bundle 不匹配`);
  assertInto(failures, metadata.bundle_version === coreManifest.version, `${label}/${skillName} invocation bundle_version 不匹配`);
  assertInto(failures, metadata.target === targetName, `${label}/${skillName} invocation target 不匹配`);
  assertInto(failures, metadata.skill === skillName, `${label}/${skillName} invocation skill 不匹配`);
  assertInto(failures, metadata.invocation.command === expectedCommand, `${label}/${skillName} invocation command 不匹配`);
  assertInto(failures, metadata.invocation.invocation_mode === policy.invocation_mode, `${label}/${skillName} invocation_mode 不匹配`);
  assertInto(failures, metadata.invocation.context_load_class === policy.context_load_class, `${label}/${skillName} context_load_class 不匹配`);
  assertInto(failures, metadata.invocation.references_loaded_by_default === false, `${label}/${skillName} references_loaded_by_default 必须为 false`);
  assertInto(failures, metadata.invocation.manual_only === manualOnly, `${label}/${skillName} manual_only 不匹配`);
  assertInto(failures, metadata.invocation.implicit_invocation_allowed === !manualOnly, `${label}/${skillName} implicit_invocation_allowed 不匹配`);

  if (targetName === 'codex') {
    const openaiPath = path.join(skillDir, 'agents', 'openai.yaml');
    assertInto(failures, fs.existsSync(openaiPath), `${label}/${skillName} 缺少 Codex agents/openai.yaml`);
    if (fs.existsSync(openaiPath)) {
      const openai = fs.readFileSync(openaiPath, 'utf8');
      for (const term of [
        `name: ${skillName}`,
        'runtime: codex',
        `invocation: ${expectedCommand}`,
        `invocation_mode: ${policy.invocation_mode}`,
        `manual_only: ${boolYaml(manualOnly)}`,
        `implicit_invocation_allowed: ${boolYaml(!manualOnly)}`,
      ]) {
        assertInto(failures, openai.includes(term), `${label}/${skillName} Codex openai.yaml 缺少 ${term}`);
      }
    }
  }

  if (targetName === 'claude-code') {
    const claudePath = path.join(skillDir, '.ai-builder-os', 'claude-invocation.md');
    assertInto(failures, fs.existsSync(claudePath), `${label}/${skillName} 缺少 Claude invocation frontmatter`);
    if (fs.existsSync(claudePath)) {
      const claude = fs.readFileSync(claudePath, 'utf8');
      for (const term of [
        '---',
        `name: ${skillName}`,
        'runtime: claude-code',
        `invocation: ${expectedCommand}`,
        `invocation_mode: ${policy.invocation_mode}`,
        `manual_only: ${boolYaml(manualOnly)}`,
        `implicit_invocation_allowed: ${boolYaml(!manualOnly)}`,
      ]) {
        assertInto(failures, claude.includes(term), `${label}/${skillName} Claude frontmatter 缺少 ${term}`);
      }
    }
  }
}

module.exports = {
  buildInvocationMetadata,
  writeInvocationMetadata,
  validateInvocationMetadata,
};
