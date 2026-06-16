---
name: pm-launch
displayName: 发布计划
displayDescription: 制定全面的发布计划与检查清单
description: "Create comprehensive launch plans and release checklists that prevent shipping disasters. Use this skill whenever the user wants to plan a release, says '发布计划', 'launch plan', '上线', 'go-to-market', 'GTM', 'release plan', '上线方案', '发布策略', 'rollout plan', '发布检查', or needs to coordinate a feature rollout. Also trigger when the user says 'we're ready to ship', 'let's launch this', or 'what do we need before going live'. Ensures no critical pre-launch step is missed — from rollback plans to monitoring to stakeholder communication."
user-invocable: true
argument-hint: "[产品/功能名称]"
---

# 发布计划

<SUBAGENT-STOP>
如果是子代理派发执行此 Skill，直接按下方指令执行，不重新加载入口 Skill。
</SUBAGENT-STOP>

制定结构化的产品发布计划——从"功能做完了直接上线"到"有节奏、有准备的发布"。

**核心原则**：发布不是终点线，是起跑线。好的发布计划让团队在上线当天睡得着觉。

## Intent Packet

| 字段 | 捕获内容 | 来源 |
|---|---|---|
| **Want** | 为产品/功能制定结构化发布计划与检查清单，避免上线灾难 | 用户输入剥离"我们准备上线了"后的任务本质 |
| **Constraints** | 必须有回滚方案、监控指标 ≥ 3 个、In-Scope/Out-of-Scope 明确 | Iron Law |
| **Context Sources** | 产品/功能名称 + PRD/Roadmap（Glob 搜索）+ 发布策略偏好 + `references/launch-checklist-template.md` + `references/quality-checklist.md` | 用户提供 + Glob + Read |
| **Depth** | Draft（标准检查清单）/ Review（完整发布计划含时间线+沟通+回滚，默认）/ Release（含灰度阶段+责任人+签字确认） | 用户声明或推断（Guided/Quick 模式） |
| **Output Target** | 发布团队（PM/工程/设计/运营/客服）+ 发布决策者 | 用户明示或推断 |

未提供时标注 `[假设]`，交付前确认。

## Iron Law（铁律）

| 铁律 | 违反后果 |
| --- | --- |
| 没有回滚方案的发布不负责任 | 立即停止——定义回滚/降级方案后继续 |
| 没有监控的发布是盲飞 | 立即停止——定义 ≥ 3 个关键指标及告警阈值后继续 |
| 发布范围不明确的发布会失控 | 立即停止——列出 In-Scope/Out-of-Scope 功能清单后继续 |

## 反合理化

| 你可能在想的 | 真相 |
| --- | --- |
| "功能测试过了，直接上线" | 功能测试 ≠ 发布就绪。发布是系统工程 |
| "出问题再修" | 线上事故修复成本是预防的 10-100 倍 |
| "先全量发，有问题再回滚" | 全量发布影响所有用户。灰度/金丝雀是安全网 |
| "沟通计划不重要" | 用户被吓到 > 用户不知道。沟通管理预期 |
| "监控有 SRE 管" | PM 必须定义业务指标告警。SRE 管系统，PM 管业务 |

## Capability Index

| 维度 | CAN（可以做） | CANNOT → HANDOFF（不做，转交） |
|---|---|---|
| **任务类型** | 发布计划（范围+策略+时间线）、发布检查清单（工程/设计/营销/支持/运营/合规）、回滚方案、监控指标定义、沟通计划 | PRD/技术方案撰写 → pm-prd/pm-code-architect；运维告警系统配置 → SRE/DevOps；营销文案撰写 → pm-content-general |
| **输出格式** | inline Markdown + 检查清单表格 + 时间线 | Gantt 图/项目管理工具导入文件 → 用户自行导出；新闻稿 → pm-content-general |
| **深度范围** | 单次处理 1 个产品/功能的发布计划；从标准清单到含灰度阶段的完整计划 | 多产品并行发布编排 → 用户自行管理；发布后复盘 → pm-retro |

**边界原则**：发布计划是"系统性准备"，不是"一键上线"。回滚方案和监控指标缺一不可。

## Entry Mode

### Guided（引导模式）— 10 步

1. **发布范围** — In-Scope / Out-of-Scope 功能清单
2. **目标用户** — 影响哪些用户？全量/特定群体？
3. **发布策略** — 全量/灰度/功能开关/金丝雀/A/B 测试
4. **发布前检查** — 技术+产品+合规检查清单
5. **回滚方案** — 触发条件 + 步骤 + 预计时间
6. **沟通计划** — 内部（开发/设计/运营/客服）+ 外部（公告/文档/推送）
7. **监控指标** — ≥ 3 个关键指标 + 告警阈值 + 监控窗口
8. **发布时间线** — 日期 + 时间窗口 + 里程碑
9. **发布后验证** — 冒烟测试 + 核心路径验证 + 负责人
10. **评审确认** — 完整计划 → 确认交付

### Quick（快速模式）— ≤ 2 个问题

**问题 1**: "发布的产品/功能名称？一句话说明？"
**问题 2**（可选）: "发布策略偏好？（默认灰度 10%→50%→100%）"

然后：自动生成标准检查清单+回滚模板+监控建议+沟通框架 → 标注 [假设] [默认]

## 执行流程

```
触发 pm-launch
    ├── 1. 模式判断（Guided/Quick）
    ├── 2. 读取上下文（Glob 搜索 PRD/Roadmap）
    ├── 3. 按模式执行
    ├── 4. Iron Law 检查
    │     ├── 回滚方案已定义？
    │     ├── 监控指标 ≥ 3 个有阈值？
    │     └── In-Scope/Out-of-Scope 明确？
    ├── 5. 标注检查（[默认] [假设] [待确认]）
    └── 6. 交付 + 建议下一步（→ pm-prd 迭代）
```

## 交付前检查

- [ ] 发布范围明确（In-Scope / Out-of-Scope）
- [ ] 目标用户群体和影响范围已定义
- [ ] 发布策略已选择
- [ ] 发布前检查清单完整（技术+产品+合规）
- [ ] 回滚方案已定义（触发条件+步骤+时间）
- [ ] 内外部沟通计划已列出
- [ ] 监控指标 ≥ 3 个，含告警阈值
- [ ] 发布时间线有关键里程碑
- [ ] 发布后验证步骤可执行
- [ ] 所有推断标注 [假设]，自动填充标注 [默认]

## 发布策略选择

| 策略 | 适用场景 | 风险等级 |
| --- | --- | --- |
| **灰度发布** 10%→50%→100% | 标准功能发布（推荐默认） | 低 |
| **功能开关** | 需要随时可关闭 | 低 |
| **金丝雀发布** | 基础设施/高风险变更 | 中 |
| **A/B 测试先行** | 需要数据验证效果 | 低 |
| **全量发布** | 紧急修复、低风险变更 | 高 |

## 检查清单结构

```
Launch Checklist
    ├── Engineering（工程准备）— 代码审查、测试、版本号
    ├── Design（设计检查）— 视觉规范、无障碍
    ├── Marketing（营销准备）— 公告、文档、推送
    ├── Support（支持准备）— 客服培训、FAQ
    ├── Operations（运营准备）— 数据跟踪、应急预案
    └── Legal/Compliance（合规）— 隐私、条款
```

详细发布检查清单模板见 `references/launch-checklist-template.md`。
质量检查清单见 `references/quality-checklist.md`。

## 常见错误

| 错误 | 后果 | 正确做法 |
| --- | --- | --- |
| 无回滚方案 | 线上事故无法快速恢复 | 每次发布必有回滚步骤 |
| 跳过灰度 | 所有用户同时受影响 | 默认灰度 10%→50%→100% |
| 不通知客服 | 用户来电客服不知道 | 提前培训客服、准备 FAQ |
| 忘记监控 | 发布后不知道是否有问题 | 发布前配置 ≥3 个关键指标告警 |
| 文档滞后 | 用户看到新功能但无文档 | 文档与功能同步发布 |

## Meta-Review

交付完成后对照方法论自审：

1. **方法论骨架**：是否遵循 模式判断 → 上下文读取 → 按模式执行 → Iron Law 检查 → 标注检查 → 交付 的完整流程？
2. **反理实化警惕**：5 条"你可能在想的"（直接上线/出问题再修/全量发布/沟通不重要/SRE 管监控）是否真的被警惕了？
3. **Iron Law 验证**：3 条铁律是否已验证满足（回滚方案已定义、监控 ≥ 3 个有阈值、范围明确）？

自审结果 1-2 句话附在交付物末尾。不通过时回到对应步骤修正。

## Evolution Writeback

执行后自问以下 3 个问题，有则记录到 `docs/evolution-log.md`：

1. **方法论偏差**：发布策略选择（灰度/功能开关/金丝雀/A-B/全量）是否不够贴合实际场景？
2. **反理实化补充**：是否发现新的"发布乐观主义"借口模式？
3. **边界调整信号**：CAN/CANNOT 边界是否需要调整（如某类发布计划频繁被转交）？

记录格式：`## YYYY-MM-DD — pm-launch — [产品/功能]`

无观察时跳过此章节，不强写。

## Metadata

```yaml
track: pm
phase: 4
depends_on: []
feeds_to: []
schema_type: free
persist_to: []
guardrails:
  - 必须有回滚方案（触发条件+步骤+预计时间）
  - 监控指标 ≥ 3 个，含告警阈值
  - In-Scope / Out-of-Scope 明确
  - 默认灰度发布，全量发布需显式声明并提风险
  - 内外部沟通计划必须列出
```
