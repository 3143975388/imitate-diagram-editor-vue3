import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 根据不同环境加载不同的配置
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const url = loadEnv(mode, process.cwd()).VITE_APP_URL;
  
  return {
    base: env.VITE_APP_ENV === "production" ? "/" : "/",
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src/'),
      },
    },
    // 开发服务器配置
    server: {
      host: '0.0.0.0', // 允许外部访问
      port: 5173, // 开发服务器端口
      // 配置代理
      proxy: {
        // 将 /dev-api 开头的请求代理到实际的后端服务器
        "/dev-api": {
          // target: 'http://10.11.41.61/prod-api',
          target: "http://" + url,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/dev-api/, ""),
        },
        "/image-proxy": {
          target: "http://10.11.41.68:9000", // 图片服务器地址
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/image-proxy/, ''),
          // 重要：添加CORS头
          configure: (proxy) => {
            proxy.on('proxyRes', (proxyRes) => {
              proxyRes.headers['Access-Control-Allow-Origin'] = '*';
              proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS';
            });
          }
        }
      },
    },
  };
});
