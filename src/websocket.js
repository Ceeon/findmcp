#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

// 创建自定义 WebSocket 传输层
class WebSocketServerTransport {
  constructor(ws) {
    this.ws = ws;
    this.messageQueue = [];
    this.isReady = false;
    
    this.ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.error('收到消息:', JSON.stringify(data).substring(0, 100) + '...');
        if (this.onMessage) {
          this.onMessage(data);
        }
      } catch (error) {
        console.error('解析消息时出错:', error);
      }
    });
    
    this.isReady = true;
    this.flushQueue();
  }
  
  setMessageHandler(handler) {
    this.onMessage = handler;
    return Promise.resolve();
  }
  
  sendMessage(message) {
    if (!this.isReady) {
      this.messageQueue.push(message);
      return Promise.resolve();
    }
    
    try {
      console.error('发送消息:', JSON.stringify(message).substring(0, 100) + '...');
      this.ws.send(JSON.stringify(message));
      return Promise.resolve();
    } catch (error) {
      console.error('发送消息时出错:', error);
      return Promise.reject(error);
    }
  }
  
  flushQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.sendMessage(message);
    }
  }
}

// 创建 HTTP 服务器
const httpServer = createServer((req, res) => {
  // 添加健康检查端点
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }
  
  res.writeHead(404);
  res.end();
});

// 获取端口，优先使用环境变量
const port = process.env.PORT || 3000;

// 创建 WebSocket 服务器
const wss = new WebSocketServer({ server: httpServer });

// 创建一个简单的 MCP 服务器
const server = new McpServer({
  name: "FindMCP",
  description: "提供MCP网址目录",
  version: "1.0.8"
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
  // 不要退出进程，让 Smithery 处理重启
  // process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('未处理的Promise拒绝:', reason);
  // 不要退出进程，让 Smithery 处理重启
  // process.exit(1);
});

// 处理 WebSocket 连接
wss.on('connection', (ws, req) => {
  console.error('新的 WebSocket 连接，来自:', req.socket.remoteAddress);
  
  // 创建 WebSocket 传输层
  const transport = new WebSocketServerTransport(ws);
  
  // 连接服务器
  server.connect(transport).then(() => {
    console.error('MCP 服务器已连接到 WebSocket 客户端');
  }).catch(error => {
    console.error('连接 WebSocket 客户端时发生错误:', error);
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket 错误:', error);
  });
  
  ws.on('close', (code, reason) => {
    console.error(`WebSocket 连接已关闭: ${code} ${reason}`);
  });
});

// 启动 HTTP 服务器
httpServer.listen(port, '0.0.0.0', () => {
  console.error(`WebSocket MCP 服务器已启动，监听端口 ${port}`);
  console.error('可用工具:');
  console.error(' - smithery_search: 返回Smithery.ai网址');
}); 