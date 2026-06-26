# 运行报告 Schema（Run Report Schema）

```yaml
run_id:
task:
mode:
skills_used:
artifacts:
files_changed:
commands_run:
verification_result:
completion_claim: PASS | PARTIAL | BLOCKED
open_risks:
human_review_points:
next_step:
```

重要 Builder 工作的 final report 应使用此结构；字段名保持英文，便于 runtime、eval 和人工审阅复用。
