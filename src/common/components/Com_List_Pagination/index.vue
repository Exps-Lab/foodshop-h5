<template>
  <section class="list-box__header" v-if="props.needTitle">附近商家</section>
  <van-list
    class="self-list-box"
    v-loading="loading"
    :finished="finished"
    :finished-text="pagination.endText"
    :immediate-check="false"
    @load="onLoad">
    <!--  订单卡片  -->
    <template v-if="props.cardType === 'order'">
      <GoodsCardOrder
        v-for="(goodsData, index) in listShop.showData"
        :key="goodsData._id"
        :goods-data="goodsData"
        :costTime="listShop.costTime[index]"/>
    </template>
    <!--  推荐卡片  -->
    <template v-else-if="props.cardType === 'suggest'">
      <GoodsCard
        v-for="(goodsData, index) in listShop.showData"
        :key="goodsData._id"
        :goods-data="goodsData"
        :costTime="listShop.costTime[index]"/>
    </template>
  </van-list>
</template>

<script setup>
import { reactive, ref, watch, computed } from 'vue'
import { getShopList, getPosCostTime } from '@api/home'
import { HOMECHOSEPOS } from '@utils/sessionStorage_keys'
import { posStore } from '@pages/home/store/pos'
import GoodsCard from '@common/components/Goods_Card/index.vue'
import GoodsCardOrder from '@common/components/Goods_Card_Order/index.vue'

const store = posStore()

const loading = ref(false)
const finished = ref(false)
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
  },
  // 列表组件使用的卡片类型
  cardType: {
    type: String,
    // 'suggest', 'order'
    default: 'suggest'
  },
  pageSize: {
    type: Number,
    default: 10
  }
})

// 根据是否需要定位来拆分不同的列表逻辑
const needPos = computed(() => {
  return props.cardType === 'suggest'
})

// 分页，区分展示和源数据
const listShop = reactive({
  showData: [],
  sliceData: [],
  costTime: []
})

// 处理分页参数
const pagination = reactive({
  pageSize: props.pageSize,
  pageNum: 1,
  total: 0,
  hasNext: false,
  endText: '没有更多了'
})

const handleFilterParams = () => {
  const propFilter = Object.keys(props.filter).reduce((params, key) => {
    const value = props.filter[key]
    if (key === 'distance') {
      params.current_pos = nowPosStr.value
    }
    params[key] = value
    return params
  }, {})
  propFilter.page_num = pagination.pageNum
  propFilter.page_size = pagination.pageSize
  return propFilter
}

const preGetShopList = async () => {
  if (!loading.value) {
    const filter = handleFilterParams()
    loading.value = true
    const { data: { total, hasNext, list } } = await getShopList(filter)

    pagination.total = total
    pagination.hasNext = hasNext
    listShop.sliceData = list
    listShop.showData = listShop.showData.concat(list)
    loading.value = false
  }
}

// 计算配送路线所需时间
const preGetCostTime = async (sliceData) => {
  if (sliceData.length && needPos.value) {
    const endPosArr = sliceData.reduce((res, now) => {
      const { lat, lng } = now.pos
      res.push({ lat, lng })
      return res
    }, [])
    const calcTimeArr = await getCostTime(nowPosStr.value, endPosArr)
    listShop.costTime = listShop.costTime.concat(calcTimeArr)
  }
}

const getCostTime = async (startPos, endPosArr) => {
  const { data } = await getPosCostTime({ startPos, endPosArr })
  return data
}

const onLoad = async () => {
  if (!loading.value && pagination.hasNext) {
    pagination.pageNum++
    await preGetShopList()

    if (!pagination.hasNext) {
      finished.value = true
    }
  }
}

const getData = async () => {
  await preGetShopList()
}

// 计算配送路线所需时间
watch(
  () => listShop.sliceData,
  async (newPageData) => {
    await preGetCostTime(newPageData)
  }
)
// 计算配送路线所需时间
watch(
  () => props.filter,
  async (now, pre) => {
    await getData()
  }, {
    deep: true
  }
)
// 处理跟首页header异步数据
watch(
  () => store.firstPosStr,
  async (now) => {
    if (now) {
      nowPosStr.value = now
    }
  }
)
watch(
  nowPosStr,
  async (now) => {
    // [note] storage没有并且store里没有触发过首页header定位（直接访问链接进入需要定位的页面）
    // loading.value = true
    if (now.includes('undefined')) {
      if (!store.positioning) {
        await store.getPosByTXReq()
      }
    } else {
      await getData()
    }
  }
)

// 获取当前定位
const getPosNow = () => {
  // 用户选择位置
  const getChosePos = JSON.parse(sessionStorage.getItem(HOMECHOSEPOS)) || null
  // 腾讯定位位置
  const appPos = JSON.parse(localStorage.getItem('appPos') || '{}') || null
  const originData = getChosePos || appPos
  const { lat, lng } = originData
  nowPosStr.value = `${lat},${lng}`
}

const init = async () => {
  needPos.value ? getPosNow() : getData()
}

init()
</script>

<style lang="less" scoped>
  .self-list-box {
    /*min-height: 50vh;*/
    padding: 10px 10px 20px;
  }
</style>
