# Request.ts 增强功能文档

## 概述

本文档描述了对 `request.ts` 文件的增强功能，主要包括重复请求处理和 Shadcn UI Toast 错误提示集成。

## 新增功能

### 1. 重复请求处理

#### 功能描述
- 自动检测并取消重复的 API 请求
- 当相同的请求正在进行时，新的相同请求会取消之前的请求
- 基于请求的 method、url、params 和 data 生成唯一标识

#### 实现原理
```typescript
// 请求取消控制器映射
const pendingRequests = new Map<string, AbortController>()

// 生成请求唯一标识
const generateRequestKey = (config: AxiosRequestConfig): string => {
  const { method, url, params, data } = config
  return `${method}:${url}:${JSON.stringify(params)}:${JSON.stringify(data)}`
}
```

#### 使用示例
```typescript
// 快速发送多个相同请求，前面的请求会被自动取消
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    get('/test/duplicate', { timestamp: Date.now() })
      .then(() => console.log(`请求 ${i + 1} 成功`))
      .catch((error) => console.log(`请求 ${i + 1} 失败:`, error.message))
  }, i * 100)
}
```

### 2. Shadcn UI Toast 错误提示

#### 功能描述
- 集成 Shadcn UI 的 Toast 组件显示错误信息
- 自动处理不同类型的错误（网络错误、业务错误、HTTP 状态码错误）
- 提供友好的用户错误提示

#### 错误处理类型
- **401 未授权**: 自动清除 token，提示重新登录
- **403 权限不足**: 提示没有权限访问
- **404 资源不存在**: 提示请求的资源不存在
- **500 服务器错误**: 提示服务器内部错误
- **网络错误**: 提示检查网络连接
- **业务错误**: 显示服务器返回的错误信息

#### Toast 样式
```typescript
toast({
  variant: "destructive",
  title: "请求错误",
  description: errorMessage,
})
```

### 3. 新增工具函数

#### 取消所有待处理请求
```typescript
export const cancelAllPendingRequests = (): void => {
  pendingRequests.forEach((controller, key) => {
    controller.abort('页面卸载，取消所有请求')
  })
  pendingRequests.clear()
}
```

#### 取消特定请求
```typescript
export const cancelRequest = (config: AxiosRequestConfig): void => {
  const requestKey = generateRequestKey(config)
  const controller = pendingRequests.get(requestKey)
  if (controller) {
    controller.abort('手动取消请求')
    pendingRequests.delete(requestKey)
  }
}
```

## 安装的依赖

为了支持 Shadcn UI Toast 组件，安装了以下依赖：

```bash
npm install @radix-ui/react-toast class-variance-authority clsx tailwind-merge lucide-react
```

## 新增文件

### 1. UI 组件
- `src/lib/utils.ts` - Shadcn UI 工具函数
- `src/components/ui/toast.tsx` - Toast 组件
- `src/components/ui/toaster.tsx` - Toaster 容器组件

### 2. Hooks
- `src/hooks/use-toast.ts` - Toast 状态管理 Hook

## 配置更新

### 1. Vite 配置
- 已配置 `@` 路径别名指向 `src` 目录

### 2. 环境变量
- 新增 `VITE_WS_BASE_URL` - WebSocket 基础 URL
- 新增 `VITE_THIRD_PARTY_API` - 第三方 API URL
- 新增 `VITE_ENABLE_PROXY_LOG` - 代理日志开关

## 使用方法

### 1. 在组件中使用
```typescript
import { Toaster } from '@/components/ui/toaster'
import { toast } from '@/hooks/use-toast'

function App() {
  return (
    <div>
      {/* 你的应用内容 */}
      
      {/* 在应用根部添加 Toaster */}
      <Toaster />
    </div>
  )
}
```

### 2. 手动显示 Toast
```typescript
import { toast } from '@/hooks/use-toast'

// 成功提示
toast({
  title: "操作成功",
  description: "数据已保存",
})

// 错误提示
toast({
  variant: "destructive",
  title: "操作失败",
  description: "请稍后重试",
})
```

### 3. 测试重复请求
```typescript
import { get } from '@/utils/request'

// 测试重复请求处理
const handleTestDuplicateRequests = async () => {
  // 快速发送多个相同请求
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      get('/test/duplicate', { timestamp: Date.now() })
    }, i * 100)
  }
}
```

## 特性优势

1. **用户体验优化**: 通过 Toast 提供即时的错误反馈
2. **性能优化**: 自动取消重复请求，减少服务器压力
3. **开发体验**: 提供清晰的错误信息和调试信息
4. **类型安全**: 完整的 TypeScript 支持
5. **可扩展性**: 易于添加新的错误处理逻辑

## 注意事项

1. **取消请求**: 被取消的请求会抛出 `CanceledError`，需要在业务代码中适当处理
2. **Toast 限制**: 默认只显示一个 Toast，新的 Toast 会替换旧的
3. **错误处理**: 所有网络错误都会自动显示 Toast，无需手动处理
4. **内存管理**: 组件卸载时建议调用 `cancelAllPendingRequests()` 清理资源

## 开发服务器

当前开发服务器运行在: `http://localhost:3000/`

可以通过以下按钮测试新功能：
- **测试重复请求**: 验证重复请求取消功能
- **测试错误处理**: 验证 Toast 错误提示功能
- **测试 API 代理**: 验证代理配置
- **测试第三方 API**: 验证第三方 API 代理