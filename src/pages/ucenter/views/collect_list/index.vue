<!-- 收藏店铺列表 -->

<template>
  <div class="main">
    <ComListPagination :reqApiFun="reqFun">
      <template v-slot="slotProps">
        <van-empty description="" v-if="!slotProps.listData.length" />
        <template v-else>
          <GoodsCard
            v-for="(goodsData, index) in slotProps.listData"
            :key="index"
            :goodsData="goodsData.shop"
            :costTime="false" />
        </template>
      </template>
    </ComListPagination>
  </div>
</template>

<script setup>
  import GoodsCard from '@common/components/Goods_Card/index.vue'
  import ComListPagination from '@common/components/Com_List_Pagination/index.vue'
  import { getCollectList } from '@api/collect'
  import { computed } from 'vue'

  const reqFun = computed(() => {
    return getCollectList
  })
</script>

<style lang="less" scoped>
  .main {
    min-height: 100vh;
    background: var(--van-gray-1);
    padding: 20px 15px;
  }
</style>
