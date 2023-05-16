<!-- 确认订单页 -->

<template>
  <div class="main-content">
    <ChoseAddress :shopPos="shopPos"/>
  </div>
</template>

<script setup>
  // import { ref, reactive, computed } from 'vue'
  import ChoseAddress from './components/Chose_Address.vue'

  // test
  const shopPos = '39.908789, 116.495676'
</script>

<style lang="less" scoped>
  .main-content {
    min-height: 100vh;
    padding: 15px;
    background-color: rgb(245, 245, 246);
  }
</style>
