
<template>
  <section
    :class="['loading__box', props.needBg && 'need-bg']">
    <img class='loading__img' src="./imgs/loading.png" alt="loading" />
    <p class="loading_text" v-if="props.needText">{{props.text}}</p>
  </section>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    default: '加载中...'
  },
  needBg: {
    type: Boolean,
    default: false
  },
  needText: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="less" scoped>
  .loading__box {
    position: absolute;
    z-index: 9;
    top: 0; right: 0; bottom: 0; left: 0;
    width: 100%;
    min-height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
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
