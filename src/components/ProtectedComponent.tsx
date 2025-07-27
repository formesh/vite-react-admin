import React from 'react'
import { useAuth } from '@/hooks/useAuth'

interface ProtectedComponentProps {
  children: React.ReactNode
  requireAuth?: boolean
  roles?: string[]
  fallback?: React.ReactNode
  showFallback?: boolean
}

/**
 * 权限保护组件
 * 用于在组件级别进行权限控制
 */
export const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  children,
  requireAuth = false,
  roles = [],
  fallback = null,
  showFallback = true
}) => {
  const { isAuthenticated, hasAnyRole } = useAuth()

  // 检查认证状态
  if (requireAuth && !isAuthenticated) {
    return showFallback ? (fallback || <div className="text-gray-500">需要登录</div>) : null
  }

  // 检查角色权限
  if (roles.length > 0 && !hasAnyRole(roles)) {
    return showFallback ? (fallback || <div className="text-gray-500">权限不足</div>) : null
  }

  return <>{children}</>
}

export default ProtectedComponent