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
        if (this.onMessage) {
          this.onMessage(data);
        }
      } catch (error) {
        console.error('解析消息时出错:', error.message);
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
      if (this.ws.readyState === 1) { // WebSocket.OPEN
        this.ws.send(JSON.stringify(message));
      } else {
        console.error('WebSocket 未准备好，状态:', this.ws.readyState);
      }
      return Promise.resolve();
    } catch (error) {
      console.error('发送消息时出错:', error.message);
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
  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'FindMCP WebSocket Server' }));
    return;
  }
  
  res.writeHead(404);
  res.end('Not Found');
});

// 获取端口，优先使用环境变量
const port = process.env.PORT || 3000;

// 创建 WebSocket 服务器
const wss = new WebSocketServer({ 
  server: httpServer,
  // 增加心跳检测
  clientTracking: true,
  perMessageDeflate: false
});

// 创建一个简单的 MCP 服务器
const server = new McpServer({
  name: "FindMCP",
  description: "提供MCP网址目录",
  version: "1.0.9"
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
      console.error('Smithery搜索工具执行出错:', error.message);
      return {
        content: [{ 
          type: "text", 
          text: "执行工具时出错，请稍后再试。" 
        }]
      };
    }
  }
);

// 添加错误处理
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('未处理的Promise拒绝:', reason);
});

// 处理 WebSocket 连接
wss.on('connection', (ws, req) => {
  console.error('新的 WebSocket 连接');
  
  // 创建 WebSocket 传输层
  const transport = new WebSocketServerTransport(ws);
  
  // 连接服务器
  server.connect(transport).then(() => {
    console.error('MCP 服务器已连接到 WebSocket 客户端');
  }).catch(error => {
    console.error('连接 WebSocket 客户端时发生错误:', error.message);
  });
  
  // 添加心跳检测
  const pingInterval = setInterval(() => {
    if (ws.readyState === 1) { // WebSocket.OPEN
      try {
        ws.ping();
      } catch (error) {
        console.error('Ping 失败:', error.message);
      }
    }
  }, 30000);
  
  ws.on('error', (error) => {
    console.error('WebSocket 错误:', error.message);
  });
  
  ws.on('close', () => {
    console.error('WebSocket 连接已关闭');
    clearInterval(pingInterval);
  });
});

// 启动 HTTP 服务器
httpServer.listen(port, '0.0.0.0', () => {
  console.error(`WebSocket MCP 服务器已启动，监听端口 ${port}`);
  console.error('可用工具:');
  console.error(' - smithery_search: 返回Smithery.ai网址');
}); 