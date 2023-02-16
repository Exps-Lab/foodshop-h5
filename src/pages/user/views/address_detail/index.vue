<template>
  <section class="main">
    <section class="map-box">
      <ShowPosInMap :mapSetting="mapSetting" :markerSetting="markerSetting" />
    </section>
  </section>
</template>

<script setup>
  import ShowPosInMap from '@components/Show_Pos_in_Map/index.vue'
  const mapSetting = {
    showControl: false,
    draggable: false,
    scrollable: false,
    doubleClickZoom: false
  }
  const markerSetting = {
    width: 10,
    height: 15
  }
</script>

<style lang="less" scoped>
  .main {
    min-height: 100vh;
    background: var(--van-gray-1);
    .map-box {
      height: 120px;
    }
  }
</style>
