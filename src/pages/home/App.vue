<template>
  <div class="container">
    <div class="self-header">
      <section class="pos-text">
        <span v-if="constData.isPosing">定位中...</span>
        <section v-else>
          <span>当前定位：</span>
          <span>{{constData.pos}}</span>
        </section>
      </section>

    </div>
    <van-tabbar v-model="constData.active">
      <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="label-o">订单</van-tabbar-item>
      <van-tabbar-item icon="friends-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
  import { Toast } from 'vant'
  import { getPosByTX } from '@utils/getAccuratePos'
  import { searchWithRange } from '@api/pos'
  import { reactive, onMounted } from 'vue'

  const constData = reactive({
    active: 0,
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

  const searchPlace = () => {
    searchWithRange({
      city_name: '北京',
      keyword: '十里堡北区',
      current_pos: '39.929986, 116.503839'
    }).then(data => {
      console.log(data)
    }).catch((err) => {
      console.log(err)
    })
  }

  onMounted (() => {
    getPos()
    searchPlace()
  });
</script>
 
<style lang="less" scoped>
  .self-header {

  }
</style>
