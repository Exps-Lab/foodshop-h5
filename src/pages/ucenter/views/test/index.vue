<template>
  <div class="main">
    <p>test</p>
  </div>
</template>

<script setup>
// import { getCapture, loginSubmit } from '@api/login'
// import { ref } from 'vue'

const reqUcenterData = () => {
  // getUcenterData().then(res => {
  //   const { data } = res
  //   Svg.value = data
  // })
}

const init = () => {
  reqUcenterData()
}
init()
</script>

<style lang="less" scoped>
  .main {
    min-height: 100vh;
    background: var(--van-gray-1);
  }
</style>
