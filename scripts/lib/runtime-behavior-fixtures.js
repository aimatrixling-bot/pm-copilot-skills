const fs = require('fs');
const path = require('path');

const fixturePath = 'evals/runtime/direct-small-task-behavior.cases.json';
const requiredBlocks = ['理解', '下一步', '需要决定', '验收'];
const requiredDirectArtifacts = [
  'change_contract',
  'memory_update',
  'handoff_packet',
  'agent_task_packet',
  'review_packet',
  'module_execution_pack',
  'branch_state',
];
const requiredHiddenTerms = [
  'Change Contract',
  'Memory',
  'Packet',
  'delivery_decision',
  'task_complexity',
  'contract_profile',
  'usage_metrics',
  'memory_or_evidence_references',
  'Agent Task Packet',
  'Review Packet',
  'Module Execution Pack',
  'Branch State',
];

function assertInto(failures, condition, message) {
  if (!condition) failures.push(message);
}

function readJson(root, relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

function visibleResponseText(testCase) {
  return requiredBlocks
    .map((block) => testCase.expected_visible_response_blocks?.[block] || '')
    .join('\n');
}

function includesCaseInsensitive(text, term) {
  return text.toLowerCase().includes(term.toLowerCase());
}

function validateRuntimeBehaviorFixtures(options) {
  const {
    root,
    failures,
    routerSkillFiles,
    label = 'runtime behavior fixture',
  } = options;
  const suite = readJson(root, fixturePath);

  assertInto(failures, suite.suite === 'direct-small-task-runtime-behavior', `${label}: suite 必须是 direct-small-task-runtime-behavior`);
  assertInto(failures, suite.status === 'm2-installed-runtime-fixture', `${label}: status 必须是 m2-installed-runtime-fixture`);
  assertInto(failures, Array.isArray(suite.visible_response_blocks), `${label}: 必须声明 visible_response_blocks`);
  if (Array.isArray(suite.visible_response_blocks)) {
    for (const block of requiredBlocks) {
      assertInto(failures, suite.visible_response_blocks.includes(block), `${label}: visible_response_blocks 缺少 ${block}`);
    }
    assertInto(failures, suite.visible_response_blocks.length === requiredBlocks.length, `${label}: visible_response_blocks 不应新增默认块`);
  }

  const installedSurface = suite.installed_surface_contract || {};
  assertInto(failures, Array.isArray(installedSurface.required_router_terms), `${label}: 必须声明 installed_surface_contract.required_router_terms`);
  assertInto(failures, Array.isArray(installedSurface.forbidden_legacy_router_terms), `${label}: 必须声明 installed_surface_contract.forbidden_legacy_router_terms`);
  assertInto(failures, Array.isArray(installedSurface.runtime_targets), `${label}: 必须声明 installed_surface_contract.runtime_targets`);

  if (Array.isArray(installedSurface.runtime_targets)) {
    for (const targetName of ['source', 'codex-user-install', 'codex-export', 'claude-code-export', 'generic-agent-export']) {
      assertInto(failures, installedSurface.runtime_targets.includes(targetName), `${label}: runtime_targets 缺少 ${targetName}`);
    }
  }

  for (const routerSkillFile of routerSkillFiles || []) {
    const fileLabel = routerSkillFile.label || routerSkillFile.path;
    assertInto(failures, fs.existsSync(routerSkillFile.path), `${label}: ${fileLabel} 缺少 builder-router/SKILL.md`);
    if (!fs.existsSync(routerSkillFile.path)) continue;

    const content = fs.readFileSync(routerSkillFile.path, 'utf8');
    for (const term of installedSurface.required_router_terms || []) {
      assertInto(failures, content.includes(term), `${label}: ${fileLabel} 缺少 Direct 轻量行为规则: ${term}`);
    }
    for (const term of installedSurface.forbidden_legacy_router_terms || []) {
      assertInto(failures, !content.includes(term), `${label}: ${fileLabel} 仍包含旧的前台字段展示规则: ${term}`);
    }
  }

  assertInto(failures, Array.isArray(suite.cases), `${label}: 必须包含 cases 数组`);
  if (!Array.isArray(suite.cases)) return;
  assertInto(failures, suite.cases.length >= 2, `${label}: Direct 小任务 fixture 至少需要 2 个 cases`);

  for (const testCase of suite.cases) {
    const caseLabel = `${label}/${testCase.id || '<missing-id>'}`;
    assertInto(failures, typeof testCase.id === 'string' && testCase.id.trim().length > 0, `${caseLabel}: 必须包含 id`);
    assertInto(failures, testCase.runtime_tier === 'direct', `${caseLabel}: runtime_tier 必须是 direct`);
    assertInto(failures, typeof testCase.input === 'string' && testCase.input.trim().length > 0, `${caseLabel}: 必须包含 input`);
    assertInto(failures, testCase.expected_trace && typeof testCase.expected_trace === 'object', `${caseLabel}: 必须包含 expected_trace`);
    if (testCase.expected_trace && typeof testCase.expected_trace === 'object') {
      assertInto(failures, testCase.expected_trace.task_complexity === 'micro', `${caseLabel}: direct 小任务必须默认 task_complexity=micro`);
      assertInto(failures, testCase.expected_trace.response_profile === 'terse', `${caseLabel}: direct 小任务必须默认 response_profile=terse`);
      assertInto(failures, testCase.expected_trace.contract_profile === 'none', `${caseLabel}: direct 小任务必须默认 contract_profile=none`);
      assertInto(failures, testCase.expected_trace.context_strategy === 'direct_answer', `${caseLabel}: direct 小任务必须默认 context_strategy=direct_answer`);
    }

    assertInto(failures, testCase.expected_visible_response_blocks && typeof testCase.expected_visible_response_blocks === 'object', `${caseLabel}: 必须包含 expected_visible_response_blocks`);
    if (testCase.expected_visible_response_blocks && typeof testCase.expected_visible_response_blocks === 'object') {
      const blockKeys = Object.keys(testCase.expected_visible_response_blocks);
      for (const block of requiredBlocks) {
        assertInto(failures, blockKeys.includes(block), `${caseLabel}: expected_visible_response_blocks 缺少 ${block}`);
        assertInto(
          failures,
          typeof testCase.expected_visible_response_blocks[block] === 'string' && testCase.expected_visible_response_blocks[block].trim().length > 0,
          `${caseLabel}: ${block} 不能为空`,
        );
      }
      assertInto(failures, blockKeys.length === requiredBlocks.length, `${caseLabel}: expected_visible_response_blocks 不应新增默认块`);
    }

    assertInto(failures, Array.isArray(testCase.must_not_generate_artifacts), `${caseLabel}: 必须声明 must_not_generate_artifacts`);
    if (Array.isArray(testCase.must_not_generate_artifacts)) {
      for (const artifact of requiredDirectArtifacts) {
        assertInto(failures, testCase.must_not_generate_artifacts.includes(artifact), `${caseLabel}: must_not_generate_artifacts 缺少 ${artifact}`);
      }
    }

    assertInto(failures, Array.isArray(testCase.must_not_visible_terms), `${caseLabel}: 必须声明 must_not_visible_terms`);
    if (Array.isArray(testCase.must_not_visible_terms)) {
      for (const term of requiredHiddenTerms) {
        assertInto(failures, testCase.must_not_visible_terms.includes(term), `${caseLabel}: must_not_visible_terms 缺少 ${term}`);
      }
    }

    const visibleText = visibleResponseText(testCase);
    for (const term of testCase.must_not_visible_terms || []) {
      assertInto(failures, !includesCaseInsensitive(visibleText, term), `${caseLabel}: visible response 不应包含 ${term}`);
    }
  }
}

module.exports = {
  fixturePath,
  validateRuntimeBehaviorFixtures,
};
