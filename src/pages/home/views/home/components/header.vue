<template>
  <div class="self-header">
    <section :class="['pos-text', constData.minsizePos && 'minsize']" @click="toPOIPickerPage">
      <van-icon class="location-icon font-bold-weight" name="location-o" />
      <span class="font-bold-weight" v-if="constData.isPosing">定位中...</span>
      <span class="font-bold-weight" v-else>{{constData.pos}} ></span>
    </section>
    <van-search
      readonly
      shape="round"
      :background="brandMain"
      placeholder="请输入商家或商品名称"
      @focus="toGlobalSearchPage"/>
  </div>
</template>

<script setup>
  import { getPosByTX } from '@utils/getAccuratePos'
  import { reactive, onMounted } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const brandMain = 'rgb(2, 182, 253)'
  const constData = reactive({
    isPosing: true,
    pos: '',
    minsizePos: false
  })

  const getPos = () => {
    getPosByTX().then(data => {
      const { district, addr } = data
      constData.pos = addr || district
    }).finally(() => {
      constData.isPosing = false
    })
  }

  const toGlobalSearchPage = () => {
    console.log('跳转商品/商铺搜索页面')
  }

  const handleScroll = () => {
    window.addEventListener('scroll', (e) => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      constData.minsizePos = scrollTop > 5
    })
  }

  const toPOIPickerPage = () => {
    router.push({
      path: "/roiPicker"
    })
  }

  onMounted (() => {
    getPos()
    handleScroll()
  });
</script>

<style lang="less" scoped>
  .self-header {
    background-color: @brand1-6;
    position: sticky;
    top: 0;
    z-index: 1;
    width: 100%;
    .pos-text {
      padding: var(--van-search-padding);
      padding-bottom: 0;
      color: #fff;
      font-size: 14px;
      height: 16px;
      display: flex;
      align-items: center;
      overflow: hidden;
      transition: all 0.2s ease-in-out;
      &.minsize {
        height: 0;
        padding: 0;
      }
      .location-icon {
        padding-right: 4px;
        font-size: 16px;
      }
    }
  }
</style>
