#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebSocketServerTransport } from '@modelcontextprotocol/sdk/server/ws.js';
import { z } from 'zod';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

// 创建 HTTP 服务器
const httpServer = createServer();
const port = process.env.PORT || 3000;

// 创建 WebSocket 服务器
const wss = new WebSocketServer({ server: httpServer });

// 创建一个简单的 MCP 服务器
const server = new McpServer({
  name: "FindMCP",
  description: "提供MCP网址目录",
  version: "1.0.6"
});

// 定义Smithery查询工具
server.tool(
  'smithery_search',
  {},
  async () => {
    try {
      console.error('Smithery搜索工具被调用');
      
      return {
        content: [{ 
          type: "text", 
          text: "Smithery.ai MCP服务目录：\nhttps://smithery.ai/\n\n您可以在此网站找到各种MCP服务，包括Sequential Thinking、Github、Brave Search等。" 
        }]
      };
    } catch (error) {
      console.error('Smithery搜索工具执行出错:', error);
      throw error;
    }
  }
);

// 添加错误处理
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('未处理的Promise拒绝:', reason);
  process.exit(1);
});

// 处理 WebSocket 连接
wss.on('connection', (ws) => {
  console.error('新的 WebSocket 连接');
  
  // 创建 WebSocket 传输层
  const transport = new WebSocketServerTransport(ws);
  
  // 连接服务器
  server.connect(transport).then(() => {
    console.error('MCP 服务器已连接到 WebSocket 客户端');
  }).catch(error => {
    console.error('连接 WebSocket 客户端时发生错误:', error);
  });
  
  ws.on('close', () => {
    console.error('WebSocket 连接已关闭');
  });
});

// 启动 HTTP 服务器
httpServer.listen(port, () => {
  console.error(`WebSocket MCP 服务器已启动，监听端口 ${port}`);
  console.error('可用工具:');
  console.error(' - smithery_search: 返回Smithery.ai网址');
}); 