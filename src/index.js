import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { LOCAL_SEARCH_TOOL, performLocalSearch } from './tools/localSearch.js';
import { WEB_SEARCH_TOOL, performWebSearch } from './tools/webSearch.js';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 创建MCP服务器
const server = new McpServer({
  name: "search-server",
  description: "一个提供本地和网络搜索功能的MCP服务器",
  version: "1.0.0"
});

// 注册本地搜索工具
server.tool(
  'local_search',
  { query: z.string() },
  async ({ query }) => {
    console.log(`执行本地搜索: ${query}`);
    try {
      const result = await performLocalSearch({ query });
      return {
        content: [{ type: "text", text: result }]
      };
    } catch (error) {
      console.error(`本地搜索错误: ${error.message}`);
      return {
        content: [{ type: "text", text: `执行本地搜索时发生错误: ${error.message}` }],
        isError: true
      };
    }
  }
);

// 注册网络搜索工具
server.tool(
  'web_search',
  { query: z.string() },
  async ({ query }) => {
    console.log(`执行网络搜索: ${query}`);
    try {
      const result = await performWebSearch({ query });
      return {
        content: [{ type: "text", text: result }]
      };
    } catch (error) {
      console.error(`网络搜索错误: ${error.message}`);
      return {
        content: [{ type: "text", text: `执行网络搜索时发生错误: ${error.message}` }],
        isError: true
      };
    }
  }
);

// 使用标准输入输出传输层启动服务器
const transport = new StdioServerTransport();

server.connect(transport).then(() => {
  console.log('MCP 搜索服务器已启动');
  console.log('可用工具:');
  console.log(` - local_search: ${LOCAL_SEARCH_TOOL.description}`);
  console.log(` - web_search: ${WEB_SEARCH_TOOL.description}`);
}).catch(error => {
  console.error('启动服务器时发生错误:', error);
  process.exit(1);
}); 