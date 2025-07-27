import { createBrowserRouter } from 'react-router';
import Layout from '@/layout';
import type { AppRouteObject } from '@/utils/type';
import { House, Settings, Info, TestTube } from 'lucide-react';
import LoadingFallback from '@/components/PageLoading';

export const routes: AppRouteObject[] = [
    {
        path: '',
        Component: Layout,
        HydrateFallback: LoadingFallback,
        children: [
            {
                path: '/',
                lazy: async () => ({
                    Component: (await import('@/pages/home')).default
                }),
                meta: { title: "首页", icon: House, requiresAuth: true },
            },
            {
                path: '/test',
                lazy: async () => ({
                    Component: (await import('@/pages/test')).default
                }),
                meta: { title: "测试", icon: TestTube, requiresAuth: true },
            },
            {
                path: '/about',
                meta: { title: "关于", icon: Info, requiresAuth: true },
                children: [
                    {
                        path: '',
                        lazy: async () => ({
                            Component: (await import('@/pages/about/index')).default
                        }),
                        meta: { title: "关于", requiresAuth: true },
                    },
                    {
                        path: ':id',
                        lazy: async () => ({
                            Component: (await import('@/pages/about/detail')).default
                        }),
                        meta: { title: "关于详情", requiresAuth: true },
                    }
                ]
            },
            {
                path: '/admin',
                lazy: async () => ({
                    Component: (await import('@/pages/admin')).default
                }),
                meta: { title: "管理员", icon: Settings, requiresAuth: true, roles: ['admin'] },
            }
        ]
    },
    {
        path: '/login',
        lazy: async () => ({
            Component: (await import('@/pages/login')).default
        }),
        meta: { title: "登录" },
    },
    {
        path: '/unauthorized',
        lazy: async () => ({
            Component: (await import('@/pages/unauthorized')).default
        }),
        meta: { title: "未授权" },
    },
    {

        path: '*',
        lazy: async () => ({
            Component: (await import('@/pages/404')).default
        }),
    }
]

export default createBrowserRouter(routes);