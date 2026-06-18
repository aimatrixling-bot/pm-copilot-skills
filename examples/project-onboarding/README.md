# Project Onboarding 端到端样例

本目录展示 `builder-router` 如何在项目首次进入时轻接入 Project Onboarding Protocol。

样例覆盖两条最常见路径：

- `greenfield-router-output.example.md`：用户从 0 开始一个新产品或项目。
- `brownfield-router-output.example.md`：用户已有本地项目资产，中途引入 AI Builder OS。

## 核心链路

```text
用户自然语言请求
  -> builder-router
  -> project_mode
  -> project_profile_proposal
  -> recommended_next_skill
```

## 使用边界

- 样例是 router output 示例，不是实际项目扫描结果。
- `project_profile_proposal` 是 proposal-only，不代表已创建 `.ai-builder/`。
- 示例不写入 `artifact-index.yaml`。
- 示例不自动扫描全仓库。
- 示例不迁移、删除、重命名或归档任何用户文件。
- Project Onboarding Protocol 是横切协议，不是第 9 个 core skill。

## Source-of-truth

这些样例应服从以下上游协议：

```text
harness/project-onboarding-policy.zh.md
memory/schemas/project-profile.schema.md
evals/output-contract/builder-router.schema.json
evals/onboarding/project-onboarding.cases.json
```

如果样例和上游协议冲突，以上游协议为准。
