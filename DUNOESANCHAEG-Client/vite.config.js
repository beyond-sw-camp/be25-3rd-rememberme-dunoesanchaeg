import { fileURLToPath, URL } from 'node:url'
import { defineConfig , loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// mode를 인자로 받음
export default defineConfig(({ mode }) => {
  // 이제 이 안에서는 mode가 무엇인지 Vite가 알려줍니다.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      vue(),
      tailwindcss()
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_PROXY_TARGET,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path
        }
      }
    },
    build: {
      target: 'esnext'
    }
  }
})