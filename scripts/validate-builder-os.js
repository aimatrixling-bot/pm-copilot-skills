#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');

const requiredFiles = [
  'README.md',
  'AGENTS.md',
  'CLAUDE.md',
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
  'docs/release-seal-m6-delivery-kernel.md',
  'docs/release-runbook-m3.9.md',
  'docs/release-seal-m3.9.md',
  'docs/release-plan-1.0.md',
  'docs/delivery-kernel.md',
  'docs/source-of-truth-map.md',
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
  'loops/recipes/definition-sync.loop.md',
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
  'evals/delivery-kernel/delivery-kernel.cases.json',
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
  'templates/module-execution-pack/template.md',
  'templates/change-contract/template.md',
  'templates/branch-state/template.md',
  'templates/definition-drift-check/template.md',
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
  'references/prototype-to-spec.zh.md',
  'skills/builder-spec/references/examples-prototype-to-spec.zh.md',
  'skills/builder-spec/references/migration-notes.md',
  'skills/builder-prototype/references/prototype-path-rules.zh.md',
  'skills/builder-prototype/references/visual-target-rules.zh.md',
  'skills/builder-prototype/references/coded-prototype-recipe.zh.md',
  'skills/builder-prototype/references/examples.zh.md',
  'skills/builder-review/references/prototype-to-spec-review.zh.md',
  'skills/builder-review/references/prototype-design-evidence-review.zh.md',
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
    'delivery_mode',
    'create',
    'improve',
    'reframe',
    'task_complexity',
    'response_profile',
    'contract_profile',
    'context_strategy',
    'display_policy',
    'micro',
    'lite',
    'standard',
    'full',
    'terse',
    'normal',
    'audit',
    'micro_note',
    'lite_change_contract',
    'standard_change_contract',
    'Module Execution Pack',
    'Change Contract',
    'docs/delivery-kernel.md',
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
    'templates/module-execution-pack/template.md',
    'templates/change-contract/template.md',
    'docs/delivery-kernel.md',
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
    'module_execution_pack',
    'change_contract',
    'not_ready_for_spec',
    'readiness_gate',
    'reroute_recommendation',
    'source_prototype',
    'extracted_from_prototype',
    'prototype_gaps',
    'prototype_verification',
    'visual_target',
    'runnable_evidence',
    'design_evidence',
    'scope',
    'requirements',
    'flows',
    'states',
    'edge_cases',
    'acceptance_criteria',
    'verification_plan',
    'next_skill_input',
    'delivery_mode',
    'definition_sync',
    'design_brief',
    'ui_states',
    'interaction_requirements',
    'responsive_requirements',
    'accessibility_notes',
    'ui_content_boundary',
    'business_rule_notes',
    'rule_notes_placement',
    'non_ui_explanations',
    'micro_note',
    'lite_change_contract',
    'standard_change_contract',
    'allowed_files_or_areas',
    'max_expected_files_touched',
    'requires_human_approval_if',
    'reframe_risk',
    'secondary_mode: none',
    'AGENTS.md',
    'references/skill-design/skill-design-playbook.zh.md',
  ],
  'skills/builder-prototype/SKILL.md': [
    '## 资源读取',
    '## 三路径模式',
    'templates/prototype-brief/template.md',
    'templates/design-brief/template.md',
    'templates/module-execution-pack/template.md',
    'templates/change-contract/template.md',
    'templates/branch-state/template.md',
    'docs/delivery-kernel.md',
    'references/prototype-path-rules.zh.md',
    'references/visual-target-rules.zh.md',
    'references/coded-prototype-recipe.zh.md',
    'references/examples.zh.md',
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
    'prototype_intent',
    'throwaway_question_probe',
    'durable_product_demo',
    'visual_variation_experiment',
    'coded_reference',
    'intent_lifecycle',
    'prototype_mode',
    'delivery_mode',
    'visual_target',
    'artifact_path',
    'fidelity',
    'covered_flows',
    'states_covered',
    'runnable_prototype',
    'runnable_evidence',
    'gaps',
    'verification',
    'definition_sync',
    'next',
    'evals/output-contract/builder-prototype.schema.json',
    'references/skill-design/skill-design-playbook.zh.md',
  ],
  'skills/builder-agent-task/SKILL.md': [
    '## 资源读取',
    '## 模式判断',
    'templates/agent-task-packet/template.md',
    'templates/module-execution-pack/template.md',
    'templates/change-contract/template.md',
    'templates/branch-state/template.md',
    'templates/definition-drift-check/template.md',
    'docs/delivery-kernel.md',
    'kernel/packets/agent-task-packet.schema.md',
    'kernel/packets/output-packet.schema.md',
    'harness/artifact-write-policy.zh.md',
    'memory/schemas/artifact-index.schema.md',
    'kernel/routing/plan-goal-routing.zh.md',
    'loops/recipes/grill-decision.loop.md',
    'loops/recipes/design-plan-to-prototype.loop.md',
    'loops/recipes/definition-sync.loop.md',
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
    'delegation_mode',
    'afk_ready',
    'hitl_checkpoint_required',
    'slice_plan',
    'vertical_slice',
    'tracer_bullet',
    'hitl_checkpoints',
    'verification_policy',
    'next_skill_input',
    'delivery_mode',
    'module_execution_pack',
    'change_contract',
    'branch_state',
    'definition_drift_check',
    'definition_sync',
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
    'templates/definition-drift-check/template.md',
    'docs/delivery-kernel.md',
    'kernel/gates/builder-quality-gates.zh.md',
    'kernel/gates/fake-ui-gate.zh.md',
    'kernel/gates/fake-test-gate.zh.md',
    'kernel/gates/design-consistency-gate.zh.md',
    'kernel/gates/product-logic-containment-gate.zh.md',
    'references/prototype-to-spec-review.zh.md',
    'references/prototype-design-evidence-review.zh.md',
    'references/prototype-to-spec.zh.md',
    'loops/recipes/artifact-hygiene.loop.md',
    'loops/recipes/design-plan-to-prototype.loop.md',
    'loops/recipes/definition-sync.loop.md',
    'memory/policies/artifact-consistency-policy.zh.md',
    'memory/policies/artifact-cleanup-policy.zh.md',
    'contract_review',
    'evidence_review',
    'design_review',
    'prototype_design_evidence_review',
    'prototype_to_spec_review',
    'definition_drift_review',
    'release_readiness',
    'skill_quality_review',
    'agent_navigability_review',
    'not_reviewable',
    'review_mode',
    'evidence_audit',
    'design_consistency_audit',
    'product_logic_containment_audit',
    'design_plan_audit',
    'prototype_design_evidence_audit',
    'prototype_to_spec_audit',
    'definition_drift_check',
    'definition_sync_audit',
    'artifact_hygiene_audit',
    'artifact_index_update_proposal',
    'skill_quality_audit',
    'agent_navigability_audit',
    'usage_metrics_v2',
    'no_op',
    'sediment',
    'sprawl',
    'context_load',
    'progressive_disclosure',
    'completion_criterion',
    'source_of_truth_boundary',
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
    'prototype_intent',
    'intent_lifecycle',
    'throwaway_question_probe',
    'durable_product_demo',
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
    'prototype_intent',
    'intent_lifecycle',
    'throwaway_question_probe',
    'coded_reference',
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
    'delegation_mode',
    'slice_plan',
    'hitl_checkpoints',
    'verification_policy',
    'vertical_slice',
    'tracer_bullet',
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
    'skill_quality_review',
    'agent_navigability_review',
    'usage_metrics_v2',
    'verification provenance',
    '组件一致性',
    '状态覆盖',
    'mock/demo',
  ],
};

const deliveryKernelExpectations = {
  'docs/delivery-kernel.md': [
    'Delivery Kernel',
    '横切协议',
    '不是新的 core skill',
    '新建模式',
    '迭代模式',
    '重塑模式',
    'create',
    'improve',
    'reframe',
    '没有稳定基线，用新建',
    'Module Execution Pack',
    'Change Contract',
    'Definition Drift Check',
    '中文优先',
    'M7',
    'M8',
    'M9',
  ],
  'loops/recipes/definition-sync.loop.md': [
    'Purpose',
    'Trigger',
    'Entry Conditions',
    'Context Sources',
    'Steps',
    'Output Contract',
    'Stop Conditions',
    'Handoff Rules',
    'Quality Gates',
    'Implementation Adjustment',
    'Spec Gap',
    'Requirement Change',
    'Conflict / Contradiction',
    'definition_sync_report',
  ],
  'templates/module-execution-pack/template.md': [
    'artifact_type: module_execution_pack',
    'delivery_mode: create | reframe',
    'non_goals',
    'acceptance',
    'verification',
    'definition_sync',
    'handoff_targets',
  ],
  'templates/change-contract/template.md': [
    'artifact_type: change_contract',
    'delivery_mode: improve',
    'current_baseline',
    'non_goals',
    'acceptance',
    'verification',
    'definition_sync',
    'handoff_targets',
  ],
  'templates/branch-state/template.md': [
    'artifact_type: branch_state',
    'delivery_mode: create | improve | reframe | unknown',
    'frozen_decisions',
    'non_goals',
    'acceptance',
    'verification',
    'definition_sync',
    'handoff_note',
  ],
  'templates/definition-drift-check/template.md': [
    'artifact_type: definition_drift_check',
    'delivery_mode: create | improve | reframe | unknown',
    'actual_delivery',
    'non_goals',
    'acceptance',
    'verification',
    'definition_sync',
    'can_enter_review',
  ],
};


const deliveryKernelV02Expectations = {
  'AGENTS.md': [
    'Repository Purpose',
    'Source-of-Truth Discipline',
    'Done Means',
    'Release Seal',
    '不新增第 9 个 core skill',
    'Branch State 只记录当前分支运行状态',
  ],
  'CLAUDE.md': [
    'Claude Code Project Shim',
    '不是新的长期 source of truth',
    'AGENTS.md',
    'docs/source-of-truth-map.md',
    'active core skills 必须保持 8 个',
    '不要新增第 9 个 core skill',
    '不自动发布 npm',
    'docs/release-*',
    'npm run validate:builder-os',
  ],
  'docs/source-of-truth-map.md': [
    'Question / Concern',
    'Source of Truth',
    'Do Not Duplicate In',
    'Claude Code source checkout 如何进入本仓库',
    'What are delivery modes?',
    'How does routing work?',
    'What is a Module Execution Pack?',
    'What is a Change Contract?',
    'What is Branch State?',
    'How is definition drift handled?',
    'How are task complexity and response weight chosen?',
    'Where do small-change scope boundary fields live?',
    'How is skill load policy represented?',
    'What is artifact lifecycle policy for handoff, Branch State and Decision Record?',
    'How should builder skill quality be reviewed?',
    'Where do Agent task rules live?',
    'Where do review gates live?',
    'What does Release Seal prove?',
    'Where do PMS domain rules live?',
    'Where do schema / eval expectations live?',
    'Branch State 是分支运行状态缓存，不是长期 source of truth',
    'Decision Record 只在 hard-to-reverse',
  ],
  'skills/builder-router/SKILL.md': [
    'Delivery Decision 判断',
    'delivery_decision',
    'primary_mode',
    'secondary_mode',
    'confidence',
    'required_first_artifacts',
    'required_first_artifact',
    'mode_switch_conditions',
    'improve_with_reframe_risk',
    'create_with_brownfield_references',
    'reframe_blocked_until_target_shape',
    'docs/source-of-truth-map.md',
  ],
  'skills/builder-spec/SKILL.md': [
    'Profile Selection',
    'spec_output_profile',
    'minimal_change_contract',
    'full_change_contract',
    'minimal_execution_pack',
    'full_execution_pack',
    'high_fidelity_new_module_with_unclear_target_shape',
    'runtime_demo_with_production_boundary_risk',
    'minimal_with_open_questions',
    'micro_note',
    'lite_change_contract',
    'standard_change_contract',
    'allowed_files_or_areas',
    'max_expected_files_touched',
    'requires_human_approval_if',
    'reframe_risk',
  ],
  'skills/builder-agent-task/SKILL.md': [
    'Branch State Policy',
    'branch_state_policy',
    'path_policy',
    'preferred_path',
    'fallback_path',
    'project_agents_md_override',
    'require_human_acceptance_before_creating_new_state_directory',
    'create_before_implementation',
    'before_context_compaction',
    'after_user_decision',
    'before_handoff',
    'merge_disposition',
    'delegation_mode',
    'slice_plan',
    'hitl_checkpoints',
    'verification_policy',
    'vertical_slice',
    'tracer_bullet',
  ],
  'skills/builder-review/SKILL.md': [
    'Review Profile',
    'review_profile',
    'profile_required_sections',
    'quick_change_review',
    'prototype_review',
    'definition_drift_review',
    'release_readiness',
    'skill_quality_review',
    'agent_navigability_review',
    'usage_metrics_v2',
    'no_op',
    'sediment',
    'sprawl',
    'context_load',
    'mode_switch_assessment',
    'branch_state_audit',
    'should_switch_mode',
    '不能直接',
  ],
  'loops/recipes/definition-sync.loop.md': [
    'Branch State Runtime Protocol',
    'mode_switch_assessment',
    'branch_state_audit',
    'should_switch_mode',
    'Branch State 不是长期 source of truth',
  ],
  'templates/module-execution-pack/template.md': [
    'Human Decision Summary',
    'Agent Execution Contract',
    'spec_output_profile',
    'minimal_execution_pack',
    'full_execution_pack',
    'high_fidelity_new_module_with_unclear_target_shape',
    'runtime_demo_with_production_boundary_risk',
    'allowed_degradation',
  ],
  'templates/change-contract/template.md': [
    'Human Decision Summary',
    'Agent Execution Contract',
    'spec_output_profile',
    'minimal_change_contract',
    'full_change_contract',
    'high_fidelity_new_module_with_unclear_target_shape',
    'runtime_demo_with_production_boundary_risk',
    'reframe_risk_detected',
    'allowed_files_or_areas',
    'max_expected_files_touched',
    'requires_human_approval_if',
    'agents_md_update_policy',
  ],
  'templates/branch-state/template.md': [
    'Human Decision Summary',
    'Agent Execution Contract',
    'runtime_protocol',
    'path_policy',
    'preferred_path',
    'fallback_path',
    'project_agents_md_override',
    'require_human_acceptance_before_creating_new_state_directory',
    'before_context_compaction',
    'rejected_directions_do_not_retry',
    'migrate_stable_decisions_to_source_of_truth',
  ],
  'templates/definition-drift-check/template.md': [
    'Human Decision Summary',
    'Agent Execution Contract',
    'mode_switch_assessment',
    'original_mode',
    'actual_mode',
    'should_switch_mode',
    'recommended_next_artifact',
  ],
  'templates/agent-task-packet/template.md': [
    'branch_state_policy',
    'path_policy',
    'preferred_path',
    'fallback_path',
    'create_before_implementation',
    'before_context_compaction',
    'after_scope_change',
    'merge_disposition',
    'delegation_mode',
    'slice_plan',
    'hitl_checkpoints',
    'verification_policy',
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
  'docs/release-seal-m6-delivery-kernel.md': [
    'M6-M9 Delivery Kernel',
    'PASS_FOR_LOCAL_TRIAL',
    'create',
    'improve',
    'reframe',
    'Module Execution Pack',
    'Change Contract',
    'Branch State',
    'Definition Sync Loop',
    'Implementation Adjustment',
    'Spec Gap',
    'Requirement Change',
    'Conflict / Contradiction',
    'C:\\Users\\max.ling\\.agents\\skills',
    '不执行真实 `npm publish`',
    '不创建或推送 git tag',
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
    'delivery_mode',
    'task_complexity',
    'response_profile',
    'contract_profile',
    'context_strategy',
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
    'delivery_mode',
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
    'definition_sync',
    'next_skill_hint',
    'next_skill_input',
  ],
  'evals/output-contract/builder-prototype.schema.json': [
    'prototype_mode',
    'prototype_intent',
    'intent_lifecycle',
    'delivery_mode',
    'artifact_path',
    'fidelity',
    'covered_flows',
    'states_covered',
    'gaps',
    'verification',
    'definition_sync',
    'next',
  ],
  'evals/output-contract/agent-task-packet.schema.json': [
    'readiness_gate',
    'reroute_recommendation',
    'task_name',
    'background',
    'desired_outcome',
    'delivery_mode',
    'scope',
    'non_goals',
    'context_sources',
    'target_runtime',
    'recommended_mode',
    'delegation_mode',
    'slice_plan',
    'hitl_checkpoints',
    'verification_policy',
    'runtime_constraints',
    'acceptance_criteria',
    'verification',
    'artifact_index_update_proposal',
    'branch_state_policy',
    'human_approval_gates',
    'risks',
    'blocked_stop_condition',
    'definition_sync',
    'next_skill_input',
    'handoff_packet',
  ],
  'evals/output-contract/builder-review.schema.json': [
    'review_mode',
    'review_profile',
    'review_target',
    'contract_checked',
    'findings',
    'evidence_audit',
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

function validateActiveSkillRuntimeReferences(failures) {
  for (const skillName of builderSkills) {
    const relativePath = path.join('skills', skillName, 'SKILL.md');
    const content = read(relativePath);
    assert(!/skills\/builder-[^`\s]+\/references\//.test(content), `${relativePath} 不得引用 source-only builder private references 路径`, failures);
    assert(!/skills\/pm-[^`\s]+/.test(content), `${relativePath} 不得引用 legacy skills/pm-* 路径`, failures);
    assert(!/C:\\Users\\max\.ling/.test(content), `${relativePath} 不得包含本机绝对路径`, failures);
  }
}

function validateInstallerSafeArgs(failures) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-builder-os-installer-safe-'));
  const tempHome = path.join(tempRoot, 'home');
  const tempProject = path.join(tempRoot, 'project');
  fs.mkdirSync(tempHome, { recursive: true });
  fs.mkdirSync(tempProject, { recursive: true });

  const env = {
    ...process.env,
    HOME: tempHome,
    USERPROFILE: tempHome,
    CODEX_HOME: path.join(tempRoot, 'codex-home'),
  };
  const installScriptPath = path.join(root, 'install.js');

  function assertNoInstallArtifacts(label) {
    for (const baseDir of [tempHome, tempProject, env.CODEX_HOME]) {
      for (const entry of ['.agents', '.claude', '.codex']) {
        assert(
          !fs.existsSync(path.join(baseDir, entry)),
          `${label} 不应创建 ${path.join(baseDir, entry)}`,
          failures,
        );
      }
    }
  }

  try {
    execFileSync(process.execPath, [installScriptPath, '--help'], {
      cwd: tempProject,
      env,
      stdio: 'pipe',
    });
    assertNoInstallArtifacts('install.js --help');

    execFileSync(process.execPath, [installScriptPath, '--version'], {
      cwd: tempProject,
      env,
      stdio: 'pipe',
    });
    assertNoInstallArtifacts('install.js --version');

    let unknownArgFailed = false;
    try {
      execFileSync(process.execPath, [installScriptPath, '--not-a-real-option'], {
        cwd: tempProject,
        env,
        stdio: 'pipe',
      });
    } catch {
      unknownArgFailed = true;
    }
    assert(unknownArgFailed, 'install.js unknown args 必须失败退出', failures);
    assertNoInstallArtifacts('install.js unknown args');
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

const failures = [];

for (const relativePath of requiredFiles) {
  assert(fs.existsSync(path.join(root, relativePath)), `缺少必需文件: ${relativePath}`, failures);
}

if (fs.existsSync(path.join(root, '.git'))) {
  for (const relativePath of ['AGENTS.md', 'docs/source-of-truth-map.md']) {
    try {
      execFileSync('git', ['ls-files', '--error-unmatch', relativePath], { cwd: root, stdio: 'ignore' });
    } catch {
      failures.push(`必需文件未纳入 git tracking: ${relativePath}`);
    }
  }
}

validateActiveSkillRuntimeReferences(failures);

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
assert(builderSkills.length === 8, `builderSkills 清单必须保持 8 个，当前: ${builderSkills.length}`, failures);
assert(activeSkillDirs.length === 8, `skills/ active builder skill 必须保持 8 个，当前: ${activeSkillDirs.length}`, failures);
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

for (const [relativePath, expectedTerms] of Object.entries(deliveryKernelExpectations)) {
  const content = read(relativePath);
  for (const term of expectedTerms) {
    assert(content.includes(term), `${relativePath} 缺少 Delivery Kernel v0.1 内容: ${term}`, failures);
  }
}

for (const [relativePath, expectedTerms] of Object.entries(deliveryKernelV02Expectations)) {
  const content = read(relativePath);
  for (const term of expectedTerms) {
    assert(content.includes(term), `${relativePath} 缺少 Delivery Kernel v0.2 内容: ${term}`, failures);
  }
}

for (const relativePath of [
  'skills/builder-spec/SKILL.md',
  'templates/module-execution-pack/template.md',
  'templates/change-contract/template.md',
]) {
  const content = read(relativePath);
  assert(
    !content.includes('high_fidelity_prototype_or_runtime_demo'),
    `${relativePath} 不应使用泛化 full profile 触发词 high_fidelity_prototype_or_runtime_demo`,
    failures,
  );
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
  for (const field of ['plan_prompt', 'goal_prompt', 'design_brief', 'design_constraints', 'ui_states', 'design_plan', 'ui_content_boundary', 'business_rule_notes', 'rule_notes_placement', 'non_ui_explanations', 'prototype_evidence_requirements', 'product_logic_containment_gate', 'design_consistency_gate', 'module_execution_pack', 'change_contract', 'branch_state', 'definition_drift_check']) {
    assert(agentTaskContract.optional.includes(field), `agent-task-packet optional 缺少 ${field}`, failures);
  }
}
for (const field of ['delegation_mode', 'slice_plan', 'hitl_checkpoints', 'verification_policy']) {
  assert(agentTaskContract.required.includes(field), `agent-task-packet required 缺少执行纪律字段: ${field}`, failures);
}
assert(Array.isArray(agentTaskContract.branch_state_policy_required), 'agent-task-packet schema 必须包含 branch_state_policy_required 数组', failures);
if (Array.isArray(agentTaskContract.branch_state_policy_required)) {
  for (const field of ['required', 'path_policy', 'file_path', 'create_before_implementation', 'update_triggers', 'recovery_instruction', 'merge_disposition']) {
    assert(agentTaskContract.branch_state_policy_required.includes(field), `agent-task-packet branch_state_policy_required 缺少 ${field}`, failures);
  }
}
assert(Array.isArray(agentTaskContract.branch_state_path_policy_required), 'agent-task-packet schema 必须包含 branch_state_path_policy_required 数组', failures);
if (Array.isArray(agentTaskContract.branch_state_path_policy_required)) {
  for (const field of ['preferred_path', 'fallback_path', 'project_agents_md_override', 'require_human_acceptance_before_creating_new_state_directory']) {
    assert(agentTaskContract.branch_state_path_policy_required.includes(field), `agent-task-packet branch_state_path_policy_required 缺少 ${field}`, failures);
  }
}
assert(Array.isArray(agentTaskContract.branch_state_update_triggers), 'agent-task-packet schema 必须包含 branch_state_update_triggers 数组', failures);
if (Array.isArray(agentTaskContract.branch_state_update_triggers)) {
  for (const trigger of ['before_context_compaction', 'after_user_decision', 'after_scope_change', 'after_acceptance_change', 'after_major_milestone', 'after_verification', 'before_handoff']) {
    assert(agentTaskContract.branch_state_update_triggers.includes(trigger), `agent-task-packet branch_state_update_triggers 缺少 ${trigger}`, failures);
  }
}
assert(Array.isArray(agentTaskContract.delivery_mode_values), 'agent-task-packet schema 必须包含 delivery_mode_values 数组', failures);
if (Array.isArray(agentTaskContract.delivery_mode_values)) {
  for (const value of ['create', 'improve', 'reframe', 'unknown', 'not_applicable']) {
    assert(agentTaskContract.delivery_mode_values.includes(value), `agent-task-packet delivery_mode_values 缺少 ${value}`, failures);
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
assert(Array.isArray(agentTaskContract.delegation_mode_values), 'agent-task-packet schema 必须包含 delegation_mode_values 数组', failures);
if (Array.isArray(agentTaskContract.delegation_mode_values)) {
  for (const value of ['afk_ready', 'hitl_checkpoint_required', 'blocked']) {
    assert(agentTaskContract.delegation_mode_values.includes(value), `agent-task-packet delegation_mode_values 缺少 ${value}`, failures);
  }
}
assert(Array.isArray(agentTaskContract.slice_strategy_values), 'agent-task-packet schema 必须包含 slice_strategy_values 数组', failures);
if (Array.isArray(agentTaskContract.slice_strategy_values)) {
  for (const value of ['vertical_slice', 'tracer_bullet', 'horizontal_layer', 'investigation_only']) {
    assert(agentTaskContract.slice_strategy_values.includes(value), `agent-task-packet slice_strategy_values 缺少 ${value}`, failures);
  }
}
assert(Array.isArray(agentTaskContract.verification_policy_required), 'agent-task-packet schema 必须包含 verification_policy_required 数组', failures);
if (Array.isArray(agentTaskContract.verification_policy_required)) {
  for (const field of ['minimum_checks', 'observable_evidence', 'cannot_claim_done_without']) {
    assert(agentTaskContract.verification_policy_required.includes(field), `agent-task-packet verification_policy_required 缺少 ${field}`, failures);
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
assert(Array.isArray(builderRouterContract.delivery_mode_values), 'builder-router schema 必须包含 delivery_mode_values 数组', failures);
if (Array.isArray(builderRouterContract.delivery_mode_values)) {
  for (const value of ['create', 'improve', 'reframe', 'unknown', 'not_applicable']) {
    assert(builderRouterContract.delivery_mode_values.includes(value), `builder-router delivery_mode_values 缺少 ${value}`, failures);
  }
}
assert(Array.isArray(builderRouterContract.task_complexity_values), 'builder-router schema 必须包含 task_complexity_values 数组', failures);
if (Array.isArray(builderRouterContract.task_complexity_values)) {
  for (const value of ['micro', 'lite', 'standard', 'full']) {
    assert(builderRouterContract.task_complexity_values.includes(value), `builder-router task_complexity_values 缺少 ${value}`, failures);
  }
}
assert(Array.isArray(builderRouterContract.response_profile_values), 'builder-router schema 必须包含 response_profile_values 数组', failures);
if (Array.isArray(builderRouterContract.response_profile_values)) {
  for (const value of ['terse', 'normal', 'audit']) {
    assert(builderRouterContract.response_profile_values.includes(value), `builder-router response_profile_values 缺少 ${value}`, failures);
  }
}
assert(Array.isArray(builderRouterContract.contract_profile_values), 'builder-router schema 必须包含 contract_profile_values 数组', failures);
if (Array.isArray(builderRouterContract.contract_profile_values)) {
  for (const value of ['none', 'micro_note', 'lite_change_contract', 'standard_change_contract', 'full_change_contract']) {
    assert(builderRouterContract.contract_profile_values.includes(value), `builder-router contract_profile_values 缺少 ${value}`, failures);
  }
}
assert(Array.isArray(builderRouterContract.context_strategy_values), 'builder-router schema 必须包含 context_strategy_values 数组', failures);
if (Array.isArray(builderRouterContract.context_strategy_values)) {
  for (const value of ['direct_answer', 'direct_contract', 'grill_first', 'prototype_question_first', 'handoff_required', 'branch_state_required', 'review_first']) {
    assert(builderRouterContract.context_strategy_values.includes(value), `builder-router context_strategy_values 缺少 ${value}`, failures);
  }
}
assert(builderRouterContract.display_policy && typeof builderRouterContract.display_policy === 'object', 'builder-router schema 必须包含 display_policy 对象', failures);
if (builderRouterContract.display_policy && typeof builderRouterContract.display_policy === 'object') {
  for (const profile of ['terse', 'normal', 'audit']) {
    assert(Array.isArray(builderRouterContract.display_policy[profile]), `builder-router display_policy 缺少 ${profile}`, failures);
  }
  const terseDisplay = Array.isArray(builderRouterContract.display_policy.terse) ? builderRouterContract.display_policy.terse : [];
  for (const field of ['requirement_understanding', 'delivery_mode', 'task_complexity', 'contract_profile', 'next_step']) {
    assert(terseDisplay.includes(field), `builder-router terse display_policy 缺少 ${field}`, failures);
  }
  const auditDisplay = Array.isArray(builderRouterContract.display_policy.audit) ? builderRouterContract.display_policy.audit : [];
  for (const field of ['delivery_decision', 'usage_metrics', 'memory_or_evidence_references']) {
    assert(auditDisplay.includes(field), `builder-router audit display_policy 缺少 ${field}`, failures);
  }
}
assert(Array.isArray(builderRouterContract.delivery_decision_required), 'builder-router schema 必须包含 delivery_decision_required 数组', failures);
if (Array.isArray(builderRouterContract.delivery_decision_required)) {
  for (const field of ['primary_mode', 'secondary_mode', 'confidence', 'required_first_artifacts', 'why_not_other_modes', 'mode_switch_conditions', 'stop_conditions']) {
    assert(builderRouterContract.delivery_decision_required.includes(field), `builder-router delivery_decision_required 缺少 ${field}`, failures);
  }
}
assert(!builderRouterContract.delivery_decision_required.includes('required_first_artifact'), 'builder-router delivery_decision_required 不应再要求 legacy required_first_artifact', failures);
assert(Array.isArray(builderRouterContract.delivery_decision_compatibility_fields), 'builder-router schema 必须包含 delivery_decision_compatibility_fields 数组', failures);
if (Array.isArray(builderRouterContract.delivery_decision_compatibility_fields)) {
  assert(builderRouterContract.delivery_decision_compatibility_fields.includes('required_first_artifact'), 'builder-router compatibility fields 必须保留 required_first_artifact', failures);
}
assert(Array.isArray(builderRouterContract.required_first_artifacts_values), 'builder-router schema 必须包含 required_first_artifacts_values 数组', failures);
if (Array.isArray(builderRouterContract.required_first_artifacts_values)) {
  for (const value of ['module_execution_pack', 'change_contract', 'asset_digestion', 'target_shape', 'branch_state', 'none']) {
    assert(builderRouterContract.required_first_artifacts_values.includes(value), `builder-router required_first_artifacts_values 缺少 ${value}`, failures);
  }
}
assert(Array.isArray(builderRouterContract.hybrid_patterns), 'builder-router schema 必须包含 hybrid_patterns 数组', failures);
if (Array.isArray(builderRouterContract.hybrid_patterns)) {
  for (const pattern of ['improve_with_reframe_risk', 'create_with_brownfield_references', 'reframe_blocked_until_target_shape']) {
    assert(builderRouterContract.hybrid_patterns.includes(pattern), `builder-router hybrid_patterns 缺少 ${pattern}`, failures);
  }
}
assert(Array.isArray(builderRouterContract.required_reference_files), 'builder-router schema 必须包含 required_reference_files 数组', failures);
if (Array.isArray(builderRouterContract.required_reference_files)) {
  for (const fileName of [
    'kernel/routing/builder-router.zh.md',
    'kernel/routing/skill-selection-rules.zh.md',
    'loops/recipes/grill-decision.loop.md',
    'docs/delivery-kernel.md',
    'docs/source-of-truth-map.md',
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
  for (const field of ['prototype_mode', 'prototype_intent', 'intent_lifecycle', 'delivery_mode', 'visual_target', 'artifact_path', 'fidelity', 'covered_flows', 'states_covered', 'gaps', 'runnable_evidence', 'verification', 'definition_sync', 'next']) {
    assert(builderPrototypeContract.required.includes(field), `builder-prototype required 缺少 ${field}`, failures);
  }
}
assert(Array.isArray(builderPrototypeContract.delivery_mode_values), 'builder-prototype schema 必须包含 delivery_mode_values 数组', failures);
if (Array.isArray(builderPrototypeContract.delivery_mode_values)) {
  for (const value of ['create', 'improve', 'reframe', 'unknown', 'not_applicable']) {
    assert(builderPrototypeContract.delivery_mode_values.includes(value), `builder-prototype delivery_mode_values 缺少 ${value}`, failures);
  }
}
assert(Array.isArray(builderPrototypeContract.prototype_mode_values), 'builder-prototype schema 必须包含 prototype_mode_values 数组', failures);
if (Array.isArray(builderPrototypeContract.prototype_mode_values)) {
  for (const value of ['prototype_first', 'boundary_first', 'spec_first', 'runnable_prototype', 'wireframe', 'prototype_brief', 'degraded_prototype']) {
    assert(builderPrototypeContract.prototype_mode_values.includes(value), `builder-prototype prototype_mode_values 缺少 ${value}`, failures);
  }
}
assert(Array.isArray(builderPrototypeContract.prototype_intent_values), 'builder-prototype schema 必须包含 prototype_intent_values 数组', failures);
if (Array.isArray(builderPrototypeContract.prototype_intent_values)) {
  for (const value of ['throwaway_question_probe', 'durable_product_demo', 'visual_variation_experiment', 'coded_reference']) {
    assert(builderPrototypeContract.prototype_intent_values.includes(value), `builder-prototype prototype_intent_values 缺少 ${value}`, failures);
  }
}
assert(Array.isArray(builderPrototypeContract.intent_lifecycle_required), 'builder-prototype schema 必须包含 intent_lifecycle_required 数组', failures);
if (Array.isArray(builderPrototypeContract.intent_lifecycle_required)) {
  for (const field of ['retain_until', 'absorb_into', 'deletion_or_archive_rule', 'review_required']) {
    assert(builderPrototypeContract.intent_lifecycle_required.includes(field), `builder-prototype intent_lifecycle_required 缺少 ${field}`, failures);
  }
}
assert(Array.isArray(builderPrototypeContract.visual_target_type_values), 'builder-prototype schema 必须包含 visual_target_type_values 数组', failures);
if (Array.isArray(builderPrototypeContract.visual_target_type_values)) {
  for (const value of ['none', 'brief_only', 'source_image', 'source_url', 'existing_code', 'generated_option', 'not_required']) {
    assert(builderPrototypeContract.visual_target_type_values.includes(value), `builder-prototype visual_target_type_values 缺少 ${value}`, failures);
  }
}
assert(Array.isArray(builderPrototypeContract.runnable_evidence_fields), 'builder-prototype schema 必须包含 runnable_evidence_fields 数组', failures);
if (Array.isArray(builderPrototypeContract.runnable_evidence_fields)) {
  for (const field of ['run_command', 'preview_url', 'screenshot_path', 'viewport', 'state', 'design_qa']) {
    assert(builderPrototypeContract.runnable_evidence_fields.includes(field), `builder-prototype runnable_evidence_fields 缺少 ${field}`, failures);
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
  for (const field of ['review_mode', 'review_profile', 'review_target', 'contract_checked', 'findings', 'evidence_audit', 'risk_assessment', 'decision', 'required_fixes', 'unverified_areas', 'next_step']) {
    assert(builderReviewContract.required.includes(field), `builder-review required 缺少核心字段 ${field}`, failures);
  }
  for (const heavyField of ['prototype_design_evidence_audit', 'prototype_to_spec_audit', 'definition_drift_check', 'definition_sync_audit', 'mode_switch_assessment', 'branch_state_audit', 'artifact_hygiene_audit', 'artifact_index_update_proposal']) {
    assert(!builderReviewContract.required.includes(heavyField), `builder-review required 不应默认要求全量 audit 字段: ${heavyField}`, failures);
  }
}
assert(Array.isArray(builderReviewContract.review_profile_values), 'builder-review schema 必须包含 review_profile_values 数组', failures);
if (Array.isArray(builderReviewContract.review_profile_values)) {
  for (const value of ['quick_change_review', 'prototype_review', 'definition_drift_review', 'skill_quality_review', 'agent_navigability_review', 'release_readiness']) {
    assert(builderReviewContract.review_profile_values.includes(value), `builder-review review_profile_values 缺少 ${value}`, failures);
  }
}
assert(Array.isArray(builderReviewContract.mode_switch_assessment_required), 'builder-review schema 必须包含 mode_switch_assessment_required 数组', failures);
if (Array.isArray(builderReviewContract.mode_switch_assessment_required)) {
  for (const field of ['original_mode', 'actual_mode', 'should_switch_mode', 'reason', 'recommended_next_artifact']) {
    assert(builderReviewContract.mode_switch_assessment_required.includes(field), `builder-review mode_switch_assessment_required 缺少 ${field}`, failures);
  }
}
assert(builderReviewContract.review_profile_required_sections && typeof builderReviewContract.review_profile_required_sections === 'object', 'builder-review schema 必须包含 review_profile_required_sections 对象', failures);
if (builderReviewContract.review_profile_required_sections && typeof builderReviewContract.review_profile_required_sections === 'object') {
  const profileSections = builderReviewContract.review_profile_required_sections;
  for (const profile of ['quick_change_review', 'prototype_review', 'definition_drift_review', 'skill_quality_review', 'agent_navigability_review', 'release_readiness']) {
    assert(Array.isArray(profileSections[profile]), `builder-review review_profile_required_sections 缺少 ${profile}`, failures);
  }
  const quickSections = Array.isArray(profileSections.quick_change_review) ? profileSections.quick_change_review : [];
  for (const field of ['findings', 'evidence_audit', 'risk_assessment', 'decision', 'required_fixes', 'unverified_areas', 'next_step']) {
    assert(quickSections.includes(field), `quick_change_review required sections 缺少 ${field}`, failures);
  }
  for (const heavyField of ['prototype_design_evidence_audit', 'definition_sync_audit', 'artifact_hygiene_audit', 'artifact_index_update_proposal']) {
    assert(!quickSections.includes(heavyField), `quick_change_review 不应默认要求 ${heavyField}`, failures);
  }
  const prototypeSections = Array.isArray(profileSections.prototype_review) ? profileSections.prototype_review : [];
  for (const field of ['design_consistency_audit', 'product_logic_containment_audit', 'prototype_design_evidence_audit']) {
    assert(prototypeSections.includes(field), `prototype_review required sections 缺少 ${field}`, failures);
  }
  const driftSections = Array.isArray(profileSections.definition_drift_review) ? profileSections.definition_drift_review : [];
  for (const field of ['definition_drift_check', 'definition_sync_audit', 'mode_switch_assessment', 'branch_state_audit']) {
    assert(driftSections.includes(field), `definition_drift_review required sections 缺少 ${field}`, failures);
  }
  const releaseSections = Array.isArray(profileSections.release_readiness) ? profileSections.release_readiness : [];
  for (const field of ['branch_state_audit', 'artifact_hygiene_audit', 'artifact_index_update_proposal', 'risk_assessment']) {
    assert(releaseSections.includes(field), `release_readiness required sections 缺少 ${field}`, failures);
  }
  const skillQualitySections = Array.isArray(profileSections.skill_quality_review) ? profileSections.skill_quality_review : [];
  for (const field of ['skill_quality_audit', 'usage_metrics_v2', 'risk_assessment', 'decision']) {
    assert(skillQualitySections.includes(field), `skill_quality_review required sections 缺少 ${field}`, failures);
  }
  const agentNavigabilitySections = Array.isArray(profileSections.agent_navigability_review) ? profileSections.agent_navigability_review : [];
  for (const field of ['agent_navigability_audit', 'usage_metrics_v2', 'risk_assessment', 'decision']) {
    assert(agentNavigabilitySections.includes(field), `agent_navigability_review required sections 缺少 ${field}`, failures);
  }
}
assert(Array.isArray(builderReviewContract.review_mode_values), 'builder-review schema 必须包含 review_mode_values 数组', failures);
if (Array.isArray(builderReviewContract.review_mode_values)) {
  for (const value of ['contract_review', 'evidence_review', 'design_review', 'prototype_design_evidence_review', 'prototype_to_spec_review', 'definition_drift_review', 'skill_quality_review', 'agent_navigability_review', 'release_readiness', 'not_reviewable']) {
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
  for (const field of ['cleanup_proposal', 'design_plan_audit', 'design_consistency_audit', 'product_logic_containment_audit', 'prototype_design_evidence_audit', 'prototype_to_spec_audit', 'definition_drift_check', 'definition_sync_audit', 'mode_switch_assessment', 'branch_state_audit', 'artifact_hygiene_audit', 'artifact_index_update_proposal', 'skill_quality_audit', 'agent_navigability_audit', 'usage_metrics_v2']) {
    assert(builderReviewContract.optional.includes(field), `builder-review optional 缺少 ${field}`, failures);
  }
}
for (const [fieldName, expectedFields] of Object.entries({
  skill_quality_audit_fields: ['no_op', 'sediment', 'sprawl', 'context_load', 'progressive_disclosure', 'completion_criterion', 'source_of_truth_boundary'],
  agent_navigability_audit_fields: ['route_clarity', 'artifact_lifecycle', 'installed_surface', 'profile_visibility', 'blocked_recovery'],
  usage_metrics_v2_fields: ['source_requirement_lines', 'response_output_lines', 'contract_output_lines', 'references_loaded_count', 'expected_files_touched', 'files_touched', 'files_outside_allowed_scope', 'implementation_rounds', 'review_rounds', 'branch_state_required', 'docs_updated'],
})) {
  assert(Array.isArray(builderReviewContract[fieldName]), `builder-review schema 必须包含 ${fieldName} 数组`, failures);
  if (Array.isArray(builderReviewContract[fieldName])) {
    for (const field of expectedFields) {
      assert(builderReviewContract[fieldName].includes(field), `builder-review ${fieldName} 缺少 ${field}`, failures);
    }
  }
}
assert(Array.isArray(builderReviewContract.required_reference_files), 'builder-review schema 必须包含 required_reference_files 数组', failures);
if (Array.isArray(builderReviewContract.required_reference_files)) {
  for (const fileName of [
    'kernel/gates/product-logic-containment-gate.zh.md',
    'docs/delivery-kernel.md',
    'references/prototype-to-spec-review.zh.md',
    'references/prototype-design-evidence-review.zh.md',
    'references/prototype-to-spec.zh.md',
    'loops/recipes/design-plan-to-prototype.loop.md',
    'loops/recipes/artifact-hygiene.loop.md',
    'loops/recipes/definition-sync.loop.md',
    'templates/definition-drift-check/template.md',
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
  for (const field of ['design_brief', 'ui_states', 'interaction_requirements', 'responsive_requirements', 'accessibility_notes', 'ui_content_boundary', 'business_rule_notes', 'rule_notes_placement', 'non_ui_explanations', 'source_prototype', 'extracted_from_prototype', 'prototype_gaps', 'prototype_verification', 'visual_target', 'runnable_evidence', 'design_evidence', 'module_execution_pack', 'change_contract', 'allowed_files_or_areas', 'max_expected_files_touched', 'requires_human_approval_if', 'reframe_risk']) {
    assert(builderSpecContract.optional.includes(field), `builder-spec optional 缺少 ${field}`, failures);
  }
}
assert(Array.isArray(builderSpecContract.spec_output_profile_values), 'builder-spec schema 必须包含 spec_output_profile_values 数组', failures);
if (Array.isArray(builderSpecContract.spec_output_profile_values)) {
  for (const value of ['micro_note', 'lite_change_contract', 'minimal_change_contract', 'standard_change_contract', 'full_change_contract', 'minimal_execution_pack', 'full_execution_pack', 'prototype_to_spec', 'engineering_request']) {
    assert(builderSpecContract.spec_output_profile_values.includes(value), `builder-spec spec_output_profile_values 缺少 ${value}`, failures);
  }
}
assert(Array.isArray(builderSpecContract.spec_type_values), 'builder-spec schema 必须包含 spec_type_values 数组', failures);
if (Array.isArray(builderSpecContract.spec_type_values)) {
  for (const value of ['mini_spec', 'prd', 'engineering_request', 'agent_readable_spec', 'prototype_to_spec', 'module_execution_pack', 'change_contract']) {
    assert(builderSpecContract.spec_type_values.includes(value), `builder-spec spec_type_values 缺少 ${value}`, failures);
  }
}
assert(Array.isArray(builderSpecContract.delivery_mode_values), 'builder-spec schema 必须包含 delivery_mode_values 数组', failures);
if (Array.isArray(builderSpecContract.delivery_mode_values)) {
  for (const value of ['create', 'improve', 'reframe', 'unknown', 'not_applicable']) {
    assert(builderSpecContract.delivery_mode_values.includes(value), `builder-spec delivery_mode_values 缺少 ${value}`, failures);
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
assert(Array.isArray(builderSpecContract.reframe_risk_values), 'builder-spec schema 必须包含 reframe_risk_values 数组', failures);
if (Array.isArray(builderSpecContract.reframe_risk_values)) {
  for (const value of ['none', 'low', 'medium', 'high']) {
    assert(builderSpecContract.reframe_risk_values.includes(value), `builder-spec reframe_risk_values 缺少 ${value}`, failures);
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
assert(installScript.includes('parseArgs'), 'install.js 必须使用显式参数解析，避免 flag-only 调用落回安装', failures);
assert(installScript.includes('--help') && installScript.includes('--version'), 'install.js 必须支持无写入的 --help 和 --version', failures);
assert(installScript.includes('--overwrite'), 'install.js 必须提供显式覆盖外部 skill 的开关', failures);
assert(installScript.includes('path.resolve(process.cwd(), ".agents", "skills")'), 'install.js codex-project 必须安装到项目 .agents/skills', failures);
assert(!installScript.includes('path.resolve(process.cwd(), ".codex", "skills")'), 'install.js codex-project 不得安装到旧 .codex/skills', failures);
assert(gitignore.includes('references/source-blueprints/'), '.gitignore 必须排除本地 source blueprints 研究资料', failures);
validateInstallerSafeArgs(failures);

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
  for (const expectedCaseId of ['trigger-design-brief-from-spec', 'trigger-design-consistency-review', 'trigger-product-logic-containment-review', 'trigger-prototype-to-spec-review', 'trigger-agent-task-from-spec', 'trigger-agent-task-vertical-slice-discipline', 'trigger-decision-record-from-tradeoff']) {
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
  for (const expectedCaseId of ['trigger-prototype-first-low-risk', 'trigger-prototype-degraded-insufficient-input', 'trigger-prototype-spec-first-risk', 'trigger-prototype-high-fidelity-visual-target', 'trigger-prototype-throwaway-intent', 'trigger-prototype-missing-visual-target-degrade', 'trigger-prototype-design-evidence-review']) {
    assert(
      builderCoreTriggerCases.cases.some(item => item.id === expectedCaseId),
      `builder-core trigger eval 缺少 prototype 三路径/降级用例: ${expectedCaseId}`,
      failures
    );
  }
  for (const expectedCaseId of ['trigger-delivery-create-mode', 'trigger-delivery-improve-mode', 'trigger-lite-sidebar-icon-contract', 'trigger-delivery-reframe-mode', 'trigger-definition-drift-check', 'trigger-branch-state-required-for-long-codex-goal', 'trigger-spec-minimal-profile-default', 'trigger-full-profile-tightened-risk', 'trigger-review-profile-output-shaping', 'trigger-mode-switch-assessment-review']) {
    assert(
      builderCoreTriggerCases.cases.some(item => item.id === expectedCaseId),
      `builder-core trigger eval 缺少 Delivery Kernel 用例: ${expectedCaseId}`,
      failures
    );
  }
  assert(
    builderCoreTriggerCases.cases.some(item => item.id === 'trigger-skill-quality-review-no-op-sprawl' && item.expected_mode === 'skill_quality_review'),
    'builder-core trigger eval 缺少 skill quality review 用例',
    failures
  );
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
  for (const expectedCaseId of ['prototype-first-runnable-path', 'prototype-high-fidelity-visual-target-path', 'prototype-missing-visual-target-degrade-path', 'prototype-spec-first-risk-path']) {
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
  for (const expectedCaseId of ['delivery-create-module-execution-pack-path', 'delivery-improve-change-contract-path', 'delivery-reframe-asset-digestion-path', 'definition-drift-review-path', 'delivery-hybrid-improve-reframe-risk-path']) {
    assert(
      builderRoutingCases.cases.some(item => item.id === expectedCaseId),
      `builder routing eval 必须覆盖 Delivery Kernel 路径: ${expectedCaseId}`,
      failures
    );
  }
  const liteSidebarCase = builderRoutingCases.cases.find(item => item.id === 'complexity-lite-sidebar-icon-understanding');
  assert(liteSidebarCase, 'builder routing eval 必须覆盖 lite sidebar icon 轻量理解用例', failures);
  if (liteSidebarCase) {
    assert(liteSidebarCase.expected_task_complexity === 'lite', 'complexity-lite-sidebar-icon-understanding 必须期望 task_complexity=lite', failures);
    assert(liteSidebarCase.expected_response_profile === 'terse', 'complexity-lite-sidebar-icon-understanding 必须期望 response_profile=terse', failures);
    assert(liteSidebarCase.expected_contract_profile === 'lite_change_contract', 'complexity-lite-sidebar-icon-understanding 必须期望 contract_profile=lite_change_contract', failures);
    assert(liteSidebarCase.expected_context_strategy === 'direct_contract', 'complexity-lite-sidebar-icon-understanding 必须期望 context_strategy=direct_contract', failures);
    assert(
      liteSidebarCase.expected_delivery_decision && liteSidebarCase.expected_delivery_decision.secondary_mode === 'none',
      'complexity-lite-sidebar-icon-understanding 必须保持 secondary_mode=none',
      failures
    );
    assert(Array.isArray(liteSidebarCase.must_not_include) && liteSidebarCase.must_not_include.includes('usage_metrics by default'), 'complexity-lite-sidebar-icon-understanding 必须禁止默认 usage_metrics', failures);
  }
  const hybridRoutingCase = builderRoutingCases.cases.find(item => item.id === 'delivery-hybrid-improve-reframe-risk-path');
  if (hybridRoutingCase && hybridRoutingCase.expected_delivery_decision) {
    const requiredFirstArtifacts = hybridRoutingCase.expected_delivery_decision.required_first_artifacts;
    assert(Array.isArray(requiredFirstArtifacts), 'delivery-hybrid-improve-reframe-risk-path 必须使用 required_first_artifacts 数组', failures);
    if (Array.isArray(requiredFirstArtifacts)) {
      for (const artifact of ['change_contract', 'branch_state']) {
        assert(requiredFirstArtifacts.includes(artifact), `delivery-hybrid-improve-reframe-risk-path required_first_artifacts 缺少 ${artifact}`, failures);
      }
    }
  }
  assert(
    routingPaths.some(route => route.includes('builder-review>builder-decision')),
    'builder routing eval 必须覆盖 builder-review -> builder-decision 路径',
    failures
  );
}

const deliveryKernelCases = readJson('evals/delivery-kernel/delivery-kernel.cases.json');
assert(deliveryKernelCases.suite === 'delivery-kernel', 'delivery-kernel eval suite 必须是 delivery-kernel', failures);
assert(deliveryKernelCases.status === 'v0.2', 'delivery-kernel eval status 必须是 v0.2', failures);
assert(Array.isArray(deliveryKernelCases.cases), 'delivery-kernel eval 必须包含 cases 数组', failures);
if (Array.isArray(deliveryKernelCases.cases)) {
  const deliveryCaseIds = deliveryKernelCases.cases.map(item => item.id);
  for (const expectedCaseId of ['delivery-create-module-execution-pack', 'delivery-improve-change-contract', 'delivery-reframe-asset-digestion', 'definition-sync-drift-classes', 'delivery-hybrid-improve-with-reframe-risk', 'branch-state-runtime-protocol', 'minimal-full-profile-selection', 'mode-switch-assessment-drift', 'runtime-surface-availability', 'review-profile-output-shaping', 'complexity-aware-lite-contract', 'agent-task-execution-discipline', 'prototype-intent-lifecycle', 'skill-load-policy-runtime-neutral', 'skill-quality-review-profile']) {
    assert(deliveryCaseIds.includes(expectedCaseId), `delivery-kernel eval 缺少用例: ${expectedCaseId}`, failures);
  }
  for (const mode of ['create', 'improve', 'reframe']) {
    assert(deliveryKernelCases.cases.some(item => item.delivery_mode === mode), `delivery-kernel eval 缺少 delivery_mode: ${mode}`, failures);
  }
  for (const testCase of deliveryKernelCases.cases) {
    const label = `delivery-kernel/${testCase.id || '<missing-id>'}`;
    assert(typeof testCase.id === 'string' && testCase.id.trim().length > 0, `${label} 必须包含 id`, failures);
    assert(typeof testCase.input === 'string' && testCase.input.trim().length > 0, `${label} 必须包含 input`, failures);
    assert(['create', 'improve', 'reframe', 'unknown'].includes(testCase.delivery_mode), `${label} delivery_mode 不合法: ${testCase.delivery_mode}`, failures);
    assert(typeof testCase.expected_artifact === 'string' && testCase.expected_artifact.trim().length > 0, `${label} 必须包含 expected_artifact`, failures);
    assert(typeof testCase.expected_template === 'string' && fs.existsSync(path.join(root, testCase.expected_template)), `${label} expected_template 不存在: ${testCase.expected_template}`, failures);
    assert(Array.isArray(testCase.expected_next_skills) && testCase.expected_next_skills.length > 0, `${label} 必须包含 expected_next_skills`, failures);
    assert(Array.isArray(testCase.must_include) && testCase.must_include.length > 0, `${label} must_include 不能为空`, failures);
    assert(Array.isArray(testCase.must_not_include) && testCase.must_not_include.length > 0, `${label} must_not_include 不能为空`, failures);
  }
  const hybridCase = deliveryKernelCases.cases.find(item => item.id === 'delivery-hybrid-improve-with-reframe-risk');
  if (hybridCase && Array.isArray(hybridCase.must_include)) {
    for (const term of ['delivery_decision', 'required_first_artifacts', 'change_contract', 'branch_state', 'secondary_mode: reframe', 'mode_switch_conditions', 'stop_conditions']) {
      assert(hybridCase.must_include.includes(term), `delivery-hybrid-improve-with-reframe-risk 缺少: ${term}`, failures);
    }
  }
  const branchStateCase = deliveryKernelCases.cases.find(item => item.id === 'branch-state-runtime-protocol');
  if (branchStateCase && Array.isArray(branchStateCase.must_include)) {
    for (const term of ['branch_state_policy', 'before_context_compaction', 'rejected_directions_do_not_retry', 'migrate_stable_decisions_to_source_of_truth']) {
      assert(branchStateCase.must_include.includes(term), `branch-state-runtime-protocol 缺少: ${term}`, failures);
    }
  }
  const profileCase = deliveryKernelCases.cases.find(item => item.id === 'minimal-full-profile-selection');
  if (profileCase && Array.isArray(profileCase.must_include)) {
    for (const term of ['spec_output_profile', 'minimal_change_contract', 'full_change_contract']) {
      assert(profileCase.must_include.includes(term), `minimal-full-profile-selection 缺少: ${term}`, failures);
    }
  }
  const complexityLiteCase = deliveryKernelCases.cases.find(item => item.id === 'complexity-aware-lite-contract');
  if (complexityLiteCase && Array.isArray(complexityLiteCase.must_include) && Array.isArray(complexityLiteCase.must_not_include)) {
    for (const term of ['task_complexity: lite', 'contract_profile: lite_change_contract', 'allowed_files_or_areas', 'max_expected_files_touched', 'requires_human_approval_if', 'secondary_mode: none']) {
      assert(complexityLiteCase.must_include.includes(term), `complexity-aware-lite-contract 缺少: ${term}`, failures);
    }
    for (const term of ['usage_metrics by default', 'Branch State required by default', 'secondary_mode: reframe']) {
      assert(complexityLiteCase.must_not_include.includes(term), `complexity-aware-lite-contract must_not_include 缺少: ${term}`, failures);
    }
  }
  const agentDisciplineCase = deliveryKernelCases.cases.find(item => item.id === 'agent-task-execution-discipline');
  if (agentDisciplineCase && Array.isArray(agentDisciplineCase.must_include)) {
    for (const term of ['delegation_mode', 'hitl_checkpoint_required', 'slice_plan', 'vertical_slice', 'tracer_bullet', 'verification_policy']) {
      assert(agentDisciplineCase.must_include.includes(term), `agent-task-execution-discipline 缺少: ${term}`, failures);
    }
  }
  const prototypeIntentCase = deliveryKernelCases.cases.find(item => item.id === 'prototype-intent-lifecycle');
  if (prototypeIntentCase && Array.isArray(prototypeIntentCase.must_include)) {
    for (const term of ['prototype_intent', 'throwaway_question_probe', 'intent_lifecycle', 'deletion_or_archive_rule']) {
      assert(prototypeIntentCase.must_include.includes(term), `prototype-intent-lifecycle 缺少: ${term}`, failures);
    }
  }
  const skillLoadCase = deliveryKernelCases.cases.find(item => item.id === 'skill-load-policy-runtime-neutral');
  if (skillLoadCase && Array.isArray(skillLoadCase.must_include) && Array.isArray(skillLoadCase.must_not_include)) {
    for (const term of ['skill_load_policy', 'invocation_mode', 'context_load_class', 'references_loaded_by_default', 'runtime-neutral']) {
      assert(skillLoadCase.must_include.includes(term), `skill-load-policy-runtime-neutral 缺少: ${term}`, failures);
    }
    assert(skillLoadCase.must_not_include.includes('disable-model-invocation'), 'skill-load-policy-runtime-neutral 必须禁止 runtime-specific disable-model-invocation 语义', failures);
  }
  const skillQualityCase = deliveryKernelCases.cases.find(item => item.id === 'skill-quality-review-profile');
  if (skillQualityCase && Array.isArray(skillQualityCase.must_include)) {
    for (const term of ['skill_quality_review', 'agent_navigability_review', 'no_op', 'sediment', 'sprawl', 'context_load', 'progressive_disclosure', 'usage_metrics_v2']) {
      assert(skillQualityCase.must_include.includes(term), `skill-quality-review-profile 缺少: ${term}`, failures);
    }
  }
  const runtimeSurfaceCase = deliveryKernelCases.cases.find(item => item.id === 'runtime-surface-availability');
  if (runtimeSurfaceCase && Array.isArray(runtimeSurfaceCase.must_include)) {
    for (const term of ['docs/source-of-truth-map.md', 'docs/delivery-kernel.md', 'templates/module-execution-pack/template.md', 'templates/change-contract/template.md', 'templates/branch-state/template.md', 'templates/definition-drift-check/template.md', 'loops/recipes/definition-sync.loop.md']) {
      assert(runtimeSurfaceCase.must_include.includes(term), `runtime-surface-availability 缺少: ${term}`, failures);
    }
  }
  const reviewProfileCase = deliveryKernelCases.cases.find(item => item.id === 'review-profile-output-shaping');
  if (reviewProfileCase && Array.isArray(reviewProfileCase.must_include) && Array.isArray(reviewProfileCase.must_not_include)) {
    for (const term of ['quick_change_review', 'profile_required_sections']) {
      assert(reviewProfileCase.must_include.includes(term), `review-profile-output-shaping 缺少: ${term}`, failures);
    }
    for (const term of ['prototype_design_evidence_audit by default', 'definition_sync_audit by default', 'artifact_hygiene_audit by default']) {
      assert(reviewProfileCase.must_not_include.includes(term), `review-profile-output-shaping must_not_include 缺少: ${term}`, failures);
    }
  }
  const modeSwitchCase = deliveryKernelCases.cases.find(item => item.id === 'mode-switch-assessment-drift');
  if (modeSwitchCase && Array.isArray(modeSwitchCase.must_include)) {
    for (const term of ['mode_switch_assessment', 'should_switch_mode', 'recommended_next_artifact']) {
      assert(modeSwitchCase.must_include.includes(term), `mode-switch-assessment-drift 缺少: ${term}`, failures);
    }
  }
  const driftCase = deliveryKernelCases.cases.find(item => item.id === 'definition-sync-drift-classes');
  if (driftCase && Array.isArray(driftCase.must_include)) {
    for (const driftType of ['Implementation Adjustment', 'Spec Gap', 'Requirement Change', 'Conflict / Contradiction']) {
      assert(driftCase.must_include.includes(driftType), `definition-sync-drift-classes 缺少漂移类型: ${driftType}`, failures);
    }
  }
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
  'references/prototype-to-spec.zh.md': [
    'source_prototype.artifact_path',
    'prototype_gaps',
    'Spec-first 保护',
    'Visual Evidence 保护',
  ],
  'skills/builder-review/references/prototype-to-spec-review.zh.md': [
    'source_prototype.artifact_path',
    'gaps_preserved',
    'mock_boundary',
    'verification_provenance',
    'spec_first_guard',
  ],
  'skills/builder-review/references/prototype-design-evidence-review.zh.md': [
    'prototype_design_evidence_audit',
    'visual_target',
    'rendered_implementation',
    'screenshot_evidence',
    'P0',
    'P3',
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

const skillPack = JSON.parse(read('skill-pack.json'));
for (const [policyName, policy] of Object.entries({
  'bundles/core/manifest.json skill_load_policy': coreManifest.skill_load_policy,
  'skill-pack.json skill_load_policy': skillPack.skill_load_policy,
})) {
  assert(policy && typeof policy === 'object' && !Array.isArray(policy), `${policyName} 必须是对象`, failures);
  if (!policy || typeof policy !== 'object' || Array.isArray(policy)) continue;
  const policySkills = Object.keys(policy).sort();
  assert(policySkills.length === builderSkills.length, `${policyName} 必须覆盖 8 个 builder skills，当前: ${policySkills.length}`, failures);
  for (const skillName of builderSkills) {
    const entry = policy[skillName];
    assert(entry && typeof entry === 'object', `${policyName} 缺少 ${skillName}`, failures);
    if (!entry || typeof entry !== 'object') continue;
    assert(['user_invoked', 'router_invoked', 'model_invoked'].includes(entry.invocation_mode), `${policyName}/${skillName} invocation_mode 不合法: ${entry.invocation_mode}`, failures);
    assert(['always_visible', 'router_visible', 'on_demand'].includes(entry.context_load_class), `${policyName}/${skillName} context_load_class 不合法: ${entry.context_load_class}`, failures);
    assert(entry.references_loaded_by_default === false, `${policyName}/${skillName} references_loaded_by_default 必须是 false`, failures);
  }
}
assert(!read('skill-pack.json').includes('disable-model-invocation'), 'skill-pack.json 不得写入 runtime-specific disable-model-invocation 语义', failures);
assert(!read('bundles/core/manifest.json').includes('disable-model-invocation'), 'core manifest 不得写入 runtime-specific disable-model-invocation 语义', failures);

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
