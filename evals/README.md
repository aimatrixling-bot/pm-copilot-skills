# Evals

AI Builder OS 的 evaluation fixtures 与（轻量）runner。

---

## v1.1 范围（明确边界）

v1.1 的 evals 是 **schema fixture**，不是 LLM-as-judge runner。

✅ **包含**：
- `**/*.cases.json` 作为 fixture 数据源（输入 case 与期望输出契约）
- `scripts/run-eval-suite.js` 对每个 case 跑 schema 验证（不跑 LLM）
- `scripts/check-examples-coverage.js` 检查 SKILL.md 的 examples 覆盖率
- 5 个最关键 output-contract schema 在 `validate:builder-os` 中被检查

❌ **不包含**：
- LLM-as-judge 评分
- 自动 regression 检测
- CI 集成
- 跨 model 比较
- prompt injection / jailbreak 测试

---

## 目录结构

```
evals/
├── README.md                          # 本文件
├── output-contract/                   # 输出契约 schema（被 validate:builder-os 引用）
│   ├── builder-router.schema.json
│   ├── builder-spec.schema.json
│   ├── builder-review.schema.json
│   ├── builder-decision.schema.json
│   ├── agent-task-packet.schema.json
│   └── ...
├── output-contract-cases/             # cases fixture（输入 + 期望输出）
│   ├── builder-router.cases.json
│   ├── builder-spec.cases.json
│   ├── builder-decision.cases.json
│   └── ...
├── routing-cases/                     # builder-router / builder-plan-goal 路由判断 fixture
│   └── ...
├── memory-schema-cases/               # memory schema 验证 fixture
│   └── ...
└── runtime-behavior-fixtures/         # runtime adapter 行为 fixture
    └── ...
```

---

## 使用方式

### 最小验证（每改 skill 必跑）

```bash
npm run validate:builder-os
```

包含对 5 个 output-contract schema 的存在性检查 + 每个 SKILL.md 的关键字段检查。

### Eval Suite（schema-only）

```bash
npm run validate:eval-suite
```

读取 `evals/**/*.cases.json`，对每个 case 跑 schema 验证，输出 `dist/eval-report.json`。

### Examples Coverage

```bash
npm run check:examples
```

统计每个 SKILL.md 的 `**Example**` / `**示例**` 数量，阈值 ≥4，输出 `dist/examples-coverage.json`。

---

## v1.2 Roadmap（不在 v1.1 范围）

v1.2 计划引入但 v1.1 不做：

- **LLM-as-judge runner**：对每个 case 跑实际 LLM 调用，用评分 rubric 评估输出质量
- **Regression 检测**：对比上次 eval 结果，标记退化项
- **Multi-model 比较**：同一 case 在不同 LLM（Claude / GPT / Gemini）下的输出对比
- **Adversarial 测试**：prompt injection、jailbreak、edge case
- **CI 集成**：GitHub Actions 自动跑 eval suite

**为什么 v1.1 不做**：LLM-as-judge 需要稳定的 model + prompt + rubric，v1.1 阶段 skill 本身仍在演进，过早引入 LLM eval 会陷入"评分波动 vs 实际改进"的混淆。先把 schema fixture 做扎实，v1.2 再引入 LLM 评分。

---

## Fixture 编写规则

### cases.json 结构

```json
{
  "suite_name": "builder-decision-output-contract",
  "schema_ref": "../output-contract/builder-decision.schema.json",
  "cases": [
    {
      "id": "decision-basic-record",
      "input": {
        "mode": "record_decision",
        "decision": "选择方案 A",
        "context": "..."
      },
      "expected_output_contract": {
        "must_contain_fields": ["decision_id", "decision", "rationale", "reversibility"],
        "must_satisfy": ["reversibility.door_type in [one_way, two_way, mixed]"]
      },
      "notes": "基础 record_decision 模式，验证字段完整性"
    }
  ]
}
```

### 添加新 case 的规则

1. **case id 必须 kebab-case**：`<skill>-<scenario>`，如 `decision-basic-record`
2. **expected_output_contract 不指定具体值**：只描述 schema 约束（字段存在、枚举值、格式），不绑定具体输出（LLM 输出会变）
3. **每个 case 附 notes**：说明这个 case 验证什么场景
4. **fixture 不依赖 LLM**：cases.json 是数据，不是 runtime；runtime 调用由 runner 负责

---

## 与 validate:builder-os 的关系

`scripts/validate-builder-os.js` 包含：
- 每个 SKILL.md 必须有 `## Skill Hardening Brief / Meta-Review / Evolution Writeback / 入口契约` 章节
- 4 个 memory schema 必须有 `## Schema / Field Rules / Minimum Example / Usage Rule` 章节
- builder-decision 必须包含 MCDA / Reversibility Matrix / Cost of Delay 三个关键词
- builder-spec 必须包含 `full_prd` 模式
- 5 个 output-contract schema 文件存在
- `templates/plan-brief/template.md` / `templates/delivery-sign-off/template.md` 存在
- `references/prd-quality-checklist.zh.md` 存在
- `evals/README.md` 存在（本文件）

`scripts/run-eval-suite.js` 是补充，跑 cases.json 的 schema 验证。两者互补：validate:builder-os 检查"骨架是否齐全"，run-eval-suite 检查"cases 是否符合 schema"。

---

## 参考

- `scripts/validate-builder-os.js` — 主验证脚本
- `scripts/run-eval-suite.js` — Eval runner（P1.5）
- `scripts/check-examples-coverage.js` — Examples 覆盖率检查（P1.5）
- `references/skill-design/skill-design-playbook.zh.md` — Skill 设计事实源
- `docs/builder-alignment-plan-v1.1.md` — 本轮 evals 改造的计划来源
