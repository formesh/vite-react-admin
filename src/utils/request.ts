/**
 * HTTP 请求工具
 * 基于 axios 封装，支持代理配置
 */

import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { getApiBaseUrl, getApiTimeout, isDevelopment } from './env'
import { toast } from '@/hooks/use-toast'

// 请求取消控制器映射
const pendingRequests = new Map<string, AbortController>()

// 生成请求唯一标识
const generateRequestKey = (config: AxiosRequestConfig): string => {
  const { method, url, params, data } = config
  return `${method}:${url}:${JSON.stringify(params)}:${JSON.stringify(data)}`
}

// 添加请求到待处理列表
const addPendingRequest = (config: AxiosRequestConfig): void => {
  const requestKey = generateRequestKey(config)
  
  // 如果已存在相同请求，取消之前的请求
  if (pendingRequests.has(requestKey)) {
    const controller = pendingRequests.get(requestKey)
    controller?.abort('重复请求已取消')
    pendingRequests.delete(requestKey)
  }
  
  // 创建新的取消控制器
  const controller = new AbortController()
  config.signal = controller.signal
  pendingRequests.set(requestKey, controller)
}

// 从待处理列表中移除请求
const removePendingRequest = (config: AxiosRequestConfig): void => {
  const requestKey = generateRequestKey(config)
  if (pendingRequests.has(requestKey)) {
    pendingRequests.delete(requestKey)
  }
}

// 创建 axios 实例
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    // 在开发环境下使用代理路径，生产环境使用完整 URL
    baseURL: isDevelopment() ? '/api' : getApiBaseUrl(),
    timeout: getApiTimeout(),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 添加请求到待处理列表（处理重复请求）
      addPendingRequest(config)
      
      // 添加认证 token
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      
      // 添加时间戳防止缓存
      if (config.method === 'get') {
        config.params = {
          ...config.params,
          _t: Date.now(),
        }
      }

      // 开发环境下打印请求信息
      if (isDevelopment()) {
        console.log('🚀 Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          data: config.data,
          params: config.params,
        })
      }

      return config
    },
    (error) => {
      console.error('❌ Request Error:', error)
      return Promise.reject(error)
    }
  )

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // 从待处理列表中移除请求
      removePendingRequest(response.config)
      
      // 开发环境下打印响应信息
      if (isDevelopment()) {
        console.log('✅ Response:', {
          status: response.status,
          url: response.config.url,
          data: response.data,
        })
      }

      return response
    },
    (error: AxiosError) => {
      // 从待处理列表中移除请求
      if (error.config) {
        removePendingRequest(error.config)
      }
      
      // 处理取消请求
      if (error.name === 'CanceledError') {
        console.log('请求已取消:', error.message)
        return Promise.reject(error)
      }
      
      console.error('❌ Response Error:', error)

      // 处理常见错误
      let errorMessage = '网络错误，请稍后重试'
      
      if (error.response) {
        const { status, data } = error.response
        switch (status) {
          case 401:
            errorMessage = '登录已过期，请重新登录'
            // 未授权，清除 token 并跳转到登录页
            localStorage.removeItem('token')
            window.location.href = '/login'
            break
          case 403:
            errorMessage = '没有权限访问该资源'
            break
          case 404:
            errorMessage = '请求的资源不存在'
            break
          case 500:
            errorMessage = '服务器内部错误'
            break
          default:
            errorMessage = (data as { message?: string })?.message || `请求失败 (${status})`
        }
      } else if (error.request) {
        errorMessage = '网络连接失败，请检查网络'
      } else {
        errorMessage = '请求配置错误'
      }
      
      // 显示错误提示
      toast({
        variant: "destructive",
        title: "请求错误",
        description: errorMessage,
      })

      return Promise.reject(error)
    }
  )

  return instance
}

// 创建默认实例
const http = createAxiosInstance()

// 创建文件上传实例
const uploadHttp = axios.create({
  baseURL: isDevelopment() ? '/upload' : getApiBaseUrl(),
  timeout: 60000, // 文件上传超时时间更长
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})

// 创建第三方 API 实例
const thirdPartyHttp = axios.create({
  baseURL: isDevelopment() ? '/third-party' : import.meta.env.VITE_THIRD_PARTY_API,
  timeout: getApiTimeout(),
})

// 封装常用请求方法
export const request = {
  // GET 请求
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return http.get(url, config).then(res => res.data)
  },

  // POST 请求
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return http.post(url, data, config).then(res => res.data)
  },

  // PUT 请求
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return http.put(url, data, config).then(res => res.data)
  },

  // DELETE 请求
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return http.delete(url, config).then(res => res.data)
  },

  // 文件上传
  upload: <T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> => {
    return uploadHttp.post(url, formData, config).then(res => res.data)
  },

  // 文件下载
  download: (url: string, filename?: string): Promise<void> => {
    const downloadUrl = isDevelopment() ? `/download${url}` : `${getApiBaseUrl()}${url}`
    return axios.get(downloadUrl, { responseType: 'blob' }).then(response => {
      const blob = new Blob([response.data])
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = filename || 'download'
      link.click()
      window.URL.revokeObjectURL(link.href)
    })
  },

  // 第三方 API 请求
  thirdParty: {
    get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
      return thirdPartyHttp.get(url, config).then(res => res.data)
    },
    post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
      return thirdPartyHttp.post(url, data, config).then(res => res.data)
    },
  }
}

// 直接导出常用方法（为了兼容 api.ts 的导入）
export const get = <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return http.get(url, config).then(res => res.data)
}

export const post = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return http.post(url, data, config).then(res => res.data)
}

export const put = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return http.put(url, data, config).then(res => res.data)
}

export const del = <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return http.delete(url, config).then(res => res.data)
}

export const uploadFile = (file: File, onProgress?: (progress: number) => void): Promise<any> => {
  const formData = new FormData()
  formData.append('file', file)
  
  const config: AxiosRequestConfig = {}
  if (onProgress) {
    config.onUploadProgress = (progressEvent) => {
      if (progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(progress)
      }
    }
  }
  
  return uploadHttp.post('/upload', formData, config).then(res => res.data)
}

export const downloadFile = (url: string, filename?: string): Promise<void> => {
  const downloadUrl = isDevelopment() ? `/download${url}` : `${getApiBaseUrl()}${url}`
  return axios.get(downloadUrl, { responseType: 'blob' }).then(response => {
    const blob = new Blob([response.data])
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = filename || 'download'
    link.click()
    window.URL.revokeObjectURL(link.href)
  })
}

export const thirdPartyGet = <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return thirdPartyHttp.get(url, config).then(res => res.data)
}

export const thirdPartyPost = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return thirdPartyHttp.post(url, data, config).then(res => res.data)
}

// WebSocket 连接工具
export const createWebSocket = (path: string): WebSocket => {
  const wsUrl = isDevelopment() 
    ? `ws://${window.location.host}/ws${path}`
    : `${import.meta.env.VITE_WS_BASE_URL}${path}`
  
  const ws = new WebSocket(wsUrl)
  
  ws.onopen = () => {
    console.log('WebSocket 连接已建立')
  }
  
  ws.onerror = (error) => {
    console.error('WebSocket 连接错误:', error)
    toast({
      variant: "destructive",
      title: "WebSocket 错误",
      description: "WebSocket 连接失败",
    })
  }
  
  ws.onclose = () => {
    console.log('WebSocket 连接已关闭')
  }
  
  return ws
}

// 取消所有待处理的请求
export const cancelAllPendingRequests = (): void => {
  pendingRequests.forEach((controller, key) => {
    controller.abort('页面卸载，取消所有请求')
  })
  pendingRequests.clear()
}

// 取消特定请求
export const cancelRequest = (config: AxiosRequestConfig): void => {
  const requestKey = generateRequestKey(config)
  const controller = pendingRequests.get(requestKey)
  if (controller) {
    controller.abort('手动取消请求')
    pendingRequests.delete(requestKey)
  }
}

// 导出实例供高级用法
export { http, uploadHttp, thirdPartyHttp }
export default request