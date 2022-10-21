<template>
  <div class="main-content">
    <MainHeader />
    <KingKongSuggest />
    <SuggestList />
    <Tabbar />
  </div>
</template>

<script setup>
  import { Toast } from 'vant'
  import { searchWithRange } from '@api/pos'
  import { getGlobalSearch } from '@api/home'
  import { reactive, onMounted } from 'vue'
  import MainHeader from './components/header.vue'
  import Tabbar from './components/tabbar.vue'
  import SuggestList from './components/suggest-list.vue'
  import KingKongSuggest from './components/king-kong-suggest.vue'

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

  const globalSearch = () => {
    getGlobalSearch({
      name: '广场',
      current_pos: '39.929986, 116.503839'
    }).then(data => {
      console.log(data)
    }).catch((err) => {
      console.log(err)
    })
  }

  onMounted (() => {
    searchPlace()
    globalSearch()
  });
</script>
 
<style lang="less" scoped>
  .main-content {
    background-color: rgb(245, 245, 246);
  }
</style>
