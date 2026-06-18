#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const artifactEvalDir = path.join(root, 'evals', 'artifact');
const failures = [];

const requiredSuites = [
  'artifact-index-sync.cases.json',
  'artifact-cleanup-proposal.cases.json',
  'artifact-consistency-audit.cases.json',
];

const failClosedTerms = [
  'auto delete',
  'cannot auto delete',
  'delete automatically',
  'do_not_touch',
  'needs_human_decision',
  'human decision',
  'human review',
  'stop',
  'blocked',
  'failed',
  'do not assume safe',
  'proposal only',
  'safe_to_delete',
];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    failures.push(`${path.relative(root, filePath)} 不是合法 JSON: ${error.message}`);
    return null;
  }
}

function hasExpectedField(testCase) {
  return Object.keys(testCase).some((key) => key.startsWith('expected_'));
}

function hasFailClosedTerm(testCase) {
  const text = JSON.stringify(testCase).toLowerCase();
  return failClosedTerms.some((term) => text.includes(term.toLowerCase()));
}

function validateStringArray(value, label) {
  assert(Array.isArray(value), `${label} 必须是数组`);
  if (!Array.isArray(value)) return;
  assert(value.length > 0, `${label} 不能为空`);
  for (const item of value) {
    assert(typeof item === 'string' && item.trim().length > 0, `${label} 只能包含非空字符串`);
  }
}

assert(fs.existsSync(artifactEvalDir), '缺少 evals/artifact 目录');

const files = fs.existsSync(artifactEvalDir)
  ? fs.readdirSync(artifactEvalDir)
    .filter((entry) => entry.endsWith('.cases.json'))
    .sort()
  : [];

for (const fileName of requiredSuites) {
  assert(files.includes(fileName), `evals/artifact 缺少必需用例文件: ${fileName}`);
}

const seenCaseIds = new Set();
let totalCases = 0;

for (const fileName of files) {
  const relativePath = path.join('evals', 'artifact', fileName);
  const suite = readJson(path.join(root, relativePath));
  if (!suite) continue;

  assert(typeof suite.suite === 'string' && suite.suite.trim().length > 0, `${relativePath} 必须包含 suite`);
  assert(typeof suite.status === 'string' && suite.status.trim().length > 0, `${relativePath} 必须包含 status`);
  assert(typeof suite.purpose === 'string' && suite.purpose.trim().length > 0, `${relativePath} 必须包含 purpose`);
  assert(Array.isArray(suite.cases), `${relativePath} 必须包含 cases 数组`);
  if (!Array.isArray(suite.cases)) continue;
  assert(suite.cases.length > 0, `${relativePath} cases 不能为空`);

  for (const testCase of suite.cases) {
    totalCases += 1;
    const label = `${relativePath}/${testCase.id || '<missing-id>'}`;

    assert(typeof testCase.id === 'string' && testCase.id.trim().length > 0, `${label} 必须包含 id`);
    assert(typeof testCase.input === 'string' && testCase.input.trim().length > 0, `${label} 必须包含 input`);
    assert(hasExpectedField(testCase), `${label} 必须包含 expected_* 字段`);
    validateStringArray(testCase.must_include, `${label}.must_include`);
    validateStringArray(testCase.must_not_include, `${label}.must_not_include`);
    assert(hasFailClosedTerm(testCase), `${label} 缺少 fail-closed 关键词`);

    if (typeof testCase.id === 'string') {
      assert(!seenCaseIds.has(testCase.id), `artifact eval case id 重复: ${testCase.id}`);
      seenCaseIds.add(testCase.id);
    }
  }
}

assert(totalCases >= requiredSuites.length * 3, `artifact eval cases 数量过少，当前 ${totalCases}`);

if (failures.length > 0) {
  console.error('Artifact eval 验证失败:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Artifact eval 验证通过。');
console.log(`已验证 ${files.length} 个 artifact eval 文件和 ${totalCases} 个 cases。`);
