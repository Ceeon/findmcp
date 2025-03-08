# MCP 服务发现工具 - 源代码

本目录包含 MCP 服务发现工具的源代码。

## 目录结构

```
src/
├── index.js            # 主入口文件，MCP服务器配置和启动
└── README.md           # 源代码说明文档
```

## 主要文件说明

### index.js

主入口文件，负责：
- 创建MCP服务器实例
- 注册MCP工具
- 配置标准输入输出传输层
- 启动服务器并处理连接

## 主要功能

主入口文件 `index.js` 负责：

1. 创建MCP服务器实例
2. 注册`smithery_search`工具
3. 配置标准输入输出传输层
4. 启动服务器并处理连接

服务器启动后，它将监听来自Cursor的请求，并提供MCP服务的信息。

## Cursor 集成说明

本 MCP 服务器专为 Cursor 设计，提供以下工具：

- `smithery_search`: 返回Smithery.ai网址，用于查询更多MCP服务

### Smithery查询工具

`smithery_search`工具是一个简单的查询工具，当用户请求时，它会返回Smithery.ai网站的链接。用户可以通过以下方式调用此工具：

1. 直接指令：`请使用smithery_search工具查询MCP服务`
2. 简洁语法：`@https://smithery.ai/`

这个工具的目的是让用户能够方便地访问Smithery.ai网站，该网站提供了丰富的MCP服务目录，包括Sequential Thinking、Github、Brave Search等多种服务。

### 部署选项

本MCP服务器有两种部署方式：

1. **本地部署**：
   - 在本地运行服务器
   - 在Cursor中配置命令行方式连接
   - 命令：使用绝对路径，例如 `cd /完整路径/MCP-cursor && npm start`

2. **Smithery.ai部署**：
   - 将代码推送到GitHub仓库
   - 在https://smithery.ai/new上部署服务
   - 在Cursor中使用Smithery.ai提供的URL连接
   - 类型：选择"url"而不是"command"
   - URL：使用Smithery.ai提供的部署URL

注意：Cursor 仅支持 MCP 的工具功能，不支持资源、提示模板等其他功能。

## 最近修复

最近修复了以下问题：

1. JSON解析错误：修复了 "Unexpected token 'H', 'Hello World 工具被调用' is not valid JSON" 错误
   - 原因：调试信息被输出到标准输出，干扰了JSON通信
   - 解决方案：将所有 `console.log` 调用改为 `console.error`，确保调试信息输出到stderr而不是stdout

2. 日志记录优化：
   - 所有调试和日志信息现在使用 `console.error`
   - 确保不会干扰MCP协议的JSON通信

3. 代码简化：
   - 移除了不再使用的服务发现功能
   - 简化了项目结构，只保留必要的文件
   - 直接在工具中返回固定文本，不依赖外部数据

这些修复和优化确保了MCP服务器能够正确地与Cursor通信，并且代码结构更加简洁明了。 