# 辅助工具目录 (utils)

这个目录包含MCP搜索服务器使用的辅助函数和工具。

## 文件说明

- `helpers.js`: 包含各种辅助函数

## 辅助函数 (helpers.js)

`helpers.js` 文件提供了一系列通用的辅助函数，用于简化搜索工具的实现。主要功能包括：

### 主要函数

- `formatSearchResults`: 格式化搜索结果为易于阅读的文本
- `truncateText`: 将文本截断到指定长度，并添加省略号
- `formatError`: 从错误对象中提取有用的错误信息
- `isValidQuery`: 验证搜索查询是否有效
- `safeJsonParse`: 安全地解析JSON字符串，避免解析错误导致程序崩溃

这些辅助函数被本地搜索和网络搜索工具共同使用，提高了代码的可维护性和复用性。 