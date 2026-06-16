#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

const requiredFiles = [
  'README.md',
  'sync-and-publish.sh',
  'scripts/validate-codex-install.js',
  'skills/skill-template.md',
  'skills/references/quality-gates-shared.md',
  'skills/references/builder-os/blueprint.md',
  'evals/builder-os-trigger-evals.json',
];

const skillExpectations = {
  'skills/pm-feature-frame/SKILL.md': [
    'Goal Suitability',
    'builder_readiness',
    'goal_suitability',
  ],
  'skills/pm-prd/SKILL.md': [
    'Sensor Gates',
    'acceptance_evidence_plan',
    'builder_handoff',
  ],
  'skills/pm-prototype/SKILL.md': [
    'Evidence Packet',
    'Sensor Gates',
    'Fake UI',
    'evidence_packet',
  ],
  'skills/pm-code-architect/SKILL.md': [
    'Verification Strategy',
    'Sensor Gates',
    'verification_strategy',
    'sensor_gates',
  ],
  'skills/pm-code-implement/SKILL.md': [
    'Evidence Packet',
    'Sensor Gates',
    'Completion claim',
    'evidence_packet',
  ],
  'skills/pm-code-review/SKILL.md': [
    'Evidence Review',
    'Sensor Gates',
    'evidence_review',
  ],
  'skills/pm-launch/SKILL.md': [
    'Release Evidence Packet',
    'Sensor Gates',
    'Output Packet',
    'release_evidence_packet',
  ],
};

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function assert(condition, message, failures) {
  if (!condition) failures.push(message);
}

const failures = [];

for (const relativePath of requiredFiles) {
  assert(fs.existsSync(path.join(root, relativePath)), `缺少必需文件: ${relativePath}`, failures);
}

for (const [relativePath, expectedTerms] of Object.entries(skillExpectations)) {
  const fullPath = path.join(root, relativePath);
  assert(fs.existsSync(fullPath), `缺少 skill 文件: ${relativePath}`, failures);
  if (!fs.existsSync(fullPath)) continue;

  const content = read(relativePath);
  for (const term of expectedTerms) {
    assert(content.includes(term), `${relativePath} 缺少 Builder OS 术语: ${term}`, failures);
  }
}

const syncScript = read('sync-and-publish.sh');
const installScript = read('install.js');
assert(syncScript.includes('canonical source'), 'sync-and-publish.sh 必须声明 canonical source 发布边界', failures);
assert(!syncScript.includes('sync: v$NEW_VERSION'), 'sync-and-publish.sh 不得使用旧的 agent sync commit message', failures);
assert(!/^AGENT_SKILLS_DIR=/m.test(syncScript), 'sync-and-publish.sh 不得把 agent 目录定义为上游源', failures);
assert(installScript.includes('codex-global'), 'install.js 必须支持 Codex 全局安装模式', failures);
assert(installScript.includes('--overwrite'), 'install.js 必须提供显式覆盖外部 skill 的开关', failures);

const readme = read('README.md');
const qualityGates = read('skills/references/quality-gates-shared.md');
const builderBlueprint = read('skills/references/builder-os/blueprint.md');
assert(readme.includes('默认输出语言'), 'README 必须在入口位置声明默认输出语言', failures);
assert(readme.includes('中文优先输出'), 'README 必须说明中文优先输出原则', failures);
assert(readme.includes('npx pm-copilot-skills codex'), 'README 必须说明 Codex 安装方式', failures);
assert(readme.includes('npm run validate:codex-install'), 'README 必须说明 Codex 安装验证方式', failures);
assert(!readme.includes('An **AI Product Builder OS**'), 'README 入口描述不得退回英文主叙事', failures);
assert(qualityGates.includes('默认语言协议'), 'quality gates 必须定义中文优先语言协议', failures);
assert(builderBlueprint.includes('默认语言'), 'Builder OS blueprint 必须定义中文优先原则', failures);

const evalSet = JSON.parse(read('evals/builder-os-trigger-evals.json'));
assert(evalSet.skill_name === 'builder-os', 'eval set 的 skill_name 必须是 builder-os', failures);
assert(Array.isArray(evalSet.evals), 'eval set 必须包含 evals 数组', failures);
if (Array.isArray(evalSet.evals)) {
  const positives = evalSet.evals.filter(item => item.should_trigger === true).length;
  const negatives = evalSet.evals.filter(item => item.should_trigger === false).length;
  assert(positives >= 6, 'eval set 至少需要 6 个 should-trigger 用例', failures);
  assert(negatives >= 4, 'eval set 至少需要 4 个 should-not-trigger 用例', failures);
}

if (failures.length > 0) {
  console.error('Builder OS 验证失败:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Builder OS 验证通过。');
console.log(`已检查 ${Object.keys(skillExpectations).length} 个核心 skill 和 ${requiredFiles.length} 个必需文件。`);
