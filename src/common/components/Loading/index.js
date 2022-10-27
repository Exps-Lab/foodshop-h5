
import { reactive, createApp } from 'vue'
import template from './index.vue'

const defaultOptions = {
  title: '',
  teleport: ''
}

class Loading {
  constructor(options = {}) {
    this.option = reactive(Object.assign({}, defaultOptions, options))
    this.app = null
    this.createLoading()
  }
  createLoading () {
    this.app = createApp(template, this.option)
    this.app.mount(document.createElement('div'))
  }
  show () {
    this.app._instance.exposed.showLoading()
  }
  hide () {
    this.app._instance.exposed.hideLoading()
  }
}

export default Loading
