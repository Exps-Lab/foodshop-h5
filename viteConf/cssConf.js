import autoprefixer from 'autoprefixer'
import postCssPxToRem from "postcss-pxtorem"

export default {
  preprocessorOptions: {
    less: {
      // 引入less全局变量/样式
      // [note] 多个文件要拼在一起~
      // additionalData: `@import '@common/styles/variables.less';`,
      additionalData:
        `@import '@common/styles/variables.less';
        @import '@common/styles/btn_style.less';
        @import '@common/styles/common-style.less';`,
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
        minPixelValue: 2,
      })
    ]
  }
}
