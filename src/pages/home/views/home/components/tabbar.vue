<template>
  <van-tabbar class="fix-elm-center" v-model="constData.active" :safe-area-inset-bottom="true">
    <van-tabbar-item icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item icon="label-o">订单</van-tabbar-item>
    <van-tabbar-item icon="friends-o">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import { reactive, onMounted } from 'vue'

const constData = reactive({
  active: 0
})

onMounted(() => {
})
</script>

<style lang="less" scoped>
</style>
