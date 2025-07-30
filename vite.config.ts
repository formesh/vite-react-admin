import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import net from 'net'

// 检查端口是否被占用
function isPortInUse(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer()
    server.listen(port, () => {
      server.once('close', () => {
        resolve(false)
      })
      server.close()
    })
    server.on('error', () => {
      resolve(true)
    })
  })
}

// 获取可用端口
async function getAvailablePort(startPort: number): Promise<number> {
  let port = startPort
  while (await isPortInUse(port)) {
    port++
  }
  return port
}

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  // 获取可用端口
  const availablePort = await getAvailablePort(Number(env.VITE_PORT) || 3000)
  
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: availablePort,
      host: env.VITE_HOST || 'localhost',
      open: true,
      hmr: env.VITE_ENABLE_HMR === 'true',
      // 跨域代理配置
      proxy: {
        // 代理所有 /api 请求
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api/, ''),
          // 配置 HTTPS 代理
          secure: false,
          // 配置 WebSocket 代理
          ws: true,
          // 超时设置
          timeout: Number(env.VITE_API_TIMEOUT) || 10000,
          // 自定义请求头
          // configure: (proxy, options) => {
          //   proxy.on('error', (err, req, res) => {
          //     console.log('proxy error', err);
          //   });
          //   proxy.on('proxyReq', (proxyReq, req, res) => {
          //     console.log('Sending Request to the Target:', req.method, req.url);
          //   });
          //   proxy.on('proxyRes', (proxyRes, req, res) => {
          //     console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          //   });
          // }
        },
        // 代理上传文件请求
        '/upload': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
        },
        // 代理下载文件请求
        '/download': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
        },
        // 代理 WebSocket 连接
        '/ws': {
          target: env.VITE_WS_BASE_URL || 'ws://localhost:8080',
          ws: true,
          changeOrigin: true,
        },
        // 代理第三方 API（如果需要）
        '/third-party': {
          target: env.VITE_THIRD_PARTY_API || 'https://api.example.com',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/third-party/, ''),
          secure: true,
          // 添加认证头
          // configure: (proxy, options) => {
          //   proxy.on('proxyReq', (proxyReq, req, res) => {
          //     // 可以在这里添加认证头
          //     // proxyReq.setHeader('Authorization', 'Bearer your-token');
          //   });
          // }
        }
      }
    },
    build: {
      outDir: env.VITE_BUILD_OUTPUT_DIR || 'dist',
      sourcemap: env.VITE_ENABLE_SOURCEMAP === 'true',
      minify: mode === 'production',
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
    },
    base: env.VITE_PUBLIC_PATH || '/',
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV),
    },
  }
})
