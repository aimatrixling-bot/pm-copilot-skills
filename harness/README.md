# Execution Harness

Execution Harness defines how AI Builder OS work should run safely and verifiably.

Skill defines what to produce. Harness defines how to avoid drift, fake completion, unsafe side effects, and unreviewable output.

## Modules

| Module | Purpose |
| --- | --- |
| Guides | Set task, context, scope, and minimum output before execution |
| Sensors | Watch for drift, fake UI, fake tests, missing evidence |
| Gates | Enforce decision points before claiming completion |
| Steering Loop | Adjust when execution deviates from the goal |
| Tool Policy | Define allowed, cautious, and approval-required actions |
| Artifact Write Policy | Define how project assets are written, promoted, indexed, and handed off |
| Run Report | Summarize result, evidence, risk, and handoff |

## Rule

Harness must stay lightweight. It should constrain execution, not become a second methodology stack.
