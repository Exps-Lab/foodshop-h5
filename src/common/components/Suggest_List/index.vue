<template>
  <section class="list-box__header" v-if="props.needTitle">附近商家</section>
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
      :costTime="listShop.costTime[index]"/>
  </van-list>
</template>

<script setup>
  import { reactive, ref, watch } from 'vue'
  import { useStore } from 'vuex'
  import { getShopList, getPosCostTime } from '@api/home'
  import GoodsCard from '@common/components/Goods_Card/index.vue'

  const { getters } = useStore()
  const loading = ref(true);
  const finished = ref(false);
  const nowPosStr = ref('')
  const props = defineProps({
    needTitle: {
      type: Boolean,
      default: true
    },
    // 筛选条件
    // distance  根据距离远近排序 (正序1/倒序-1)
    // shop_type 根据商品的类型名称筛选
    filter: {
      type: Object,
      default: () => {}
    }
  })

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
  const resetFilterData = () => {
    listShop.resData = []
    listShop.showData = []
    listShop.sliceData = []
    listShop.costTime = []
    pagination.pageNum = 0
    pagination.total = 0
    pagination.hasNext = false
  }
  const handleFilterParams = () => {
    return Object.keys(props.filter).reduce((params, key) => {
      const value = props.filter[key]
      if (key === 'distance') {
        params.current_pos = nowPosStr.value
      }
      params[key] = value
      return params
    }, {})
  }
  const preGetShopList = () => {
    resetFilterData()
    const filter = handleFilterParams()
    return getShopList(filter).then(res => {
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
      if (newPageData.length) {
        const endPosArr = newPageData.reduce((res, now) => {
          const {lat, lng} = now.pos
          res.push({lat, lng})
          return res
        }, [])
        listShop.costTime = listShop.costTime.concat(await getCostTime(nowPosStr.value, endPosArr))
      }
    }
  )
  // 计算配送路线所需时间
  watch(
    () => props.filter,
    async (now, pre) => {
      await preGetShopList()
      await onLoad()
    }, {
      deep: true
    }
  )

  // 获取当前定位
  const getPosNow = () => {
    return new Promise((resolve) => {
      const originData = getters.getChosePos.lat
        ? getters.getChosePos
        : JSON.parse(localStorage.getItem('appPos') || '{}')
      const { lat, lng } = originData
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
