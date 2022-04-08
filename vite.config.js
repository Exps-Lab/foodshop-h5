import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@common': path.resolve(__dirname, 'src/common'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@mixin': path.resolve(__dirname, 'src/mixin'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@router': path.resolve(__dirname, 'src/router')
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        // 引入SASS全局变量/样式
        additionalData: `@import '@common/styles/btn_style.less';`,
      },
    },
  },
  plugins: [vue()],
  server: {
    port: 8000,
    proxy: {
      '/test': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true
      },
    }
  }
})
