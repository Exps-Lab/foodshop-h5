<template>
  <div class="result-container">
    <van-cell-group inset>
      <van-search
        v-model="data.searchVal"
        show-action
        autofocus
        placeholder="请输入商家或商品名称"
        @search="onSearch"
        @update:model-value="debounce(getResultList, 300)"
      >
        <template #action>
          <div @click="onSearch">搜索</div>
        </template>
      </van-search>
    </van-cell-group>

    <SearchHistory v-if="!isSearching" @search="historyClick" />
    <van-list
      v-else
      v-loading="data.loading"
      :finished="data.finished"
      :finished-text="pagination.endText"
      :immediate-check="false"
      @load="onLoad"
    >
      <GoodsCard
        v-for="item in data.shopShowList"
        :key="item.id"
        :goods-data="item"
        :costTime="item.costTime"
      />
    </van-list>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import SearchHistory from './components/search_history.vue'
import GoodsCard from '@common/components/Goods_Card/index.vue'
import { posStore } from '@pages/home/store/pos'
import { getGlobalSearch, getPosCostTime } from '@/api/home'
import { Storage, debounce } from '@/utils/index.js'

const store = posStore()

const maxHistoryNum = 20 // 历史记录最大存储数
const data = reactive({
  searchVal: '',
  loading: false,
  finished: false,
  shopResList: [],
  shopShowList: []
})
// 分页参数
const pagination = reactive({
  pageSize: 10,
  pageNum: 0,
  total: 0,
  hasNext: false,
  endText: '没有更多了'
})

const isSearching = computed(() => {
  return !!data.searchVal
})

// 输入框查询
const onSearch = () => {
  // 更新历史记录storage数据
  const historyList = Storage.get('shopHistory') || []
  historyList.unshift(data.searchVal)
  historyList.splice(maxHistoryNum)
  Storage.set('shopHistory', [...new Set(historyList)])
  // 搜索
  getResultList()
}

// 点击历史搜索项
const historyClick = (val) => {
  data.searchVal = val
  getResultList()
}

// 获取搜索结果
const getResultList = async () => {
  resetFilterData()
  if (!data.searchVal) return
  data.loading = true
  // 没有定位信息需要先获取
  if (store.firstPosStr.includes('undefined')) {
    await store.getPosByTXReq()
  }
  const params = {
    name: data.searchVal,
    current_pos: store.firstPosStr
  }
  const res = await getGlobalSearch(params)
  data.shopResList = res.data || []
  pagination.total = data.length
  pagination.hasNext = Boolean(data.length > pagination.pageSize)
  onLoad()
}

// 加载分页数据
const onLoad = async () => {
  pagination.pageNum++
  await loadNextData(pagination.pageNum)
  data.loading = false
  if (!pagination.hasNext) {
    data.finished = true
  }
}

// 加载下一页数据
const loadNextData = async (pageNum = 1) => {
  const { pageSize } = pagination
  pagination.hasNext = Boolean(pagination.total - pageNum * pageSize > 0)
  // 获取新店铺列表
  const newShopList = data.shopResList.slice((pageNum - 1) * pageSize, pageNum * pageSize)
  if (newShopList.length === 0) {
    return
  }
  // 获取新店铺的配送时长列表
  const endPosArr = newShopList.reduce((res, item) => {
    res.push(item.pos)
    return res
  }, [])
  const { data: timeRes } = await getPosCostTime({
    startPos: store.firstPosStr,
    endPosArr
  })
  // 填充店铺的时长信息
  for (const i in newShopList) {
    newShopList[i].costTime = timeRes[i]
  }
  data.shopShowList = data.shopShowList.concat(newShopList)
}

// 清空分页数据
const resetFilterData = () => {
  data.shopResList = []
  data.shopShowList = []
  pagination.pageNum = 0
  pagination.total = 0
  pagination.hasNext = false
}
</script>

<style lang="less" scoped>
  .result-container {
    position: relative;
    background-color: #F5F5F5;
    height: 100vh;
    padding-top: 58px;
    box-sizing: border-box;
  }
  &:deep(.van-cell-group) {
    height: 34px;
    min-width: 350px;
    width: calc(100% - 24px);
    position: absolute;
    top: 0;
    margin: 12px;
    padding: 0 12px;
    box-sizing: border-box;
    border-radius: 17px;
    z-index: 2;
    .van-search {
      padding: 0;
      .van-search__content {
        padding-left: 0;
        background-color: @fill-1;
        input {
          &::-webkit-input-placeholder {
            color: @text-3;
          }
        }
      }
    }
  }
</style>
