# Worked Example — Vague Idea → Feature Frame

本文件示范 builder-frame 如何把一个模糊想法通过 `grill_frame` 模式转成结构化 Feature Frame，并形成可交接给 builder-spec 或 builder-prototype 的 handoff packet。示例是虚构的，但每个字段都遵循 `kernel/packets/feature-frame.schema.md` 的契约。

---

## 输入（用户原话）

> "我想给 AI PM Daily 加一个智能推送功能，让用户每天早上打开手机就能看到当天最重要的 AI 行业动态，不用自己刷信息流。"

特征：
- **模糊**：未说明用户、场景、价值、约束、成功标准
- **隐含解决方案**："推送功能"（可能是邮件/IM/通知/Slack/企微/公众号）
- **隐含用户**："AI 产品经理"（推断，未明示）
- **隐含问题**："信息过载"（推断，未验证）

---

## Step 1：路由判断

```yaml
routing_decision:
  skill: builder-frame
  mode: grill_frame
  reasoning: |
    输入是模糊想法，未明确：
    - 目标用户（自用 / 团队 / 公开订阅产品）
    - 关键场景（早上的设备、时长、网络环境）
    - 价值假设（节省时间 / 避免错过 / 提升专业度）
    - 约束（推送时间、推送格式、推送频率、内容长度、隐私）
    - 成功标准（活跃率 / 留存 / NPS / 付费意愿）
    - non-goals（是否做内容生成 vs 仅做筛选）
    不满足 builder-spec readiness，必须先 frame。
```

---

## Step 2：grill_frame 提问（分批，每批 ≤5 问）

### Batch 1：问题与用户

1. 这个功能最想解决你自己的什么痛点？最近一次这个痛点出现是什么时候？
2. 如果只服务你一个人，够吗？还是要让团队/外部订阅者也用？
3. 用户早上"打开手机"具体是什么场景？通勤路上 / 起床后 / 工作前 review？
4. 当前替代方案是什么？（自己刷信息流？订阅 RSS？看别人日报？）为什么不满意？
5. 假设一周后你停止使用这个功能，最可能的原因是什么？

### Batch 2：价值与约束（等用户回答 Batch 1 后再问）

6. 一条"重要的 AI 行业动态"对你来说意味着什么？（产品发布 / 模型进展 / 投融资 / 监管 / 论文）
7. 推送时间、格式、长度、频率的偏好？
8. 是否需要个性化（你的关注清单 vs 通用热门）？
9. 如果某天没有"重要动态"，应该推一条次要的，还是不推？
10. 是否接受 AI 生成摘要 vs 只接受原始链接 + 编辑筛选？

---

## Step 3：假设用户回答后的 Feature Frame（关键片段）

```yaml
feature_frame:
  frame_id: ai-pm-daily-smart-push-2026-07
  problem_statement: |
    AI 产品经理每日需要追踪多个信源（公众号、Twitter、Hacker News、blog）
    才能判断"今天发生了什么"。信息过载 + 多源分散导致平均每日花 30-45 分钟
    做"信息 triage"，且容易遗漏非主流渠道的关键事件。

  target_users:
    primary:
      persona: 个人 AI 产品经理 / 内容创作者
      context: 早上通勤或工作前 review 阶段，时长 5-15 分钟
      jobs_to_be_done: |
        在 5 分钟内了解"今天 AI 圈发生了什么"，判断哪些值得深读、
        哪些可以忽略，避免 FOMO 也能保持专业敏感度
    secondary:
      persona: AI 创业者 / 独立开发者
      context: 同上

  value_hypothesis:
    primary: "每日节省 25-40 分钟的信息 triage 时间"
    secondary: "降低 AI 领域关键信息的遗漏率"
    falsifiable_signal: |
      试点 2 周后，用户主观报告"不再需要主动刷信息流"的比例 ≥60%

  success_metrics:
    leading:
      - 日报打开率（D+1）≥ 50%
      - 日报完成阅读率（≥80% 内容）≥ 30%
      - 主观满意度 NPS ≥ 30
    lagging:
      - 30 日留存 ≥ 40%
      - 用户主动推荐比例（口碑/转发）≥ 15%

  scope:
    in_scope:
      - 每日定时推送（默认 8:00 AM，可配置）
      - 内容来源：现有 ai-pm-daily 32 源 RSS
      - AI 生成 4 维度分析 + 主编筛选（人机协同）
      - 渠道：邮件（v1）/ 飞书 IM（v1.1）
    explicit_non_goals:
      - 不做个性化推荐引擎（v1 仅"通用精选"）
      - 不做内容生成（只做筛选 + 摘要）
      - 不做社交分享 / 评论互动
      - 不做付费墙（v1 完全免费）

  key_assumptions:
    - id: A1
      assumption: "用户真的会每天早上看推送，而不是被其他通知淹没"
      test: "2 周试点后日报打开率"
      invalidation: "打开率 <30% 则假设不成立"
    - id: A2
      assumption: "AI 4 维度分析比纯人工筛选更有价值"
      test: "A/B 测试：AI 增强版 vs 纯人工版"
      invalidation: "纯人工版满意度 ≥ AI 版"
    - id: A3
      assumption: "免费模式能持续运营（成本可控）"
      test: "单用户日均成本 < 单用户日均价值"
      invalidation: "LLM 成本 > 0.5 元/用户/天"

  delivery_mode: create
  recommended_next_skill: builder-spec
```

---

## Step 4：Handoff Packet（交给 builder-spec）

```yaml
handoff_packet:
  from: builder-frame
  to: builder-spec
  artifact_refs:
    feature_frame: ai-pm-daily-smart-push-2026-07
    upstream_artifacts:
      - ai-pm-daily 现有 32 源 RSS pipeline
      - ai-pm-daily 现有 DeepSeek LLM analyzer
  preserved_context:
    - non_goals 中"不做个性化推荐 / 不做内容生成 / 不做付费墙"
    - key_assumptions A1/A2/A3 的 falsification 条件
    - success_metrics 的 leading vs lagging 区分
  recommended_spec_profile: minimal_execution_pack
  profile_reasoning: |
    这是新建模式（create），目标形态明确（基于已有 pipeline 增加推送层），
    不涉及重塑。使用 minimal_execution_pack 冻结目标 + non-goals + 关键契约 +
    验收即可，不需要 full_execution_pack。
  open_questions_for_spec:
    - "推送时间是否支持 per-user 时区？v1 是否先固定 HKT？"
    - "邮件 provider 选型（Resend / 阿里云 / 腾讯企业邮）"
    - "飞书 IM 集成方式（自建应用 vs Webhook）"
```

---

## Step 5：anti-patterns（反模式示范）

### 反模式 1：把解决方案当成需求

❌ 错误做法：直接进入 builder-spec，spec 写成"实现邮件推送 + 飞书推送 + 公众号推送"，因为用户提到了"推送"。

✅ 正确做法：grill_frame 先问"你为什么需要推送？要解决什么问题？"，发现真正的价值是"节省信息 triage 时间"，推送只是载体之一。Frame 阶段保留多个载体假设，由 spec/prototype 阶段根据成本和用户反馈决定。

### 反模式 2：Frame 阶段伪造精确

❌ 错误做法：`value_hypothesis: "节省 37 分钟"`（伪造精确数字）。

✅ 正确做法：`value_hypothesis: "节省 25-40 分钟"`（区间 + 置信度），并标注 falsifiable_signal。

### 反模式 3：把所有假设都标成 confirmed

❌ 错误做法：`key_assumptions[].status: confirmed`（frame 阶段无任何 confirmed 假设）。

✅ 正确做法：所有假设 `status: untested`，并附 `test` + `invalidation` 字段。Frame 是"把模糊变清楚"，不是"验证假设"——验证留给 spec/prototype/pilot 阶段。

### 反模式 4：non_goals 缺失

❌ 错误做法：scope 只有 in_scope，没有 explicit_non_goals。下游 spec 会无限扩展（"要不要也做个 App？要不要也做个网页版？"）。

✅ 正确做法：explicit_non_goals 列出"v1 明确不做"的事项，每个 non_goal 给一句话理由。

### 反模式 5：跳过 handoff packet

❌ 错误做法：frame 输出后让用户直接"自己看着办"。

✅ 正确做法：必须输出 handoff_packet，明确 `to`（下一个 skill）、`artifact_refs`、`preserved_context`、`recommended_spec_profile`、`open_questions_for_spec`。这是 builder-frame 的输出契约，不可省略。

---

## 参考

- `skills/builder-frame/SKILL.md` — Skill 入口与执行流程
- `kernel/packets/feature-frame.schema.md` — Feature Frame schema（事实源）
- `kernel/packets/intent-packet.schema.md` — Intent Packet（builder-frame 输入）
- `loops/recipes/grill-decision.loop.md` — grill_frame 模式的提问模式
