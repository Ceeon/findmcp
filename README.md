findmcp

# MCP 搜索工具

这是一个基于 Model Context Protocol (MCP) 的搜索工具，允许 Cursor 直接访问和使用各种 MCP 服务提供商的搜索功能。

## 功能特点

- 直接连接到 MCP 服务提供商的搜索工具
- 支持多种 MCP 搜索服务：Composio Search、Tavily、Perplexity AI 等
- 统一的接口调用多种搜索服务
- 完全兼容 MCP 协议，可与 AI 助手无缝集成

## 工作流程

该工具采用简洁高效的三步工作流程：

1. **发现服务**：从 findmcp 获取可用的 MCP 服务网址和接口信息
2. **服务连接**：将 MCP 服务网址和接口规范告知 Cursor
3. **执行搜索**：Cursor 直接连接到 MCP 服务并执行搜索请求

这种流程的优势：
- **直接访问**：无需中间层处理，减少延迟
- **灵活扩展**：可以轻松添加新的 MCP 服务提供商
- **统一体验**：通过标准化的 MCP 协议提供一致的搜索体验

## 支持的 MCP 搜索服务

目前支持以下 MCP 搜索服务：

- Composio Search (https://mcp.composio.dev/)
- Tavily
- Perplexity AI
- Exa
- Linkup
- YouSearch
- Serp API
- Fireflies
- Semantic Scholar

## 技术实现

该工具作为 MCP 客户端，通过以下步骤连接到各种 MCP 搜索服务提供商：

1. **服务发现**：自动或手动获取 MCP 服务提供商的端点信息
2. **请求处理**：接收搜索请求（服务名称和查询关键词）
3. **服务连接**：根据服务名称连接到指定的 MCP 搜索服务
4. **请求转发**：将搜索请求转发给相应的 MCP 服务
5. **结果处理**：接收、格式化并返回搜索结果

## 安装与配置

### 安装依赖

```bash
npm install
```

### 配置环境变量

创建 `.env` 文件并配置以下变量：
