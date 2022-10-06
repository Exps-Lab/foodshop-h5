import path from 'path'
import { defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import { cssConf, bundleConf } from './viteConf'
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "unplugin-vue-components/resolvers";

export default (params => {
  // 配置文件中加载环境变量
  const env = loadEnv(params.mode, __dirname)
  return defineConfig({
    root: './',
    base: '/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@api': path.resolve(__dirname, 'src/api'),
        '@common': path.resolve(__dirname, 'src/common'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@pages': path.resolve(__dirname, 'src/pages'),
      }
    },
    css: cssConf,
    build: bundleConf,
    plugins: [
      vue(),
      Components({
        resolvers: [VantResolver()],
      }),
    ],
    server: {
      port: env.VITE_DEV_PORT,
      open: true,
      proxy: {
        '/h5/user': {
          target: 'http://127.0.0.1:3000',
          changeOrigin: true
        },
        '/h5/common': {
          target: 'http://127.0.0.1:3000',
          changeOrigin: true
        },
        '/test': {
          target: 'http://127.0.0.1:3000',
          changeOrigin: true
        },
      }
    }
  })
})
