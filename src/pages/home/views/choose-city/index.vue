<template>
  <p>choose city</p>
</template>

<script setup>
  import { Toast } from 'vant'
  import { ref, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { searchWithRange, searchWithoutKeyword } from '@api/pos'

  const router = useRouter()

  const init = async () => {
  }
  init()
</script>
 
<style lang="less" scoped>
</style>
