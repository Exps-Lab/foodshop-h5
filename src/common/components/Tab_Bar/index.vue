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
  const host = window.location.host
  const baseHome = import.meta.env.DEV ? `//${host}/src/pages/home/index.html` : `//${host}/home`
  const baseUser = import.meta.env.DEV ? `//${host}/src/pages/user/index.html` : `//${host}/user`
  switch (index) {
    case 0:
      window.location.href = baseHome
      break
    case 1:
      console.log('my order')
      break
    case 2:
      window.location.href = baseUser
      break
  }
}

onMounted(() => {
})
</script>

<style lang="less" scoped>
</style>
