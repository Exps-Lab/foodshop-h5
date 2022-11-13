<template>
  <p>商家从业资质</p>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { getShopDetail, getShopGoods, searchShopGoods } from '@api/shop'

  const router = useRouter()
  const route = useRoute()

</script>
 
<style lang="less" scoped>
  .detail-content {
    min-height: 100vh;
  }
</style>
