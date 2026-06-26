#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const failures = [];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

const requiredFiles = [
  'references/skill-design/README.md',
  'references/skill-design/skill-design-playbook.zh.md',
  'templates/skill-hardening-brief/template.md',
  'evals/output-contract/skill-hardening-brief.schema.json',
  'evals/quality/skill-design-playbook.rubric.md',
];

for (const file of requiredFiles) {
  assert(fs.existsSync(path.join(root, file)), `缺少 skill design 文件: ${file}`);
}

if (failures.length === 0) {
  const playbook = read('references/skill-design/skill-design-playbook.zh.md');
  for (const term of [
    'Plan Goal Coach',
    '触发条件',
    '不触发条件',
    '模式判断',
    '模板分层',
    '反模式',
    '示例',
    '输出契约',
    'Handoff',
    'validator',
    'eval',
    '安装态',
    'Skill Hardening Brief',
    'Matt-Inspired Skill Engineering Discipline',
    'process_invariant',
    'no_op',
    'sediment',
    'sprawl',
    'context_load',
    'progressive_disclosure',
    'completion_criterion',
    'source_of_truth_boundary',
    'Temporary artifact policy',
  ]) {
    assert(playbook.includes(term), `Skill Design Playbook 缺少术语: ${term}`);
  }

  const template = read('templates/skill-hardening-brief/template.md');
  for (const field of [
    'artifact_type: skill_hardening_brief',
    'skill_name',
    'trigger_conditions',
    'non_trigger_conditions',
    'mode_decision',
    'resource_map',
    'output_contract',
    'validator_eval_plan',
    'installation_resources',
  ]) {
    assert(template.includes(field), `Skill Hardening Brief 模板缺少字段: ${field}`);
  }

  const schema = readJson('evals/output-contract/skill-hardening-brief.schema.json');
  assert(schema.artifact_type === 'skill_hardening_brief', 'skill-hardening schema artifact_type 必须是 skill_hardening_brief');
  assert(Array.isArray(schema.required), 'skill-hardening schema 必须包含 required 数组');
  if (Array.isArray(schema.required)) {
    for (const field of ['skill_name', 'trigger_conditions', 'non_trigger_conditions', 'mode_decision', 'output_contract', 'validator_eval_plan', 'installation_resources']) {
      assert(schema.required.includes(field), `skill-hardening schema required 缺少 ${field}`);
    }
  }
}

if (failures.length > 0) {
  console.error('Skill Design Playbook 验证失败:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Skill Design Playbook 验证通过。');
