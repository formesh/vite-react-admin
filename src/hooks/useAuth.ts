import { routes } from '@/router'
import useUserStore from '@/store/user'
import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate, matchPath } from 'react-router'
import type { AppRouteObject } from '@/utils/type'

export const useAuth = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { user } = useUserStore()

    // 扁平化路由配置，便于匹配
    const flattenRoutes = useMemo(() => {
        const flatten = (routes: AppRouteObject[], parentPath = ''): AppRouteObject[] => {
            const result: AppRouteObject[] = []
            
            routes.forEach(route => {
                const fullPath = parentPath + (route.path || '')
                const routeWithFullPath = { ...route, path: fullPath }
                result.push(routeWithFullPath)
                
                if (route.children) {
                    result.push(...flatten(route.children, fullPath))
                }
            })
            
            return result
        }
        
        return flatten(routes)
    }, [])

    // 查找匹配的路由
    const findMatchingRoute = useMemo(() => {
        return (pathname: string): AppRouteObject | null => {
            // 首先尝试精确匹配
            const exactMatch = flattenRoutes.find(route => route.path === pathname)
            if (exactMatch) return exactMatch

            // 然后尝试模式匹配（支持动态路由）
            for (const route of flattenRoutes) {
                if (route.path && route.path !== pathname) {
                    const match = matchPath(
                        { path: route.path, end: true },
                        pathname
                    )
                    if (match) return route
                }
            }

            return null
        }
    }, [flattenRoutes])

    useEffect(() => {
        const currentRoute = findMatchingRoute(location.pathname)
        
        // 跳过登录页、未授权页和404页的权限检查
        if (['/login', '/unauthorized', '*'].includes(location.pathname)) {
            return
        }

        // 检查是否需要认证
        if (currentRoute?.meta?.requiresAuth) {
            // 检查是否已登录
            if (!user?.token) {
                navigate('/login', { replace: true })
                return
            }

            // 检查角色权限
            if (currentRoute.meta.roles && currentRoute.meta.roles.length > 0) {
                const hasPermission = currentRoute.meta.roles.includes(user.role)
                if (!hasPermission) {
                    navigate('/unauthorized', { replace: true })
                    return
                }
            }
        }
    }, [location.pathname, user?.token, user?.role, navigate, findMatchingRoute])

    // 返回权限检查函数供其他组件使用
    return {
        isAuthenticated: !!user?.token,
        hasRole: (role: string) => user?.role === role,
        hasAnyRole: (roles: string[]) => roles.includes(user?.role || ''),
        currentUser: user
    }
}