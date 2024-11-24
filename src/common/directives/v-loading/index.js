/**
 * demo:
 * 无参数
 * <p v-loading="explore.loading">
 * 定制化参数
 * <p v-loading="explore.loading" :loading-needText="true" :loading-needBg="true" loading-text="aaaaa">
 *
 * 可选参数：
 * text: '加载中...',  // loading文案
 * needBgColor: true  // loading是否需要背景颜色
 * needText: false,   // loading是否需要文案
 */

import { reactive, createApp } from 'vue'
import template from './index.vue'

const defaultOptions = {
  text: '加载中...',
  needBg: false,
  needText: false
}

const appendEl = (el) => {
  el?.appendChild(el.instance.$el)
}
const removeEl = (el) => {
  el?.removeChild(el.instance.$el)
}

// 收集loading参数
const getAttrOptions = (el) => {
  const booleanMap = ['true', 'false']
  return Object.keys(defaultOptions).reduce((obj, key) => {
    const val = el.getAttribute(`loading-${key}`) || defaultOptions[key]
    obj[key] = booleanMap.includes(val) ? JSON.parse(val) : val
    return obj
  }, {})
}
// [note] 为了让loading撑满父元素空间，帮挂载的父元素添加relative属性
const preHandlePosition = (el) => {
  const positionMap = ['relative', 'absolute', 'fixed', 'sticky']
  const elPositionStyle = window.getComputedStyle(el).position
  if (!positionMap.includes(elPositionStyle)) {
    el.style.position = 'relative'
  }
}

const Loading = {
  mounted (el, binding) {
    const options = reactive(Object.assign({}, defaultOptions, getAttrOptions(el)))
    const app = createApp(template, options)
    el.instance = app.mount(document.createElement('div'))
    preHandlePosition(el)
    if (binding.value) {
      appendEl(el)
    }
  },
  updated (el, binding) {
    if (binding.value !== binding.oldValue) {
      binding.value ? appendEl(el) : removeEl(el)
    }
  }
}

export default Loading
