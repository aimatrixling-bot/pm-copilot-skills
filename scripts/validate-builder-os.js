#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');

const requiredFiles = [
  'README.md',
  'skill-pack.json',
  'agents/openai.yaml',
  'docs/architecture.md',
  'docs/release-seal-m2.3.md',
  'docs/release-seal-m2.5.md',
  'docs/release-seal-m3.2.md',
  'docs/release-seal-m3.3.md',
  'docs/release-seal-m3.4.md',
  'docs/release-seal-m3.5.md',
  'docs/release-seal-m3.7.md',
  'docs/release-seal-m3.8.md',
  'docs/release-seal-m3.8.1.md',
  'docs/release-note-milestone-5-project-onboarding.md',
  'docs/release-runbook-m3.9.md',
  'docs/release-seal-m3.9.md',
  'docs/release-plan-1.0.md',
  'docs/grill-loop-builder-frame-hardening-brief.md',
  'docs/prototype-quality-product-logic-containment-hardening-brief.md',
  'kernel/README.md',
  'kernel/packets/intent-packet.schema.md',
  'kernel/packets/output-packet.schema.md',
  'kernel/packets/evidence-packet.schema.md',
  'kernel/packets/agent-task-packet.schema.md',
  'kernel/packets/decision-record.schema.md',
  'kernel/gates/builder-quality-gates.zh.md',
  'kernel/protocols/evidence-policy.zh.md',
  'harness/README.md',
  'harness/artifact-write-policy.zh.md',
  'harness/project-onboarding-policy.zh.md',
  'harness/project-greenfield-bootstrap-policy.zh.md',
  'harness/project-brownfield-intake-policy.zh.md',
  'harness/run-report.schema.md',
  'memory/README.md',
  'memory/schemas/artifact-index.schema.md',
  'memory/schemas/project-profile.schema.md',
  'memory/policies/artifact-lifecycle-policy.zh.md',
  'memory/policies/artifact-cleanup-policy.zh.md',
  'memory/policies/artifact-consistency-policy.zh.md',
  'loops/README.md',
  'loops/recipes/artifact-hygiene.loop.md',
  'loops/recipes/grill-decision.loop.md',
  'loops/recipes/design-plan-to-prototype.loop.md',
  'bundles/core/manifest.json',
  'bundles/core/skills.list',
  'adapters/codex/README.md',
  'adapters/codex/adapter.json',
  'adapters/claude-code/README.md',
  'adapters/claude-code/adapter.json',
  'adapters/generic-agent/README.md',
  'adapters/generic-agent/adapter.json',
  'sync-and-publish.sh',
  'scripts/validate-codex-install.js',
  'scripts/validate-package-surface.js',
  'scripts/export-ai-builder-os.js',
  'scripts/validate-runtime-adapters.js',
  'scripts/validate-trigger-descriptions.js',
  'scripts/validate-artifact-evals.js',
  'scripts/validate-onboarding-evals.js',
  'scripts/validate-dual-package-dry-run.js',
  'scripts/prepare-dual-package-publish.js',
  'skills/skill-template.md',
  '_archived/pm-copilot-legacy-v1.0/README.md',
  '_archived/pm-copilot-legacy-v1.0/skills/references/quality-gates-shared.md',
  '_archived/pm-copilot-legacy-v1.0/skills/references/builder-os/blueprint.md',
  'references/legacy-pm-methods/README.md',
  'docs/release-seal-m3.1.md',
  'evals/builder-os-trigger-evals.json',
  'evals/trigger/builder-description.cases.json',
  'evals/trigger/builder-core.cases.json',
  'evals/routing/builder-routing.cases.json',
  'evals/onboarding/project-onboarding.cases.json',
  'evals/artifact/artifact-index-sync.cases.json',
  'evals/artifact/artifact-cleanup-proposal.cases.json',
  'evals/artifact/artifact-consistency-audit.cases.json',
  'evals/output-contract/agent-task-packet.schema.json',
  'evals/output-contract/builder-router.schema.json',
  'evals/output-contract/builder-plan-goal.schema.json',
  'evals/output-contract/feature-frame.schema.json',
  'evals/output-contract/builder-spec.schema.json',
  'evals/output-contract/builder-prototype.schema.json',
  'evals/output-contract/builder-review.schema.json',
  'evals/output-contract/decision-record.schema.json',
  'evals/output-contract/design-brief.schema.json',
  'evals/output-contract/skill-hardening-brief.schema.json',
  'evals/quality/skill-design-playbook.rubric.md',
  'references/skill-design/README.md',
  'references/skill-design/skill-design-playbook.zh.md',
  'references/ui-ux/README.md',
  'references/ui-ux/design-principles.zh.md',
  'references/ui-ux/component-guidelines.zh.md',
  'references/ui-ux/interaction-patterns.zh.md',
  'references/ui-ux/visual-style.zh.md',
  'templates/skill-hardening-brief/template.md',
  'templates/agent-task-packet/template.md',
  'templates/decision-record/template.md',
  'templates/prototype-brief/template.md',
  'templates/review-report/template.md',
  'templates/design-brief/template.md',
  'kernel/gates/design-consistency-gate.zh.md',
  'kernel/gates/product-logic-containment-gate.zh.md',
  'scripts/validate-skill-design-playbook.js',
  'skills/builder-plan-goal/references/decision-rules.zh.md',
  'skills/builder-plan-goal/references/plan-template.zh.md',
  'skills/builder-plan-goal/references/goal-template.zh.md',
  'skills/builder-plan-goal/references/anti-patterns.zh.md',
  'skills/builder-plan-goal/references/examples.zh.md',
  'skills/builder-plan-goal/assets/output-format.zh.md',
  'skills/builder-frame/templates/feature-frame.template.md',
  'skills/builder-frame/references/frame-rules.zh.md',
  'skills/builder-frame/references/migration-notes.md',
  'skills/builder-spec/templates/builder-spec.template.md',
  'skills/builder-spec/references/spec-rules.zh.md',
  'skills/builder-spec/references/acceptance-criteria.zh.md',
  'skills/builder-spec/references/prototype-to-spec.zh.md',
  'skills/builder-spec/references/examples-prototype-to-spec.zh.md',
  'skills/builder-spec/references/migration-notes.md',
  'skills/builder-prototype/references/prototype-path-rules.zh.md',
  'skills/builder-prototype/references/examples.zh.md',
  'skills/builder-review/references/prototype-to-spec-review.zh.md',
  'evals/prototype-to-spec/README.md',
  'evals/prototype-to-spec/prototype-to-spec.cases.json',
  'evals/prototype-to-spec/review-checklist.md',
  'evals/prototype-to-spec/fixtures/visit-checkin.prototype-brief.md',
  'evals/prototype-to-spec/fixtures/surgery-dimsum.prototype-brief.md',
  'evals/prototype-to-spec/expected/visit-checkin.prototype-to-spec.md',
  'evals/prototype-to-spec/expected/surgery-dimsum.prototype-to-spec.md',
  'evals/prototype-to-spec/manual-review-results.md',
];

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

const legacyArchivedSkills = [
  'pm-agent-patterns',
  'pm-ai-patterns',
  'pm-code-architect',
  'pm-code-implement',
  'pm-code-review',
  'pm-comp',
  'pm-content-general',
  'pm-decision',
  'pm-deconstruct',
  'pm-discovery',
  'pm-feature-frame',
  'pm-job-search',
  'pm-launch',
  'pm-prd',
  'pm-prioritize',
  'pm-prototype',
];

const legacyArchivedUtilities = [
  'download-anything',
  'pdf',
  'pptx',
  'references',
];

const legacyArchiveExpectations = {
  '_archived/pm-copilot-legacy-v1.0/skills/pm-feature-frame/SKILL.md': [
    'Goal Suitability',
    'builder_readiness',
    'goal_suitability',
  ],
  '_archived/pm-copilot-legacy-v1.0/skills/pm-prd/SKILL.md': [
    'Sensor Gates',
    'acceptance_evidence_plan',
    'builder_handoff',
  ],
  '_archived/pm-copilot-legacy-v1.0/skills/pm-prototype/SKILL.md': [
    'Evidence Packet',
    'Sensor Gates',
    'Fake UI',
    'evidence_packet',
  ],
  '_archived/pm-copilot-legacy-v1.0/skills/pm-code-architect/SKILL.md': [
    'Verification Strategy',
    'Sensor Gates',
    'verification_strategy',
    'sensor_gates',
  ],
  '_archived/pm-copilot-legacy-v1.0/skills/pm-code-implement/SKILL.md': [
    'Evidence Packet',
    'Sensor Gates',
    'Completion claim',
    'evidence_packet',
  ],
  '_archived/pm-copilot-legacy-v1.0/skills/pm-code-review/SKILL.md': [
    'Evidence Review',
    'Sensor Gates',
    'evidence_review',
  ],
  '_archived/pm-copilot-legacy-v1.0/skills/pm-launch/SKILL.md': [
    'Release Evidence Packet',
    'Sensor Gates',
    'Output Packet',
    'release_evidence_packet',
  ],
};

const builderCoreExpectations = {
  'skills/builder-router/SKILL.md': [
    '## 资源读取',
    '## 模式判断',
    'route_type',
    'answer',
    'prompt',
    'plan_to_goal',
    'skill_route',
    'ask_first',
    'handoff_packet',
    'project_mode',
    'project_profile_proposal',
    'recommended_next_skill',
    'greenfield',
    'brownfield',
    'resume',
    'unknown',
    'not_applicable',
    'harness/project-onboarding-policy.zh.md',
    'memory/schemas/project-profile.schema.md',
    'kernel/routing/skill-selection-rules.zh.md',
    'loops/recipes/grill-decision.loop.md',
    'evals/output-contract/builder-router.schema.json',
    'evals/onboarding/project-onboarding.cases.json',
    'references/skill-design/skill-design-playbook.zh.md',
  ],
  'skills/builder-plan-goal/SKILL.md': [
    '## 技能定位',
    '## 资源读取',
    '显式触发',
    '隐式触发',
    'Prompt / Plan / Goal / Plan -> Goal',
    'Ask First',
    'references/decision-rules.zh.md',
    'references/plan-template.zh.md',
    'references/goal-template.zh.md',
    'references/anti-patterns.zh.md',
    'references/examples.zh.md',
    'references/skill-design/skill-design-playbook.zh.md',
    'templates/skill-hardening-brief/template.md',
    'assets/output-format.zh.md',
    'mode_recommendation',
    'copy_ready_plan_prompt',
    'copy_ready_goal_prompt',
    'stop_conditions',
    'Skill hardening',
    'validator/eval',
    'builder-frame',
    'builder-spec',
    'builder-prototype',
    'builder-agent-task',
    'builder-review',
  ],
  'skills/builder-frame/SKILL.md': [
    '## 资源读取',
    '## 模式判断',
    'templates/feature-frame.template.md',
    'references/frame-rules.zh.md',
    'references/migration-notes.md',
    'idea_frame',
    'problem_frame',
    'opportunity_frame',
    'grill_frame',
    'not_ready_for_spec',
    'loops/recipes/grill-decision.loop.md',
    'shared_understanding',
    'decision_tree',
    'critical_questions',
    'recommended_defaults',
    'problem',
    'user',
    'scenario',
    'desired_outcome',
    'magic_moment',
    'non_goals',
    'success_criteria',
    'human_decision_points',
    'stable_terms',
    'frame_confidence',
    'blocking_questions',
    'evidence_needed',
    'spec_readiness',
    'next_skill_input',
    'references/skill-design/skill-design-playbook.zh.md',
  ],
  'skills/builder-spec/SKILL.md': [
    '## 资源读取',
    '## 模式判断',
    'templates/builder-spec.template.md',
    'templates/design-brief/template.md',
    'kernel/gates/design-consistency-gate.zh.md',
    'kernel/gates/product-logic-containment-gate.zh.md',
    'references/ui-ux/design-principles.zh.md',
    'references/spec-rules.zh.md',
    'references/acceptance-criteria.zh.md',
    'references/prototype-to-spec.zh.md',
    'references/examples-prototype-to-spec.zh.md',
    'references/migration-notes.md',
    'loops/recipes/grill-decision.loop.md',
    'mini_spec',
    'prd',
    'engineering_request',
    'agent_readable_spec',
    'prototype_to_spec',
    'not_ready_for_spec',
    'readiness_gate',
    'reroute_recommendation',
    'source_prototype',
    'extracted_from_prototype',
    'prototype_gaps',
    'prototype_verification',
    'scope',
    'requirements',
    'flows',
    'states',
    'edge_cases',
    'acceptance_criteria',
    'verification_plan',
    'next_skill_input',
    'design_brief',
    'ui_states',
    'interaction_requirements',
    'responsive_requirements',
    'accessibility_notes',
    'ui_content_boundary',
    'business_rule_notes',
    'rule_notes_placement',
    'non_ui_explanations',
    'references/skill-design/skill-design-playbook.zh.md',
  ],
  'skills/builder-prototype/SKILL.md': [
    '## 资源读取',
    '## 三路径模式',
    'templates/prototype-brief/template.md',
    'templates/design-brief/template.md',
    'skills/builder-prototype/references/prototype-path-rules.zh.md',
    'skills/builder-prototype/references/examples.zh.md',
    'kernel/gates/fake-ui-gate.zh.md',
    'kernel/gates/design-consistency-gate.zh.md',
    'kernel/gates/product-logic-containment-gate.zh.md',
    'loops/recipes/design-plan-to-prototype.loop.md',
    'prototype_first',
    'boundary_first',
    'spec_first',
    'degraded_prototype',
    'wireframe',
    'prototype_brief',
    'prototype_mode',
    'artifact_path',
    'fidelity',
    'covered_flows',
    'states_covered',
    'runnable_prototype',
    'gaps',
    'verification',
    'next',
    'evals/output-contract/builder-prototype.schema.json',
    'references/skill-design/skill-design-playbook.zh.md',
  ],
  'skills/builder-agent-task/SKILL.md': [
    '## 资源读取',
    '## 模式判断',
    'templates/agent-task-packet/template.md',
    'kernel/packets/agent-task-packet.schema.md',
    'kernel/packets/output-packet.schema.md',
    'harness/artifact-write-policy.zh.md',
    'memory/schemas/artifact-index.schema.md',
    'kernel/routing/plan-goal-routing.zh.md',
    'loops/recipes/grill-decision.loop.md',
    'loops/recipes/design-plan-to-prototype.loop.md',
    'kernel/gates/product-logic-containment-gate.zh.md',
    'prompt',
    'plan',
    'goal',
    'plan_to_goal',
    'ask_first',
    'not_ready_for_agent_task',
    'readiness_gate',
    'reroute_recommendation',
    'runtime_constraints',
    'forbidden_actions',
    'human_approval_gates',
    'blocked_stop_condition',
    'next_skill_input',
    'artifact_index_update_proposal',
    'design_plan',
    'ui_content_boundary',
    'business_rule_notes',
    'rule_notes_placement',
    'prototype_evidence_requirements',
    'product_logic_containment_gate',
    'handoff_packet',
    'evals/output-contract/agent-task-packet.schema.json',
    'references/skill-design/skill-design-playbook.zh.md',
  ],
  'skills/builder-review/SKILL.md': [
    '## 资源读取',
    '## 模式判断',
    'templates/review-report/template.md',
    'kernel/gates/builder-quality-gates.zh.md',
    'kernel/gates/fake-ui-gate.zh.md',
    'kernel/gates/fake-test-gate.zh.md',
    'kernel/gates/design-consistency-gate.zh.md',
    'kernel/gates/product-logic-containment-gate.zh.md',
    'skills/builder-review/references/prototype-to-spec-review.zh.md',
    'skills/builder-spec/references/prototype-to-spec.zh.md',
    'loops/recipes/artifact-hygiene.loop.md',
    'loops/recipes/design-plan-to-prototype.loop.md',
    'memory/policies/artifact-consistency-policy.zh.md',
    'memory/policies/artifact-cleanup-policy.zh.md',
    'contract_review',
    'evidence_review',
    'design_review',
    'prototype_to_spec_review',
    'release_readiness',
    'not_reviewable',
    'review_mode',
    'evidence_audit',
    'design_consistency_audit',
    'product_logic_containment_audit',
    'design_plan_audit',
    'prototype_to_spec_audit',
    'artifact_hygiene_audit',
    'artifact_index_update_proposal',
    'unverified_areas',
    'evals/output-contract/builder-review.schema.json',
    'references/skill-design/skill-design-playbook.zh.md',
  ],
  'skills/builder-decision/SKILL.md': [
    '## 资源读取',
    '## 模式判断',
    'templates/decision-record/template.md',
    'kernel/packets/decision-record.schema.md',
    'record_decision',
    'compare_options',
    'accept_tradeoff',
    'defer_decision',
    'decision_mode',
    'options_considered',
    'reversal_conditions',
    'memory_target',
    'evals/output-contract/decision-record.schema.json',
    'references/skill-design/skill-design-playbook.zh.md',
  ],
};

const packetSchemaExpectations = {
  'kernel/packets/agent-task-packet.schema.md': [
    'readiness_gate',
    'not_ready_for_agent_task',
    'reroute_recommendation',
    'design_plan',
    'ui_content_boundary',
    'business_rule_notes',
    'rule_notes_placement',
    'prototype_evidence_requirements',
    'next_skill_input',
  ],
};

const builderPlanGoalReferenceExpectations = {
  'skills/builder-plan-goal/references/decision-rules.zh.md': [
    '快速判断',
    '普通 Prompt',
    'Plan -> Goal',
    '先提问',
    'AI Builder OS Handoff',
    'builder-frame',
    'builder-spec',
    'builder-prototype',
    'builder-agent-task',
    'builder-review',
  ],
  'skills/builder-plan-goal/references/plan-template.zh.md': [
    '通用模板',
    '需求澄清模板',
    '新功能模板',
    'Bug 诊断模板',
    '重构模板',
    'UI / 产品原型模板',
    'Milestone 1 `/goal`',
  ],
  'skills/builder-plan-goal/references/goal-template.zh.md': [
    '通用结构：G-C-S-D-V-R',
    '通用模板',
    'Bug 修复 Goal',
    '新功能 Goal',
    'UI / 原型 Goal',
    '重构里程碑 Goal',
    'Eval / Prompt / Skill 优化 Goal',
  ],
  'skills/builder-plan-goal/references/anti-patterns.zh.md': [
    '把 Goal 当成更强普通 Prompt',
    '一个 Goal 承担完整系统',
    'Plan 只是待办清单',
    '没有“不做什么”',
    '验收标准不可判断',
    '复杂任务不先 Plan',
    '把业务决策藏进提示词',
    '只做 prompt 润色',
    'handoff 不完整',
  ],
  'skills/builder-plan-goal/references/examples.zh.md': [
    '模块重构',
    'flaky test',
    '产品原型',
    '小改动',
    '未知代码库新功能',
    '生产风险变更',
    'AI Builder OS skill 打磨',
  ],
  'skills/builder-plan-goal/assets/output-format.zh.md': [
    '模式建议',
    '判断理由',
    '当前风险',
    '推荐工作流',
    '可直接复制的提示词',
    '拆分后的里程碑',
    '下一步建议',
    'handoff_packet',
  ],
};

const builderUiUxExpectations = {
  'references/ui-ux/design-principles.zh.md': [
    '业务清晰优先',
    '信息层级',
    '状态完整性',
    'Design Brief',
    'mock',
    'ui_content_boundary',
    'business_rule_notes',
    'rule_notes_placement',
  ],
  'references/ui-ux/component-guidelines.zh.md': [
    '组件选择顺序',
    '按钮',
    '表单',
    '表格/列表',
    '禁止事项',
  ],
  'references/ui-ux/interaction-patterns.zh.md': [
    '核心交互要求',
    '状态覆盖',
    'default',
    'loading',
    'empty',
    'error',
    'permission',
  ],
  'references/ui-ux/visual-style.zh.md': [
    '视觉层级',
    '排版',
    '色彩',
    '响应式',
    '可访问性基础',
  ],
  'templates/design-brief/template.md': [
    'artifact_type: design_brief',
    'information_architecture',
    'components',
    'interaction_requirements',
    'states',
    'responsive_requirements',
    'accessibility_notes',
    'data_notes',
    'ui_content_boundary',
    'business_rule_notes',
    'rule_notes_placement',
    'non_ui_explanations',
    'handoff_targets',
  ],
  'templates/prototype-brief/template.md': [
    'prototype_first',
    'boundary_first',
    'spec_first',
    'degraded_prototype',
    'artifact_path',
    'fidelity',
    'covered_flows',
    'states_covered',
    'gaps',
    'verification',
    'next',
    '业务规则说明（非界面内容）',
  ],
  'kernel/gates/design-consistency-gate.zh.md': [
    'Design Brief',
    '信息层级',
    '组件一致性',
    '状态覆盖',
    '交互真实性',
    '响应式',
    '数据诚实性',
    'Product Logic Containment Gate',
  ],
  'kernel/gates/product-logic-containment-gate.zh.md': [
    'Product Logic Containment Gate',
    '业务规则说明（非界面内容）',
    'ui_content_boundary',
    'business_rule_notes',
    'rule_notes_placement',
    'below_interface',
  ],
  'skills/builder-prototype/SKILL.md': [
    'Design Brief',
    'Design Consistency Gate',
    'prototype_first',
    'boundary_first',
    'spec_first',
    'degraded_prototype',
    'states_covered',
    'gaps',
    'Product Logic Containment Gate',
    'Design Plan to Prototype Loop',
    '业务规则说明（非界面内容）',
    'references/ui-ux/',
  ],
  'skills/builder-agent-task/SKILL.md': [
    'Design Brief',
    'design_constraints',
    'ui_states',
    'Product Logic Containment Gate',
    'design_plan',
    'business_rule_notes',
    'design_consistency_gate',
    'references/ui-ux/',
  ],
  'skills/builder-review/SKILL.md': [
    'Design Brief',
    'Design Consistency Gate',
    'design_consistency_audit',
    'product_logic_containment_audit',
    'design_plan_audit',
    'prototype_to_spec_audit',
    'prototype_to_spec_review',
    'verification provenance',
    '组件一致性',
    '状态覆盖',
    'mock/demo',
  ],
};

const skillDesignExpectations = {
  'references/skill-design/skill-design-playbook.zh.md': [
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
  ],
  'templates/skill-hardening-brief/template.md': [
    'artifact_type: skill_hardening_brief',
    'skill_name',
    'trigger_conditions',
    'non_trigger_conditions',
    'mode_decision',
    'resource_map',
    'output_contract',
    'validator_eval_plan',
    'installation_resources',
  ],
  'evals/quality/skill-design-playbook.rubric.md': [
    '必须通过',
    'PARTIAL',
    'BLOCKED',
    '安装态',
    'handoff',
  ],
};

const releaseSealExpectations = {
  'docs/release-seal-m2.3.md': [
    'Release Seal',
    '变更分类',
    'Untracked 目录归属',
    '安装态一致性',
    'Package dry-run',
    '回滚方式',
    '剩余风险',
    '建议提交信息',
    'Release Seal 判定',
    'PASS',
  ],
  'docs/release-seal-m2.5.md': [
    'Release Boundary Seal',
    'PASS_WITH_COMMIT_SPLIT',
    '当前变更分类',
    'Tracked 修改',
    'Untracked 新增目录',
    'M2.4 / M2.5 可提交范围',
    '建议 commit 拆分',
    '回滚方式',
    'M2.6 Trigger Description Eval Plan 输入基线',
    'git diff --name-only -- "skills/pm-*"',
  ],
  'docs/release-seal-m3.1.md': [
    'Milestone 3.1',
    'legacy archive',
    '_archived/pm-copilot-legacy-v1.0',
    'active skill surface',
    '8 个 builder',
    'installer',
    'validator',
    '回滚方式',
    'M3.2',
  ],
  'docs/release-seal-m3.2.md': [
    'Milestone 3.2',
    'package surface',
    'skill-pack.json',
    'agents/openai.yaml',
    'ai-builder-os',
    '兼容 npm package id',
    'pack gate',
    'validate:package-surface',
    'forbidden prefixes',
    'M3.3',
  ],
  'docs/release-seal-m3.3.md': [
    'Milestone 3.3',
    'runtime adapter/export',
    'export-ai-builder-os.js',
    'validate:runtime-adapters',
    'flat-skill-root',
    'package-root',
    '.ai-builder-os-export-target',
    'projection contract',
    'M3.4',
  ],
  'docs/release-seal-m3.4.md': [
    'Milestone 3.4',
    'trigger description',
    'frontmatter',
    'validate:trigger-descriptions',
    'builder-description.cases.json',
    '不要用于',
    'confusing skills',
    'M3.5',
  ],
  'docs/release-seal-m3.5.md': [
    'Milestone 3.5',
    'Release Candidate',
    'AI Builder OS 1.0 RC',
    'git status --short',
    'npm pack --dry-run --json',
    'validate:builder-os',
    'validate:codex-install',
    'active surface',
    'install surface',
    'archive surface',
    'RC 判断',
    'tag',
    'push',
    'package rename',
    'repo split',
    'M3.6',
  ],
  'docs/release-seal-m3.7.md': [
    'Milestone 3.7',
    'package / repo migration dry-run',
    'ai-builder-os',
    'pm-copilot-skills',
    'validate:dual-package-dry-run',
    'npm pack --dry-run --json',
    'codex-project',
    'forbidden prefixes',
    '不执行 `npm publish`',
    '不修改真实 `package.json` 的 `name`',
  ],
  'docs/release-seal-m3.8.md': [
    'Milestone 3.8',
    'final 1.0 release seal',
    'PASS_FOR_RELEASE_PREP',
    'ai-builder-os@1.0.0',
    'pm-copilot-skills@1.0.0',
    'ai-builder-os-v1.0.0',
    'Publish order',
    'Post-release Verification',
    'Compatibility Policy',
    'fix-forward',
    '不是正式双包发布器',
    'M3.9',
  ],
  'docs/release-seal-m3.8.1.md': [
    'Milestone 3.8.1',
    'multi-runtime install and loading smoke test',
    'PASS_FOR_M3.9_PREP_WITH_CONDITIONS',
    'Codex',
    'Claude Code',
    'generic-agent/QoderWork',
    'Unpublished Latest Install',
    'node install.js global --overwrite',
    'node install.js project --overwrite',
    'export-manifest.json',
    'M3.9 Recommendation',
  ],
  'docs/release-runbook-m3.9.md': [
    'AI Builder OS M3.9 Publish Runbook',
    'ai-builder-os-v1.0.0',
    'ai-builder-os@1.0.0',
    'pm-copilot-skills@1.0.0',
    'prepare:dual-package-publish',
    'npm publish',
    'Post-release Verification',
    'sync-and-publish.sh',
  ],
  'docs/release-seal-m3.9.md': [
    'Milestone 3.9',
    'publish prep, dry-run only',
    'PASS_FOR_PUBLISH_APPROVAL_PENDING',
    'scripts/prepare-dual-package-publish.js',
    '拒绝 `--publish`',
    'Required Human Approval',
    'docs/release-runbook-m3.9.md',
  ],
};

const outputContractExpectations = {
  'evals/output-contract/builder-router.schema.json': [
    'route_type',
    'recommended_mode',
    'recommended_skill',
    'project_mode',
    'project_profile_proposal',
    'recommended_next_skill',
    'reasoning_summary',
    'missing_context',
    'risk_flags',
    'suggested_chain',
    'next_skill_input',
    'next_prompt',
    'handoff_packet',
  ],
  'evals/output-contract/builder-plan-goal.schema.json': [
    'mode_recommendation',
    'reasoning_summary',
    'missing_context',
    'risk_level',
    'recommended_workflow',
    'copy_ready_plan_prompt',
    'copy_ready_goal_prompt',
    'milestones',
    'stop_conditions',
    'handoff_packet',
  ],
  'evals/output-contract/feature-frame.schema.json': [
    'artifact_type',
    'frame_mode',
    'shared_understanding',
    'decision_tree',
    'critical_questions',
    'recommended_defaults',
    'problem',
    'user',
    'scenario',
    'current_pain',
    'desired_outcome',
    'core_capability',
    'magic_moment',
    'non_goals',
    'success_criteria',
    'constraints',
    'facts',
    'assumptions',
    'open_questions',
    'human_decision_points',
    'stable_terms',
    'frame_confidence',
    'blocking_questions',
    'evidence_needed',
    'spec_readiness',
    'next_skill_hint',
    'next_skill_input',
  ],
  'evals/output-contract/builder-spec.schema.json': [
    'readiness_gate',
    'reroute_recommendation',
    'spec_type',
    'objective',
    'users',
    'scope',
    'non_goals',
    'requirements',
    'flows',
    'states',
    'edge_cases',
    'acceptance_criteria',
    'rejection_criteria',
    'verification_plan',
    'assumptions',
    'open_questions',
    'risks',
    'next_skill_hint',
    'next_skill_input',
  ],
  'evals/output-contract/builder-prototype.schema.json': [
    'prototype_mode',
    'artifact_path',
    'fidelity',
    'covered_flows',
    'states_covered',
    'gaps',
    'verification',
    'next',
  ],
  'evals/output-contract/agent-task-packet.schema.json': [
    'readiness_gate',
    'reroute_recommendation',
    'task_name',
    'background',
    'desired_outcome',
    'scope',
    'non_goals',
    'context_sources',
    'target_runtime',
    'recommended_mode',
    'runtime_constraints',
    'acceptance_criteria',
    'verification',
    'artifact_index_update_proposal',
    'human_approval_gates',
    'risks',
    'blocked_stop_condition',
    'next_skill_input',
    'handoff_packet',
  ],
  'evals/output-contract/builder-review.schema.json': [
    'review_mode',
    'review_target',
    'contract_checked',
    'findings',
    'evidence_audit',
    'design_consistency_audit',
    'prototype_to_spec_audit',
    'artifact_hygiene_audit',
    'artifact_index_update_proposal',
    'risk_assessment',
    'decision',
    'required_fixes',
    'unverified_areas',
    'next_step',
  ],
  'evals/output-contract/decision-record.schema.json': [
    'decision_mode',
    'decision_title',
    'context',
    'options_considered',
    'decision',
    'rationale',
    'tradeoffs',
    'risks',
    'assumptions',
    'evidence',
    'reversal_conditions',
    'owners',
    'follow_up',
    'memory_target',
    'date',
  ],
  'evals/output-contract/design-brief.schema.json': [
    'artifact_type',
    'title',
    'source_context',
    'users',
    'task_context',
    'information_architecture',
    'flows',
    'components',
    'interaction_requirements',
    'states',
    'responsive_requirements',
    'accessibility_notes',
    'visual_style',
    'data_notes',
    'acceptance_criteria',
    'verification',
    'open_questions',
    'handoff_targets',
  ],
  'evals/output-contract/skill-hardening-brief.schema.json': [
    'artifact_type',
    'skill_name',
    'current_role',
    'target_role',
    'primary_artifact',
    'target_users',
    'source_baseline',
    'trigger_conditions',
    'non_trigger_conditions',
    'mode_decision',
    'resource_map',
    'output_contract',
    'quality_gates',
    'handoff_targets',
    'anti_patterns',
    'examples',
    'validator_eval_plan',
    'installation_resources',
    'done_when',
    'verification',
    'open_questions',
  ],
};

const requiredBuilderSkillSections = [
  '# ',
  '## 使命',
  '## 何时使用',
  '## 何时不要使用',
  '## 输入',
  '## 执行流程',
  '## 输出契约',
  '## 质量门禁',
  '## 交接',
  '## 参考',
];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function assert(condition, message, failures) {
  if (!condition) failures.push(message);
}

const failures = [];

for (const relativePath of requiredFiles) {
  assert(fs.existsSync(path.join(root, relativePath)), `缺少必需文件: ${relativePath}`, failures);
}

for (const [relativePath, expectedTerms] of Object.entries(legacyArchiveExpectations)) {
  const fullPath = path.join(root, relativePath);
  assert(fs.existsSync(fullPath), `缺少 legacy archive 文件: ${relativePath}`, failures);
  if (!fs.existsSync(fullPath)) continue;

  const content = read(relativePath);
  for (const term of expectedTerms) {
    assert(content.includes(term), `${relativePath} 缺少 legacy hardening 术语: ${term}`, failures);
  }
}

const activeSkillDirs = fs.readdirSync(path.join(root, 'skills'))
  .filter((entry) => fs.statSync(path.join(root, 'skills', entry)).isDirectory())
  .sort();
const unexpectedActiveSkillDirs = activeSkillDirs.filter((entry) => !builderSkills.includes(entry));
const missingActiveBuilderSkills = builderSkills.filter((entry) => !activeSkillDirs.includes(entry));
assert(
  unexpectedActiveSkillDirs.length === 0,
  `skills/ active surface 只能包含 builder core，发现: ${unexpectedActiveSkillDirs.join(', ')}`,
  failures,
);
assert(
  missingActiveBuilderSkills.length === 0,
  `skills/ active surface 缺少 builder core: ${missingActiveBuilderSkills.join(', ')}`,
  failures,
);

for (const skillName of legacyArchivedSkills) {
  assert(
    fs.existsSync(path.join(root, '_archived/pm-copilot-legacy-v1.0/skills', skillName, 'SKILL.md')),
    `legacy archive 缺少 PM skill: ${skillName}`,
    failures,
  );
}

for (const utilityName of legacyArchivedUtilities) {
  assert(
    fs.existsSync(path.join(root, '_archived/pm-copilot-legacy-v1.0/skills', utilityName)),
    `legacy archive 缺少 utility/reference: ${utilityName}`,
    failures,
  );
}

for (const skillName of builderSkills) {
  const relativePath = `skills/${skillName}/SKILL.md`;
  const fullPath = path.join(root, relativePath);
  assert(fs.existsSync(fullPath), `缺少 AI Builder OS core skill: ${relativePath}`, failures);
  if (!fs.existsSync(fullPath)) continue;
  const content = read(relativePath);
  assert(content.includes(`name: ${skillName}`), `${relativePath} name 必须与目录名一致`, failures);
  for (const section of requiredBuilderSkillSections) {
    assert(content.includes(section), `${relativePath} 缺少必需章节: ${section}`, failures);
  }
}

for (const [relativePath, expectedTerms] of Object.entries(builderCoreExpectations)) {
  const content = read(relativePath);
  for (const term of expectedTerms) {
    assert(content.includes(term), `${relativePath} 缺少 Milestone 2 契约术语: ${term}`, failures);
  }
}

for (const [relativePath, expectedTerms] of Object.entries(packetSchemaExpectations)) {
  const content = read(relativePath);
  for (const term of expectedTerms) {
    assert(content.includes(term), `${relativePath} 缺少 packet schema 字段: ${term}`, failures);
  }
}

for (const [relativePath, expectedTerms] of Object.entries(builderPlanGoalReferenceExpectations)) {
  const content = read(relativePath);
  for (const term of expectedTerms) {
    assert(content.includes(term), `${relativePath} 缺少 Plan Goal Coach 等价内容: ${term}`, failures);
  }
}

for (const [relativePath, expectedTerms] of Object.entries(builderUiUxExpectations)) {
  const content = read(relativePath);
  for (const term of expectedTerms) {
    assert(content.includes(term), `${relativePath} 缺少 UI/UX shared contract 内容: ${term}`, failures);
  }
}

for (const [relativePath, expectedTerms] of Object.entries(skillDesignExpectations)) {
  const content = read(relativePath);
  for (const term of expectedTerms) {
    assert(content.includes(term), `${relativePath} 缺少 Skill Design Playbook 内容: ${term}`, failures);
  }
}

for (const [relativePath, expectedTerms] of Object.entries(releaseSealExpectations)) {
  const content = read(relativePath);
  for (const term of expectedTerms) {
    assert(content.includes(term), `${relativePath} 缺少 release seal 内容: ${term}`, failures);
  }
}

for (const [relativePath, requiredFields] of Object.entries(outputContractExpectations)) {
  const contract = readJson(relativePath);
  assert(Array.isArray(contract.required), `${relativePath} 必须包含 required 数组`, failures);
  if (!Array.isArray(contract.required)) continue;
  for (const field of requiredFields) {
    assert(contract.required.includes(field), `${relativePath} required 缺少字段: ${field}`, failures);
  }
}

const featureFrameContract = readJson('evals/output-contract/feature-frame.schema.json');
assert(Array.isArray(featureFrameContract.frame_mode_values), 'feature-frame schema 必须包含 frame_mode_values 数组', failures);
if (Array.isArray(featureFrameContract.frame_mode_values)) {
  for (const value of ['idea_frame', 'problem_frame', 'opportunity_frame', 'grill_frame', 'not_ready_for_spec']) {
    assert(featureFrameContract.frame_mode_values.includes(value), `feature-frame frame_mode_values 缺少 ${value}`, failures);
  }
}

const planGoalContract = readJson('evals/output-contract/builder-plan-goal.schema.json');
for (const field of ['final_response_sections', 'required_reference_files', 'handoff_targets']) {
  assert(Array.isArray(planGoalContract[field]), `builder-plan-goal output contract 必须包含 ${field} 数组`, failures);
}

const designBriefContract = readJson('evals/output-contract/design-brief.schema.json');
assert(designBriefContract.artifact_type === 'design_brief', 'design-brief schema artifact_type 必须是 design_brief', failures);
for (const field of ['required_states', 'consumers', 'rule_notes_placement_values']) {
  assert(Array.isArray(designBriefContract[field]), `design-brief schema 必须包含 ${field} 数组`, failures);
}
if (Array.isArray(designBriefContract.required)) {
  for (const field of ['ui_content_boundary', 'business_rule_notes', 'rule_notes_placement', 'non_ui_explanations']) {
    assert(designBriefContract.required.includes(field), `design-brief required 缺少 ${field}`, failures);
  }
}
if (Array.isArray(designBriefContract.required_states)) {
  for (const state of ['default', 'loading', 'empty', 'error', 'success', 'disabled', 'permission']) {
    assert(designBriefContract.required_states.includes(state), `design-brief required_states 缺少 ${state}`, failures);
  }
}
if (Array.isArray(designBriefContract.consumers)) {
  for (const consumer of ['builder-spec', 'builder-prototype', 'builder-agent-task', 'builder-review']) {
    assert(designBriefContract.consumers.includes(consumer), `design-brief consumers 缺少 ${consumer}`, failures);
  }
}
if (Array.isArray(designBriefContract.rule_notes_placement_values)) {
  for (const value of ['below_interface', 'side_panel', 'linked_doc', 'not_applicable']) {
    assert(designBriefContract.rule_notes_placement_values.includes(value), `design-brief rule_notes_placement_values 缺少 ${value}`, failures);
  }
}

const agentTaskContract = readJson('evals/output-contract/agent-task-packet.schema.json');
assert(Array.isArray(agentTaskContract.optional), 'agent-task-packet schema 必须包含 optional 数组', failures);
if (Array.isArray(agentTaskContract.optional)) {
  for (const field of ['plan_prompt', 'goal_prompt', 'design_brief', 'design_constraints', 'ui_states', 'design_plan', 'ui_content_boundary', 'business_rule_notes', 'rule_notes_placement', 'non_ui_explanations', 'prototype_evidence_requirements', 'product_logic_containment_gate', 'design_consistency_gate']) {
    assert(agentTaskContract.optional.includes(field), `agent-task-packet optional 缺少 ${field}`, failures);
  }
}
assert(Array.isArray(agentTaskContract.readiness_values), 'agent-task-packet schema 必须包含 readiness_values 数组', failures);
if (Array.isArray(agentTaskContract.readiness_values)) {
  for (const value of ['ready', 'not_ready_for_agent_task']) {
    assert(agentTaskContract.readiness_values.includes(value), `agent-task-packet readiness_values 缺少 ${value}`, failures);
  }
}
assert(Array.isArray(agentTaskContract.reroute_targets), 'agent-task-packet schema 必须包含 reroute_targets 数组', failures);
if (Array.isArray(agentTaskContract.reroute_targets)) {
  for (const target of ['builder-frame', 'builder-spec', 'builder-plan-goal', 'none']) {
    assert(agentTaskContract.reroute_targets.includes(target), `agent-task-packet reroute_targets 缺少 ${target}`, failures);
  }
}
assert(Array.isArray(agentTaskContract.rule_notes_placement_values), 'agent-task-packet schema 必须包含 rule_notes_placement_values 数组', failures);
if (Array.isArray(agentTaskContract.rule_notes_placement_values)) {
  for (const value of ['below_interface', 'side_panel', 'linked_doc', 'not_applicable']) {
    assert(agentTaskContract.rule_notes_placement_values.includes(value), `agent-task-packet rule_notes_placement_values 缺少 ${value}`, failures);
  }
}

const builderRouterContract = readJson('evals/output-contract/builder-router.schema.json');
assert(Array.isArray(builderRouterContract.route_type_values), 'builder-router schema 必须包含 route_type_values 数组', failures);
if (Array.isArray(builderRouterContract.route_type_values)) {
  for (const value of ['answer', 'prompt', 'plan', 'goal', 'plan_to_goal', 'skill_route', 'ask_first']) {
    assert(builderRouterContract.route_type_values.includes(value), `builder-router route_type_values 缺少 ${value}`, failures);
  }
}
assert(Array.isArray(builderRouterContract.project_mode_values), 'builder-router schema 必须包含 project_mode_values 数组', failures);
if (Array.isArray(builderRouterContract.project_mode_values)) {
  for (const value of ['greenfield', 'brownfield', 'resume', 'unknown', 'not_applicable']) {
    assert(builderRouterContract.project_mode_values.includes(value), `builder-router project_mode_values 缺少 ${value}`, failures);
  }
}
assert(Array.isArray(builderRouterContract.required_reference_files), 'builder-router schema 必须包含 required_reference_files 数组', failures);
if (Array.isArray(builderRouterContract.required_reference_files)) {
  for (const fileName of [
    'kernel/routing/builder-router.zh.md',
    'kernel/routing/skill-selection-rules.zh.md',
    'loops/recipes/grill-decision.loop.md',
    'harness/project-onboarding-policy.zh.md',
    'memory/schemas/project-profile.schema.md',
  ]) {
    assert(builderRouterContract.required_reference_files.includes(fileName), `builder-router required_reference_files 缺少 ${fileName}`, failures);
  }
}
assert(Array.isArray(builderRouterContract.handoff_targets), 'builder-router schema 必须包含 handoff_targets 数组', failures);
if (Array.isArray(builderRouterContract.handoff_targets)) {
  for (const target of ['builder-plan-goal', 'builder-frame', 'builder-spec', 'builder-prototype', 'builder-agent-task', 'builder-review', 'builder-decision']) {
    assert(builderRouterContract.handoff_targets.includes(target), `builder-router handoff_targets 缺少 ${target}`, failures);
  }
}

const builderPrototypeContract = readJson('evals/output-contract/builder-prototype.schema.json');
assert(Array.isArray(builderPrototypeContract.required), 'builder-prototype schema 必须包含 required 数组', failures);
if (Array.isArray(builderPrototypeContract.required)) {
  for (const field of ['prototype_mode', 'artifact_path', 'fidelity', 'covered_flows', 'states_covered', 'gaps', 'verification', 'next']) {
    assert(builderPrototypeContract.required.includes(field), `builder-prototype required 缺少 ${field}`, failures);
  }
}
assert(Array.isArray(builderPrototypeContract.prototype_mode_values), 'builder-prototype schema 必须包含 prototype_mode_values 数组', failures);
if (Array.isArray(builderPrototypeContract.prototype_mode_values)) {
  for (const value of ['prototype_first', 'boundary_first', 'spec_first', 'runnable_prototype', 'wireframe', 'prototype_brief', 'degraded_prototype']) {
    assert(builderPrototypeContract.prototype_mode_values.includes(value), `builder-prototype prototype_mode_values 缺少 ${value}`, failures);
  }
}
assert(Array.isArray(builderPrototypeContract.fidelity_values), 'builder-prototype schema 必须包含 fidelity_values 数组', failures);
if (Array.isArray(builderPrototypeContract.fidelity_values)) {
  for (const value of ['low', 'medium', 'high', 'not_applicable']) {
    assert(builderPrototypeContract.fidelity_values.includes(value), `builder-prototype fidelity_values 缺少 ${value}`, failures);
  }
}
assert(Array.isArray(builderPrototypeContract.required_states), 'builder-prototype schema 必须包含 required_states 数组', failures);
if (Array.isArray(builderPrototypeContract.required_states)) {
  for (const state of ['default', 'loading', 'empty', 'error', 'success', 'disabled', 'permission']) {
    assert(builderPrototypeContract.required_states.includes(state), `builder-prototype required_states 缺少 ${state}`, failures);
  }
}
assert(Array.isArray(builderPrototypeContract.next_values), 'builder-prototype schema 必须包含 next_values 数组', failures);
if (Array.isArray(builderPrototypeContract.next_values)) {
  for (const value of ['builder-review', 'builder-agent-task', 'builder-spec', 'builder-frame', 'iterate', 'ask_user']) {
    assert(builderPrototypeContract.next_values.includes(value), `builder-prototype next_values 缺少 ${value}`, failures);
  }
}

const builderReviewContract = readJson('evals/output-contract/builder-review.schema.json');
assert(Array.isArray(builderReviewContract.required), 'builder-review schema 必须包含 required 数组', failures);
if (Array.isArray(builderReviewContract.required)) {
  assert(builderReviewContract.required.includes('product_logic_containment_audit'), 'builder-review required 缺少 product_logic_containment_audit', failures);
  assert(builderReviewContract.required.includes('prototype_to_spec_audit'), 'builder-review required 缺少 prototype_to_spec_audit', failures);
}
assert(Array.isArray(builderReviewContract.review_mode_values), 'builder-review schema 必须包含 review_mode_values 数组', failures);
if (Array.isArray(builderReviewContract.review_mode_values)) {
  for (const value of ['contract_review', 'evidence_review', 'design_review', 'prototype_to_spec_review', 'release_readiness', 'not_reviewable']) {
    assert(builderReviewContract.review_mode_values.includes(value), `builder-review review_mode_values 缺少 ${value}`, failures);
  }
}
assert(Array.isArray(builderReviewContract.decision_values), 'builder-review schema 必须包含 decision_values 数组', failures);
if (Array.isArray(builderReviewContract.decision_values)) {
  for (const value of ['PASS', 'PARTIAL', 'BLOCKED', 'APPROVE', 'REQUEST_CHANGES']) {
    assert(builderReviewContract.decision_values.includes(value), `builder-review decision_values 缺少 ${value}`, failures);
  }
}
assert(Array.isArray(builderReviewContract.optional), 'builder-review schema 必须包含 optional 数组', failures);
if (Array.isArray(builderReviewContract.optional)) {
  assert(builderReviewContract.optional.includes('cleanup_proposal'), 'builder-review optional 缺少 cleanup_proposal', failures);
  assert(builderReviewContract.optional.includes('design_plan_audit'), 'builder-review optional 缺少 design_plan_audit', failures);
}
assert(Array.isArray(builderReviewContract.required_reference_files), 'builder-review schema 必须包含 required_reference_files 数组', failures);
if (Array.isArray(builderReviewContract.required_reference_files)) {
  for (const fileName of [
    'kernel/gates/product-logic-containment-gate.zh.md',
    'skills/builder-review/references/prototype-to-spec-review.zh.md',
    'skills/builder-spec/references/prototype-to-spec.zh.md',
    'loops/recipes/design-plan-to-prototype.loop.md',
    'loops/recipes/artifact-hygiene.loop.md',
    'memory/policies/artifact-consistency-policy.zh.md',
    'memory/policies/artifact-cleanup-policy.zh.md',
  ]) {
    assert(builderReviewContract.required_reference_files.includes(fileName), `builder-review required_reference_files 缺少 ${fileName}`, failures);
  }
}

const decisionRecordContract = readJson('evals/output-contract/decision-record.schema.json');
assert(Array.isArray(decisionRecordContract.decision_mode_values), 'decision-record schema 必须包含 decision_mode_values 数组', failures);
if (Array.isArray(decisionRecordContract.decision_mode_values)) {
  for (const value of ['record_decision', 'compare_options', 'accept_tradeoff', 'defer_decision']) {
    assert(decisionRecordContract.decision_mode_values.includes(value), `decision-record decision_mode_values 缺少 ${value}`, failures);
  }
}

const skillHardeningContract = readJson('evals/output-contract/skill-hardening-brief.schema.json');
assert(skillHardeningContract.artifact_type === 'skill_hardening_brief', 'skill-hardening schema artifact_type 必须是 skill_hardening_brief', failures);
assert(skillHardeningContract.reference_playbook === 'references/skill-design/skill-design-playbook.zh.md', 'skill-hardening schema reference_playbook 必须指向 Skill Design Playbook', failures);
assert(skillHardeningContract.template === 'templates/skill-hardening-brief/template.md', 'skill-hardening schema template 必须指向 Skill Hardening Brief 模板', failures);

const builderSpecContract = readJson('evals/output-contract/builder-spec.schema.json');
assert(Array.isArray(builderSpecContract.optional), 'builder-spec schema 必须包含 optional 数组', failures);
if (Array.isArray(builderSpecContract.optional)) {
  for (const field of ['design_brief', 'ui_states', 'interaction_requirements', 'responsive_requirements', 'accessibility_notes', 'ui_content_boundary', 'business_rule_notes', 'rule_notes_placement', 'non_ui_explanations', 'source_prototype', 'extracted_from_prototype', 'prototype_gaps', 'prototype_verification']) {
    assert(builderSpecContract.optional.includes(field), `builder-spec optional 缺少 ${field}`, failures);
  }
}
assert(Array.isArray(builderSpecContract.spec_type_values), 'builder-spec schema 必须包含 spec_type_values 数组', failures);
if (Array.isArray(builderSpecContract.spec_type_values)) {
  for (const value of ['mini_spec', 'prd', 'engineering_request', 'agent_readable_spec', 'prototype_to_spec']) {
    assert(builderSpecContract.spec_type_values.includes(value), `builder-spec spec_type_values 缺少 ${value}`, failures);
  }
}
assert(Array.isArray(builderSpecContract.readiness_values), 'builder-spec schema 必须包含 readiness_values 数组', failures);
if (Array.isArray(builderSpecContract.readiness_values)) {
  for (const value of ['ready', 'not_ready_for_spec']) {
    assert(builderSpecContract.readiness_values.includes(value), `builder-spec readiness_values 缺少 ${value}`, failures);
  }
}
assert(Array.isArray(builderSpecContract.rule_notes_placement_values), 'builder-spec schema 必须包含 rule_notes_placement_values 数组', failures);
if (Array.isArray(builderSpecContract.rule_notes_placement_values)) {
  for (const value of ['below_interface', 'side_panel', 'linked_doc', 'not_applicable']) {
    assert(builderSpecContract.rule_notes_placement_values.includes(value), `builder-spec rule_notes_placement_values 缺少 ${value}`, failures);
  }
}
if (Array.isArray(planGoalContract.final_response_sections)) {
  for (const section of ['模式建议', '判断理由', '当前风险', '推荐工作流', '可直接复制的提示词', '拆分后的里程碑', '下一步建议']) {
    assert(planGoalContract.final_response_sections.includes(section), `builder-plan-goal final_response_sections 缺少 ${section}`, failures);
  }
}
if (Array.isArray(planGoalContract.required_reference_files)) {
  for (const fileName of ['decision-rules.zh.md', 'plan-template.zh.md', 'goal-template.zh.md', 'anti-patterns.zh.md', 'examples.zh.md', 'output-format.zh.md']) {
    assert(planGoalContract.required_reference_files.includes(fileName), `builder-plan-goal required_reference_files 缺少 ${fileName}`, failures);
  }
}
if (Array.isArray(planGoalContract.handoff_targets)) {
  for (const target of ['builder-frame', 'builder-spec', 'builder-prototype', 'builder-agent-task', 'builder-review', 'builder-decision']) {
    assert(planGoalContract.handoff_targets.includes(target), `builder-plan-goal handoff_targets 缺少 ${target}`, failures);
  }
}

const syncScript = read('sync-and-publish.sh');
const installScript = read('install.js');
const gitignore = read('.gitignore');
assert(syncScript.includes('canonical source'), 'sync-and-publish.sh 必须声明 canonical source 发布边界', failures);
assert(!syncScript.includes('sync: v$NEW_VERSION'), 'sync-and-publish.sh 不得使用旧的 agent sync commit message', failures);
assert(!/^AGENT_SKILLS_DIR=/m.test(syncScript), 'sync-and-publish.sh 不得把 agent 目录定义为上游源', failures);
assert(installScript.includes('codex-user'), 'install.js 必须支持 Codex 用户级安装模式', failures);
assert(installScript.includes('--overwrite'), 'install.js 必须提供显式覆盖外部 skill 的开关', failures);
assert(gitignore.includes('references/source-blueprints/'), '.gitignore 必须排除本地 source blueprints 研究资料', failures);

const readme = read('README.md');
const legacyQualityGates = read('_archived/pm-copilot-legacy-v1.0/skills/references/quality-gates-shared.md');
const legacyBuilderBlueprint = read('_archived/pm-copilot-legacy-v1.0/skills/references/builder-os/blueprint.md');
assert(readme.includes('默认输出语言'), 'README 必须在入口位置声明默认输出语言', failures);
assert(readme.includes('中文优先输出'), 'README 必须说明中文优先输出原则', failures);
assert(readme.includes('AI Builder OS'), 'README 必须表达 AI Builder OS 产品定位', failures);
assert(readme.includes('Milestone 3.9'), 'README 必须声明当前阶段是 Milestone 3.9 publish prep', failures);
assert(readme.includes('安装未发布的当前分支最新版'), 'README 必须说明未发布前如何安装当前分支最新版', failures);
assert(readme.includes('QoderWork 当前按 `generic-agent` 消费'), 'README 必须说明 QoderWork generic-agent 消费方式', failures);
assert(readme.includes('validate:dual-package-dry-run'), 'README 必须说明 dual package dry-run gate', failures);
assert(readme.includes('prepare:dual-package-publish'), 'README 必须说明 dual package publish prep gate', failures);
assert(readme.includes('八层') || readme.includes('Builder Kernel'), 'README 必须表达 AI Builder OS 架构骨架', failures);
assert(readme.includes('npx pm-copilot-skills codex'), 'README 必须说明 Codex 安装方式', failures);
assert(readme.includes('npm run validate:codex-install'), 'README 必须说明 Codex 安装验证方式', failures);
assert(readme.includes('_archived/pm-copilot-legacy-v1.0'), 'README 必须说明 legacy archive 路径', failures);
assert(readme.includes('active skill surface'), 'README 必须说明 AI Builder OS active skill surface', failures);
assert(!readme.includes('An **AI Product Builder OS**'), 'README 入口描述不得退回英文主叙事', failures);
assert(legacyQualityGates.includes('默认语言协议'), 'legacy quality gates 必须保留中文优先语言协议', failures);
assert(legacyBuilderBlueprint.includes('默认语言'), 'legacy Builder OS blueprint 必须保留中文优先原则', failures);

const evalSet = JSON.parse(read('evals/builder-os-trigger-evals.json'));
assert(evalSet.skill_name === 'builder-os', 'eval set 的 skill_name 必须是 builder-os', failures);
assert(Array.isArray(evalSet.evals), 'eval set 必须包含 evals 数组', failures);
assert(!read('evals/builder-os-trigger-evals.json').includes('pm-'), 'builder-os trigger seed eval 不应引用 legacy pm-* active surface', failures);
if (Array.isArray(evalSet.evals)) {
  const positives = evalSet.evals.filter(item => item.should_trigger === true).length;
  const negatives = evalSet.evals.filter(item => item.should_trigger === false).length;
  assert(positives >= 6, 'eval set 至少需要 6 个 should-trigger 用例', failures);
  assert(negatives >= 4, 'eval set 至少需要 4 个 should-not-trigger 用例', failures);
}

const builderCoreTriggerCases = readJson('evals/trigger/builder-core.cases.json');
assert(Array.isArray(builderCoreTriggerCases.cases), 'builder-core trigger eval 必须包含 cases 数组', failures);
if (Array.isArray(builderCoreTriggerCases.cases)) {
  for (const expectedSkill of ['builder-router', 'builder-plan-goal', 'builder-frame', 'builder-spec', 'builder-prototype', 'builder-agent-task', 'builder-review', 'builder-decision']) {
    assert(
      builderCoreTriggerCases.cases.some(item => item.expected_skill === expectedSkill),
      `builder-core trigger eval 缺少 ${expectedSkill} 覆盖用例`,
      failures
    );
  }
  for (const expectedCaseId of ['trigger-plan-goal-simple-prompt', 'trigger-plan-goal-production-risk', 'trigger-plan-goal-ai-builder-handoff']) {
    assert(
      builderCoreTriggerCases.cases.some(item => item.id === expectedCaseId),
      `builder-core trigger eval 缺少 ${expectedCaseId} 用例`,
      failures
    );
  }
  for (const expectedCaseId of ['trigger-design-brief-from-spec', 'trigger-design-consistency-review', 'trigger-product-logic-containment-review', 'trigger-prototype-to-spec-review', 'trigger-agent-task-from-spec', 'trigger-decision-record-from-tradeoff']) {
    assert(
      builderCoreTriggerCases.cases.some(item => item.id === expectedCaseId),
      `builder-core trigger eval 缺少 ${expectedCaseId} 用例`,
      failures
    );
  }
  for (const expectedCaseId of ['trigger-prototype-to-spec-extraction', 'trigger-prototype-to-spec-high-risk-guard']) {
    assert(
      builderCoreTriggerCases.cases.some(item => item.id === expectedCaseId),
      `builder-core trigger eval 缺少 prototype-to-spec 用例: ${expectedCaseId}`,
      failures
    );
  }
  for (const expectedCaseId of ['trigger-spec-reroute-to-frame', 'trigger-agent-task-reroute-to-spec']) {
    assert(
      builderCoreTriggerCases.cases.some(item => item.id === expectedCaseId),
      `builder-core trigger eval 缺少 readiness/reroute 用例: ${expectedCaseId}`,
      failures
    );
  }
  assert(
    builderCoreTriggerCases.cases.some(item => item.id === 'trigger-prototype-business-logic-containment'),
    'builder-core trigger eval 缺少 Product Logic Containment prototype 用例',
    failures
  );
  for (const expectedCaseId of ['trigger-prototype-first-low-risk', 'trigger-prototype-degraded-insufficient-input', 'trigger-prototype-spec-first-risk']) {
    assert(
      builderCoreTriggerCases.cases.some(item => item.id === expectedCaseId),
      `builder-core trigger eval 缺少 prototype 三路径/降级用例: ${expectedCaseId}`,
      failures
    );
  }
}

const builderRoutingCases = readJson('evals/routing/builder-routing.cases.json');
assert(Array.isArray(builderRoutingCases.cases), 'builder routing eval 必须包含 cases 数组', failures);
if (Array.isArray(builderRoutingCases.cases)) {
  const routingPaths = builderRoutingCases.cases
    .filter(item => Array.isArray(item.expected_path))
    .map(item => item.expected_path.join('>'));
  assert(
    routingPaths.some(route => route.includes('builder-frame>builder-spec')),
    'builder routing eval 必须覆盖 builder-frame -> builder-spec 路径',
    failures
  );
  assert(
    builderRoutingCases.cases.some(item => item.expected_mode === 'grill_frame' && Array.isArray(item.must_include) && item.must_include.includes('decision_tree')),
    'builder routing eval 必须覆盖 grill_frame 和 decision_tree',
    failures
  );
  assert(
    builderRoutingCases.cases.some(item => item.id === 'premature-agent-task-reroute-to-frame'),
    'builder routing eval 必须覆盖 premature agent task reroute to builder-frame',
    failures
  );
  for (const expectedCaseId of ['premature-spec-reroute-to-frame', 'premature-agent-task-reroute-to-spec']) {
    assert(
      builderRoutingCases.cases.some(item => item.id === expectedCaseId),
      `builder routing eval 必须覆盖 readiness/reroute 用例: ${expectedCaseId}`,
      failures
    );
  }
  assert(
    routingPaths.some(route => route.includes('builder-plan-goal>builder-agent-task')),
    'builder routing eval 必须覆盖 builder-plan-goal -> builder-agent-task 路径',
    failures
  );
  assert(
    routingPaths.some(route => route.includes('builder-plan-goal>builder-frame>builder-prototype>builder-agent-task')),
    'builder routing eval 必须覆盖 builder-plan-goal -> builder-frame -> builder-prototype -> builder-agent-task 路径',
    failures
  );
  assert(
    routingPaths.some(route => route.includes('builder-plan-goal>builder-review')),
    'builder routing eval 必须覆盖 builder-plan-goal -> builder-review 路径',
    failures
  );
  assert(
    routingPaths.some(route => route.includes('builder-spec>builder-prototype>builder-agent-task>builder-review')),
    'builder routing eval 必须覆盖 builder-spec -> builder-prototype -> builder-agent-task -> builder-review 的 UI/UX 路径',
    failures
  );
  assert(
    builderRoutingCases.cases.some(item => item.id === 'pms-high-fidelity-prototype-containment-path' && item.expected_mode === 'boundary_first' && Array.isArray(item.must_include) && item.must_include.includes('Product Logic Containment Gate')),
    'builder routing eval 必须覆盖 PMS 高保真原型的 Product Logic Containment 路径',
    failures
  );
  for (const expectedCaseId of ['prototype-first-runnable-path', 'prototype-spec-first-risk-path']) {
    assert(
      builderRoutingCases.cases.some(item => item.id === expectedCaseId),
      `builder routing eval 必须覆盖 prototype 三路径用例: ${expectedCaseId}`,
      failures
    );
  }
  for (const expectedCaseId of ['prototype-to-spec-extraction-path', 'prototype-to-spec-high-risk-guard-path']) {
    assert(
      builderRoutingCases.cases.some(item => item.id === expectedCaseId),
      `builder routing eval 必须覆盖 prototype-to-spec 用例: ${expectedCaseId}`,
      failures
    );
  }
  assert(
    builderRoutingCases.cases.some(item => item.id === 'prototype-to-spec-review-path' && item.expected_mode === 'prototype_to_spec_review'),
    'builder routing eval 必须覆盖 prototype-to-spec review 路径',
    failures
  );
  assert(
    routingPaths.some(route => route.includes('builder-review>builder-decision')),
    'builder routing eval 必须覆盖 builder-review -> builder-decision 路径',
    failures
  );
}

const prototypeToSpecCases = readJson('evals/prototype-to-spec/prototype-to-spec.cases.json');
assert(Array.isArray(prototypeToSpecCases.cases), 'prototype-to-spec eval 必须包含 cases 数组', failures);
if (Array.isArray(prototypeToSpecCases.cases)) {
  assert(prototypeToSpecCases.cases.length >= 2, 'prototype-to-spec eval 至少覆盖 2 个真实 prototype brief', failures);
  for (const testCase of prototypeToSpecCases.cases) {
    const label = `prototype-to-spec/${testCase.id || '<missing-id>'}`;
    assert(typeof testCase.id === 'string' && testCase.id.trim().length > 0, `${label} 必须包含 id`, failures);
    assert(testCase.expected_mode === 'prototype_to_spec', `${label} expected_mode 必须是 prototype_to_spec`, failures);
    assert(testCase.expected_review_mode === 'prototype_to_spec_review', `${label} expected_review_mode 必须是 prototype_to_spec_review`, failures);
    for (const field of ['source_brief_path', 'fixture', 'expected_output', 'review_checklist']) {
      assert(typeof testCase[field] === 'string' && testCase[field].trim().length > 0, `${label} 必须包含 ${field}`, failures);
    }
    if (typeof testCase.fixture === 'string') {
      assert(fs.existsSync(path.join(root, testCase.fixture)), `${label} fixture 不存在: ${testCase.fixture}`, failures);
    }
    if (typeof testCase.expected_output === 'string') {
      assert(fs.existsSync(path.join(root, testCase.expected_output)), `${label} expected_output 不存在: ${testCase.expected_output}`, failures);
    }
    for (const field of ['must_preserve', 'must_not_promote']) {
      assert(Array.isArray(testCase[field]) && testCase[field].length > 0, `${label} ${field} 必须是非空数组`, failures);
    }
  }
}

for (const [relativePath, expectedTerms] of Object.entries({
  'evals/prototype-to-spec/review-checklist.md': [
    'source_prototype.artifact_path',
    'prototype_gaps',
    'mock boundary',
    'verification provenance',
    'spec-first guard',
    'REQUEST_CHANGES',
  ],
  'evals/prototype-to-spec/manual-review-results.md': [
    'Visit + Check-in',
    'Surgery + Dimsum',
    'prototype_gaps',
    'prototype_verification',
    'mock-only',
    'PASS',
  ],
  'skills/builder-spec/references/examples-prototype-to-spec.zh.md': [
    'D:\\PMS-Dev-AIFirst\\modules\\visit\\prototype-brief.md',
    'D:\\PMS-Dev-AIFirst\\modules\\surgery\\prototype-brief.md',
    'prototype_gaps',
    'prototype_verification',
  ],
  'skills/builder-review/references/prototype-to-spec-review.zh.md': [
    'source_prototype.artifact_path',
    'gaps_preserved',
    'mock_boundary',
    'verification_provenance',
    'spec_first_guard',
  ],
})) {
  const content = read(relativePath);
  for (const term of expectedTerms) {
    assert(content.includes(term), `${relativePath} 缺少 prototype-to-spec 内容: ${term}`, failures);
  }
}

const coreManifest = JSON.parse(read('bundles/core/manifest.json'));
assert(coreManifest.name === 'ai-builder-os-core', 'core bundle manifest name 必须是 ai-builder-os-core', failures);
for (const skillName of builderSkills) {
  assert(coreManifest.skills.includes(skillName), `core bundle manifest 缺少 ${skillName}`, failures);
}

if (failures.length > 0) {
  console.error('Builder OS 验证失败:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

execFileSync(process.execPath, [path.join(root, 'scripts/validate-skill-design-playbook.js')], { stdio: 'inherit' });
execFileSync(process.execPath, [path.join(root, 'scripts/validate-package-surface.js')], { stdio: 'inherit' });
execFileSync(process.execPath, [path.join(root, 'scripts/validate-runtime-adapters.js')], { stdio: 'inherit' });
execFileSync(process.execPath, [path.join(root, 'scripts/validate-trigger-descriptions.js')], { stdio: 'inherit' });
execFileSync(process.execPath, [path.join(root, 'scripts/validate-artifact-evals.js')], { stdio: 'inherit' });
execFileSync(process.execPath, [path.join(root, 'scripts/validate-onboarding-evals.js')], { stdio: 'inherit' });
execFileSync(process.execPath, [path.join(root, 'scripts/validate-dual-package-dry-run.js')], { stdio: 'inherit' });

console.log('Builder OS 验证通过。');
console.log(`已检查 ${builderSkills.length} 个 active builder skill、${legacyArchivedSkills.length} 个 legacy PM skill 归档和 ${requiredFiles.length} 个必需文件。`);
