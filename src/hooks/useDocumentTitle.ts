import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { routes } from '@/router';
import type { AppRouteObject } from '@/utils/type';

// 递归查找路由配置中的标题
function findRouteTitle(routes: AppRouteObject[], pathname: string): string | null {
  for (const route of routes) {
    // 检查当前路由是否匹配
    if (route.path === pathname || (route.path === '' && pathname === '/')) {
      return route.meta?.title || null;
    }
    
    // 检查子路由
    if (route.children) {
      const childTitle = findRouteTitle(route.children, pathname);
      if (childTitle) {
        return childTitle;
      }
    }
    
    // 处理动态路由参数（如 /about/:id）
    if (route.path && route.path.includes(':')) {
      const routePattern = route.path.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp(`^${routePattern}$`);
      if (regex.test(pathname)) {
        return route.meta?.title || null;
      }
    }
    
    // 处理嵌套路由
    if (route.path && pathname.startsWith(route.path) && route.children) {
      const remainingPath = pathname.slice(route.path.length);
      if (remainingPath.startsWith('/')) {
        const childTitle = findRouteTitle(route.children, remainingPath);
        if (childTitle) {
          return childTitle;
        }
      }
    }
  }
  
  return null;
}

export function useDocumentTitle(defaultTitle: string = 'GGBOND') {
  const location = useLocation();
  
  useEffect(() => {
    const routeTitle = findRouteTitle(routes, location.pathname);
    const title = routeTitle ? `${routeTitle} - ${defaultTitle}` : defaultTitle;
    document.title = title;
  }, [location.pathname, defaultTitle]);
}