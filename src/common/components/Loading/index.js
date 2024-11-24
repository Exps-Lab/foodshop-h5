/**
 * loading 函数式组件
 *
 * options:
 * fixed: false, // 是否全局展示
 * text: '加载中...',  // loading文案
 * teleport: 'body',  // loading挂载的父元素。class或id或tag
 * needBgColor: true  // loading是否需要背景颜色
 * needText: false,   // loading是否需要文案
 *
 * 使用demo：
 * import Loading from '@common/components/Loading'
 *
 * 1. show：
 * 全局loading（挂载到body上），没有挂载时机限时
 * Loading.show()
 *
 * 挂载非body的节点时，需要在业务的onMounted之后初始化loading
 * onMounted(() => {
 *   Loading.show({ teleport: '.index-bar-box' })
 * })
 *
 * 2. hide
 * Loading.hide()
 */

import { reactive, createApp } from 'vue'
import template from './index.vue'

const defaultOptions = {
  fixed: false,
  text: '加载中...',
  teleport: 'body',
  needBgColor: false,
  needText: false
}
let appInstance = null

const Loading = {
  handleOptions (options) {
    if (!options?.teleport) {
      defaultOptions.fixed = true
    }
    return reactive(Object.assign({}, defaultOptions, options))
  },
  initLoading (options) {
    appInstance = createApp(template, this.handleOptions(options))
    appInstance.mount(document.createElement('div'))
  },
  show (options) {
    !appInstance && this.initLoading(options)
    appInstance._instance?.exposed?.showLoading()
  },
  hide () {
    appInstance._instance?.exposed?.hideLoading()
    appInstance = null
  }
}

export default Loading
