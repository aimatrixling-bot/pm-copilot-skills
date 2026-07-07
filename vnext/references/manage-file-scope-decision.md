---
title: manage-file 范围与分层设计备忘录
type: design-decision
status: active
created_at: 2026-07-06
source: user mindmap + ChatGPT cross-review + Claude vNext evaluation
related_skills: [manage-file, craft-spec, review-doc, evolve-doc-check, evolve-kb-check]
related_blueprint_sections: [§2.21, §2.24.2]
---

# manage-file 范围与分层设计备忘录

## 1. 背景

用户绘制思维导图（4 维度：路径/命名/排序、创建、版本管理、项目知识库），并向 ChatGPT 询问 manage-file 设计建议。本备忘录记录 Claude 结合 vNext 现状的最终评估，作为 Tier 2 references/ 实施和未来 evolve-skill 改进的设计依据。

**核心共识**（用户图片 + ChatGPT + vNext 现状）：
> manage-file 是**文件资产决策 Skill**，不是"文件治理宇宙"。

## 2. ChatGPT 建议评估

### 接受

| 建议 | 理由 |
|---|---|
| Skill / Rules / Templates / Scripts / Hooks 分层 | 符合 Progressive Disclosure + 单源真 |
| 边界收窄到"决策流程" | P0 Skill 单一职责 |
| 输出 File Decision 而非直接文件 | 决策可审计、可重放 |
| cannot-invoke 边界（草稿、大规模审计、内容生成） | 防止 skill 互相蚕食 |
| "如无必要勿增实体"作为 Creation Gate | 与 Iron Law D9 同源 |
| 用户个人偏好（01 前缀、yyyymmdd）不应全部写成全局 Rule | 偏好 vs 规则要分层 |

### 拒绝

| ChatGPT 建议 | 拒绝理由 | vNext 现状 |
|---|---|---|
| `owner_agent: Supervisor` | Supervisor 是协调者，不执行 file operation | §2.21 已定 `owner_agent: builder` |
| `shared_with` 含 Writer/Helper | vNext 只有 5 Agent 模型 | S/R/B/Ev/Re |
| `paths` 含 `.claude/skills/**`、`.ai-builder/**` | 通用 AI 项目路径猜测 | 已定 `["30_Projects/**", "40_Content/**"]` 匹配 Max Brain 实际 |
| 引入 TypeScript scripts（check-file-naming 等） | Max Brain 不是代码仓库（CLAUDE.md 明确） | 应作为 P2+ evolve-* 工作 |
| Post-write / Stop hooks | 需 L3 Harness 基础设施先就位 | P1 只先落 Layer 1+3 |
| Frontmatter 加 `cannot-invoke`、`omit-context` | Schema 漂移 | §2.0 已定 9 必需字段，扩展走 evolve-skill |
| SKILL.md 草案结构（Mission/Iron Law/Workflow/Output） | 与 vNext 标准结构不一致 | Invocation/Steps/Reference/Completion/Failure |

**根因**：ChatGPT 给的是"从零设计会怎么做"，vNext 需要"在已有约束下怎么做"。

## 3. 用户图片内容 → vNext 分层映射

| 图片中的内容 | vNext 归属 | 形式 | 时机 |
|---|---|---|---|
| 创建前判断"是否已存在" | SKILL.md Step 2-4 | 已实装 | Tier 1 |
| "如无必要勿增实体" gate | SKILL.md Step 5 + Failure Mode "Broad Mutation" | 已实装 | Tier 1 |
| 路径权威（30_Projects / 40_Content） | SKILL.md paths + Step 2 | 已实装 | Tier 1 |
| 命名约定（kebab-case / 中文标题 / 同级无歧义） | `manage-file/references/naming-rules.md` | 新增 ref | Tier 2 |
| 个人偏好（01 前缀、yyyymmdd 后缀） | memory/user preference 或 `references/personal-conventions.md` | 偏好层 | Tier 2 |
| 何时用日期后缀（active vs 归档） | `manage-file/references/versioning-rules.md` | 新增 ref | Tier 2 |
| PRD 模板分级（lite/standard/ultra） | `craft-spec/references/`（不属于 manage-file） | 跨 skill | Tier 2 |
| 文件拆分/合并/重命名决策树 | `manage-file/references/file-decision-template.md` | YAML 模板 | Tier 2 |
| 项目文档初始化 | 不属于 manage-file → project-template / Supervisor scope | 跨 skill | Tier 3 |
| Index.md 规则与维护 | `manage-file/references/index-rules.md` + doc-consistency-check 协作 | 新增 ref | Tier 2 |
| 命名一致性自动检查 | evolve-doc-check / evolve-kb-check（用户已有 user skill） | Evolver 桶 | Tier 3 |
| Post-write / Stop hook | L3 Harness Swiss Cheese Layer 4 (Evidence) | 基础设施 | Tier 3 |

**关键洞察**：图片中约 60% 内容应该进 references/（branch-specific 详情），20% 已经在 SKILL.md 里，20% 属于其他 skill 或基础设施。

## 4. 关键认知纠偏

ChatGPT 推荐的"建议固化为 Rules"段落（命名规则、创建规则、版本规则、Index 规则），在 vNext 中应该放在 `references/` 下，不是写成全局 Rule。

原因：
- vNext 的"全局 Rule"位置是 Blueprint（§x.x）和 `~/.claude/rules/common/*.md`，那是稳定不变的元规则
- 文件命名的具体约定是 branch-specific（代码仓库 vs 知识仓库 vs 内容创作各不同）
- Progressive Disclosure 原则：稳定约束在 SKILL.md 提炼一句话，详情进 references/，应用公式由 Agent 按需加载

## 5. 落地路径（4 层）

### Tier 1 — 现状（已就绪）

当前 `vnext/skills/manage/manage-file/SKILL.md`（commit b793206）已是合格的决策流程 Skill：
- 6 Steps 决策链（classify → authority → naming → conflict → execute → evidence）
- 5 Failure Modes（含 Broad Mutation / Evidence Gap）
- can-invoke: [] 是 leaf skill

唯一调整：TD-08（shared_with 移除 owner builder）。

### Tier 2 — references/ 补充（下一轮 evolve-skill 改进时，与 TD-06 同期）

术语约定：`references/xxx.md` 相对路径指 skill-local references（例如 `vnext/skills/manage/manage-file/references/xxx.md`）；`vnext/references/xxx.md` 指跨 skill 共享的 vnext-global references，SKILL.md 中不得单独写含糊的 `references/`。

在 `vnext/skills/manage/manage-file/references/` 下新增：

```
references/
├── naming-rules.md              # 命名稳定约定（kebab-case、同级无歧义、final-final 禁用）
├── versioning-rules.md          # active vs 归档/导出，何时用 yyyymmdd
├── path-authority-map.md        # 30_Projects / 40_Content 内部子路径放置规则
├── index-rules.md               # index.md 何时必需、何时检查
└── file-decision-template.md    # 可选的 file_decision YAML 模板（非强制每次产出）
```

个人偏好（01 前缀、yyyymmdd）放在 `naming-rules.md` 的"用户偏好"section，标注 `scope: user-preference`，不写成铁律。

触发时机：当 SKILL.md 出现 Bloat 信号（Step 描述超过 3 行、branch-specific 细节侵入主流程），或当 Batch 2/3 实装过程中发现其他 skill 需要引用同样的命名规则时。

### Tier 3 — 跨 skill 协作（vNext 终态 P2+）

- `craft-spec/references/prd-templates.md`：PRD lite/standard/ultra 模板属于 craft-spec
- `evolve-doc-check` / `evolve-kb-check`：用户已有的两个 user skill 纳入 vNext Evolver 桶，承担周期性熵减
- L3 Harness Layer 4 (Evidence)：Post-write hook 检查 index 更新

### Tier 4 — 暂不做

- TypeScript scripts（vNext 不是代码仓库）
- frontmatter 字段扩展（schema 漂移）
- owner_agent 改 Supervisor（违反 §2.21）
- 每次 file_decision YAML 强制产出（Max Brain 是知识仓库，过度结构化 = Bloat）
- 项目文档初始化纳入 manage-file（属于 Supervisor/project-template）

## 6. 边界表（manage-file vs 其他 skill）

| 场景 | 调用 skill |
|---|---|
| 生成 PRD 内容 | craft-spec |
| 决定 PRD 放哪里、叫什么、是否拆分 | manage-file |
| 评审 PRD 是否一致 | review-doc |
| 研究报告内容生成 | discover-research |
| 研究报告归档、命名、index 更新 | manage-file |
| 检查知识库膨胀/过期/重复 | evolve-kb-check |
| 检查文档之间不一致 | evolve-doc-check |
| 从项目经验沉淀新规则 | evolve-skill / evolve-memory |
| 创建新文档模板 | craft-spec + manage-file（路径决策） |
| 代码文件命名 | 遵循工程框架，不默认 manage-file |
| 项目文档初始化 | project-template / Supervisor（不属于 manage-file） |

## 7. 后续追踪锚点

- TD-08 修复（shared_with 移除 owner builder）→ P1.4 后置修复
- TD-06 改进 evolve-skill Step 6 时，同期为 manage-file 补充 Tier 2 references/
- 当 Batch 2 craft-prototype / build-commit / review-code 实装时，观察是否有跨 skill 共享的命名规则，决定是否提前触发 Tier 2
