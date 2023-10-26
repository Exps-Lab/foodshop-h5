<template>
  <van-card
    :title="props.shopData.name"
    :thumb="shopAvatar">
    <template #desc>
      {{ props.shopData.costTime }}分钟
    </template>
  </van-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  shopData: {
    type: Object,
    default: () => {}
  }
})

const shopAvatar = computed(() => {
  const { avatar } = props.shopData.shop_image
  return (avatar && avatar.includes('static'))
    ? avatar
    : 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg'
})
</script>

<style lang="less" scoped>
</style>
