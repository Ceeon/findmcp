import { createServer, CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/server';
import { LOCAL_SEARCH_TOOL, performLocalSearch } from './tools/localSearch.js';
import { WEB_SEARCH_TOOL, performWebSearch } from './tools/webSearch.js';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 创建MCP服务器
const server = createServer({
  name: "search-server",
  description: "一个提供本地和网络搜索功能的MCP服务器",
  version: "1.0.0"
});

// 注册可用工具
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [LOCAL_SEARCH_TOOL, WEB_SEARCH_TOOL]
  };
});

// 处理工具调用请求
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, args } = request;
  
  console.log(`收到工具调用请求: ${name}`);
  console.log(`参数: ${JSON.stringify(args)}`);
  
  try {
    let result;
    
    // 根据工具名称调用相应的处理函数
    switch (name) {
      case 'local_search':
        result = await performLocalSearch(args);
        break;
      case 'web_search':
        result = await performWebSearch(args);
        break;
      default:
        throw new Error(`未知工具: ${name}`);
    }
    
    // 返回结果
    return {
      content: [
        {
          type: "text",
          text: result
        }
      ],
      isError: false
    };
  } catch (error) {
    console.error(`工具调用错误: ${error.message}`);
    
    // 返回错误
    return {
      content: [
        {
          type: "text",
          text: `执行 ${name} 时发生错误: ${error.message}`
        }
      ],
      isError: true
    };
  }
});

// 启动服务器
server.listen().then(() => {
  console.log('MCP 搜索服务器已启动');
  console.log('可用工具:');
  console.log(` - ${LOCAL_SEARCH_TOOL.name}: ${LOCAL_SEARCH_TOOL.description}`);
  console.log(` - ${WEB_SEARCH_TOOL.name}: ${WEB_SEARCH_TOOL.description}`);
}).catch(error => {
  console.error('启动服务器时发生错误:', error);
  process.exit(1);
}); 