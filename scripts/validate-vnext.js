#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SKILL_FIELDS = [
  'name',
  'description',
  'disable-model-invocation',
  'can-invoke',
  'paths',
  'status',
  'owner_agent',
  'shared_with',
  'scope',
  'grade',
];

const AGENT_FIELDS = [
  'name',
  'role',
  'intent_triggers',
  'can_invoke',
  'output_contract',
  'on_fail',
  'handoff_to',
  'forbidden',
];

const THREE_FIELD_MANIFEST = ['name', 'type', 'status'];

const SKILL_SECTIONS = [
  'Invocation',
  'Steps',
  'Reference',
  'Completion Criteria',
  'Failure Modes',
];

function normalizePath(filePath) {
  return filePath.split(path.sep).join('/');
}

function relativePath(root, filePath) {
  return normalizePath(path.relative(root, filePath));
}

function fail(root, filePath, category, message) {
  return `[FAIL] ${relativePath(root, filePath)}: ${category} - ${message}`;
}

function listMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

function parseFrontmatter(content) {
  const lines = content.replace(/^\uFEFF/, '').split(/\r?\n/);
  if (lines[0] !== '---') {
    return { keys: [], duplicates: [], error: '缺少 frontmatter 起始 ---' };
  }

  const closingIndex = lines.findIndex((line, index) => index > 0 && line.trim() === '---');
  if (closingIndex === -1) {
    return { keys: [], duplicates: [], error: '缺少 frontmatter 结束 ---' };
  }

  const keys = [];
  const seen = new Set();
  const duplicates = [];
  for (const line of lines.slice(1, closingIndex)) {
    const match = line.match(/^([A-Za-z0-9_-]+):/);
    if (!match) {
      continue;
    }

    const key = match[1];
    if (seen.has(key)) {
      duplicates.push(key);
    }
    seen.add(key);
    keys.push(key);
  }

  return { keys, duplicates, error: null };
}

function classifyManifest(root, filePath) {
  const rel = relativePath(root, filePath);

  if (rel === 'vnext/README.md') {
    return { kind: 'Root', fields: THREE_FIELD_MANIFEST };
  }

  if (rel === 'vnext/skills/_index.md' || rel === 'vnext/agents/_index.md' || rel === 'vnext/memory/_index.md') {
    return { kind: 'Index', fields: THREE_FIELD_MANIFEST };
  }

  if (rel.startsWith('vnext/skills/') && rel.endsWith('/SKILL.md')) {
    return { kind: 'Skill', fields: SKILL_FIELDS };
  }

  if (rel.startsWith('vnext/agents/') && rel.endsWith('.md')) {
    return { kind: 'Agent', fields: AGENT_FIELDS };
  }

  if (rel.startsWith('vnext/kernel/') && rel.endsWith('.md')) {
    return { kind: 'Kernel', fields: THREE_FIELD_MANIFEST };
  }

  if (rel.startsWith('vnext/memory/') && rel.endsWith('.md')) {
    return { kind: 'Memory', fields: THREE_FIELD_MANIFEST };
  }

  return null;
}

function validateFrontmatter(root, filePath, expectedFields) {
  const errors = [];
  const content = fs.readFileSync(filePath, 'utf8');
  const frontmatter = parseFrontmatter(content);

  if (frontmatter.error) {
    errors.push(fail(root, filePath, '字段冻结', frontmatter.error));
    return errors;
  }

  for (const duplicate of frontmatter.duplicates) {
    errors.push(fail(root, filePath, '字段冻结', `重复字段 "${duplicate}"`));
  }

  const actual = new Set(frontmatter.keys);
  const expected = new Set(expectedFields);

  for (const field of expectedFields) {
    if (!actual.has(field)) {
      errors.push(fail(root, filePath, '字段冻结', `缺少必填字段 "${field}"`));
    }
  }

  for (const field of frontmatter.keys) {
    if (!expected.has(field)) {
      errors.push(fail(root, filePath, '字段冻结', `多余字段 "${field}"`));
    }
  }

  return errors;
}

function isSectionRef(line) {
  return /^\s*<!--\s*SECTION_REF:\s*docs\/vnext-blueprint\.md#§[0-9]+(?:\.[0-9]+)*(?:[-_][^>]*)?\s*-->\s*$/.test(line);
}

function previousNonEmptyLine(lines, index) {
  for (let i = index - 1; i >= 0; i -= 1) {
    if (lines[i].trim().length > 0) {
      return lines[i];
    }
  }
  return '';
}

function nextNonEmptyLine(lines, index) {
  for (let i = index + 1; i < lines.length; i += 1) {
    if (lines[i].trim().length > 0) {
      return lines[i];
    }
  }
  return '';
}

function validateSkillSections(root, filePath) {
  const errors = [];
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const headings = new Map();

  lines.forEach((line, index) => {
    const match = line.match(/^##\s+(.+?)\s*$/);
    if (match && SKILL_SECTIONS.includes(match[1]) && !headings.has(match[1])) {
      headings.set(match[1], index);
    }
  });

  for (const section of SKILL_SECTIONS) {
    if (!headings.has(section)) {
      errors.push(fail(root, filePath, 'SECTION 完整性', `Skill ${path.basename(path.dirname(filePath))} 缺少 SECTION: ${section}`));
    }
  }

  if (errors.length > 0) {
    return errors;
  }

  const positions = SKILL_SECTIONS.map((section) => headings.get(section));
  const ordered = positions.every((lineIndex, index) => index === 0 || positions[index - 1] < lineIndex);
  if (!ordered) {
    errors.push(fail(root, filePath, 'SECTION 完整性', 'Skill SECTION 顺序应为 Invocation→Steps→Reference→Completion Criteria→Failure Modes'));
  }

  for (const section of SKILL_SECTIONS) {
    const index = headings.get(section);
    const hasAdjacentSectionRef = isSectionRef(previousNonEmptyLine(lines, index)) || isSectionRef(nextNonEmptyLine(lines, index));
    if (!hasAdjacentSectionRef) {
      errors.push(fail(root, filePath, 'SECTION 完整性', `Skill ${path.basename(path.dirname(filePath))} 的 ${section} SECTION 缺少 SECTION_REF`));
    }
  }

  return errors;
}

function parseBlueprintSections(blueprintPath) {
  const content = fs.readFileSync(blueprintPath, 'utf8');
  const sections = new Set();

  for (const line of content.split(/\r?\n/)) {
    if (!/^#{1,6}\s+/.test(line)) {
      continue;
    }

    const heading = line.replace(/^#{1,6}\s+/, '');
    const matches = heading.matchAll(/(?:§\s*)?([0-9]+(?:\.[0-9]+)+)\b/g);
    for (const match of matches) {
      sections.add(`§${match[1]}`);
    }
  }

  return sections;
}

function validateSectionRefs(root, blueprintSections) {
  const errors = [];
  const vnextDir = path.join(root, 'vnext');
  const files = listMarkdownFiles(vnextDir);

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf8');
    const refs = content.matchAll(/<!--\s*SECTION_REF:\s*([^#\s>]+)#([^>\s]+)\s*-->/g);
    for (const ref of refs) {
      const refPath = ref[1];
      const anchor = ref[2];

      if (refPath !== 'docs/vnext-blueprint.md') {
        errors.push(fail(root, filePath, 'SECTION_REF 死链', `SECTION_REF 文件路径错误 "${refPath}"`));
        continue;
      }

      const sectionMatch = anchor.match(/§([0-9]+(?:\.[0-9]+)+)\b/);
      if (!sectionMatch) {
        errors.push(fail(root, filePath, 'SECTION_REF 死链', `SECTION_REF 缺少蓝图 §号 "${anchor}"`));
        continue;
      }

      const sectionId = `§${sectionMatch[1]}`;
      if (!blueprintSections.has(sectionId)) {
        errors.push(fail(root, filePath, 'SECTION_REF 死链', `${sectionId} 不存在于蓝图`));
      }
    }
  }

  return errors;
}

function validateVnext(root = path.resolve(__dirname, '..')) {
  const errors = [];
  const vnextDir = path.join(root, 'vnext');
  const blueprintPath = path.join(root, 'docs', 'vnext-blueprint.md');

  if (!fs.existsSync(vnextDir)) {
    return { errors };
  }

  if (!fs.existsSync(blueprintPath)) {
    errors.push(`[FAIL] docs/vnext-blueprint.md: SECTION_REF 死链 - 蓝图文件不存在`);
    return { errors };
  }

  const manifestFiles = [
    path.join(vnextDir, 'README.md'),
    ...listMarkdownFiles(path.join(vnextDir, 'skills')),
    ...listMarkdownFiles(path.join(vnextDir, 'agents')),
    ...listMarkdownFiles(path.join(vnextDir, 'kernel')),
    ...listMarkdownFiles(path.join(vnextDir, 'memory')),
  ].filter((filePath) => fs.existsSync(filePath));

  for (const filePath of manifestFiles) {
    const manifest = classifyManifest(root, filePath);
    if (!manifest) {
      continue;
    }

    errors.push(...validateFrontmatter(root, filePath, manifest.fields));

    if (manifest.kind === 'Skill') {
      errors.push(...validateSkillSections(root, filePath));
    }
  }

  const blueprintSections = parseBlueprintSections(blueprintPath);
  errors.push(...validateSectionRefs(root, blueprintSections));

  return { errors };
}

if (require.main === module) {
  const result = validateVnext();
  if (result.errors.length > 0) {
    result.errors.forEach((error) => console.error(error));
    process.exit(1);
  }
  console.log('vnext 验证通过');
}

module.exports = { validateVnext };
