#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { spawn } from 'child_process';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 解析入口文件的路径
const entryPath = resolve(__dirname, '../src/index.js');

// 启动 MCP 服务
console.error('正在启动 FindMCP 服务...');
const child = spawn('node', [entryPath], {
  stdio: 'inherit'
});

// 处理进程退出
process.on('SIGINT', () => {
  child.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  child.kill('SIGTERM');
  process.exit(0);
});

child.on('exit', (code) => {
  process.exit(code);
}); 