<!--
  * @fileoverview toast组件
  * @example // 调用示例
  import { getCurrentInstance } from 'vue'
  const internalInstance = getCurrentInstance()
  const globalProperties = internalInstance?.appContext.config.globalProperties
  globalProperties.$toast({
    type: 'loading',             // 分别为success, failed对应状态icon，也可以不传，则不展示icon
    text: '加载中',               // 显示的文案
    duration: 3000,            // 展示时长（毫秒单位，默认为2s）
    onClose: function () {}   // close执行后的回调
  })
-->

<template>
  <div class="toast-box" v-if="data.isShow">
    <div class="toast-main">
      <img class="toast-icon" v-if="icon" :src="icon" alt="toast-icon">
      <span>{{props.text}}</span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 2000
  },
  onClose: {
    type: [Function, null],
    default: null
  }
})

const data = ref({
  isShow: false,
  timer: null
})

const show = () => {
  clear()
  data.value.isShow = true
  data.value.timer = setTimeout(close, props.duration)
}

const close = () => {
  data.value.isShow = false
  if (props.onClose !== null) {
    props.onClose()
  }
}
const clear = () => {
  clearTimeout(data.value.timer)
  data.value.timer = null
}

const icon = computed(() => {
  const ToastIconMap = {
    warning: new URL('../static/warning_icon.png', import.meta.url).href,
    success: new URL('../static/success_icon.png', import.meta.url).href
  }
  return props.type ? ToastIconMap[props.type] : ''
})

onMounted(() => {
  show()
})
</script>

<style scoped lang="less">
  .toast-box {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    background-color: transparent;
    .toast-main {
      min-width: 364px;
      height: 80px;
      padding: 0 32px;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.1);
      border-radius: 40px;
      border: 1px solid #EEEEEE;
      margin-left: 50%;
      transform: translateX(-50%);
      animation: toast 0.1s ease-out forwards;
      .toast-icon {
        display: block;
        height: 32px;
        width: 32px;
        margin-right: 16px;
      }
      span {
        font-size: 28px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: bold;
        color: #323232;
        white-space: nowrap;
      }
      @keyframes toast {
        from { margin-top: 0; opacity: 0 }
        to { margin-top: 32px; opacity: 1 }
      }
    }
  }
</style>
