<!-- 订单列表 -->

<template>
  <div class="main">
    <van-tabs
      sticky shrink
      class="tabs-order"
      :line-width="20"
      background="transparent"
      v-model:active="activeTab"
      @click-tab="onClickTab">
      <van-tab title="全部订单"></van-tab>
    </van-tabs>
    <ComListPagination :filter="filter" :reqApiFun="reqFun">
      <template v-slot="slotProps">
        <GoodsCardOrder v-if="activeTab === 0" :cardData="slotProps.listData" />
      </template>
    </ComListPagination>
  </div>
  <Tabbar :active="1" />
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { getOrderList } from '@/api/order'
import ComListPagination from '@common/components/Com_List_Pagination/index.vue'
import GoodsCardOrder from '@common/components/Goods_Card_Order/index.vue'
import Tabbar from '@components/Tab_Bar/index.vue'

const activeTab = ref(0)
const onClickTab = (name) => {
  console.log(name)
}

// 列表筛选条件
const filter = reactive({})
const reqFun = computed(() => {
  return getOrderList
})
</script>

<style lang="less" scoped>
  .main {
    min-height: 100vh;
    background: var(--van-gray-1);
    box-sizing: border-box;
    padding: 0 10px 50px;
    .tabs-order {
      margin-bottom: 10px;
    }
  }
</style>
