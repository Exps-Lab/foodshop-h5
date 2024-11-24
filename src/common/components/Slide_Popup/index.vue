<!--
  带标题栏的popup组件
  暴露出控制显示方法，通过ref调用
    showPopup,
    hidePopup
  demo:
    <SlidePopup
      ref="remarkPopup"
      title="订单备注"
      @confirmClick="clickRemarkConfirm">
    </SlidePopup>
-->

<template>
  <van-popup
    round
    v-model:show="show"
    position="bottom"
    :close-on-popstate="true"
    :safe-area-inset-bottom="true"
    @closed="hidePopup">
    <section class="main-box">
      <section class="header">
        <span class="header-item back" @click="hidePopup">返回</span>
        <span class="header-item title font-bold-weight">{{title}}</span>
        <span class="header-item confirm" @click="handleConfirm">确认</span>
      </section>
      <section class="content">
        <slot></slot>
      </section>
    </section>
  </van-popup>
</template>

<script setup>
  import { ref } from 'vue'
  defineProps({
    title: {
      type: String,
      default: '标题'
    }
  })

  const emit = defineEmits(['confirmClick', 'cancelClick'])

  const show = ref(false)
  const showPopup = () => {
    show.value = true
  }
  const hidePopup = () => {
    emit('cancelClick')
    show.value = false
  }

  const handleConfirm = () => {
    emit('confirmClick')
    hidePopup()
  }

  defineExpose({
    showPopup,
    hidePopup
  })
</script>

<style lang="less" scoped>
  .main-box {
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 44px;
      padding: 0 16px;
      box-sizing: border-box;
      box-shadow: 0 2px 6px -1px @fill-4;
      .header-item {
        font-size: 14px;
      }
      .back {
        color: var(--van-text-color-2);
      }
      .title {
        font-size: 15px;
        color: @text-4;
      }
      .confirm {
        color: var(--van-text-link-color);
      }
    }
    .content {
      padding: 30px 20px;
    }
  }
</style>
