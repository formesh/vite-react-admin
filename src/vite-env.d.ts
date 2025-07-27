/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 应用信息
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_APP_ENV: string
  
  // 服务器配置
  readonly VITE_PORT: string
  readonly VITE_HOST: string
  
  // API 配置
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_WS_BASE_URL: string
  readonly VITE_THIRD_PARTY_API: string
  
  // 功能开关
  readonly VITE_ENABLE_DEVTOOLS: string
  readonly VITE_ENABLE_HMR: string
  readonly VITE_ENABLE_MOCK: string
  readonly VITE_ENABLE_PWA: string
  readonly VITE_ENABLE_PERFORMANCE: string
  readonly VITE_ENABLE_SOURCEMAP: string
  readonly VITE_ENABLE_GZIP: string
  readonly VITE_ENABLE_CODE_SPLITTING: string
  readonly VITE_ENABLE_PROXY_LOG: string
  
  // 日志配置
  readonly VITE_LOG_LEVEL: string
  
  // 构建配置
  readonly VITE_CDN_URL: string
  readonly VITE_PUBLIC_PATH: string
  readonly VITE_BUILD_OUTPUT_DIR: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// 全局变量声明
declare const __APP_ENV__: string