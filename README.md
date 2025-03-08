# MCP 官方文档

https://modelcontextprotocol.io/llms-full.txt
https://github.com/modelcontextprotocol/typescript-sdk

# FindMCP - MCP 服务目录工具

这是一个简单的 MCP 服务器，名为 FindMCP，提供 MCP 服务的目录信息。

## 功能特点

- 提供 MCP 服务目录
- 完全兼容 MCP 协议
- 专为 Cursor 设计

## 支持的 MCP 服务

目前提供以下 MCP 服务的目录信息：

- Smithery.ai (https://smithery.ai/)

## 安装与配置

### 本地安装

```bash
npm install
```

### 本地启动服务

使用提供的启动脚本：

```bash
./start-mcp.sh
```

或直接使用 npm：

```bash
npm start
```

### 在Smithery.ai上部署

您也可以将此MCP服务部署到Smithery.ai平台：

1. 访问 https://smithery.ai/new
2. 点击"Connect with GitHub"连接您的GitHub账号
3. 将代码推送到GitHub仓库
4. 在Smithery.ai上选择您的仓库并配置服务
5. 点击部署按钮完成部署

部署后，您将获得一个Smithery.ai提供的URL，可以在Cursor中使用该URL访问您的MCP服务。

### Smithery部署配置文件

本项目包含以下Smithery部署所需的配置文件：

#### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "src/index.js"]
```

#### smithery.yaml

```yaml
command:
  function: node src/index.js
```

这些配置文件是Smithery.ai平台部署所必需的，它们定义了如何构建和运行MCP服务。

## 在 Cursor 中使用

### 添加 MCP 服务器

在 Cursor 中添加此 MCP 服务器：

1. 打开 Cursor 设置（点击左下角齿轮图标）
2. 找到 MCP Servers 部分
3. 点击 "Add new MCP server"
4. 填写以下信息：
   - 名称：FindMCP
   - 类型：command
   - 命令：输入完整的绝对路径，例如：
     ```
     /Users/chengfeng/Desktop/代码/MCP合集/MCP-cursor/start-mcp.sh
     ```
     或者使用更可靠的方式：
     ```
     cd /Users/chengfeng/Desktop/代码/MCP合集/MCP-cursor && npm start
     ```

> **重要提示**：如果路径中包含中文或空格，请确保正确转义。最好使用启动脚本而不是直接使用 npm start 命令。

### 告诉 LLM 使用 MCP 服务

要让 Cursor 中的 LLM 使用 MCP 服务，您需要在对话中明确指示 LLM：

1. **直接指令方式**：
   ```
   请使用 smithery_search 工具查询MCP服务
   ```

2. **简洁语法方式**：
   ```
   @https://smithery.ai/
   ```

LLM 应该会识别这些指令并调用相应的 MCP 工具。

## 可用工具

服务器提供以下工具：

- `smithery_search`: 返回Smithery.ai网址，用于查询更多MCP服务

## 使用示例

### 使用Smithery查询工具

要使用Smithery查询工具，您可以在对话中使用以下指令：

```
请使用smithery_search工具查询MCP服务
```

或者使用更简洁的方式：

```
@https://smithery.ai/
```

系统将返回Smithery.ai网站的链接，您可以访问该网站查看完整的MCP服务列表。

## 故障排除

如果遇到 "Failed to create client" 错误：

1. 确保使用正确的路径和转义字符
2. 尝试重启 Cursor
3. 检查 MCP 服务器是否正常运行
4. 考虑将项目移动到没有中文字符和空格的路径

如果遇到 "Unexpected token 'H', 'Hello World 工具被调用' is not valid JSON" 错误：

1. 这是因为服务器在标准输出中混入了调试信息，干扰了JSON通信
2. 已修复：将console.log改为console.error，确保调试信息输出到stderr而不是stdout
3. 如果仍然出现此问题，请检查src/index.js中的所有console.log调用，确保它们都使用console.error

如果 LLM 不使用 MCP 工具：

1. 确保 MCP 服务器已成功连接（在 Cursor 设置中显示为 "Enabled"）
2. 使用更明确的指令，直接提及工具名称
3. 尝试重新启动对话
4. 检查 Cursor 控制台是否有错误信息

## 调试

如果需要调试 MCP 服务器：

1. 在终端中手动运行服务器：`npm start`
2. 查看输出日志，检查是否有错误信息
3. 确保 MCP 服务器能够正常启动和运行

## 项目状态

这是一个完整的 MCP 服务器实现，基于 Model Context Protocol 规范开发。服务器使用 @modelcontextprotocol/sdk 包构建，通过标准输入输出与 Cursor 等客户端通信。