<template>
  <div class="main-content">
    <MainHeader @getFirstPos="getFirstPos"/>
    <KingKongSuggest />
    <SuggestList :filter="suggestListFilter" :firstPosStr="firstPosStr"/>
    <FooterBeian />
  </div>
  <Tabbar :active="0" />
</template>

<script setup>
import { ref } from 'vue'
import MainHeader from './components/header.vue'
import Tabbar from '@common/components/Tab_Bar/index.vue'
import KingKongSuggest from './components/king_kong_suggest.vue'
import FooterBeian from './components/footer_beian.vue'
import SuggestList from '@common/components/Suggest_List/index.vue'

const suggestListFilter = {
  distance: 1
}
const firstPosStr = ref('')
const getFirstPos = ({ lat, lng }) => {
  firstPosStr.value = `${lat},${lng}`
  console.log(firstPosStr.value)
}
</script>

<style lang="less" scoped>
  .main-content {
    background-color: rgb(245, 245, 246);
    padding-bottom: 60px;
  }
</style>
