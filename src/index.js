import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

// 创建一个简单的 MCP 服务器
const server = new McpServer({
  name: "FindMCP",
  description: "提供MCP网址目录",
  version: "1.0.0"
});

// 定义Smithery查询工具
server.tool(
  'smithery_search',
  {},
  async () => {
    console.error('Smithery搜索工具被调用');
    
    return {
      content: [{ 
        type: "text", 
        text: "Smithery.ai MCP服务目录：\nhttps://smithery.ai/\n\n您可以在此网站找到各种MCP服务，包括Sequential Thinking、Github、Brave Search等。" 
      }]
    };
  }
);

// 使用标准输入输出传输层
const transport = new StdioServerTransport();

// 添加错误处理
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('未处理的Promise拒绝:', reason);
});

// 连接服务器
server.connect(transport).then(() => {
  console.error('MCP 服务器已启动');
  console.error('可用工具:');
  console.error(' - smithery_search: 返回Smithery.ai网址');
}).catch(error => {
  console.error('启动服务器时发生错误:', error);
  process.exit(1);
});