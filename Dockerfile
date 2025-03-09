FROM node:18-alpine

WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 暴露 WebSocket 端口
EXPOSE 3000

# 启动 WebSocket MCP 服务器
CMD ["node", "src/websocket.js"]
