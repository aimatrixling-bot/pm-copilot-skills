# Prototype-to-Spec Eval Fixtures

本目录用于 Milestone 3：用真实 prototype brief 的结构检查 `builder-spec` 的 `prototype_to_spec` 反向提取能力，以及 `builder-review` 的专项审查能力。

## 目标

- 验证 source prototype provenance 不丢失。
- 验证 prototype gaps 不被提升为已确认 requirements。
- 验证 mock boundary、route readiness 和 production gap 被保留。
- 验证 verification provenance 能进入 spec 的 verification plan 和 review audit。

## 样例来源

- `D:\PMS-Dev-AIFirst\modules\visit\prototype-brief.md`
- `D:\PMS-Dev-AIFirst\modules\surgery\prototype-brief.md`

本目录中的 fixtures 是上述 prototype brief 的精简摘录，用于 package 内可复现 eval；真实审查时仍应优先读取源 brief。

## 使用方式

1. 让 `builder-spec` 对 `fixtures/*.prototype-brief.md` 执行 `prototype_to_spec`。
2. 对照 `expected/*.prototype-to-spec.md` 检查提取结果。
3. 让 `builder-review` 使用 `prototype_to_spec_review` 对输出执行专项审查。
4. 使用 `review-checklist.md` 和 `manual-review-results.md` 判断是否可以 PASS。
