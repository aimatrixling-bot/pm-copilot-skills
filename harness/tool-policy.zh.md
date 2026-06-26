# 工具策略（Tool Policy）

## 默认允许（Allowed By Default）

- 读取文件；
- 检查 git status 和 diff；
- 创建草稿资产；
- 运行本地验证命令；
- 生成 task packet 和 Plan。

## 谨慎使用（Cautious）

- 修改既有代码；
- 安装依赖；
- 修改配置；
- 运行耗时或外部命令。

## 需要人工确认（Requires Human Approval）

- 删除文件或数据；
- commit 或 push；
- deploy；
- 发送消息或邮件；
- 修改生产数据；
- 修改权限；
- 调用外部写入 API。
