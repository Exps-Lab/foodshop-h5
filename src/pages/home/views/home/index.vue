<template>
  <div class="main-content">
    <MainHeader />
    <KingKongSuggest />
    <SuggestList :filter="suggestListFilter" />
    <FooterBeian />
  </div>
  <Tabbar />
</template>

<script setup>
import MainHeader from './components/header.vue'
import Tabbar from './components/tabbar.vue'
import KingKongSuggest from './components/king_kong_suggest.vue'
import FooterBeian from './components/footer_beian.vue'
import SuggestList from '@common/components/Suggest_List/index.vue'

const suggestListFilter = {
  distance: 1
}
</script>

<style lang="less" scoped>
  .main-content {
    background-color: rgb(245, 245, 246);
    padding-bottom: 60px;
  }
</style>
