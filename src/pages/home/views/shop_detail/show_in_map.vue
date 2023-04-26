<template>
  <section class="map-box">
    <ShowPosInMap :posStr="shopPos" />
  </section>
  <section class="info-box">
    <p class="title font-bold-weight">{{shop_name}}</p>
    <p class="address">{{shop_address}}</p>
  </section>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'
  import ShowPosInMap from '@components/Show_Pos_in_Map/index.vue'

  const route = useRoute()
  const { shop_pos, shop_name, shop_address } = route.query
  const shopPos = ref(shop_pos)
</script>

<style lang="less" scoped>
  .map-box {
    height: 100vh;
  }
  .info-box {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1001;
    width: 100%;
    background-color: @fill-1;
    border-radius: 10px 10px 0 0;
    padding: 20px 20px 50px;
    box-sizing: border-box;
    .title {
      font-size: 16px;
      line-height: 1.2;
      margin-bottom: 10px;
    }
    .address {
      font-size: 13px;
      color: @text-3;
      line-height: 1.2;
    }
  }
</style>
