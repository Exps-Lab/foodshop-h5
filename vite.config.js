import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import autoprefixer from 'autoprefixer'
import postCssPxToRem from "postcss-pxtorem"

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
    postcss: {
      plugins: [
        autoprefixer({
          overrideBrowserslist: [
            'Android 4.1',
            'iOS 7.1',
            'Chrome > 31',
            'ff > 31',
            'ie >= 8',
            "last 10 versions",
          ],
          grid: true,
        }),
        postCssPxToRem({
          rootValue: 100, // 1rem的大小
          propList: ['*'],
          unitPrecision: 3,
          minPixelValue: 12,
        })
      ]
    }

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
