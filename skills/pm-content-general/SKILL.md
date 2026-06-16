---
name: pm-content-general
displayName: Content General
displayDescription: 通用内容生成
description: "Generate general content like blog posts, landing pages, release notes, and social media posts. Trigger when user says 'blog post', 'landing page', 'release note', '内容生成', 'social media', or needs non-WeChat content creation."
user-invocable: true
argument-hint: "[内容类型: blog/landing/release/social] [主题]"
---

# 通用内容生成

<SUBAGENT-STOP>
如果是子代理派发执行此 Skill，直接按下方指令执行，不重新加载入口 Skill。
</SUBAGENT-STOP>

生成结构化的通用内容——博客文章、落地页、发布说明、社交媒体帖子。与 pm-writer 的区别：pm-writer 是公众号垂直领域（中文长文），pm-content-general 是通用中英文内容，覆盖多种格式和渠道。

**核心原则**：内容必须有目标受众，没有受众定义的内容是噪音。

## Intent Packet

| 字段 | 捕获内容 | 来源 |
|---|---|---|
| **Want** | 按内容类型（blog/landing/release/social）生成结构化通用内容草稿 | 用户输入剥离"写一篇博客"后的任务本质 |
| **Constraints** | 不编造数据/引用、必须标注 [Draft, pending review]、CTA 明确且与内容衔接 | Iron Law + 内容类型规范 |
| **Context Sources** | 用户提供的主题 + 项目已有文档（Glob 搜索）+ 产品/功能信息 + 目标平台规范 | 用户提供 + Glob + Read |
| **Depth** | Draft（结构化大纲）/ Review（完整草稿 + SEO 友好，默认）/ Release（含多平台适配版本 + 发布就绪） | 用户声明或推断 |
| **Output Target** | 内容消费者（博客读者/落地页访客/社媒粉丝）+ 发布审阅者（human review 后发布） | 用户明示或推断 |

未提供时标注 `[假设]`，交付前确认。

## Iron Law（铁律）

| 铁律 | 违反后果 |
| --- | --- |
| 内容必须有 target audience 定义 | 停止——定义目标受众后再生成内容 |
| 不编造数据或引用 | 所有统计数据/引用必须标注来源；无来源时标注"需验证" |
| 发布前必须有人类审阅 | AI 生成的内容是草稿，不是终稿——标注 [Draft, pending review] |

## 反合理化

| 你可能在想的 | 真相 |
| --- | --- |
| "内容越长越好" | 目标受众决定长度——技术博客需要深度，社交媒体需要精炼 |
| "AI 生成的内容可以直接发布" | AI 内容必须有 human review，尤其是数据和引用 |
| "一个模板适用所有渠道" | 博客、落地页、社交媒体的格式、语气、CTA 完全不同 |
| "CTA 放最后就行" | CTA 必须明确且与内容自然衔接，不是硬塞在末尾 |

## Capability Index

| 维度 | CAN（可以做） | CANNOT → HANDOFF（不做，转交） |
|---|---|---|
| **任务类型** | 博客文章、落地页文案、发布说明、社交媒体帖子的结构化草稿 | 公众号长文 → pm-writer-draft（垂直领域）；深度 SEO 优化 → pm-seo；PRD → pm-prd；竞品内容参考 → pm-comp |
| **输出格式** | inline Markdown + HTML 注释元数据（Type/Audience/Status/Generated） | docx/pdf 排版 → 用户自行排版工具；视频脚本/音频脚本 → 视频脚本工具 |
| **深度范围** | 单次处理 1 个内容类型 + 1 个主题；从大纲到发布就绪草稿 | 多渠道一次性发布调度 → 用户自行管理；内容运营全周期（选题→发布→复盘）→ 用户自行管理 |

**边界原则**：AI 生成的内容是草稿，不是终稿。所有内容必须标注 [Draft, pending review]，数据/引用必须可溯源。

## 内容类型规范

### blog — 博客文章

**结构**：
1. Hook（1-2 句抓住读者注意力）
2. 问题/背景（为什么这个话题重要）
3. 核心内容（分段落，每段一个要点）
4. 实践建议 / 洞察
5. CTA（评论/订阅/试用）

**语气**：专业但易读，第一人称或第二人称

### landing — 落地页

**结构**：
1. Hero Section（标题 + 副标题 + CTA）
2. Pain Point（用户痛点）
3. Solution（产品/功能如何解决）
4. Social Proof（数据/案例/引用，标注来源）
5. Features（3-5 个核心功能，每个 1-2 句）
6. Final CTA（与 Hero CTA 呼应）

**语气**：说服力强，简洁直接，SEO 友好

### release — 发布说明

**结构**：
1. 版本号 + 发布日期
2. 一句话概述
3. New Features（新增功能列表）
4. Improvements（改进项列表）
5. Bug Fixes（修复项列表）
6. Breaking Changes（如有）
7. Upgrade Guide（如需）

**语气**：技术性，精确，面向开发者或用户

### social — 社交媒体帖子

**结构**：
1. Hook（前 3 秒必须抓住注意力）
2. 核心信息（1-3 个要点）
3. CTA（明确动作：链接/评论/转发）

**格式要求**：
- Twitter/X: ≤ 280 字符
- LinkedIn: 150-300 字，专业语气
- 其他平台: 标注平台名，按平台规范调整

## 执行流程

```
触发 pm-content-general
    ├── 1. 确认内容类型和主题
    ├── 2. 确认目标受众（未提供则推断 + 标注 [假设]）
    ├── 3. 读取上下文
    │     ├── Glob 搜索项目已有文档
    │     └── 提取相关产品/功能信息
    ├── 4. 按内容类型生成草稿
    │     ├── 遵循对应结构规范
    │     ├── SEO 友好（标题含关键词、heading 清晰）
    │     └── CTA 明确且自然
    ├── 5. Iron Law 检查
    │     ├── 目标受众是否定义？
    │     ├── 数据/引用是否标注来源？
    │     └── 是否标注 [Draft, pending review]？
    └── 6. 交付草稿
```

## 输出规范

直接输出 Markdown 格式内容草稿。文档顶部包含元数据：

```
<!--
Type: blog | landing | release | social
Audience: [目标受众描述]
Status: Draft, pending review
Generated: YYYY-MM-DD
-->
```

## 交付前检查

- [ ] 目标受众已定义（不是"所有人"）
- [ ] 数据/引用全部标注来源，无来源标注"需验证"
- [ ] CTA 明确且与内容自然衔接
- [ ] 内容格式符合目标类型规范
- [ ] 标题包含核心关键词（SEO 友好）
- [ ] 标注 [Draft, pending review]

## 后续推荐

| 场景 | 推荐 Skill |
| --- | --- |
| 公众号长文 | pm-writer-draft（垂直领域） |
| 落地页 SEO 优化 | pm-seo |
| 产品发布 PRD | pm-prd |
| 竞品内容参考 | pm-comp |

## Meta-Review

交付完成后对照方法论自审：

1. **方法论骨架**：是否遵循 内容类型确认 → 目标受众定义 → 上下文读取 → 按类型规范生成 → Iron Law 检查 的完整流程？
2. **反理实化警惕**：4 条"你可能在想的"（长度即价值 / 可直接发布 / 一模板走天下 / CTA 硬塞）是否真的被警惕了？
3. **Iron Law 验证**：3 条铁律是否已验证满足（受众已定义、数据有来源、标注 [Draft, pending review]）？

自审结果 1-2 句话附在交付物末尾。不通过时回到对应步骤修正。

## Evolution Writeback

执行后自问以下 3 个问题，有则记录到 `docs/evolution-log.md`：

1. **方法论偏差**：内容类型规范（blog/landing/release/social）是否不够贴合实际场景？
2. **反理实化补充**：是否发现新的"AI 内容万能"借口模式？
3. **边界调整信号**：CAN/CANNOT 边界是否需要调整（如某个内容类型频繁被转交）？

记录格式：`## YYYY-MM-DD — pm-content-general — [内容类型/场景]`

无观察时跳过此章节，不强写。

## Metadata

```yaml
track: growth
phase: 4
depends_on: []
feeds_to: []
schema_type: free
persist_to: ["projects/{project}/docs/content/"]
guardrails:
  - 不编造数据或引用，无来源标注"需验证"
  - CTA 必须明确且与内容自然衔接
  - 内容 SEO 友好（标题含关键词、heading 清晰）
  - 标注 [Draft, pending review]
```
