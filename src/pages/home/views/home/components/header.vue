<template>
  <div class="self-header">
    <section class="pos-text">
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

  const brandMain = 'rgb(2, 182, 253)'
  const constData = reactive({
    isPosing: true,
    pos: ''
  })

  const getPos = () => {
    getPosByTX().then(data => {
      const { city, district, addr } = data
      constData.pos = city + district + addr
    }).finally(() => {
      constData.isPosing = false
    })
  }

  const toGlobalSearchPage = () => {
    console.log('跳转商品/商铺搜索页面')
  }

  onMounted (() => {
    getPos()
  });
</script>

<style lang="less" scoped>
  .self-header {
    background-color: @brand1-6;
    .pos-text {
      padding: var(--van-search-padding);
      padding-bottom: 0;
      color: #fff;
      font-size: 14px;
      min-height: 16px;
      display: flex;
      align-items: center;
      .location-icon {
        padding-right: 4px;
        font-size: 16px;
      }
    }
  }
</style>
