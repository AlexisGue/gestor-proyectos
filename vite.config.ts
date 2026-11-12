import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget =
    env.VITE_DEV_API_TARGET ||
    process.env.VITE_DEV_API_TARGET ||
    'http://127.0.0.1:3000'

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      watch: {
        usePolling: env.CHOKIDAR_USEPOLLING === 'true',
      },
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
        '/uploads': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
