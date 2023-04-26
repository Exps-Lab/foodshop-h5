<template>
  <div class="main-content">
    <MainHeader />
    <KingKongSuggest />
    <ComList :filter="ComListFilter" />
    <FooterBeian />
  </div>
  <Tabbar :active="0" />
</template>

<script setup>
import MainHeader from './components/header.vue'
import Tabbar from '@common/components/Tab_Bar/index.vue'
import KingKongSuggest from './components/king_kong_suggest.vue'
import FooterBeian from './components/footer_beian.vue'
import ComList from '@common/components/Com_List/index.vue'

const ComListFilter = {
  distance: 1
}
</script>

<style lang="less" scoped>
  .main-content {
    background-color: rgb(245, 245, 246);
    padding-bottom: 60px;
  }
</style>
