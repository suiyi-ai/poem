import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  // 确保 public 目录中的文件被正确复制到 dist
  publicDir: 'public'
})