import autoprefixer from 'autoprefixer'
import postCssPxToRem from "postcss-pxtorem"

export default {
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
}