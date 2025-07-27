import { create } from "zustand";
import { immer } from 'zustand/middleware/immer'
import { createJSONStorage, persist } from 'zustand/middleware'

// 定义用户角色类型
export type UserRole = 'admin' | 'user' | 'guest' | string

// 定义用户信息接口
export interface UserInfo {
    id: string,
    name: string,
    email: string,
    avatar: string,
    role: UserRole,
    token: string,
}

interface UserStore {
    user: UserInfo,
    updateUser: (user: Partial<UserInfo>) => void
    getUser: () => UserInfo
    clearUser: () => void
    isAuthenticated: () => boolean
    hasRole: (role: UserRole) => boolean
}

const defaultUser: UserInfo = {
    id: '',
    name: '',
    email: '',
    avatar: '',
    role: 'guest',
    token: '',
}

const useUserStore = create<UserStore>(
    (immer as any)(
        persist(
            (set: any, get: any) => ({
                user: defaultUser,
                updateUser: (userData: Partial<UserInfo>) => set((state: UserStore) => {
                    state.user = { ...state.user, ...userData };
                }),
                getUser: () => get().user,
                clearUser: () => set({ user: defaultUser }),
                isAuthenticated: () => !!get().user.token,
                hasRole: (role: UserRole) => get().user.role === role,
            }),
            {
                name: 'GGBONDUSER',
                storage: createJSONStorage(() => localStorage)
            }
        )
    )
)

export default useUserStore as any as () => UserStore;