<template>
  <div class="container">
    <MainHeader />
    <KingKongSuggest />
    <van-tabbar v-model="constData.active">
      <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="label-o">订单</van-tabbar-item>
      <van-tabbar-item icon="friends-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
  import { Toast } from 'vant'
  import { searchWithRange } from '@api/pos'
  import { getShopList, getGlobalSearch } from '@api/home'
  import { reactive, onMounted } from 'vue'
  import MainHeader from './components/header.vue'
  import KingKongSuggest from './components/king-kong-suggest.vue'

  const constData = reactive({
    active: 0,
  })

  const searchPlace = () => {
    searchWithRange({
      city_name: '北京',
      keyword: '十里堡',
      current_pos: '39.929986, 116.503839'
    }).then(data => {
      console.log(data)
    }).catch((err) => {
      console.log(err)
    })
  }

  const shopList = () => {
    getShopList({
      current_pos: '39.929986, 116.503839'
    }).then(data => {
      console.log(data)
    }).catch((err) => {
      console.log(err)
    })
  }

  const globalSearch = () => {
    getGlobalSearch({
      name: '店',
      current_pos: '39.929986, 116.503839'
    }).then(data => {
      console.log(data)
    }).catch((err) => {
      console.log(err)
    })
  }

  onMounted (() => {
    searchPlace()
    shopList()
    // globalSearch()
  });
</script>
 
<style lang="less" scoped>
</style>
