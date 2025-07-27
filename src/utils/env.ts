/**
 * 环境变量工具类
 * 提供类型安全的环境变量访问方法
 */

// 环境类型
export type AppEnv = 'development' | 'production' | 'test'

// 日志级别类型
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

/**
 * 获取应用环境
 */
export const getAppEnv = (): AppEnv => {
  return (import.meta.env.VITE_APP_ENV as AppEnv) || 'development'
}

/**
 * 判断是否为开发环境
 */
export const isDevelopment = (): boolean => {
  return getAppEnv() === 'development'
}

/**
 * 判断是否为生产环境
 */
export const isProduction = (): boolean => {
  return getAppEnv() === 'production'
}

/**
 * 获取 API 基础地址
 */
export const getApiBaseUrl = (): string => {
  return import.meta.env.VITE_API_BASE_URL || '/api'
}

/**
 * 获取 WebSocket 基础地址
 */
export const getWsBaseUrl = (): string => {
  return import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8080'
}

/**
 * 获取第三方 API 地址
 */
export const getThirdPartyApi = (): string => {
  return import.meta.env.VITE_THIRD_PARTY_API || 'https://api.example.com'
}

/**
 * 获取 API 超时时间
 */
export const getApiTimeout = (): number => {
  return Number(import.meta.env.VITE_API_TIMEOUT) || 10000
}

/**
 * 获取应用名称
 */
export const getAppName = (): string => {
  return import.meta.env.VITE_APP_NAME || 'Vite React Admin'
}

/**
 * 获取应用版本
 */
export const getAppVersion = (): string => {
  return import.meta.env.VITE_APP_VERSION || '1.0.0'
}

/**
 * 获取应用描述
 */
export const getAppDescription = (): string => {
  return import.meta.env.VITE_APP_DESCRIPTION || ''
}

/**
 * 获取日志级别
 */
export const getLogLevel = (): LogLevel => {
  return (import.meta.env.VITE_LOG_LEVEL as LogLevel) || 'info'
}

/**
 * 判断是否启用 Mock 数据
 */
export const isMockEnabled = (): boolean => {
  return import.meta.env.VITE_ENABLE_MOCK === 'true'
}

/**
 * 判断是否启用开发工具
 */
export const isDevtoolsEnabled = (): boolean => {
  return import.meta.env.VITE_ENABLE_DEVTOOLS === 'true'
}

/**
 * 判断是否启用性能监控
 */
export const isPerformanceEnabled = (): boolean => {
  return import.meta.env.VITE_ENABLE_PERFORMANCE === 'true'
}

/**
 * 判断是否启用代理日志
 */
export const isProxyLogEnabled = (): boolean => {
  return import.meta.env.VITE_ENABLE_PROXY_LOG === 'true'
}

/**
 * 获取 CDN 地址
 */
export const getCdnUrl = (): string => {
  return import.meta.env.VITE_CDN_URL || ''
}

/**
 * 获取公共路径
 */
export const getPublicPath = (): string => {
  return import.meta.env.VITE_PUBLIC_PATH || '/'
}

/**
 * 环境变量配置对象
 */
export const envConfig = {
  // 应用信息
  app: {
    name: getAppName(),
    version: getAppVersion(),
    description: getAppDescription(),
    env: getAppEnv(),
  },
  
  // API 配置
  api: {
    baseUrl: getApiBaseUrl(),
    wsBaseUrl: getWsBaseUrl(),
    thirdPartyApi: getThirdPartyApi(),
    timeout: getApiTimeout(),
  },
  
  // 功能开关
  features: {
    mock: isMockEnabled(),
    devtools: isDevtoolsEnabled(),
    performance: isPerformanceEnabled(),
    proxyLog: isProxyLogEnabled(),
  },
  
  // 其他配置
  cdn: getCdnUrl(),
  publicPath: getPublicPath(),
  logLevel: getLogLevel(),
}

// 默认导出
export default envConfig