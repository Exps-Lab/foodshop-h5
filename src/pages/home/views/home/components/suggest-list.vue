<template>
  <section class="list-box__header">附近商家</section>
  <van-list
    class="self-list-box"
    v-model:loading="loading"
    :finished="finished"
    :finished-text="pagination.endText"
    :immediate-check="false"
    @load="onLoad">
    <GoodsCard
      v-for="(goodsData, index) in listShop.showData"
      :key="goodsData._id"
      :goods-data="goodsData"
      :costTime="listShop.costTime[index]"
    />
  </van-list>
</template>

<script setup>
  import { reactive, ref, watch } from 'vue'
  import { getShopList, getPosCostTime } from '@api/home'
  import GoodsCard from './goods-card.vue'

  const loading = ref(false);
  const finished = ref(false);
  const nowPosStr = ref('')

  // 前端分页，区分展示和源数据
  const listShop = reactive({
    resData: [],
    showData: [],
    sliceData: [],
    costTime: [],
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
      current_pos: nowPosStr.value
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
    pagination.hasNext = Boolean(pagination.total - pageNum * pageSize > 0)
    listShop.sliceData = listShop.resData.slice((pageNum-1) * pageSize, pageNum * pageSize)
    listShop.showData = listShop.showData.concat(listShop.sliceData)
  }

  const getCostTime = async (startPos, endPosArr) => {
    const { data } = await getPosCostTime({ startPos, endPosArr })
    return data
  }

  const onLoad = async () => {
    loading.value = true
    pagination.pageNum++
    loadNextData(pagination.pageNum)
    loading.value = false

    if (!pagination.hasNext) {
      finished.value = true
    }
  };

  // 计算配送路线所需时间
  watch(
    () => listShop.sliceData,
    async (newPageData) => {
      const endPosArr = newPageData.reduce((res, now) => {
        const { lat, lng } = now.pos
        res.push({ lat, lng })
        return res
      }, [])
      listShop.costTime = listShop.costTime.concat(await getCostTime(nowPosStr.value, endPosArr))
    }
  )

  // 获取当前定位
  const getPosNow = () => {
    return new Promise((resolve) => {
      const { lat, lng } = JSON.parse(window.localStorage.getItem('appPos') || '{}')
      nowPosStr.value = `${lat},${lng}`
      resolve(nowPosStr)
    })
  }

  const init = async () => {
    await getPosNow()
    await preGetShopList()
    await onLoad()
  }

  init()
</script>

<style lang="less" scoped>
  .self-list-box {
    padding: 10px 10px 50px;
  }
</style>
