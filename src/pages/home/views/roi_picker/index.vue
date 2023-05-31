<template>
  <div class="roi-box">
    <div class="complex-header">
      <section class="now-city" @click="chooseCity">
        <van-icon v-if="pos.city" class="location-icon font-bold-weight" name="location-o" />
        <span :class="['city', !pos.city && 'yellow']">{{pos.city || '选择城市'}}</span>
      </section>
      <section class="roi-search">
        <van-search
          v-model="search.keyword"
          :show-action="pageMode === 'search'"
          placeholder="小区/街道/大厦/学校名称"
          @search="searchNearby"
          @update:model-value="searchNearby"
          @focus="changePageShowMode('search')"
          @clear="changePageShowMode('pos')"
          @cancel="changePageShowMode('pos')"/>
      </section>
    </div>
    <section class="divider hair-line"></section>

    <!-- 地址选择 -->
    <div class="pos-mes-box" v-if="pageMode === 'pos'">
      <section class="pos-now">
        <section class="pos-left">
          <span v-if="pos.isPosing">定位中...</span>
          <section v-else>当前位置：<span class="font-bold-weight van-ellipsis pos">{{pos.accurate}}</span></section>
        </section>
        <section class="pos-right repos" @click="handleRePos">
          <van-icon class="location-icon font-bold-weight" name="aim" />重新定位
        </section>
      </section>
      <section class="divider"></section>
      <section class="com-box__list nearby-explore">
        <p class="list-box__header yellow">附近地址</p>
        <div class="com_list__ul explore-list" v-loading="explore.loading">
          <p
            class="com_list__li big-padding"
            v-for="(item, index) in explore.list"
            :key="index"
            @click="setChoseAddress(item)">
            {{item.title}}
          </p>
        </div>
      </section>
    </div>
    <!-- 搜索列表 -->
    <div class="com-box__list" v-else>
      <van-list
        v-model:loading="search.loading"
        :finished="search.finished"
        :immediate-check="false">
        <div class="com_list__ul">
          <section class="com_list__li" v-for="(item, index) in search.list" :key="index" @click="setChoseAddress(item)">
            <p class="item-top__main">
              {{item.title}}
              <span class="item-top__right">{{item.distance < 1 ? `${item.distance*100}m` : `${item.distance}km` }}</span>
            </p>
            <p class="item-top__sub">{{item.address}}</p>
          </section>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { searchWithRange, searchWithoutKeyword } from '@api/pos'
import { posStore } from '@pages/home/store/pos'
import { diffModuleJump } from '@utils'
import { HOMECHOSEPOS, ADDRESSCHOSEPOS } from '@utils/sessionStorage_keys'

const store = posStore()

const router = useRouter()
const route = useRoute()
// 页面展示模式
// pos: 选择地址；search：搜索附近
const pageMode = ref('pos')
// 当前选择城市
const cityNow = route.query.city_name
// 来源页面 (home首页，address地址详情页)
const fromPage = route.query.from
// // 地址详情id (从address地址详情页带过来)
const addressId = route.query.addressId

// 定位
const pos = reactive({
  isPosing: false,
  city: '',
  accurate: '',
  roi: ''
})
// 控制位置信息相关展示
const getLocation = (data) => {
  const roiData = data || JSON.parse(localStorage.getItem('appPos')) || {}
  const { city, district, lat, lng, addr = '' } = roiData
  pos.city = cityNow || city
  pos.accurate = addr || district
  pos.roi = `${lat},${lng}`
}
// 重新定位
const handleRePos = async () => {
  pos.isPosing = true
  const posData = await store.getPosByTXReq({
    forceUpdate: true
  })
  getLocation(posData)
  pos.isPosing = false
}
const chooseCity = () => {
  const query = {
    city: pos.city
  }
  fromPage && (query.from = fromPage)
  router.push({
    path: '/chooseCity',
    query
  })
}

// 附近推荐地址
const explore = reactive({
  loading: false,
  list: []
})
const getNearbyExplore = () => {
  explore.loading = true
  searchWithoutKeyword({
    current_pos: pos.roi,
    page_size: 5
  }).then(res => {
    explore.list = res.data.place
  }).finally(() => {
    explore.loading = false
  })
}

// 根据keyword搜索附近
const search = reactive({
  loading: false,
  finished: false,
  keyword: '',
  res: []
})
const changePageShowMode = (mode) => {
  pageMode.value = mode || 'pos'
  search.keyword = ''
  search.list = []
}
// 附近地标入口
const searchNearby = () => {
  pageMode.value === 'pos' && changePageShowMode('search')
  if (search.keyword) {
    search.loading = true
    searchPlace()
  }
}
// 根据关键字搜索目的地附近地标
const searchPlace = () => {
  searchWithRange({
    city_name: pos.city,
    current_pos: pos.roi,
    keyword: search.keyword,
    page_size: 20
  }).then(res => {
    search.list = res.data.place
  }).finally(() => {
    search.loading = false
    search.finished = true
  })
}

// 记录用户选择的位置
const setChoseAddress = (choseAddress) => {
  const { location: { lat, lng }, address, title } = choseAddress
  const pageConfMap = {
    home: {
      storageName: HOMECHOSEPOS,
      goRouter: '/home',
      module: 'home'
    },
    address: {
      storageName: ADDRESSCHOSEPOS,
      goRouter: '/ucenter/address_detail',
      module: 'ucenter'
    }
  }
  const { storageName, goRouter, module } = pageConfMap[fromPage]
  const needReplace = (fromPage === 'address')
  sessionStorage.setItem(storageName, JSON.stringify({ lat, lng, address, title }))
  linkPage(goRouter, module, needReplace)
}

const linkPage = (page, module, needReplace) => {
  const query = addressId !== undefined ? `addressId=${addressId}` : ''
  diffModuleJump(page, query, module, needReplace)
}

watch(
  () => pos.roi,
  async (now) => {
    // [note] 初始storage里没有需要自动发起一次定位
    if (now.includes('undefined')) {
      explore.loading = true
      await handleRePos()
    } else {
      await getNearbyExplore()
    }
  }
)

const init = async () => {
  getLocation()
}
init()
</script>

<style lang="less" scoped>
  .location-icon {
    margin-right: 5px;
  }
  .divider {
    height: 10px;
    background-color: @line-0;
    &.hair-line {
      height: 1px;
      background-color: @line-1;
    }
  }

  .roi-box {
    .complex-header {
      display: flex;
      align-items: center;
      min-height: 45px;
      padding: 8px 15px 8px 10px;
      box-sizing: border-box;
      font-size: 14px;
      .now-city {
        min-width: 75px;
        .city {
          &.yellow {
            color: @yellow-6;
          }
          &::after {
            content: '';
            width: 8px;
            height: 8px;
            margin-left: 2px;
            display: inline-block;
            transform: rotateZ(180deg);
            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAHFJREFUOBFjYBgFeEMgPT09DYTxKWLGJQnS+P///xlAeR8TE5PnZ4EAm1qsBiBpZgRqAmGchmAYgKyZkZGxAIh3AA3wxGUIigHommfOnDkR6PKTQC98wGUI3ABsmoGawACfIWAD8GkmxhCYmlGazBAAAAPCWXR+orJiAAAAAElFTkSuQmCC) no-repeat;
            background-size: 100% 100%;
          }
        }
      }
      &:deep(.roi-search) {
        flex-grow: 1;
        .van-search {
          padding: 0;
          .van-search__content {
            background-color: @fill-1;
            input {
              &::-webkit-input-placeholder {
                color: @text-3;
              }
            }
          }
        }
      }
    }
    .pos-now {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 15px;
      margin: 15px 0;
      .pos-left {
        font-size: 16px;
        color: #333;
        .pos {
          display: inline-block;
          vertical-align: bottom;
          max-width: 1.8rem;
        }
      }
      .pos-right {
        font-size: 14px;
        color: @yellow-6;
      }
    }
    .nearby-explore {
      .explore-list {
        min-height: 280px;
      }
    }
  }
</style>
