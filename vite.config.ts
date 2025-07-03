import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    manifest: true,
    rollupOptions: {
      output: {
        entryFileNames: '[name].js', // Настройка имени выходного файла js
        chunkFileNames: '[name].js', // Настройка имени выходного файла для чанков js
        assetFileNames: '[name].[ext]' // Настройка имени выходного файла для ресурсов (css, изображения и т.д.)
      }
    }
  },
  base: '/app/video-mix'
})
