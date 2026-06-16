#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const base = 'evals/doctor-preference-e2e';

const requiredFiles = [
  `${base}/README.md`,
  `${base}/evals.json`,
  `${base}/benchmark.md`,
  `${base}/benchmark.json`,
  `${base}/outputs/01-feature-frame.md`,
  `${base}/outputs/02-prd-handoff.md`,
  `${base}/outputs/03-prototype-evidence.md`,
  `${base}/outputs/04-architecture.md`,
  `${base}/outputs/05-implementation-evidence.md`,
  `${base}/outputs/06-code-review-evidence.md`,
  `${base}/outputs/07-launch-gate.md`,
  `${base}/artifacts/prototype/doctor-preference-prototype.html`,
  `${base}/reference-implementation/doctorRecommendationEngine.js`,
  `${base}/reference-implementation/doctorRecommendationEngine.test.js`,
];

const contentExpectations = {
  [`${base}/outputs/01-feature-frame.md`]: ['builder_readiness', 'goal_suitability', 'Output Packet'],
  [`${base}/outputs/02-prd-handoff.md`]: ['acceptance_evidence_plan', 'builder_handoff', 'Sensor Gates'],
  [`${base}/outputs/03-prototype-evidence.md`]: ['Evidence Packet', 'Fake UI', 'Interaction smoke'],
  [`${base}/outputs/04-architecture.md`]: ['Verification Strategy', 'RecommendationDecision', 'Sensor Gates'],
  [`${base}/outputs/05-implementation-evidence.md`]: ['Evidence Packet', 'Completion claim', 'npm run test:doctor-preference-e2e'],
  [`${base}/outputs/06-code-review-evidence.md`]: ['Evidence Review', 'APPROVE FOR EVAL', 'NOT PRODUCTION'],
  [`${base}/outputs/07-launch-gate.md`]: ['Release Evidence Packet', 'GO-WITH-RISKS', '生产为 NO-GO'],
  [`${base}/benchmark.md`]: ['Run Summary', 'Test Coverage', 'Regression Signal'],
  [`${base}/artifacts/prototype/doctor-preference-prototype.html`]: ['recommendDoctor', 'addEventListener', 'auditPreview'],
  [`${base}/reference-implementation/doctorRecommendationEngine.js`]: ['recommendDoctors', 'evaluateDoctor', 'auditPreview'],
  [`${base}/reference-implementation/doctorRecommendationEngine.test.js`]: ['node:test', 'Dr Sin', '配额已满'],
};

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function assert(condition, message, failures) {
  if (!condition) failures.push(message);
}

const failures = [];

for (const file of requiredFiles) {
  assert(fs.existsSync(path.join(root, file)), `缺少必需 E2E 文件: ${file}`, failures);
}

for (const [file, terms] of Object.entries(contentExpectations)) {
  if (!fs.existsSync(path.join(root, file))) continue;
  const content = read(file);
  for (const term of terms) {
    assert(content.includes(term), `${file} 缺少必需术语: ${term}`, failures);
  }
}

const evals = JSON.parse(read(`${base}/evals.json`));
const benchmark = JSON.parse(read(`${base}/benchmark.json`));
assert(evals.skill_name === 'builder-os-doctor-preference-e2e', 'evals.json 的 skill_name 不匹配', failures);
assert(Array.isArray(evals.evals) && evals.evals.length >= 6, 'evals.json 至少需要 6 个 E2E eval', failures);
assert(benchmark.summary.production_readiness === 'NO-GO', 'benchmark 必须保留 production NO-GO 状态', failures);
assert(benchmark.test_results.passed === benchmark.test_results.total, 'benchmark 测试结果必须全部通过', failures);

if (Array.isArray(evals.evals)) {
  for (const evalCase of evals.evals) {
    assert(Array.isArray(evalCase.assertions) && evalCase.assertions.length >= 3, `Eval ${evalCase.name} 至少需要 3 条 assertions`, failures);
  }
}

if (failures.length > 0) {
  console.error('医生个性化推荐 E2E 验证失败:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('医生个性化推荐 E2E 验证通过。');
console.log(`已检查 ${requiredFiles.length} 个文件和 ${evals.evals.length} 个 eval case。`);
