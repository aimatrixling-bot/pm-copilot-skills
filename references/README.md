# References（参考资料）

顶层 `references/` 用于保存 AI Builder OS 共享方法论，避免把所有细节都塞进每个 `SKILL.md`。

Milestone 3.1 后，原 `skills/references/` 已随旧 PM 内容归档到 `_archived/pm-copilot-legacy-v1.0/skills/references/`。顶层 `references/` 是 AI Builder OS 1.0 的 active shared reference 入口。

## 规则

主 `SKILL.md` 保持轻量。详细方法、示例、检查清单和领域指导放在 references 中。

Milestone 2.2 将 UI/UX shared contract 放在 `references/ui-ux/`，供 spec、prototype、agent task 和 review 共同消费。

Milestone 2.4 将 Skill Design Playbook 放在 `references/skill-design/`，供后续打磨 `builder-*` skills 时复用 Plan Goal Coach 的触发边界、模式判断、模板分层、反模式、示例、输出契约和 validator/eval 设计方法。

`references/prototype-to-spec.zh.md` 是 prototype-to-spec 反向提取的共享规则，供 `builder-spec` 和 `builder-review` 共同读取，避免 active skill 互相引用私有 `skills/<skill>/references/` 路径。

Milestone 3.1 新增 `references/legacy-pm-methods/` 作为旧 PM 方法资产索引。legacy 内容只作为迁移来源，不作为 active skill surface。

`references/source-blueprints/` 只允许作为本地研究归档使用，已被 git ignore。它可保存 AI Builder OS 早期源蓝图、历史设计输入和 benchmark synthesis，但不属于 active shared references、npm package surface 或 runtime export。
