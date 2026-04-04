import { fileURLToPath, URL } from 'node:url' // 🎯 경로 처리를 위해 추가
import { defineConfig /*, loadEnv*/ } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// const env = loadEnv(mode, process.cwd(), '');

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      // 🎯 '@'를 입력하면 자동으로 'src' 폴더를 가리키도록 설정합니다.
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  // server: {
  //   proxy: {
  //     '/api': {
  //       target: env.VITE_PROXY_TARGET,
  //       changeOrigin: true,
  //       secure: false,
  //       // 필요 시 경로 재작성 (현재 구조에서는 그대로 둡니다)
  //       rewrite: (path) => path
  //     }
  //   }
  // },

  build: {
    // 🎯 최신 자바스크립트 문법(async/await 등)을 안전하게 빌드하기 위한 설정입니다.
    target: 'esnext'
  }
})