
<template>
  <Teleport :to="teleport">
    <section :class="['loading__box', props.fixed && 'fix-box']" v-if="show">
      <img class='loading__img' src="./imgs/loading.png" alt="loading" />
    </section>
  </Teleport>
</template>

<script setup>
  import { computed, ref, defineExpose } from 'vue'

  const props = defineProps({
    fixed: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '加载中...',
    },
    teleport: String
  })
  const teleport = computed(() => props.teleport)

  const show = ref(false)
  const showLoading = () => {
    show.value = true
  }
  const hideLoading = () => {
    show.value = false
  }

  defineExpose({
    showLoading,
    hideLoading
  })

</script>

<style lang="less" scoped>
  .loading__box {
    display: flex;
    align-items: center;
    justify-content: center;
    // background-color: @fill-3;
    margin: 50% 0 0 50%;
    transform: translate3d(-50%, -50%, 0);
    &.fix-box {
      position: fixed;
      z-index: 9;
      top: 0; right: 0; bottom: 0; left: 0;
    }
    .loading__img {
      max-width: 100%;
      display: block;
      animation: rotate 1s linear infinite;
    }
  }
  @keyframes rotate {
    to { transform: rotateZ(1turn) }
  }
</style>
