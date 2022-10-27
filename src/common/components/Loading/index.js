
import { reactive, createApp } from 'vue'
import template from './index.vue'

const defaultOptions = {
  fixed: false,
  title: '',
  teleport: ''
}
let appInstance = null

const Loading = {
  initLoading (options) {
    const option = reactive(Object.assign({}, defaultOptions, options))
    appInstance = createApp(template, option)
    appInstance.mount(document.createElement('div'))
  },
  show (options) {
    !appInstance && this.initLoading(options)
    appInstance._instance.exposed.showLoading()
  },
  hide () {
    appInstance._instance.exposed.hideLoading()
    appInstance = null
  },
}

export default Loading
