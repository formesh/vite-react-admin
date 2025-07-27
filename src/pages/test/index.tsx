import { useState } from 'react'
import { envConfig, isDevelopment, isProduction } from '@/utils/env'
import { testApiProxy, testThirdPartyProxy } from '@/services/api'
import { get, post } from '@/utils/request'
import { Toaster } from '@/components/ui/toaster'
import { toast } from '@/hooks/use-toast'
import useUserStore from '@/store/user'
import ProtectedComponent from '@/components/ProtectedComponent'
import { useAuth } from '@/hooks/useAuth'

function Test() {
  const [apiResult, setApiResult] = useState<string>('')
  const [thirdPartyResult, setThirdPartyResult] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const userStore = useUserStore()
  const { isAuthenticated, hasRole, hasAnyRole } = useAuth()
  
  const changeUserInfo = () => {
    userStore.updateUser({
      id: '1',
      name: 'test',
      email: 'test@example.com',
      avatar: 'https://example.com/avatar.jpg',
      role: 'admin',
      token: 'test-token',
    })
  }
  // 测试 API 代理
  const handleTestApiProxy = async () => {
    setLoading(true)
    try {
      const result = await testApiProxy()
      setApiResult(JSON.stringify(result, null, 2))
      toast({
        title: "API 测试成功",
        description: "API 代理配置正常工作",
      })
    } catch (error) {
      setApiResult(`错误: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  // 测试第三方 API 代理
  const handleTestThirdPartyProxy = async () => {
    setLoading(true)
    try {
      const result = await testThirdPartyProxy()
      setThirdPartyResult(JSON.stringify(result, null, 2))
      toast({
        title: "第三方 API 测试成功",
        description: "第三方 API 代理配置正常工作",
      })
    } catch (error) {
      setThirdPartyResult(`错误: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  // 测试重复请求处理
  const handleTestDuplicateRequests = async () => {
    toast({
      title: "测试重复请求",
      description: "正在发送多个相同请求，前面的请求将被取消",
    })

    // 快速发送多个相同请求
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        get('/test/duplicate', { params: { timestamp: Date.now() } })
          .then(() => {
            console.log(`请求 ${i + 1} 成功`)
          })
          .catch((error) => {
            console.log(`请求 ${i + 1} 失败:`, error.message)
          })
      }, i * 100)
    }
  }

  // 测试错误处理
  const handleTestErrorHandling = async () => {
    try {
      await post('/test/error', { type: 'server_error' })
    } catch (error) {
      // 错误已经通过 toast 显示，这里不需要额外处理
      console.log('错误处理测试完成')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {envConfig.app.name}
          </h1>
          
          {/* 环境信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-900 mb-3">应用信息</h2>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">名称:</span> {envConfig.app.name}</p>
                <p><span className="font-medium">版本:</span> {envConfig.app.version}</p>
                <p><span className="font-medium">描述:</span> {envConfig.app.description}</p>
                <p><span className="font-medium">环境:</span> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    isDevelopment() ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'
                  }`}>
                    {isDevelopment() ? '开发环境' : isProduction() ? '生产环境' : '未知环境'}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-green-900 mb-3">API 配置</h2>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">API 地址:</span> {envConfig.api.baseUrl}</p>
                <p><span className="font-medium">WebSocket:</span> {envConfig.api.wsBaseUrl}</p>
                <p><span className="font-medium">第三方 API:</span> {envConfig.api.thirdPartyApi}</p>
                <p><span className="font-medium">超时时间:</span> {envConfig.api.timeout}ms</p>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-purple-900 mb-3">功能开关</h2>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Mock 数据:</span> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    envConfig.features.mock ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}>
                    {envConfig.features.mock ? '启用' : '禁用'}
                  </span>
                </p>
                <p><span className="font-medium">开发者工具:</span> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    envConfig.features.devtools ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}>
                    {envConfig.features.devtools ? '启用' : '禁用'}
                  </span>
                </p>
                <p><span className="font-medium">性能监控:</span> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    envConfig.features.performance ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}>
                    {envConfig.features.performance ? '启用' : '禁用'}
                  </span>
                </p>
                <p><span className="font-medium">代理日志:</span> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    envConfig.features.proxyLog ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}>
                    {envConfig.features.proxyLog ? '启用' : '禁用'}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-orange-900 mb-3">系统信息</h2>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">日志级别:</span> {envConfig.logLevel}</p>
                <p><span className="font-medium">构建时间:</span> {new Date().toLocaleString()}</p>
                <p><span className="font-medium">用户代理:</span> {navigator.userAgent.split(' ')[0]}</p>
              </div>
            </div>
          </div>

          {/* 测试按钮 */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">功能测试</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={handleTestApiProxy}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {loading ? '测试中...' : '测试 API 代理'}
              </button>

              <button
                onClick={handleTestThirdPartyProxy}
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {loading ? '测试中...' : '测试第三方 API'}
              </button>

              <button
                onClick={handleTestDuplicateRequests}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                测试重复请求
              </button>

              <button
                onClick={handleTestErrorHandling}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                测试错误处理
              </button>
              
              <button
                onClick={() => changeUserInfo()}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                修改user信息
              </button>
              
              <button
                onClick={() => userStore.clearUser()}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                清空
              </button>

              {/* 权限控制示例 */}
              <ProtectedComponent requireAuth={true}>
                <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors">
                  需要登录的按钮
                </button>
              </ProtectedComponent>

              <ProtectedComponent roles={['admin']}>
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
                  仅管理员可见
                </button>
              </ProtectedComponent>
            </div>

            {/* 权限状态显示 */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">权限状态</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">登录状态:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    isAuthenticated ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}>
                    {isAuthenticated ? '已登录' : '未登录'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">是否为管理员:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    hasRole('admin') ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}>
                    {hasRole('admin') ? '是' : '否'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">有用户权限:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    hasAnyRole(['admin', 'user']) ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}>
                    {hasAnyRole(['admin', 'user']) ? '是' : '否'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              name: {userStore.user?.name}
              email: {userStore.user?.email}
              role: {userStore.user?.role}
              token: {userStore.user?.token}
              id: {userStore.user?.id}
            </div>
            {/* 测试结果 */}
            {apiResult && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">API 测试结果:</h3>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-40">
                  {apiResult}
                </pre>
              </div>
            )}

            {thirdPartyResult && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">第三方 API 测试结果:</h3>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-40">
                  {thirdPartyResult}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Toast 组件 */}
      <Toaster />
    </div>
  )
}

export default Test
