# 搜索工具目录 (tools)

这个目录包含MCP搜索服务器提供的搜索工具实现。

## 文件说明

- `localSearch.js`: 本地文件搜索工具的实现
- `webSearch.js`: 网络搜索工具的实现

## 本地搜索工具 (localSearch.js)

本地搜索工具允许在本地文件系统中搜索内容。主要功能包括：

- 递归搜索目录中的文件
- 支持按文件类型过滤
- 提取匹配内容的上下文
- 格式化搜索结果

### 主要函数

- `performLocalSearch`: 执行本地文件搜索的主函数
- `searchDirectory`: 递归搜索目录
- `extractMatchContext`: 提取匹配内容的上下文
- `formatResults`: 格式化搜索结果

## 网络搜索工具 (webSearch.js)

网络搜索工具允许通过多种搜索引擎进行网络搜索。主要功能包括：

- 支持多种搜索引擎（Brave、Google、Bing）
- 配置化的API密钥管理
- 格式化搜索结果

### 主要函数

- `performWebSearch`: 执行网络搜索的主函数
- `searchWithBrave`: 使用Brave搜索引擎
- `searchWithGoogle`: 使用Google搜索引擎
- `searchWithBing`: 使用Bing搜索引擎
- `formatWebResults`: 格式化网络搜索结果 