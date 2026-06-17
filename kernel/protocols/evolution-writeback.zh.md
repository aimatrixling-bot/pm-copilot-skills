# 演进回写协议

演进回写用于在一次运行后记录可复用观察。

## 何时记录

当运行暴露以下情况时，才写 evolution note：

- skill 触发不匹配；
- 模板过重或过弱；
- 缺少门禁；
- 缺少 eval case；
- 可复用的用户偏好；
- 反复出现的失败模式。

## 不要记录

- 泛泛的会话总结；
- 敏感数据；
- 一次性噪声；
- 未验证猜测。

## 格式

```markdown
## YYYY-MM-DD - [area] - [scenario]
- Observation:
- Suggested writeback:
- Confidence: high | medium | low
```
