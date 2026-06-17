---
name: pm-job-search
displayName: 求职准备
displayDescription: 定制化 PM 求职材料准备
description: "Prepare PM job applications with tailored materials — JD analysis, resume optimization, cover letters, and interview prep. Use this skill whenever the user needs PM job search help, says '简历', '面试', 'job search', 'PM求职', 'resume', 'cover letter', '求职信', 'JD分析', '岗位匹配', '面试准备', or wants to prepare PM application materials. Also trigger when the user says 'help me with this JD', 'optimize my resume for this role', 'prepare for a PM interview', '帮我分析这个岗位', '简历怎么改', or '面试怎么准备'. Analyzes JD requirements, matches personal experience, and generates targeted materials using STAR method."
user-invocable: true
argument-hint: "[JD 链接或职位描述]"
---

# PM 求职工具

<SUBAGENT-STOP>
如果是子代理派发执行此 Skill，直接按下方指令执行，不重新加载入口 Skill。
</SUBAGENT-STOP>

分析 JD，匹配个人经历，生成针对性求职材料。好的求职材料不是罗列经历，是对应需求。

## Intent Packet

| 字段 | 捕获内容 | 来源 |
|---|---|---|
| **Want** | 分析 JD 匹配个人经历，生成针对性求职材料（JD 分析 + 简历建议 + 面试准备） | 用户输入剥离"帮我分析这个岗位"后的任务本质 |
| **Constraints** | 个人经历已固定（不可改写经历本身）、JD 是目标（不可改 JD）、匹配度 < 60% 不建议投 | JD 客观要求 + Iron Law |
| **Context Sources** | JD 文本/链接 + 个人简历/经历 + `references/job-search-guide.md`（隐含期望解读、职级对照表） | 用户提供 + Glob + Read |
| **Depth** | Draft（只出 JD 分析）/ Review（JD 分析 + 简历建议 + 面试准备，默认）/ Release（含模拟面试问题 + 回答模板） | 用户声明或推断 |
| **Output Target** | 求职者本人（针对性材料准备） | 用户明示或推断 |

未提供时标注 `[假设]`，交付前确认。

## Iron Law

| 铁律 | 违反后果 |
| --- | --- |
| JD 每条要求必须有匹配评估 | 立即补充——未评估的要求 = 盲区 |
| 简历经历必须 STAR 法则 + 量化 | 重写——"参与了 X 项目" 不算经历描述 |
| 匹配度 < 60% 的岗位不建议投 | 标注差距——投 = 浪费双方时间 |

## 反合理化

| 你可能在想的 | 真相 |
| --- | --- |
| "简历越长越好" | 超过 2 页 = 没重点。1-2 页足够 |
| "把所有经历都写上" | 无关经历 = 噪音。只写与 JD 相关的 |
| "面试准备太花时间" | 不准备 = 白面试。30 分钟结构化准备足够 |
| "匹配度不高但可以试试" | 试试 = 浪费时间。先补差距再投 |
| "JD 是死的，我可以灵活解读" | 灵活解读 ≠ 自作多情。硬性要求不满足就是不满足 |

## Capability Index

| 维度 | CAN（可以做） | CANNOT → HANDOFF（不做，转交） |
|---|---|---|
| **任务类型** | JD 分析（硬性/软性/隐含要求）、简历优化建议（STAR + 量化）、求职信草稿、面试问题准备、匹配度评估 | 职业规划咨询 → 人工职业教练；简历模板设计 → 设计工具；行业薪酬谈判 → 独立薪酬调研 |
| **输出格式** | inline Markdown（JD 分析 + 匹配矩阵 + 简历建议 + 面试问题表） | docx/pdf 排版简历 → 用户自行排版工具；视频面试模拟 → 视频平台 |
| **深度范围** | 从 JD 解析到匹配度评估 + 材料建议；单次处理 1 个岗位 | 批量投递策略 → 人工规划；求职全周期管理（投递→面试→Offer 谈判）→ 用户自行管理 |

**边界原则**：求职材料是"匹配"而非"包装"。匹配度 < 60% 时诚实标注差距，不粉饰经历。

## 执行流程

```
1. 接收 JD + 个人经历
2. JD 分析
   ├── 提取硬性要求（学历/年限/技能）
   ├── 提取软性要求（能力/特质）
   ├── 识别隐含期望（从团队描述/业务方向推断）
   └── 标注匹配/不匹配/部分匹配
3. 按材料类型产出：
   ├── resume: 简历优化建议（STAR + 量化）
   ├── cover: 求职信草稿
   └── interview: 面试问题 + 回答模板
4. 匹配度评估（≥ 60% 可投）
5. Iron Law 检查
   ├── JD 每条要求已评估？
   ├── 经历用 STAR 法则？
   └── 匹配度已计算？
```

## STAR 法则

| 要素 | 说明 | 示例 |
| --- | --- | --- |
| **S**ituation | 背景和情境 | "负责日活 50 万的电商 App 推荐..." |
| **T**ask | 具体任务 | "提升推荐点击率，目标从 3% 到 5%" |
| **A**ction | 采取的行动 | "设计 A/B 测试框架，跑 12 组实验..." |
| **R**esult | 量化结果 | "点击率从 3% 提升至 5.2%，GMV +15%" |

## 交付前检查

- [ ] JD 硬性/软性要求均已分析
- [ ] 每条要求有匹配度评估
- [ ] 经历描述使用 STAR 法则
- [ ] 成就有量化数据
- [ ] 匹配度 ≥ 60% 或差距已标注

## 产出格式

```markdown
## JD 分析: [公司 - 职位]

### 匹配度评估
**总体匹配度**: [X%]

### 关键要求匹配
| 要求 | 类型 | 匹配度 | 证据/差距 |
| --- | --- | --- | --- |
| [要求 1] | 硬性 | ✅/⚠️/❌ | [证据或差距说明] |

### 简历优化建议
[针对性修改建议，STAR 法则重写]

### 面试准备
| 可能问题 | 考察点 | 回答要点 |
| --- | --- | --- |
```

---

求职深度指南（JD 隐含期望解读、面试类型分析、PM 职级对照表）见 `references/job-search-guide.md`。

## 常见错误

| 错误 | 后果 | 正确做法 |
| --- | --- | --- |
| 简历无量化 | 缺乏说服力 | 每条成就必须有数字 |
| 不分析 JD 盲投 | 白费精力 | 先评估匹配度再决定 |
| 经历描述太平 | 无法区分 | 用 STAR 法则结构化 |
| 忽略隐含期望 | 面试被问住 | 从团队/业务描述推断 |
| 一份简历投所有 | 无针对性 | 按 JD 调整重点 |

## Meta-Review

交付完成后对照方法论自审：

1. **方法论骨架**：是否遵循 JD 分析 → 匹配评估 → 材料产出 → Iron Law 检查 的完整流程？JD 每条要求是否都有匹配评估？
2. **反理实化警惕**：5 条"你可能在想的"是否真的被警惕了？（重点检查"匹配度不高但可以试试"、"JD 是死的，我可以灵活解读"）
3. **Iron Law 验证**：3 条铁律（JD 每条要求有匹配评估 / 经历 STAR + 量化 / 匹配度 < 60% 标注差距）是否已验证满足？

自审结果 1-2 句话附在交付物末尾。不通过时回到对应步骤修正，不在 Meta-Review 阶段打补丁。

## Evolution Writeback

执行后自问以下 3 个问题，有则记录到 `docs/evolution-log.md`：

1. **方法论偏差**：JD 分析 → 材料产出的流程是否有不够贴合实际的地方？（如某些行业 JD 格式特殊、面试类型分类需要调整）
2. **反理实化补充**：是否遇到了表格未覆盖的新借口模式？（如"我的经历太普通不好量化"）
3. **边界调整信号**：CAN/CANNOT 是否需要调整？（如某些职业咨询本应转交但被硬撑）

**记录格式**：

```markdown
## YYYY-MM-DD — pm-job-search — [项目/场景]
- **观察**: [一句话描述]
- **建议回写**: [回写到哪个文件/章节 / "仅记录不回写"]
- **置信度**: 高/中/低
```

无观察时跳过此章节，不强写。

## Metadata

```yaml
track: personal
phase: null
depends_on: []
feeds_to: []
schema_type: free
persist_to: []
guardrails:
  - JD 每条要求必须有匹配评估
  - 简历经历必须 STAR 法则 + 量化
  - 匹配度 < 60% 的岗位标注差距，不建议投
  - 不编造经历或夸大量化数据
```
