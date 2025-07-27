# 跨域代理配置说明

## 📋 概述

本项目已配置完整的跨域代理功能，解决开发环境下的跨域问题。代理配置基于 Vite 的内置代理功能，支持多种类型的请求转发。

## 🔧 代理配置

### 1. API 请求代理 (`/api/*`)
- **开发环境**: `/api/*` → `http://localhost:8080`
- **生产环境**: 直接请求 `https://api.yourdomain.com`
- **功能**: 自动移除 `/api` 前缀，支持所有 HTTP 方法
- **特性**: 
  - 自动处理 CORS
  - 支持 HTTPS
  - 请求/响应日志记录
  - 超时控制

### 2. 文件上传代理 (`/upload/*`)
- **目标**: 后端文件上传接口
- **用途**: 处理文件上传请求
- **特性**: 支持大文件上传，自动处理 multipart/form-data

### 3. 文件下载代理 (`/download/*`)
- **目标**: 后端文件下载接口
- **用途**: 处理文件下载请求
- **特性**: 支持流式下载，自动处理文件类型

### 4. WebSocket 代理 (`/ws/*`)
- **目标**: WebSocket 服务器
- **用途**: 实时通信（聊天、通知、实时数据等）
- **特性**: 自动升级 HTTP 连接为 WebSocket

### 5. 第三方 API 代理 (`/third-party/*`)
- **目标**: 第三方服务 API
- **用途**: 避免第三方 API 的跨域限制
- **特性**: 支持 HTTPS，可添加认证头

## 📁 相关文件

### 配置文件
- `vite.config.ts` - Vite 代理配置
- `.env.development` - 开发环境变量
- `.env.production` - 生产环境变量

### 工具文件
- `src/utils/request.ts` - HTTP 请求工具
- `src/services/api.ts` - API 服务封装

## 🚀 使用方法

### 1. 基础 API 调用
```typescript
import { userApi } from '@/services/api'

// 开发环境: 请求 /api/users → 代理到 http://localhost:8080/users
// 生产环境: 直接请求 https://api.yourdomain.com/users
const users = await userApi.getUsers()
```

### 2. 文件上传
```typescript
import { fileApi } from '@/services/api'

const file = document.querySelector('input[type="file"]').files[0]
// 开发环境: 请求 /upload/files → 代理到 http://localhost:8080/files
const result = await fileApi.uploadFile(file)
```

### 3. WebSocket 连接
```typescript
import { websocketApi } from '@/services/api'

// 开发环境: ws://localhost:3000/ws/chat/room1 → 代理到 ws://localhost:8080/chat/room1
const ws = websocketApi.createChatConnection('room1')
```

### 4. 第三方 API 调用
```typescript
import { thirdPartyApi } from '@/services/api'

// 开发环境: 请求 /third-party/weather → 代理到 https://api.example.com/weather
const weather = await thirdPartyApi.getWeather('Beijing')
```

## ⚙️ 环境变量配置

### 开发环境 (`.env.development`)
```env
# 后端服务器地址
VITE_API_BASE_URL=http://localhost:8080

# WebSocket 服务器地址
VITE_WS_BASE_URL=ws://localhost:8080

# 第三方 API 地址
VITE_THIRD_PARTY_API=https://api.example.com

# API 超时时间
VITE_API_TIMEOUT=10000
```

### 生产环境 (`.env.production`)
```env
# 生产环境后端地址
VITE_API_BASE_URL=https://api.yourdomain.com

# 生产环境 WebSocket 地址
VITE_WS_BASE_URL=wss://api.yourdomain.com

# 第三方 API 地址
VITE_THIRD_PARTY_API=https://api.thirdparty.com

# 生产环境超时时间
VITE_API_TIMEOUT=30000
```

## 🔍 调试和测试

### 1. 代理日志
开发环境下，代理请求会在控制台显示详细日志：
- 请求发送日志
- 响应接收日志
- 错误日志

### 2. 测试代理功能
在开发环境下，页面提供了代理测试按钮：
- 测试 API 代理
- 测试第三方 API 代理

### 3. 网络面板调试
在浏览器开发者工具的 Network 面板中：
- 查看请求 URL（显示为代理路径）
- 检查响应状态
- 查看请求/响应头

## 🛠️ 自定义配置

### 添加新的代理规则
在 `vite.config.ts` 中添加：
```typescript
proxy: {
  // 现有配置...
  
  // 新的代理规则
  '/custom-api': {
    target: 'http://custom-backend.com',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/custom-api/, '/api'),
  }
}
```

### 添加认证头
```typescript
'/api': {
  target: env.VITE_API_BASE_URL,
  changeOrigin: true,
  configure: (proxy, options) => {
    proxy.on('proxyReq', (proxyReq, req, res) => {
      // 添加认证头
      proxyReq.setHeader('Authorization', 'Bearer your-token')
    })
  }
}
```

## 🚨 注意事项

1. **开发 vs 生产**: 代理只在开发环境生效，生产环境需要配置服务器端 CORS
2. **端口配置**: 确保后端服务器运行在配置的端口上
3. **HTTPS**: 如果后端使用 HTTPS，设置 `secure: true`
4. **WebSocket**: WebSocket 代理需要设置 `ws: true`
5. **路径重写**: 根据后端 API 设计调整 `rewrite` 规则

## 📚 相关文档

- [Vite 代理配置](https://vitejs.dev/config/server-options.html#server-proxy)
- [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)
- [Axios 文档](https://axios-http.com/docs/intro)