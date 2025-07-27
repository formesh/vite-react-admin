// 权限常量定义
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
} as const

export type Role = typeof ROLES[keyof typeof ROLES]

// 权限级别定义（数字越大权限越高）
export const ROLE_LEVELS = {
  [ROLES.GUEST]: 0,
  [ROLES.USER]: 1,
  [ROLES.ADMIN]: 2
} as const

/**
 * 检查用户是否有足够的权限级别
 * @param userRole 用户角色
 * @param requiredRole 需要的角色
 * @returns 是否有权限
 */
export const hasPermissionLevel = (userRole: string, requiredRole: string): boolean => {
  const userLevel = ROLE_LEVELS[userRole as Role] ?? -1
  const requiredLevel = ROLE_LEVELS[requiredRole as Role] ?? 999
  return userLevel >= requiredLevel
}

/**
 * 检查用户是否有任一角色权限
 * @param userRole 用户角色
 * @param allowedRoles 允许的角色列表
 * @returns 是否有权限
 */
export const hasAnyRole = (userRole: string, allowedRoles: string[]): boolean => {
  return allowedRoles.includes(userRole)
}

/**
 * 检查用户是否有所有角色权限
 * @param userRoles 用户角色列表
 * @param requiredRoles 需要的角色列表
 * @returns 是否有权限
 */
export const hasAllRoles = (userRoles: string[], requiredRoles: string[]): boolean => {
  return requiredRoles.every(role => userRoles.includes(role))
}