<!-- 确认订单页 -->

<template>
  <div class="main-content">
    <ChoseAddress :shopPos="shopPos"/>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'
  import ChoseAddress from './components/Chose_Address.vue'

  const route = useRoute()
  console.log(route.query.shoppingBagId)

  const shopPos = ref('')
  // test [todo] 应该从redis中取
  setTimeout(() => {
    shopPos.value = '39.908789, 116.495676'
  }, 2000)
</script>

<style lang="less" scoped>
  .main-content {
    min-height: 100vh;
    padding: 15px;
    background-color: rgb(245, 245, 246);
  }
</style>
