#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const casesPath = path.join(root, 'evals', 'trigger', 'builder-description.cases.json');
const failures = [];

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

const skillRequiredTerms = {
  'builder-router': ['路由', '不知道下一步', '对应 builder skill', '不要用于'],
  'builder-plan-goal': ['Prompt', 'Plan', 'Goal', '/plan', '/goal', '不要用于'],
  'builder-frame': ['模糊想法', 'Feature Frame', 'spec readiness', '不要用于'],
  'builder-spec': ['可构建规格', 'Mini Spec', '验收标准', 'Design Brief', '不要用于'],
  'builder-prototype': ['prototype', 'wireframe', '交互状态', '原型证据', '不要用于'],
  'builder-agent-task': ['Agent Task Packet', '目标 runtime', '验证命令', 'forbidden actions', '不要用于'],
  'builder-review': ['review', 'audit', 'Evidence Packet', 'REQUEST_CHANGES', '不要用于'],
  'builder-decision': ['Decision Record', '被拒绝选项', '反转条件', '不要用于'],
};

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function extractFrontmatterDescription(skillName) {
  const relativePath = path.join('skills', skillName, 'SKILL.md');
  const content = read(relativePath);
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  assert(Boolean(frontmatterMatch), `${relativePath} 缺少 YAML frontmatter`);
  if (!frontmatterMatch) return '';

  const nameMatch = frontmatterMatch[1].match(/^name:\s*(.+)$/m);
  assert(nameMatch && nameMatch[1].trim() === skillName, `${relativePath} name 必须等于目录名`);

  const descriptionMatch = frontmatterMatch[1].match(/^description:\s*(.+)$/m);
  assert(Boolean(descriptionMatch), `${relativePath} 缺少 description`);
  if (!descriptionMatch) return '';

  return descriptionMatch[1].trim().replace(/^['"]|['"]$/g, '');
}

function containsAll(text, terms) {
  return terms.every((term) => text.includes(term));
}

function termList(terms) {
  return terms.join(', ');
}

const descriptions = Object.fromEntries(
  builderSkills.map((skillName) => [skillName, extractFrontmatterDescription(skillName)]),
);

for (const [skillName, description] of Object.entries(descriptions)) {
  assert(description.length > 80, `${skillName} description 过短，可能不足以承载触发边界`);
  assert(description.length <= 520, `${skillName} description 过长，当前 ${description.length} 字符，容易污染触发面`);
  assert(description.includes('适用于'), `${skillName} description 必须包含触发条件“适用于”`);
  assert(description.includes('不要用于'), `${skillName} description 必须包含不触发边界“不要用于”`);
  assert(!description.includes('->'), `${skillName} description 不应使用 ->，避免 frontmatter 兼容风险`);
  assert(!description.includes('<') && !description.includes('>'), `${skillName} description 不应使用尖括号`);
  assert(!description.includes('pm-'), `${skillName} description 不应引用 legacy pm-* active surface`);
  for (const term of skillRequiredTerms[skillName]) {
    assert(description.includes(term), `${skillName} description 缺少关键触发术语: ${term}`);
  }
}

const descriptionCases = JSON.parse(fs.readFileSync(casesPath, 'utf8'));
assert(descriptionCases.suite === 'builder-trigger-description', 'builder-description cases suite 必须是 builder-trigger-description');
assert(descriptionCases.status === 'm3.4', 'builder-description cases status 必须是 m3.4');
assert(Array.isArray(descriptionCases.cases), 'builder-description cases 必须包含 cases 数组');

if (Array.isArray(descriptionCases.cases)) {
  assert(descriptionCases.cases.length >= builderSkills.length * 2, '每个 builder skill 至少需要一个正向和一个边界用例');

  const coveredSkills = new Set();
  for (const testCase of descriptionCases.cases) {
    assert(testCase.id && typeof testCase.id === 'string', '每个 trigger description case 必须有 id');
    assert(builderSkills.includes(testCase.expected_skill), `${testCase.id} expected_skill 不合法: ${testCase.expected_skill}`);
    assert(Array.isArray(testCase.must_include_in_expected_description), `${testCase.id} 必须包含 must_include_in_expected_description`);
    assert(Array.isArray(testCase.confusing_skills), `${testCase.id} 必须包含 confusing_skills 数组`);

    const expectedDescription = descriptions[testCase.expected_skill] || '';
    const requiredTerms = testCase.must_include_in_expected_description || [];
    assert(
      containsAll(expectedDescription, requiredTerms),
      `${testCase.id} 的 expected skill ${testCase.expected_skill} description 缺少术语: ${termList(requiredTerms.filter((term) => !expectedDescription.includes(term)))}`,
    );
    coveredSkills.add(testCase.expected_skill);

    for (const confusing of testCase.confusing_skills || []) {
      assert(builderSkills.includes(confusing.skill), `${testCase.id} confusing skill 不合法: ${confusing.skill}`);
      assert(Array.isArray(confusing.boundary_terms), `${testCase.id}/${confusing.skill} 必须包含 boundary_terms`);
      const confusingDescription = descriptions[confusing.skill] || '';
      assert(
        containsAll(confusingDescription, confusing.boundary_terms || []),
        `${testCase.id} 的 confusing skill ${confusing.skill} description 缺少边界术语: ${termList((confusing.boundary_terms || []).filter((term) => !confusingDescription.includes(term)))}`,
      );
    }
  }

  for (const skillName of builderSkills) {
    assert(coveredSkills.has(skillName), `builder-description cases 缺少 expected_skill 覆盖: ${skillName}`);
  }
}

if (failures.length > 0) {
  console.error('Trigger description 验证失败:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Trigger description 验证通过。');
console.log(`已验证 ${builderSkills.length} 个 builder skill description 和 ${descriptionCases.cases.length} 个 trigger-description cases。`);
