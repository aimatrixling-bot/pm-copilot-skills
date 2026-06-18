#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const onboardingEvalPath = path.join(root, 'evals', 'onboarding', 'project-onboarding.cases.json');
const failures = [];

const requiredProjectModes = [
  'greenfield',
  'brownfield',
  'resume',
  'unknown',
  'not_applicable',
];

const forbiddenAutomationTerms = [
  'auto scan',
  'automatically',
  'created .ai-builder',
  'reinitialize .ai-builder',
  'overwrite artifact-index.yaml',
  'delete',
  'move files',
  'rename',
  'migration completed',
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

function validateStringArray(value, label) {
  assert(Array.isArray(value), `${label} 必须是数组`);
  if (!Array.isArray(value)) return;
  assert(value.length > 0, `${label} 不能为空`);
  for (const item of value) {
    assert(typeof item === 'string' && item.trim().length > 0, `${label} 只能包含非空字符串`);
  }
}

function hasForbiddenAutomationGuard(testCase) {
  const text = JSON.stringify(testCase.must_not_include || []).toLowerCase();
  return forbiddenAutomationTerms.some((term) => text.includes(term));
}

assert(fs.existsSync(onboardingEvalPath), '缺少 evals/onboarding/project-onboarding.cases.json');

const suite = fs.existsSync(onboardingEvalPath) ? readJson(onboardingEvalPath) : null;
if (suite) {
  assert(suite.suite === 'project-onboarding', 'project onboarding eval suite 必须是 project-onboarding');
  assert(typeof suite.status === 'string' && suite.status.trim().length > 0, 'project onboarding eval 必须包含 status');
  assert(typeof suite.purpose === 'string' && suite.purpose.trim().length > 0, 'project onboarding eval 必须包含 purpose');
  assert(Array.isArray(suite.cases), 'project onboarding eval 必须包含 cases 数组');

  if (Array.isArray(suite.cases)) {
    assert(suite.cases.length >= requiredProjectModes.length, `project onboarding eval cases 数量过少，当前 ${suite.cases.length}`);

    const seenCaseIds = new Set();
    for (const mode of requiredProjectModes) {
      assert(
        suite.cases.some((item) => item.expected_project_mode === mode),
        `project onboarding eval 缺少 ${mode} 覆盖用例`
      );
    }

    for (const testCase of suite.cases) {
      const label = `project-onboarding/${testCase.id || '<missing-id>'}`;

      assert(typeof testCase.id === 'string' && testCase.id.trim().length > 0, `${label} 必须包含 id`);
      assert(typeof testCase.input === 'string' && testCase.input.trim().length > 0, `${label} 必须包含 input`);
      assert(requiredProjectModes.includes(testCase.expected_project_mode), `${label} expected_project_mode 不合法`);
      assert(typeof testCase.expected_route_type === 'string' && testCase.expected_route_type.trim().length > 0, `${label} 必须包含 expected_route_type`);
      assert(typeof testCase.expected_recommended_next_skill === 'string' && testCase.expected_recommended_next_skill.trim().length > 0, `${label} 必须包含 expected_recommended_next_skill`);
      validateStringArray(testCase.must_include, `${label}.must_include`);
      validateStringArray(testCase.must_not_include, `${label}.must_not_include`);

      if (Array.isArray(testCase.must_include)) {
        assert(testCase.must_include.includes('project_mode'), `${label}.must_include 必须包含 project_mode`);
        assert(testCase.must_include.includes('project_profile_proposal'), `${label}.must_include 必须包含 project_profile_proposal`);
      }

      assert(hasForbiddenAutomationGuard(testCase), `${label} 必须包含自动扫描/写入/迁移/删除的禁止项`);

      if (typeof testCase.id === 'string') {
        assert(!seenCaseIds.has(testCase.id), `project onboarding eval case id 重复: ${testCase.id}`);
        seenCaseIds.add(testCase.id);
      }
    }
  }
}

if (failures.length > 0) {
  console.error('Project onboarding eval 验证失败:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Project onboarding eval 验证通过。');
console.log(`已验证 ${suite.cases.length} 个 onboarding cases，覆盖 ${requiredProjectModes.length} 个 project modes。`);
