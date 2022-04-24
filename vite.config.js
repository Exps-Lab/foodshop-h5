import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { cssConf, bundleConf } from './viteConf'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@common': path.resolve(__dirname, 'src/common'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@mixin': path.resolve(__dirname, 'src/mixin'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@pages': path.resolve(__dirname, 'src/pages'),
    }
  },
  css: cssConf,
  build: bundleConf,
  plugins: [vue()],
  server: {
    port: 8000,
    open: true,
    proxy: {
      '/test': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true
      },
    }
  },
})
