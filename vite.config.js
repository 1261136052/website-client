import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0'
  },
  build: {
    outDir: 'dist' // 指定输出目录
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production') // 指定环境变量
  }
})

