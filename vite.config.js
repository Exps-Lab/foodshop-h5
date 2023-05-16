import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { cssConf, bundleConf } from './viteConf'
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "unplugin-vue-components/resolvers";
import eslint from 'vite-plugin-eslint'

export default (params => {
  // 配置文件中加载环境变量
  const env = loadEnv(params.mode, __dirname)
  // const { mode } = params
  return defineConfig({
    root: './',
    // [note] 生成环境部署Nginx时需要改成nginx对应路由的base
    base: '/',
    // base: mode === 'production' ? path.resolve(__dirname, '/hi-user') + '/' : './',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@api': path.resolve(__dirname, 'src/api'),
        '@common': path.resolve(__dirname, 'src/common'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@components': path.resolve(__dirname, 'src/common/components'),
      }
    },
    css: cssConf,
    build: bundleConf,
    plugins: [
      vue(),
      Components({
        resolvers: [VantResolver()],
      }),
      // 运行时检查eslint规范
      eslint({
        cache: false,
        // fix: true,
        include: ['src/**/*.js', 'src/**/*.vue']
      }),
    ],
    server: {
      host: '0.0.0.0',
      port: env.VITE_PORT,
      open: true,
      proxy: {
        '/h5/user': {
          target: env.VITE_HOST_URL,
          changeOrigin: true
        },
        '/h5/sale': {
          target: env.VITE_HOST_URL,
          changeOrigin: true
        },
        '/h5/order': {
          target: env.VITE_HOST_URL,
          changeOrigin: true
        },
        '/test': {
          target: env.VITE_HOST_URL,
          changeOrigin: true
        },
      }
    }
  })
})
