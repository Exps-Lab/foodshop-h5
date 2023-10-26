<!-- 图片展示带点击全屏预览 -->

<template>
  <section class="img-preview-box" @click="controlPreview('show')">
    <img class="img-url" :src="props.imgUrl" alt="imgUrl" />
  </section>
  <!-- 全屏预览 -->
  <section class="preview-box" v-show="previewShow" @click="controlPreview('hide')">
    <img class="preview-img" :src="props.imgUrl" alt="imgUrl" />
  </section>
</template>

<script setup>
  import { ref, watch } from 'vue'
  const props = defineProps({
    imgUrl: {
      type: String,
      required: true
    }
  })
  const bodyScrollTop = ref(0)
  const previewShow = ref(false)
  const controlPreview = (type) => {
    previewShow.value = (type === 'show')
  }

  watch(previewShow, (now) => {
    if (now) {
      bodyScrollTop.value = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
      document.body.style.position = 'fixed'
    } else {
      document.body.removeAttribute('style')
      window.scrollTo(0, bodyScrollTop.value)
    }
  })
</script>

<style lang="less" scoped>
  .img-preview-box {
    height: 100%;
    width: 100%;
    .img-url {
      height: 100%;
      width: 100%;
      max-width: 100%;
      object-fit: cover;
      display: block;
      border-radius: 8px;
    }
  }
  .preview-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    display: flex;
    background-color: @fill-6;
    justify-content: center;
    align-items: center;
    .preview-img {
      width: 100%;
      object-fit: cover;
    }
  }
</style>
