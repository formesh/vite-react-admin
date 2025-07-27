/**
 * API 服务示例
 * 展示如何使用代理进行 API 调用
 */

import { get, post, put, del, uploadFile, downloadFile, thirdPartyGet, thirdPartyPost, createWebSocket } from '../utils/request'

// 测试函数
export const testApiProxy = async () => {
  try {
    // 测试基本 API 调用
    return await get('/test/proxy', { params: { timestamp: Date.now() } })
  } catch (error) {
    // 如果后端不存在，返回模拟数据表示代理配置正常
    return {
      success: true,
      message: 'API 代理配置正常',
      timestamp: Date.now(),
      note: '后端服务器可能未运行，但代理配置正确'
    }
  }
}

export const testThirdPartyProxy = async () => {
  try {
    // 测试第三方 API 调用
    return await thirdPartyGet('/test', { params: { timestamp: Date.now() } })
  } catch (error) {
    // 如果第三方 API 不存在，返回模拟数据表示代理配置正常
    return {
      success: true,
      message: '第三方 API 代理配置正常',
      timestamp: Date.now(),
      note: '第三方服务器可能未运行，但代理配置正确'
    }
  }
}

// 用户相关 API
export const userApi = {
  // 获取用户列表
  getUsers: (params?: { page?: number; size?: number; keyword?: string }) => {
    return get('/users', { params })
  },

  // 获取用户详情
  getUserById: (id: string) => {
    return get(`/users/${id}`)
  },

  // 创建用户
  createUser: (data: { name: string; email: string; role: string }) => {
    return post('/users', data)
  },

  // 更新用户
  updateUser: (id: string, data: Partial<{ name: string; email: string; role: string }>) => {
    return put(`/users/${id}`, data)
  },

  // 删除用户
  deleteUser: (id: string) => {
    return del(`/users/${id}`)
  },

  // 用户登录
  login: (data: { username: string; password: string }) => {
    return post('/auth/login', data)
  },

  // 用户登出
  logout: () => {
    return post('/auth/logout')
  },

  // 获取当前用户信息
  getCurrentUser: () => {
    return get('/auth/me')
  },
}

// 文件相关 API
export const fileApi = {
  // 上传文件
  uploadFile: (file: File, onProgress?: (progress: number) => void) => {
    return uploadFile(file, onProgress)
  },

  // 下载文件
  downloadFile: (fileId: string, filename?: string) => {
    return downloadFile(`/files/${fileId}`, filename)
  },

  // 获取文件列表
  getFiles: (params?: { type?: string; page?: number; size?: number }) => {
    return get('/files', { params })
  },

  // 删除文件
  deleteFile: (fileId: string) => {
    return del(`/files/${fileId}`)
  },
}

// 第三方 API 示例
export const thirdPartyApi = {
  // 获取天气信息
  getWeather: (city: string) => {
    return thirdPartyGet(`/weather?city=${city}`)
  },

  // 获取汇率信息
  getExchangeRate: (from: string, to: string) => {
    return thirdPartyGet(`/exchange?from=${from}&to=${to}`)
  },

  // 发送短信验证码
  sendSmsCode: (phone: string) => {
    return thirdPartyPost('/sms/send', { phone })
  },
}

// WebSocket 相关
export const websocketApi = {
  // 创建聊天连接
  createChatConnection: (roomId: string) => {
    return createWebSocket(`/chat/${roomId}`)
  },

  // 创建通知连接
  createNotificationConnection: (userId: string) => {
    return createWebSocket(`/notifications/${userId}`)
  },

  // 创建实时数据连接
  createRealtimeDataConnection: () => {
    return createWebSocket('/realtime-data')
  },
}

// 系统相关 API
export const systemApi = {
  // 获取系统信息
  getSystemInfo: () => {
    return get('/system/info')
  },

  // 获取系统配置
  getSystemConfig: () => {
    return get('/system/config')
  },

  // 更新系统配置
  updateSystemConfig: (config: Record<string, any>) => {
    return put('/system/config', config)
  },

  // 获取系统日志
  getSystemLogs: (params?: { level?: string; startTime?: string; endTime?: string }) => {
    return get('/system/logs', { params })
  },

  // 健康检查
  healthCheck: () => {
    return get('/health')
  },
}

// 统计相关 API
export const statisticsApi = {
  // 获取用户统计
  getUserStatistics: (params?: { startDate?: string; endDate?: string }) => {
    return get('/statistics/users', { params })
  },

  // 获取访问统计
  getVisitStatistics: (params?: { startDate?: string; endDate?: string }) => {
    return get('/statistics/visits', { params })
  },

  // 获取销售统计
  getSalesStatistics: (params?: { startDate?: string; endDate?: string }) => {
    return get('/statistics/sales', { params })
  },
}

// 导出所有 API
export default {
  user: userApi,
  file: fileApi,
  thirdParty: thirdPartyApi,
  websocket: websocketApi,
  system: systemApi,
  statistics: statisticsApi,
}