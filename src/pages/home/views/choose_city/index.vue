<template>
  <section class="city-header">
    <p class="now-city">
      <van-icon class="location-icon font-bold-weight" name="location-o" />
      当前定位城市<span class="yellow font-bold-weight">{{route.query.city}}</span>
    </p>
    <p class="back" @click="backToRoiPage('')">取消</p>
  </section>
  <section class="hot-city-box">
    <p class="list-box__header yellow">热门城市</p>
    <section class="city-list">
      <p class="city-item" v-for="(city, index) in city.hotList" :key="index" @click="choseCity(city)">{{city.name}}</p>
    </section>
  </section>
  <van-index-bar class="index-bar-box" :index-list="city.keyGroup" :sticky="false" highlight-color="#ffb000" v-loading="city.loading">
    <section v-for="(cities, cityKey) in city.list" :key="cityKey">
      <van-index-anchor :index="cityKey">{{cityKey}}</van-index-anchor>
      <van-cell v-for="(item, index) in cities" :key="index" :title="item.name" @click="choseCity(item)" />
    </section>
  </van-index-bar>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getAllCity } from '@api/home'

const router = useRouter()
const route = useRoute()
const city = reactive({
  loading: false,
  keyGroup: [],
  hotList: [],
  list: {}
})
const getCities = async () => {
  city.loading = true
  const { data } = await getAllCity()
  // 取出A-Z的城市数据
  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i)
    if (data[letter]) {
      city.keyGroup.push(letter)
      city.list[letter] = data[letter]
    }
  }
  // 取出热门城市数据
  city.hotList = data.hotCities
  city.loading = false
}

const choseCity = (city) => {
  const { name } = city
  backToRoiPage(name)
}

const backToRoiPage = (city_name) => {
  const { city, from } = route.query || {}
  const query = {
    city_name: city_name || city
  }
  from && (query.from = from)
  router.push({
    path: '/roiPicker',
    query
  })
}

const init = async () => {
  await getCities()
}
init()
</script>

<style lang="less" scoped>
  .city-header {
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: #fff;
    border-bottom: 1px solid @line-1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 10px;
    font-size: 15px;
    margin-bottom: 10px;
    .now-city {
      display: flex;
      align-items: center;
      .yellow {
        margin-left: 6px;
        color: @yellow-6;
      }
    }
    .back {
      color: @text-3;
    }
  }
  .hot-city-box {
    .city-list {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      padding: 15px;
      min-height: 75px;
      .city-item {
        color: @text-4;
        flex-basis: 23%;
        padding: 10px 0;
        margin-bottom: 7px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: @fill-3;
      }
    }
  }
  .index-bar-box {
    &:deep(.van-index-anchor) {
      padding-right: 20px;
      background-color: @fill-2;
    }
  }
</style>
