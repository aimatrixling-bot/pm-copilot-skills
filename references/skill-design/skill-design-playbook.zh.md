# AI Builder OS Skill Design Playbook

## 定位

本 playbook 用于打磨 AI Builder OS 的 `builder-*` skills。它从已安装的 Plan Goal Coach、`skill-creator` 的 authoring 规则，以及 AI Builder OS 的产品定位中提炼方法。

AI Builder OS 的目标不是堆叠更多 skill，而是让产品经理、企业数字化从业者、AI 产品构建者、非程序员和独立创造者，把模糊想法、业务问题、产品需求或个人项目，转化为 agentic 工具可以理解、执行、验证和沉淀的构建流程。

因此，一个合格的 builder skill 必须做到：

- 用户不必先懂 skill 名称，也能被正确路由。
- 模糊输入能被收敛成可审查产物。
- 输出能被下游 agent 或 builder skill 消费。
- 完成声明有证据，不靠语气。
- `SKILL.md` 足够可执行，但不变成不可维护的巨型论文。

## 从 Plan Goal Coach 学到的核心模式

### 1. 先定义职责边界

Plan Goal Coach 的强点不是模板多，而是清楚知道自己不做什么：它不实现代码、不替用户做业务决策、不把所有问题都升级成 Goal。

打磨其他 builder skill 时，也要先写清：

- 这个 skill 负责把什么输入转成什么产物。
- 它不负责哪些业务判断、实现动作或下游检查。
- 什么情况下必须 handoff 给其他 skill。

### 2. 把触发条件和不触发条件成对设计

只写“何时使用”容易过度触发。必须同时写“何时不要使用”。

触发条件要覆盖：

- 显式触发：用户直接说出 skill 相关需求。
- 隐式触发：用户没有说 skill 名，但任务形态需要这个 skill。
- 近邻场景：与其他 skill 容易混淆时，说明分流边界。

不触发条件要覆盖：

- 小任务不升级。
- 输入还不成熟时先回到上游 skill。
- 下游执行或 review 场景不要被上游 skill 抢走。

### 3. 使用模式判断，而不是关键词匹配

Plan Goal Coach 使用 Prompt / Plan / Goal / Plan -> Goal / Ask First 作为固定模式集合。这个方法可以迁移到其他 skill：

- `builder-frame`：idea / problem / opportunity / not-ready-for-spec。
- `builder-spec`：mini spec / PRD / engineering request / not-ready-for-spec。
- `builder-prototype`：wireframe / high-fidelity prototype / prototype brief / not-ready-for-prototype。
- `builder-review`：PASS / PARTIAL / BLOCKED / REQUEST_CHANGES。

模式判断必须解释为什么不是其他模式，并指出风险。

### 4. 模板分层

Plan Goal Coach 把模板拆到 references 中，而不是塞进 `SKILL.md`。这是 AI Builder OS 的默认写法：

- `SKILL.md`：使命、触发边界、输入、流程、输出契约、质量门禁、handoff、资源读取指针。
- `references/`：规则、反模式、示例、方法说明、领域判断。
- `templates/`：可复制输出结构。
- `assets/`：固定输出格式、示例文件、可复用片段。
- `evals/`：触发、路由、输出契约、质量和回归样例。
- `scripts/`：确定性检查和重复性验证。

### 5. 反模式是正向规则的一部分

Plan Goal Coach 的反模式让 agent 不会把复杂任务包装成漂亮但不可执行的 prompt。每个 builder skill 都应该有反模式来源，至少覆盖：

- 目标过大。
- 缺少 non-goals。
- 验收不可判断。
- 把业务决策交给 agent。
- 只做文案润色，不改变可执行性。
- 假装完成，没有证据。
- handoff 不完整。

### 6. 示例必须覆盖边界，不只覆盖理想输入

示例应包含：

- 标准正例。
- 小任务不应触发的反例。
- 与相邻 skill 的分流例。
- 高风险输入需要先提问的例子。
- AI Builder OS handoff 例子。

示例不是为了装饰，而是让未来 eval 能从真实输入出发。

### 7. 输出格式要稳定

Plan Goal Coach 的固定输出格式让用户能快速复制和审阅。其他 builder skill 也应有稳定输出契约：

- artifact type 或 review decision。
- facts / assumptions / open questions。
- scope / non-goals。
- acceptance criteria 或 quality gates。
- evidence / verification。
- next skill hint 或 handoff packet。

字段名应能进入 output-contract schema。

### 8. Handoff 是一等公民

AI Builder OS 不是单个 skill 的集合，而是一条构建链路。每个 builder skill 都要明确：

- 上游输入来自哪里。
- 产物交给谁。
- 下游需要哪些字段。
- 什么情况下不要继续，而是退回上游澄清。

handoff 至少包含目标、上下文来源、关键假设、non-goals、验收标准、验证方式和停止条件。

## AI Builder OS Skill 打磨流程

### Step 1: 定义目标产物

先回答：这个 skill 的核心产物是什么？

不要从“它应该会很多事情”开始。应该从一个可命名、可检查、可交接的 artifact 开始，例如 Feature Frame、Design Brief、Agent Task Packet、Review Report。

### Step 2: 建立触发边界

写清：

- 显式触发。
- 隐式触发。
- 不触发条件。
- 相邻 skill 分流。

触发描述放在 frontmatter `description`，正文中只解释操作规则。

### Step 3: 设计模式判断

如果 skill 内部有多种处理路径，先定义有限模式集合。模式数应少而稳定。

每个模式都要有：

- 适合场景。
- 典型输入。
- 典型输出。
- 失败或降级处理。

### Step 4: 设计资源读取策略

不要让 agent 每次加载所有资料。写成按需读取：

- 边界不清读 decision rules。
- 要生成产物读 template。
- 风险高读 anti-patterns。
- 需要类比读 examples。
- 输出前读 output format 或 checklist。

### Step 5: 设计输出契约

先写 YAML-like 输出契约，再写模板。输出契约应进入 `evals/output-contract/`。

字段要能回答：

- 产物是什么。
- 面向谁。
- 依据哪些事实。
- 哪些是假设。
- 哪些还未解决。
- 如何验证。
- 交给谁。

### Step 6: 设计质量门禁

每个 builder skill 至少有：

- Scope Gate。
- Evidence Gate。
- Handoff Gate。
- 与领域相关的专用 gate。

质量门禁必须说明失败处理：补信息、降级、转 Plan、请求人工决策或标记 BLOCKED。

### Step 7: 分层放置内容

判断内容放哪：

| 内容 | 放置位置 |
| --- | --- |
| 触发描述 | frontmatter description |
| 使命、边界、流程、输出契约 | `SKILL.md` |
| 详细规则、反模式、示例 | `references/` |
| 可复制产物格式 | `templates/` 或 `assets/` |
| 可机器检查字段 | `evals/output-contract/` |
| 触发和路由样例 | `evals/trigger/`, `evals/routing/` |
| 确定性检查 | `scripts/` 或 `scripts/validate-builder-os.js` |

### Step 8: 写 eval 前先写真实输入

eval query 必须像真实用户会说的话，不能只写抽象标签。

好的 eval 应覆盖：

- should trigger。
- should not trigger。
- 与相邻 skill 竞争。
- 高风险需要 ask first。
- 输出契约字段。
- handoff 是否完整。

### Step 9: 做安装态检查

AI Builder OS 的 builder skills 安装后会被单独读取。凡是 `SKILL.md` 引用的共享资源，都要保证安装态可相对访问。

检查点：

- source tree 有文件。
- npm pack 会包含文件。
- installer 会复制到目标 runtime。
- `validate:codex-install` 能发现缺失。

### Step 10: 保持迭代纪律

每次 hardening 只处理一个可审查里程碑。不要在同一个 goal 中同时重写所有 skill、改安装器、加新 runtime、补 E2E、优化描述。

## Skill Hardening Brief 必填字段

打磨任意 builder skill 前，建议先生成 Skill Hardening Brief：

- `skill_name`
- `current_role`
- `target_role`
- `primary_artifact`
- `target_users`
- `trigger_conditions`
- `non_trigger_conditions`
- `mode_decision`
- `resource_map`
- `output_contract`
- `quality_gates`
- `handoff_targets`
- `anti_patterns`
- `examples`
- `validator_eval_plan`
- `installation_resources`
- `done_when`
- `verification`
- `open_questions`

模板见 `templates/skill-hardening-brief/template.md`。

## Review Checklist

评审一个 builder skill 是否合格时，检查：

- description 是否足以触发真实任务。
- `SKILL.md` 是否短而可执行。
- 是否存在明确不触发条件。
- 是否有有限模式集合或明确执行路径。
- 是否有 output contract。
- 是否有 references/templates/assets 分层。
- 是否有反模式和示例。
- 是否有 handoff 目标和 required inputs。
- 是否有 validator/eval 覆盖。
- 是否说明安装态资源如何可用。
- 是否中文优先。

## 不应做的事

- 不要把本 playbook 整段复制到每个 `SKILL.md`。
- 不要因为一个 skill 有很多场景，就把它拆成大量新 skill。
- 不要用抽象口号替代 output contract。
- 不要用“完善、优化、智能化”当验收标准。
- 不要把静态 validator 当成真实 agent 行为 eval 的替代品。
- 不要在没有用户确认时改变旧 `pm-*` skills 的语义。

## 与后续里程碑的关系

- 打磨 `builder-router` 时，重点使用触发边界、相邻 skill 分流和 routing eval。
- 打磨 `builder-prototype` 时，重点使用模式判断、Design Brief、Design Consistency Gate 和 examples。
- 打磨 `builder-agent-task` 时，重点使用 output contract、handoff packet 和 target runtime constraints。
- 打磨 `builder-review` 时，重点使用 evidence gate、review decision、required fixes 和 no fake approval。
- 打磨 `builder-decision` 时，重点使用决策记录模板、被拒绝方案和反转条件。
