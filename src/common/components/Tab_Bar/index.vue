<template>
  <van-tabbar
    class="fix-elm-center"
    v-model="constData.active"
    :safe-area-inset-bottom="true"
    @change="tabChange">
    <van-tabbar-item icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item icon="label-o">订单</van-tabbar-item>
    <van-tabbar-item icon="friends-o">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { diffModuleJump } from '@utils'

const tabProps = defineProps({
  active: {
    type: Number,
    default: 0
  }
})

const constData = reactive({
  active: tabProps.active
})

const tabChange = (index) => {
  switch (index) {
    case 0:
      diffModuleJump('/home', '', 'home')
      break
    case 1:
      diffModuleJump('/order/orderList', '', 'order')
      break
    case 2:
      diffModuleJump('/ucenter', '', 'ucenter')
      break
  }
}

onMounted(() => {
})
</script>

<style lang="less" scoped>
</style>
