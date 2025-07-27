# Vite React Admin

一个基于 Vite + React + TypeScript 构建的现代化管理后台系统，采用最新的技术栈和最佳实践。

## ✨ 特性

- 🚀 **现代化技术栈**: Vite + React 19 + TypeScript + React Router v7
- 🎨 **精美UI组件**: 基于 Radix UI + Tailwind CSS + shadcn/ui
- 🔐 **权限管理**: 基于角色的访问控制 (RBAC)
- 📱 **响应式设计**: 支持移动端和桌面端
- 🌙 **主题切换**: 支持明暗主题切换
- 🔄 **状态管理**: 使用 Zustand 进行状态管理
- 🌐 **国际化**: 支持多语言切换
- 📦 **代码分割**: 基于路由的懒加载
- 🔧 **开发体验**: 热重载、ESLint、TypeScript 支持
- 🚀 **构建优化**: 基于 Vite 的快速构建和热更新

## 🛠️ 技术栈

### 核心框架
- **React 19** - 用户界面库
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 下一代前端构建工具
- **React Router v7** - 路由管理

### UI 组件
- **Tailwind CSS** - 原子化 CSS 框架
- **Radix UI** - 无样式、可访问的 UI 组件
- **shadcn/ui** - 基于 Radix UI 的组件库
- **Lucide React** - 图标库

### 状态管理
- **Zustand** - 轻量级状态管理
- **Immer** - 不可变状态更新

### 网络请求
- **Axios** - HTTP 客户端
- **跨域代理** - 开发环境代理配置

### 开发工具
- **ESLint** - 代码质量检查
- **Sass** - CSS 预处理器
- **React Spinners** - 加载动画组件

## 📁 项目结构

```
vite-react-admin/
├── public/                 # 静态资源
├── src/
│   ├── assets/            # 资源文件
│   ├── components/        # 公共组件
│   │   ├── ui/           # UI 组件库
│   │   ├── PageLoading.tsx
│   │   └── ProtectedComponent.tsx
│   ├── hooks/             # 自定义 Hooks
│   │   ├── useAuth.ts
│   │   ├── use-mobile.ts
│   │   └── use-toast.ts
│   ├── layout/            # 布局组件
│   │   ├── components/
│   │   │   └── SliderMenu.tsx
│   │   └── index.tsx
│   ├── lib/               # 工具库
│   │   └── utils.ts
│   ├── pages/             # 页面组件
│   │   ├── home/
│   │   ├── about/
│   │   ├── admin/
│   │   ├── login/
│   │   ├── test/
│   │   ├── unauthorized/
│   │   └── 404/
│   ├── router/            # 路由配置
│   │   └── index.ts
│   ├── services/          # API 服务
│   │   └── api.ts
│   ├── store/             # 状态管理
│   │   └── user.ts
│   ├── utils/             # 工具函数
│   │   ├── env.ts
│   │   ├── permissions.ts
│   │   ├── request.ts
│   │   └── type.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env                   # 环境变量
├── .env.development       # 开发环境变量
├── .env.production        # 生产环境变量
├── vite.config.ts         # Vite 配置
├── tailwind.config.js     # Tailwind 配置
├── tsconfig.json          # TypeScript 配置
└── package.json
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install
```

### 启动开发服务器

```bash
# 使用 npm
npm run dev

# 或使用 yarn
yarn dev
```

开发服务器将在 `http://localhost:9527` 启动。

### 构建生产版本

```bash
# 使用 npm
npm run build

# 或使用 yarn
yarn build
```

### 预览生产版本

```bash
# 使用 npm
npm run preview

# 或使用 yarn
yarn preview
```

## 🔧 配置说明

### 环境变量

项目支持多环境配置，主要环境变量包括：

```bash
# 开发服务器配置
VITE_PORT=9527                          # 开发服务器端口
VITE_HOST=localhost                     # 开发服务器主机

# API 配置
VITE_API_BASE_URL=http://localhost:8080 # 后端 API 地址
VITE_WS_BASE_URL=ws://localhost:8080    # WebSocket 地址
VITE_API_TIMEOUT=10000                  # API 超时时间

# 功能开关
VITE_ENABLE_DEVTOOLS=true               # 开发工具
VITE_ENABLE_HMR=true                    # 热重载
VITE_ENABLE_MOCK=true                   # Mock 数据
VITE_ENABLE_SOURCEMAP=true              # Source Map
VITE_ENABLE_PROXY_LOG=true              # 代理日志

# 其他配置
VITE_APP_ENV=development                # 应用环境
VITE_LOG_LEVEL=debug                    # 日志级别
```

### 代理配置

开发环境已配置完整的跨域代理：

- `/api/*` → 后端 API 服务
- `/upload/*` → 文件上传服务
- `/download/*` → 文件下载服务
- `/ws/*` → WebSocket 连接
- `/third-party/*` → 第三方 API

详细配置请查看 [PROXY_CONFIG.md](./PROXY_CONFIG.md)

## 🔐 权限管理

项目实现了基于角色的访问控制 (RBAC)：

### 路由权限

```typescript
// 路由配置示例
{
  path: '/admin',
  meta: { 
    title: "管理员", 
    requiresAuth: true,    // 需要登录
    roles: ['admin']       // 需要管理员角色
  }
}
```

### 组件权限

```typescript
// 使用 ProtectedComponent 包装需要权限的组件
<ProtectedComponent requiredRoles={['admin']}>
  <AdminPanel />
</ProtectedComponent>
```

### 权限 Hook

```typescript
// 使用 useAuth Hook 获取权限信息
const { user, hasRole, hasPermission } = useAuth();
```

## 🎨 UI 组件

项目基于 shadcn/ui 构建，包含丰富的 UI 组件：

- **导航组件**: Sidebar, Menu, Breadcrumb
- **表单组件**: Input, Button, Select, Checkbox
- **反馈组件**: Toast, Dialog, Alert
- **布局组件**: Card, Separator, Sheet
- **数据展示**: Table, Skeleton, Tooltip

所有组件都支持主题定制和响应式设计。

## 📱 响应式设计

项目采用移动优先的响应式设计：

- **断点配置**: 基于 Tailwind CSS 断点系统
- **移动端适配**: 支持触摸操作和移动端导航
- **自适应布局**: 侧边栏在移动端自动折叠

## 🔄 状态管理

使用 Zustand 进行状态管理：

```typescript
// 用户状态管理示例
const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null })
}));
```

## 🌐 网络请求

基于 Axios 封装的 HTTP 客户端：

- **请求拦截**: 自动添加认证头
- **响应拦截**: 统一错误处理
- **重复请求取消**: 防止重复请求
- **Toast 提示**: 自动显示错误信息

详细说明请查看 [REQUEST_ENHANCEMENT.md](./REQUEST_ENHANCEMENT.md)

## 📝 开发规范

### 代码规范

- 使用 ESLint 进行代码质量检查
- 遵循 TypeScript 严格模式
- 使用 Prettier 进行代码格式化

### 提交规范

```bash
feat: 新功能
fix: 修复问题
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动
```

### 组件开发

- 使用函数式组件和 Hooks
- 遵循单一职责原则
- 添加 TypeScript 类型定义
- 编写组件文档和示例

## 🚀 部署

### Vercel 部署

项目已配置 Vercel 部署：

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署到 Vercel
vercel
```

### 其他部署方式

```bash
# 构建项目
npm run build

# 部署 dist 目录到你的服务器
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Zustand](https://github.com/pmndrs/zustand)

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 Issue
- 发送邮件
- 加入讨论群

---

⭐ 如果这个项目对你有帮助，请给它一个星标！
