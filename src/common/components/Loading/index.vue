
<template>
  <Teleport :to="props.teleport">
    <section
      :class="['loading__box', props.fixed && 'fix-box', props.needBgColor && 'need-bg']"
      :style="{ height: loadingBoxHeight }"
      v-if="show" >
      <img class='loading__img' src="./imgs/loading.png" alt="loading" />
      <p class="loading_text">{{props.text}}</p>
    </section>
  </Teleport>
</template>

<script setup>
  import { ref, defineExpose, onMounted, nextTick } from 'vue'

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
      default: true
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

  // 处理loading盒子的高度，跟父元素一致
  const loadingBoxHeight = ref('')
  const calcLoadingBoxPos = () => {
    nextTick(() => {
      const parentHeight = document.querySelector(props.teleport).getBoundingClientRect().height
      loadingBoxHeight.value = parentHeight + 'px'
    })
  }

  onMounted(() => {
    calcLoadingBoxPos()
  })

  defineExpose({
    showLoading,
    hideLoading
  })
</script>

<style lang="less" scoped>
  .loading__box {
    width: 100%;
    min-height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    &.fix-box {
      position: fixed;
      z-index: 9;
      top: 0; right: 0; bottom: 0; left: 0;
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
