# Builder Router

## 目的

`builder-router` 是 AI Builder OS 面对模糊请求时的默认入口。

它判断当前请求应该由哪种方式处理：

- 普通回答；
- Prompt；
- Plan；
- Goal；
- Plan -> Goal；
- `builder-frame`；
- `builder-spec`；
- `builder-prototype`；
- `builder-agent-task`；
- `builder-review`；
- `builder-decision`。

## 路由问题

1. 这个任务是否足够小、足够清楚，可以直接回答？
2. 用户的目标、范围、上下文或验证方式是否缺失？
3. 是否已有明确完成条件和验证方法？
4. 这是否是一个产物创建任务？
5. 用户是否要把任务交给另一个 agentic coding 工具执行？
6. 用户是否在请求评审、证据检查或就绪度判断？
7. 是否有必须沉淀的重要决策？

## 输出契约

```yaml
route_type: answer | prompt | plan | goal | plan_to_goal | skill_route | ask_first
recommended_mode: prompt | plan | goal | plan_to_goal | skill
recommended_skill:
reasoning_summary:
missing_context:
risk_flags:
next_prompt:
handoff_packet:
```

## 门禁

如果 router 不能解释为什么选择某条路径，就必须选择 Plan，或最多提出三个高价值澄清问题。

路由结果必须说明为什么不是相邻路径，尤其是 `builder-frame` vs `builder-spec`、`builder-prototype` vs `builder-agent-task`、`builder-review` vs `builder-decision`。
