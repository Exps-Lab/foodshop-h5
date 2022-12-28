
<template>
  <Teleport :to="props.teleport">
    <section
      v-if="show"
      :class="['loading__box', props.fixed && 'fix-box', props.needBgColor && 'need-bg']">
      <img class='loading__img' src="./imgs/loading.png" alt="loading" />
      <p class="loading_text" v-if="props.needText">{{props.text}}</p>
    </section>
  </Teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  fixed: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: '加载中...'
  },
  teleport: {
    type: String
  },
  needBgColor: {
    type: Boolean,
    default: false
  },
  needText: {
    type: Boolean,
    default: false
  }
})

// 控制loading显隐
const show = ref(false)
const showLoading = () => {
  show.value = true
}
const hideLoading = () => {
  show.value = false
}

// [note] 为了让loading撑满父元素空间，帮挂载的父元素添加relative属性
const preHandlePosition = () => {
  const parentEl = document.querySelector(props.teleport)
  const positionMap = ['relative', 'absolute', 'fixed', 'sticky']
  const elPositionStyle = window.getComputedStyle(parentEl).position
  if (!positionMap.includes(elPositionStyle)) {
    parentEl.style.position = 'relative'
  }
}

onMounted(() => {
  !props.fixed && preHandlePosition()
})

defineExpose({
  showLoading,
  hideLoading
})
</script>

<style lang="less" scoped>
  .loading__box {
    position: absolute;
    top: 0; right: 0; bottom: 0; left: 0;
    min-height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    &.fix-box {
      position: fixed;
      z-index: 9;
    }
    &.need-bg {
      background-color: @fill-7;
      .loading_text {
        color: @text-1;
      }
    }
    .loading__img {
      max-width: 100%;
      display: block;
      animation: rotate 1s linear infinite;
    }
    .loading_text {
      margin-top: 15px;
      font-size: 13px;
      color: @text-5;
      letter-spacing: 1px;
    }
  }
  @keyframes rotate {
    to { transform: rotateZ(1turn) }
  }
</style>
