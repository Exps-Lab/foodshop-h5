<template>
  <van-list
    class="self-list-box"
    v-model:loading="loading"
    :finished="finished"
    :finished-text="pagination.endText"
    :immediate-check="false"
    @load="onLoad">
    <GoodsCard v-for="goodsData in listShop.showData" :key="goodsData._id" :goods-data="goodsData" />
  </van-list>
</template>

<script setup>
  import { reactive, onMounted, ref } from 'vue'
  import { getShopList } from '@api/home'
  import GoodsCard from './goods-card.vue'

  const loading = ref(false);
  const finished = ref(false);

  // 前端分页，区分展示和源数据
  const listShop = reactive({
    resData: [],
    showData: []
  })

  // 处理分页参数
  const pagination = reactive({
    pageSize: 10,
    pageNum: 0,
    total: 0,
    hasNext: false,
    endText: '没有更多了'
  })

  const preGetShopList = () => {
    return getShopList({
      current_pos: '39.929986, 116.503839'
    }).then(res => {
      const { data } = res
      pagination.total = data.length
      pagination.hasNext = Boolean(data.length > pagination.pageSize)
      listShop.resData = listShop.resData.concat(data)
    })
  }

  // 加载下一页数据
  const loadNextData = (pageNum = 1) => {
    const { pageSize } = pagination
    const sliceData = listShop.resData.slice((pageNum-1) * pageSize, pageNum * pageSize)
    listShop.showData = listShop.showData.concat(sliceData)

    pagination.hasNext = Boolean(pagination.total - pageNum * pageSize > 0)
  }

  const onLoad = () => {
    loading.value = true
    pagination.pageNum++
    loadNextData(pagination.pageNum)
    loading.value = false

    if (!pagination.hasNext) {
      finished.value = true
    }
  };

  const init = async () => {
    await preGetShopList()
    await onLoad()
  }

  onMounted(() => {
    init()
  })
</script>

<style lang="less" scoped>
  .self-list-box {
    padding: 10px 10px 50px;
  }
</style>
