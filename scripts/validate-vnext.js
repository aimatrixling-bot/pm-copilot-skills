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

const SKILL_SECTIONS = ['Invocation', 'Steps', 'Reference', 'Completion Criteria', 'Failure Modes'];

const SURFACE_EXPECTED_COUNTS = { agent: 5, skill: 12, kernel: 4, memory: 4 };
const SKILL_SURFACE_GRADES = new Set(['P0', 'P1']);
const SURFACE_STATUSES = new Set(['draft', 'stable', 'deprecated']);
const SURFACE_STATUS_TYPES = new Set(['skill', 'kernel', 'memory']);

// References frontmatter 子类按 type 字段路由；status 为开放命名空间（TD-16）。
const REFERENCE_FIELDS_BY_TYPE = {
  'design-decision': ['title', 'type', 'status', 'created_at', 'source', 'related_skills', 'related_blueprint_sections'],
  'reviewer-feedback': ['name', 'type', 'status', 'reviewer', 'audience', 'date'],
  spec: ['title', 'category', 'scope', 'type', 'status', 'owner_agent', 'shared_with', 'last_updated'],
};

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

function parseFrontmatterScalar(rawValue) {
  if (rawValue === '[]') return [];
  if (!rawValue.startsWith('[') || !rawValue.endsWith(']')) return rawValue.replace(/^['"]|['"]$/g, '');
  const inner = rawValue.slice(1, -1).trim();
  return inner ? inner.split(',').map((item) => item.trim().replace(/^['"]|['"]$/g, '')) : [];
}

function parseFrontmatterValues(root, filePath) {
  const lines = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/);
  if (lines[0] !== '---') return { values: {}, error: fail(root, filePath, '字段读取', '缺少 frontmatter 起始 ---') };
  const closingIndex = lines.findIndex((line, index) => index > 0 && line.trim() === '---');
  if (closingIndex === -1) return { values: {}, error: fail(root, filePath, '字段读取', '缺少 frontmatter 结束 ---') };

  const values = {};
  for (const line of lines.slice(1, closingIndex)) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (match) values[match[1]] = parseFrontmatterScalar(match[2].trim());
  }
  return { values, error: null };
}

function parseSurfaceManifest(root, surfacePath) {
  const errors = [];
  const lines = fs.readFileSync(surfacePath, 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/);
  const { values: frontmatter, error } = parseFrontmatterValues(root, surfacePath);
  if (error) return { manifest: { assets: [], total_assets: 0 }, errors: [error] };

  const totalAssets = Number(frontmatter.total_assets);
  if (!Number.isInteger(totalAssets)) {
    errors.push(fail(root, surfacePath, '[C1] surface manifest', 'frontmatter total_assets 必须是整数'));
  }

  const assets = [];
  let inAssetsTable = false;
  for (const line of lines) {
    if (line.startsWith('## Assets')) { inAssetsTable = true; continue; }
    if (inAssetsTable && line.startsWith('## Total')) break;
    if (!inAssetsTable || !line.startsWith('|')) continue;
    if (line.includes('asset_type') || /^\|\s*-+/.test(line)) continue;

    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
    if (cells.length !== 8) continue;
    const [asset_type, name, assetPath, grade, status, owner_agent, runtime_visible, bucket] = cells;
    assets.push({ asset_type, name, path: assetPath, grade, status, owner_agent, runtime_visible: runtime_visible === 'true', bucket });
  }
  return { manifest: { assets, total_assets: totalAssets }, errors };
}

function actualSurfacePaths(vnextDir) {
  return new Set([
    ...listMarkdownFiles(path.join(vnextDir, 'skills'))
      .filter((filePath) => filePath.endsWith(`${path.sep}SKILL.md`))
      .map((filePath) => relativePath(vnextDir, filePath)),
    ...fs.readdirSync(path.join(vnextDir, 'agents'), { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && entry.name !== '_index.md')
      .map((entry) => `agents/${entry.name}`),
    ...fs.readdirSync(path.join(vnextDir, 'kernel'), { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
      .map((entry) => `kernel/${entry.name}`),
    ...fs.readdirSync(path.join(vnextDir, 'memory'), { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && entry.name !== '_index.md')
      .map((entry) => `memory/${entry.name}`),
  ]);
}

function validateExactFileList(root, manifest) {
  const errors = [];
  const vnextDir = path.join(root, 'vnext');
  const surfacePath = path.join(vnextDir, '_surface.md');
  const manifestPaths = new Set(manifest.assets.filter((asset) => asset.asset_type !== 'reference').map((asset) => asset.path));
  const actualPaths = actualSurfacePaths(vnextDir);

  const extra = [...actualPaths].filter((assetPath) => !manifestPaths.has(assetPath));
  const missing = [...manifestPaths].filter((assetPath) => !actualPaths.has(assetPath));
  if (extra.length > 0) errors.push(fail(root, surfacePath, '[C1] exact-file-list', `未声明资产: ${extra.join(', ')}`));
  if (missing.length > 0) errors.push(fail(root, surfacePath, '[C1] exact-file-list', `幻影资产: ${missing.join(', ')}`));
  for (const [assetType, expectedCount] of Object.entries(SURFACE_EXPECTED_COUNTS)) {
    const actualCount = manifest.assets.filter((asset) => asset.asset_type === assetType).length;
    if (actualCount !== expectedCount) errors.push(fail(root, surfacePath, '[C1] exact-file-list', `${assetType} count expected ${expectedCount}, got ${actualCount}`));
  }
  if (manifest.assets.length !== manifest.total_assets) errors.push(fail(root, surfacePath, '[C1] exact-file-list', `total_assets expected ${manifest.total_assets}, got ${manifest.assets.length}`));
  return errors;
}

function readAssetFrontmatter(root, vnextDir, asset, errors) {
  const result = parseFrontmatterValues(root, path.join(vnextDir, asset.path));
  if (!result.error) return result.values;
  errors.push(result.error);
  return null;
}

function validateGradeAllowlist(root, manifest) {
  const errors = [];
  const vnextDir = path.join(root, 'vnext');
  for (const asset of manifest.assets.filter((item) => item.asset_type === 'skill')) {
    const filePath = path.join(vnextDir, asset.path);
    const frontmatter = readAssetFrontmatter(root, vnextDir, asset, errors);
    if (!frontmatter) continue;

    const actualGrade = frontmatter.grade;
    if (!SKILL_SURFACE_GRADES.has(asset.grade)) errors.push(fail(root, filePath, '[C2] grade-allowlist', `manifest grade "${asset.grade}" 不在 {P0, P1}`));
    if (!SKILL_SURFACE_GRADES.has(actualGrade)) errors.push(fail(root, filePath, '[C2] grade-allowlist', `frontmatter grade "${actualGrade}" 不在 {P0, P1}`));
    if (asset.grade !== actualGrade) errors.push(fail(root, filePath, '[C2] grade-allowlist', `manifest grade "${asset.grade}" 与 frontmatter grade "${actualGrade}" 不一致`));
  }
  return errors;
}

function validateEnumValues(root, manifest) {
  const errors = [];
  const vnextDir = path.join(root, 'vnext');
  for (const asset of manifest.assets.filter((item) => SURFACE_STATUS_TYPES.has(item.asset_type))) {
    const filePath = path.join(vnextDir, asset.path);
    const frontmatter = readAssetFrontmatter(root, vnextDir, asset, errors);
    if (!frontmatter) continue;

    const actualStatus = frontmatter.status;
    if (!SURFACE_STATUSES.has(asset.status)) errors.push(fail(root, filePath, '[C3] grade-status-enum', `manifest status "${asset.status}" 不在 draft/stable/deprecated`));
    if (!SURFACE_STATUSES.has(actualStatus)) errors.push(fail(root, filePath, '[C3] grade-status-enum', `frontmatter status "${actualStatus}" 不在 draft/stable/deprecated`));
    if (asset.status !== actualStatus) errors.push(fail(root, filePath, '[C3] grade-status-enum', `manifest status "${asset.status}" 与 frontmatter status "${actualStatus}" 不一致`));
    if (asset.asset_type === 'skill' && !SKILL_SURFACE_GRADES.has(frontmatter.grade)) errors.push(fail(root, filePath, '[C3] grade-status-enum', `frontmatter grade "${frontmatter.grade}" 不在 {P0, P1}`));
  }
  return errors;
}

function validateCanInvokeRefs(root, manifest) {
  const errors = [];
  const vnextDir = path.join(root, 'vnext');
  const skillNames = new Set(manifest.assets.filter((asset) => asset.asset_type === 'skill').map((asset) => asset.name));
  // Agent can_invoke is intentionally skipped: it may preserve P1+ contract anchors.
  for (const asset of manifest.assets.filter((item) => item.asset_type === 'skill')) {
    const filePath = path.join(vnextDir, asset.path);
    const frontmatter = readAssetFrontmatter(root, vnextDir, asset, errors);
    if (!frontmatter) continue;

    const invocations = Array.isArray(frontmatter['can-invoke']) ? frontmatter['can-invoke'] : [];
    for (const target of invocations) {
      if (target.includes('.')) continue;
      if (!skillNames.has(target)) errors.push(fail(root, filePath, '[C4] can-invoke-forward-ref', `skill "${asset.name}" can-invoke "${target}" 但 ${target} 不在 P0 manifest`));
    }
  }
  return errors;
}

function validateNoLocalPaths(root) {
  const errors = [];
  const vnextDir = path.join(root, 'vnext');
  const patterns = [/C:\\Users\\/, /C:\/Users\//, /\/Users\/[^/]+\//];
  for (const filePath of listMarkdownFiles(vnextDir)) {
    const rel = relativePath(root, filePath);
    const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
    lines.forEach((line, index) => {
      if (patterns.some((pattern) => pattern.test(line))) errors.push(`[FAIL] ${rel}:${index + 1}: [C5] local-path-scan - 本机绝对路径硬编码`);
    });
  }
  return errors;
}

function validateSurface(root) {
  const surfacePath = path.join(root, 'vnext', '_surface.md');
  if (!fs.existsSync(surfacePath)) return [`[FAIL] vnext/_surface.md: [C1] surface manifest - TD-15 manifest missing`];
  const parsed = parseSurfaceManifest(root, surfacePath);
  if (parsed.errors.length > 0) return parsed.errors;
  const checks = [validateExactFileList, validateGradeAllowlist, validateEnumValues, validateCanInvokeRefs, validateNoLocalPaths];
  for (const check of checks) {
    const errors = check(root, parsed.manifest);
    if (errors.length > 0) return errors;
  }
  return [];
}

function validateReferencesFrontmatter(root, filePath) {
  const errors = [];
  const frontmatter = parseFrontmatter(fs.readFileSync(filePath, 'utf8'));
  const valuesResult = parseFrontmatterValues(root, filePath);
  if (frontmatter.error) errors.push(fail(root, filePath, '[TD-16] references-frontmatter', frontmatter.error));
  if (valuesResult.error) errors.push(valuesResult.error);
  if (errors.length > 0) return errors;

  const type = valuesResult.values.type;
  const expectedFields = REFERENCE_FIELDS_BY_TYPE[type];
  if (!expectedFields) {
    errors.push(fail(root, filePath, '[TD-16] references-frontmatter', `unknown reference type "${type || 'missing'}"`));
    return errors;
  }

  for (const key of frontmatter.duplicates) {
    errors.push(fail(root, filePath, '[TD-16] references-frontmatter', `duplicate field "${key}"`));
  }
  const missing = expectedFields.filter((field) => !frontmatter.keys.includes(field));
  const extra = frontmatter.keys.filter((field) => !expectedFields.includes(field));
  if (missing.length > 0) errors.push(fail(root, filePath, '[TD-16] references-frontmatter', `missing fields: ${missing.join(', ')}`));
  if (extra.length > 0) errors.push(fail(root, filePath, '[TD-16] references-frontmatter', `extra fields: ${extra.join(', ')}`));
  if (valuesResult.values.status) {
    console.warn(`[WARN] ${relativePath(root, filePath)}: [TD-16] status "${valuesResult.values.status}" 使用 reference open namespace（type=${type}）`);
  }
  return errors;
}

function validateReferencesByType(root) {
  const referencesDir = path.join(root, 'vnext', 'references');
  if (!fs.existsSync(referencesDir)) return [];
  const errors = [];
  for (const filePath of listMarkdownFiles(referencesDir).filter((item) => path.dirname(item) === referencesDir)) {
    errors.push(...validateReferencesFrontmatter(root, filePath));
    if (errors.length > 0) return errors;
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

  if (errors.length === 0) {
    errors.push(...validateSurface(root));
  }

  if (errors.length === 0) {
    errors.push(...validateReferencesByType(root));
  }

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

module.exports = { validateVnext, validateSurface };
